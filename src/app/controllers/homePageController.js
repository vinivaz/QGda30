const routes = require('express').Router();

const homeModel = require('../models/home')


const authConfig = require('../middlewares/auth');

// routes.use(authConfig)


routes.get('/', async(req, res) => {
    try{

        const homeConfig = await homeModel.findOne()
        // .populate({ path: 'highlights', visible: { $ne: true } })
        // .populate({ path: 'banner', visible: { $ne: true } })
        return res.json(homeConfig)
    }catch(err){
        return res.json(err)
        
    }
    
})


routes.put('/', async(req, res) => {
    try{
        const { banner, morePosts, highlights } = req.body;

        const homeConfig = await homeModel.findOne()

        var newBannerList = homeConfig.banner;
        var newMorePostsList = homeConfig.morePosts;
        var newHighlightsList = homeConfig.highlights;

        if(banner && !newBannerList.includes(banner)){
            newBannerList.push(banner);
        }else if(banner && newBannerList.includes(banner)){
            
            newBannerList = newBannerList.filter(item => item != banner)
        }

        if(morePosts && !newMorePostsList.includes(morePosts)){
            newMorePostsList.push(morePosts);
        }else if(morePosts && newMorePostsList.includes(morePosts)){
            
            newMorePostsList = newMorePostsList.filter(item => item != morePosts)
        }

        if(highlights && !newHighlightsList.includes(highlights)){
            newHighlightsList.push(highlights);
        }else if(highlights && newHighlightsList.includes(highlights)){
            
            newHighlightsList = newHighlightsList.filter(item => item != highlights)
        }
        
        const updatedHomePage = await homeModel.findByIdAndUpdate(
            homeConfig._id,
            {
                banner: newBannerList,
                morePosts: newMorePostsList,
                highlights, newHighlightsList,
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
        return res.json({err: err})
    }
    
})



module.exports = routes

