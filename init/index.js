const mongoose = require("mongoose");

const tcsAptitudeQuestions = require("./data");
const TcsTestQuestion = require("../models/tcsTestQuestions");

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error occured", err);
  });

const initDB = async () => {
  await TcsTestQuestion.deleteMany({});
  await TcsTestQuestion.insertMany(tcsAptitudeQuestions.tcsAptitudeQuestions);
  console.log("data is initialized");
};
initDB();
