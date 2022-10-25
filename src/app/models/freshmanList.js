const mongoose = require('mongoose')


const freshmanList = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    emailExpires:{
        type: Date

    },
    expired:{
        type:Boolean,
        
    }
},{timestamps: true})

module.exports = new mongoose.model('freshman', freshmanList);