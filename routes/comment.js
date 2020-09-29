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

router.get('/:commentId/edit', allowModify, function(req, res) {
    Comment.findById(req.params.commentId, function(err, found) {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/edit', {campgroundId: req.params.id, comment: found})
        }
    })
})

router.put('/:commentId', allowModify, function(req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//router.delete()

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function allowModify(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function(err, found) {
            if (err) {
                res.redirect('back')
            } else {
                if (found.author.id.equals(req.user._id)) 
                    return next()
                else
                    res.redirect('back')
            }
        })
    } else {
        res.redirect('back')
    }
}

module.exports = router