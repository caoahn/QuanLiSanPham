module.exports.registerPost = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập tiêu đề`);
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email`);
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu`);
    res.redirect("back");
    return;
  }
  next();
};

module.exports.loginPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email`);
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu`);
    res.redirect("back");
    return;
  }
  next();
};

module.exports.forgotPasswordPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email`);
    res.redirect("back");
    return;
  }
  next();
};

module.exports.resetPasswordPost = async (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Mật khẩu không được để trống`);
    res.redirect("back");
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận lại mật khẩu`);
    res.redirect("back");
    return;
  }

  if (req.body.confirmPassword != req.body.password) {
    req.flash("error", `Mật khẩu không trùng khớp`);
    res.redirect("back");
    return;
  }

  next();
};
