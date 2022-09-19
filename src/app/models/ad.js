const mongoose = require('mongoose')


const adSchema = new mongoose.Schema({
    name: String,
    owner: String,
    link: {
        type: String,
        required: true
    },
    squarePicture: {
        url: String
    },
    rectanglePicture: {
        url: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
    },
    visible: {
        type: Boolean,
        default: false
    }

},{timestamps: true})


module.exports = new mongoose.model('ad', adSchema);