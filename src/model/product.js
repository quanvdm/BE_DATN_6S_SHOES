import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      maxlength: 55,
      required: true,
    },
    product_code: {
      type: String,
      maxlength: 55,
      required: true,
    },
    product_image: {
      type: Array,
      required: true,
    },
    product_description_short: {
      type: String,
      minlength: 3,
      maxlength: 255,
    },
    product_description_long: {
      type: String,
      minlength: 3,
      maxlength: 255,
    },
    product_view: {
      type: Number,
      default: 0,
      required: true,
    },
    product_is_new: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      slug: "product_name",
      required: true,
    },
    favorite_id: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Favorite",
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    group_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product_Group",
    },
    variant_products: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Variant_Product",
      },
    ],
    brand_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    product_status: {
      type: Boolean,
      default: true,
    },
    review_count: { type: Number, default: 0 },
    average_score: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
mongoose.plugin(slug);
export default mongoose.model("Product", productSchema);
