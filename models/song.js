const mongoose = require('mongoose')
const path = require('path')
const albumCoverBasePath ='uploads/albumCovers'
const songSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    albumTitle: {
        type: String,
        required: true
        //default: this.title
    },
    genre: {
        type: String,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    albumCover: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    }
});

songSchema.virtual('albumCoverPath').get(function() {
    if (this.albumCover != null){
        return path.join('/', albumCoverBasePath, this.albumCover)
    }
})
module.exports = mongoose.model('Song', songSchema);
module.exports.albumCoverBasePath = albumCoverBasePath;