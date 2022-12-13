const passport= require('passport')
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");
const mongoose = require('mongoose')
function init(passport) {
  //var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
  
  passport.use(new GoogleStrategy({
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
     passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {
      try {
    const {state}=request.query
        let user = await User.findOne({ _id: profile.id,role:state })
        let admins= await User.findOne({ role: "admin" })
        let book_s= admins.book

        if (user) {
          done(null, user)
        } else if(state==="customer"){
                const newUser = {
        _id: profile.id,
        name: profile.displayName,
        email: profile.email,
        role: "customer",
        book: book_s
      }
         user= await User.create(newUser)
         done(null,user)
        }
        else{
          done(null, false, { message: "No admin with this id exists!!" });
        }
      } catch (err) {
        console.error(err)
      }

    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
