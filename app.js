const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to yelp_camp DB!')).catch(error => console.log(error.message))

const Campground = require('./models/campground')
const seed = require('./seeds')

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
            res.render('campgrounds', {campgrounds: data})
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
    res.render('new')
})

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById({_id: req.params.id}).populate('comments').exec(function(err, data) {
        if (err) {
            console.log('Something wrong while retrieving data')
        } else {
            console.log('Retrieving detailed campground info successful')
            console.log(data)
            res.render('camp_info', {campground: data})
        }
    })
})

app.get('*', function(req, res) {
    res.send('Ups, I think you lost buddy..')
})

app.listen(PORT, function() {
    console.log('YelpCamp is listening at port ' + PORT)
})
