const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product.js");

//[Get] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({ _id: productId });

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",

    cartDetail: cart,
  });
};
//[Post] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;

  const productId = req.params.productId;

  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({ _id: cartId });

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;

    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: {
          products: objectCart,
        },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
  res.redirect("back");
};
// [Get] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;

  const cartId = req.cookies.cartId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: {
        products: {
          product_id: productId,
        },
      },
    }
  );

  req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công!");

  res.redirect("back");
};
// [Get] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  req.flash("success", "Cập nhật số lượng sản phẩm trong giỏ hàng thành công!");
  res.redirect("back");
};
