const Campground = require('../models/campground')
const Comment = require('../models/comment')

module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    },
    allowModifyCampground: function(req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function(err, found) {
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
    },
    allowModifyComment: function(req, res, next) {
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
}