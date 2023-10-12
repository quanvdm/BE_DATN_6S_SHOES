import Coupon from "../model/coupon";

export const getAllCoupons = async (req, res) => {
  try {
    const coupon = await Coupon.find();
    if (!coupon) {
      return res.status(404).json({
        message: "Lấy tất cả phiếu giảm giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả phiếu giảm giá thành công",
      coupon,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const removeCoupons = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        message: "Xóa phiếu giảm giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa phiếu giảm giá thành công!",
      coupon,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
