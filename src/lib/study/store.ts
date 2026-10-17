import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDay } from "@/lib/study/progress";
import type { ChatMessage, Conversation, LessonProgress, SavedDeck, StudyKit, View } from "@/lib/study/types";
import { uid } from "@/lib/study/types";

type Theme = "light" | "dark";

type StudyState = {
  theme: Theme;
  view: View;
  conversations: Conversation[];
  activeId: string | null;
  progress: Record<string, LessonProgress>;
  decks: SavedDeck[];
  studiedDays: string[];
  setTheme: (theme: Theme) => void;
  setView: (view: View) => void;
  select: (id: string | null) => void;
  openConversation: (title: string, messages: ChatMessage[]) => string;
  append: (id: string, message: ChatMessage, title?: string) => void;
  remove: (id: string) => void;
  touch: (key: string) => void;
  markCard: (key: string, cardId: string, know: boolean) => void;
  recordQuiz: (key: string, score: number, total: number) => void;
  saveDeck: (title: string, kit: StudyKit) => string;
  removeDeck: (id: string) => void;
};

function patchProgress(
  progress: Record<string, LessonProgress>,
  key: string,
  patch: Partial<LessonProgress>,
): Record<string, LessonProgress> {
  const current = progress[key] ?? { known: [] };
  return {
    ...progress,
    [key]: {
      ...current,
      ...patch,
      known: patch.known ?? current.known,
      lastOpened: Date.now(),
    },
  };
}

export const useStudy = create<StudyState>()(
  persist(
    (set) => ({
      theme: "light",
      view: { kind: "home" },
      conversations: [],
      activeId: null,
      progress: {},
      decks: [],
      studiedDays: [],
      setTheme: (theme) => set({ theme }),
      setView: (view) => set({ view }),
      select: (id) => set({ activeId: id }),
      openConversation: (title, messages) => {
        const id = uid();
        const conversation: Conversation = {
          id,
          title: title.slice(0, 80),
          updatedAt: Date.now(),
          messages,
        };
        set((state) => ({
          activeId: id,
          conversations: [conversation, ...state.conversations].slice(0, 40),
        }));
        return id;
      },
      append: (id, message, title) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  title: title ? title.slice(0, 80) : conversation.title,
                  updatedAt: Date.now(),
                  messages: [...conversation.messages, message],
                }
              : conversation,
          ),
        })),
      remove: (id) =>
        set((state) => ({
          activeId: state.activeId === id ? null : state.activeId,
          conversations: state.conversations.filter((conversation) => conversation.id !== id),
        })),
      touch: (key) =>
        set((state) => ({
          studiedDays: addDay(state.studiedDays),
          progress: patchProgress(state.progress, key, {}),
        })),
      markCard: (key, cardId, know) =>
        set((state) => {
          const current = state.progress[key]?.known ?? [];
          const knownIds = know
            ? current.includes(cardId)
              ? current
              : [...current, cardId]
            : current.filter((id) => id !== cardId);
          return {
            studiedDays: addDay(state.studiedDays),
            progress: patchProgress(state.progress, key, { known: knownIds }),
          };
        }),
      recordQuiz: (key, score, total) =>
        set((state) => {
          const current = state.progress[key];
          const best = current?.quizScore ?? -1;
          const better = score >= best;
          return {
            studiedDays: addDay(state.studiedDays),
            progress: patchProgress(state.progress, key, {
              quizScore: better ? score : current?.quizScore,
              quizTotal: better ? total : current?.quizTotal,
              lastQuizScore: score,
              lastQuizTotal: total,
            }),
          };
        }),
      saveDeck: (title, kit) => {
        const id = uid();
        const deck: SavedDeck = {
          id,
          title: title.slice(0, 80) || "Study set",
          createdAt: Date.now(),
          kit,
        };
        set((state) => ({ decks: [deck, ...state.decks].slice(0, 24) }));
        return id;
      },
      removeDeck: (id) =>
        set((state) => {
          const key = `deck:${id}`;
          const progress = { ...state.progress };
          delete progress[key];
          return {
            decks: state.decks.filter((deck) => deck.id !== id),
            progress,
            view:
              (state.view.kind === "cards" || state.view.kind === "quiz") &&
              state.view.ref.type === "deck" &&
              state.view.ref.id === id
                ? { kind: "practice" }
                : state.view,
          };
        }),
    }),
    {
      name: "scribe-desk",
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        conversations: state.conversations,
        activeId: state.activeId,
        progress: state.progress,
        decks: state.decks,
        studiedDays: state.studiedDays,
      }),
    },
  ),
);
