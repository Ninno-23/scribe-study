import { useMemo, useState } from "react";
import { LIBRARY, type Pack } from "@/lib/study/library";
import { mastery, packKey } from "@/lib/study/progress";
import { useStudy } from "@/lib/study/store";
import { cn } from "@/lib/cn";

export function Guides() {
  const progress = useStudy((state) => state.progress);
  const setView = useStudy((state) => state.setView);
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<"All" | "Python" | "AWS" | "HTML">("All");

  const packs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY.filter((pack) => {
      if (track !== "All" && pack.track !== track) return false;
      if (!q) return true;
      return (
        pack.title.toLowerCase().includes(q) ||
        pack.blurb.toLowerCase().includes(q) ||
        pack.keywords.some((keyword) => keyword.includes(q))
      );
    });
  }, [query, track]);

  const groups = (["Python", "HTML", "AWS"] as const)
    .map((name) => ({ name, packs: packs.filter((pack) => pack.track === name) }))
    .filter((group) => group.packs.length > 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <h1 className="text-3xl font-semibold tracking-tight">Guides</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Python, HTML, and the AWS services from the exam notes.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="guide-search">
            Search guides
          </label>
          <input
            id="guide-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lists, forms, S3…"
            className="h-11 flex-1 rounded-xl border border-line bg-canvas px-3 text-sm outline-none"
          />
          <div className="flex flex-wrap gap-1">
            {(["All", "Python", "HTML", "AWS"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTrack(item)}
                className={cn(
                  "h-11 rounded-full px-4 text-sm font-medium",
                  track === item ? "bg-ink text-canvas" : "bg-bubble text-muted",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {groups.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No guide matches that search.</p>
        ) : (
          groups.map((group) => (
            <section key={group.name} className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{group.name}</h2>
              <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl border border-line">
                {group.packs.map((pack) => (
                  <GuideRow
                    key={pack.id}
                    pack={pack}
                    ratio={mastery(pack.kit.flashcards.length, progress[packKey(pack.id)])}
                    onOpen={() => setView({ kind: "lesson", packId: pack.id })}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function GuideRow({ pack, ratio, onOpen }: { pack: Pack; ratio: number; onOpen: () => void }) {
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-paper">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{pack.title}</p>
            <span className="text-xs text-muted">{pack.level}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{pack.blurb}</p>
        </div>
        <span className="w-12 shrink-0 text-right text-sm tabular-nums text-muted">
          {ratio > 0 ? `${Math.round(ratio * 100)}%` : ""}
        </span>
      </button>
    </li>
  );
}
