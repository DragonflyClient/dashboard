const mongoose = require('mongoose')

const AccountLinkSchema = new mongoose.Schema({
    dragonflyUUID: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    expires_in: {
        type: Number,
        required: true
    },
    next_expiration: {
        type: Number,
        required: true
    }
})

const AccountLink = mongoose.model('AccountLink', AccountLinkSchema, 'spotify-links');

module.exports = AccountLink;