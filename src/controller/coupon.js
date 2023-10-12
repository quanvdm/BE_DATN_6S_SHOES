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

export const createCoupons = async (req, res) => {
  const formDataCoupon = req.body;
  const {coupon_name, coupon_code, expiration_date} = req.body
  try {
    const { error } = CouponSchema.validate(formDataCoupon, {
      abortEarly: false,
    });
    const checkName = await Coupon.findOne({coupon_name});
    if(checkName){
        return res.status(400).json({
            message: "tên khuyễn mãi đã tồn tại !"
        })
    }
    const checkCode = await Coupon.findOne({coupon_code});
    if(checkCode){
        return res.status(400).json({
            message: "tên mã code giảm giá đã tồn tại !"
        })
    }
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const DataCoupon = {
        ...formDataCoupon,
        expiration_date: Date.now() + +expiration_date * 24 * 60 * 60 * 1000
    }
    const coupon = await Coupon.create(DataCoupon);
    if (!coupon) {
      return res.status(404).json({
        error: "Tạo phiếu giảm giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo phiếu giảm giá thành công",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};




