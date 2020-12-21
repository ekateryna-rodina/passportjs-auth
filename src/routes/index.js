const express = require('express');
const { ensureAuth } = require('../managers/auth');

const router = express.Router();

// welcome page
router.get('/', (req, res) => {
    res.render('welcome');
});

// dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        userName: req.user.name
    });
})

module.exports = router;