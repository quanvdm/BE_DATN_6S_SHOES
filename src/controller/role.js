import Role from "../model/role";
import slugify from "slugify";
import { RoleAddSchema, RoleUpdateSchema } from "../schema/role";
import _ from "lodash";

export const createRole = async (req, res) => {
  const { role_name } = req.body;
  const formData = req.body;

  try {
    const checkName = await Role.findOne({ role_name });
    if (checkName) {
      return res.status(400).json({
        message: "phân quyền đã tồn tại",
      });
    }

    // validate
    const { error } = RoleAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(role_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataRole = {
      ...formData,
      slug: uniqueSlug,
    };

    const role = await Role.create(dataRole);
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Thêm phân quyền thất bại",
      });
    }

    // cập nhật lại slug
    role.slug = uniqueSlug;
    await role.save();

    return res.json({
      message: "Thêm phân quyền thành công",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const idRole = await Role.findById(req.params.id);
    if (!idRole || idRole.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin quyền",
      });
    }

    const checkName = await Role.findOne({ role_name: req.body.role_name });
    if (checkName) {
      return res.status(400).json({
        message: "Quyền đã tồn tại",
      });
    }

    const { error } = RoleUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: errorMessages,
      });
    }

    // Slug
    const slug = slugify(req.body.role_name, { lower: true });

    let uniqueSlug = await createUniqueSlug(slug);

    const dataRole = _.merge(req.body, { slug: uniqueSlug });

    const role = await Role.findByIdAndUpdate(req.params.id, dataRole, {
      new: true,
    });

    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Cập nhật quyền thất bại",
      });
    }

    return res.status(200).json({ message: "Sửa quyền thành công", role });
  } catch (error) {
    return res.status(200).json({
      message: error.message || "Lỗi server",
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingRole = await Role.findOne({ slug: uniqueSlug });
    if (!existingRole) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const getRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findById(id);
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy phân quyền !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu phân quyền theo id : ${id} thành công !`,
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getRoleBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const role = await Role.findOne({ slug });
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: `Không tìm được dữ liệu phân quyền slug :${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dự liệu thành công bởi slug: ${slug} `,
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getAllRole = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;
  const options = {
    page: _page || 1,
    limit: _limit || 10,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
  };
  try {
    const roles = await Role.paginate({}, options);
    if (!roles || roles.length === 0) {
      return res.status(400).json({
        message: "Không có quyền nào",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách quyền thành công",
      role: roles.docs,
      pagination: {
        currentPage: roles.page,
        totalPages: roles.totalPages,
        totalItems: roles.totalDocs,
        limit: roles.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const removeRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({ _id: id });
    if (!role) {
      return res.status(400).json({
        message: "Không tìm thấy quyền",
      });
    }

    // Xóa quyền
    const deleteRole = await Role.findByIdAndDelete(id);
    if (!deleteRole) {
      return res.status(400).json({
        message: "Xóa quyền không thành công",
      });
    }

    return res.status(200).json({
      message: "Xóa quyền thành công",
      deleteRole,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
