const mongoose = require("mongoose");

const CardDataSchema = new mongoose.Schema({
  ImageUrl: {
    type: String,
    required: true,
  },
  AudioUrl: {
    type: String,
    required: true,
  },
});

const DataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  playlists: {
    name: { type: String, required: true },
    playlistdata: [CardDataSchema],
  },
});

const Playlist = mongoose.model("playlist", DataSchema);

module.exports = Playlist;
