const mongoose = require("mongoose");

const tcsAptitudeQuestions = require("./data");
const TestQuestion = require("../models/testQuestions");

async function main() {
  await mongoose.connect("");
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
  await TestQuestion.insertMany(tcsAptitudeQuestions.tcsAptitudeQuestions);
  console.log("data is initialized");
};
initDB();
