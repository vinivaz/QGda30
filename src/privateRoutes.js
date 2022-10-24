const routes = require('express').Router();

const ownerController = require('./app/controllers/ownerController');
const authConfig = require('./app/middlewares/auth');


routes
  .use('/posts', require('./app/controllers/postsController'))
  .use('/topics', require('./app/controllers/topicsController'))
  .use('/home', require('./app/controllers/homePageController'))
  .use('/ads', require('./app/controllers/adsController'))
  .use('/profile', require('./app/controllers/profileController'))
  .use('/freshman', require('./app/controllers/freshmanController'))

  .get('/list', ownerController.list)
  .post('/register', ownerController.register)
  .post('/authenticate', ownerController.auth)
  //.post('/owner/forgot_password', ownerController.forgotPassword)
  //.post('/owner/change_password', ownerController.changePassword)
  .delete('app/delete', ownerController.delete)

  .get('/login', (req, res) =>{
    return res.render('login.html')
  })

  .get('/studio', setView, (req, res) =>{
    return res.render('studio.html')
  })

  .get('/storage', setView, (req, res) =>{
    return res.render('storage.html')
  })

  function setView(req, res, next){
    req.isView = true;
    next()
  }



module.exports = routes;