const cors = require("cors");
const express = require("express");
const ytdl = require("ytdl-core");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const serverless = require("serverless-http");
const authroute = require("./auth");
const uploadroute = require("./userdata");
const corsOptions = {
  // origin: "https://ytdownloadfrontend.netlify.app",
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  exposedHeaders: "**",
};
app.use(cors(corsOptions));
const router = express.Router();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
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
router.get("/myplay", async (req, res) => {
  try {
    const url = `https://www.youtube.com/watch?v=${req.query.url}`;
    const videoID = await ytdl.getURLVideoID(url);
    const metaInfo = await ytdl.getInfo(url);
    let audioFormats = ytdl.filterFormats(metaInfo.formats, "audioonly");

    let data = {
      url: `https://www.youtube.com/embed/${videoID}`,
      info: metaInfo.formats,
    };
    const uuu = {
      id: req.query.url,
      info: audioFormats,
    };

    return res.send(uuu);
  } catch (err) {
    console.log(err);
  }
});

app.use("/", router);

module.exports.handler = serverless(app);
