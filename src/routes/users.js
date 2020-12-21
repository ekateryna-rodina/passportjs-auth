const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// model User 
const User = require('../models/User');

// login get
router.get('/login', function(req, res){
    res.render('login')
})
// register get
router.get('/register', (req, res) => {
    res.render('register')
})
// register post 
router.post('/register', (req, res) =>{
    // validate input
    let errors = [];
    const {name, email, password, password2} = req.body
    if (!name || !email || !password){
        errors.push({'msg': 'Please fill in all the fields'});
    }
    if (password != password2){
        errors.push({'msg': 'Passwords do not match'});
    }
    if (password.lenght < 6){
        errors.push({'msg': 'Passwords length should be at least 6 characters'});
    }

    if (errors.length > 0){
        res.render('register', {
            errors, 
            name, 
            email, 
            password, 
            password2
        });
    } else {
        // Validation passed
        // If user exists
        User.findOne({email: email})
        .then(user => {
            if(user) {
                errors.push({'msg': 'Email is already registered'})
                res.render('register', {
                    errors, 
                    name, 
                    email, 
                    password, 
                    password2
                });
            } else {
                const newUser = new User({
                    name, 
                    email, 
                    password});
                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Set password to hashed
                    newUser.password = hash
                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and ready to log in');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                }))
            }
        })
    }   
});

// login post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

// logout get
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;