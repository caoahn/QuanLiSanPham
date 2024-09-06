const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.js");
// const paginationHelper = require("../../helpers/pagination");
const filterStatusHelper = require("../../helpers/filterStatus");

const searchHelper = require("../../helpers/search");
// [GET] /admin/products-category
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
  // const countProducts = await ProductCategory.countDocuments(find);
  // let objectPagination = paginationHelper(
  //   {
  //     currentPage: 1,
  //     limitItems: 4,
  //   },
  //   req.query,
  //   countProducts
  // );
  //end pagination

  const records = await ProductCategory.find(find);
  // .limit(objectPagination.limitItems)
  // .skip(objectPagination.skip);

  const newRecords = createTreeHelper.createTree(records);

  await Promise.all(
    records.map(async (product) => {
      try {
        // Fetch user information for the creator
        const user = await Account.findOne({
          _id: product.createdBy.account_id,
        });
        if (user) {
          product.accountFullName = user.fullName;
        }

        //Fetch user information for the last updater
        const updatedBy = product.updatedBy.slice(-1)[0];
        if (updatedBy) {
          const userUpdated = await Account.findOne({
            _id: updatedBy.account_id,
          });
          if (userUpdated) {
            updatedBy.accountFullName = userUpdated.fullName;
          }
        }
      } catch (err) {
        console.error(`Error processing product ${product._id}:`, err);
      }
    })
  );

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    // pagination: objectPagination,
    keyword: objectSearch.keyword,
    filterStatus: filterStatus,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  // const permissions = res.locals.role.permissions;
  // if (permissions.inludes("products-category_create")) {
  // } else {
  //   return;
  // }

  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.createTree(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    // req.body.thumbnail = `/uploads/${req.file.filename}`;
    req.body.thumbnail = req.body.thumbnail;
  }

  try {
    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    };

    await ProductCategory.updateOne(
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

//[PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };

  await ProductCategory.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};

//[GET] admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const data = await ProductCategory.findOne(find);

    res.render("admin/pages/products-category/detail.pug", {
      pageTitle: data.title,
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
//[DELETE]   /admin/products-category/delete/:id     item
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne(
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
