import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookmarkPlus, FileText, Image as ImageIcon, Paperclip, Send, Trash2, X } from "lucide-react";
import { KitView } from "@/components/study/kit-view";
import { MarkdownView } from "@/components/study/markdown";
import { askScribe } from "@/lib/study/ask";
import { readFiles, type ParsedFile } from "@/lib/study/files";
import { kitFromText } from "@/lib/study/local-kit";
import { searchPacks, type Pack } from "@/lib/study/library";
import { useStudy } from "@/lib/study/store";
import { materializeKit, uid, type ChatMessage, type StudyKit, type StudyMode } from "@/lib/study/types";
import { cn } from "@/lib/cn";

function historyText(message: ChatMessage): string {
  const kit = message.kit
    ? [message.kit.summary, ...message.kit.reviewer.flatMap((section) => [section.heading, ...section.points])]
        .join("\n")
        .slice(0, 2200)
    : "";
  return [message.content, kit, message.sourceText ? `Source notes:\n${message.sourceText}` : ""]
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
}

const MODES: { id: StudyMode; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "summary", label: "Summary" },
  { id: "flashcards", label: "Flashcards" },
  { id: "reviewer", label: "Reviewer" },
  { id: "quiz", label: "Q&A" },
  { id: "kit", label: "Study kit" },
];

const STATUS: Record<StudyMode, string> = {
  chat: "Reading your notes",
  summary: "Writing the summary",
  flashcards: "Making flashcards",
  reviewer: "Writing the reviewer",
  quiz: "Writing questions",
  kit: "Building the study kit",
};

function strongPack(query: string): Pack | null {
  const hit = searchPacks(query)[0];
  if (!hit) return null;
  const q = query.toLowerCase();
  const named =
    q.includes(hit.title.toLowerCase()) || hit.keywords.some((keyword) => keyword.length > 2 && q.includes(keyword));
  return named ? hit : null;
}

export function Tutor() {
  const conversations = useStudy((state) => state.conversations);
  const activeId = useStudy((state) => state.activeId);
  const select = useStudy((state) => state.select);
  const remove = useStudy((state) => state.remove);
  const saveDeck = useStudy((state) => state.saveDeck);
  const setView = useStudy((state) => state.setView);
  const ask = useServerFn(askScribe);

  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<StudyMode>("chat");
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [parsing, setParsing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((conversation) => conversation.id === activeId) ?? null;

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [active?.id, active?.messages.length, busy]);

  async function addFiles(list: File[]) {
    if (list.length === 0) return;
    setParsing(true);
    try {
      const room = Math.max(0, 4 - files.length);
      const parsed = await readFiles(list.slice(0, room));
      setFiles((current) => [...current, ...parsed].slice(0, 4));
    } finally {
      setParsing(false);
    }
  }

  function keep(messageId: string, title: string, kit: StudyKit) {
    if (saved[messageId]) {
      setView({ kind: "cards", ref: { type: "deck", id: saved[messageId] } });
      return;
    }
    const id = saveDeck(title, kit);
    setSaved((current) => ({ ...current, [messageId]: id }));
    setView({ kind: "cards", ref: { type: "deck", id } });
  }

  async function submit(prompt: string, nextMode: StudyMode, attached: ParsedFile[]) {
    const text = prompt.trim();
    const usable = attached.filter((file) => !file.error);
    if (!text && usable.length === 0) return;
    if (busy) return;

    const display = text || "Read the attached notes.";
    const sourceText = usable
      .map((file) => (file.text ? `# ${file.name}\n${file.text}` : ""))
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 8000);
    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: display,
      attachments: usable.map((file) => ({ id: file.id, name: file.name, kind: file.kind })),
      sourceText: sourceText || undefined,
    };

    const state = useStudy.getState();
    const current = state.conversations.find((conversation) => conversation.id === state.activeId) ?? null;
    const prior = (current?.messages ?? []).slice(-6).map((message) => ({
      role: message.role,
      text: historyText(message),
    }));
    const title = current?.title || text.slice(0, 64) || usable[0]?.name || "New chat";
    const conversationId = current ? current.id : state.openConversation(title, [userMessage]);
    if (current) state.append(conversationId, userMessage, current.messages.length === 0 ? title : undefined);

    setDraft("");
    setFiles([]);
    setBusy(true);

    const documents = usable.filter((file) => file.text).map((file) => ({ name: file.name, text: file.text }));
    const images = usable.flatMap((file) => file.images.map((dataUrl) => ({ name: file.name, dataUrl }))).slice(0, 3);

    try {
      const result = await ask({
        data: {
          mode: nextMode,
          prompt: text,
          history: prior,
          documents,
          images,
        },
      });
      if (result.ok) {
        useStudy.getState().append(conversationId, {
          id: uid(),
          role: "assistant",
          content: result.text,
          kit: result.kit ?? undefined,
          source: "model",
        });
        return;
      }

      const local = sourceText ? kitFromText(usable[0]?.name.replace(/\.[^.]+$/, "") || "Your notes", sourceText) : null;
      if (local && (nextMode !== "chat" || sourceText.length > 80)) {
        useStudy.getState().append(conversationId, {
          id: uid(),
          role: "assistant",
          content: "I pulled the text out of your file and built a quick kit on this device.",
          kit: local,
          source: "file",
          notice: result.error,
        });
        return;
      }
      const pack = strongPack(text);
      if (pack) {
        useStudy.getState().append(conversationId, {
          id: uid(),
          role: "assistant",
          content: `Live answers are paused, so here is the built-in guide for ${pack.title}.`,
          kit: materializeKit(pack.kit),
          source: "library",
          notice: result.error,
        });
        return;
      }
      useStudy.getState().append(conversationId, {
        id: uid(),
        role: "assistant",
        content: result.error,
        source: "error",
      });
    } catch {
      useStudy.getState().append(conversationId, {
        id: uid(),
        role: "assistant",
        content: "Something went wrong before an answer came back. Try again.",
        source: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6">
          {conversations.length > 0 ? (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                className="h-11 shrink-0 rounded-full border border-line px-3 text-sm"
                onClick={() => select(null)}
              >
                New
              </button>
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => select(conversation.id)}
                    className={cn(
                      "h-11 max-w-40 truncate rounded-l-full px-3 text-sm",
                      conversation.id === activeId ? "bg-ink text-canvas" : "bg-bubble",
                    )}
                  >
                    {conversation.title}
                  </button>
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-r-full bg-bubble text-muted hover:text-ink"
                    aria-label={`Delete ${conversation.title}`}
                    onClick={() => remove(conversation.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {active ? (
            <div className="space-y-6">
              {active.messages.map((message, index) => (
                <Message
                  key={message.id}
                  message={message}
                  busy={busy}
                  isLast={index === active.messages.length - 1}
                  saved={Boolean(saved[message.id])}
                  onSave={(kit) => keep(message.id, active.title, kit)}
                  onFollowUp={(nextMode) => {
                    const label = MODES.find((item) => item.id === nextMode)?.label ?? "Study kit";
                    void submit(`Turn these notes into a ${label.toLowerCase()}.`, nextMode, []);
                  }}
                />
              ))}
              {busy ? <Pending label={STATUS[mode]} /> : null}
            </div>
          ) : (
            <div className="pb-6">
              <h1 className="text-3xl font-semibold tracking-tight">Ask the tutor</h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                Send a photo of your notes, a PDF, a Word file, or an HTML page. You get an explanation, then a summary, reviewer,
                flashcards, and a quiz you can save under Practice.
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-6 flex w-full flex-col items-start gap-1 rounded-3xl border border-dashed border-line bg-paper px-5 py-6 text-left"
              >
                <span className="text-base font-semibold">Attach a file</span>
                <span className="text-sm text-muted">PNG, JPG, PDF, Word, or HTML. Up to four files.</span>
              </button>
              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ["Explain Python lists with a short example", "chat"],
                    ["Quiz me on AWS S3", "quiz"],
                    ["Reviewer for security groups vs NACLs", "reviewer"],
                  ] as const
                ).map(([prompt, nextMode]) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setMode(nextMode);
                      void submit(prompt, nextMode, []);
                    }}
                    className="h-11 rounded-full border border-line px-4 text-left text-sm hover:bg-bubble"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 pt-2 pb-3">
        <form
          className="composer mx-auto w-full max-w-3xl rounded-3xl bg-canvas"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(draft, mode, files);
          }}
        >
          {files.length > 0 ? (
            <ul className="flex flex-wrap gap-2 px-3 pt-3">
              {files.map((file) => (
                <li
                  key={file.id}
                  className={cn(
                    "flex max-w-full items-center gap-2 rounded-full bg-bubble py-1 pl-3 pr-1 text-sm",
                    file.error && "text-danger",
                  )}
                >
                  {file.kind === "image" ? <ImageIcon className="size-4 shrink-0" /> : <FileText className="size-4 shrink-0" />}
                  <span className="truncate">{file.error ? `${file.name}: ${file.error}` : file.name}</span>
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-full hover:bg-canvas"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <label className="sr-only" htmlFor="prompt">
            Message
          </label>
          <textarea
            id="prompt"
            rows={1}
            value={draft}
            placeholder={files.length ? "Ask about these files, or just send" : "Ask anything, or attach a photo, PDF, Word, or HTML file"}
            className="max-h-40 w-full resize-none bg-transparent px-4 pt-4 text-base outline-none placeholder:text-muted"
            onChange={(event) => {
              setDraft(event.target.value);
              const target = event.target;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(draft, mode, files);
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full hover:bg-bubble"
              aria-label="Attach a photo, PDF, or Word file"
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip className="size-5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,.pdf,.docx,.txt,.md,.csv,.html,.htm,text/html,application/pdf"
              onChange={(event) => {
                const list = [...(event.target.files ?? [])];
                event.target.value = "";
                void addFiles(list);
              }}
            />
            <label className="sr-only" htmlFor="study-mode">
              What to create
            </label>
            <select
              id="study-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value as StudyMode)}
              className="h-11 max-w-40 rounded-full bg-bubble px-3 text-sm"
            >
              {MODES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy || parsing || (!draft.trim() && files.every((file) => file.error || (!file.text && file.images.length === 0)))}
              className="ml-auto grid size-11 place-items-center rounded-full bg-ink text-canvas disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </form>
        <p className="mx-auto mt-2 max-w-3xl px-2 text-center text-xs text-muted">
          {parsing ? "Reading the file…" : "Enter sends. Shift+Enter adds a line."}
        </p>
      </div>
    </div>
  );
}

function Message({
  message,
  busy,
  isLast,
  saved,
  onSave,
  onFollowUp,
}: {
  message: ChatMessage;
  busy: boolean;
  isLast: boolean;
  saved: boolean;
  onSave: (kit: StudyKit) => void;
  onFollowUp: (mode: StudyMode) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl rounded-3xl bg-bubble px-4 py-3">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          {message.attachments && message.attachments.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {message.attachments.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <article className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-semibold text-canvas">S</span>
        <span className="text-sm font-semibold">Scribe</span>
        {message.source === "library" ? <span className="text-xs text-muted">Guide</span> : null}
        {message.source === "file" ? <span className="text-xs text-muted">From your file</span> : null}
      </div>
      {message.notice ? (
        <p className="mb-3 rounded-2xl bg-paper px-3 py-2 text-sm leading-relaxed text-warn">{message.notice}</p>
      ) : null}
      {message.kit ? <p className="leading-relaxed">{message.content}</p> : <MarkdownView text={message.content} />}
      {message.kit ? <KitView kit={message.kit} /> : null}
      {message.kit ? (
        <button
          type="button"
          className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas"
          onClick={() => onSave(message.kit as StudyKit)}
        >
          <BookmarkPlus className="size-4" />
          {saved ? "Open saved set" : "Save and study"}
        </button>
      ) : null}
      {isLast && !busy && message.source !== "error" && !message.kit ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(["summary", "flashcards", "reviewer", "quiz", "kit"] as StudyMode[]).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => onFollowUp(nextMode)}
              className="h-11 rounded-full border border-line px-3 text-sm hover:bg-bubble"
            >
              {MODES.find((item) => item.id === nextMode)?.label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function Pending({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted" aria-live="polite">
      <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-semibold text-canvas">S</span>
      <span>{label}</span>
      <span className="flex gap-1" aria-hidden="true">
        <span className="dot size-1.5 rounded-full bg-muted" />
        <span className="dot size-1.5 rounded-full bg-muted" />
        <span className="dot size-1.5 rounded-full bg-muted" />
      </span>
    </div>
  );
}
