import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
export const evaluateAnswer = async (question, answer) => {
  try {
    const prompt = `
You are an AI technical interviewer.

Evaluate this candidate answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON in this format:

{
  "score": 8,
  "technicalAccuracy": 8,
  "communication": 8,
  "confidence": 8,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvementTips": ["..."]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text;

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};