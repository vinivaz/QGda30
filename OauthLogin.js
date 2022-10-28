

const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
const PORT = 3000;
const db = require("./db");

db.connect();
app.listen(PORT, () => {
 console.log(`Listening on port ${PORT}`);
});

const passport = require("passport");
require("./passportConfig")(passport);

// Redirect the user to the Google signin page 
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })

);

// Retrieve user data using the access token received 
// app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", { session: false }),
//     (req, res) => {
//     res.redirect("/profile/");
//     }
// );

app.get(
    "/auth/google/callback",
    passport.authenticate('google', { session: false }),
    (req, res) => {
        jwt.sign(
            { user: req.user },

            "secretKey",

            { expiresIn: "1h" },

            (err, token) => {
                if (err) {
                    return res.json({
                        token: null,
                    });
                }

                res.json({token,});
            }
        );
    }
);
   
// profile route after successful sign in
app.get("/profile", (req, res) => {
    console.log(req);
    res.send("Welcome");
});


//Outro file

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./userModel");


module.exports = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback : true
        },

        async (request, accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ 'google.id': profile.id });
                // if user exists return the user 
                if (existingUser) {
                    return done(null, existingUser);
                }
                // if user does not exist create a new user 
                console.log('Creating new user...');
                const newUser = new User({
                    method: 'google',
                    google: {
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                    }
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
        }
    ));

    passport.use(
        new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: "secretKey",
        },
        async (jwtPayload, done) => {
            try {
                // Extract user
                const user = jwtPayload.user;
                done(null, user); 
            } catch (error) {
                done(error, false);
            }
        })
    );
}