import { AttributeAddSchema } from "../schema/attribute";
import Attribute from "../model/attribute";
import slugify from "slugify";

export const getAllAttribute = async (req, res) => {
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
    const attributes = await Attribute.paginate({}, options);
    if (!attributes || attributes.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách thuộc tính",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách thuộc tính thành công",
      attributes: attributes.docs,
      pagination: {
        currentPage: attributes.page,
        totalPages: attributes.totalPages,
        totalItems: attributes.totalDocs,
        limit: attributes.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const removeAttribute = async (req, res) => {
  const { id } = req.params;
  try {
    const attribute = await Attribute.findOne({ _id: id });
    if (!attribute) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin thuộc tính",
      });
    }

    // Xóa quyền
    const deleteAttribute = await Attribute.findByIdAndDelete(id);
    if (!deleteAttribute) {
      return res.status(400).json({
        message: "Xóa thuộc tính không thành công",
      });
    }

    return res.status(200).json({
      message: "Xóa thuộc tính thành công",
      deleteAttribute,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createAtribute = async (req, res) => {
  const { attribute_name, attribute_value } = req.body;
  const formData = req.body;
  try {
    const checkValue = await Attribute.findOne({ attribute_value });
    if (checkValue) {
      return res.status(400).json({
        message: "Giá trị thuộc tính đã tồn tại",
      });
    }

    // validate
    const { error } = AttributeAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(attribute_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataCate = {
      ...formData,
      slug: uniqueSlug,
    };

    const attribute = await Attribute.create(dataCate);
    if (!attribute || attribute.length === 0) {
      return res.status(400).json({
        message: "Thêm thuộc tính thất bại",
      });
    }

    // cập nhật lại slug
    attribute.slug = uniqueSlug;
    await attribute.save();

    return res.json({
      message: "Thêm thuộc tính thành công",
      attribute,
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
    const existingRole = await Attribute.findOne({ slug: uniqueSlug });
    if (!existingRole) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
