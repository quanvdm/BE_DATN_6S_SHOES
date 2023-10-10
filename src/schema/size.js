import Joi from "joi";
export const SizeAddSchema = Joi.object({
    size_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên giá trị size không được để trống",
    "string.max": "Tên giá trị size không được vượt quá {#limit} ký tự",
    "any.required": "Tên giá trị size là bắt buộc",
  }),
  size_description: Joi.string().min(5).max(255).required().messages({
    "string.min": "Tên giá trị size không được nhỏ hơn 5 ký tự",
    "string.max": "Tên giá trị size không được vượt quá 255 ký tự",
    "any.required": "Tên giá trị size là bắt buộc",
    "string.empty": "Tên giá trị size không được để trống",
  }),
  variant_product:Joi.array(),
  size_is_new: Joi.boolean(),
  size_code: Joi.string().min(10).max(55).required().messages({
    "string.min": "Mã code size không được nhỏ hơn 10 ký tự",
    "string.max": "Mã code size không được vượt quá 55 ký tự",
    "any.required": "Mã code size là bắt buộc",
    "string.empty": "Mã code size size không được để trống",
  }),
  slug: Joi.string()
});


export const updateSizeSchema = Joi.object({
  _id: Joi.string(),
  size_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên kích cỡ không được để trống",
    "any.required": "Trường tên kích cỡ là bắt buộc",
  }),
  size_is_new: Joi.boolean(),
  size_image: Joi.object(),
  size_code: Joi.string(),
  size_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả kích cỡ không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả kích cỡ không được vượt quá {#limit} ký tự",
  }),
  variant_products: Joi.array(),
  product_count: Joi.number(),
  slug: Joi.string(),
  createAt: Joi.date(),
  updateAt: Joi.date(),
});