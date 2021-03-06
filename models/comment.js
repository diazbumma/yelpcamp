const mongoose = require('mongoose')

let commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Comment', commentSchema)