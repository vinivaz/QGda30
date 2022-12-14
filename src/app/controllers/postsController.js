const routes = require('express').Router();
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')
const postsModel = require('../models/posts')
const homeModel = require('../models/home')
const topicModel = require('../models/topic')
const imgHandler = require('../middlewares/multer');

const authConfig = require('../middlewares/auth');

routes.use(authConfig)

function getFirstImg(post){
    for(var i = 0; i < post.blocks.length; i++){
      if(post.blocks[i].type == 'img'){
        return post.blocks[i].url
      }
    }
}

function getInicialTxt(post){
    for(var i = 0; i < post.blocks.length; i++){
      if(post.blocks[i].type == 'text'){
          var plainTxt = post.blocks[i].content.replace(/<[^>]*>/g, '');

          if(plainTxt.length > 120){

            plainTxt = plainTxt.slice(0, -(plainTxt.length - 120)) + "..."
            
          }

        return plainTxt;
      }
    }
  }

routes.get('/', async(req, res) => {
    try{
        
        const posts = await postsModel.find()
        .populate('author', ['name','profile_img'])
        .sort({ createdAt: -1 })
        return res.send(posts)
    }catch(err){
        
    }
    
})

routes.get('/drafts', async(req, res) => {
    try{
        
        const posts = await postsModel.find({visible: false})
        .populate('author', ['name','profile_img'])
        .sort({ createdAt: -1 })
        return res.send(posts)
    }catch(err){
        console.log(err)
        return res.json({error: 'Erro ao procurar rascunhos'})
    }
    
})

routes.get('/published', async(req, res) => {
    try{
        
        const posts = await postsModel.find({visible: true})
        .populate('author', ['name','profile_img'])
        .sort({ createdAt: -1 })
        return res.send(posts)
    }catch(err){
        console.log(err)
        return res.json({error: 'Erro ao procurar posts publicados'})
    }
    
})

// routes.get('/:slug', async(req, res) => {
//     try{
//         const { slug } = req.params;

//         const singlePost = await postsModel.findOne({slug})
        
//         return res.send(singlePost)
//     }catch(err){
        
//     }
    
// })

routes.get('/:postId', async(req, res) => {
    try{
        const { postId } = req.params;

        const singlePost = await postsModel.findById(postId)
        .populate('author', ['name','profile_img'],)
        return res.send(singlePost)
    }catch(err){
        
    }
    
})

routes.post('/', async(req, res) => {
    console.log('aaaaa')
    try{
        const { post } = req.body;
        //console.log(post)

        const slug = slugify(post.title, {
            remove: /[*+~.,()&'"!:@]/g,
            lower: true,
        })

        console.log(post.title, slug)
        
        const existigPost = await postsModel.findOne({slug})

        if(existigPost){
            return res.json({error: 'Esse t??tulo j?? existe'})
        }

        const img = getFirstImg(post)
        const briefContent = getInicialTxt(post)

        var topic; 

        if(!post.topic){
            topic = "NOT??CIA"
        }else{
            topic = post.topic
        }

        const topicList = await topicModel.findOneAndUpdate({name: topic},{name: topic},{new: true, upsert:true})
        
        const newPost = await postsModel.create({
            title: post.title,
            author: req.userId,
            blocks: post.blocks,
            slug: post.slug,
            visible: post.visible,
            topic: topic,
            img,
            briefContent 
        })

        console.log(newPost)
        
        return res.json(newPost)
    }catch(err){
        console.log(err)
    }
    
})

routes.put('/first_publish', async(req, res) => {

    try{

        const {_id} = req.body._id
        const updatedPost = await postsModel.findByIdAndUpdate(
            _id,
            {

                visible: true,

                postedAt: Date.now()
            },
            {new:true}
        );
    }catch(err){
        console.log(err)
    }
    
})

routes.put('/', async(req, res) => {
    try{
        const { _id, title, author, blocks, visible, topic, postedAt } = req.body.post;

        const slug = slugify(title, {
            remove: /[*+~.,()&'"!:@]/g,
            lower: true,
        })

        console.log(title, slug)

        if(visible == false){
            var homeConfig = await homeModel.findOne()

            var {highlights, banner, morePosts} = homeConfig

            if(highlights.includes(_id)){
                highlights = highlights.filter(id => id != _id)
            }

            if(banner.includes(_id)){
                banner = banner.filter(id => id != _id)
            }

            if(morePosts.includes(_id)){
                morePosts = morePosts.filter(id => id != _id)
            }

            if(homeConfig.highlights != highlights || homeConfig.banner != banner || homeConfig.morePosts != morePosts){
                await homeModel.findByIdAndUpdate(
                    homeConfig._id,
                    {
                        banner,
                        morePosts,
                        highlights,
                    },
                    {new:true}
                );
            }



        }

        const checkForSlug = await postsModel.findOne({slug})
        
        if(checkForSlug && checkForSlug._id != _id){
            console.log(checkForSlug, _id)
            return res.json({error: 'Esse t??tulo j?? existe'})
        }
        
        const img = getFirstImg(req.body.post)
        const briefContent = getInicialTxt(req.body.post)

        var topicList;

        if(topic){
            topicList = await topicModel.findOneAndUpdate({name: topic},{name: topic},{new: true, upsert:true})
        }

        var postOpts;

        if(visible == true && !postedAt){
            postOpts = {
                title,
                author: req.userId,
                blocks,
                slug,
                visible,
                topic,
                img,
                briefContent,
                postedAt: Date.now()
            }
        }else{
            postOpts = {
                title,
                author: req.userId,
                blocks,
                slug,
                visible,
                topic,
                img,
                briefContent
            }
        }
        
        const updatedPost = await postsModel.findByIdAndUpdate(
            _id,
            postOpts,
            {new:true}
        );
        

        await updatedPost.populate('author', ['name','profile_img']);
        
    
        console.log(updatedPost)
        
        return res.json(updatedPost)
    }catch(err){
        console.log(err)
    }
    
})

routes.delete('/:postId', async(req, res) => {
    try{
        const { postId } = req.params;


        
        
        const deletedPost = await postsModel.findByIdAndDelete(postId);

        var homeConfig = await homeModel.findOne()

            var {highlights, banner, morePosts} = homeConfig

            if(highlights.includes(postId)){
                highlights = highlights.filter(id => id != postId)
            }

            if(banner.includes(postId)){
                banner = banner.filter(id => id != postId)
            }

            if(morePosts.includes(postId)){
                morePosts = morePosts.filter(id => id != postId)
            }

            if(homeConfig.highlights != highlights || homeConfig.banner != banner || homeConfig.morePosts != morePosts){
                await homeModel.findByIdAndUpdate(
                    homeConfig.postId,
                    {
                        banner,
                        morePosts,
                        highlights,
                    },
                    {new:true}
                );
            }

        console.log(deletedPost)
        
        return res.json({response: "Post has been deleted", deletedPost})
    }catch(err){
        console.log(err)
    }
    
})

routes.post('/save_image', imgHandler, async(req, res) => {
    try{
          
        const url = `https://qgda30.herokuapp.com/images/${req.file.filename}`
        
        return res.json(url)
    }catch(err){
        console.log(err)
    }
})

routes.delete('/delete_image/:imgName', async(req, res) => {
    
    try{
        const { imgName } = req.params;
        
        // img = url.slice(30)
        console.log(imgName)
        fs.unlinkSync(path.resolve(__dirname, "..", "..", "..", "tmp", "images", imgName))
        console.log('deu certoo')
        
        return res.json({result: 'ok'})
    }catch(err){
        console.log(err)
    }
})

module.exports = routes

