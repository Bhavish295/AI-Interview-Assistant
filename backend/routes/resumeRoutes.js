import express from "express";

import upload from "../middleware/upload.js";

import {
  uploadResume
} from "../controllers/resumeController.js";


const router = express.Router();


// Upload Resume
router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);


export default router;