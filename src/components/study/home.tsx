import { useState } from "react";
import { ArrowRight, Download, Layers } from "lucide-react";
import { LIBRARY } from "@/lib/study/library";
import { mastery, packKey, streakCount, trackRollup } from "@/lib/study/progress";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { useStudy } from "@/lib/study/store";
import { materializeKit } from "@/lib/study/types";

const TRACKS = ["Python", "HTML", "AWS"] as const;

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function HomeView() {
  const progress = useStudy((state) => state.progress);
  const decks = useStudy((state) => state.decks);
  const studiedDays = useStudy((state) => state.studiedDays);
  const setView = useStudy((state) => state.setView);
  const streak = streakCount(studiedDays);

  const lessons = LIBRARY.map((pack) => {
    const kit = materializeKit(pack.kit);
    const stats = progress[packKey(pack.id)];
    const known = kit.flashcards.filter((card) => stats?.known.includes(card.id)).length;
    return {
      pack,
      known,
      cards: kit.flashcards.length,
      at: stats?.lastOpened ?? 0,
      ratio: mastery(kit.flashcards.length, stats),
      quizzed: Boolean(stats?.quizTotal),
    };
  });

  const opened = lessons.filter((item) => item.at > 0).sort((a, b) => b.at - a.at);
  const continuePack = opened[0];
  const due = lessons.filter((item) => item.ratio > 0 && item.known < item.cards).sort((a, b) => b.cards - b.known - (a.cards - a.known));
  const nextDue = due[0];
  const cardsKnown = lessons.reduce((sum, item) => sum + item.known, 0) + decks.reduce((sum, deck) => {
    const stats = progress[`deck:${deck.id}`];
    return sum + deck.kit.flashcards.filter((card) => stats?.known.includes(card.id)).length;
  }, 0);
  const quizzes = lessons.filter((item) => item.quizzed).length + decks.filter((deck) => progress[`deck:${deck.id}`]?.quizTotal).length;

  const stats = [
    { label: "Day streak", value: String(streak) },
    { label: "Cards known", value: String(cardsKnown) },
    { label: "Quizzes done", value: String(quizzes) },
    { label: "Lessons opened", value: String(opened.length) },
  ];
  const [downloadError, setDownloadError] = useState("");

  async function downloadCode() {
    setDownloadError("");
    const prefix =
      typeof window === "undefined"
        ? ""
        : (previewPathPrefix(window.location.hostname, window.location.pathname) ?? "");
    try {
      const response = await fetch(`${prefix}/scribe-study.zip`);
      if (!response.ok) throw new Error("missing");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "scribe-study.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Could not download from the preview. Use the GitHub link in the chat.");
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:py-8">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-accent">Dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">What to study next</h1>
          </div>
          <button
            type="button"
            onClick={() => void downloadCode()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
          >
            <Download className="size-4" />
            Download code
          </button>
        </header>
        {downloadError ? <p className="text-sm text-muted">{downloadError}</p> : null}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-line bg-canvas px-4 py-4">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              continuePack
                ? setView({ kind: "lesson", packId: continuePack.pack.id })
                : setView({ kind: "guides" })
            }
            className="rounded-3xl border border-line p-5 text-left hover:bg-paper"
          >
            <p className="text-sm text-muted">Continue</p>
            <p className="mt-2 text-xl font-semibold">
              {continuePack ? continuePack.pack.title : "Open your first guide"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {continuePack
                ? `${continuePack.pack.track} · ${percent(continuePack.ratio)} learned`
                : "Python, HTML, and AWS are ready."}
            </p>
            {continuePack ? (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bubble">
                <div className="h-full rounded-full bg-accent" style={{ width: percent(continuePack.ratio) }} />
              </div>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() =>
              nextDue
                ? setView({ kind: "cards", ref: { type: "pack", id: nextDue.pack.id } })
                : setView({ kind: "practice" })
            }
            className="rounded-3xl bg-ink p-5 text-left text-canvas"
          >
            <p className="text-sm text-canvas/70">Due now</p>
            <p className="mt-2 text-xl font-semibold">
              {nextDue ? `${nextDue.cards - nextDue.known} cards still open` : "No cards waiting"}
            </p>
            <p className="mt-2 text-sm text-canvas/70">
              {nextDue ? nextDue.pack.title : "Study a lesson, then the missed cards land here."}
            </p>
          </button>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Tracks</h2>
            <button type="button" className="text-sm font-medium text-accent" onClick={() => setView({ kind: "guides" })}>
              All guides
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {TRACKS.map((track) => {
              const count = LIBRARY.filter((pack) => pack.track === track).length;
              const ratio = trackRollup(track, progress);
              return (
                <button
                  key={track}
                  type="button"
                  onClick={() => setView({ kind: "guides" })}
                  className="rounded-3xl border border-line p-4 text-left hover:bg-paper"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-accent" />
                    <p className="text-lg font-semibold">{track}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted tabular-nums">
                    {count} lessons · {percent(ratio)}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bubble">
                    <div className="h-full rounded-full bg-accent" style={{ width: percent(ratio) }} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Recent lessons</h2>
            {opened.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nothing opened yet. Start with HTML page structure or Python basics.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {opened.slice(0, 4).map((item) => (
                  <li key={item.pack.id}>
                    <button
                      type="button"
                      onClick={() => setView({ kind: "lesson", packId: item.pack.id })}
                      className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-line px-4 text-left hover:bg-paper"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{item.pack.title}</span>
                        <span className="text-sm text-muted">{item.pack.track}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Your sets</h2>
              <button type="button" className="text-sm font-medium text-accent" onClick={() => setView({ kind: "tutor" })}>
                Add from a file
              </button>
            </div>
            {decks.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Tutor can read a photo, PDF, Word file, or HTML page and save it as cards.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {decks.slice(0, 4).map((deck) => (
                  <li key={deck.id}>
                    <button
                      type="button"
                      onClick={() => setView({ kind: "cards", ref: { type: "deck", id: deck.id } })}
                      className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-line px-4 text-left hover:bg-paper"
                    >
                      <span className="truncate font-medium">{deck.title}</span>
                      <span className="shrink-0 text-sm text-muted tabular-nums">{deck.kit.flashcards.length} cards</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
