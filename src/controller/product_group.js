import Product_Group from "../model/product_group";
import slugify from "slugify";
import { GroupAddSchema, updateProductGroupSchema } from "../schema/product_group";

export const createProductGroup = async (req, res) => {
  const { group_name } = req.body;
  const formData = req.body;

  try {
    const normalizedProductGroupName = group_name.toLowerCase();
    const checkName = await Product_Group.findOne({
      group_name: normalizedProductGroupName,
    });
    if (checkName) {
      return res.status(400).json({
        message:
          "Tên nhóm sản phẩm Bị Trùng Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }

    // validate
    const { error } = GroupAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Tạo slug
    const slug = slugify(group_name, { lower: true });

    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const datagroup = {
      ...formData,
      slug: uniqueSlug,
    };

    const productGroup = await Product_Group.create(datagroup);
    if (!productGroup || productGroup.length === 0) {
      return res.status(400).json({
        message: "Thêm nhóm sản phẩm thất bại",
      });
    }

    // cập nhật lại slug
    productGroup.slug = uniqueSlug;
    await productGroup.save();

    return res.json({
      message: "Thêm nhóm sản phẩm thành công",
      productGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingProduct_Group = await Product_Group.findOne({
      slug: uniqueSlug,
    });
    if (!existingProduct_Group) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}


export const getAllProductGroup = async (req, res) => {
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
        const productGroups = await Product_Group.paginate({}, options);
        if (!productGroups || productGroups.length === 0)
            return res.status(400).json({
                message: "Không tìm thấy nhóm nào!",
            });

        return res.status(200).json({
            message: "Lấy danh sách nhóm thành công",
            productGroups: productGroups.docs,
            pagination: {
                totalDocs: productGroups.totalDocs, 
                limit: productGroups.limit, 
                customElements: productGroups.page,
                totalPage: productGroups.totalPages,
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

export const deleteProductGroup = async (req, res) => {
    try {
        const id = req.params.id;


        const deletedProductGroup = await Product_Group.findOneAndDelete({ _id: id });

        if (!deletedProductGroup) {
            return res.status(404).json({
                message: "Không tìm thấy nhóm",
            });
        }

        return res.status(200).json({
            message: `Xóa nhóm thành công`,
            deletedProductGroup
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: xóa sản phẩm không thành công " + error.message,
        });
    }
};
export const getProductGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const productGroup = await Product_Group.findById(id);

    if (!productGroup) {
      return res.status(404).json({
        message: `Không tìm thấy nhóm sản phẩm có ID ${id}`,
      });
    }

    return res.status(200).json({
      message: `Lấy thông tin nhóm sản phẩm theo ID ${id} thành công`,
      productGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getProductGroupBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const productGroup = await Product_Group.findOne({ slug });

    if (!productGroup) {
      return res.status(404).json({
        message: `Không tìm thấy nhóm sản phẩm với slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Lấy thông tin nhóm sản phẩm theo slug ${slug} thành công`,
      productGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};


export const updateGroup = async (req, res) => {
  const { group_name } = req.body;
  const { id } = req.params;
  const formData = req.body;
  try {
    const { error } = updateProductGroupSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const idGr = await Product_Group.findById(id);
    if (!idGr || idGr.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin nhóm sản phẩm!",
      });
    }

    const normalizedGroupName = group_name.toLowerCase();
    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const checkName = await Product_Group.findOne({
      group_name: normalizedGroupName,
    });
    if (checkName) {
      return res.status(400).json({
        message:
          "Tên nhóm sản phẩm đã tồn tại  Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }

    // Tạo slug
    const slug = slugify(group_name, { lower: true });
    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataGr = { ...formData, slug: uniqueSlug };

    const group = await Product_Group.findByIdAndUpdate({ _id: id }, dataGr, {
      new: true,
    });
    if (!group || group.length == 0) {
      return res.status(400).json({
        message: "Cập nhật nhóm sản phẩm thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Sửa nhóm sản phẩm thành công", group });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
