import { Trash2 } from "lucide-react";
import { LIBRARY } from "@/lib/study/library";
import { deckKey, mastery, packKey } from "@/lib/study/progress";
import { useStudy } from "@/lib/study/store";
import { materializeKit } from "@/lib/study/types";

export function Practice() {
  const progress = useStudy((state) => state.progress);
  const decks = useStudy((state) => state.decks);
  const setView = useStudy((state) => state.setView);
  const removeDeck = useStudy((state) => state.removeDeck);

  const lessons = LIBRARY.map((pack) => {
    const kit = materializeKit(pack.kit);
    const stats = progress[packKey(pack.id)];
    const known = new Set(stats?.known ?? []);
    const left = kit.flashcards.filter((card) => !known.has(card.id)).length;
    return { pack, left, total: kit.flashcards.length, ratio: mastery(kit.flashcards.length, stats) };
  }).filter((item) => item.ratio > 0 || item.left < item.total);

  const fresh = lessons.length === 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <h1 className="text-3xl font-semibold tracking-tight">Practice</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Cards you still miss stay in the pile. A quiz scores itself from the other answers in the set.
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Guides in progress</h2>
          {fresh ? (
            <p className="mt-3 text-sm text-muted">
              Open a guide and mark a card. It will wait here until you know it.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {lessons.map((item) => (
                <li key={item.pack.id} className="rounded-3xl border border-line p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{item.pack.track}</p>
                      <p className="mt-1 font-semibold">{item.pack.title}</p>
                      <p className="mt-1 text-sm text-muted tabular-nums">
                        {item.left} still learning · {Math.round(item.ratio * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-canvas"
                      onClick={() => setView({ kind: "cards", ref: { type: "pack", id: item.pack.id } })}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      className="h-11 flex-1 rounded-full border border-line text-sm font-medium"
                      onClick={() => setView({ kind: "quiz", ref: { type: "pack", id: item.pack.id } })}
                    >
                      Quiz
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Saved from Tutor</h2>
          {decks.length === 0 ? (
            <button
              type="button"
              onClick={() => setView({ kind: "tutor" })}
              className="mt-3 w-full rounded-3xl border border-dashed border-line px-4 py-6 text-left text-sm text-muted hover:bg-paper"
            >
              Ask Tutor to build a set from a photo, PDF, or Word file, then save it here.
            </button>
          ) : (
            <ul className="mt-3 space-y-2">
              {decks.map((deck) => {
                const stats = progress[deckKey(deck.id)];
                const known = deck.kit.flashcards.filter((card) => stats?.known.includes(card.id)).length;
                return (
                  <li key={deck.id} className="rounded-3xl border border-line p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{deck.title}</p>
                        <p className="mt-1 text-sm text-muted tabular-nums">
                          {known}/{deck.kit.flashcards.length} cards known
                          {stats?.quizTotal ? ` · quiz ${stats.lastQuizScore ?? stats.quizScore}/${stats.quizTotal}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-bubble hover:text-ink"
                        aria-label={`Delete ${deck.title}`}
                        onClick={() => removeDeck(deck.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-canvas"
                        onClick={() => setView({ kind: "cards", ref: { type: "deck", id: deck.id } })}
                      >
                        Cards
                      </button>
                      <button
                        type="button"
                        className="h-11 flex-1 rounded-full border border-line text-sm font-medium"
                        onClick={() => setView({ kind: "quiz", ref: { type: "deck", id: deck.id } })}
                      >
                        Quiz
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
