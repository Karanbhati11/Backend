const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var validator = require("email-validator");
const { passwordStrength } = require("check-password-strength");
const authenticate = require("../middleware/authentication");
require("./connection");
const User = require("../models/UserSchema");
// const DataSchema = require("../models/DataSchema");
const PlayListSchema = require("../models/PlayListSchema");
// const cookieParser = require("cookie-parser");
// const app = express();
router.get("/", (req, res) => {
  res.send("Home Page from auth.js");
});
router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body; // true
  //Email validation remaining
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "All fields required" });
  } else {
    if (validator.validate(email) === false) {
      return res.status(422).json({ error: "Enter valid email address" });
    } else {
      if (password) {
        if (password !== cpassword) {
          return res.status(422).json({ error: "Passwords dont match" });
        } else {
          if (
            passwordStrength(password).id !== 0 &&
            passwordStrength(password).id !== 1
          ) {
            // console.log(passwordStrength(password).id);
            try {
              const userExist = await User.findOne({ email: email });
              if (userExist) {
                return res.status(422).json({ error: "Email already exists" });
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
          } else {
            return res.status(422).json({ error: "password too weak" });
          }
        }
      }
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ error: "All fields required" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      // res.json({ jwttoken: token });
      // res.cookie("jwtoken", token, {
      //   expires: new Date(Date.now() + 25832000000),
      //   path: "https://ytdownloadfrontend.netlify.app/",
      // });
      if (!isMatch) {
        res.status(403).json({ message: "Invalid Credentials" });
      } else {
        res
          .status(200)
          .json({ message: "Logged In Successfully", jwtoken: token });
      }
    } else {
      res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//homepage playlist

router.get("/playlist", authenticate, async (req, res) => {
  const Playlist = await PlayListSchema.findOne({ email: req.rootUser.email });
  res.status(200).send({ data: Playlist, root: req.rootUser.email });
});

router.post(
  "/addtoplaylist",
  async (req, res) => {
    const { email, videoID, ImageUrl, Title, AudioUrl } = req.body;

    try {
      const DataExist = await PlayListSchema.findOne({ email: email });
      if (DataExist) {
        const idvideo = DataExist.Playlist.PlaylistData.map((items) => {
          if (items.videoID !== videoID) {
            return "new_data_found";
          } else return "old_data_found";
        });
        if (idvideo.at(-1) === "new_data_found") {
          const data = await PlayListSchema.updateOne(
            { email: DataExist.email },
            {
              $addToSet: {
                "Playlist.PlaylistData": {
                  videoID: videoID,
                  Title: Title,
                  ImageUrl: ImageUrl,
                  AudioUrl: AudioUrl,
                },
              },
            }
          );
          if (data) {
            res.status(201).json({ message: "Succesfully Uploaded" });
          } else {
            res.status(500).json({ error: "Failed to Register" });
          }
        } else {
          res.status(500).json({ error: "Already Exist" });
        }
      } else {
        const data = new PlayListSchema({
          email: email,
          Playlist: {
            PlaylistData: {
              videoID: videoID,
              Title: Title,
              ImageUrl: ImageUrl,
              AudioUrl: AudioUrl,
            },
          },
        });
        const dataRegister = await data.save();
        if (dataRegister) {
          res.status(201).json({ message: "Succesfully Regsitered" });
        } else {
          res.status(500).json({ error: "Failed to Register" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  //   try {
  //     const DataExist = await DataSchema.findOne({ email: email });
  //     if (DataExist) {
  //       const playlistnamefromexist = DataExist.Playlists.map((items) => {
  //         if (items.PlaylistName === pname) {
  //           return items.PlaylistName;
  //         }
  //       });
  //       if (!playlistnamefromexist.includes(pname)) {
  //         const data = await DataSchema.updateOne(
  //           { email: DataExist.email },
  //           {
  //             $push: {
  //               Playlists: {
  //                 PlaylistName: pname,
  //                 PlaylistData: { AudioUrl: AudioUrl, ImageUrl: ImageUrl },
  //               },
  //             },
  //           }
  //         );
  //         if (data) {
  //           res.status(201).json({ message: "Succesfully Regsitered" });
  //         } else {
  //           res.status(500).json({ error: "Failed to Register" });
  //         }
  //       } else {
  //         const insertnewdata = await DataSchema.updateOne(
  //           { PlaylistName: pname },
  //           {
  //             $push: {
  //               "Playlists.$[].PlaylistData": {
  //                 ImageUrl: ImageUrl,
  //                 AudioUrl: AudioUrl,
  //               },
  //             },
  //           }
  //         );
  //         if (insertnewdata) {
  //           res.status(200).json({ message: "Success" });
  //         } else {
  //           console.log("errr");
  //         }
  //       }
  //     } else {
  //       const data = new DataSchema({
  //         email: email,
  //         Playlists: {
  //           PlaylistName: pname,
  //           PlaylistData: { AudioUrl: AudioUrl, ImageUrl: ImageUrl },
  //         },
  //       });
  //       const dataRegister = await data.save();
  //       if (dataRegister) {
  //         res.status(201).json({ message: "Succesfully Regsitered" });
  //       } else {
  //         res.status(500).json({ error: "Failed to Register" });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
);

// router.post("/deletefromplaylist", async (req, res) => {
//   const { email, _id } = req.body;
//   const DataExist = await PlayListSchema.findOne({ email: email });
//   const datadelete = DataExist.Playlist.PlaylistData.map(async (res) => {
//     if (res._id.toHexString() === _id) {
//       console.log("Deleted");
//       const delone = await PlayListSchema.deleteOne({ _id: res._id });
//       console.log(delone);
//     } else {
//       console.log("not Deleted");
//     }
//   });
// });

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logout success");
});

module.exports = router;
