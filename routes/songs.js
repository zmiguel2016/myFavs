const express = require('express')
const router = express.Router()
const Song = require('../models/song')
const Artist = require('../models/artist')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


//all songs route
router.get('/', async (req,res) => {
    let query = Song.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.albumTitle != null && req.query.albumTitle != ''){
        query = query.regex('albumTitle', new RegExp(req.query.albumTitle, 'i'))
    }
    try{
        const songs = await query.exec()
        res.render('songs/index', {
        songs: songs,
        searchOptions: req.query
    })
}catch{
    res.redirect('/')
    }
})

//new songs route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Song)
})

//create songs route
router.post('/', async (req,res) => {
    const song = new Song({
        title: req.body.title,
        albumTitle: req.body.albumTitle,
        genre: req.body.genre,
        //albumCover: fileName,
        artist: req.body.artist,
        
    })

    saveCover(song, req.body.cover)
    try{
        const newSong = await song.save()
        res.redirect('songs')
    }catch{
        renderNewPage(res, song, true)
    }
})




async function renderNewPage(res, song, hasError = false){
    try{
        const artists = await Artist.find({})
        const params = {
            artists: artists,
            song: song
        }
        if (hasError) params.errorMessage = 'Error Creating Song'
        res.render('songs/new', params)
    }catch{
        res.redirect('/songs')
    }
}

function saveCover(song, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        song.albumCover = new Buffer.from(cover.data, 'base64')
        song.albumCoverType = cover.type
    }
}

module.exports = router