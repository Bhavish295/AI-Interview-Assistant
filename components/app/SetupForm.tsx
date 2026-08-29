"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRACKS, DIFFICULTIES, type Track } from "@/lib/tracks";
import { Label, Select, Input, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { InterviewQuestion, InterviewSession } from "@/lib/interviewSession";
import { saveSession } from "@/lib/interviewSession";

const TRACK_HELP: Record<string, string> = {
  "Software Engineering": "Coding, APIs, and how software is built. Best first choice.",
  "Data Structures & Algorithms": "Lists, trees, graphs, and problem-solving questions.",
  "System Design": "How you would design large apps (feeds, short links, scaling).",
  "Product & Business": "Product sense, metrics, and trade-offs.",
  "Data Science": "ML concepts, experiments, and data problems.",
  "Behavioral / HR": "Tell-me-about-yourself and teamwork stories.",
  "Custom Role": "Not ready yet — pick Software Engineering instead.",
};

export function SetupForm({ initialTrack }: { initialTrack?: string }) {
  const router = useRouter();
  const allowed = TRACKS.filter((t) => t !== "Custom Role");
  const start = allowed.includes(initialTrack as Track) ? (initialTrack as string) : TRACKS[0];
  const [track, setTrack] = useState<string>(start);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[0]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let resumeInsight = "";

    try {
      if (resumeFile) {
        setStatus("Reading your resume…");
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const res = await fetch("/api/resume/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          resumeInsight = data.insight || "";
        }
        // Non-fatal: continue without resume context if parsing fails.
      }

      setStatus("Loading questions…");
      const params = new URLSearchParams({ track, difficulty });
      const res = await fetch(`/api/interview/questions?${params.toString()}`);
      if (!res.ok) throw new Error("Could not load questions");
      const questions: InterviewQuestion[] = await res.json();

      if (!questions.length) {
        setError("No questions for this topic yet. Choose Software Engineering and Easy.");
        return;
      }

      const id = crypto.randomUUID();
      const session: InterviewSession = { id, track, difficulty, resumeInsight, questions };
      saveSession(session);
      router.push(`/interview/${id}`);
    } catch (err) {
      console.error(err);
      setError("Could not start the interview. Check your internet and try again.");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cue-card mx-auto max-w-lg space-y-5 p-7">
      <div>
        <Label htmlFor="track">What do you want to practice?</Label>
        <Select id="track" value={track} onChange={(e) => setTrack(e.target.value)}>
          {TRACKS.filter((t) => t !== "Custom Role").map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <p className="mt-1.5 text-xs leading-relaxed text-mist">{TRACK_HELP[track]}</p>
      </div>

      <div>
        <Label htmlFor="difficulty">How hard?</Label>
        <Select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <p className="mt-1.5 text-xs text-mist">Start with Easy if this is your first time.</p>
      </div>

      <div>
        <Label htmlFor="resume">Resume (optional PDF)</Label>
        <Input
          id="resume"
          type="file"
          accept="application/pdf"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1.5 text-xs text-mist">Skip this if you do not have a resume handy.</p>
      </div>

      <FieldError>{error}</FieldError>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? status || "Starting…" : "Start interview"}
      </Button>
    </form>
  );
}
