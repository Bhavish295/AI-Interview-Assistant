// ==============================
// AI INTERVIEW ASSISTANT BACKEND
// Node.js + Express + MongoDB
// ==============================

// ====== Install First ======
// npm init -y
// npm install express mongoose cors bcryptjs jsonwebtoken dotenv

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interview-assistant";

const memoryUsers = [];
const memoryQuestions = [
  {
    _id: "demo-q1",
    category: "Frontend",
    difficulty: "Easy",
    question: "Explain the difference between var, let, and const in JavaScript.",
    keywords: ["scope", "hoisting", "reassignment"]
  },
  {
    _id: "demo-q2",
    category: "Backend",
    difficulty: "Easy",
    question: "What is the difference between GET and POST requests?",
    keywords: ["request", "data", "method"]
  },
  {
    _id: "demo-q3",
    category: "Database",
    difficulty: "Medium",
    question: "What is the difference between SQL and NoSQL databases?",
    keywords: ["schema", "flexibility", "queries"]
  }
];
const memoryResults = [];

let dbReady = false;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbReady = true;
    console.log("MongoDB Connected");
  } catch (err) {
    dbReady = false;
    console.log("MongoDB connection failed, continuing in demo mode:", err.message);
  }
};

connectToMongo();

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

const QuestionSchema = new mongoose.Schema({
  category: String,
  difficulty: String,
  question: String,
  keywords: [String]
});
const Question = mongoose.model("Question", QuestionSchema);

const ResultSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  total: Number,
  category: { type: String, default: "General" },
  answers: [
    {
      questionId: String,
      question: String,
      answer: String,
      hits: Number,
      totalKeywords: Number,
      score: Number,
      confidence: Number,
      strengths: String,
      weaknesses: String,
      suggestion: String
    }
  ],
  date: { type: Date, default: Date.now }
});
const Result = mongoose.model("Result", ResultSchema);

const auth = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).json("No Token");

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json("Invalid Token");
  }
};

const authRouter = express.Router();

// Register
authRouter.post("/register", async (req, res) => {
  if (dbReady) {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashed });
    await user.save();
    return res.json("User Registered");
  }

  const existing = memoryUsers.find(u => u.username === req.body.username);
  if (existing) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = { _id: Date.now().toString(), username: req.body.username, password: hashed };
  memoryUsers.push(user);
  res.json("User Registered");
});

// Login
authRouter.post("/login", async (req, res) => {
  if (dbReady) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, jwtSecret);
    return res.json({ token });
  }

  const user = memoryUsers.find(u => u.username === req.body.username);
  if (!user) return res.status(400).json("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, jwtSecret);
  res.json({ token });
});

const interviewRouter = express.Router();

interviewRouter.get("/questions", auth, async (req, res) => {
  let { category, difficulty } = req.query;

  if (dbReady) {
    const match = {};
    if (category && category !== "Mixed (AI Random)") {
      match.category = category;
    }
    if (difficulty && difficulty !== "Mixed") {
      match.difficulty = difficulty;
    }

    const pipeline = [];
    if (Object.keys(match).length) {
      pipeline.push({ $match: match });
    }
    pipeline.push({ $sample: { size: 5 } });

    const questions = await Question.aggregate(pipeline);
    return res.json(questions);
  }

  let questions = memoryQuestions;
  if (category && category !== "Mixed (AI Random)") {
    questions = questions.filter(q => q.category === category);
  }
  if (difficulty && difficulty !== "Mixed") {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  res.json(questions.slice(0, 5));
});

interviewRouter.post("/result", auth, async (req, res) => {
  if (dbReady) {
    const result = new Result({
      userId: req.user.id,
      score: req.body.score,
      total: req.body.total,
      category: req.body.category || "General",
      answers: req.body.answers || []
    });
    await result.save();
    return res.json("Result Saved");
  }

  memoryResults.push({
    userId: req.user.id,
    score: req.body.score,
    total: req.body.total,
    category: req.body.category || "General",
    answers: req.body.answers || []
  });
  res.json("Result Saved");
});

interviewRouter.get("/dashboard", auth, async (req, res) => {
  if (dbReady) {
    const results = await Result.find({ userId: req.user.id });
    return res.json(results);
  }

  const results = memoryResults.filter(r => r.userId === req.user.id);
  res.json(results);
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "first.html"));
});

app.listen(5000, () => console.log("Server running on port 5000"));

// ====== .env ======
// MONGO_URI=your_mongodb_connection
// JWT_SECRET=supersecret



