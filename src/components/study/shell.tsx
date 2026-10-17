import { useEffect } from "react";
import { BookOpen, GraduationCap, LayoutDashboard, MessageSquare, Moon, Sun } from "lucide-react";
import { Guides } from "@/components/study/guides";
import { HomeView } from "@/components/study/home";
import { Lesson } from "@/components/study/lesson";
import { Practice } from "@/components/study/practice";
import { CardSession, QuizSession } from "@/components/study/session";
import { Tutor } from "@/components/study/tutor";
import { useStudy } from "@/lib/study/store";
import type { View } from "@/lib/study/types";
import { cn } from "@/lib/cn";

const NAV: { id: "home" | "guides" | "practice" | "tutor"; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "guides", label: "Guides", icon: BookOpen },
  { id: "practice", label: "Practice", icon: GraduationCap },
  { id: "tutor", label: "Tutor", icon: MessageSquare },
];

function navKey(view: View): "home" | "guides" | "practice" | "tutor" {
  if (view.kind === "home") return "home";
  if (view.kind === "tutor") return "tutor";
  if (view.kind === "practice") return "practice";
  if ((view.kind === "cards" || view.kind === "quiz") && view.ref.type === "deck") return "practice";
  return "guides";
}

export function Shell() {
  const theme = useStudy((state) => state.theme);
  const setTheme = useStudy((state) => state.setTheme);
  const view = useStudy((state) => state.view);
  const setView = useStudy((state) => state.setView);
  const active = navKey(view);

  useEffect(() => {
    void useStudy.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink lg:flex-row">
      <nav className="dock order-last flex border-t border-line bg-sidebar lg:order-none lg:w-56 lg:flex-col lg:border-r lg:border-t-0">
        <div className="hidden items-center gap-3 px-4 py-5 lg:flex">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-sm font-semibold text-canvas">S</span>
          <div>
            <p className="text-base font-semibold leading-none">Scribe</p>
            <p className="mt-1 text-xs text-muted">Study, then quiz</p>
          </div>
        </div>
        <div className="flex w-full lg:mt-1 lg:flex-1 lg:flex-col lg:gap-1 lg:px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView({ kind: item.id })}
                className={cn(
                  "flex h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium lg:h-11 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:text-sm",
                  on ? "text-ink lg:bg-bubble" : "text-muted hover:text-ink lg:hover:bg-bubble",
                )}
              >
                <Icon className="size-5 lg:size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="hidden border-t border-line p-3 lg:block">
          <button
            type="button"
            className="flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-bubble"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </nav>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
          <p className="text-sm font-semibold">Scribe</p>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl hover:bg-bubble"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
        <div className="min-h-0 flex-1">
          {view.kind === "home" ? <HomeView /> : null}
          {view.kind === "guides" ? <Guides /> : null}
          {view.kind === "practice" ? <Practice /> : null}
          {view.kind === "lesson" ? <Lesson packId={view.packId} /> : null}
          {view.kind === "cards" ? <CardSession studyRef={view.ref} /> : null}
          {view.kind === "quiz" ? <QuizSession studyRef={view.ref} /> : null}
          {view.kind === "tutor" ? <Tutor /> : null}
        </div>
      </div>
    </div>
  );
}
