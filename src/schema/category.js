import Joi from "joi";

export const CategoryAddSchema = Joi.object({
  category_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Trường tên danh mục là bắt buộc",
  }),
  category_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả danh mục không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả danh mục không được vượt quá {#limit} ký tự",
  }),
  
  brand_id: Joi.string().required(),
  products: Joi.array().required()
});