const   express = require('express')
        Campground = require('../models/campground')

let router = express.Router({mergeParams: true})

router.get('/', function(req, res) {
    Campground.find({}, function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving data successful')
            res.render('campgrounds/campgrounds', {campgrounds: data})
        }
    })
})

router.post('/', function(req, res) {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description

    Campground.create({
        name: name, 
        image: image,
        description: description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong while inserting to the database')
            console.log(err)
        } else {
            console.log('Inserting data successful')
            res.redirect('/campgrounds')
        }
    })
})

router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving detailed campground info successful')
            res.render('campgrounds/camp_info', {campground: data})
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