const express = require('express')
const router = express.Router()
const Song = require('../models/song')

router.get('/', async (req,res) => {
    let songs
    try{
        songs = await Song.find().sort({createAt: 'desc'}).limit(10).exec()
    res.render('index', { songs: songs})
    }catch{
        songs = []
    }
})

module.exports = router