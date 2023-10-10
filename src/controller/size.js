import Size from "../model/size";
import { SizeAddSchema, updateSizeSchema } from "../schema/size";
import slugify from "slugify";

export const createSize = async (req, res) => {
    const formData = req.body;
    const { size_name, size_code } = req.body

    try {
        const { error } = await SizeAddSchema.validate(formData, {
            abortEarly: false,
        });
        if (error) {
            const errorFormReq = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errorFormReq,
            });
        }
        const normalizedBrandName = size_name.toLowerCase().trim().replace(/\s+/g, " ");
        const checkName = await Size.findOne({ size_name: normalizedBrandName })
        if (checkName) {
            return res.status(400).json({
                message: "giá trị size đã tồn tại"
            })
        } 
        const checkCode = await Size.findOne({size_code:size_code})
        if (checkCode) {
            return res.status(400).json({
                message: "mã code size không được trùng tên mã code "
            })
        }
        const size = await Size.create(formData);
        if (!size) {
            return res.status(400).json({
                message: "Thêm màu thất bại",
            });
        }
        size.size_name = normalizedBrandName;
        await size.save()
        return res.json({
            message: "Thêm màu thành công",
            size,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Lỗi server",
        });
    }
};
export const getAllSizes = async (req, res) => {
  const {
    _page = 1,
    _sort = "createAt",
    _limit = 10,
    _order = "asc",
    _keywords = "",
    _currentPage = 1,
    _totalPage = 5,
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
    currentPage: _currentPage, // Trang hiện tại
    totalPages: _totalPage, // Tổng số trang
  };
  // Phương thức kiểm tra xem có trang trước đó hay không
  options.hasPrevPage = function () {
    return this.currentPage > 1;
  };

  // Phương thức lấy số trang trước đó
  options.prevPageNumber = function () {
    return this.hasPrevPage() ? this.currentPage - 1 : null;
  };

  // Phương thức lấy số trang tiếp theo
  options.nextPageNumber = function () {
    return this.currentPage < this.totalPages ? this.currentPage + 1 : null;
  };
  try {
    const sizes = await Size.paginate({}, options);
    if (!sizes || sizes.length === 0)
      return res.status(400).json({
        message: "No brand found!(Không tìm thấy sizes ! )",
      });
    return res.status(200).json({
      sizes: sizes.docs,
      paginattion: {
        totalDocs: sizes.totalDocs, // Tổng số document trong collection
        limit: sizes.limit, // Số lượng record trên mỗi trang
        customElements: sizes.page,
        totalPage: sizes.totalPages,
        hasPrevPage: options.hasPrevPage(),
        prevPage: options.prevPageNumber() || null,
        nextPage: options.nextPageNumber() || null,
        pagingCounter: (options.currentPage - 1) * options.limit + 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server ",
    });
  }
};

export const deleteSizeById = async (req, res) => {
const id = req.params.id;
try {
  const size = await Size.findById({ _id: id });
  if (!size || size.length === 0) {
  return res.status(404).json({
      message: `Không tìm thấy giá trị size !`,
  });
  }

  const DeleteSize = await Size.findByIdAndDelete({ _id: id });
  if (!DeleteSize) {
  return res.status(404).json({
      message: ` Xóa thương size không thành công !`,
  });
  }
  return res.status(200).json({
  message: ` Xóa size giá trị : ${size.size_name} thành công !`,
  DeleteSize,
  });
} catch (error) {
  return res.status(500).json({
  message: "Error server!",
  });
}
};
export const deleteSizeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const size = await Size.findOne({ slug: slug });
    if (!size || size.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy giá trị size !`,
      });
    }
    console.log(slug);
    const DeleteSize = await Size.findOneAndDelete({slug:slug});
    if (!DeleteSize) {
      return res.status(404).json({
        message: ` Xóa thương size không thành công !`,
      });
    }
    return res.status(200).json({
      message: ` Xóa size giá trị : ${slug} thành công !`,
      DeleteSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error server!",
    });
  }
};
export const getSizeById = async (req ,res ) =>{
  // const id=parseInt(req.params.id)
  const { id } = req.params;
  try {
      const size = await Size.findById(id)
      console.log(size);
      if (!size) {
        return res.status(400).json({
          message: `Không tìm thấy size có ID ${id}`,
        });
      }
      return res.status(200).json({
        message: `Dữ liệu size có ID ${id}`,
        size,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Lỗi server",
      });
    }
}
export const getSizeBySlug = async (req ,res ) =>{
  // const id=parseInt(req.params.id)
  const  slug  = req.params.slug;
  try {
      const size = await Size.findOne({slug: slug})
      console.log(size);
      if (!size) {
        return res.status(400).json({
          message: `Không tìm thấy size có slug là :  ${slug}`,
        });
      }
      console.log(slug);
      return res.status(200).json({
        message: `Lấy size thành công  có slug là : ${slug}`,
        size,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Lỗi server",
      });
    }
}

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingSize = await Size.findOne({
      slug: uniqueSlug,
    });
    if (!existingSize) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const updateSize = async (req, res) => {
  const { size_name } = req.body;
  const { id } = req.params;
  const formData = req.body;
  try {
    const { error } = updateSizeSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const idSize = await Size.findById(id);
    if (!idSize || idSize.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin kích cỡ!",
      });
    }

    const normalizedSizeName = size_name.toLowerCase();
    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const checkName = await Size.findOne({
      size_name: normalizedSizeName,
    });
    if (checkName) {
      return res.status(400).json({
        message:
          "Tên kích cỡ đã tồn tại  Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }

    // Tạo slug
    const slug = slugify(size_name, { lower: true });
    // cập nhật slug
    let uniqueSlug = await createUniqueSlug(slug);

    // dữ liệu gửi đi
    const dataSize = { ...formData, slug: uniqueSlug };

    const size = await Size.findByIdAndUpdate({ _id: id }, dataSize, {
      new: true,
    });
    if (!size || size.length == 0) {
      return res.status(400).json({
        message: "Cập nhật kích cỡ thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Sửa kích cỡ thành công", size });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};