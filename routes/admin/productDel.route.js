const expess = require("express");
const router = expess.Router();

const controller = require("../../controllers/admin/productDel.controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);

router.delete("/restore/:id", controller.restoreItem);

module.exports = router; //export router để sử dụng trong index.js
