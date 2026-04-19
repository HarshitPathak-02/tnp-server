const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  test_name: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  test_type: {
    type: String, // "mcq" | "coding"
    required: true,
  },

  marks: {
    type: Number, // 🔥 changed from String → Number (important)
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  time: {
    type: String,
  },

  // ✅ MCQ answers
  answers: [
    {
      questionId: String,
      selected: String,
      correct: String,
    },
  ],

  // ✅ CODING answers
  codingAnswers: [
    {
      questionId: String,
      code: String,
      passed: Number,
      total: Number,
    },
  ],

  // 🤖 AI Analysis
  aiAnalysis: {
    type: String,
  },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;