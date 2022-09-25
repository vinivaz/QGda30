const mongoose = require('mongoose')


const homePageSchema = new mongoose.Schema({
    banner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
    freshPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
    highlights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
    morePosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
    postedAt: {
        type: Date,
        default: '',

    }


},{timestamps: true})

// postSchema.pre('save', async function(next){
//     const hash = await bcrypt.hash(this.password, 10);
//     this.password = hash;
    
  
//     next();
//   });

module.exports = new mongoose.model('home', homePageSchema);