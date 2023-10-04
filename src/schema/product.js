import Joi from "joi";

export const ProductAddSchema = Joi.object({
  product_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Trường tên sản phẩm là bắt buộc",
  }),
  product_code: Joi.string().max(55).required().messages({
    "string.empty": "Code không được để trống",
    "any.required": "Trường code là bắt buộc"
  }),
  product_image: Joi.array(),
  product_description_short: Joi.string(),
  product_description_long: Joi.string(),
  product_view: Joi.number(),
  favorite_id: Joi.string(),
  category_id: Joi.string().required().messages({
    "string.empty": "Danh mục sản phẩm bắt buộc nhập",
    "any.required": "Trường danh mục sản phẩm bắt buộc nhập",
    "string.base": "Danh mục sản phẩm phải là chuỗi"
    }),
  group_id: Joi.string(),
  variant_products: Joi.array(),
  brand_id: Joi.string().required().messages({
    "string.empty": "Thương hiệu bắt buộc nhập",
    "any.required": "Trường thương hiệu bắt buộc nhập",
    "string.base": "Thương hiệu sản phẩm phải là chuỗi"
    }),
});