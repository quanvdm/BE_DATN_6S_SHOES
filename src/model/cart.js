import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    variant_products: [
      {
        variant_product_id: {
          type: mongoose.Types.ObjectId,
          ref: "Variant_Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    cart_totalPrice: {
      type: Number,
      default: 0,
    },
    cart_totalOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
cartSchema.plugin(mongoosePaginate);
export default mongoose.model("Cart", cartSchema);
