import Variant_Product from "../model/variant_product"
import Product from "../model/product"
import Color from "../model/color"
import Size from "../model/size"
import { AddVariantProductSchema, updateVariantSchema } from "../schema/variant_product";


export const getAllVariantProduct = async (req, res) => {
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
        const variantPros = await Variant_Product.paginate({}, options);
        if (!variantPros || variantPros.length === 0)
            return res.status(400).json({
                message: "Không tìm thấy sản phẩm biến thể nào!",
            });

        return res.status(200).json({
            message: "Lấy danh sách sản phẩm biến thể thành công",
            variantPros: variantPros.docs,
            pagination: {
                totalDocs: variantPros.totalDocs, 
                limit: variantPros.limit, 
                customElements: variantPros.page,
                totalPage: variantPros.totalPages,
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

export const deleteVariantProduct = async (req, res) => {
    try {
        const id = req.params.id;


        const deletedVariantProduct = await Variant_Product.findOneAndDelete({ _id: id });

        if (!deletedVariantProduct) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm biến thể",
            });
        }

        return res.status(200).json({
            message: `Xóa sản phẩm biến thể thành công`,
            deletedVariantProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: xóa sản phẩm biến thể không thành công " + error.message,
        });
    }
};


export const updateVariantProduct = async (req, res) => {
    const { id } = req.params;
    const formData = req.body;
    try {
        const { error } = updateVariantSchema.validate(formData, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const idVariant = await Variant_Product.findById(id);
        if (!idVariant || idVariant.length === 0) {
            return res.status(400).json({
                message: "Không tìm thấy thông tin biến thể!",
            });
        }

        // Kiểm tra product_id
        const product = await Product.findById(formData.product_id);
        if (!product) {
            return res.status(400).json({
                message: "Không tìm thấy sản phẩm với product_id đã cung cấp!",
            });
        }

        // Kiểm tra color_id
        const color = await Color.findById(formData.color_id);
        if (!color) {
            return res.status(400).json({
                message: "Không tìm thấy màu sắc với color_id đã cung cấp!",
            });
        }

        // Kiểm tra size_id
        const size = await Size.findById(formData.size_id);
        if (!size) {
            return res.status(400).json({
                message: "Không tìm thấy kích thước với size_id đã cung cấp!",
            });
        }

        const existingVariant = await Variant_Product.findOne({
            product_id: formData.product_id,
            size_id: formData.size_id,
            color_id: formData.color_id
        });

        if(existingVariant) {
            return res.status(400).json({
                message: "Sản phẩm biến thể đã tồn tại"
            });
        }

        // Dữ liệu gửi đi
        const dataVariant = { ...formData };

        const variant = await Variant_Product.findByIdAndUpdate({ _id: id }, dataVariant, {
            new: true,
        });

        await Product.findOneAndUpdate(variant.product_id, {
            $addToSet: {
                variantPros: variant.id,
            }
        });
        await Color.findOneAndUpdate(variant.color_id, {
            $addToSet: {
                variantPros: variant.id,
            }
        });
        await Size.findOneAndUpdate(variant.size_id, {
            $addToSet: {
                variantPros: variant.id,
            }
        });

        if (!variant || variant.length == 0) {
            return res.status(400).json({
                message: "Cập nhật biến thể thất bại",
            });
        }

        return res
            .status(200)
            .json({ message: "Sửa biến thể thành công", variant });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Lỗi server",
        });
    }
};


// create variant product
export const createVariantProduct = async (req, res) => {
  const formData = req.body;
  const { color_id, size_id, product_id } = req.body;
  try {
    const { error } = AddVariantProductSchema.validate(formData, {
      abortEarly: false,
    }); 
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const product = await Product.findById({ _id: product_id });
    if (!product)
      return res.status(400).json({
        message: "Sản phẩm không tồn tại",
      });
    const size = await Size.findById({ _id: size_id });
    if (!size)
      return res.status(400).json({
        message: "Kích thước không tồn tại",
      });
    const color = await Color.findById({ _id: color_id });
    if (!color)
      return res.status(400).json({
        message: "Màu sắc không tồn tại",
      });
    // Kiểm tra xem đã tồn tại sản phẩm biến thể với color_id và size_id đã cho chưa
    const existingVariant = await Variant_Product.findOne({
      color_id: color_id,
      size_id: size_id,
      product_id: product_id,
    });

    if (existingVariant) {
      return res.status(400).json({
        message: `Sản phẩm biến thể với color: ${color.color_name} và size: ${size.size_name} đã tồn tại rồi.`,
      });
    }
    const variantProduct = await Variant_Product.create(formData);
    await Product.findOneAndUpdate(
      { _id: product_id },
      {
        $addToSet: {
          variant_products: variantProduct._id,
        },
      }
    );
    await Size.findOneAndUpdate(
      { _id: size_id },
      {
        $addToSet: {
          variant_products: variantProduct._id,
        },
      }
    );
    await Color.findOneAndUpdate(
      { _id: color_id },
      {
        $addToSet: {
          variant_products: variantProduct._id,
        },
      }
    );
    await variantProduct.save();
    return res.json({
      message: "Thêm sản phảm biến thể thành công!",
      variantProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server VariantProduct: " + error.message });
  }
};