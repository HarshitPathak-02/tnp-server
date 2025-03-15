const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    location: {
        type: String,
        required:true
    },
    Type: {
        type:String,
        required:true
    },
    field: {
        type:string,
        required:true
    },
});

const Tests = mongoose.model('Tests',contactSchema)

module.exports = Tests;