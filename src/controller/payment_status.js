import Payment_Status from "../model/payment_status"
import { pStatusAddSchema } from "../schema/payment_status";

export const createPaymentStatus = async (req, res) => {
    const formData = req.body;
    const { pStatus_name } = req.body
    try {
      const { error } = pStatusAddSchema.validate(formData, {
        abortEarly: false,
      });
      const checkName = await Payment_Status.findOne({pStatus_name});
      if(checkName){
          return res.status(400).json({
              message: "Tên trạng thái đã tồn tại !"
          })
      }

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          message: errors,
        });
      }
      const DataPaymentStatus = { ...formData }
      const paymentStatus = await Payment_Status.create(DataPaymentStatus);
      if (!paymentStatus) {
        return res.status(404).json({
          error: "Tạo trạng thái giá thất bại",
        });
      }
      return res.status(200).json({
        message: "Tạo trạng thái thành công",
        paymentStatus,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };