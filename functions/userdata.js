const express = require("express");
const router = express.Router();
const Playlist = require("../models/DataSchema");
const { findOne } = require("../models/UserSchema");
const User = require("../models/UserSchema");

router.post("/upload", async (req, res) => {
  const { email, name, ImageUrl, AudioUrl } = req.body;
  if (!email || !ImageUrl || !AudioUrl || !name) {
    res.status(400).json({ error: "All fields required" });
  } else {
    const isPlaylist = await Playlist.findOne({ email: email });
    const DataObject = { ImageUrl: ImageUrl, AudioUrl: AudioUrl };
    if (isPlaylist) {
      const query = { _id: isPlaylist._id };
      const result = await Playlist.findByIdAndUpdate(
        query,
        {
          playlists: {
            playlistdata: [DataObject],
          },
        },
        { new: true }
      );

      if (result) {
        res.status(201).json({ message: isPlaylist });
      } else {
        res.status(500).json({ error: "Failed to Upload" });
      }
    } else {
      const playlist = new Playlist({
        email,
        playlists: {
          name: name,
          playlistdata: [{ ImageUrl: ImageUrl, AudioUrl: AudioUrl }],
        },
      });
      const UpdatePlaylist = await playlist.save();
      if (UpdatePlaylist) {
        res.status(201).json({ message: "Succesfully Uploaded" });
      } else {
        res.status(500).json({ error: "Failed to Upload" });
      }
    }
  }
});

module.exports = router;
