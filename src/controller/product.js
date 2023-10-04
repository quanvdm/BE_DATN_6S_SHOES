import Product from '../model/product'


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