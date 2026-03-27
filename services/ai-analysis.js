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

const HF_API_KEY = "";

const generateAIAnalysis = async (testData) => {
  const { test_name, company, answers } = testData;

  // 🔹 Basic metrics
  const total = answers.length;
  const correct = answers.filter((a) => a.selected === a.correct).length;
  const accuracy = ((correct / total) * 100).toFixed(2);

  const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / total;

  // 🔥 PROMPT
  const prompt = `
Analyze this student's test performance.

Test: ${test_name}
Company: ${company}

Accuracy: ${accuracy}%
Average Time: ${avgTime.toFixed(2)} seconds

Answers:
${JSON.stringify(answers.slice(0, 10))}

Return ONLY JSON:
{
  "strengths": [],
  "weaknesses": [],
  "timeAnalysis": "",
  "accuracyAnalysis": "",
  "examReadiness": "",
  "improvementTips": [],
  "recommendedFocusTopics": []
}
`;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/models/google/flan-t5-large",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      },
    );

    const raw = response.data[0].generated_text;

    // 🔥 Extract JSON
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}") + 1;

    return raw.slice(start, end);
  } catch (err) {
    console.error("HF AI Error:", err.response?.data || err.message);

    // ✅ fallback
    return JSON.stringify({
      strengths: ["AI temporarily unavailable"],
      weaknesses: ["Try again later"],
      timeAnalysis: "",
      accuracyAnalysis: "",
      examReadiness: "",
      improvementTips: [],
      recommendedFocusTopics: [],
    });
  }
};

module.exports = generateAIAnalysis;
