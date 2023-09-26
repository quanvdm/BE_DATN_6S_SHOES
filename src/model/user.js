import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const userSchema = new mongoose.Schema(
  {
    user_fullname: {
      type: String,
      required: true,
      maxlength: 55,
    },
    user_username: {
      type: String,
      required: true,
      maxlength: 55,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    user_avatar: {
      type: Object,
      required: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    user_phone: {
      type: Number,
      min: 0,
    },
    user_address: {
      type: String,
    },
    verifyToken: {
      type: Object,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    user_password: {
      type: String,
      minlength: 6,
    },
    user_confirmPassword: {
      type: String,
      minlength: 6,
    },
    user_gender: {
      type: String,
      require: true,
      enum: ["nam", "nu", "khac"],
      default: "khac",
    },
    user_status: {
      type: Boolean,
      default: true,
    },
    user_date_of_birth: {
      type: Date,
    },
    role_id: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      require: true,
      default: "650da20158cf02d766344be5",
    },
    cart_id: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      require: true,
    },
    slug: {
      type: String,
      slug: "user_fullname",
    },
    bills: [{ billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" } }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
