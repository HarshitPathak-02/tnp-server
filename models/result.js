const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  marks: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    // required: true,
  },
  test_name: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
  },
  aiAnalysis: {
    type: String,
  },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
