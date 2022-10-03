const cors = require("cors");
const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

const router = express.Router();
// const dotenv = require("dotenv");
// dotenv.config({ path: ".env" });

const serverless = require("serverless-http");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(cookieParser());

const authroute = require("./auth");
const uploadroute = require("./userdata");
router.get("/", (req, res) => {
  res.send("Working");
});
app.use(express.json());
app.use(authroute);
app.use(uploadroute);
router.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    const videoID = await ytdl.getURLVideoID(url);
    const metaInfo = await ytdl.getInfo(url);

    let data = {
      url: `https://www.youtube.com/embed/${videoID}`,
      info: metaInfo.formats,
    };

    return res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.use("/", router);

module.exports.handler = serverless(app);
