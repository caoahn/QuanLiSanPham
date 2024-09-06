const express = require("express"); // khai báo expess để sử dụng route có sẵn
const router = express.Router();

const controller = require("../../controllers/client/checkout.controller"); // import controller để sử dụng các hàm trong controller

router.get("/", controller.index);

router.post("/order", controller.order);

router.get("/success/:orderId", controller.success);

module.exports = router; // export router để sử dụng trong index.js
