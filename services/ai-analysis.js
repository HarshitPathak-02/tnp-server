// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey:
//     "",
// });

// const generateAIAnalysis = async (testData) => {
//   const { test_name, company, answers } = testData;

//   // 🔹 Calculate metrics
//   const total = answers.length;
//   const correct = answers.filter((a) => a.selected === a.correct).length;
//   const accuracy = ((correct / total) * 100).toFixed(2);

//   const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / total;

//   // 🔹 Topic breakdown
//   const topicStats = {};
//   answers.forEach((a) => {
//     if (!topicStats[a.topic]) {
//       topicStats[a.topic] = { total: 0, correct: 0 };
//     }
//     topicStats[a.topic].total++;
//     if (a.selected === a.correct) {
//       topicStats[a.topic].correct++;
//     }
//   });

//   // 🔥 PROMPT (VERY IMPORTANT)
//   const prompt = `
// You are an expert placement test analyst.

// Analyze this student's test performance deeply.

// Test: ${test_name}
// Company: ${company}

// Overall:
// - Accuracy: ${accuracy}%
// - Average Time per Question: ${avgTime.toFixed(2)} seconds

// Topic-wise Performance:
// ${JSON.stringify(topicStats, null, 2)}

// Question Data:
// ${JSON.stringify(answers.slice(0, 10), null, 2)}

// Give response STRICTLY in JSON format like this:

// {
//   "strengths": [],
//   "weaknesses": [],
//   "timeAnalysis": "",
//   "accuracyAnalysis": "",
//   "examReadiness": "",
//   "improvementTips": [],
//   "recommendedFocusTopics": []
// }

// Be specific, not generic.
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//   });

//   const raw = response.choices[0].message.content;

//   // Extract only JSON part
//   const jsonStart = raw.indexOf("{");
//   const jsonEnd = raw.lastIndexOf("}") + 1;

//   const cleanResponse = raw.slice(jsonStart, jsonEnd);

//   return cleanResponse;
// };

// module.exports = generateAIAnalysis;

const axios = require("axios");

const HF_API_KEY = ""; // 🔥 add key

const generateAIAnalysis = ({
  test_name,
  answers = [],
  codingAnswers = [],
  test_type,
}) => {
  let strengths = [];
  let weaknesses = [];
  let tips = [];
  let topics = [];

  let accuracy = 0;
  let avgTime = 0;

  // ======================
  // 🔥 MCQ ANALYSIS
  // ======================
  if (test_type === "mcq") {
    const total = answers.length;
    const correct = answers.filter(
      (a) => a.selected === a.correct
    ).length;

    accuracy = total ? (correct / total) * 100 : 0;

    avgTime =
      total > 0
        ? answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / total
        : 0;
  }

  // ======================
  // 🔥 CODING ANALYSIS
  // ======================
  if (test_type === "coding") {
    let totalPassed = 0;
    let totalCases = 0;

    codingAnswers.forEach((q) => {
      totalPassed += q.passed;
      totalCases += q.total;
    });

    accuracy = totalCases ? (totalPassed / totalCases) * 100 : 0;

    avgTime = 0; // coding → optional
  }

  // ======================
  // 🔥 COMMON LOGIC
  // ======================

  if (accuracy >= 80) {
    strengths.push("Excellent performance");
  } else if (accuracy >= 60) {
    strengths.push("Good performance");
    weaknesses.push("Needs improvement in edge cases");
  } else {
    weaknesses.push("Low accuracy");
    tips.push("Practice more questions");
  }

  if (avgTime > 30) {
    weaknesses.push("Slow solving speed");
    tips.push("Improve speed with timed practice");
  } else {
    strengths.push("Good speed");
  }

  if (test_name.toLowerCase().includes("coding")) {
    topics.push("DSA");
    tips.push("Practice LeetCode-style problems");
  }

  return JSON.stringify({
    strengths,
    weaknesses,

    // 🔥 ALWAYS RETURN THESE
    timeAnalysis: `Average time per question: ${avgTime.toFixed(2)} sec`,
    accuracyAnalysis: `Accuracy: ${accuracy.toFixed(2)}%`,

    examReadiness:
      accuracy > 75
        ? "You are ready for placement tests"
        : "You need more practice",

    improvementTips: tips,
    recommendedFocusTopics: topics,
  });
};

module.exports = generateAIAnalysis;
