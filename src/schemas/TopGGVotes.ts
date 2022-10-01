import mongoose from "mongoose";

const topggvote = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    hasVotedBefore: {
        type: Boolean,
        required: true
    }
})

export = mongoose.model('topggVote', topggvote)