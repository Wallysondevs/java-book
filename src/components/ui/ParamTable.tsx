interface Param {
  flag: string;
  descricao: string;
  exemplo?: string;
}

interface ParamTableProps {
  comando: string;
  descricaoHelp?: string;
  params: Param[];
}

export function ParamTable({ comando, descricaoHelp, params }: ParamTableProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-card">
      <div className="flex items-center gap-3 px-5 py-3 bg-primary/10 border-b border-border">
        <span className="font-mono text-sm font-bold text-primary">{comando}</span>
        <span className="text-xs text-muted-foreground">— principais membros e métodos explicados em português</span>
      </div>
      {descricaoHelp && (
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-sm text-muted-foreground italic">{descricaoHelp}</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-5 py-2 font-mono font-semibold text-primary w-48">Método / Keyword</th>
              <th className="text-left px-5 py-2 font-semibold text-foreground">O que faz (em português)</th>
              <th className="text-left px-5 py-2 font-mono text-muted-foreground w-56 hidden md:table-cell">Exemplo</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-2.5 font-mono text-yellow-400 align-top whitespace-nowrap">{p.flag}</td>
                <td className="px-5 py-2.5 text-foreground align-top">{p.descricao}</td>
                <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground align-top hidden md:table-cell">
                  {p.exemplo || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
