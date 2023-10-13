import Joi from "joi";

export const CouponSchema = Joi.object({
  coupon_name: Joi.string().required().messages({
    "string.empty": "Tên mã giảm giá bắt buộc nhập",
    "any.required": "Trường tên mã giảm giá bắt buộc nhập",
  }),
  coupon_code: Joi.string().required().min(10).max(30).messages({
    "string.empty": "Code giảm giá bắt buộc nhập",
    "any.required": "Trường code giảm giá bắt buộc nhập",
    "string.min": "Code không được nhỏ hơn 10 ký tự",
    "string.max": "Code không được vượt quá {#limit} ký tự",
  }),
  coupon_content: Joi.string().required().messages({
    "string.empty": "Nội dung mã giảm giá bắt buộc nhập",
    "any.required": "Trường nội dung mã giảm giá bắt buộc nhập",
  }),
  coupon_quantity: Joi.number().min(0).required().messages({
    "number.empty": "Số lượng mã giảm giá bắt buộc nhập",
    "any.required": "Trường số lượng mã giảm giá bắt buộc nhập",
    "number.base": "Số lượng mã giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
  discount_amount: Joi.number().min(0).required().messages({
    "number.empty": "Số tiền giảm giá bắt buộc nhập",
    "any.required": "Trường số tiền giảm giá bắt buộc nhập",
    "number.base": "Số tiền giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
  expiration_date: Joi.date().required().messages({
    "any.required": "Ngày hết hạn mã giảm giá bắt buộc nhập",
  }),
  min_purchase_amount: Joi.number().min(0).required().messages({
    "any.required": "điều kiều giá được giảm  mua sản phẩm đang trống ",
    "number.base": "Tổng số tiền để được áp dụng phiếu giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
});

export const updateCouponSchema = Joi.object({
  _id: Joi.string(),
  coupon_name: Joi.string().required().messages({
    "string.empty": "Tên mã giảm giá bắt buộc nhập",
    "any.required": "Trường tên mã giảm giá bắt buộc nhập",
  }),
  coupon_code: Joi.string().required().min(10).max(30).messages({
    "string.empty": "Code giảm giá bắt buộc nhập",
    "any.required": "Trường code giảm giá bắt buộc nhập",
    "string.min": "Code không được nhỏ hơn 10 ký tự",
    "string.max": "Code không được vượt quá {#limit} ký tự",
  }),
  coupon_content: Joi.string().required().messages({
    "string.empty": "Nội dung mã giảm giá bắt buộc nhập",
    "any.required": "Trường nội dung mã giảm giá bắt buộc nhập",
  }),
  coupon_quantity: Joi.number().min(0).required().messages({
    "number.empty": "Số lượng mã giảm giá bắt buộc nhập",
    "any.required": "Trường số lượng mã giảm giá bắt buộc nhập",
    "number.base": "Số lượng mã giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
  discount_amount: Joi.number().min(0).required().messages({
    "number.empty": "Số tiền giảm giá bắt buộc nhập",
    "any.required": "Trường số tiền giảm giá bắt buộc nhập",
    "number.base": "Số tiền giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
  expiration_date: Joi.date().required().messages({
    "any.required": "Ngày hết hạn mã giảm giá bắt buộc nhập",
  }),
  min_purchase_amount: Joi.number().min(0).required().messages({
    "any.required": "điều kiều giá được giảm  mua sản phẩm đang trống ",
    "number.base": "Tổng số tiền để được áp dụng phiếu giảm giá phải là số",
    "number.min": "Không được nhập số âm",
  }),
  createAt: Joi.date(),
  updateAt: Joi.date()
});