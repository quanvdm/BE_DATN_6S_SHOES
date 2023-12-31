import Joi from "joi";
export const BrandAddSchema = Joi.object({
  brand_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên thương hiệu không được để trống",
    "string.max": "Mô tả thương hiệu không được vượt quá {#limit} ký tự",
    "any.required": "Tên thương hiệu là bắt buộc",
  }),
  brand_image: Joi.object().required().messages({
    "any.required": "Trường hình ảnh thương hiệu là bắt buộc",
  }),
  brand_description: Joi.string().min(5).max(255).required().messages({
    "string.min": "Mô tả thương hiệu không được nhỏ hơn 5 ký tự",
    "string.max": "Mô tả thương hiệu không được vượt quá 255 ký tự",
    "any.required": "Trường mô tả thương hiệu là bắt buộc",
    "string.empty": "Mô tả thương hiệu không được để trống",
  }),
});

export const BrandUpdateSchema = Joi.object({
  _id: Joi.string(),
  brand_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên thương hiệu không được để trống",
    "string.max": "Mô tả thương hiệu không được vượt quá {#limit} ký tự",
    "any.required": "Tên thương hiệu là bắt buộc",
  }),
  brand_image: Joi.object().required(),
  brand_description: Joi.string().min(5).max(255).required().messages({
    "string.min": "Mô tả thương hiệu không được nhỏ hơn 5 ký tự",
    "string.max": "Mô tả thương hiệu không được vượt quá 255 ký tự",
    "any.required": "Trường mô tả thương hiệu là bắt buộc",
    "string.empty": "Mô tả thương hiệu không được để trống",
  }),
  brand_is_new: Joi.boolean(),
  brand_status: Joi.boolean(),
  brand_default: Joi.boolean(),
  products: Joi.array(),
  categories: Joi.array(),
  slug: Joi.string(),
  createAt: Joi.date(),
  updateAt: Joi.date(),
  updateAt: Joi.date(),
});
