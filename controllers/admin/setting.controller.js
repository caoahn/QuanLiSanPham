const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    title: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};
// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  if (settingGeneral) {
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral._id,
      },
      req.body
    );
  } else {
    const record = new SettingGeneral(req.body);
    record.save();
  }

  req.flash("success", "Cập nhật thành công");
  res.redirect("back");
};
