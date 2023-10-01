import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";

const attributeValueSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      require: true,
      maxLength: 55,
    },
    slug: {
      type: String,
      slug: "value",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

mongoose.plugin(slug);
attributeValueSchema.plugin(mongoosePaginate);
export default mongoose.model("Attribute_Value", attributeValueSchema);
