import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";

const SizeSchema = new mongoose.Schema(
  {
    size_name: {
      type: String,
      required: true,
      maxLength: 55,
      index: true,
    },
    size_description: {
      type: String,
      require: true,
      minLength: 2,
      maxLength: 255,
    },
    variant_product:[
        {
            type:mongoose.Types.ObjectId,
            ref: "Variant_Product"
        },
    ],
    size_is_new: {
      type : Boolean ,
      default:true
    },
    size_code:{
      type: String,
      trim: true,
      maxLength: 55,
    },
    slug: {
      type: String,
      slug: "size_name",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
mongoose.plugin(slug);
SizeSchema.plugin(mongoosePaginate);
export default mongoose.model("Size", SizeSchema);
