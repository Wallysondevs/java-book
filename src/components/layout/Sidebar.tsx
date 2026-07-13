import { useState } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import { Coffee, X, ChevronDown, ChevronRight, Check, BookOpen } from "lucide-react";
import { COURSE_MODULES, getProgress, getCompletionStats, type Module } from "@/lib/course";

function ModuleSection({ module }: { module: Module }) {
  const [location] = useHashLocation();
  const [open, setOpen] = useState(() => {
    return module.lessons.some((l) => l.path === location);
  });
  const progress = getProgress();

  const completedCount = module.lessons.filter((l) => progress[l.id]).length;
  const isComplete = completedCount === module.lessons.length;
  const hasActiveChild = module.lessons.some((l) => l.path === location);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
          hasActiveChild ? "bg-orange-500/10 text-orange-500" : "text-foreground hover:bg-muted"
        )}
      >
        <span className="text-lg">{module.emoji}</span>
        <span className="flex-1 text-left">{module.title}</span>
        {isComplete ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : completedCount > 0 ? (
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {completedCount}/{module.lessons.length}
          </span>
        ) : null}
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="mt-1 ml-4 border-l-2 border-border/50 pl-3 space-y-1">
          {module.lessons.map((lesson) => {
            const active = location === lesson.path;
            const done = progress[lesson.id];
            return (
              <div
                key={lesson.id}
                onClick={() => navigate(lesson.path)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all",
                  active
                    ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  done && !active && "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {done ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 shrink-0 rounded-full border border-muted-foreground/30" />
                )}
                <span className="truncate">{lesson.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const stats = getCompletionStats();

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 z-50 bg-card border-r border-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Java Book</div>
              <div className="text-[10px] text-muted-foreground font-normal">Livro Completo</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Seu progresso</span>
            <span className="font-bold text-orange-500">{stats.percentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5 text-center">
            {stats.completed} de {stats.total} lições
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div
            onClick={() => navigate("/")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-3 cursor-pointer",
              "text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            )}
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            Início
          </div>
          {COURSE_MODULES.map((module) => (
            <ModuleSection key={module.id} module={module} />
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground text-center">
            Java Book 2025
          </div>
        </div>
      </aside>
    </>
  );
}
