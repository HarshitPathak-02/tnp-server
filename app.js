if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const Result = require("./models/result");

const generateAIAnalysis = require("./services/ai-analysis");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { saveRedirectUrl, isLoggedIn } = require("./middleware");

const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen((port = 8000), (req, res) => {
  console.log(`Server is listening to port ${port}`);
});

const sessionOptions = {
  secret: "secretcodeforme",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const nodemailer = require("nodemailer");
const TestQuestion = require("./models/testQuestions");
const Tests = require("./models/Tests");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harshithogya.hp@gmail.com",
    pass: "rtei wskq uldz rsnu",
  },
});

app.get("/", (req, res) => {
  res.send("backend ok");
});

app.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let {
        fullname,
        username,
        email,
        phone,
        college,
        branch,
        enrollment,
        password,
      } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { enrollment }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or Enrollment already exists!" });
      }
      const newUser = new User({
        fullname,
        username,
        email,
        phone,
        college,
        branch,
        enrollment,
        password,
      });
      const regsiteredUser = await User.register(newUser, password);
      res.json({ msg: "registered" });
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
    // console.log(regsiteredUser);
  }),
);

app.post("/signin", passport.authenticate("local"), (req, res) => {
  console.log("signied user", req.user);
  res.json({ msg: "done", user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ msg: "noLoggedOut" });
      return next(err);
    }
    res.json({ msg: "loggedOut" });
  });
});

app.post("/contact-us", async (req, res) => {
  const { name, email, message, city, organization } = req.body;

  const mailOptions = {
    from: email,
    to: "harshithogya.hp@gmail.com",
    subject: `Message from ${email}`,
    text: `
    Name: ${name}
    
    Email: ${email}
    
    Messsage: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Eamil sent to admin successfully");
    return res.json({ msg: "contact-form-saved" });
  } catch (error) {
    console.log("Email send failed with error:", error);
    return res.json({ msg: "contact form can not be send" });
  }
});

app.get("/test-analysis/:id", async (req, res) => {
  console.log("hit test-analysis");

  const { id } = req.params;
  console.log("id:", id);

  const test = await Result.findById(id);

  console.log("testt:", test);

  if (!test) {
    return res.status(404).json({ error: "Test not found" });
  }

  res.json({ data: test });
});

app.get("/:company/:testName", async (req, res) => {
  const { company, testName } = req.params;
  const testData = await TestQuestion.find({
    $or: [{ company }, { testName }],
  });
  // const data = User.find({});
  // console.log(testData);
  res.json({ data: testData });
});

app.get("/test-history", async (req, res) => {
  console.log("hit test historty");
  const { username } = req.query;
  const testHistoryData = await Result.find({ username: username });
  //   const formattedData = testHistoryData.map((item) => ({
  //     ...item._doc,
  //     date: item.date.toISOString().split("T")[0]  // Extract YYYY-MM-DD
  // }));
  // const data = User.find({});
  // console.log("test history data", testHistoryData);
  res.json({ data: testHistoryData });
});

app.post("/submit", async (req, res) => {
  try {
    const { username, testName, company, answers, marks } = req.body;

    let aiAnalysis;

    try {
      // 🔥 Try AI
      aiAnalysis = await generateAIAnalysis({
        test_name: testName,
        company,
        answers,
      });
    } catch (aiError) {
      console.error("AI failed:", aiError.message);

      // ✅ Fallback analysis (important)
      aiAnalysis = JSON.stringify({
        strengths: ["AI unavailable currently"],
        weaknesses: ["Detailed analysis not generated"],
        timeAnalysis: "Time analysis unavailable",
        accuracyAnalysis: "Accuracy analysis unavailable",
        examReadiness: "AI service unavailable",
        improvementTips: ["Please try again later"],
        recommendedFocusTopics: [],
      });
    }

    const newTest = await Result.create({
      username,
      test_name: testName,
      company,
      marks,
      answers,
      aiAnalysis,
      date: new Date(),
    });

    res.json({ success: true, data: newTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Test submission failed" });
  }
});
