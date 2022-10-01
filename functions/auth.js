const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("./connection");
const User = require("../models/UserSchema");

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "All fields required" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords dont match" });
    } else {
      const user = new User({ name, email, password, cpassword });

      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "Succesfully Regsitered" });
      } else {
        res.status(500).json({ error: "Failed to Register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25832000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "Invalid Credentials" });
      } else {
        res.status(200).json({ message: "user Signin Successfully" });
      }
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
