const mongoose = require("mongoose");

const tcsAptitudeQuestions = require("./data");
const tcsCodingQuestions = require("./codingData");
const TestQuestion = require("../models/testQuestions");
const CodingQuestion = require("../models/codingQuestions");

async function main() {
  await mongoose.connect("mongodb+srv://mrpathak07:g8TuRqcu71z2Sk5Q@cluster0.xutne.mongodb.net/?appName=Cluster0");
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error occured", err);
  });

const initDB = async () => {
  // await TestQuestion.deleteMany({});
  // await TestQuestion.insertMany(tcsAptitudeQuestions.tcsAptitudeQuestions);
  await CodingQuestion.deleteMany({});
  await CodingQuestion.insertMany(tcsCodingQuestions);
  console.log("data is initialized");
};
initDB();
