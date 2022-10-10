import mongoose from "mongoose";

const votes = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    voteTimestamp: {
        type: Number,
        required: true,
    }
})

export = mongoose.model('votes', votes)