import express from "express";

import auth from "../middleware/auth.js";

import {
  getQuestions,
  saveResult,
  getDashboard,
  evaluateInterview
} from "../controllers/interviewController.js";

const router = express.Router();


// Get Questions
router.get(
  "/questions",
  auth,
  getQuestions
);


// Save Result
router.post(
  "/result",
  auth,
  saveResult
);


// AI Interview Evaluation
// (Temporary: auth removed for testing Gemini)
router.post(
  "/evaluate",
  auth,
  evaluateInterview
);


// Dashboard
router.get(
  "/dashboard",
  auth,
  getDashboard
);

export default router;