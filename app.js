if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const Result = require("./models/result")

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
  })
);

app.post("/signin", passport.authenticate("local"), (req, res) => {
  // console.log("signied user", req.user);
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

app.get("/:company/:testName", async (req, res) => {
  const { company, testName } = req.params;
  const testData = await TestQuestion.find({
    $or: [{ company }, { testName }],
  });
  // const data = User.find({});
  // console.log(testData);
  res.json({ data: testData });
});
app.get("/:company/:enrollment", async (req, res) => {
  const { company, enrollment } = req.params;
  const testHistoryData = await Result.find({
    $or: [{ company }, { enrollment }],
  });
  // const data = User.find({});
  // console.log(testData);
  res.json({ data: testHistoryData });
});



app.post("/test/submit", async (req,res)=>{
  try {
    const { enrollment, marks, company, testName, time, date } = req.body;

    // Create a new result entry
    const newResult = new Result({
      enrollment,
      marks,
      company,
      test_name:testName,
      time,
      date
    });

    await newResult.save();
    res.json({ message: "Test result saved successfully!" });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.json({ message: "Server error" });
  }
});