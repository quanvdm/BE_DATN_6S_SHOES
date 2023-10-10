import Joi from "joi";

export const ColorAddSchema = Joi.object({
  color_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên màu không được để trống",
    "any.required": "Trường tên màu là bắt buộc",
  }),
  color_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả màu không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả màu không được vượt quá {#limit} ký tự",
  }),
  color_image: Joi.object(),
  variant_products: Joi.array(),
  color_code: Joi.string(),
  product_count: Joi.number()
});
export const colorUpdateSchema = Joi.object({
  _id: Joi.string(),
  color_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên màu sắc không được để trống",
    "any.required": "Trường tên màu sắc là bắt buộc",
    "string.max": "Mô tả màu sắc không được vượt quá {#limit} ký tự",
  }),
  color_description: Joi.string().min(3).max(255).messages({
    "string.min": "Mô tả màu sắc không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả màu sắc không được vượt quá {#limit} ký tự",
  }),
  color_code: Joi.string().max(50),
  color_image: Joi.object().required().messages({
    "string.empty": "Ảnh màu sắc không được để trống",
  }),
  color_is_featured: Joi.boolean(),
  color_is_new: Joi.boolean(),
  slug: Joi.string(),
  products: Joi.array(),
  createAt: Joi.date(),
  updateAt: Joi.date(),
});