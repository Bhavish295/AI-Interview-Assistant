"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRACKS, DIFFICULTIES } from "@/lib/tracks";
import { Label, Select, Input, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { InterviewQuestion, InterviewSession } from "@/lib/interviewSession";
import { saveSession } from "@/lib/interviewSession";

export function SetupForm() {
  const router = useRouter();
  const [track, setTrack] = useState<string>(TRACKS[0]);
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

      setStatus("Cueing up questions…");
      const params = new URLSearchParams({ track, difficulty });
      const res = await fetch(`/api/interview/questions?${params.toString()}`);
      if (!res.ok) throw new Error("Could not load questions");
      const questions: InterviewQuestion[] = await res.json();

      if (!questions.length) {
        setError("No questions found for this track yet. Try a different track and difficulty.");
        return;
      }

      const id = crypto.randomUUID();
      const session: InterviewSession = { id, track, difficulty, resumeInsight, questions };
      saveSession(session);
      router.push(`/interview/${id}`);
    } catch (err) {
      console.error(err);
      setError("Backend isn't reachable right now. Please try again.");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cue-card mx-auto max-w-lg space-y-5 p-8 pl-10">
      <div>
        <Label htmlFor="track">Track</Label>
        <Select id="track" value={track} onChange={(e) => setTrack(e.target.value)}>
          {TRACKS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      {track === "Custom Role" && (
        <div>
          <Label htmlFor="customRole">Describe the role</Label>
          <Input id="customRole" placeholder="e.g. Senior DevOps Engineer at a fintech" disabled />
          <p className="mt-1 text-xs text-ink/50">
            Custom role question generation ships next — for now this pulls from our general bank.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="resume">Resume (optional, PDF)</Label>
        <Input
          id="resume"
          type="file"
          accept="application/pdf"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1 text-xs text-ink/50">Helps the interviewer tailor context to your background.</p>
      </div>

      <FieldError>{error}</FieldError>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? status || "Starting…" : "Start interview"}
      </Button>
    </form>
  );
}
