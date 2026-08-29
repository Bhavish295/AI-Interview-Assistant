import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const questions = [
    {
  category: "Frontend",
  difficulty: "Medium",
  question: "Explain React lifecycle methods.",
  keywords: ["react", "lifecycle"]
},
{
  category: "Frontend",
  difficulty: "Medium",
  question: "How does React Virtual DOM work?",
  keywords: ["react", "virtual dom"]
},
{
  category: "Frontend",
  difficulty: "Hard",
  question: "Explain React rendering optimization techniques.",
  keywords: ["memo", "useMemo", "performance"]
},
{
  category: "Frontend",
  difficulty: "Hard",
  question: "Explain React reconciliation algorithm.",
  keywords: ["react", "reconciliation"]
},
  {
    category: "Frontend",
    difficulty: "Easy",
    question: "What is React?",
    keywords: ["library", "javascript", "ui"]
  },
  {
    category: "Frontend",
    difficulty: "Easy",
    question: "What is the difference between let and var in JavaScript?",
    keywords: ["javascript", "scope"]
  },
  {
    category: "Frontend",
    difficulty: "Easy",
    question: "What is JSX in React?",
    keywords: ["react", "syntax"]
  },
  {
    category: "Backend",
    difficulty: "Easy",
    question: "What is Node.js?",
    keywords: ["javascript", "server"]
  },
  {
    category: "Backend",
    difficulty: "Easy",
    question: "What is Express.js?",
    keywords: ["framework", "api"]
  },
  {
    category: "Database",
    difficulty: "Easy",
    question: "What is MongoDB?",
    keywords: ["database", "nosql"]
  },
  {
    category: "Database",
    difficulty: "Easy",
    question: "What is a database index?",
    keywords: ["performance"]
  },
  {
    category: "DSA",
    difficulty: "Easy",
    question: "What is an array?",
    keywords: ["data structure"]
  },
  {
    category: "DSA",
    difficulty: "Easy",
    question: "What is the difference between stack and queue?",
    keywords: ["stack", "queue"]
  },
  {
    category: "HR",
    difficulty: "Easy",
    question: "Tell me about yourself.",
    keywords: ["introduction"]
  }
];


const seedQuestions = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Question.deleteMany();

    await Question.insertMany(questions);

    console.log("Questions inserted successfully");

    process.exit();

  } catch (error) {

    console.log(error);
    process.exit(1);

  }

};


seedQuestions();