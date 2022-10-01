import mongoose from 'mongoose'

const voting = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    lastVoted: {
        type: String,
        required: true
    }
})

export = mongoose.model('vote', voting)