import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Code2, Layers, GitBranch, Cpu, FlaskConical,
  Wrench, Package, FunctionSquare, List, Shield
} from "lucide-react";

const modules = [
  { path: "/primeiros-passos", icon: Code2, label: "Primeiros Passos", desc: "Hello World, compilação e execução", color: "text-primary" },
  { path: "/tipos-variaveis", icon: Code2, label: "Tipos e Variáveis", desc: "int, double, String, boolean e mais", color: "text-blue-400" },
  { path: "/controle-fluxo", icon: GitBranch, label: "Controle de Fluxo", desc: "if/else, switch, ternário", color: "text-purple-400" },
  { path: "/lacos", icon: FunctionSquare, label: "Laços de Repetição", desc: "for, while, do-while, for-each", color: "text-green-400" },
  { path: "/oop", icon: Layers, label: "Orientação a Objetos", desc: "Classes, objetos, encapsulamento", color: "text-yellow-400" },
  { path: "/heranca", icon: GitBranch, label: "Herança e Polimorfismo", desc: "extends, override, upcasting", color: "text-orange-400" },
  { path: "/interfaces", icon: Shield, label: "Interfaces e Abstratas", desc: "interface, abstract, default methods", color: "text-red-400" },
  { path: "/colecoes", icon: List, label: "Collections", desc: "ArrayList, LinkedList, HashSet", color: "text-cyan-400" },
  { path: "/lambda-streams", icon: Cpu, label: "Lambda e Streams", desc: "API funcional do Java 8+", color: "text-pink-400" },
  { path: "/threads", icon: Cpu, label: "Threads e Concorrência", desc: "Thread, Runnable, CompletableFuture", color: "text-indigo-400" },
  { path: "/testes", icon: FlaskConical, label: "Testes com JUnit", desc: "JUnit 5, @Test, assertions, Mockito", color: "text-emerald-400" },
  { path: "/build-tools", icon: Wrench, label: "Maven e Gradle", desc: "Build tools, pom.xml, build.gradle", color: "text-amber-400" },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">☕</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground mb-4">
            Java
          </h1>
          <p className="text-2xl font-semibold text-primary mb-4">Guia Completo em Português</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Aprenda Java do zero ao avançado com exemplos práticos, explicações claras e
            todo o conteúdo em português. Do Hello World às Streams e Concorrência.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/primeiros-passos"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Começar agora →
            </Link>
            <Link
              href="/instalacao"
              className="px-6 py-3 bg-card border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Instalação do JDK
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
            >
              <Link href={m.path} className="block group">
                <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                  <m.icon className={`w-6 h-6 mb-3 ${m.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-foreground mb-1 text-sm mt-0">{m.label}</h3>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-1">23</div>
            <div className="text-sm text-muted-foreground">Módulos</div>
          </div>
          <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
            <div className="text-3xl font-bold text-secondary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Em Português</div>
          </div>
          <div className="p-6 rounded-xl bg-muted border border-border text-center">
            <div className="text-3xl font-bold text-foreground mb-1">Java 21</div>
            <div className="text-sm text-muted-foreground">LTS Coberto</div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-bold text-foreground mb-3 mt-0">O que você vai aprender</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground list-none ml-0">
            {[
              "Instalação do JDK e configuração do ambiente",
              "Sintaxe fundamental: tipos, variáveis, operadores",
              "Orientação a objetos: classes, herança, interfaces",
              "Collections Framework: List, Set, Map, Queue",
              "Java moderno: Lambda, Streams, Optional",
              "Concorrência: Thread, ExecutorService, CompletableFuture",
              "I/O: leitura e escrita de arquivos",
              "Testes unitários com JUnit 5 e Mockito",
              "Build tools: Maven e Gradle",
              "Tratamento de exceções checked e unchecked",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 mb-0">
                <span className="text-primary">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
