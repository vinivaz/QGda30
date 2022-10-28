const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const userModel = require('../app/models/owners').model('owner');
const freshmanModel = require('../app/models/freshmanList');

require('dotenv').config();


passport.use(
  new GoogleStrategy(
    {
      // options for strategy
      callbackURL: 'https://qgda30.herokuapp.com/auth/google/callback/',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      // check if user already exists
      const currentUser = await userModel.findOne({ email });

      if (currentUser) {

        if(currentUser.googleId == null){

          currentUser.googleId =  profile.id;

          await currentUser.save()

        }

        return done(null, currentUser);
        
      } else {

        const freshmanList = await freshmanModel.findOne({email})

        if(!freshmanList){
          return res.json({errorDialog: 'Esse email não tem registro na lista de login permitidos'})
        }

        const now = new Date();

        if(now > freshmanList.emailExpires){
          return res.json({ error: 'Token has expired'});
        }

        // register user and return
        const newUser = await new userModel({ email: email, googleId: profile.id }).save();
        return done(null, newUser);
      }
    }
  )
);
