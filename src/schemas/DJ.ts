import mongoose from 'mongoose'

const DJ_ROLE = new mongoose.Schema({
    guildName: {
        type: String,
    },
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    roleId: {
        type: String,
        required: true,
        unique: true
    },
})

export = mongoose.model('DJ', DJ_ROLE)