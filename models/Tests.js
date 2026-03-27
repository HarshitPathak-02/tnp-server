const mongoose = require("mongoose");

const TestsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  questions: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
});

const Tests = mongoose.model("Tests", TestsSchema);

module.exports = Tests;
