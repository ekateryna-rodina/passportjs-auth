module.exports = {
    ensureAuth: function(req, res, next){
        if (req.isAuthenticated) {
            next();
        }

        req.flash('error_msg', 'Please login to access the resource');
        res.redirect('users/login');
    }

}