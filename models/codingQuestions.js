const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
});

const codingQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  input_format: {
    type: String,
    required: true,
  },

  output_format: {
    type: String,
    required: true,
  },

  sample_input: {
    type: String,
  },

  sample_output: {
    type: String,
  },

  // ✅ Visible test cases (shown to student)
  sampleTestCases: [testCaseSchema],

  // 🔒 Hidden test cases (for evaluation only)
  hiddenTestCases: [testCaseSchema],

  // 📊 Metadata (important for AI later)
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },

  tags: [
    {
      type: String, // e.g., "recursion", "math", "array"
    },
  ],

  // 🏢 Company & Test Mapping
  company: {
    type: String,
    required: true,
  },

  test_name: {
    type: String,
    required: true,
  },

  marks: {
    type: Number,
    default: 100,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CodingQuestion", codingQuestionSchema);