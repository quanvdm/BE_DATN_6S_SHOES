import Joi from "joi";
export const AttributeAddSchema = Joi.object({
  attribute_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên thuộc tính không được để trống",
    "string.max": "Mô tả thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
  attribute_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả thuộc tính không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả thuộc tính không được vượt quá {#limit} ký tự",
    "string.empty": "Mô tả thuộc tính không được để trống",
  }),
});
