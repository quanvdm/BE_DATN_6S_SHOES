import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";

const attributeSchema = new mongoose.Schema(
  {
    attribute_name: {
      type: String,
      required: true,
      maxLength: 55,
    },
    attribute_description: {
      type: String,
      require: true,
      minLength: 2,
      maxLength: 255,
    },
    value: [
      {
        type: Array,
      },
    ],
    slug: {
      type: String,
      slug: "attribute_name",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
mongoose.plugin(slug);
attributeSchema.plugin(mongoosePaginate);
export default mongoose.model("Attribute", attributeSchema);
