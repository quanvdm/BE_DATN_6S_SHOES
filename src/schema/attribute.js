import Joi from "joi";
export const AttributeAddSchema = Joi.object({
  attribute_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên thuộc tính không được để trống",
    "string.max": "Mô tả thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
  attribute_value: Joi.string().max(50).required().messages({
    "string.empty": "Tên thuộc tính không được để trống",
    "string.max": "Mô tả thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
});
