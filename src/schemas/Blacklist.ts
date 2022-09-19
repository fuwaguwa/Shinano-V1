import mongoose from "mongoose";

const blacklisted = new mongoose.Schema({
    blacklistedBy: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    }
})

export = mongoose.model('blacklisted', blacklisted)