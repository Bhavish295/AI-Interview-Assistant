import { z } from "zod";
import { TRACKS, DIFFICULTIES } from "@/lib/tracks";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const evaluateSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const saveResultSchema = z.object({
  track: z.string().min(1),
  difficulty: z.string().min(1),
  overallScore: z.number().min(0),
  resumeInsight: z.string().optional().default(""),
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      score: z.number(),
      technicalAccuracy: z.number(),
      communication: z.number(),
      confidence: z.number(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      improvementTips: z.array(z.string()),
    })
  ),
});

export const questionSchema = z.object({
  track: z.enum(TRACKS),
  difficulty: z.enum(DIFFICULTIES),
  question: z.string().trim().min(5),
  keywords: z.array(z.string().trim()).default([]),
});

export const questionUpdateSchema = questionSchema.partial();
