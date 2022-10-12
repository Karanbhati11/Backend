const mongoose = require("mongoose");

const PlayListSchema = new mongoose.Schema({
  email: { type: String, required: true },
  Playlist: {
    PlaylistData: [
      {
        // AudioUrl: { type: String, required: true },
        Title: { type: String, required: false },
        ImageUrl: { type: String, required: true },
        videoID: { type: String, required: true },
      },
    ],
  },
});

const SinglePlaylist = mongoose.model("singleplaylist", PlayListSchema);

module.exports = SinglePlaylist;
