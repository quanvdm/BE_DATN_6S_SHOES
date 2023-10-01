import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const productGroupSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      maxlength: 50,
      required: true,
    },
    group_status: {
      type: Boolean,
      default: true,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    group_is_new: {
      type: Boolean,
      default: true,
    },
    group_description: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
    slug: {
      type: String,
      slug: "group_name",
    },
  },
  { timestamps: true, versionKey: false }
);

mongoose.plugin(slug);
productGroupSchema.plugin(mongoosePaginate);
export default mongoose.model("Product_Group", productGroupSchema);
