//[GET] /admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

const createTreeHelper = require("../../helpers/createTree.js");
const ProductCategory = require("../../models/product-category.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
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
  //end pagination

  // sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

  // sort = { position: "desc" };
  // end sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // Lấy ra thông tin người tạo và người cập nhật cuối cùng
  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }

    // Lấy ra thông tin người cập nhật cuối cùng
    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang admin products",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH]   change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };
  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};
//[PATCH]   change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);

      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);

      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user._id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );

        req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm`);
      }
      break;

    default:
      break;
  }
  res.redirect("back");
};

//[DELETE]   /admin/products/delete/:id     item
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      // deletedAt: new Date(),
      deletedBy: {
        account_id: res.locals.user._id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Đã xóa thành công`);
  res.redirect("back");
};
//[GET] /admin/products/create

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.createTree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user._id,
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.createTree(category);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Edit sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  console.log(req.body);
  if (req.file) {
    // req.body.thumbnail = `/uploads/${req.file.filename}`;
    req.body.thumbnail = req.body.thumbnail;
  }

  try {
    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      {
        _id: req.params.id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }

  res.redirect("back");
};

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
