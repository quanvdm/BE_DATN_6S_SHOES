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
      },
    ],
    cart_totalPrice: {
      type: Number,
      required: true,
    },
    cart_totalOrder: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
cartSchema.plugin(mongoosePaginate);
export default mongoose.model("Cart", cartSchema);
