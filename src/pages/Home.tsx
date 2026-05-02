import { Link } from "wouter";
import {
  Coffee, Terminal, Code2, Layers, Cpu, Network,
  Wrench, FileText, Sparkles, ArrowRight, BookOpen,
} from "lucide-react";

const STATS = [
  { v: "111", l: "Capítulos completos" },
  { v: "600+", l: "Exemplos de código" },
  { v: "100%", l: "Português BR" },
  { v: "Java 21", l: "LTS atual" },
];

const TRACKS = [
  { icon: Wrench, title: "Setup", desc: "Instalar OpenJDK, configurar PATH, escolher uma IDE.", to: "/instalar-jdk" },
  { icon: Code2, title: "Sintaxe", desc: "Tipos, variáveis, controle de fluxo, métodos.", to: "/tipos-primitivos" },
  { icon: Layers, title: "OOP", desc: "Classes, herança, interfaces, records, sealed.", to: "/classes" },
  { icon: Sparkles, title: "Funcional", desc: "Lambdas, Streams, Optional, method refs.", to: "/lambdas" },
  { icon: Network, title: "Concorrência", desc: "Threads, Executors, sincronização, Virtual Threads.", to: "/threads" },
  { icon: Terminal, title: "Build & Test", desc: "Maven, Gradle, JUnit 5, Mockito.", to: "/maven" },
  { icon: Coffee, title: "Spring Boot", desc: "REST, JPA, Security, Beans, testes.", to: "/spring-boot" },
  { icon: Cpu, title: "Performance", desc: "GC, JVM tuning, profiling, JIT, benchmarks.", to: "/garbage-collection" },
  { icon: FileText, title: "Projetos", desc: "To-Do CLI, API REST, chat com threads e mais.", to: "/projeto-todo" },
];

export default function Home() {
  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ED8B00]/10 border border-[#ED8B00]/30 text-xs font-mono text-[#ED8B00] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ED8B00] animate-pulse" />
          GUIA COMPLETO 2025 · PORTUGUÊS BR · OPEN SOURCE
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
          Domine o <span className="text-[#ED8B00]">Java</span>
        </h1>
        <p className="text-lg sm:text-xl text-[#D3D7CF] max-w-3xl mx-auto leading-relaxed mb-10">
          Da primeira linha de{" "}
          <code className="bg-[#1A1A1A] px-2 py-0.5 rounded text-[#FFC56B] font-mono text-base">
            System.out.println
          </code>{" "}
          até aplicações concorrentes com Virtual Threads. Cada conceito explicado, cada código executado — sem mágica, sem encurtamentos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/instalar-jdk"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ED8B00] hover:bg-[#FFA830] text-black font-bold rounded-lg transition-all shadow-lg shadow-[#ED8B00]/30 hover:scale-105"
          >
            <Wrench className="w-5 h-5" />
            Instalar o JDK
          </Link>
          <Link
            href="/hello-world"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] hover:bg-[#222] text-white font-medium rounded-lg border border-[#1F1F1F]/40 hover:border-[#ED8B00]/50 transition-all"
          >
            <Terminal className="w-5 h-5" />
            Pular para Hello World
          </Link>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-[#1F1F1F]/60 bg-[#0A0A0A] shadow-2xl text-left">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#151515] border-b border-[#1F1F1F]/60">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs font-mono text-[#888A85]">Hello.java</span>
            </div>
            <pre className="p-5 text-sm font-mono text-[#D3D7CF] overflow-x-auto leading-relaxed">
{`public class Hello {
    public static void main(String[] args) {
        var nome = "mundo";
        System.out.println("Olá, " + nome + "!");

        // Java 21: Virtual Threads em uma linha
        Thread.startVirtualThread(() -> {
            System.out.println("rodando em thread virtual!");
        });
    }
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {STATS.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl sm:text-5xl font-display font-bold text-white">{s.v}</div>
            <div className="text-xs font-mono text-[#888A85] mt-2 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5382A1]/40 text-[#5382A1] text-xs font-mono uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Trilha estruturada
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-4">
          Do <span className="text-[#ED8B00]">Hello, World</span> até Virtual Threads
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRACKS.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link key={i} href={t.to} className="block group">
              <div className="p-6 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]/60 hover:border-[#ED8B00]/50 hover:bg-[#111] transition-all h-full">
                <Icon className="w-7 h-7 text-[#ED8B00] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-white text-lg mb-1.5">{t.title}</h3>
                <p className="text-sm text-[#888A85] leading-relaxed mb-3">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#ED8B00]/80 group-hover:text-[#ED8B00]">
                  abrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-20 text-center text-xs font-mono text-[#888A85] opacity-70">
        $ <span className="text-[#FFC56B]">java</span> --version &nbsp;·&nbsp; openjdk 21 LTS &nbsp;·&nbsp; livro 100% open source
      </div>
    </div>
  );
}
