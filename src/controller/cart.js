import Cart from "../model/cart";
import User from "../model/user";
import Variant_Product from "../model/variant_product";
import { AddToCartSchema } from "../schema/cart";

export const addToCart = async (req, res) => {
  const { user_id, variantProductId, quantity = 1 } = req.body;
  try {
    const { error } = AddToCartSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const user = await User.findById(user_id);
    if (!user)
      return res.status(500).json({ message: "Tài khoản không tồn tại!" });

    const variantProduct = await Variant_Product.findById(variantProductId);
    if (!variantProduct)
      return res.status(500).json({ message: "Sản phẩm không tồn tại!" });

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo một giỏ hàng mới
      cart = new Cart({
        user_id,
        variant_products: [],
        cart_totalPrice: 0,
        cart_totalOrder: 0,
      });
      await User.findByIdAndUpdate(user_id, { cart_id: cart._id });
    }
    // Tìm xem sản phẩm biến thể đã tồn tại trong giỏ hàng chưa
    const existingItem = cart.variant_products.find((item) =>
      item.variant_product_id.equals(variantProductId)
    );
    if (quantity > variantProduct?.variant_quantity)
      return res
        .status(402)
        .json({ message: "Sản phẩm đặt hàng vượt quá số lượng kho" });
    if (existingItem) {
      // Nếu sản phẩm biến thể đã tồn tại trong giỏ hàng, cập nhật số lượng
      existingItem.quantity += quantity;
    } else {
      // Nếu sản phẩm biến thể chưa có trong giỏ hàng, thêm vào giỏ hàng
      cart.variant_products.push({
        variant_product_id: variantProductId,
        quantity,
      });
    }

    // Cập nhật giá và tổng số lượng trong giỏ hàng
    cart.cart_totalPrice +=
      (variantProduct.variant_price - variantProduct.variant_discount) *
      quantity;
    cart.cart_totalOrder += quantity;

    // Cập nhật số lượng còn lại cho variant_quantity

    // Lưu cập nhật vào cơ sở dữ liệu
    await cart.save();
    return res
      .status(200)
      .json({ message: "Sản phẩm đã được thêm vào giỏ hàng!", cart });
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};
