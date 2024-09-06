const express = require("express"); // khai báo expess để sử dụng route có sẵn
const router = express.Router();

const controller = require("../../controllers/client/user.controller"); // import controller để sử dụng các hàm trong controller
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router; // export router để sử dụng trong index.js
