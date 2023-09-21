import Role from "../model/role";
import slugify from "slugify";
import { RoleAddSchema } from "../schema/role";

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

export const getRoleById = async (req, res) =>{
  const id = req.params.id;
  try {
    const role = await Role.findById(id)
    if(!role || role.length === 0){
      return res.status(400).json({
        message: "Không tìm thấy phân quyền !"
      });
    }
    return res.status(200).json({
      message:  ` Lấy dữ liệu phân quyền theo id : ${id} thành công !`,
      role,
    })    
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :(("
    })
  }
}

export const getRoleBySlug = async (req , res ) =>{
  const slug = req.params.slug;
try {
  const role = await Role.findOne({slug})
  if(!role || role.length === 0 ){
    return res.status(400).json({
      message: `Không tìm được dữ liệu phân quyền slug :${slug}`,
    })
  }
  return res.status(200).json({
    message: `Lấy dự liệu thành công bởi slug: ${slug} `,
    role,
  })

} catch (error) {
  return res.status(500).json({
    message: error.message || "error server :(("
  })
}
}


export const getAllRole = async (req, res) => {
  try {
    const role = await Role.find({});
    if (!role || role.length === 0) {
      return res.json({
        message: "Không có quyền nào",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách quyền thành công",
      role,
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