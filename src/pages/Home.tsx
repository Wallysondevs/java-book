import { useEffect, useState } from "react";
import { ChevronRight, Coffee, Code } from "lucide-react";
import { motion } from "framer-motion";
import { COURSE_MODULES, getCompletionStats, type Module } from "@/lib/course";

// LiveTerminal - Java style
function LiveTerminal() {
  const lines = [
    { text: "// Java - Hello World", delay: 0 },
    { text: "", delay: 400 },
    { text: "public class HelloWorld {", delay: 800 },
    { text: "    public static void main(String[] args) {", delay: 1200 },
    { text: "        System.out.println(\"Hello, Java!\");", delay: 1600 },
    { text: "    }", delay: 2000 },
    { text: "}", delay: 2400 },
    { text: "", delay: 2800 },
    { text: "// Compilar:", delay: 3200 },
    { text: "$ javac HelloWorld.java", delay: 3600 },
    { text: "", delay: 4000 },
    { text: "// Executar:", delay: 4400 },
    { text: "$ java HelloWorld", delay: 4800 },
    { text: "Hello, Java!", delay: 5200 },
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((_, i) => {
      const timer = setTimeout(() => {
        setVisibleLines(i + 1);
      }, lines[i].delay + 100);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1a0f0a] rounded-2xl border border-orange-500/30 overflow-hidden shadow-2xl shadow-orange-500/10">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0805] border-b border-orange-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-orange-300/70 ml-2 font-mono">HelloWorld.java — Terminal</span>
      </div>
      <div className="p-5 font-mono text-sm leading-[1.8] h-[380px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex">
            <span className={
              line.text.startsWith("//") ? "text-gray-500" :
              line.text.startsWith("public") || line.text.startsWith("    public") ? "text-orange-400" :
              line.text.startsWith("$") ? "text-green-400" :
              line.text.includes("System.out") ? "text-cyan-400" :
              line.text === "Hello, Java!" ? "text-emerald-400 font-bold" :
              "text-gray-400"
            }>
              {line.text || "\u00A0"}
            </span>
          </div>
        ))}
        {showCursor && visibleLines === lines.length && (
          <span className="text-orange-400">▌</span>
        )}
      </div>
    </div>
  );
}

// Module Card
function ModuleCard({ module, index }: { module: Module; index: number }) {
  const lessonCount = module.lessons.length;

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div onClick={() => navigate(module.lessons[0]?.path || "/")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group p-5 rounded-2xl bg-card border border-border hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer h-full flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
          {module.emoji}
        </div>
        <h3 className="font-bold text-foreground text-base mb-2 group-hover:text-orange-500 transition-colors">
          {module.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {lessonCount} {lessonCount === 1 ? "lição" : "lições"}
        </p>
        <div className="mt-auto flex items-center gap-1 text-xs text-orange-500 font-medium group-hover:gap-2 transition-all">
          <span>Ver lições</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const stats = getCompletionStats();

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Livro Completo 2025 — {stats.total} Lições
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                <span className="text-foreground">Domine o</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Java
                </span>
              </h1>

              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed mx-auto lg:mx-0">
                Do básico ao avançado: OOP, Streams, Concorrência, Spring Boot, Design Patterns, JVM tuning e muito mais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/historia")}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all text-center"
                >
                  Começar Agora
                </button>
                <button
                  onClick={() => navigate("/hello-world")}
                  className="px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Hello World
                </button>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LiveTerminal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-orange-500 mb-1">{stats.total}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Lições</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-500 mb-1">{COURSE_MODULES.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Módulos</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1">{stats.completed}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Concluídas</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-400 mb-1">{stats.percentage}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Progresso</div>
            </div>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Explore os Módulos</h2>
          <p className="text-muted-foreground">Do básico ao avançado</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {COURSE_MODULES.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
