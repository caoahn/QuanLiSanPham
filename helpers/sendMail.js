const nodemailer = require("nodemailer");

module.exports.sendMail = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hello@asd.com",
      pass: "",
    },
  });

  const mailOptions = {
    from: "",
    to: "",
    subject: "",
    text: "",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
