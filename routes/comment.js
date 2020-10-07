const   express = require('express'),
        Campground = require('../models/campground'),
        Comment = require('../models/comment'),
        middleware = require('../middleware')

let router = express.Router({mergeParams: true})

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('comments/new', {campgroundId: req.params.id})
})

router.post('/', function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            let newComment = {
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }

            Comment.create(newComment, function(err, createdComment) {
                if (err) {
                    console.log(err)
                } else {
                    // another way to save id and username
                    // createdComment.author.id = req.user._id
                    // createdComment.author.username = req.user.username
                    // createdComment.save()
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

router.get('/:commentId/edit', middleware.allowModifyComment, function(req, res) {
    Comment.findById(req.params.commentId, function(err, found) {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/edit', {campgroundId: req.params.id, comment: found})
        }
    })
})

router.put('/:commentId', middleware.allowModifyComment, function(req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            req.flash('info', 'Comment edited')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete('/:commentId', middleware.allowModifyComment, function(req, res) {
    Comment.findByIdAndDelete(req.params.commentId, function(err) {
        if (err) {
            console.log(err)
        } else {
            req.flash('info', 'Comment deleted')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

module.exports = router