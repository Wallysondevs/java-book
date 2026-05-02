import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Imutabilidade() {
  return (
    <PageContainer title="Imutabilidade" subtitle="Por que objetos imutáveis são thread-safe de graça e mais fáceis de raciocinar." difficulty="intermediario" timeToRead="18 min">
        <h2>POR QUE você precisa disso</h2><p>
          Bug clássico: você passa um <code>
            {"Map<String, Integer>"}
          </code> pro método de outro time, ele <em>modifica</em>, e três horas depois você descobre que sua cache de preços está zoada. Objetos mutáveis compartilhados são uma das maiores fontes de bug em sistemas concorrentes.
        </p><p>
          Imutabilidade resolve isso por construção: se ninguém pode mudar o objeto, <strong>ele é seguro pra todo mundo</strong>. Pense em uma nota fiscal já emitida — ela não muda; se algo precisa ser corrigido, emite-se outra.
        </p><h2>Definição</h2><p>
          Um objeto é imutável quando seu <strong>estado observável nunca muda</strong> depois do construtor. Sem setters, sem campos públicos mutáveis, sem método que altere coleção interna.
        </p><h2>Benefícios</h2><ul>
          <li>
            <strong>Thread-safe de graça</strong>: nenhum lock, nenhum <code>volatile</code>.
          </li><li>
            <strong>hashCode/equals consistentes</strong>: pode usar como chave de <code>
              {"Map<K, V>"}
            </code> sem medo do hash mudar e o objeto sumir.
          </li><li>
            <strong>Cacheable</strong>: pode reusar a mesma instância (veja <code>Integer</code> de -128 a 127).
          </li><li>
            <strong>Fácil de raciocinar</strong>: o valor que você vê no debug é o valor pra sempre.
          </li>
        </ul><h2>Como tornar uma classe imutável (jeito clássico)</h2><ol>
          <li>
            Marque a classe como <code>final</code> (ninguém pode estender e adicionar setter).
          </li><li>
            Todos os campos <code>private final</code>.
          </li><li>Sem setters, sem método que mute estado.</li><li>
            Defensive copy em construtor e getters para campos de tipo mutável (lista, mapa, <code>Date</code>).
          </li>
        </ol><CodeBlock title="Imutável feito à mão" code={`public final class Pedido {
    private final String id;
    private final List<String> itens;

    public Pedido(String id, List<String> itens) {
        this.id = id;
        this.itens = List.copyOf(itens); // cópia + imutável
    }
    public String id() { return id; }
    public List<String> itens() { return itens; } // já é unmodifiable
}`} /><h2>Records (Java 16+) — imutabilidade quase de graça</h2><p>
          <code>record</code> gera campos <code>final</code>, construtor canônico, acessores, <code>equals</code>, <code>hashCode</code> e <code>toString</code>. Você só precisa cuidar de campos mutáveis no construtor compacto.
        </p><CodeBlock code={`public record Pedido(String id, List<String> itens) {
    public Pedido {
        itens = List.copyOf(itens); // congela
    }
}`} /><h2>Coleções imutáveis</h2><ul>
          <li>
            <code>List.of(...)</code>, <code>Set.of(...)</code>, <code>Map.of(...)</code> — imutáveis verdadeiras (Java 9+).
          </li><li>
            <code>List.copyOf(c)</code> — cópia imutável de uma coleção existente (Java 10+).
          </li><li>
            <code>Collections.unmodifiableList(l)</code> — VIEW imutável; veja a pegadinha abaixo.
          </li>
        </ul><CodeBlock title="A pegadinha do unmodifiable" code={`List<String> original = new ArrayList<>(List.of("a", "b"));
List<String> view = Collections.unmodifiableList(original);

view.add("c");        // UnsupportedOperationException, ok
original.add("c");    // PERMITIDO!
System.out.println(view); // [a, b, c]  ← a "view imutável" mudou`} /><AlertBox type="warning" title="Use copyOf">
          <code>List.copyOf(original)</code> faz cópia de verdade. Mudanças no original não afetam mais. Prefira sempre que precisar guardar internamente.
        </AlertBox><h2>Estilo with-* methods: "modificar" sem modificar</h2><p>
          Como o objeto é imutável, você não muda — você produz uma <strong>nova instância</strong> com a alteração. Convenção: prefixo <code>with</code>.
        </p><CodeBlock code={`public record Pessoa(String nome, int idade) {
    public Pessoa withNome(String novoNome)  { return new Pessoa(novoNome, idade); }
    public Pessoa withIdade(int novaIdade)   { return new Pessoa(nome, novaIdade); }
}

Pessoa p1 = new Pessoa("Ana", 30);
Pessoa p2 = p1.withIdade(31); // p1 segue 30, p2 é 31
`} /><AlertBox type="tip" title="Performance">
          Não tema alocar. JVM moderna (G1, ZGC) lida muito bem com objetos curtos. Em 99% dos casos a clareza compensa o ganho mínimo de performance da mutação.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue uma classe sua com setters. Reescreva como <code>record</code> e adicione métodos <code>withX()</code> para os "updates".
          </li><li>
            Crie um <code>
              {"record Carteira(List<Acao> acoes)"}
            </code>. No construtor compacto, use <code>List.copyOf</code>. Tente alterar a lista original depois de construir e confirme que a carteira não é afetada.
          </li><li>
            Demonstre o bug do <code>unmodifiableList</code>: crie um <code>ArrayList</code>, embrulhe com <code>unmodifiable</code>, modifique o original, e veja a "view" mudar. Depois substitua por <code>copyOf</code> e prove o contrário.
          </li>
        </ol>
      </PageContainer>
  );
}
