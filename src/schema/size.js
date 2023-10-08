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
