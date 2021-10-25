//Name of a model start with capital letter (just a convention)
// const { date } = require('joi');
const mongoose = require('mongoose');
const ContactSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ContactName: {
        type: String,
        required: true
    },
    ContactEmail: {
        type: String,
        required: true
    },
    ContactPhone: {
        type: String,
        required: true
    },
    ContactType: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('contacts', ContactSchema);