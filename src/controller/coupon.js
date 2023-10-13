import Coupon from "../model/coupon";
import { CouponSchema, updateCouponSchema } from "../schema/coupon";

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
    return res.status(400).json({message:"Error server"+error.message});
  }
}

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


export const updateCoupon = async (req, res) => {
  const { coupon_name, coupon_code, expiration_date } = req.body;
  const { id } = req.params;
  const formData = req.body;
  try {
    const { error } = updateCouponSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const idCoupon = await Coupon.findById(id);
    if (!idCoupon || idCoupon.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin giảm giá!",
      });
    }

    const normalizedCouponName = coupon_name.toLowerCase();
    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const checkName = await Coupon.findOne({
      coupon_name: normalizedCouponName,
    });
    if (checkName) {
      return res.status(400).json({
        message:
          "Tên giảm giá đã tồn tại  Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }

    const checkCode = await Coupon.findOne({coupon_code});
    if(checkCode){
        return res.status(400).json({
            message: "Tên mã code giảm giá đã tồn tại !"
        })
    }

    // dữ liệu gửi đi
    const dataCoupon = { ...formData,
      expiration_date: Date.now() + +expiration_date * 24 * 60 * 60 * 1000
     };

    const coupon = await Coupon.findByIdAndUpdate({ _id: id }, dataCoupon, {
      new: true,
    });
    if (!coupon || coupon.length == 0) {
      return res.status(400).json({
        message: "Cập nhật giảm giá thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Cập nhật giảm giá thành công", coupon });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};



