const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");

// const storageMulter = require("../../helpers/storageMulter");
const validate = require("../../validates/admin/product-category.validate");
//set up upload image
const multer = require("multer");

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router; //export router để sử dụng trong index.js
