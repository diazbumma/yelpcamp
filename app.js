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

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

let Campground = mongoose.model('Campground', campgroundSchema)

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

    Campground.create({
        name: name, 
        image: image
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

app.get('*', function(req, res) {
    res.send('Ups, I think you lost buddy..')
})

app.listen(PORT, function() {
    console.log('YelpCamp is listening at port ' + PORT)
})
