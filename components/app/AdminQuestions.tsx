"use client";

import { useEffect, useState } from "react";
import { TRACKS, DIFFICULTIES } from "@/lib/tracks";
import { Label, Select, Input, Textarea, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Question = {
  _id: string;
  track: string;
  difficulty: string;
  question: string;
  keywords: string[];
};

export function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [track, setTrack] = useState<string>(TRACKS[0]);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[0]);
  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/questions");
    if (res.ok) setQuestions(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          difficulty,
          question,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not add question");
        return;
      }
      setQuestion("");
      setKeywords("");
      await load();
    } catch {
      setError("Can't reach the server. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setQuestions((prev) => prev?.filter((q) => q._id !== id) ?? prev);
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={handleAdd} className="cue-card h-fit space-y-4 p-6">
        <p className="text-lg font-semibold">Add a question</p>
        <div>
          <Label htmlFor="track">Track</Label>
          <Select id="track" value={track} onChange={(e) => setTrack(e.target.value)}>
            {TRACKS.filter((t) => t !== "Custom Role").map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
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
          <Label htmlFor="question">Question</Label>
          <Textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required minLength={5} className="min-h-[90px]" />
        </div>
        <div>
          <Label htmlFor="keywords">Keywords (comma separated)</Label>
          <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="closures, hoisting, scope" />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Adding…" : "Add question"}
        </Button>
      </form>

      <div>
        <p className="mb-3 text-sm text-mist">
          {questions ? `${questions.length} questions` : "Loading…"}
        </p>
        <div className="space-y-3">
          {questions?.map((q) => (
            <div key={q._id} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-panel px-5 py-4">
              <div>
                <p className="text-xs font-medium text-signal">
                  {q.track} · {q.difficulty}
                </p>
                <p className="mt-1 text-sm">{q.question}</p>
                {q.keywords.length > 0 && (
                  <p className="mt-1 text-xs text-mist">{q.keywords.join(", ")}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(q._id)}
                className="flex-shrink-0 text-xs text-signal hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
          {questions?.length === 0 && <p className="text-sm text-mist">No questions yet — add the first one.</p>}
        </div>
      </div>
    </div>
  );
}
