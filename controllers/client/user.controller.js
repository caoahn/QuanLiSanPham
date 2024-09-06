const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect("back");
    }

    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
    });

    await user.save();

    // req.flash("success", "Đăng ký tài khoản thành công");

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
  } catch (err) {
    req.flash("error", "Đã xảy ra lỗi trong quá trình đăng ký");
    res.redirect("back");
  }
};
// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập",
  });
};
//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email hoặc mật khẩu không đúng");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không chính xác");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản bạn đã bị khóa");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  // Luu User_id vào model cart

  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user._id,
    }
  );
  res.redirect("/");
};
// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  // viec 1: tao ma otp va luu

  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);

  await forgotPassword.save();

  // viec 2: gui ma otp qua email
  sendMailHelper.sendMai();

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "Mã OTP không chính xác");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};
// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  res.redirect("/");
};
// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};
