import Product_Group from "../model/product_group";
import slugify from "slugify";
import { GroupAddSchema } from "../schema/product_group";

export const createProductGroup = async (req, res) => {
  const { group_name } = req.body;
  const formData = req.body;

  try {
    const normalizedProductGroupName = group_name.toLowerCase();
    const checkName = await Product_Group.findOne({
      group_name: normalizedProductGroupName,
    });
    if (checkName) {
      return res.status(400).json({
        message:
          "Tên nhóm sản phẩm Bị Trùng Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }

    // validate
    const { error } = GroupAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(group_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const datagroup = {
      ...formData,
      slug: uniqueSlug,
    };

    const productGroup = await Product_Group.create(datagroup);
    if (!productGroup || productGroup.length === 0) {
      return res.status(400).json({
        message: "Thêm nhóm sản phẩm thất bại",
      });
    }

    // cập nhật lại slug
    productGroup.slug = uniqueSlug;
    await productGroup.save();

    return res.json({
      message: "Thêm nhóm sản phẩm thành công",
      productGroup,
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
    const existingProduct_Group = await Product_Group.findOne({
      slug: uniqueSlug,
    });
    if (!existingProduct_Group) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const getProductGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const productGroup = await Product_Group.findById(id);

    if (!productGroup) {
      return res.status(404).json({
        message: `Không tìm thấy nhóm sản phẩm có ID ${id}`,
      });
    }

    return res.status(200).json({
      message: `Lấy thông tin nhóm sản phẩm theo ID ${id} thành công`,
      productGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getProductGroupBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const productGroup = await Product_Group.findOne({ slug });

    if (!productGroup) {
      return res.status(404).json({
        message: `Không tìm thấy nhóm sản phẩm với slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Lấy thông tin nhóm sản phẩm theo slug ${slug} thành công`,
      productGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};