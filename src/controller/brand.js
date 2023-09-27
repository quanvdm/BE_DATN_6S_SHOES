import Brand from "../model/brand"

export const getAllBrand = async (req, res) => {
    const {
        _page = 1,
        _sort = "createAt",
        _limit = 10,
        _order = "asc",
        _keywords = "",
        _currentPage = 1,
        _totalPage = 5
    } = req.query
    const options = {
        page: _page,
        sort: { [_sort]: _order === "asc" ? -1 : 1 },
        limit: _limit,
        currentPage: _currentPage, // Trang hiện tại
        totalPages: _totalPage, // Tổng số trang
    }
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
        const brands = await Brand.paginate({}, options);
        if (!brands || brands.length === 0)
            return res.status(400).json({
                message: "No brand found!(Không tìm thấy thương hiệu nào! )"
            })
        return res.status(200).json({
            brands: brands.docs,
            paginattion: {
                totalDocs: brands.totalDocs, // Tổng số document trong collection
                limit: brands.limit,// Số lượng record trên mỗi trang
                customElements: brands.page,
                totalPage: brands.totalPages,
                hasPrevPage: options.hasPrevPage(),
                prevPage: options.prevPageNumber() || null,
                nextPage: options.nextPageNumber() || null,
                pagingCounter: ((options.currentPage - 1) * options.limit) + 1,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error Server "
        })
    }
}

export const deleteBrand = async ( req, res ) =>{
    const id = req.params.id;
    try {
        const brand = await Brand.findOne({_id: id})
        if(!brand || brand.length === 0){
            return res.status(404).json({
                message: `Không tìm thấy thương hiệu !`
            })
        }
        console.log(brand);
      const DeleteBrand = await Brand.findByIdAndRemove(id)
      if(!DeleteBrand){
        return res.status(404).json({
            message: ` Xóa thương hiệu Không thành công !`
        })
      }
      return res.status(200).json({
        message: ` Xóa thương hiệu ${brand.brand_name} thành công !`,
        DeleteBrand,
      })

    } catch (error) {
        return res.status(500).json({
            message: "Error server!"
        })
    }
    
}