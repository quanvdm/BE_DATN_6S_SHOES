import Product from '../model/product'
import Category from '../model/category'
import Product_Group from '../model/product_group'
import Brand from '../model/brand'
import { ProductAddSchema ,ProductUpdateSchema} from '../schema/product';
import slugify from 'slugify';


export const getAllProduct = async (req, res) => {
    const {
        _page = 1,
        _sort = "createAt",
        _limit = 10,
        _order = "asc",
        _keywords = "",
        _currentPage = 1,
        _totalPage = 5
    } = req.query;

    const options = {
        page: _page,
        sort: { [_sort]: _order === "asc" ? -1 : 1 },
        limit: _limit,
        currentPage: _currentPage,
        totalPages: _totalPage,
    };


    options.hasPrevPage = function () {
        return this.currentPage > 1;
    };

    options.prevPageNumber = function () {
        return this.hasPrevPage() ? this.currentPage - 1 : null;
    };
    options.nextPageNumber = function () {
        return this.currentPage < this.totalPages ? this.currentPage + 1 : null;
    };

    try {
        const products = await Product.paginate({}, options);
        if (!products || products.length === 0)
            return res.status(400).json({
                message: "Không tìm thấy sản phẩm nào!",
            });

        return res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            products: products.docs,
            pagination: {
                totalDocs: products.totalDocs, 
                limit: products.limit, 
                customElements: products.page,
                totalPage: products.totalPages,
                hasPrevPage: options.hasPrevPage(),
                prevPage: options.prevPageNumber() || null,
                nextPage: options.nextPageNumber() || null,
                pagingCounter: ((options.currentPage - 1) * options.limit) + 1,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error Server",
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;


        const deletedProduct = await Product.findOneAndDelete({ _id: id });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }

        return res.status(200).json({
            message: `Xóa sản phẩm thành công`,
            deletedProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: xóa sản phẩm không thành công " + error.message,
        });
    }
};


async function createUniqueSlug(slug) {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existingProduct = await Product.findOne({ slug: uniqueSlug });
      if (!existingProduct) {
        break;
      }
  
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  
    return uniqueSlug;
  }
  
  
  export const createProduct = async (req, res) => {
    const { product_name } = req.body;
    const formData = req.body;
    try {
      const checkName = await Product.findOne({ product_name });
      if (checkName) {
        return res.status(400).json({
          message: "Sản phẩm đã tồn tại",
        });
      }
  
  
  
      // validate
      const { error } = ProductAddSchema.validate(formData);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
  
      // Tạo slug
      const slug = slugify(product_name, { lower: true });
  
      // cập nhật slug
      let uniqueSlug = await createUniqueSlug(slug);
  
      // dữ liệu gửi đi
      const dataPro = {
        ...formData,
        slug: uniqueSlug,
      };
  
      const product = await Product.create(dataPro);
      if (!product || product.length === 0) {
        return res.status(400).json({
          message: "Thêm sản phẩm thất bại",
        });
      }
  
      await Category.findOneAndUpdate(product.category_id, {
          $addToSet: {
              products: product.id,
          }
      })
  
  
  await Product_Group.findOneAndUpdate(product.group_id, {
    $addToSet: {
        products: product.id,
    }
  })
  
  
  await Brand.findOneAndUpdate(product.brand_id, {
    $addToSet: {
        products: product.id,
    }
  })
      // cập nhật lại slug
      product.slug = uniqueSlug;
      await product.save();
  
      return res.json({
        message: "Thêm sản phẩm thành công",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Lỗi server",
      });
    }
  };

//   update
  export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const { brand_id , category_id} = req.body;
    try {
      const { error } = await ProductUpdateSchema.validate(body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          message: errors,
        });
      }

     // check brand có tồn tại hay k
    const existBrand = await Brand.findById(brand_id);
    if (!existBrand) {
      return res.status(400).json({
        message: `Thương hiệu có ID ${brand_id} không tồn tại`,
      });
    }
     // check brand có tồn tại hay k
    const existCategory = await Category.findById(category_id);
    if (!existCategory) {
      return res.status(400).json({
        message: `Thương hiệu có ID ${category_id} không tồn tại`,
      });
    }

      const product = await Product.findById(id);
      let newSlug = product.slug;
      newSlug = slugify(req.body.product_name, { lower: true });
      if (!product)
        return res.status(402).json({ message: "Không tìm thấy sản phẩm!" });
  
      const updateProduct = await Product.findOneAndUpdate(
        product._id,
        { ...req.body, slug: newSlug },
        {
          new: true,
        }
      );
      if (!updateProduct)
        return res.status(404).json({ message: "Cập nhật sản phẩm thất bại!" });
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công!",
        products: updateProduct,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server Product: " + error.message });
    }
  };
