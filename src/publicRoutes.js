const routes = require('express').Router();

const ownerController = require('./app/controllers/ownerController');
const authConfig = require('./app/middlewares/auth');
const postsModel = require('./app/models/posts')
const adModel = require('./app/models/ad.js')
const homeModel = require('./app/models/home')

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
      return post.blocks[i].content.replace(/<[^>]*>/g, '');
    }
  }
}

routes

  .get('/home', async(req, res) => {
    try {
      const posts = await postsModel.find({visible: true})
      .populate('author', ['name','profile_img'])

        const homeConfig = await homeModel.findOne()
        .populate({ path: 'highlights', visible: { $ne: true } })
        .populate({ path: 'banner', visible: { $ne: true } })
        .populate({ path: 'morePosts', visible: { $ne: true } })

      posts.map(p => {
        var newDate = new Date(p.createdAt)

        // p.img = getFirstImg(p)

        p.date = `${newDate.getDate()}/${(newDate.getMonth() + 1)}/${newDate.getFullYear()}`

        p.briefContent = getInicialTxt(p)

      })

      const ads = await adModel.find({visible: true})

      return res.render('home.html', {
        banner: homeConfig.banner,
        highlights: homeConfig.highlights,
        morePosts: homeConfig.morePosts,
        posts,
        ads
      })
    } catch (err) {
      
    }
  })

  .get('/:slug', async(req, res) => {
    try{
      const { slug } = req.params;

      // const post = await postsModel.findOne({slug, visible: true})
      // .populate('author', ['name','profile_img'])

      const posts = await postsModel.find({visible: true})
      .populate('author', ['name','profile_img'])

      const post = posts.filter(post => post.slug == slug)[0]

      const ads = await adModel.find({visible: true})

      posts.map(p => {
        var newDate = new Date(p.createdAt)

        // p.img = getFirstImg(p)

        p.date = `${newDate.getDate()}/${(newDate.getMonth() + 1)}/${newDate.getFullYear()}`

        p.briefContent = getInicialTxt(p)

      })

      var newDate = new Date(post.createdAt)

      post.date =  `${newDate.getDate()}/${(newDate.getMonth() + 1)}/${newDate.getFullYear()}`

      return res.render('post.html', {post, posts, ads})
    }catch(err){
      console.log(err)
    }
  })
  // .use('/posts', require('./app/controllers/postsController'))
  // .use('/profile', require('./app/controllers/profileController'))

  // .get('/list', ownerController.list)
  // .post('/register', ownerController.register)
  // .post('/authenticate', ownerController.auth)
  // //.post('/owner/forgot_password', ownerController.forgotPassword)
  // //.post('/owner/change_password', ownerController.changePassword)
  // .delete('app/delete', ownerController.delete)

  // .get('/login', (req, res) =>{
  //   return res.render('login.html')
  // })
  

  // .get('/studio', setView, authConfig, (req, res) =>{
  //   return res.render('studio.html')
  // })

  // .get('/storage', setView, authConfig, (req, res) =>{
  //   return res.render('storage.html')
  // })

  // function setView(req, res, next){
  //   req.isView = true;
  //   next()
  // }



module.exports = routes;