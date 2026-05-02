import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ComparatorPage() {
  return (
    <PageContainer title="Comparable & Comparator" subtitle="Como ordenar suas próprias classes." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Ordenar uma <code>
            {"List<Integer>"}
          </code> é fácil — Java já sabe comparar. Mas e quando você tem uma <code>
            {"List<Pessoa>"}
          </code>? Java pergunta: "ordenar por quê? nome, idade, salário?". <strong>Comparable</strong> e <strong>Comparator</strong> são as duas respostas para esse "por quê".
        </p><h2>A regra de ouro do compare</h2><p>
          Tanto <code>compareTo</code> (de Comparable) quanto <code>compare</code> (de Comparator) retornam um <code>int</code>:
        </p><ul>
          <li>
            <strong>negativo</strong> — o primeiro vem antes do segundo
          </li><li>
            <strong>zero</strong> — são "iguais" para fins de ordenação
          </li><li>
            <strong>positivo</strong> — o primeiro vem depois
          </li>
        </ul><AlertBox type="tip" title="Truque seguro">
          Para comparar números primitivos, use <code>Integer.compare(a, b)</code>, <code>Long.compare</code>, <code>Double.compare</code>. Evite <code>a - b</code> — pode estourar overflow para valores extremos.
        </AlertBox><h2>Comparable: a ordem natural</h2><p>
          Quando uma classe tem uma ordem "óbvia" (CPF para Pessoa, código para Produto, data para Evento), implemente <code>
            {"Comparable<T>"}
          </code> <strong>nela mesma</strong>. Essa é a ordem natural — quem chamar <code>Collections.sort(lista)</code> sem argumentos vai usar essa.
        </p><CodeBlock title="Comparable na própria classe" code={`public class Produto implements Comparable<Produto> {
    private final String codigo;
    private final double preco;

    public Produto(String codigo, double preco) {
        this.codigo = codigo;
        this.preco = preco;
    }

    public String getCodigo() { return codigo; }
    public double getPreco()  { return preco; }

    @Override
    public int compareTo(Produto outro) {
        // ordem natural: por código alfabético
        return this.codigo.compareTo(outro.codigo);
    }
}`} /><CodeBlock title="Usando a ordem natural" code={`import java.util.*;

List<Produto> lista = new ArrayList<>(List.of(
    new Produto("Z9", 10.0),
    new Produto("A1", 30.0),
    new Produto("M5", 20.0)
));

Collections.sort(lista);
// ou: lista.sort(null);
// ordenado por código: A1, M5, Z9`} /><h2>Comparator: ordens alternativas</h2><p>
          E se você quiser ordenar por <em>preço</em>? Aí vem o <code>Comparator</code> — uma classe ou lambda separada que diz "compare assim".
        </p><CodeBlock title="Comparator clássico" code={`Comparator<Produto> porPreco = new Comparator<>() {
    @Override
    public int compare(Produto a, Produto b) {
        return Double.compare(a.getPreco(), b.getPreco());
    }
};

lista.sort(porPreco);`} /><CodeBlock title="Mesma coisa com lambda (mais limpo)" code="lista.sort((a, b) -> Double.compare(a.getPreco(), b.getPreco()));" /><h2>Comparator.comparing: o jeito moderno</h2><p>
          Em quase 100% dos casos você usa as fábricas estáticas de <code>Comparator</code>. Elas deixam o código declarativo e curto.
        </p><CodeBlock title="comparing, comparingInt, comparingDouble" code={`import java.util.Comparator;

// por código (String)
lista.sort(Comparator.comparing(Produto::getCodigo));

// por preço (double) — versão especializada evita autoboxing
lista.sort(Comparator.comparingDouble(Produto::getPreco));

// existem comparingInt e comparingLong também`} /><h2>thenComparing: ordem secundária</h2><p>
          E se dois produtos tiverem o mesmo preço? Você quer um critério de desempate. Encadeie com <code>thenComparing</code>.
        </p><CodeBlock title="Critérios em cascata" code={`Comparator<Produto> ord = Comparator
    .comparingDouble(Produto::getPreco)        // primeiro pelo preço
    .thenComparing(Produto::getCodigo);        // empate? pelo código

lista.sort(ord);`} /><h2>reversed: ordem inversa</h2><CodeBlock title="Inverter qualquer comparator" code={`// preços do maior para o menor
lista.sort(Comparator.comparingDouble(Produto::getPreco).reversed());

// inverso da ordem natural
lista.sort(Comparator.<Produto>naturalOrder().reversed());
// ou: Comparator.reverseOrder()`} /><h2>nullsFirst e nullsLast</h2><p>
          Quando o campo pode ser null, <code>Comparator.comparing(...)</code> sozinho explode. Envolva com <code>nullsFirst</code> ou <code>nullsLast</code>:
        </p><CodeBlock title="Lidando com null" code={`Comparator<Produto> seguro = Comparator.comparing(
    Produto::getCodigo,
    Comparator.nullsLast(Comparator.naturalOrder())
);`} /><h2>Onde os comparators entram</h2><ul>
          <li>
            <code>Collections.sort(lista)</code> — usa Comparable.
          </li><li>
            <code>Collections.sort(lista, comp)</code> — usa Comparator.
          </li><li>
            <code>lista.sort(null)</code> ou <code>lista.sort(comp)</code> — idem.
          </li><li>
            <code>Arrays.sort(arr)</code> e <code>Arrays.sort(arr, comp)</code>.
          </li><li>
            <code>TreeSet</code> e <code>TreeMap</code> aceitam Comparator no construtor para definir a ordem dos elementos/chaves.
          </li><li>
            <code>Stream.sorted()</code> e <code>Stream.sorted(comp)</code> em streams.
          </li>
        </ul><CodeBlock title="TreeSet com Comparator customizado" code={`Set<Produto> ordenadosPorPreco = new TreeSet<>(
    Comparator.comparingDouble(Produto::getPreco)
);
ordenadosPorPreco.add(new Produto("A", 30.0));
ordenadosPorPreco.add(new Produto("B", 10.0));
// itera do mais barato pro mais caro`} /><h2>Comparable vs Comparator: quando usar cada um</h2><ul>
          <li>
            <strong>Comparable</strong>: quando existe <em>uma</em> ordem óbvia para a classe e ela é parte da identidade do tipo (CPF, código, data).
          </li><li>
            <strong>Comparator</strong>: para ordens alternativas, ordens contextuais, ou quando você não controla a classe (ex: <code>String</code>, <code>Integer</code> — vêm prontas mas você pode ordenar por qualquer critério com Comparator).
          </li>
        </ul><AlertBox type="warning" title="Cuidado com TreeSet e equals">
          TreeSet considera "iguais" os elementos cujo <code>compareTo</code>/comparator retorna 0,<em>mesmo que equals diga que são diferentes</em>. Se seu comparator só olha o preço, produtos com mesmo preço viram um só no Set. Isso é causa famosa de bug.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie a classe <code>Pessoa(String nome, int idade)</code>. Implemente <code>Comparable</code> ordenando por idade. Crie uma lista com 4 pessoas e ordene.
          </li><li>
            Mantenha a classe acima e adicione um <code>Comparator</code> alternativo que ordena por nome (use <code>Comparator.comparing</code>). Ordene a mesma lista pelos dois critérios e compare.
          </li><li>
            Crie uma lista de produtos onde o desempate por preço usa o nome em ordem<strong> inversa</strong>. Use <code>thenComparing(...).reversed()</code> com cuidado — observe se o reversed afeta toda a cadeia ou só o último critério.
          </li>
        </ol>
      </PageContainer>
  );
}
