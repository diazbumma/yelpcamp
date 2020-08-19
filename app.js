const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

let campgrounds = [
    {name: 'Merapi Park', image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Tidar Camp', image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Mountain Camp', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Kaliurang Camp', image: 'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350'}
]

app.get('/', function(req, res) {
    res.render('home')
})

app.get('/campgrounds', function(req, res) {
    res.render('campgrounds', {campgrounds: campgrounds})
})

app.post('/campgrounds', function(req, res) {
    let name = req.body.name
    let image = req.body.image
    campgrounds.push({name: name, image: image})
    res.redirect('/campgrounds')
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
