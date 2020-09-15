const express = require("express");
const router = express.Router();
const Song = require("../models/song");

//index home page
router.get("/", async (req, res) => {
  let songs;
  try {
    songs = await Song.find().sort({ createdAt: "desc" }).limit(6).exec();
    res.render("index", { songs: songs });
  } catch {
    songs = [];
  }
});

module.exports = router;
