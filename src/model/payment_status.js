import mongoose from "mongoose";

const pStatusSchema = new mongoose.Schema(
  {
    pStatus_name: {
      type: String,
      min: 3,
      max: 55,
      required: true,
    },
    pStatus_description: {
      type: String,
      min: 3,
      max: 255,
      required: true,
    },
    pStatus_image: {
        type: Object,
        required: true,
        default: {
          url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
          publicId: "nbv0jiu0bitjxlxo1bqi",
        },
      },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Payment_Status", pStatusSchema);