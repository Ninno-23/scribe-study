export type StudyMode = "chat" | "summary" | "flashcards" | "reviewer" | "quiz" | "kit";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  topic?: string;
};

export type QuizItem = {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
};

export type ReviewSection = {
  heading: string;
  points: string[];
};

export type StudyKit = {
  title: string;
  summary: string;
  reviewer: ReviewSection[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
};

export type PackKit = {
  title: string;
  summary: string;
  reviewer: ReviewSection[];
  flashcards: { front: string; back: string; topic?: string }[];
  quiz: { question: string; answer: string; explanation?: string }[];
};

export type AttachmentMeta = {
  id: string;
  name: string;
  kind: "image" | "pdf" | "docx" | "text";
};

export type MessageSource = "model" | "library" | "file" | "error";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: AttachmentMeta[];
  sourceText?: string;
  kit?: StudyKit;
  source?: MessageSource;
  notice?: string;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

export type StudyRef = { type: "pack"; id: string } | { type: "deck"; id: string };

export type View =
  | { kind: "home" }
  | { kind: "guides" }
  | { kind: "practice" }
  | { kind: "lesson"; packId: string }
  | { kind: "cards"; ref: StudyRef }
  | { kind: "quiz"; ref: StudyRef }
  | { kind: "tutor" };

export type SavedDeck = {
  id: string;
  title: string;
  createdAt: number;
  kit: StudyKit;
};

export type LessonProgress = {
  known: string[];
  lastOpened?: number;
  quizScore?: number;
  quizTotal?: number;
  lastQuizScore?: number;
  lastQuizTotal?: number;
};

export function materializeKit(kit: PackKit): StudyKit {
  return {
    title: kit.title,
    summary: kit.summary,
    reviewer: kit.reviewer,
    flashcards: kit.flashcards.map((card, index) => ({ ...card, id: `c${index}` })),
    quiz: kit.quiz.map((item, index) => ({ ...item, id: `q${index}` })),
  };
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
