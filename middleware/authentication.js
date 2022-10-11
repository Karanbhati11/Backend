const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
// const cookieParser = require("cookie-parser");
// const router = require("../router/auth");

// router.use(cookieParser);
const Authenticate = async (req, res, next) => {
  // console.log(req.headers);
  try {
    // const token = req.cookies.jwtoken;
    const authBearer = req.headers["authorization"];
    const token = authBearer.split(" ");
    const verifyToken = jwt.verify(token[1], process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided");
    console.log(err);
  }
};

module.exports = Authenticate;
