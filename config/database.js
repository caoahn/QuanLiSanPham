const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Failed to connect to MongoDB");
  }
};
