import cloudinary from "../config/cloudinary";

export const uploadImage = async (req, res) => {
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  try {
    const uploadPromises = files.map((file) => {
      // Sử dụng Cloudinary API để upload file lên Cloudinary
      return cloudinary.uploader.upload(file.path);
    });
    console.log("uploadPromises", uploadPromises);

    // Chờ cho tất cả các file đều được upload lên Cloudinary
    const results = await Promise.all(uploadPromises);
    // Trả về kết quả là một mảng các đối tượng chứa thông tin của các file đã upload lên Cloudinary
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));
    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
