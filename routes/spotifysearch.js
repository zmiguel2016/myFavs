const express = require("express");
const router = express.Router();
const Auth = require("../models/auth");
const Song = require("../models/song");
const Artist = require("../models/artist");

const request = require("request");

var token;
var songs = [];
var song;
const search_url = "https://api.spotify.com/v1/search?q="; //serach url
const end_url = "&type=track&limit=6"; //type tracks limit 6

//grabs auth token to use on search page
router.get("/", async (req, res) => {
  if (Auth.getAuth().access_token.type == null) {
    token = "Bearer " + Auth.getAuth().access_token;
    res.render("spotifysearch/index", {
      searchOptions: req.query,
      songs: songs,
    });
  } else {
    res.redirect("/auth");
  }
});

//new spotify song
router.get("/newSpotify", async (req, res) => {
  songs = [];
  if (token != null) {
    title = encodeURIComponent(req.query.title.trim());
    var _url = search_url + title + end_url;
    try {
      let res = await doRequest({
        url: _url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res) {
        var search = JSON.parse(res.body);
        if (search.tracks != null) {
          search.tracks.total;
          var limit;
          if (search.tracks.total < 6) {
            limit = search.tracks.total;
          } else {
            limit = 6;
          }
          for (i = 0; i < limit; i++) {
            song = {
              name: search.tracks.items[i].name,
              artist: search.tracks.items[i].artists[0].name,
              album: search.tracks.items[i].album.name,
              albumCover: search.tracks.items[i].album.images[0].url,
              link: search.tracks.items[i].external_urls.spotify,
            };
            songs.push(song);
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.redirect("/auth");
    }
    res.render("spotifysearch/index", {
      searchOptions: req.query,
      songs: songs,
    });
  } else {
    res.redirect("/auth");
  }
});

//post song to database
router.post("/", async (req, res) => {
  const song = new Song({
    title: req.body.name,
    albumTitle: req.body.album,
    genre: " ",
    albumCover: req.body.albumCover,
    albumCoverType: "link",
    link: req.body.link,
  });
  await saveArtist(song, req.body.artist);
  try {
    const newSong = await song.save();
    res.redirect(`songs/${newSong.id}`);
  } catch {
    res.redirect("/");
  }
});

//request song from api
function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(res);
      } else {
        reject(error);
      }
    });
  });
}

//save artist from api in object form
async function saveArtist(song, inputArtist) {
  let boolean = false;
  let dbartisit = await Artist.find({});
  dbartisit.forEach((artist) => {
    if (artist.name.toLowerCase() == inputArtist.toLowerCase()) {
      song.artist = artist._id;
      boolean = true;
    }
  });
  if (boolean == false) {
    const newartist = new Artist({
      name: inputArtist,
    });
    try {
      const newArtist = await newartist.save();
      song.artist = newartist.id;
    } catch {
      res.redirect("/");
    }
  }
}

module.exports = router;
