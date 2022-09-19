const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
    },
    img: String,
    blocks: [{
        id: Number,
        content: String,
        type: {type: String},
        url: String,
        credits: {
            content: String,
            link: String
        },
        description: String
    }],
    briefContent: String,
    slug: {
        type: String,
    },
    visible: {
        type: Boolean,
        default: false
    },
    postedAt: {
        type: Date,
        default: Date.now()

    }


},{timestamps: true})

// postSchema.pre('save', async function(next){
//     const hash = await bcrypt.hash(this.password, 10);
//     this.password = hash;
    
  
//     next();
//   });

module.exports = new mongoose.model('post', postSchema);