import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DefensiveCopying() {
  return (
    <PageContainer title="Defensive Copying" subtitle="Quando o cliente passa ou recebe objeto mutável — copie pra proteger seu invariante." difficulty="avancado" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine que você guarda uma <code>
            {"List<String>"}
          </code> que veio de fora. Você confia. Em algum momento, o cliente que te passou a lista <strong>modifica ela do lado dele</strong>. Surpresa: o estado interno do seu objeto mudou sem você saber. Tchau invariantes, olá bug intermitente.
        </p><p>
          Defensive copying é o cinto de segurança: <em>copie o que entra</em> e <em>copie o que sai</em> sempre que o tipo for mutável. Como num cofre — você não guarda a chave que o cliente trouxe, faz uma cópia.
        </p><h2>O bug em ação</h2><CodeBlock title="Sem defensive copy — vulnerável" code={`public final class Periodo {
    private final Date inicio;
    private final Date fim;

    public Periodo(Date inicio, Date fim) {
        if (inicio.after(fim)) throw new IllegalArgumentException();
        this.inicio = inicio; // guarda a referência
        this.fim = fim;
    }
    public Date inicio() { return inicio; } // devolve a referência
    public Date fim()    { return fim; }
}

// Cliente sabotando:
Date i = new Date();
Date f = new Date(i.getTime() + 1000);
Periodo p = new Periodo(i, f);
f.setTime(0); // p.fim agora é antes de p.inicio. Invariante quebrado!`} /><h2>Defesa 1 — copiar no construtor</h2><p>
          Antes de validar e guardar, copie. Assim, mesmo que o cliente mexa na referência original, sua cópia segue intacta. <strong>Copie antes de validar</strong>, senão um atacante com TOCTOU (time-of-check / time-of-use) pode mudar entre a validação e a atribuição.
        </p><CodeBlock code={`public Periodo(Date inicio, Date fim) {
    this.inicio = new Date(inicio.getTime()); // copia primeiro
    this.fim    = new Date(fim.getTime());
    if (this.inicio.after(this.fim))           // valida a cópia
        throw new IllegalArgumentException();
}`} /><h2>Defesa 2 — copiar no getter</h2><p>
          Não basta copiar entrada. Se o getter devolve a referência guardada, o cliente modifica e bagunça você. Devolva sempre uma cópia (ou um wrapper imutável).
        </p><CodeBlock code={`public Date inicio() { return new Date(inicio.getTime()); }
public Date fim()    { return new Date(fim.getTime()); }`} /><h2>Coleções: cópia ou imutável</h2><p>
          Para listas/mapas/sets, prefira <code>List.copyOf</code> (Java 10+). Cópia + retorna coleção imutável. Dois pássaros, uma cajadada.
        </p><CodeBlock code={`public final class Pedido {
    private final List<String> itens;

    public Pedido(List<String> itens) {
        this.itens = List.copyOf(itens); // cópia + imutável
    }
    public List<String> itens() {
        return itens; // já é unmodifiable, pode devolver direto
    }
}`} /><h2>Records têm a mesma armadilha</h2><p>
          Records são imutáveis quanto à <em>referência</em> dos componentes, mas se o componente for mutável, o acessor gerado <strong>devolve a referência</strong>. Use o construtor compacto pra blindar.
        </p><CodeBlock code={`public record Carrinho(List<String> itens) {
    public Carrinho {
        itens = List.copyOf(itens); // congela na construção
    }
    // acessor gerado devolve a List imutável; OK.
}

// Pegadinha: se você não fizer o copyOf no construtor compacto:
List<String> mutavel = new ArrayList<>(List.of("a"));
Carrinho c = new Carrinho(mutavel);
mutavel.add("b");
System.out.println(c.itens()); // [a, b] ← o carrinho mudou`} /><h2>Custo vs benefício</h2><ul>
          <li>
            <strong>Custo</strong>: uma alocação extra por ponto de entrada/saída. Em coleções grandes pode pesar.
          </li><li>
            <strong>Benefício</strong>: invariante garantido, código previsível, thread-safety parcial.
          </li><li>
            <strong>Quando pular</strong>: classes <em>package-private</em> entre código que você controla totalmente, ou tipos que já são imutáveis (<code>String</code>, <code>LocalDate</code>, <code>BigDecimal</code>).
          </li>
        </ul><AlertBox type="tip" title="Use tipos imutáveis modernos">
          O exemplo clássico do <em>Effective Java</em> usa <code>java.util.Date</code> (mutável). Em código novo, use <code>LocalDate</code>, <code>LocalDateTime</code>, <code>Instant</code> — todos imutáveis. Aí o defensive copy se torna desnecessário pra esses campos. O conceito segue valendo pra qualquer tipo mutável (listas, arrays, objetos de domínio com setters).
        </AlertBox><AlertBox type="warning" title="Atenção a arrays">
          Arrays Java são sempre mutáveis. Se você guarda <code>byte[]</code> ou <code>String[]</code>, faça <code>arr.clone()</code> na entrada e na saída.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Reproduza o bug do <code>Periodo</code> sem defensive copy. Depois aplique copia em construtor e getter e prove que o cliente não consegue mais quebrar o invariante.
          </li><li>
            Crie um <code>
              {"record Time(List<Jogador> jogadores)"}
            </code>. Sem cópia, mostre que o cliente consegue alterar a lista. Adicione o construtor compacto com <code>List.copyOf</code> e prove que parou.
          </li><li>
            Tem uma classe que guarda <code>byte[]</code> (ex: senha hashada, payload binário). Adicione <code>.clone()</code> em construtor e getter, e teste que mudar o array original não afeta mais o objeto.
          </li>
        </ol>
      </PageContainer>
  );
}
