import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, Code2, Shield, Settings,
  FileText, GitBranch, Network, Cpu, Clock, History,
  Layers, X, Package, FlaskConical, Wrench, Database,
  FunctionSquare, Shuffle, RefreshCw, List
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História do Java", icon: History },
      { path: "/instalacao", label: "Instalação & Setup", icon: Settings },
      { path: "/primeiros-passos", label: "Primeiros Passos", icon: Terminal },
    ]
  },
  {
    title: "Fundamentos",
    items: [
      { path: "/tipos-variaveis", label: "Tipos e Variáveis", icon: Code2 },
      { path: "/operadores", label: "Operadores", icon: FunctionSquare },
      { path: "/controle-fluxo", label: "Controle de Fluxo", icon: GitBranch },
      { path: "/lacos", label: "Laços de Repetição", icon: RefreshCw },
      { path: "/arrays", label: "Arrays", icon: List },
    ]
  },
  {
    title: "Métodos & OOP",
    items: [
      { path: "/metodos", label: "Métodos", icon: FunctionSquare },
      { path: "/oop", label: "Orientação a Objetos", icon: Layers },
      { path: "/heranca", label: "Herança e Polimorfismo", icon: GitBranch },
      { path: "/interfaces", label: "Interfaces e Abstratas", icon: Shuffle },
      { path: "/excecoes", label: "Exceções e Erros", icon: Shield },
    ]
  },
  {
    title: "Collections & Generics",
    items: [
      { path: "/colecoes", label: "Collections (List/Set)", icon: Package },
      { path: "/mapas", label: "Map e HashMap", icon: Database },
      { path: "/generics", label: "Generics", icon: Code2 },
    ]
  },
  {
    title: "Java Moderno",
    items: [
      { path: "/lambda-streams", label: "Lambda e Streams", icon: Cpu },
      { path: "/threads", label: "Threads e Concorrência", icon: Network },
      { path: "/io", label: "Entrada e Saída (I/O)", icon: FileText },
    ]
  },
  {
    title: "Testes & Ferramentas",
    items: [
      { path: "/testes", label: "Testes com JUnit", icon: FlaskConical },
      { path: "/build-tools", label: "Maven e Gradle", icon: Wrench },
    ]
  },
  {
    title: "Extras",
    items: [
      { path: "/referencias", label: "Referências", icon: BookOpen },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-lg">☕</span>
              </div>
              <div>
                <h2 className="text-lg font-bold mt-0 mb-0 pb-0 border-0 leading-tight">Java</h2>
                <p className="text-xs text-muted-foreground">Guia Completo</p>
              </div>
            </Link>
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-8">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
