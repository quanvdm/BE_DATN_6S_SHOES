import express from "express";
import multer from "multer";
import { deleteImage, uploadImage } from "../controller/upload";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "datn_7sportshoes",
    format: "jpg",
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);

export default router;
