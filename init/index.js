const mongoose = require("mongoose");

const tcsAptitudeQuestions = require("./data");
const TestQuestion = require("../models/testQuestions");

async function main() {
  await mongoose.connect("mongodb+srv://mrpathak07:g8TuRqcu71z2Sk5Q@cluster0.xutne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error occured", err);
  });

const initDB = async () => {
  await TestQuestion.deleteMany({});
  await TestQuestion.insertMany(tcsAptitudeQuestions.tcsAptitudeQuestions);
  console.log("data is initialized");
};
initDB();
