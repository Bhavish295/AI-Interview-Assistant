"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { TallyLight } from "@/components/ui/TallyLight";
import { VuMeter } from "@/components/ui/VuMeter";
import { Waveform } from "@/components/ui/Waveform";
import {
  loadSession,
  saveSession,
  clearSession,
  type InterviewSession,
  type AnsweredQuestion,
} from "@/lib/interviewSession";

const QUESTION_SECONDS = 30;

type Evaluation = AnsweredQuestion & { aiUnavailable?: boolean };

export function InterviewClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null | "not-found">(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const submitRef = useRef<() => void>(() => {});

  // Load the ephemeral session created on the setup page.
  useEffect(() => {
    const s = loadSession(sessionId);
    setSession(s ?? "not-found");
  }, [sessionId]);

  // Stop any in-progress recognition/synthesis if the candidate navigates away mid-answer.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(QUESTION_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submitRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (session && session !== "not-found" && !evaluation) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, current]);

  if (session === null) return <p className="text-center text-mist">Loading…</p>;
  if (session === "not-found") {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-mist">This interview session has expired or was opened in a new tab.</p>
        <Button className="mt-4" onClick={() => router.push("/setup")}>
          Start a new interview
        </Button>
      </div>
    );
  }

  const activeSession = session;
  const question = activeSession.questions[current];
  const total = activeSession.questions.length;

  function playQuestion() {
    if (!window.speechSynthesis || !question) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(question.question));
  }

  function toggleVoice() {
    const SpeechRecognitionCtor =
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition ||
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("Voice input isn't supported in this browser. Try Chrome, or type your answer.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
      setAnswerText(text.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  async function submitAnswer() {
    if (submitting || evaluation) return;
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    setSubmitting(true);

    const text = answerText.trim();

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.question, answer: text || "(no answer given)" }),
      });
      const data = await res.json();
      const evalResult: Evaluation = {
        question: question.question,
        answer: text,
        score: data.score ?? 0,
        technicalAccuracy: data.technicalAccuracy ?? 0,
        communication: data.communication ?? 0,
        confidence: data.confidence ?? 0,
        strengths: data.strengths ?? [],
        weaknesses: data.weaknesses ?? [],
        improvementTips: data.improvementTips ?? [],
        aiUnavailable: data.aiUnavailable,
      };
      setEvaluation(evalResult);
      setAnswers((prev) => [...prev, evalResult]);
    } catch (err) {
      console.error(err);
      const fallback: Evaluation = {
        question: question.question,
        answer: text,
        score: 0,
        technicalAccuracy: 0,
        communication: 0,
        confidence: 0,
        strengths: [],
        weaknesses: [],
        improvementTips: ["Couldn't reach the AI evaluator for this answer."],
        aiUnavailable: true,
      };
      setEvaluation(fallback);
      setAnswers((prev) => [...prev, fallback]);
    } finally {
      setSubmitting(false);
    }
  }

  submitRef.current = submitAnswer;

  async function nextQuestion() {
    const nextAnswers = answers;
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setAnswerText("");
      setEvaluation(null);
      saveSession({ ...activeSession, current: current + 1, answers: nextAnswers });
    } else {
      await finishInterview(nextAnswers);
    }
  }

  async function finishInterview(finalAnswers: AnsweredQuestion[]) {
    setFinishing(true);
    const overallScore =
      finalAnswers.length > 0
        ? Math.round((finalAnswers.reduce((sum, a) => sum + a.score, 0) / finalAnswers.length) * 10) / 10
        : 0;

    try {
      const res = await fetch("/api/interview/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track: activeSession.track,
          difficulty: activeSession.difficulty,
          overallScore,
          resumeInsight: activeSession.resumeInsight,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      clearSession(activeSession.id);
      if (res.ok) router.push(`/results/${data.id}`);
      else router.push("/dashboard");
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-mist">
            {session.track} · {session.difficulty}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <TallyLight label={evaluation ? "PLAYBACK" : "REC"} active={!evaluation} size="sm" />
            <span className="font-mono text-xs text-mist">
              Question {current + 1}/{total}
            </span>
          </div>
        </div>
        <div className="font-mono text-2xl font-semibold tabular-nums">
          00:{timeLeft.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="cue-card p-8 pl-10">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-bold leading-tight">{question.question}</h2>
          <button
            type="button"
            onClick={playQuestion}
            className="flex-shrink-0 rounded-full border border-mist/30 px-3 py-1.5 text-xs text-ink/70 hover:bg-mist/10"
            aria-label="Play question aloud"
          >
            🔊 Play
          </button>
        </div>

        {!evaluation ? (
          <>
            <Textarea
              className="mt-6 min-h-[140px]"
              placeholder="Speak or type your answer…"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={submitting}
            />
            {listening && <Waveform className="mt-3" bars={32} />}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant={listening ? "danger" : "ghost"} onClick={toggleVoice} disabled={submitting}>
                {listening ? "■ Stop" : "🎤 Speak"}
              </Button>
              <Button type="button" onClick={submitAnswer} disabled={submitting} className="ml-auto">
                {submitting ? "Scoring…" : "Submit answer"}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-6 space-y-6">
            {evaluation.aiUnavailable && (
              <p className="rounded-lg border border-brass/30 bg-brass/10 px-4 py-3 text-sm text-ink/80">
                AI evaluation is temporarily unavailable — your answer was saved without a score.
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <VuMeter label="Overall" value={evaluation.score} />
              <VuMeter label="Technical" value={evaluation.technicalAccuracy} />
              <VuMeter label="Communication" value={evaluation.communication} />
              <VuMeter label="Confidence" value={evaluation.confidence} />
            </div>

            {evaluation.strengths.length > 0 && (
              <FeedbackList label="Strengths" items={evaluation.strengths} tone="brass" />
            )}
            {evaluation.weaknesses.length > 0 && (
              <FeedbackList label="Gaps" items={evaluation.weaknesses} tone="signal" />
            )}
            {evaluation.improvementTips.length > 0 && (
              <FeedbackList label="Try this" items={evaluation.improvementTips} tone="mist" />
            )}

            <Button type="button" onClick={nextQuestion} disabled={finishing} className="w-full">
              {finishing ? "Wrapping up…" : current + 1 < total ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackList({ label, items, tone }: { label: string; items: string[]; tone: "brass" | "signal" | "mist" }) {
  const dotColor = tone === "brass" ? "bg-brass" : tone === "signal" ? "bg-signal" : "bg-mist";
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-mist">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink/80">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor}`} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
