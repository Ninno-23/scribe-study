import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { InlineText, MarkdownView } from "@/components/study/markdown";
import type { StudyKit } from "@/lib/study/types";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "reviewer", label: "Reviewer" },
  { id: "cards", label: "Flashcards" },
  { id: "quiz", label: "Q&A" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function KitView({ kit }: { kit: StudyKit }) {
  const available = TABS.filter((tab) => {
    if (tab.id === "summary") return kit.summary.trim().length > 0;
    if (tab.id === "reviewer") return kit.reviewer.length > 0;
    if (tab.id === "cards") return kit.flashcards.length > 0;
    return kit.quiz.length > 0;
  });
  const [tab, setTab] = useState<TabId>(available[0]?.id ?? "summary");
  const active = available.some((item) => item.id === tab) ? tab : (available[0]?.id ?? "summary");

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex flex-wrap gap-1 border-b border-line p-2">
        {available.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "h-11 rounded-full px-4 text-sm font-medium",
              active === item.id ? "bg-ink text-canvas" : "text-muted hover:bg-bubble hover:text-ink",
            )}
          >
            {item.label}
            {item.id === "cards" ? ` ${kit.flashcards.length}` : ""}
            {item.id === "quiz" ? ` ${kit.quiz.length}` : ""}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5">
        {active === "summary" ? <MarkdownView text={kit.summary} /> : null}
        {active === "reviewer" ? <Reviewer kit={kit} /> : null}
        {active === "cards" ? <Cards kit={kit} /> : null}
        {active === "quiz" ? <Quiz kit={kit} /> : null}
      </div>
    </section>
  );
}

function Reviewer({ kit }: { kit: StudyKit }) {
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => {
    const parts = [`# ${kit.title}`, "", kit.summary, ""];
    for (const section of kit.reviewer) {
      parts.push(`## ${section.heading}`, ...section.points.map((point) => `- ${point}`), "");
    }
    return parts.join("\n");
  }, [kit]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{kit.title}</h3>
        <button
          type="button"
          className="h-11 shrink-0 rounded-full border border-line bg-canvas px-4 text-sm font-medium"
          onClick={() => {
            void navigator.clipboard.writeText(markdown).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            });
          }}
        >
          {copied ? "Copied" : "Copy reviewer"}
        </button>
      </div>
      <div className="space-y-5">
        {kit.reviewer.map((section) => (
          <article key={section.heading}>
            <h4 className="text-base font-semibold">{section.heading}</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              {section.points.map((point) => (
                <li key={point}>
                  <InlineText text={point} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function Cards({ kit }: { kit: StudyKit }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [marks, setMarks] = useState<Record<string, "know" | "learn">>({});
  const card = kit.flashcards[index];
  if (!card) return null;
  const known = Object.values(marks).filter((mark) => mark === "know").length;

  function go(next: number) {
    setIndex(next);
    setFlipped(false);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          Card {index + 1} / {kit.flashcards.length}
        </span>
        <span className="tabular-nums">{known} known</span>
      </div>
      <div className="card-scene">
        <button
          type="button"
          className={cn("card-inner w-full text-left", flipped && "is-flipped")}
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? "Show question" : "Show answer"}
        >
          <span className="card-face flex flex-col justify-between rounded-2xl border border-line bg-canvas p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {card.topic || "Question"}
            </span>
            <span className="py-6 text-xl font-semibold leading-snug">
              <InlineText text={card.front} />
            </span>
            <span className="text-sm text-muted">Tap to flip</span>
          </span>
          <span className="card-face card-back flex flex-col justify-between rounded-2xl border border-line bg-ink p-5 text-canvas">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">Answer</span>
            <span className="py-6 text-lg leading-relaxed">
              <InlineText text={card.back} />
            </span>
            <span className="text-sm text-muted">Tap to flip back</span>
          </span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-canvas px-3 text-sm"
          onClick={() => go(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
        <button
          type="button"
          className="h-11 rounded-full bg-bubble px-4 text-sm font-medium"
          onClick={() => setMarks((current) => ({ ...current, [card.id]: "learn" }))}
        >
          Still learning
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink"
          onClick={() => setMarks((current) => ({ ...current, [card.id]: "know" }))}
        >
          <Check className="size-4" />
          Know it
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-canvas px-3 text-sm"
          onClick={() => go(Math.min(kit.flashcards.length - 1, index + 1))}
          disabled={index === kit.flashcards.length - 1}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Quiz({ kit }: { kit: StudyKit }) {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);
  const item = kit.quiz[step];

  if (done || !item) {
    return (
      <div className="rounded-2xl border border-line bg-canvas p-5">
        <p className="text-sm text-muted">Score</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          {hits} / {kit.quiz.length}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {hits === kit.quiz.length
            ? "Clean run. Try another set, or flip the flashcards you still hesitate on."
            : "Review the ones you missed, then run it again."}
        </p>
        <button
          type="button"
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
          onClick={() => {
            setStep(0);
            setRevealed(false);
            setHits(0);
            setDone(false);
          }}
        >
          <RotateCcw className="size-4" />
          Retry quiz
        </button>
      </div>
    );
  }

  function grade(hit: boolean) {
    const nextHits = hits + (hit ? 1 : 0);
    setHits(nextHits);
    if (step + 1 >= kit.quiz.length) {
      setDone(true);
      return;
    }
    setStep(step + 1);
    setRevealed(false);
  }

  return (
    <div>
      <p className="text-sm text-muted tabular-nums">
        Question {step + 1} / {kit.quiz.length}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug">{item.question}</h3>
      {revealed ? (
        <div className="mt-4 rounded-2xl border border-line bg-canvas p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Answer</p>
          <p className="mt-2 leading-relaxed">{item.answer}</p>
          {item.explanation ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.explanation}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="h-11 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink"
              onClick={() => grade(true)}
            >
              I got it
            </button>
            <button
              type="button"
              className="h-11 rounded-full bg-bubble px-4 text-sm font-medium"
              onClick={() => grade(false)}
            >
              Missed it
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="mt-4 h-11 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
          onClick={() => setRevealed(true)}
        >
          Show answer
        </button>
      )}
    </div>
  );
}
