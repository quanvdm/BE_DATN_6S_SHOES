import mongoose from "mongoose"; // Erase if already required
import mongoosePaginate from "mongoose-paginate-v2"
import slug from "mongoose-slug-generator"
// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    product_id: [
        {
            type: mongoose.Types.ObjectId, ref: "Product", require: true
        },
    ],
    category_id: [
        {
            type: mongoose.Types.ObjectId, ref: "Category", require: true
        }
    ],
    brand_image: {
        type: Object,
        default: true,
    },
    brand_is_new: {
        type: Boolean,
        default: true,
    },
    brand_status: {
        type: Boolean,
        default: true,
    },
    brand_description: {
        type: String,
        minLength: 5,
        maxLength: 255,
        require: true,
    },
    brand_default: {
        type: Boolean,
        default: true,
    },
    slug: {
        type: String,
        slug: "brand_name"
    },

},
    { versionKey: false, timestamps: true }
);
mongoose.plugin(slug);
brandSchema.plugin(mongoosePaginate);
//Export the model
export default mongoose.model('Brand', brandSchema);