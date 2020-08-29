const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Song = require('../models/song')
const Artist = require('../models/artist')
const uploadPath = path.join('public', Song.albumCoverBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

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
router.post('/', upload.single('cover'), async (req,res) => {
   const fileName=  req.file != null ? req.file.filename : null
    const song = new Song({
        title: req.body.title,
        albumTitle: req.body.albumTitle,
        genre: req.body.genre,
        albumCover: fileName,
        artist: req.body.artist,
        
    })
    try{
        const newSong = await song.save()
        res.redirect('songs')
    }catch{
        if(song.albumCover != null)
        {
            removeSongCover(song.albumCover)
        }
        renderNewPage(res, song, true)
    }
})

function removeSongCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}


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


module.exports = router