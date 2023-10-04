import Joi from "joi";

export const GroupAddSchema = Joi.object({
  group_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên nhóm sản phẩm không được để trống",
    "any.required": "Trường tên nhóm sản phẩm là bắt buộc",
  }),
  group_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả nhóm sản phẩm không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả nhóm sản phẩm không được vượt quá {#limit} ký tự",
  }),
  products: Joi.array(),
});


export const updateProductGroupSchema = Joi.object({
  _id: Joi.string(),
  group_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên nhóm sản phẩm không được để trống",
    "any.required": "Trường tên nhóm sản phẩm là bắt buộc",
    "string.max": "Mô tả nhóm sản phẩm không được vượt quá {#limit} ký tự",
  }),
  group_is_new: Joi.boolean(),
  group_status: Joi.boolean(),
  group_description: Joi.string().min(2).max(255).messages({
    "string.min": "Mô tả nhóm sản phẩm không được nhỏ hơn {#limit} ký tự",
    "string.max": "Mô tả nhóm sản phẩm không được vượt quá {#limit} ký tự",
  }),
  products: Joi.array(),
  display_order: Joi.number(),
  slug: Joi.string(),
  createAt: Joi.date(),
  updateAt: Joi.date(),
});