import jwt from 'jsonwebtoken';
import Role from '../model/role'


export const authenticateJWT = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập và có mã JWT không
    const token = req.headers.token;
    if (!token) { 
        return res.status(401).json({
            message: "chưa xác thực (you are not authenticated)"
        });
    }
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                  message: "Token không hợp lệ",
                });
              }
              if (err.name == "TokenExpiredError") {
                return res.status(401).json({
                  message: "Token hết hạn",
                });
              }
        }
        // Lưu thông tin người dùng từ mã JWT vào req để sử dụng sau này
        req.user = decoded;
        // Tiếp tục xử lý
        next();
    });
};


export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // Sử dụng middleware xác thực JWT để kiểm tra đăng nhập
        authenticateJWT(req, res, async () => {
            // Lấy vai trò của người dùng từ user.role_id
            const userRoleId = req.user.role_id;
            console.log("userRoleId", userRoleId);
            // Tìm vai trò tương ứng từ bảng Role
            const userRole = await Role.findById(userRoleId);
            // Kiểm tra xem vai trò của người dùng có trong danh sách cho phép không
            if (!userRole || !allowedRoles.includes(userRole.role_name)) {
                return res.status(403).json({
                    message: "Bạn không có quyền truy cập.",
                });
            }
            console.log("userRole", userRole);
            // Nếu có quyền, tiếp tục xử lý
            next();
        });
    };
}
