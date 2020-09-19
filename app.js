// Dependencies
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        PORT = 3000

// Configuration
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to yelp_camp DB!')).catch(error => console.log(error.message))

// Models
const   Campground = require('./models/campground'),
        Comment = require('./models/comment'),
        User = require('./models/user'),
        seed = require('./seeds')

seed()

// Session Configuration
app.use(require('express-session')({
    secret: 'Lakad matatag normalin normalin',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Routes
app.get('/', function(req, res) {
    res.render('home')
})

app.get('/campgrounds', isLoggedIn, function(req, res) {
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
            res.redirect('/campgrounds')
        }
    })
})

app.get('/campgrounds/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving detailed campground info successful')
            res.render('campgrounds/camp_info', {campground: data})
        }
    })
})

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
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

// Auth routes
app.get('/register', function(req, res) {
    res.render('register')
})

app.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render('register')
        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds')
        })
    })
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {

})

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

app.get('*', function(req, res) {
    res.send('Ups, I think you lost buddy..')
})

app.listen(PORT, function() {
    console.log('YelpCamp is listening at port ' + PORT)
})
