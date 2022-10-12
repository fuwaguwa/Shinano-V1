import mongoose from "mongoose";

const nsfw = new mongoose.Schema({
    type: {// Category
        type: String, // File Format
        required: true,
        unique: true
    },
    links: [],
})

export = mongoose.model('nsfw', nsfw)