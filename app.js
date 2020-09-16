const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        PORT = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to yelp_camp DB!')).catch(error => console.log(error.message))

const   Campground = require('./models/campground'),
        Comment = require('./models/comment'),
        User = require('./models/user'),
        seed = require('./seeds')

seed()

app.get('/', function(req, res) {
    res.render('home')
})

app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving data successful')
            res.render('campgrounds/campgrounds', {campgrounds: data})
        }
    })
})

app.post('/campgrounds', function(req, res) {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description

    Campground.create({
        name: name, 
        image: image,
        description: description
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong while inserting to the database')
            console.log(err)
        } else {
            console.log('Inserting data successful')
            console.log(data)
            res.redirect('/campgrounds')
        }
    })
})

app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving detailed campground info successful')
            console.log(data)
            res.render('campgrounds/camp_info', {campground: data})
        }
    })
})

app.get('/campgrounds/:id/comments/new', function(req, res) {
    res.render('comments/new', {campgroundId: req.params.id})
})

app.post('/campgrounds/:id/comments', function(req, res) {
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

app.get('*', function(req, res) {
    res.send('Ups, I think you lost buddy..')
})

app.listen(PORT, function() {
    console.log('YelpCamp is listening at port ' + PORT)
})
