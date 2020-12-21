const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const  passport = require('passport');

// Passport config
require('./managers/passport')(passport);

// Express session
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//  Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// DB config
const db = require('./config/keys').MongoURI;
// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(err => console.log('MongoDB connected'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/', require('./routes'));
app.use('/users', require('./routes/users'));

const port = process.env.port || 5000;

app.listen(port, console.log(`Server started on port ${port}`));
