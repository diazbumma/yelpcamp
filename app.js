// Dependencies
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        flash = require('connect-flash'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        PORT = 3000

// Configuration
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(express.static(__dirname + "/public"))
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connected to yelp_camp DB!')).catch(error => console.log(error.message))

// Models
const   User = require('./models/user'),
        seed = require('./seeds')

//seed()

// Session Configuration
app.use(require('express-session')({
    secret: 'Lakad matatag normalin normalin',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    next()
})

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Routes
let campgroundRoutes = require('./routes/campground')
    commentRoutes = require('./routes/comment')
    authRoutes = require('./routes/auth')

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)
app.use('/', authRoutes)

app.get('/', function(req, res) {
    res.render('home')
})

app.get('*', function(req, res) {
    res.send('Ups, I think you lost buddy..')
})

app.listen(PORT, function() {
    console.log('YelpCamp is listening at port ' + PORT)
})
