import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const ColorSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      maxlength: 50,
      require: true,
    },
    color_code: {
      type: String,
      maxlength: 50,
    },
    color_is_new: {
      type: Boolean,
      default: true,
    },
    color_image: {
      type: Object,
      required: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    color_description: {
      type: String,
      minlength: 3,
      maxlength: 255,
    },
    variant_products: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Variant_Product",
      },
    ],
    product_count: {
        type: Number,
        default: 0
    },
    slug: {
      type: String,
      slug: "color_name",
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
ColorSchema.plugin(mongoosePaginate);
export default mongoose.model("Color", ColorSchema);
