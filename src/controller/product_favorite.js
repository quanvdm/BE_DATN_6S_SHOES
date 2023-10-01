import Favorite from "../model/product_favorite";
import Product from "../model/product";
import User from "../model/user";

export const addProductToFavorite = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({
        message: `Bạn cần đăng nhập mới thực hiện được chức năng này`,
      });
    }

    const exisUser = await User.findById(user_id);
    if (!exisUser) {
      return res
        .status(400)
        .json({ message: `Tài khoản có ID ${user_id} không tồn tại` });
    }

    const exisProduct = await Product.findById(product_id);
    if (!exisProduct) {
      return res
        .status(400)
        .json({ message: `Sản phẩm có ID ${product_id} không tồn tại` });
    }

    let favorite = await Favorite.findOne({ user_id });
    if (!favorite) {
      favorite = await Favorite.create({
        user_id,
        products: [],
      });
      await User.findByIdAndUpdate(user_id, {
        favorite_id: favorite._id,
      });
    }

    const productIndex = favorite.products.findIndex(
      (product) => product.toString() === product_id
    );
    if (productIndex === -1) {
      // Sản phẩm chưa tồn tại trong danh sách yêu thích, thêm vào
      favorite.products.push(product_id);

      await favorite.save();
      return res.status(200).json({
        message: "Sản phẩm đã được đưa vào danh sách yêu thích",
        favorite,
      });
    } else {
      // Sản phẩm đã tồn tại trong danh sách yêu thích, xóa khỏi danh sách
      favorite.products.splice(productIndex, 1);
      await favorite.save();

      return res.status(200).json({
        message: "Sản phẩm đã bị xóa khỏi danh sách yêu thích",
        favorite,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
