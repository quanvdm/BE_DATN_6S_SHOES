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