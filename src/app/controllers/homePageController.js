const routes = require('express').Router();
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')
const postsModel = require('../models/posts')
const homeModel = require('../models/home')
const imgHandler = require('../middlewares/multer');

const authConfig = require('../middlewares/auth');

routes.use(authConfig)


routes.get('/', async(req, res) => {
    try{

        const homeConfig = await homeModel.findOne()
        .populate({ path: 'highlights', visible: { $ne: true } })
        .populate({ path: 'banner', visible: { $ne: true } })
        return res.json(homeConfig)
    }catch(err){
        
    }
    
})

routes.post('/', async(req, res) => {
    try{
        
    const homeConfig = await homeModel.create({
        banner: [
            '62cf39b8a51af7c2078d5503',
            '62d3773cf18362464ae2aa04',
            '62df5cc54414523971e9f3e1'
        ],
        morePosts: [
            '62cf39b8a51af7c2078d5503',
            '62d3773cf18362464ae2aa04',
            '62df5cc54414523971e9f3e1'
        ],
        highlights: [
            '62cf39b8a51af7c2078d5503',
            '62d3773cf18362464ae2aa04',
            '62df5cc54414523971e9f3e1'
        ]
    })

    await homeConfig
    .populate({ path: 'highlights', visible: { $ne: true } })
    .populate({ path: 'banner', visible: { $ne: true } })

    console.log(homeConfig)
        
        return res.json(homeConfig)
    }catch(err){
        console.log(err)
    }
    
})

routes.put('/', async(req, res) => {
    try{
        const { banner, morePosts, highlights } = req.body.homeConfig;
        
        const updatedHomePage = await homeModel.findByIdAndUpdate(
            _id,
            {
                banner,
                morePosts,
                highlights,
            },
            {new:true}
        );

        await updatedHomePage
            .populate({ path: 'highlights', visible: { $ne: true } })
            .populate({ path: 'banner', visible: { $ne: true } })
        
    
        console.log(updatedHomePage)
        
        return res.json(updatedHomePage)
    }catch(err){
        console.log(err)
    }
    
})

// function getFirstImg(post){
//     for(var i = 0; i < post.blocks.length; i++){
//       if(post.blocks[i].type == 'img'){
//         return post.blocks[i].url
//       }
//     }
// }

// function getInicialTxt(post){
//     for(var i = 0; i < post.blocks.length; i++){
//       if(post.blocks[i].type == 'text'){
//         return post.blocks[i].content.replace(/<[^>]*>/g, '');
//       }
//     }
//   }

// routes.get('/', async(req, res) => {
//     try{
        
//         const posts = await postsModel.find()
//         .populate('author', ['name','profile_img'],)
//         return res.send(posts)
//     }catch(err){
        
//     }
    
// })

// routes.get('/', async(req, res) => {
//     try{
        
//         const homeConfig = await homeModel.find()
//         // .populate('author', ['name','profile_img'],)
//         return res.send(homeConfig)
//     }catch(err){
//         console.log(err)
//         return res.json({error: 'Erro ao procurar dados pr'})
//     }
    
// })

// routes.get('/published', async(req, res) => {
//     try{
        
//         const posts = await postsModel.find({visible: true})
//         .populate('author', ['name','profile_img'],)
//         return res.send(posts)
//     }catch(err){
//         console.log(err)
//         return res.json({error: 'Erro ao procurar posts publicados'})
//     }
    
// })

// routes.get('/:slug', async(req, res) => {
//     try{
//         const { slug } = req.params;

//         const singlePost = await postsModel.findOne({slug})
        
//         return res.send(singlePost)
//     }catch(err){
        
//     }
    
// })



// routes.delete('/:postId', async(req, res) => {
//     try{
//         const { postId } = req.params;
        
        
//         const deletedPost = await postsModel.findByIdAndDelete(postId);
//         console.log(deletedPost)
        
//         return res.json({response: "Post has been deleted", deletedPost})
//     }catch(err){
//         console.log(err)
//     }
    
// })

// routes.post('/save_image', imgHandler, async(req, res) => {
//     try{
          
//         const url = `https://qgda30.herokuapp.com/images/${req.file.filename}`
        
//         return res.json(url)
//     }catch(err){
//         console.log(err)
//     }
// })

// routes.delete('/delete_image/:imgName', async(req, res) => {
    
//     try{
//         const { imgName } = req.params;
        
//         // img = url.slice(30)
//         console.log(imgName)
//         fs.unlinkSync(path.resolve(__dirname, "..", "..", "..", "tmp", "images", imgName))
//         console.log('deu certoo')
        
//         return res.json({result: 'ok'})
//     }catch(err){
//         console.log(err)
//     }
// })

module.exports = routes

