// Java Book - Course Structure
// Storage key: java-curso-progresso

export interface Lesson {
  id: string;
  title: string;
  path: string;
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  lessons: Lesson[];
}

export const COURSE_MODULES: Module[] = [
  {
    id: "introducao",
    title: "Introdução",
    emoji: "☕",
    lessons: [
      { id: "home", title: "Bem-vindo", path: "/" },
      { id: "historia", title: "História do Java", path: "/historia" },
      { id: "filosofia", title: "Filosofia", path: "/filosofia" },
      { id: "jvm-jdk-jre", title: "JVM, JDK e JRE", path: "/jvm-jdk-jre" },
      { id: "instalar-jdk", title: "Instalar JDK", path: "/instalar-jdk" },
    ],
  },
  {
    id: "primeiros-passos",
    title: "Primeiros Passos",
    emoji: "🚀",
    lessons: [
      { id: "hello-world", title: "Hello World", path: "/hello-world" },
      { id: "ide", title: "IDE", path: "/ide" },
      { id: "estrutura-projeto", title: "Estrutura de Projeto", path: "/estrutura-projeto" },
    ],
  },
  {
    id: "fundamentos",
    title: "Fundamentos",
    emoji: "📚",
    lessons: [
      { id: "tipos-primitivos", title: "Tipos Primitivos", path: "/tipos-primitivos" },
      { id: "variaveis", title: "Variáveis", path: "/variaveis" },
      { id: "operadores", title: "Operadores", path: "/operadores" },
      { id: "strings", title: "Strings", path: "/strings" },
      { id: "controle-fluxo", title: "Controle de Fluxo", path: "/controle-fluxo" },
      { id: "loops", title: "Loops", path: "/loops" },
      { id: "arrays", title: "Arrays", path: "/arrays" },
      { id: "metodos", title: "Métodos", path: "/metodos" },
    ],
  },
  {
    id: "oop",
    title: "Orientação a Objetos",
    emoji: "🏗️",
    lessons: [
      { id: "classes", title: "Classes", path: "/classes" },
      { id: "construtores", title: "Construtores", path: "/construtores" },
      { id: "encapsulamento", title: "Encapsulamento", path: "/encapsulamento" },
      { id: "heranca", title: "Herança", path: "/heranca" },
      { id: "polimorfismo", title: "Polimorfismo", path: "/polimorfismo" },
      { id: "classes-abstratas", title: "Classes Abstratas", path: "/classes-abstratas" },
      { id: "interfaces", title: "Interfaces", path: "/interfaces" },
      { id: "records", title: "Records", path: "/records" },
      { id: "sealed", title: "Sealed Classes", path: "/sealed" },
      { id: "enums", title: "Enums", path: "/enums" },
    ],
  },
  {
    id: "excecoes",
    title: "Exceções",
    emoji: "⚠️",
    lessons: [
      { id: "excecoes", title: "Exceções", path: "/excecoes" },
      { id: "try-catch", title: "Try-Catch", path: "/try-catch" },
      { id: "try-with-resources", title: "Try with Resources", path: "/try-with-resources" },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    emoji: "📦",
    lessons: [
      { id: "collections", title: "Collections Framework", path: "/collections" },
      { id: "list-page", title: "List", path: "/list-page" },
      { id: "set-page", title: "Set", path: "/set-page" },
      { id: "map-page", title: "Map", path: "/map-page" },
      { id: "comparator-page", title: "Comparator", path: "/comparator-page" },
    ],
  },
  {
    id: "generics",
    title: "Generics",
    emoji: "🔷",
    lessons: [
      { id: "genericos", title: "Genéricos", path: "/genericos" },
      { id: "wildcards", title: "Wildcards", path: "/wildcards" },
    ],
  },
  {
    id: "funcional",
    title: "Programação Funcional",
    emoji: "λ",
    lessons: [
      { id: "functional-interfaces", title: "Functional Interfaces", path: "/functional-interfaces" },
      { id: "lambdas", title: "Lambdas", path: "/lambdas" },
      { id: "streams", title: "Streams", path: "/streams" },
      { id: "optional-page", title: "Optional", path: "/optional-page" },
    ],
  },
  {
    id: "concorrencia",
    title: "Concorrência",
    emoji: "🔀",
    lessons: [
      { id: "threads", title: "Threads", path: "/threads" },
      { id: "executors", title: "Executors", path: "/executors" },
      { id: "sincronizacao", title: "Sincronização", path: "/sincronizacao" },
      { id: "virtual-threads", title: "Virtual Threads", path: "/virtual-threads" },
    ],
  },
  {
    id: "modern-java",
    title: "Java Moderno",
    emoji: "✨",
    lessons: [
      { id: "var-text-blocks", title: "var e Text Blocks", path: "/var-text-blocks" },
      { id: "pattern-matching", title: "Pattern Matching", path: "/pattern-matching" },
      { id: "records", title: "Records", path: "/records" },
      { id: "sealed", title: "Sealed Classes", path: "/sealed" },
    ],
  },
  {
    id: "modulos-io",
    title: "Módulos e I/O",
    emoji: "📂",
    lessons: [
      { id: "modules", title: "Módulos (JPMS)", path: "/modules" },
      { id: "nio", title: "NIO", path: "/nio" },
      { id: "io-arquivos", title: "I/O Arquivos", path: "/io-arquivos" },
    ],
  },
  {
    id: "build-tools",
    title: "Build Tools",
    emoji: "🔨",
    lessons: [
      { id: "gradle", title: "Gradle", path: "/gradle" },
      { id: "maven", title: "Maven", path: "/maven" },
    ],
  },
  {
    id: "testes",
    title: "Testes",
    emoji: "🧪",
    lessons: [
      { id: "j-unit", title: "JUnit", path: "/j-unit" },
      { id: "mockito", title: "Mockito", path: "/mockito" },
      { id: "assert-j", title: "AssertJ", path: "/assert-j" },
      { id: "integration-tests", title: "Integration Tests", path: "/integration-tests" },
      { id: "test-containers", title: "TestContainers", path: "/test-containers" },
      { id: "property-testing", title: "Property Testing", path: "/property-testing" },
    ],
  },
  {
    id: "design-patterns",
    title: "Design Patterns",
    emoji: "🎭",
    lessons: [
      { id: "design-patterns-intro", title: "Introdução", path: "/design-patterns-intro" },
      { id: "singleton", title: "Singleton", path: "/singleton" },
      { id: "factory", title: "Factory", path: "/factory" },
      { id: "builder", title: "Builder", path: "/builder" },
      { id: "adapter", title: "Adapter", path: "/adapter" },
      { id: "decorator", title: "Decorator", path: "/decorator" },
      { id: "strategy", title: "Strategy", path: "/strategy" },
      { id: "observer", title: "Observer", path: "/observer" },
    ],
  },
  {
    id: "solid",
    title: "SOLID & Clean Code",
    emoji: "💎",
    lessons: [
      { id: "solid-principles", title: "SOLID Principles", path: "/solid-principles" },
      { id: "clean-code", title: "Clean Code", path: "/clean-code" },
      { id: "code-smells", title: "Code Smells", path: "/code-smells" },
    ],
  },
  {
    id: "jdbc-jpa",
    title: "JDBC & JPA",
    emoji: "🗄️",
    lessons: [
      { id: "jdbc", title: "JDBC", path: "/jdbc" },
      { id: "hibernate-intro", title: "Hibernate Intro", path: "/hibernate-intro" },
      { id: "jpa-entities", title: "JPA Entities", path: "/jpa-entities" },
      { id: "jpa-relationships", title: "JPA Relationships", path: "/jpa-relationships" },
      { id: "jpa-queries", title: "JPA Queries", path: "/jpa-queries" },
    ],
  },
  {
    id: "spring",
    title: "Spring Framework",
    emoji: "🍃",
    lessons: [
      { id: "spring-boot-intro", title: "Spring Boot Intro", path: "/spring-boot-intro" },
      { id: "spring-beans", title: "Spring Beans", path: "/spring-beans" },
      { id: "spring-mvc", title: "Spring MVC", path: "/spring-mvc" },
      { id: "spring-data-jpa", title: "Spring Data JPA", path: "/spring-data-jpa" },
      { id: "spring-security", title: "Spring Security", path: "/spring-security" },
      { id: "spring-testing", title: "Spring Testing", path: "/spring-testing" },
    ],
  },
  {
    id: "web-rest",
    title: "Web & REST",
    emoji: "🌐",
    lessons: [
      { id: "http-client", title: "HTTP Client", path: "/http-client" },
      { id: "json-page", title: "JSON", path: "/json-page" },
      { id: "i18n", title: "I18n", path: "/i18n" },
    ],
  },
  {
    id: "reactive",
    title: "Programação Reativa",
    emoji: "⚡",
    lessons: [
      { id: "reactive-streams", title: "Reactive Streams", path: "/reactive-streams" },
      { id: "web-flux", title: "WebFlux", path: "/web-flux" },
      { id: "project-reactor", title: "Project Reactor", path: "/project-reactor" },
      { id: "completable-future-page", title: "CompletableFuture", path: "/completable-future-page" },
    ],
  },
  {
    id: "avancado",
    title: "Avançado",
    emoji: "🎖️",
    lessons: [
      { id: "reflection", title: "Reflection", path: "/reflection" },
      { id: "annotations-custom", title: "Annotations Custom", path: "/annotations-custom" },
      { id: "serialization", title: "Serialization", path: "/serialization" },
      { id: "class-loader", title: "ClassLoader", path: "/class-loader" },
      { id: "jit-compilation", title: "JIT Compilation", path: "/jit-compilation" },
      { id: "memory-model", title: "Memory Model", path: "/memory-model" },
      { id: "garbage-collection", title: "Garbage Collection", path: "/garbage-collection" },
      { id: "jvm-tuning", title: "JVM Tuning", path: "/jvm-tuning" },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    emoji: "📈",
    lessons: [
      { id: "profiling", title: "Profiling", path: "/profiling" },
      { id: "jmh", title: "JMH Benchmarking", path: "/jmh" },
      { id: "profiling", title: "Profiling", path: "/profiling" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Git",
    emoji: "🔧",
    lessons: [
      { id: "git-java", title: "Git para Java", path: "/git-java" },
      { id: "ci-cd-github", title: "CI/CD GitHub", path: "/ci-cd-github" },
      { id: "jar-packaging", title: "JAR Packaging", path: "/jar-packaging" },
    ],
  },
  {
    id: "projetos",
    title: "Projetos Práticos",
    emoji: "🎯",
    lessons: [
      { id: "projeto-todo-cli", title: "Projeto: Todo CLI", path: "/projeto-todo-cli" },
      { id: "projeto-banco-simples", title: "Projeto: Banco Simples", path: "/projeto-banco-simples" },
      { id: "projeto-api-rest", title: "Projeto: API REST", path: "/projeto-api-rest" },
      { id: "projeto-chat", title: "Projeto: Chat", path: "/projeto-chat" },
      { id: "projeto-extra-desafios", title: "Desafios Extras", path: "/projeto-extra-desafios" },
    ],
  },
  {
    id: "referencias",
    title: "Referências",
    emoji: "📖",
    lessons: [
      { id: "effective-java", title: "Effective Java", path: "/effective-java" },
      { id: "referencias", title: "Referências", path: "/referencias" },
    ],
  },
];

const STORAGE_KEY = "java-curso-progresso";

function getAllLessonIds(): string[] {
  return COURSE_MODULES.flatMap((module) => module.lessons.map((l) => l.id));
}

export function getProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(lessonId: string): void {
  const progress = getProgress();
  progress[lessonId] = true;
  saveProgress(progress);
}

export function markLessonIncomplete(lessonId: string): void {
  const progress = getProgress();
  delete progress[lessonId];
  saveProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getProgress();
  return progress[lessonId] === true;
}

export function getCompletionStats(): {
  completed: number;
  total: number;
  percentage: number;
} {
  const allLessons = getAllLessonIds();
  const progress = getProgress();
  const completed = allLessons.filter((id) => progress[id]).length;
  const total = allLessons.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function getModuleProgress(moduleId: string): {
  completed: number;
  total: number;
} {
  const module = COURSE_MODULES.find((m) => m.id === moduleId);
  if (!module) return { completed: 0, total: 0 };
  const progress = getProgress();
  const completed = module.lessons.filter((l) => progress[l.id]).length;
  return { completed, total: module.lessons.length };
}

export function getNavigation(
  currentLessonId: string
): { prev: Lesson | null; next: Lesson | null } {
  const allLessons = getAllLessonIds();
  const currentIndex = allLessons.indexOf(currentLessonId);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  let prev: Lesson | null = null;
  let next: Lesson | null = null;

  if (currentIndex > 0) {
    const prevId = allLessons[currentIndex - 1];
    for (const module of COURSE_MODULES) {
      const lesson = module.lessons.find((l) => l.id === prevId);
      if (lesson) {
        prev = lesson;
        break;
      }
    }
  }

  if (currentIndex < allLessons.length - 1) {
    const nextId = allLessons[currentIndex + 1];
    for (const module of COURSE_MODULES) {
      const lesson = module.lessons.find((l) => l.id === nextId);
      if (lesson) {
        next = lesson;
        break;
      }
    }
  }

  return { prev, next };
}

export function findLessonByPath(path: string): Lesson | null {
  for (const module of COURSE_MODULES) {
    const lesson = module.lessons.find((l) => l.path === path);
    if (lesson) return lesson;
  }
  return null;
}
