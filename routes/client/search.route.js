const express = require("express"); // khai bảo expess để sử dụng route có sẵn
const router = express.Router();
const controller = require("../../controllers/client/search.controller");

router.get("/", controller.index);

module.exports = router; // export router để sử dụng trong index.js
