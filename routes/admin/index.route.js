const systemConfig = require("../../config/system"); // import system.config.js
const authMiddleware = require("../../middlewares/admin/auth.middleware"); // import auth.middleware.js

const dashboardRoutes = require("./dashboard.route"); // import dashboard.route.js
const productRoutes = require("./product.route"); // import product.route.js

const productDelRoutes = require("./productDel.route"); // import productDel.route.js
const dashboardDelRoutes = require("./dashboardDel.route"); // import dashboard.route.js
const productCategoryRoutes = require("./product-category.route"); // import product-category.route.js
const roleRoutes = require("./role.route"); // import role.route.js
const accountRoutes = require("./account.route"); // import account.route.js
const authRoutes = require("./auth.route"); // import auth.route.js
const myAccountRoutes = require("./my-account.route"); // import my-account.route.js
const settingRoutes = require("./setting.route"); // import setting.route.js

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);

  app.use(
    PATH_ADMIN + "/productsDel",
    authMiddleware.requireAuth,
    productDelRoutes
  );
  app.use(
    PATH_ADMIN + "/dashboardDel",
    authMiddleware.requireAuth,
    dashboardDelRoutes
  );
  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRoutes
  );
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );

  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);
};
