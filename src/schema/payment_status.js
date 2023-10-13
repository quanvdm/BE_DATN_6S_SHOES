import Joi from "joi";

export const pStatusAddSchema = Joi.object({
  pStatus_name: Joi.string().min(3).max(55).required().messages({
    "string.empty": "Tên trạng thái không được để trống",
    "any.required": "Trường tên trạng thái là bắt buộc",
  }),
  pStatus_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả trạng thái không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả trạng thái không được vượt quá {#limit} ký tự",
  }),
  pStatus_image: Joi.object(),
  status: Joi.boolean()
});