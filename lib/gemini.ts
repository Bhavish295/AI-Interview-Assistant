import { GoogleGenAI } from "@google/genai";

export type Evaluation = {
  score: number;
  technicalAccuracy: number;
  communication: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
  aiUnavailable?: boolean;
};

let client: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(raw.slice(start, end + 1));
}

function fallbackEvaluation(): Evaluation {
  return {
    score: 0,
    technicalAccuracy: 0,
    communication: 0,
    confidence: 0,
    strengths: [],
    weaknesses: [],
    improvementTips: [
      "AI evaluation is temporarily unavailable. Your answer was saved without a score — try again in a moment.",
    ],
    aiUnavailable: true,
  };
}

function clampScore(n: unknown): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(10, Math.round(num)));
}

function normalize(raw: unknown): Evaluation {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const asStringArray = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  return {
    score: clampScore(obj.score),
    technicalAccuracy: clampScore(obj.technicalAccuracy),
    communication: clampScore(obj.communication),
    confidence: clampScore(obj.confidence),
    strengths: asStringArray(obj.strengths),
    weaknesses: asStringArray(obj.weaknesses),
    improvementTips: asStringArray(obj.improvementTips),
  };
}

export async function evaluateAnswer(question: string, answer: string): Promise<Evaluation> {
  const ai = getClient();
  if (!ai) return fallbackEvaluation();

  const prompt = `You are an experienced interviewer giving direct, specific feedback.

Question:
${question}

Candidate's answer:
${answer}

Score the answer honestly (0 is empty/irrelevant, 10 is exceptional). Return ONLY a JSON object, no prose, no markdown fences:
{
  "score": number 0-10,
  "technicalAccuracy": number 0-10,
  "communication": number 0-10,
  "confidence": number 0-10,
  "strengths": [1-3 short specific strings],
  "weaknesses": [1-3 short specific strings],
  "improvementTips": [1-3 short actionable strings]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text ?? "";
    return normalize(extractJson(text));
  } catch (err) {
    console.error("Gemini evaluation failed:", err);
    return fallbackEvaluation();
  }
}

export async function analyzeResume(resumeText: string): Promise<string> {
  const ai = getClient();
  if (!ai) return "";

  const prompt = `You are a career coach. In 2-3 short sentences, summarize this candidate's key skills and one area they should be ready to speak to in an interview. Plain text only, no markdown, no headers.

Resume text:
${resumeText.slice(0, 6000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return (response.text ?? "").trim();
  } catch (err) {
    console.error("Gemini resume analysis failed:", err);
    return "";
  }
}
