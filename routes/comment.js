const   express = require('express')
        Campground = require('../models/campground')
        Comment = require('../models/comment')

let router = express.Router({mergeParams: true})

router.get('/new', isLoggedIn, function(req, res) {
    res.render('comments/new', {campgroundId: req.params.id})
})

router.post('/', function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    console.log(err)
                } else {
                    foundCampground.comments.push(createdComment)
                    foundCampground.save(function(err, pushedItem) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('comment created')
                            res.redirect('/campgrounds/' + req.params.id)
                        }
                    })
                }
            })
        }
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

module.exports = router