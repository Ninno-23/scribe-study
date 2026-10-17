import { useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, RotateCcw } from "lucide-react";
import { InlineText } from "@/components/study/markdown";
import { packById } from "@/lib/study/library";
import { refKey } from "@/lib/study/progress";
import { useStudy } from "@/lib/study/store";
import { materializeKit, type Flashcard, type StudyKit, type StudyRef } from "@/lib/study/types";
import { cn } from "@/lib/cn";

function resolveKit(ref: StudyRef, decks: { id: string; kit: StudyKit }[]): StudyKit | null {
  if (ref.type === "deck") return decks.find((deck) => deck.id === ref.id)?.kit ?? null;
  const pack = packById(ref.id);
  return pack ? materializeKit(pack.kit) : null;
}

function backView(ref: StudyRef) {
  return ref.type === "pack" ? ({ kind: "lesson", packId: ref.id } as const) : ({ kind: "practice" } as const);
}

export function CardSession({ studyRef }: { studyRef: StudyRef }) {
  const decks = useStudy((state) => state.decks);
  const progress = useStudy((state) => state.progress);
  const markCard = useStudy((state) => state.markCard);
  const setView = useStudy((state) => state.setView);
  const kit = useMemo(() => resolveKit(studyRef, decks), [studyRef, decks]);
  const key = refKey(studyRef);
  const known = progress[key]?.known ?? [];
  const knownAtStart = useRef<string[] | null>(null);
  const [round, setRound] = useState(0);
  if (kit && knownAtStart.current === null) knownAtStart.current = known;

  const queue = useMemo(() => {
    if (!kit) return [];
    const base = knownAtStart.current ?? [];
    const fresh = kit.flashcards.filter((card) => !base.includes(card.id));
    return fresh.length > 0 ? fresh : kit.flashcards;
  }, [kit, round]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  if (!kit || kit.flashcards.length === 0) {
    return (
      <Empty label="This set has no flashcards yet." onBack={() => setView(backView(studyRef))} />
    );
  }

  const reviewing = queue.length === kit.flashcards.length && known.length === kit.flashcards.length;
  const card = queue[Math.min(index, queue.length - 1)] as Flashcard;

  function grade(know: boolean) {
    markCard(key, card.id, know);
    setFlipped(false);
    if (index + 1 >= queue.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
  }

  if (done) {
    const after = useStudy.getState().progress[key]?.known ?? [];
    const score = kit.flashcards.filter((item) => after.includes(item.id)).length;
    return (
      <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center px-4 py-8">
        <p className="text-sm text-muted">Session</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {score} / {kit.flashcards.length} known
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {score === kit.flashcards.length
            ? "Every card in this set is marked known. Run them again if you want the feel of a clean recall."
            : "The ones you missed stay in the next pile."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
            onClick={() => {
              knownAtStart.current = useStudy.getState().progress[key]?.known ?? [];
              setRound((value) => value + 1);
              setIndex(0);
              setFlipped(false);
              setDone(false);
            }}
          >
            <RotateCcw className="size-4" />
            Again
          </button>
          <button
            type="button"
            className="h-11 rounded-full border border-line px-4 text-sm font-medium"
            onClick={() => setView(backView(studyRef))}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col px-4 py-4">
      <button
        type="button"
        onClick={() => setView(backView(studyRef))}
        className="inline-flex h-11 items-center gap-1 self-start text-sm text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        {studyRef.type === "pack" ? "Lesson" : "Practice"}
      </button>
      <div className="mt-2 flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          {index + 1} / {queue.length}
        </span>
        <span>{reviewing ? "Review" : "Still learning"}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bubble">
        <div className="h-full rounded-full bg-accent" style={{ width: `${((index + (flipped ? 0.5 : 0)) / queue.length) * 100}%` }} />
      </div>
      <div className="card-scene mt-6">
        <button
          type="button"
          className={cn("card-inner h-72 w-full text-left", flipped && "is-flipped")}
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? "Show question" : "Show answer"}
        >
          <span className="card-face flex flex-col justify-between rounded-3xl border border-line bg-paper p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{card.topic || "Question"}</span>
            <span className="py-6 text-xl font-semibold leading-snug">
              <InlineText text={card.front} />
            </span>
            <span className="text-sm text-muted">Tap to flip</span>
          </span>
          <span className="card-face card-back flex flex-col justify-between rounded-3xl border border-line bg-ink p-5 text-canvas">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">Answer</span>
            <span className="py-6 text-lg leading-relaxed">
              <InlineText text={card.back} />
            </span>
            <span className="text-sm text-canvas/70">Tap to flip back</span>
          </span>
        </button>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 pb-2">
        <button type="button" className="h-11 rounded-full bg-bubble text-sm font-medium" onClick={() => grade(false)}>
          Still learning
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-1 rounded-full bg-accent text-sm font-medium text-accent-ink"
          onClick={() => grade(true)}
        >
          <Check className="size-4" />
          Know it
        </button>
      </div>
    </div>
  );
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = next[i] as T;
    next[i] = next[j] as T;
    next[j] = swap;
  }
  return next;
}

export function QuizSession({ studyRef }: { studyRef: StudyRef }) {
  const decks = useStudy((state) => state.decks);
  const setView = useStudy((state) => state.setView);
  const recordQuiz = useStudy((state) => state.recordQuiz);
  const kit = useMemo(() => resolveKit(studyRef, decks), [studyRef, decks]);
  const key = refKey(studyRef);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);

  const item = kit?.quiz[step];
  const options = useMemo(() => {
    if (!kit || !item) return [];
    const others = [...new Set(kit.quiz.map((row) => row.answer).filter((answer) => answer !== item.answer))];
    return shuffle([item.answer, ...shuffle(others).slice(0, 3)]);
  }, [kit, item]);

  if (!kit || kit.quiz.length === 0) {
    return <Empty label="This set has no questions yet." onBack={() => setView(backView(studyRef))} />;
  }

  if (done || !item) {
    return (
      <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center px-4 py-8">
        <p className="text-sm text-muted">Quiz</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {hits} / {kit.quiz.length}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {hits === kit.quiz.length ? "Clean run." : "Read the lesson again, then retry the ones that slipped."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
            onClick={() => {
              setStep(0);
              setPicked(null);
              setHits(0);
              setDone(false);
            }}
          >
            <RotateCcw className="size-4" />
            Retry
          </button>
          <button
            type="button"
            className="h-11 rounded-full border border-line px-4 text-sm font-medium"
            onClick={() => setView(backView(studyRef))}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  function choose(option: string) {
    if (picked) return;
    setPicked(option);
  }

  function next() {
    const correct = picked === item?.answer;
    const nextHits = hits + (correct ? 1 : 0);
    if (step + 1 >= kit!.quiz.length) {
      setHits(nextHits);
      setDone(true);
      recordQuiz(key, nextHits, kit!.quiz.length);
      return;
    }
    setHits(nextHits);
    setStep(step + 1);
    setPicked(null);
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col px-4 py-4">
      <button
        type="button"
        onClick={() => setView(backView(studyRef))}
        className="inline-flex h-11 items-center gap-1 self-start text-sm text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        {studyRef.type === "pack" ? "Lesson" : "Practice"}
      </button>
      <p className="mt-2 text-sm text-muted tabular-nums">
        Question {step + 1} / {kit.quiz.length}
      </p>
      <h1 className="mt-2 text-2xl font-semibold leading-snug">{item.question}</h1>
      <div className="mt-5 space-y-2">
        {options.map((option) => {
          const selected = picked === option;
          const correct = option === item.answer;
          const show = picked !== null;
          return (
            <button
              key={option}
              type="button"
              disabled={picked !== null}
              onClick={() => choose(option)}
              className={cn(
                "flex min-h-11 w-full items-center rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed",
                !show && "border-line hover:bg-paper",
                show && correct && "border-accent bg-paper",
                show && selected && !correct && "border-danger text-danger",
                show && !selected && !correct && "border-line text-muted",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className="mt-4">
          {item.explanation ? <p className="text-sm leading-relaxed text-muted">{item.explanation}</p> : null}
          <button type="button" className="mt-4 h-11 rounded-full bg-ink px-5 text-sm font-medium text-canvas" onClick={next}>
            {step + 1 >= kit.quiz.length ? "See score" : "Next"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Empty({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="text-sm text-muted">{label}</p>
      <button type="button" className="mt-4 h-11 rounded-full bg-ink px-4 text-sm font-medium text-canvas" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
