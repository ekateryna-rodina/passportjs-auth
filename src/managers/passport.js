const LocalStrategy = require('passport-local').Strategy;
const moncgoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match user
            User.findOne({email: email})
                .then(user => {
                    if (!user){
                        // req.flash('error_msg', 'User does not exist')
                        return done(null, false, {message: 'User does not exist'})
                    } else {
                        // Match password string and bcrypt hash
                        bcrypt.compare(password, user.password, (err, isMatch) => { 
                            if(err) throw err
                            if (isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, {message: 'The password is incorrect'})
                            }
                        })
                    }
                })
                .catch((err) => console.log(err))
        })
    );

    passport.serializeUser((user, done) =>  {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}