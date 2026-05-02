import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SetPage() {
  return (
    <PageContainer title="Set: HashSet, LinkedHashSet, TreeSet" subtitle="Sem duplicatas — escolha a implementação pelo trade-off." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Toda vez que você se pegou escrevendo "se já existe não adiciona" antes de um <code>list.add(...)</code>, era um <code>Set</code> que você queria. <strong>Set</strong> é uma coleção que <em>não permite duplicatas</em> — adicionar o mesmo elemento duas vezes simplesmente não faz nada. Perfeito para "conjunto de tags", "ids únicos", "palavras distintas".
        </p><h2>Como Java sabe se é duplicata</h2><p>
          Set usa <strong>dois</strong> métodos: <code>equals()</code> diz se são iguais e <code>hashCode()</code> diz onde procurar. Os dois precisam ser <em>coerentes</em>: se dois objetos são equals, têm que ter o mesmo hashCode. Strings, números e <code>record</code> já vêm com isso correto. Para classes suas, você precisa implementar — ou usar <code>record</code>, que gera tudo de graça.
        </p><CodeBlock title="record já implementa equals e hashCode" code={`public record Tag(String nome) {}

Set<Tag> tags = new HashSet<>();
tags.add(new Tag("java"));
tags.add(new Tag("backend"));
tags.add(new Tag("java"));   // ignorado: já existe
System.out.println(tags.size()); // 2`} /><h2>As três implementações</h2><h3>HashSet — o padrão</h3><p>
          Usa uma tabela hash. Operações em <strong>O(1)</strong> em média. Ordem de iteração aparentemente aleatória (depende dos hashes). É a escolha padrão quando você só quer unicidade.
        </p><CodeBlock title="HashSet" code={`import java.util.*;

Set<String> visitados = new HashSet<>();
visitados.add("home");
visitados.add("login");
visitados.add("home"); // ignorado

System.out.println(visitados.size());          // 2
System.out.println(visitados.contains("home")); // true`} /><h3>LinkedHashSet — preserva ordem de inserção</h3><p>
          Mesma performance <strong>O(1)</strong>, mas mantém a ordem em que você inseriu. Use quando a ordem importa para exibição mas você ainda precisa de unicidade rápida.
        </p><CodeBlock title="LinkedHashSet" code={`Set<String> times = new LinkedHashSet<>();
times.add("Flamengo");
times.add("Vasco");
times.add("Botafogo");
times.add("Flamengo"); // ignorado

System.out.println(times); // [Flamengo, Vasco, Botafogo]`} /><h3>TreeSet — ordenado</h3><p>
          Mantém os elementos sempre ordenados (ordem natural ou um <code>Comparator</code> fornecido). Operações em <strong>O(log n)</strong>. Use quando você quer iterar em ordem ou precisa de operações como "primeiro maior que X" (<code>ceiling</code>, <code>floor</code>, <code>higher</code>, <code>lower</code>).
        </p><CodeBlock title="TreeSet" code={`Set<Integer> notas = new TreeSet<>();
notas.add(7);
notas.add(3);
notas.add(10);
notas.add(5);

System.out.println(notas); // [3, 5, 7, 10]

NavigableSet<Integer> nav = (NavigableSet<Integer>) notas;
System.out.println(nav.first());     // 3
System.out.println(nav.ceiling(6));  // 7  (menor >= 6)`} /><AlertBox type="warning" title="TreeSet exige Comparable ou Comparator">
          Se você colocar objetos seus num TreeSet sem implementar <code>Comparable</code> e sem passar um <code>Comparator</code>, vai tomar <code>ClassCastException</code>.
        </AlertBox><h2>equals e hashCode: o contrato sagrado</h2><p>
          Se você não usa <code>record</code>, escreva os dois manualmente (sua IDE gera). Errar isso significa que o Set vai aceitar duplicatas e <code>contains</code> vai retornar false para algo que está lá dentro.
        </p><CodeBlock title="equals/hashCode na mão" code={`import java.util.Objects;

public class Pessoa {
    private final String cpf;
    private final String nome;

    public Pessoa(String cpf, String nome) {
        this.cpf = cpf;
        this.nome = nome;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf); // identidade pelo CPF
    }

    @Override
    public int hashCode() {
        return Objects.hash(cpf);
    }
}`} /><h2>Operações de conjunto</h2><p>
          <code>Set</code> tem três operações clássicas escondidas em métodos genéricos da interface<code> Collection</code>:
        </p><ul>
          <li>
            <code>addAll</code> — <strong>união</strong> (adiciona tudo do outro).
          </li><li>
            <code>retainAll</code> — <strong>interseção</strong> (mantém só o que está nos dois).
          </li><li>
            <code>removeAll</code> — <strong>diferença</strong> (remove o que está no outro).
          </li>
        </ul><CodeBlock title="União, interseção, diferença" code={`Set<String> a = new HashSet<>(Set.of("java", "kotlin", "scala"));
Set<String> b = new HashSet<>(Set.of("java", "python", "go"));

Set<String> uniao = new HashSet<>(a);
uniao.addAll(b);          // [java, kotlin, scala, python, go]

Set<String> intersec = new HashSet<>(a);
intersec.retainAll(b);    // [java]

Set<String> diferenca = new HashSet<>(a);
diferenca.removeAll(b);   // [kotlin, scala]`} /><h2>EnumSet: o segredo dos enums</h2><p>
          Para sets de valores de um <code>enum</code>, use <code>EnumSet</code>. Por baixo é um bitset — extremamente rápido e compacto, ordens de magnitude melhor que HashSet.
        </p><CodeBlock title="EnumSet" code={`import java.util.EnumSet;

enum Permissao { LER, ESCREVER, EXECUTAR, DELETAR }

EnumSet<Permissao> minhas = EnumSet.of(Permissao.LER, Permissao.ESCREVER);
System.out.println(minhas.contains(Permissao.LER)); // true

EnumSet<Permissao> todas = EnumSet.allOf(Permissao.class);
EnumSet<Permissao> nenhuma = EnumSet.noneOf(Permissao.class);`} /><h2>Set imutável: Set.of</h2><p>
          Para conjuntos fixos, <code>Set.of(...)</code> cria um Set imutável. Tentar modificar dá <code>UnsupportedOperationException</code>.
        </p><CodeBlock title="Set.of" code={"Set<String> diasUteis = Set.of(\"seg\", \"ter\", \"qua\", \"qui\", \"sex\");"} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Receba uma frase do usuário e imprima <strong>quantas palavras únicas</strong> ela tem (separe por espaço, jogue tudo num <code>HashSet</code>).
          </li><li>
            Crie um <code>record Cliente(String email)</code> e tente adicionar dois clientes com o mesmo email num <code>Set</code>. Confirme que só fica um. Depois remova <code>record</code> e use uma classe normal sem equals/hashCode — veja o Set aceitando os dois.
          </li><li>
            Tenha dois <code>
              {"Set<Integer>"}
            </code> com os múltiplos de 2 e os múltiplos de 3 até 30. Calcule a interseção (múltiplos de 6) usando <code>retainAll</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
