const mongoose = require('mongoose')


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
        type: Buffer,
        required: true
    },
    albumCoverType: {
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
    if(this.albumCoverType == "link"){
        return this.albumCover.toString('utf8')
    }else if (this.albumCover != null && this.albumCoverType != null){
        return `data:${this.albumCoverType};charset=utf-8;base64,${this.albumCover.toString('base64')}`
    }
})
module.exports = mongoose.model('Song', songSchema);
