import Category from "../model/category";
import slugify from "slugify";
import { CategoryAddSchema } from "../schema/category";

async function createUniqueSlug(slug) {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existingCategory = await Category.findOne({ slug: uniqueSlug });
      if (!existingCategory) {
        break;
      }
  
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  
    return uniqueSlug;
  }

export const createCategory = async (req, res) => {
  const { category_name } = req.body;
  const formData = req.body;
  try {
    const checkName = await Category.findOne({ category_name });
    if (checkName) {
      return res.status(400).json({
        message: "Danh mục đã tồn tại",
      });
    }

    // validate
    const { error } = CategoryAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(category_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataCategory = {
      ...formData,
      slug: uniqueSlug,
    };

    const category = await Category.create(dataCategory);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "Thêm danh mục thất bại",
      });
    }

    // cập nhật lại slug
    category.slug = uniqueSlug;
    await category.save();

    return res.json({
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getCategoryById = async (req, res) =>{
    const id = req.params.id;
    try {
      const category = await Category.findById(id)
      if(!category || category.length === 0){
        return res.status(400).json({
          message: "Không tìm thấy danh mục !"
        });
      }
      return res.status(200).json({
        message:  ` Lấy dữ liệu danh mục theo id : ${id} thành công !`,
        category,
      })    
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error server :(("
      })
    }
  }
  
  export const getCategoryBySlug = async (req , res ) =>{
    const slug = req.params.slug;
  try {
    const category = await Category.findOne({slug})
    if(!category || category.length === 0 ){
      return res.status(400).json({
        message: `Không tìm được dữ liệu danh mục slug :${slug}`,
      })
    }
    return res.status(200).json({
      message: `Lấy dự liệu thành công danh mục bởi slug: ${slug} `,
      category,
    })
  
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :(("
    })
  }
  }