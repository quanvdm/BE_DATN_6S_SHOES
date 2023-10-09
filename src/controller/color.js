import Color from "../model/color";
import Product from "../model/product";
import slugify from "slugify";
import { ColorAddSchema } from './../schema/color';

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingColor = await Color.findOne({ slug: uniqueSlug });
    if (!existingColor) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const createColor = async (req, res) => {
  const { color_name } = req.body;
  const formData = req.body;
  try {
    const checkName = await Color.findOne({ color_name });
    if (checkName) {
      return res.status(400).json({
        message: "Màu đã tồn tại",
      });
    }

    // validate
    const { error } = ColorAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(color_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataColor = {
      ...formData,
      slug: uniqueSlug,
    };

    const color = await Color.create(dataColor);
    if (!color || color.length === 0) {
      return res.status(400).json({
        message: "Thêm màu thất bại",
      });
    }
    
    color.product_count = color.variant_products.length;
    console.log(color.product_count);

    // cập nhật lại slug
    color.slug = uniqueSlug;
    await color.save();

    return res.json({
      message: "Thêm màu thành công",
      color,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);

    if (!color) {
      return res.status(404).json({
        message: `Không tìm thấy màu sắc có ID ${id}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin màu sắc có ID ${id}`,
      color,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getColorBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const color = await Color.findOne({ slug });

    if (!color) {
      return res.status(404).json({
        message: `Không tìm thấy màu sắc có Slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin màu sắc có Slug ${slug}`,
      color,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
export const getAllColor = async (req, res) => {
  try {
    const colors = await Color.find({}); // Lấy tất cả các màu

    if (!colors || colors.length === 0) {
      return res.status(400).json({
        message: "Danh sách màu trống!",
      });
    }

    const colorsWithCounts = colors.map((item) => ({
      ...item.toObject(),
      product_count: item.products ? item.products.length : 0,
    }));

    return res.status(200).json({
      message: "Lấy danh sách màu thành công",
      colors: colorsWithCounts,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteColorById = async (req, res) => {
  const id = req.params.id;
  try {
    const color = await Color.findById({ _id: id });
    if (!color) {
      return res.status(404).json({
        message: "Không tìm thấy giá trị color!",
      });
    }

    const DeleteColor = await Color.findByIdAndDelete({ _id: id });
    if (!DeleteColor) {
      return res.status(404).json({
        message: "Xóa màu không thành công!",
      });
    }
    return res.status(200).json({
      message: `Xóa màu ${color.color_name} thành công!`,
      DeleteColor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ!",
    });
  }
};

export const deleteColorBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const color = await Color.findOne({ slug: slug });
    if (!color) {
      return res.status(404).json({
        message: "Không tìm thấy giá trị color!",
      });
    }

    const DeleteColor = await Color.findOneAndDelete({ slug: slug });
    if (!DeleteColor) {
      return res.status(404).json({
        message: "Xóa màu không thành công!",
      });
    }
    return res.status(200).json({
      message: `Xóa màu ${slug} thành công!`,
      DeleteColor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ!",
    });
  }
};