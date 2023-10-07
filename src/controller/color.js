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
