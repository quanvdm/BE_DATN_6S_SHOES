import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const variantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    attribute_value_id: {
      type: mongoose.Types.ObjectId,
      ref: "Attribute",
      require: true,
    },
    variant_price: {
      type: Number,
      min: 0,
      require: true,
    },
    variant_discount: {
      type: Number,
      min: 0,
      require: true,
    },
    variant_quantity: {
      type: Number,
      min: 0,
      require: true,
    },
    variant_stock: {
      type: Number,
      min: 0,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
variantSchema.plugin(mongoosePaginate);
export default mongoose.model("Variant_Product", variantSchema);
