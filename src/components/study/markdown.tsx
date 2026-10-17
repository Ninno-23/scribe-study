import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index}`;
    index += 1;
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-bubble px-1 py-0.5 font-mono text-sm">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const linked = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (linked?.[1] && linked[2]) {
        nodes.push(
          <a key={key} href={linked[2]} target="_blank" rel="noreferrer" className="text-accent underline">
            {linked[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.trim().endsWith("|") && line.includes("|");
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function MarkdownView({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.trim().startsWith("```")) {
      const fence: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        fence.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre
          key={`pre-${index}`}
          className="my-3 overflow-x-auto rounded-xl bg-bubble px-3 py-3 font-mono text-sm leading-relaxed"
        >
          {fence.join("\n")}
        </pre>,
      );
      continue;
    }
    if (isTableRow(line) && isTableRow(lines[index + 1] ?? "")) {
      const rows: string[][] = [];
      while (index < lines.length && isTableRow(lines[index] ?? "")) {
        const row = cells(lines[index] ?? "");
        if (!row.every((cell) => /^:?-+:?$/.test(cell))) rows.push(row);
        index += 1;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={`table-${index}`} className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {head ? (
              <thead>
                <tr>
                  {head.map((cell, cellIndex) => (
                    <th key={cellIndex} className="border-b border-line px-2 py-2 font-semibold">
                      {inline(cell, `th-${index}-${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-b border-line px-2 py-2 align-top">
                      {inline(cell, `td-${index}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading?.[1] && heading[2]) {
      const level = heading[1].length;
      const content = inline(heading[2], `h-${index}`);
      const className =
        level === 1
          ? "mb-2 mt-4 font-sans text-2xl font-semibold tracking-tight"
          : level === 2
            ? "mb-2 mt-4 text-lg font-semibold"
            : "mb-1 mt-3 text-base font-semibold";
      const Tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      blocks.push(
        <Tag key={`h-${index}`} className={className}>
          {content}
        </Tag>,
      );
      index += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`} className="my-2 list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{inline(item, `li-${index}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+[.)]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^\d+[.)]\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${index}`} className="my-2 list-decimal space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{inline(item, `oli-${index}-${itemIndex}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const paragraph: string[] = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() &&
      !/^(#{1,3}\s|```|[-*]\s|\d+[.)]\s)/.test((lines[index] ?? "").trim()) &&
      !isTableRow(lines[index] ?? "")
    ) {
      paragraph.push((lines[index] ?? "").trim());
      index += 1;
    }
    blocks.push(
      <p key={`p-${index}`} className="my-2 leading-relaxed">
        {inline(paragraph.join(" "), `p-${index}`)}
      </p>,
    );
  }

  return <div className="text-pretty">{blocks}</div>;
}

export function InlineText({ text }: { text: string }) {
  return <>{inline(text, "in")}</>;
}
