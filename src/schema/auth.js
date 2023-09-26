import joi from "joi";

export const signinSchema = joi.object({
    user_email : joi.string().email().required().messages({
        "string.email": "Email không đúng định dạng",
        "string.empty": "Email không được để trống",
        "any.required": " Trường email là bắt buộc"
    }),
    user_password : joi.string().required().min(5).messages({
        "string.min": "Password phải có ít nhất {#limit} ký tự",
        "string.empty": "Password không được để trống",
        "any.required": "Trường Password là bắt buộc",
    }),
})
