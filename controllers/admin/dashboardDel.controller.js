//[GET] /admin/dashboard
module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboardDel/index", {
    pageTitle: "Trang admin",
  });
};
