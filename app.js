if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { saveRedirectUrl, isLoggedIn } = require("./middleware");

const app = express();

const cors = require("cors");
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/",(req,res)=>{
  res.send('backend ok')
})

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
      res.json({msg:"registered"});
    } catch (e) {
      console.log(e);
      res.json({error:e})
    }
    // console.log(regsiteredUser);
  })
);

app.post("/signin", passport.authenticate("local"),(req,res)=>{
    res.json({msg:'done'})
  }
)
