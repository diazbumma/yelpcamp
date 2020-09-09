const   mongoose = require('mongoose'),
        Campground = require('./models/campground'),
        Comment = require('./models/comment')

let data = [
    {
        name: 'Green Trees Camp',
        image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'Camp at the forest side'
    },
    {
        name: 'Forest Camp',
        image:'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'Camp inside forest'
    },
    {
        name: 'Beach Camp',
        image:'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'Camp at the beach'
    },
    {
        name: 'Star Camp',
        image:'https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'Camp under the starlight'
    }
]

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            data.forEach(item => {
                Campground.create(item, function(err, createdCampground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Data ' + createdCampground._id + ' created')
                        Comment.create({
                            text: 'Lakaad Matataaaaaaaag! Normalin normalin!',
                            author: 'Agent N0tail'
                        }, function(err, comment) {
                            if (err) {
                                console.log(err)
                            } else {
                                createdCampground.comments.push(comment)
                                createdCampground.save(function(err, data) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log('Comment created!')
                                        console.log(data)
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = seedDB