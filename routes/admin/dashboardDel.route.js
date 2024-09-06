const expess = require("express");
const router = expess.Router();

const controller = require("../../controllers/admin/dashboardDel.controller");

router.get("/", controller.dashboard);

module.exports = router; //export router để sử dụng trong index.js
