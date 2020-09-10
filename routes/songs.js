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
        artist: req.body.artist
        
    })

    saveCover(song, req.body.cover)
    try{
        const newSong = await song.save()
        res.redirect(`songs/${newSong.id}`)
    }catch{
        renderNewPage(res, song, true)
    }
})

//show song route
router.get('/:id', async (req,res) => {
    try{
        const song = await Song.findById(req.params.id).populate('artist').exec()
        res.render('songs/show', { song: song})
    }catch{
        res.redirect('/')
    }
})


//edit songs route
router.get('/:id/edit', async (req, res) => {
    try{
        const song = await Song.findById(req.params.id)
        renderEditPage(res, song)
    }catch{
        res.redirect('/')
    }
})

//update song route
router.put('/:id', async (req,res) => {
    let song
    try{
        song = await Song.findById(req.params.id)
        song.title = req.body.title
        song.albumTitle = req.body.albumTitle
        song.genre = req.body.genre
        song.artist = req.body.artist
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(song, req.body.cover)
        }
        await song.save()
        res.redirect(`/songs/${song.id}`)
    }catch{
        if(song != null){
        renderEditPage(res, song, true)
        }else{
            redirect('/')
        }
    }
})

//delete song route
router.delete('/:id', async (req,res) => {
    let song
    try{
        song = await Song.findById(req.params.id)
        await song.remove()
        res.redirect('/songs')
    }catch{
        if(song != null){
            res.render('songs/show', {
               song: song,
               errorMessage: 'Erroring removing song' 
            })
        }else{
            res.redirect('/')
        }
    }
})


async function renderNewPage(res, song, hasError = false){
    renderFormPage(res, song, 'new', hasError)
}

async function renderEditPage(res, song, hasError = false){
    renderFormPage(res, song, 'edit', hasError)
}

async function renderFormPage(res, song, form, hasError = false){
    try{
        const artists = await Artist.find({})
        const params = {
            artists: artists,
            song: song
        }
        if (hasError) params.errorMessage = 'Error Uploading Song'
        res.render(`songs/${form}`, params)
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