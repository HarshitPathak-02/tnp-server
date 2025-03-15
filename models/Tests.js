const mongoose = require('mongoose');

const TestsSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    user: {
        type: String,
        required:true
    },
    time: {
        type:int,
        required:true
    },
    questions: {
        type:String,
        required:true
    },
    marks: {
        type:int,
        required:true
    },
    company: {
        type:String,
        required:true
    }
});

const Tests = mongoose.model('Tests',contactSchema)

module.exports = Tests;