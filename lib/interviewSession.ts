// Ephemeral client-side state for an in-progress interview. A session only
// becomes a durable DB record (via POST /api/interview/result) once the
// candidate finishes — until then it lives in sessionStorage so a refresh
// doesn't silently lose progress mid-interview.

export type InterviewQuestion = {
  _id?: string;
  question: string;
  keywords?: string[];
  track?: string;
  difficulty?: string;
};

export type AnsweredQuestion = {
  question: string;
  answer: string;
  score: number;
  technicalAccuracy: number;
  communication: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
};

export type InterviewSession = {
  id: string;
  track: string;
  difficulty: string;
  resumeInsight: string;
  questions: InterviewQuestion[];
  current?: number;
  answers?: AnsweredQuestion[];
};

const keyFor = (id: string) => `interview:${id}`;

export function saveSession(session: InterviewSession) {
  sessionStorage.setItem(keyFor(session.id), JSON.stringify(session));
}

export function loadSession(id: string): InterviewSession | null {
  const raw = sessionStorage.getItem(keyFor(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InterviewSession;
  } catch {
    return null;
  }
}

export function clearSession(id: string) {
  sessionStorage.removeItem(keyFor(id));
}
