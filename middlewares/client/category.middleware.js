const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.js");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
  });
  const newProductsCategory = createTreeHelper.createTree(productsCategory);

  res.locals.layoutProductsCategory = newProductsCategory;
  next();
};
