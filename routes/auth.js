const   express = require('express')
        passport = require('passport')
        User = require('../models/user')

let router = express.Router()

router.get('/register', function(req, res) {
    res.render('register')
})

router.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render('register')
        }

        passport.authenticate('local')(req, res, function() {
            req.flash('info', 'Successfully signed up')
            res.redirect('/campgrounds')
        })
    })
})

router.get('/login', function(req, res) {
    res.render('login', {message: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {

})

router.get('/logout', function(req, res) {
    req.logout()
    req.flash('info', 'Logged out')
    res.redirect('/campgrounds')
})

module.exports = router