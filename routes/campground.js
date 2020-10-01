const   express = require('express'),
        Campground = require('../models/campground'),
        middleware = require('../middleware')

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

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving detailed campground info successful')

            // let showButton = false
            // if (req.user) 
            //     showButton = data.author.id.equals(req.user._id)
    
            res.render('campgrounds/camp_info', {campground: data})
        }
    })
})

router.get('/:id/edit', middleware.allowModifyCampground, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/edit', {campground: foundCampground})
        }
    })
})

router.put('/:id', middleware.allowModifyCampground, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            console.log(foundCampground._id + ' updated')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete('/:id', middleware.allowModifyCampground, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log(req.params.id + ' deleted')
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router