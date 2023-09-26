import User from "../model/user";
import bcrypt from "bcryptjs";
import { signinSchema } from "../schema/auth"
import { generalAccessToken, generalRefreshToken } from "../service/jwtService";
import jwt, { decode } from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();
export const signin = async (req, res) => {
try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    const { user_email, user_password } = req.body;
    if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({
        message: errors,
    });
    }
    // check email có tồn tại trong DB không 
    const user = await User.findOne({ user_email });
    if (!user) {
    return res.status(400).json({
        message: "Tài khoản không tồn tại",
    });
    }
    //check tài khoản có bị khóa hay không 
    if (user.user_status === false) {
    return res.status(400).json({
        message: "Tài khoản bị khóa",
    });
    }
    //check tài khoản xác thực bằng qua email thì mới đăng nhập được 
    if (user.isVerified === false) {
    return res.status(400).json({
        message: "Bạn hãy kiểm tra và xác thực tài khoản đề đăng nhập nhé ",
    });
    }
    //check kiểu dữ liệu của user trong DB và so sánh password người dùng nhập với passoword trong DB mà người dùng tạo đã lưu vào DB
    if (user.user_password !== undefined && typeof user.user_password === 'string') {
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
        return res.status(400).json({
        message: "Mật khẩu không đúng",
        });
    }
    }
    const checkPass = await bcrypt.compare(user_password, user.user_password);
    if (user && checkPass) {
    const accessToken = generalAccessToken({
        _id: user._id,
        role_id: user.role_id
    });
    const refreshToken = generalRefreshToken({
        _id: user._id,
        role_id: user.role_id
    });
    //lưu refeshToken  vào cookie
    // await User.findByIdAndUpdate(user._id,{refreshToken: refreshToken}, {new: true})
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    //người dùng login thành công thì trả về password = undefinded để tăng tính bảo mật cho người dùng 
    user.user_password = undefined;
    return res.status(200).json({
        message: "Đăng nhập thành công",
        user,
        accessToken,
    });
    }
    

} catch (error) {
    return res.status(500).json({
    message: error.message || " error server :((",
    });
}
}

export const test_token_get_user = async (req, res) => {
const id = req.params.id;
try {
    const user = await User.findById(id);
    if (!user) {
    return res.status(404).json({
        message: "Không tìm thấy tài khoản",
    });
    }
    return res.status(200).json({
    user,
    message: "Lấy dữ liệu người dùng thành công",
    });
} catch (error) {
    return res.status(500).json(error.message);
}
}

export const requestRefreshToken = async (req, res) => {
// lấy refresh Token từ người người dùng  
try {
    const refesh_Token = req.cookies.refreshToken
    if (!refesh_Token ) {
    
    return res.status(400).json({
        message: "bạn chưa đăng nhập (you're not authenticated) ",
    })
    }
    console.log(refesh_Token);
    
    jwt.verify(refesh_Token, process.env.jWT_SECRET_KEY, (err,decode) => {
    console.log("info",decode);
    if (err) {
        return res.status(400).json({
        message: "Token error"

        })
    }
    const {_id, role_id} = decode
    // refreshToken mới và access token mới 
    const newAccessToken = generalAccessToken({_id, role_id})
    const newRefreshToken = generalRefreshToken({_id, role_id})
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ accessToken: newAccessToken })
    })
} catch (error) {
    return res.status(500).json({
    message: error.message || " error server :((",
    });
}
}