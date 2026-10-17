import { materializeKit, type PackKit, type StudyKit } from "@/lib/study/types";

function clean(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\t/g, "  ").trim();
}

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 80) return false;
  if (/^#{1,4}\s+\S/.test(trimmed)) return true;
  if (/^\d{1,2}[.)]\s+\S/.test(trimmed) && trimmed.length < 70) return true;
  if (trimmed.endsWith(":") && trimmed.length < 60) return true;
  const letters = trimmed.replace(/[^A-Za-z]/g, "");
  if (letters.length > 3 && letters === letters.toUpperCase() && trimmed.split(/\s+/).length <= 8) return true;
  return false;
}

function headingText(line: string): string {
  return line
    .trim()
    .replace(/^#{1,4}\s+/, "")
    .replace(/^\d{1,2}[.)]\s+/, "")
    .replace(/:$/, "")
    .trim();
}

type Section = { heading: string; points: string[] };

function sectionsFrom(text: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: "Notes", points: [] };
  const pushPoint = (point: string) => {
    const value = point.replace(/\s+/g, " ").trim();
    if (value.length > 1) current.points.push(value);
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("```")) continue;
    if (isHeading(line)) {
      if (current.points.length || sections.length === 0) {
        if (current.points.length) sections.push(current);
      }
      current = { heading: headingText(line), points: [] };
      continue;
    }
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet?.[1]) {
      pushPoint(bullet[1]);
      continue;
    }
    if (line.includes("|") && line.split("|").length > 2) {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
      pushPoint(cells.join(" — "));
      continue;
    }
    pushPoint(line);
  }
  if (current.points.length) sections.push(current);
  return sections.filter((section) => section.points.length > 0).slice(0, 8);
}

function definitionCards(text: string): { front: string; back: string }[] {
  const cards: { front: string; back: string }[] = [];
  const seen = new Set<string>();
  for (const raw of text.split("\n")) {
    const line = raw.trim().replace(/^[-*•]\s+/, "");
    const match = line.match(/^(.{2,48}?)\s*(?::|—|–)\s+(.{8,220})$/);
    if (!match?.[1] || !match[2]) continue;
    const front = match[1].replace(/^\d+[.)]\s+/, "").trim();
    const back = match[2].trim();
    if (/^https?:/i.test(front) || seen.has(front.toLowerCase())) continue;
    seen.add(front.toLowerCase());
    cards.push({ front: `What is ${front.replace(/\?$/, "")}?`, back });
    if (cards.length >= 10) break;
  }
  return cards;
}

export function kitFromText(title: string, raw: string): StudyKit | null {
  const text = clean(raw);
  if (text.length < 40) return null;
  const sections = sectionsFrom(text);
  const defined = definitionCards(text);
  const fallback = sections.slice(0, 8).map((section) => ({
    front: `What should you remember about ${section.heading}?`,
    back: section.points.slice(0, 3).join(" "),
  }));
  const cards = (defined.length >= 3 ? defined : fallback).slice(0, 10);
  if (cards.length === 0) return null;

  const summaryBits = sections.slice(0, 4).map((section) => {
    const lead = section.points[0] ?? "";
    return `${section.heading}: ${lead}`;
  });
  const summary =
    summaryBits.join("\n\n") ||
    text.split(/\n\s*\n/).slice(0, 3).join("\n\n").slice(0, 900);

  const kit: PackKit = {
    title,
    summary,
    reviewer: sections.length
      ? sections
      : [{ heading: "From the file", points: text.split("\n").filter(Boolean).slice(0, 12) }],
    flashcards: cards.map((card) => ({ ...card, topic: title })),
    quiz: cards.slice(0, 6).map((card) => ({
      question: card.front,
      answer: card.back,
      explanation: "Pulled from the text in your file. Check the wording against the original.",
    })),
  };
  return materializeKit(kit);
}
