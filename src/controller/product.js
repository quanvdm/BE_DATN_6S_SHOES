import Product from '../model/product'
import Category from '../model/category'
import Product_Group from '../model/product_group'
import Brand from '../model/brand'
import { ProductAddSchema } from '../schema/product';
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

  export const getProductByIdAndCount = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        { $inc: { product_view: 1 } },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm có ID ${id}`,
        });
      }
  
      return res.status(200).json({
        message: `Thông tin sản phẩm có ID ${id}`,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Lỗi server",
      });
    }
  };
  

export const getProductBySlugAndCount = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOneAndUpdate(
      { slug },
      { $inc: { product_view: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: `Không tìm thấy sản phẩm có Slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin sản phẩm có Slug ${slug}`,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};