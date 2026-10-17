import { LIBRARY } from "@/lib/study/library";
import type { LessonProgress, StudyRef } from "@/lib/study/types";

export function packKey(id: string): string {
  return `pack:${id}`;
}

export function deckKey(id: string): string {
  return `deck:${id}`;
}

export function refKey(ref: StudyRef): string {
  return ref.type === "pack" ? packKey(ref.id) : deckKey(ref.id);
}

export function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function addDay(days: string[], date = new Date()): string[] {
  const key = dayKey(date);
  if (days.includes(key)) return days;
  return [...days, key].slice(-60);
}

export function streakCount(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function mastery(cardCount: number, progress?: LessonProgress): number {
  if (cardCount <= 0) {
    if (!progress?.quizTotal) return 0;
    return (progress.quizScore ?? 0) / progress.quizTotal;
  }
  const known = Math.min(progress?.known.length ?? 0, cardCount) / cardCount;
  if (!progress?.quizTotal) return known;
  const quiz = (progress.quizScore ?? 0) / progress.quizTotal;
  return known * 0.7 + quiz * 0.3;
}

export function trackRollup(track: "Python" | "AWS" | "HTML", progress: Record<string, LessonProgress>): number {
  const packs = LIBRARY.filter((pack) => pack.track === track);
  if (packs.length === 0) return 0;
  const total = packs.reduce(
    (sum, pack) => sum + mastery(pack.kit.flashcards.length, progress[packKey(pack.id)]),
    0,
  );
  return total / packs.length;
}
