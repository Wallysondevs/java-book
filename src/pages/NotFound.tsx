import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-[8rem] font-display font-bold text-[#ED8B00] leading-none">404</div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4 flex items-center justify-center gap-3">
          <span className="text-[#ED8B00]">$</span> Página não encontrada
        </h1>
        <p className="text-[#888A85] mb-8">
          A classe que você procurou não compilou — talvez o pacote esteja errado ou a rota mudou.
        </p>
        <div className="rounded-xl overflow-hidden border border-[#1F1F1F]/60 bg-[#0A0A0A] shadow-2xl text-left mb-8 max-w-xl mx-auto">
          <div className="px-4 py-2 bg-[#151515] border-b border-[#1F1F1F]/60 text-xs font-mono text-[#888A85]">
            Compiler.java — erro
          </div>
          <pre className="p-5 text-sm font-mono text-[#D3D7CF] leading-relaxed">
{`$ javac PaginaProcurada.java
error: cannot find symbol
  symbol:   class PaginaProcurada
  location: package livro.java

1 error`}
          </pre>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED8B00] hover:bg-[#FFA830] text-black font-bold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
