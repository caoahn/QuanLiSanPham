const express = require("express");
const router = express.Router();

const multer = require("multer");
const validate = require("../../validates/admin/account.validate");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

module.exports = router; //export router để sử dụng trong index.js
