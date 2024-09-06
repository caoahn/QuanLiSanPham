//[GET] /admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: true,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // tim kiem
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    // regex to search case-insensitive
    find.title = objectSearch.regex;
  }

  //Pagination

  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/productsDel/index", {
    pageTitle: "Trang admin products bị xóa",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//end pagination

//[PATCH]   change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};
//[PATCH]   change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;

    case "delete-all":
      await Product.deleteMany({ _id: { $in: ids } });
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
      break;

    case "restore-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: false,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Đã khôi phục thành công ${ids.length} sản phẩm`);
      break;

    default:
      break;
  }

  res.redirect("back");
};

//[DELETE]   /admin/products/delete/:id     item
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.deleteOne({ _id: id });

  req.flash("success", `Đã xóa thành công `);
  res.redirect("back");
};

// [DELETE]   /admin/products/restore/:id     item
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { deleted: false });
  req.flash("success", `Đã khôi phục thành công  sản phẩm`);
  res.redirect("back");
};
