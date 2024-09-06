const expess = require("express");
const router = expess.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/my-account.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router; //export router để sử dụng trong index.js
