const express = require("express"); // khai bảo expess để sử dụng route có sẵn
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

// router.get("/:slug", controller.detail);

router.get("/detail/:slugProduct", controller.detail);

module.exports = router; // export router để sử dụng trong index.js
