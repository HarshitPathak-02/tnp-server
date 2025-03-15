const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tcsTestQuestionsSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    correct_option: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
})


const TcsTestQuestion = mongoose.model("TcsTestQuestion", tcsTestQuestionsSchema);

module.exports = TcsTestQuestion;


