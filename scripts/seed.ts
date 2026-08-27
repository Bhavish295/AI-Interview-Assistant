import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import QuestionModel from "../models/Question";
import UserModel from "../models/User";

type SeedQuestion = { track: string; difficulty: string; question: string; keywords: string[] };

const QUESTIONS: SeedQuestion[] = [
  // Software Engineering
  { track: "Software Engineering", difficulty: "Easy", question: "What is the difference between `let`, `const`, and `var` in JavaScript?", keywords: ["scope", "hoisting", "block"] },
  { track: "Software Engineering", difficulty: "Easy", question: "Explain what REST means and name two HTTP methods it relies on.", keywords: ["stateless", "resource", "http", "get", "post"] },
  { track: "Software Engineering", difficulty: "Medium", question: "How would you design a rate limiter for a public API?", keywords: ["token bucket", "sliding window", "redis", "throttle"] },
  { track: "Software Engineering", difficulty: "Medium", question: "Walk me through what happens when you type a URL into a browser and hit enter.", keywords: ["dns", "tcp", "tls", "http", "render"] },
  { track: "Software Engineering", difficulty: "Hard", question: "How would you debug a memory leak in a long-running Node.js service?", keywords: ["heap snapshot", "gc", "closures", "profiler"] },
  { track: "Software Engineering", difficulty: "Hard", question: "Design a system for idempotent payment processing across retries.", keywords: ["idempotency key", "exactly once", "at least once", "dedupe"] },

  // DSA
  { track: "Data Structures & Algorithms", difficulty: "Easy", question: "How would you reverse a singly linked list?", keywords: ["pointer", "iterative", "recursive"] },
  { track: "Data Structures & Algorithms", difficulty: "Easy", question: "Explain the difference between a stack and a queue with a real example.", keywords: ["lifo", "fifo"] },
  { track: "Data Structures & Algorithms", difficulty: "Medium", question: "Given an array of integers, how would you find two numbers that add up to a target?", keywords: ["hash map", "two pointer", "o(n)"] },
  { track: "Data Structures & Algorithms", difficulty: "Medium", question: "How does a binary search tree differ from a balanced binary search tree, and why does it matter?", keywords: ["avl", "red-black", "balance", "o(log n)"] },
  { track: "Data Structures & Algorithms", difficulty: "Hard", question: "How would you find the shortest path in a weighted graph with no negative edges?", keywords: ["dijkstra", "priority queue", "greedy"] },
  { track: "Data Structures & Algorithms", difficulty: "Hard", question: "Explain how you'd design an LRU cache with O(1) get and put.", keywords: ["hash map", "doubly linked list", "eviction"] },

  // System Design
  { track: "System Design", difficulty: "Easy", question: "What's the difference between vertical and horizontal scaling?", keywords: ["scale up", "scale out", "load balancer"] },
  { track: "System Design", difficulty: "Medium", question: "How would you design a URL shortener like bit.ly?", keywords: ["hash", "base62", "database", "redirect"] },
  { track: "System Design", difficulty: "Medium", question: "How would you design a notification system that supports email, SMS, and push?", keywords: ["queue", "fanout", "retry", "provider"] },
  { track: "System Design", difficulty: "Hard", question: "Design a system like Instagram's news feed for millions of users.", keywords: ["fanout on write", "fanout on read", "cache", "cdn"] },
  { track: "System Design", difficulty: "Hard", question: "How would you design a distributed job scheduler that guarantees a job runs exactly once?", keywords: ["leader election", "lease", "idempotency", "partitioning"] },

  // Product & Business
  { track: "Product & Business", difficulty: "Easy", question: "How would you prioritize features for a product with limited engineering resources?", keywords: ["impact", "effort", "rice", "tradeoff"] },
  { track: "Product & Business", difficulty: "Medium", question: "A key metric drops 20% overnight — how do you investigate?", keywords: ["root cause", "segment", "hypothesis", "data"] },
  { track: "Product & Business", difficulty: "Medium", question: "How would you decide whether to build a feature or buy a third-party solution?", keywords: ["build vs buy", "cost", "time to market", "core competency"] },
  { track: "Product & Business", difficulty: "Hard", question: "Design a pricing strategy for a new B2B SaaS product entering a competitive market.", keywords: ["value based", "tiered", "competitor", "willingness to pay"] },

  // Data Science
  { track: "Data Science", difficulty: "Easy", question: "What's the difference between supervised and unsupervised learning?", keywords: ["labels", "clustering", "classification"] },
  { track: "Data Science", difficulty: "Medium", question: "How do you handle class imbalance in a classification problem?", keywords: ["oversampling", "smote", "class weights", "f1"] },
  { track: "Data Science", difficulty: "Medium", question: "Explain the bias-variance tradeoff and how you'd diagnose which one is hurting a model.", keywords: ["overfitting", "underfitting", "regularization"] },
  { track: "Data Science", difficulty: "Hard", question: "How would you design an A/B test when the metric you care about has high variance?", keywords: ["sample size", "variance reduction", "cuped", "power"] },

  // Behavioral / HR
  { track: "Behavioral / HR", difficulty: "Easy", question: "Tell me about yourself and why you're interested in this role.", keywords: ["motivation", "background", "fit"] },
  { track: "Behavioral / HR", difficulty: "Easy", question: "Describe a time you disagreed with a teammate. How did you handle it?", keywords: ["conflict", "communication", "resolution"] },
  { track: "Behavioral / HR", difficulty: "Medium", question: "Tell me about a time you made a mistake at work. What did you learn?", keywords: ["accountability", "learning", "growth"] },
  { track: "Behavioral / HR", difficulty: "Medium", question: "Describe a situation where you had to convince others to adopt your idea.", keywords: ["influence", "persuasion", "data", "stakeholder"] },
  { track: "Behavioral / HR", difficulty: "Hard", question: "Tell me about a time you had to make a decision with incomplete information and it went wrong.", keywords: ["judgment", "risk", "ownership", "reflection"] },
];

async function main() {
  await connectDB();

  let created = 0;
  for (const q of QUESTIONS) {
    const exists = await QuestionModel.findOne({ track: q.track, question: q.question });
    if (!exists) {
      await QuestionModel.create(q);
      created++;
    }
  }
  console.log(`Seeded ${created} new questions (${QUESTIONS.length - created} already existed).`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await UserModel.create({ name: "Admin", email: adminEmail, password: hashed, role: "admin" });
      console.log(`Created admin account: ${adminEmail}`);
    } else if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(`Promoted ${adminEmail} to admin.`);
    } else {
      console.log(`Admin account ${adminEmail} already exists.`);
    }
  } else {
    console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to also seed an admin account.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
