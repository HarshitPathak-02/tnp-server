const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required:true
    },
    message: {
        type:String,
        required:true
    },
    organization: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    }
});

const Contact = mongoose.model('Contact',contactSchema)

module.exports = Contact;