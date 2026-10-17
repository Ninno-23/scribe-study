import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { InlineText, MarkdownView } from "@/components/study/markdown";
import { packById } from "@/lib/study/library";
import { mastery, packKey } from "@/lib/study/progress";
import { useStudy } from "@/lib/study/store";
import { materializeKit } from "@/lib/study/types";

export function Lesson({ packId }: { packId: string }) {
  const setView = useStudy((state) => state.setView);
  const progress = useStudy((state) => state.progress);
  const touch = useStudy((state) => state.touch);
  const pack = packById(packId);
  const key = packKey(packId);

  useEffect(() => {
    if (pack) touch(key);
  }, [key, pack, touch]);

  if (!pack) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-muted">That guide is gone.</p>
        <button type="button" className="mt-4 h-11 rounded-full bg-ink px-4 text-sm font-medium text-canvas" onClick={() => setView({ kind: "guides" })}>
          Back to guides
        </button>
      </div>
    );
  }

  const kit = materializeKit(pack.kit);
  const stats = progress[key];
  const ratio = mastery(kit.flashcards.length, stats);
  const known = kit.flashcards.filter((card) => stats?.known.includes(card.id)).length;

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-3xl px-4 py-6">
          <button
            type="button"
            onClick={() => setView({ kind: "guides" })}
            className="inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ChevronLeft className="size-4" />
            Guides
          </button>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
            {pack.track} · {pack.level}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{kit.title}</h1>
          <p className="mt-3 text-sm text-muted tabular-nums">
            {known}/{kit.flashcards.length} cards · {Math.round(ratio * 100)}% learned
            {stats?.quizTotal ? ` · best quiz ${stats.quizScore}/${stats.quizTotal}` : ""}
          </p>
          <div className="mt-5 text-base leading-relaxed">
            <MarkdownView text={kit.summary} />
          </div>
          <div className="mt-8 space-y-4">
            {kit.reviewer.map((section, index) => (
              <section key={section.heading} className="rounded-3xl border border-line bg-paper p-4 sm:p-5">
                <h2 className="text-base font-semibold">
                  <span className="mr-2 text-muted tabular-nums">{index + 1}.</span>
                  {section.heading}
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                  {section.points.map((point) => (
                    <li key={point}>
                      <InlineText text={point} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </div>
      <div className="border-t border-line bg-canvas px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl gap-2">
          <button
            type="button"
            className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-canvas"
            onClick={() => {
              touch(key);
              setView({ kind: "cards", ref: { type: "pack", id: pack.id } });
            }}
          >
            Flashcards
          </button>
          <button
            type="button"
            className="h-11 flex-1 rounded-full border border-line text-sm font-medium"
            onClick={() => {
              touch(key);
              setView({ kind: "quiz", ref: { type: "pack", id: pack.id } });
            }}
          >
            Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
