const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestQuestionsSchema = new Schema({
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
    company: {
        type: String,
        required: true,
    },
    test_name: {
        type: String,
        required: true,
    },
})


const TestQuestion = mongoose.model("TestQuestion", TestQuestionsSchema);

module.exports = TestQuestion;


