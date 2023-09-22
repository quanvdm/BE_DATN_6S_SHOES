import joi from "joi";
const vietnamesePhoneNumberRegex = /^(0[2-9])+([0-9]{8})$/;

export const createUserSchema = joi.object({
  user_fullname: joi.string().max(55).required(),
  user_username: joi.string().max(55).required(),
  user_avatar: joi.object(),
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
  user_phone: joi
    .string()
    .pattern(vietnamesePhoneNumberRegex, "Vietnamese Phone Number")
    .required(),
  user_address: joi.string(),
  user_gender: joi.string(),
  user_date_of_birth: joi.date(),
  role_id: joi.string(),
});
