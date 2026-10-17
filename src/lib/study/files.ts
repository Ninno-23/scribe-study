export type ParsedKind = "image" | "pdf" | "docx" | "text";

export type ParsedFile = {
  id: string;
  name: string;
  kind: ParsedKind;
  text: string;
  images: string[];
  error?: string;
};

const MAX_FILES = 4;
const MAX_BYTES = 12 * 1024 * 1024;
const TEXT_CAP = 24_000;

function id(): string {
  return crypto.randomUUID();
}

function clip(text: string): string {
  const clean = text.replace(/\u0000/g, "").trim();
  if (clean.length <= TEXT_CAP) return clean;
  return `${clean.slice(0, TEXT_CAP)}\n\n[Truncated. The rest of the file was not sent.]`;
}

async function blobToJpeg(blob: Blob, maxEdge = 1280): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that image.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let quality = 0.72;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 680_000 && quality > 0.42) {
    quality -= 0.08;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  if (url.length > 900_000) {
    throw new Error("That image is too large. Try a smaller photo.");
  }
  return url;
}

async function canvasPageJpeg(
  canvas: HTMLCanvasElement,
): Promise<string> {
  let quality = 0.7;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 680_000 && quality > 0.4) {
    quality -= 0.08;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  return url.length > 900_000 ? "" : url;
}

async function readPdf(file: File): Promise<Pick<ParsedFile, "text" | "images">> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pageCount = Math.min(doc.numPages, 12);
  const chunks: string[] = [];
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (line) chunks.push(line);
  }
  const text = clip(chunks.join("\n"));
  const images: string[] = [];
  if (text.length < 160) {
    const shots = Math.min(doc.numPages, 2);
    for (let pageNumber = 1; pageNumber <= shots; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(1.35, 1200 / base.width);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, viewport }).promise;
      const url = await canvasPageJpeg(canvas);
      if (url) images.push(url);
    }
  }
  return { text, images };
}

async function readDocx(file: File): Promise<string> {
  const loaded = await import("mammoth/mammoth.browser.js");
  const result = await loaded.default.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return clip(result.value || "");
}

function kindOf(file: File): ParsedKind | "reject" | "doc" {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/.test(name)) return "image";
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".doc")) return "doc";
  if (file.type.startsWith("text/") || /\.(txt|md|csv|json|html?)$/.test(name)) return "text";
  return "reject";
}

export async function readFiles(files: File[]): Promise<ParsedFile[]> {
  const selected = files.slice(0, MAX_FILES);
  const parsed: ParsedFile[] = [];
  for (const file of selected) {
    const kind = kindOf(file);
    if (file.size > MAX_BYTES) {
      parsed.push({
        id: id(),
        name: file.name,
        kind: "text",
        text: "",
        images: [],
        error: "That file is over 12 MB.",
      });
      continue;
    }
    if (kind === "doc") {
      parsed.push({
        id: id(),
        name: file.name,
        kind: "docx",
        text: "",
        images: [],
        error: "Older .doc files are not supported. Save it as .docx and try again.",
      });
      continue;
    }
    if (kind === "reject") {
      parsed.push({
        id: id(),
        name: file.name,
        kind: "text",
        text: "",
        images: [],
        error: "Use a photo, PDF, Word .docx, HTML, or text file.",
      });
      continue;
    }
    try {
      if (kind === "image") {
        const jpeg = await blobToJpeg(file);
        parsed.push({ id: id(), name: file.name, kind, text: "", images: [jpeg] });
      } else if (kind === "pdf") {
        const pdf = await readPdf(file);
        parsed.push({ id: id(), name: file.name, kind, text: pdf.text, images: pdf.images });
      } else if (kind === "docx") {
        parsed.push({ id: id(), name: file.name, kind, text: await readDocx(file), images: [] });
      } else {
        parsed.push({ id: id(), name: file.name, kind, text: clip(await file.text()), images: [] });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read that file.";
      parsed.push({
        id: id(),
        name: file.name,
        kind: kind === "image" || kind === "pdf" || kind === "docx" ? kind : "text",
        text: "",
        images: [],
        error: message,
      });
    }
  }
  return parsed;
}
