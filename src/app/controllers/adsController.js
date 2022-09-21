const routes = require('express').Router();
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')
const adModel = require('../models/ad.js')
const imgHandler = require('../middlewares/multer');

const authConfig = require('../middlewares/auth');

routes.use(authConfig)

routes.get('/', async(req, res) => {
    try{
        
        const ads = await adModel.find()
        .populate('creator', ['name','profile_img'],)
        return res.send(ads)
    }catch(err){
        
    }
    
})

routes.get('/drafts', async(req, res) => {
    try{
        
        const ads = await adModel.find({visible: false})
        .populate('creator', ['name','profile_img'],)
        return res.send(ads)
    }catch(err){
        console.log(err)
        return res.json({error: 'Erro ao procurar rascunhos'})
    }
    
})

routes.get('/published', async(req, res) => {
    try{
        
        const ads = await adModel.find({visible: true})
        .populate('creator', ['name','profile_img'],)
        return res.send(ads)
    }catch(err){
        console.log(err)
        return res.json({error: 'Erro ao procurar anúncios publicados'})
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

routes.get('/:adId', async(req, res) => {
    try{
        const { adId } = req.params;
    
        const singleAd = await adModel.findById(adId)
        .populate('creator', ['name','profile_img'])

        return res.json(singleAd)
    }catch(err){
        
    }
    
})

routes.post('/', async(req, res) => {
    try{
        const { name, owner, link, squarePicture, rectanglePicture, creator, visible } = req.body.ad;
    
        const newAd = await adModel.create({
            name,
            creator,
            owner,
            link,
            squarePicture,
            rectanglePicture,
            visible
        })

        return res.json(newAd)
    }catch(err){
        console.log(err)
    }
    
})

routes.put('/', async(req, res) => {
    try{
        const { name, owner, link, squarePicture, rectanglePicture, creator, visible, _id } = req.body.ad;      
        
        const updatedAd = await adModel.findByIdAndUpdate(
            _id,
            {
                name,
                creator,
                owner,
                link,
                squarePicture,
                rectanglePicture,
                visible
            },
            {new:true}
        );

        await updatedAd.populate('creator', ['name','profile_img']);
        
        return res.json(updatedAd)
    }catch(err){
        console.log(err)
    }
    
})

routes.delete('/:adId', async(req, res) => {
    try{
        const { adId } = req.params;
        
        
        const deletedAd = await adModel.findByIdAndDelete(adId);
        console.log(deletedAd)
        
        return res.json({response: "Post has been deleted", deletedAd})
    }catch(err){
        console.log(err)
    }
    
})

routes.post('/save_ad_image', imgHandler, async(req, res) => {
    try{
        console.log(req.file)
        const url = `https://qgda30.herokuapp.com/ad/${req.file.filename}`
        
        return res.json(url)
    }catch(err){
        console.log(err)
    }
})

routes.delete('/delete_ad_image/:imgName', async(req, res) => {
    
    try{
        const { imgName } = req.params;
        
        // img = url.slice(30)
        console.log(imgName)
        fs.unlinkSync(path.resolve(__dirname, "..", "..", "..", "tmp", "ad", imgName))
        console.log('deu certoo')
        
        return res.json({result: 'ok'})
    }catch(err){
        console.log(err)
    }
})

module.exports = routes

