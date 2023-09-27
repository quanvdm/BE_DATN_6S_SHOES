import User from "../model/user";
import Role from "../model/role";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
// import cron from "node-cron";
import crypto from "crypto";
import { createUserSchema } from "../schema/user";
dotenv.config();

export const createUserProfile = async (req, res) => {
  const {
    user_email,
    user_password,
    user_fullName,
    user_username,
    user_confirmPassword,
    role_id,
    ...rest
  } = req.body;
  const formData = req.body;
  try {
    // VALIDATE
    const { error } = createUserSchema.validate(formData, {
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
        message: "Tên tài khoản đã tồn tại",
      });
    }

    // check Category có tồn tại hay k
    if (role_id) {
      const existRole = await Role.findById(role_id);
      if (!existRole) {
        return res.status(400).json({
          message: `Quyền có ID ${role_id} không tồn tại`,
        });
      }
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    const formRequest = {
      user_email,
      user_password,
      user_username,
      role_id,
      user_password: hashPassword,
      ...rest,
    };
    const user = await User.create(formRequest);
    // user.user_password = undefined;

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

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ "verifyToken.token": token });
    if (!user) {
      return res.status(400).json({
        message: "Liên kết xác nhận không hợp lệ.",
      });
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (Date.now() > user.verifyToken.expiration) {
      return res.status(400).json({
        message:
          "Liên kết xác nhận đã hết hạn. Vui lòng yêu cầu lại mã xác nhận.",
      });
    }

    user.isVerified = true; // Chuyển trạng thái xác nhận thành true
    user.verifyToken = null; // Xóa mã xác nhận
    await user.save();

    return res.status(200).json({
      message: "Xác nhận thành công. Bạn có thể đăng nhập ngay bây giờ.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const getAllUsers = async (req, res, next) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;
  const options = {
    page: _page || 1,
    limit: _limit || 10,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
  };
  try {
    const users = await User.paginate({}, options);
    if (!users)
      return res
        .status(401)
        .json({ message: "Danh sách người dùng không tồn tại!" });
    return res.status(200).json({
      message: "Danh sách tài khoản người dùng!",
      users: users.docs,
      pagination: {
        currentPage: users.page,
        totalPages: users.totalPages,
        totalItems: users.totalDocs,
        limit: users.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};
export const banUser = async (req, res) => {
  const _id = req.params.id;
  try {
    // Kiểm tra xem người dùng có tồn tại hay không
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user && user.user_status === true) {
      const result = await User.updateOne(
        { _id },
        { $set: { user_status: false } }
      );
      return res.status(200).json({
        message: "Ban tài khoản người dùng thành công!",
        data: result,
      });
    } else {
      const result = await User.updateOne(
        { _id },
        { $set: { user_status: true } }
      );
      return res.status(200).json({
        message: "Khôi phục tài khoản người dùng thành công!",
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};
