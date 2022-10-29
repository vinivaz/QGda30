const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const ownerController = require('./app/controllers/ownerController');

const authSecret = require('./config/auth.json');


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

  .use(passport.initialize())

  .get('/login', (req, res) =>{
    return res.render('login.html')
  })

  .get(
    '/auth/google',
    passport.authenticate('google', {
      session: false,
      scope: ["profile", "email"],
      accessType: "offline",
      approvalPrompt: "force"
    })
  )

  .get('/auth/google/callback/', (req, res, next) => {

    passport.authenticate('google', (err, user, info) => {


      //if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }

      return res.json({
        user,
        token: jwt.sign({id: user._id},authSecret.secret,{expiresIn: 86400})
      }) 
    })(req, res, next);   
  })

  // .get(
  //   '/auth/google/callback/',
  //   passport.authenticate('google', { session: false }),
  //   (req, res) => {
 
  //     var { user } = req;

  //     return res.json({
  //       user,
  //       token: jwt.sign({id: user._id},authSecret.secret,{expiresIn: 86400})
  //     })      
  //   }
  // )

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