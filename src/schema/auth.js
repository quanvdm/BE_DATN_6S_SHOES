import joi from "joi";

export const signinSchema = joi.object({
  user_email: joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
    "any.required": " Trường email là bắt buộc",
  }),
  user_password: joi.string().required().min(5).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự",
    "string.empty": "Password không được để trống",
    "any.required": "Trường Password là bắt buộc",
  }),
});

export const signupSchema = joi.object({
  user_fullname: joi.string().max(55).required().messages({
    "string.max": "Họ và tên không được vượt quá {#limit} ký tự",
    "string.empty": "Họ và tên không được để trống",
    "any.required": "Trường họ và tên là bắt buộc",
  }),
  user_username: joi.string().max(55).required().messages({
    "string.max": "Tên đăng nhập không được vượt quá {#limit} ký tự",
    "string.empty": "Tên đăng nhập không được để trống",
    "any.required": "Trường Tên đăng nhập là bắt buộc",
  }),
  user_email: joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
  }),
  user_password: joi.string().required().min(6).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự",
    "string.empty": "Password không được để trống",
    "any.required": "Trường Password là bắt buộc",
  }),
  user_confirmPassword: joi
    .string()
    .valid(joi.ref("user_password"))
    .required()
    .messages({
      "any.only": "Password không khớp",
      "any.required": "Trường confirm password là bắt buộc",
    }),
});
