const express = require("express"); // khai báo expess để sử dụng route có sẵn
const router = express.Router();

const controller = require("../../controllers/client/cart.controller"); // import controller để sử dụng các hàm trong controller

router.get("/", controller.index); // gửi request lên route "/" thì chạy hàm index trong controller
router.post("/add/:productId", controller.addPost);

router.get("/delete/:productId", controller.delete);

router.get("/update/:productId/:quantity", controller.update);

module.exports = router; // export router để sử dụng trong index.js
