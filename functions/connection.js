const conn = () => {
  const mongoose = require("mongoose");
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = conn();
