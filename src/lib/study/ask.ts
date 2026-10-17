import { createServerFn } from "@tanstack/react-start";
import type { Flashcard, QuizItem, ReviewSection, StudyKit, StudyMode } from "@/lib/study/types";

export type AskInput = {
  mode: StudyMode;
  prompt: string;
  history: { role: "user" | "assistant"; text: string }[];
  documents: { name: string; text: string }[];
  images: { name: string; dataUrl: string }[];
};

export type AskResult =
  | { ok: true; text: string; kit: StudyKit | null }
  | { ok: false; error: string; code: "quota" | "unavailable" | "upstream" };

const MODES = new Set<StudyMode>(["chat", "summary", "flashcards", "reviewer", "quiz", "kit"]);

function clip(value: string, max: number): string {
  const text = value.replace(/\u0000/g, "").trim();
  return text.length > max ? text.slice(0, max) : text;
}

function asMode(value: unknown): StudyMode {
  return typeof value === "string" && MODES.has(value as StudyMode) ? (value as StudyMode) : "chat";
}

const SYSTEM = `You are Scribe, a careful study tutor. The student may attach photos of notes, PDF text, or Word text. Treat that material as the source of truth. If a page is a cheat sheet or slide, teach from what is actually there. Do not invent citations, page numbers, or services that are not in the source. When the source is general knowledge because nothing was attached, say so by teaching plainly rather than pretending you read a file.
Write in clear, short prose. Use the student's wording when a term matters. Prefer concrete examples over slogans.`;

function modeInstruction(mode: StudyMode): string {
  if (mode === "chat") {
    return "Answer in markdown. Use short headings and bullets when they help. If the student attached notes and did not ask a specific question, explain the material and end with the three ideas most worth remembering.";
  }
  if (mode === "summary") {
    return "Return markdown only: a tight study summary with a title heading and 4 to 7 short paragraphs or bullets. No preamble.";
  }
  if (mode === "reviewer") {
    return "Return markdown only: a study reviewer the student can read top to bottom. Use ## sections, bullets, and a short comparison or 'remember' section when the material has one. No preamble.";
  }
  const shape =
    mode === "flashcards"
      ? "Fill flashcards with 8 to 12 cards. Leave reviewer and quiz as empty arrays. Summary is one sentence."
      : mode === "quiz"
        ? "Fill quiz with 6 questions. Leave reviewer and flashcards as empty arrays. Summary is one sentence."
        : "Fill every part: summary of 2 short paragraphs, 4 to 6 reviewer sections, 8 to 12 flashcards, and 6 quiz items.";
  return `Return JSON only, no markdown fences, with this shape:
{"title":"string","summary":"string","reviewer":[{"heading":"string","points":["string"]}],"flashcards":[{"front":"string","back":"string","topic":"string"}],"quiz":[{"question":"string","answer":"string","explanation":"string"}]}
${shape}
Fronts are questions. Backs are answers a student can say aloud. Quiz answers stay short. Explanations are one sentence.`;
}

function normalizeKit(value: unknown): StudyKit | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const reviewer: ReviewSection[] = [];
  if (Array.isArray(record.reviewer)) {
    for (const section of record.reviewer) {
      if (!section || typeof section !== "object") continue;
      const item = section as Record<string, unknown>;
      const heading = typeof item.heading === "string" ? item.heading.trim() : "";
      const points = Array.isArray(item.points)
        ? item.points.filter((point): point is string => typeof point === "string" && point.trim().length > 0).slice(0, 8)
        : [];
      if (heading && points.length > 0) reviewer.push({ heading, points });
      if (reviewer.length >= 8) break;
    }
  }
  const flashcards: Flashcard[] = [];
  if (Array.isArray(record.flashcards)) {
    for (const card of record.flashcards) {
      if (!card || typeof card !== "object") continue;
      const item = card as Record<string, unknown>;
      const front = typeof item.front === "string" ? item.front.trim() : "";
      const back = typeof item.back === "string" ? item.back.trim() : "";
      if (!front || !back) continue;
      const topic = typeof item.topic === "string" ? item.topic.trim() : "";
      flashcards.push({
        id: `c${flashcards.length}`,
        front,
        back,
        ...(topic ? { topic } : {}),
      });
      if (flashcards.length >= 16) break;
    }
  }
  const quiz: QuizItem[] = [];
  if (Array.isArray(record.quiz)) {
    for (const row of record.quiz) {
      if (!row || typeof row !== "object") continue;
      const item = row as Record<string, unknown>;
      const question = typeof item.question === "string" ? item.question.trim() : "";
      const answer = typeof item.answer === "string" ? item.answer.trim() : "";
      if (!question || !answer) continue;
      const explanation = typeof item.explanation === "string" ? item.explanation.trim() : "";
      quiz.push({
        id: `q${quiz.length}`,
        question,
        answer,
        ...(explanation ? { explanation } : {}),
      });
      if (quiz.length >= 10) break;
    }
  }
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const title = typeof record.title === "string" && record.title.trim() ? record.title.trim() : "Study notes";
  if (!summary && reviewer.length === 0 && flashcards.length === 0 && quiz.length === 0) return null;
  return { title, summary, reviewer, flashcards, quiz };
}

function parseModelKit(raw: string): StudyKit | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced?.[1] ?? raw;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return normalizeKit(JSON.parse(body.slice(start, end + 1)));
  } catch {
    return null;
  }
}

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail: "high" } };

async function complete(apiKey: string, model: string, messages: unknown[]): Promise<Response> {
  return fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 2800,
      messages,
    }),
    signal: AbortSignal.timeout(90_000),
  });
}

export const askScribe = createServerFn({ method: "POST" })
  .validator((input: unknown): AskInput => {
    if (!input || typeof input !== "object") throw new Error("Invalid request");
    const raw = input as Partial<AskInput>;
    const history = Array.isArray(raw.history)
      ? raw.history
          .filter(
            (item): item is { role: "user" | "assistant"; text: string } =>
              !!item &&
              typeof item === "object" &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.text === "string",
          )
          .slice(-6)
          .map((item) => ({ role: item.role, text: clip(item.text, 4000) }))
      : [];
    const documents = Array.isArray(raw.documents)
      ? raw.documents
          .filter(
            (item): item is { name: string; text: string } =>
              !!item && typeof item === "object" && typeof item.name === "string" && typeof item.text === "string",
          )
          .slice(0, 4)
          .map((item) => ({ name: clip(item.name, 120), text: clip(item.text, 14_000) }))
      : [];
    const images = Array.isArray(raw.images)
      ? raw.images
          .filter(
            (item): item is { name: string; dataUrl: string } =>
              !!item &&
              typeof item === "object" &&
              typeof item.name === "string" &&
              typeof item.dataUrl === "string" &&
              /^data:image\/jpeg;base64,[a-z0-9+/=\s]+$/i.test(item.dataUrl) &&
              item.dataUrl.length < 950_000,
          )
          .slice(0, 3)
          .map((item) => ({ name: clip(item.name, 120), dataUrl: item.dataUrl }))
      : [];
    return {
      mode: asMode(raw.mode),
      prompt: clip(typeof raw.prompt === "string" ? raw.prompt : "", 12_000),
      history,
      documents,
      images,
    };
  })
  .handler(async ({ data }): Promise<AskResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        code: "unavailable",
        error: "Live answers are not available right now. The built-in library still works, and text files can be turned into a quick kit on this device.",
      };
    }

    const docBlock = data.documents
      .filter((doc) => doc.text)
      .map((doc) => `## ${doc.name}\n${doc.text}`)
      .join("\n\n");
    const ask =
      data.prompt ||
      (data.images.length || docBlock
        ? "Read the attached notes and teach them clearly."
        : "");
    if (!ask && data.history.length === 0) {
      return { ok: false, code: "upstream", error: "Add a question or a file first." };
    }

    const userText = [
      docBlock ? `Attached text:\n\n${docBlock}` : "",
      modeInstruction(data.mode),
      ask ? `Student request:\n${ask}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const history = data.history.map((item) => ({
      role: item.role,
      content: item.text,
    }));
    const userContent: string | ContentPart[] =
      data.images.length > 0
        ? [
            ...data.images.map((image) => ({
              type: "image_url" as const,
              image_url: { url: image.dataUrl, detail: "high" as const },
            })),
            { type: "text" as const, text: userText },
          ]
        : userText;

    const messages = [
      { role: "system", content: SYSTEM },
      ...history,
      { role: "user", content: userContent },
    ];

    try {
      let response = await complete(apiKey, "grok-4.5", messages);
      if (response.status === 400) {
        const probe = await response.text();
        if (/model/i.test(probe)) response = await complete(apiKey, "grok-4", messages);
        else {
          return mapFailure(response.status, probe);
        }
      }
      if (!response.ok) {
        const body = await response.text();
        return mapFailure(response.status, body);
      }
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) {
        return { ok: false, code: "upstream", error: "The tutor returned an empty answer. Try again." };
      }
      const structured = data.mode === "flashcards" || data.mode === "quiz" || data.mode === "kit";
      const kit = structured ? parseModelKit(text) : null;
      if (structured && kit) {
        return { ok: true, text: kit.summary || "Study kit ready.", kit };
      }
      return { ok: true, text, kit: null };
    } catch {
      return {
        ok: false,
        code: "upstream",
        error: "The tutor took too long or could not be reached. Try a smaller file.",
      };
    }
  });

function mapFailure(status: number, body: string): AskResult {
  if (body.includes("spending-limit") || body.includes("credits") || status === 402 || status === 429) {
    return {
      ok: false,
      code: "quota",
      error:
        "Live answers are paused because Grok credits are used up. You can still open the Python and AWS library, and text pulled from a PDF or Word file can become a quick kit on this device.",
    };
  }
  return {
    ok: false,
    code: "upstream",
    error: "The tutor could not answer just now. Try again in a moment.",
  };
}
