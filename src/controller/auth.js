import User from "../model/user";
import bcrypt from "bcryptjs";
import {
  changePasswordSchema,
  signinSchema,
  signupSchema,
} from "../schema/auth";
import { generalAccessToken, generalRefreshToken } from "../service/jwtService";
import jwt from "jsonwebtoken";
import cron from "node-cron";
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
    if (
      user.user_password !== undefined &&
      typeof user.user_password === "string"
    ) {
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
        role_id: user.role_id,
      });
      const refreshToken = generalRefreshToken({
        _id: user._id,
        role_id: user.role_id,
      });
      //lưu refeshToken  vào cookie
      // await User.findByIdAndUpdate(user._id,{refreshToken: refreshToken}, {new: true})
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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
};

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
};

export const requestRefreshToken = async (req, res) => {
  // lấy refresh Token từ người người dùng
  try {
    const refesh_Token = req.cookies.refreshToken;
    if (!refesh_Token) {
      return res.status(400).json({
        message: "bạn chưa đăng nhập (you're not authenticated) ",
      });
    }
    console.log(refesh_Token);

    jwt.verify(refesh_Token, process.env.jWT_SECRET_KEY, (err, decode) => {
      console.log("info", decode);
      if (err) {
        return res.status(400).json({
          message: "Token error",
        });
      }
      const { _id, role_id } = decode;
      // refreshToken mới và access token mới
      const newAccessToken = generalAccessToken({ _id, role_id });
      const newRefreshToken = generalRefreshToken({ _id, role_id });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || " error server :((",
    });
  }
};

// REGISTER

export const register = async (req, res) => {
  const {
    user_email,
    user_password,
    user_fullname,
    user_username,
    user_confirmPassword,
  } = req.body;
  const formData = req.body;
  try {
    // VALIDATE
    const { error } = signupSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const userEmailExist = await User.findOne({ user_email });
    if (userEmailExist) {
      return res.status(400).json({
        message: "Email người dùng đã tồn tại",
      });
    }

    const usernameExist = await User.findOne({ user_username });
    if (usernameExist) {
      return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    const formRequest = {
      user_email,
      user_password,
      user_username,
      user_fullname,
      user_password: hashPassword,
    };

    const user = await User.create(formRequest);

    const verifyToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    const tokenExpiration = Date.now() + 3 * 24 * 60 * 60 * 1000;

    const verificationLink = `http://localhost:8080/api/users/verify/${verifyToken}`;

    // // GỬI EMAIL ĐẾN ĐỊA CHỈ NGƯỜI DÙNG YÊU CẦU ĐẶT LẠI MẬT KHẨU
    const transporter = nodemailer.createTransport({
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // // GỬI EMAIL VỚI TRANSPORTER ĐÃ ĐƯỢC CONFIG XONG
    const info = await transporter.sendMail({
      from: `"6s Shoes 👟😘" ${process.env.EMAIL_SENDER}`, // sender address
      to: user_email, // list of receivers
      subject: "Xác nhận tài khoản", // Subject line
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Nhấp vào <a href="${verificationLink}">đây</a> để xác nhận tài khoản.</p>`, // html body
    });

    if (!info) {
      return res.status(400).json({
        message:
          "Mã kích hoạt của bạn chưa được gửi đến email. Vui lòng kiểm tra lại <3",
      });
    }

    // //LƯU MÃ VÀO DB, CONLLECTION USER
    user.verifyToken = {
      token: verifyToken,
      expiration: tokenExpiration,
    };
    await user.save();

    return res.status(200).json({
      message:
        "Đăng ký tài khoản thành công. Mã kích hoạt tài khoản của bạn đã được gửi đến email. Vui lòng kiểm tra lại <3",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// Hàm để kiểm tra và xóa tài khoản
const checkAndDeleteAccounts = async () => {
  try {
    const users = await User.find();
    const currentDate = new Date();

    for (const user of users) {
      if (user.verifyToken && user.verifyToken.expiration) {
        const verifyTokenExpiration = new Date(user.verifyToken.expiration);
        const expirationDate = new Date(
          verifyTokenExpiration.getTime() + 3 * 24 * 60 * 60 * 1000
        ); // 2 phút

        if (currentDate > expirationDate && !user.isVerified) {
          await User.findByIdAndDelete(user._id);
          console.log(`Đã xóa tài khoản có ID ${user._id}`);
        }
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Cấu hình cron job để chạy sau mỗi 2 phút
cron.schedule("0 0 * * *", () => {
  checkAndDeleteAccounts();
});

// Change Password
export const changePassword = async (req, res) => {
  const { password, confirmPassword, user_email, new_password } = req.body;

  try {
    const { error } = changePasswordSchema.validate(
      { password, confirmPassword, user_email, new_password },
      {
        abortEarly: false,
      }
    );
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
    if (new_password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu không không khớp nhau!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch)
      return res.status(400).json({
        message: "Mật khẩu không không chính xác!",
      });
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(new_password, saltRounds);
    user.user_password = hashPassword;
    user.save();
    return res.json({ message: "Thay đổi mật khẩu thành công!" });
  } catch (error) {
    return res.status(500).json({
      message: " Error server :(( :" + error.message,
    });
  }
};
