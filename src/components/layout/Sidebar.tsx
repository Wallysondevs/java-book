import { Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import {
  Activity, BookOpen, CheckCircle, Code2, Coffee, Cpu, Database, FileText, FlaskConical, FolderOpen, Layers, Network, Package, Shapes, Shield, Sparkles, Wrench
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Boas-vindas",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História do Java", icon: BookOpen },
      { path: "/filosofia", label: "Filosofia: WORA", icon: BookOpen },
      { path: "/jvm-jdk-jre", label: "JVM, JDK e JRE", icon: BookOpen },
    ],
  },
  {
    title: "Setup & Primeiro Programa",
    items: [
      { path: "/instalar-jdk", label: "Instalar o JDK", icon: Wrench },
      { path: "/hello-world", label: "Hello, World!", icon: Wrench },
      { path: "/ide", label: "Escolher uma IDE", icon: Wrench },
      { path: "/estrutura-projeto", label: "Estrutura de Projeto", icon: Wrench },
    ],
  },
  {
    title: "Sintaxe Básica",
    items: [
      { path: "/tipos-primitivos", label: "Tipos Primitivos", icon: Code2 },
      { path: "/variaveis", label: "Variáveis & Constantes", icon: Code2 },
      { path: "/operadores", label: "Operadores", icon: Code2 },
      { path: "/strings", label: "Strings & Formatação", icon: Code2 },
      { path: "/controle-fluxo", label: "Controle de Fluxo", icon: Code2 },
      { path: "/loops", label: "Loops", icon: Code2 },
      { path: "/arrays", label: "Arrays", icon: Code2 },
      { path: "/metodos", label: "Métodos", icon: Code2 },
    ],
  },
  {
    title: "Orientação a Objetos",
    items: [
      { path: "/classes", label: "Classes & Objetos", icon: Layers },
      { path: "/construtores", label: "Construtores", icon: Layers },
      { path: "/encapsulamento", label: "Encapsulamento", icon: Layers },
      { path: "/heranca", label: "Herança", icon: Layers },
      { path: "/polimorfismo", label: "Polimorfismo", icon: Layers },
      { path: "/classes-abstratas", label: "Classes Abstratas", icon: Layers },
      { path: "/interfaces", label: "Interfaces", icon: Layers },
      { path: "/records", label: "Records (Java 14+)", icon: Layers },
      { path: "/sealed", label: "Sealed Classes (Java 17+)", icon: Layers },
      { path: "/enums", label: "Enums", icon: Layers },
    ],
  },
  {
    title: "Tratamento de Erros",
    items: [
      { path: "/excecoes", label: "Exceções: visão geral", icon: Shield },
      { path: "/try-catch", label: "try/catch/finally", icon: Shield },
      { path: "/try-with-resources", label: "try-with-resources", icon: Shield },
    ],
  },
  {
    title: "Coleções",
    items: [
      { path: "/collections", label: "Collections Framework", icon: Package },
      { path: "/list", label: "List (ArrayList, LinkedList)", icon: Package },
      { path: "/set", label: "Set (HashSet, TreeSet)", icon: Package },
      { path: "/map", label: "Map (HashMap, TreeMap)", icon: Package },
      { path: "/comparator", label: "Comparable & Comparator", icon: Package },
    ],
  },
  {
    title: "Genéricos",
    items: [
      { path: "/genericos", label: "Tipos Genéricos", icon: Code2 },
      { path: "/wildcards", label: "Wildcards & Type Erasure", icon: Code2 },
    ],
  },
  {
    title: "Programação Funcional",
    items: [
      { path: "/functional-interfaces", label: "Functional Interfaces", icon: Sparkles },
      { path: "/lambdas", label: "Lambdas & Method Refs", icon: Sparkles },
      { path: "/streams", label: "Stream API", icon: Sparkles },
      { path: "/optional", label: "Optional", icon: Sparkles },
    ],
  },
  {
    title: "Concorrência",
    items: [
      { path: "/threads", label: "Threads & Runnable", icon: Network },
      { path: "/executors", label: "Executors & Callable", icon: Network },
      { path: "/sincronizacao", label: "synchronized & locks", icon: Network },
      { path: "/virtual-threads", label: "Virtual Threads (Java 21)", icon: Network },
    ],
  },
  {
    title: "Java Moderno",
    items: [
      { path: "/var-text-blocks", label: "var & Text Blocks", icon: Sparkles },
      { path: "/pattern-matching", label: "Pattern Matching & switch", icon: Sparkles },
      { path: "/modules", label: "Módulos (JPMS)", icon: Sparkles },
    ],
  },
  {
    title: "I/O & Arquivos",
    items: [
      { path: "/nio", label: "NIO.2: File & Path", icon: FileText },
      { path: "/io-arquivos", label: "Ler & Escrever Arquivos", icon: FileText },
    ],
  },
  {
    title: "Banco & Web",
    items: [
      { path: "/jdbc", label: "JDBC", icon: Database },
      { path: "/http-client", label: "HttpClient (Java 11+)", icon: Database },
      { path: "/json", label: "JSON com Jackson", icon: Database },
    ],
  },
  {
    title: "Build & Test",
    items: [
      { path: "/maven", label: "Maven", icon: Wrench },
      { path: "/gradle", label: "Gradle", icon: Wrench },
      { path: "/junit", label: "JUnit 5", icon: Wrench },
      { path: "/mockito", label: "Mockito", icon: Wrench },
    ],
  },
  {
    title: "Padrões de Projeto",
    items: [
      { path: "/padroes", label: "Visão Geral", icon: Shapes },
      { path: "/singleton", label: "Singleton", icon: Shapes },
      { path: "/factory", label: "Factory Method", icon: Shapes },
      { path: "/builder", label: "Builder", icon: Shapes },
      { path: "/observer", label: "Observer", icon: Shapes },
      { path: "/strategy", label: "Strategy", icon: Shapes },
      { path: "/decorator", label: "Decorator", icon: Shapes },
      { path: "/adapter", label: "Adapter", icon: Shapes },
    ],
  },
  {
    title: "Spring Boot",
    items: [
      { path: "/spring-boot", label: "Spring Boot: começando", icon: Coffee },
      { path: "/spring-mvc", label: "Spring MVC: REST", icon: Coffee },
      { path: "/spring-data", label: "Spring Data JPA", icon: Coffee },
      { path: "/spring-security", label: "Spring Security", icon: Coffee },
      { path: "/spring-beans", label: "Beans & DI", icon: Coffee },
      { path: "/spring-testing", label: "Testes em Spring", icon: Coffee },
    ],
  },
  {
    title: "JPA & Persistência",
    items: [
      { path: "/hibernate", label: "Hibernate & JPA", icon: Database },
      { path: "/jpa-entities", label: "Entidades JPA", icon: Database },
      { path: "/jpa-relationships", label: "Relacionamentos", icon: Database },
      { path: "/jpa-queries", label: "Queries (JPQL/Criteria)", icon: Database },
      { path: "/connection-pool", label: "Connection Pool (HikariCP)", icon: Database },
    ],
  },
  {
    title: "Performance & JVM",
    items: [
      { path: "/garbage-collection", label: "Garbage Collection", icon: Cpu },
      { path: "/jvm-tuning", label: "JVM Tuning", icon: Cpu },
      { path: "/profiling", label: "Profiling (JFR)", icon: Cpu },
      { path: "/jit", label: "JIT Compilation", icon: Cpu },
      { path: "/memory-model", label: "Memory Model", icon: Cpu },
      { path: "/jmh", label: "JMH Benchmarks", icon: Cpu },
    ],
  },
  {
    title: "Programação Reativa",
    items: [
      { path: "/completable-future", label: "CompletableFuture", icon: Activity },
      { path: "/reactive-streams", label: "Reactive Streams (Flow)", icon: Activity },
      { path: "/reactor", label: "Project Reactor", icon: Activity },
      { path: "/webflux", label: "Spring WebFlux", icon: Activity },
      { path: "/async-patterns", label: "Async + Virtual Threads", icon: Activity },
    ],
  },
  {
    title: "Testes Avançados",
    items: [
      { path: "/testcontainers", label: "Testcontainers", icon: FlaskConical },
      { path: "/assertj", label: "AssertJ", icon: FlaskConical },
      { path: "/property-testing", label: "Property-Based (jqwik)", icon: FlaskConical },
      { path: "/integration-tests", label: "Testes de Integração", icon: FlaskConical },
    ],
  },
  {
    title: "Boas Práticas",
    items: [
      { path: "/solid", label: "SOLID", icon: CheckCircle },
      { path: "/clean-code", label: "Clean Code", icon: CheckCircle },
      { path: "/effective-java", label: "Effective Java: itens", icon: CheckCircle },
      { path: "/imutabilidade", label: "Imutabilidade", icon: CheckCircle },
      { path: "/defensive-copying", label: "Defensive Copying", icon: CheckCircle },
      { path: "/code-smells", label: "Code Smells", icon: CheckCircle },
    ],
  },
  {
    title: "Tópicos Avançados",
    items: [
      { path: "/reflection", label: "Reflection", icon: Layers },
      { path: "/annotations", label: "Anotações Custom", icon: Layers },
      { path: "/classloader", label: "ClassLoader", icon: Layers },
      { path: "/serialization", label: "Serialization", icon: Layers },
      { path: "/i18n", label: "Internacionalização", icon: Layers },
    ],
  },
  {
    title: "DevOps & Ferramentas",
    items: [
      { path: "/intellij-tips", label: "IntelliJ: 20 atalhos", icon: Wrench },
      { path: "/debugging", label: "Debugging Avançado", icon: Wrench },
      { path: "/git-java", label: "Git para Java", icon: Wrench },
      { path: "/cicd", label: "CI/CD GitHub Actions", icon: Wrench },
      { path: "/jar-packaging", label: "Empacotar (JAR/Native)", icon: Wrench },
    ],
  },
  {
    title: "Projetos Práticos",
    items: [
      { path: "/projeto-todo", label: "To-Do CLI", icon: FolderOpen },
      { path: "/projeto-api", label: "API REST de Livros", icon: FolderOpen },
      { path: "/projeto-banco", label: "Sistema Bancário OOP", icon: FolderOpen },
      { path: "/projeto-chat", label: "Chat com Threads", icon: FolderOpen },
      { path: "/desafios", label: "Desafios Extras", icon: FolderOpen },
    ],
  },
  {
    title: "Apêndice",
    items: [
      { path: "/referencias", label: "Referências & Recursos", icon: BookOpen },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();

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
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-5 py-6 border-b border-border flex items-center gap-3">
          <div className="text-3xl">☕</div>
          <div>
            <div className="font-display font-bold text-foreground text-lg leading-tight">Java</div>
            <div className="text-xs text-muted-foreground font-mono">manual completo · pt-br</div>
          </div>
        </div>

        <nav className="p-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              location === "/"
                ? "bg-[#ED8B00]/15 text-[#ED8B00]"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Início
          </Link>

          {NAVIGATION.map((section, idx) => (
            <div key={idx} className="mt-6">
              <h3 className="px-3 text-xs font-mono uppercase tracking-wider text-[#888A85] mb-2">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = location === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                          active
                            ? "bg-[#ED8B00]/15 text-[#ED8B00] font-medium"
                            : "text-muted-foreground hover:bg-card hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0 opacity-70" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
