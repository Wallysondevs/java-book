import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Wildcards() {
  return (
    <PageContainer title="Wildcards & Type Erasure" subtitle="? extends, ? super e por que List<String> não é List<Object>." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Você criou um método <code>
            imprimir(List{"<Object>"} lista)
          </code> achando que daria para passar qualquer lista — afinal, tudo herda de <code>Object</code>, certo? Surpresa: passar <code>
            List{"<String>"}
          </code> não compila. Esse é o momento em que muita gente se assusta com genéricos. Wildcards são a saída elegante.
        </p><h2>
          {"Por que List<String> NÃO é List<Object>"}
        </h2><p>
          Em Java, arrays são <strong>covariantes</strong>: <code>String[]</code> cabe num <code>Object[]</code>. Já genéricos são <strong>invariantes</strong>: <code>
            List{"<String>"}
          </code> e <code>
            List{"<Object>"}
          </code> são tipos completamente diferentes. Se fosse permitido, daria para quebrar o sistema:
        </p><CodeBlock title="Por que invariância existe" code={`// Hipotetico, nao compila por boas razoes:
List<String> nomes = new ArrayList<>();
List<Object> objs = nomes;        // se fosse permitido...
objs.add(42);                     // ...voce poria um Integer numa lista de String
String quebrado = nomes.get(0);   // BOOM em runtime`} /><h2>
          O wildcard <code>?</code>
        </h2><p>
          Quando você escreve <code>
            List{"<?>"}
          </code>, está dizendo "uma lista de algum tipo desconhecido". Você consegue ler como <code>Object</code> e descobrir o tamanho, mas <strong>não consegue adicionar</strong> nada (exceto <code>null</code>) porque o compilador não sabe que tipo essa lista aceita.
        </p><CodeBlock title="Aceitando qualquer List" code={`public static void imprimirTudo(List<?> lista) {
    for (Object item : lista) {
        System.out.println(item);
    }
    // lista.add("oi"); // erro: nao sabemos se a lista aceita String
}

// Agora qualquer lista serve:
imprimirTudo(List.of(1, 2, 3));
imprimirTudo(List.of("a", "b"));`} /><h2>
          Upper bound: <code>? extends T</code>
        </h2><p>
          <code>
            List{"<? extends Number>"}
          </code> é "uma lista de algum subtipo de Number" (pode ser <code>Integer</code>, <code>Double</code>, <code>BigDecimal</code>...). Você pode <strong>ler</strong> como <code>Number</code> com segurança, mas não pode adicionar (exceto null) — porque não sabe qual subtipo específico é.
        </p><CodeBlock title="Ler de qualquer lista numérica" code={`public static double somar(List<? extends Number> nums) {
    double total = 0;
    for (Number n : nums) {
        total += n.doubleValue();
    }
    return total;
    // nums.add(1); // ERRO: pode ser List<Double>, nao aceita Integer
}

somar(List.of(1, 2, 3));        // List<Integer> OK
somar(List.of(1.5, 2.5));       // List<Double> OK`} /><h2>
          Lower bound: <code>? super T</code>
        </h2><p>
          <code>
            List{"<? super Integer>"}
          </code> é "uma lista de Integer ou de algum supertipo dele" (pode ser <code>
            List{"<Integer>"}
          </code>, <code>
            List{"<Number>"}
          </code>, <code>
            List{"<Object>"}
          </code>). Aqui é o oposto: você pode <strong>escrever</strong> Integer com segurança, mas ao ler só consegue garantir que é <code>Object</code>.
        </p><CodeBlock title="Adicionar inteiros em qualquer container compatível" code={`public static void adicionarNumeros(List<? super Integer> destino) {
    for (int i = 1; i <= 5; i++) {
        destino.add(i); // OK: Integer cabe em qualquer supertipo
    }
    // Integer x = destino.get(0); // ERRO: so sabemos que e Object
}

List<Number> nums = new ArrayList<>();
adicionarNumeros(nums); // funciona
List<Object> objs = new ArrayList<>();
adicionarNumeros(objs); // tambem funciona`} /><h2>O mnemônico PECS</h2><AlertBox type="tip" title="Producer Extends, Consumer Super">
          Decore essa sigla. <strong>Producer Extends</strong>: se a estrutura <em>produz</em> valores que você vai ler, use <code>? extends T</code>. <strong>Consumer Super</strong>: se a estrutura <em>consome</em> valores que você vai escrever, use <code>? super T</code>. O exemplo clássico é <code>Collections.copy(dest, src)</code> declarado como <code>
            copy(List{"<? super T>"} dest, List{"<? extends T>"} src)
          </code>.
        </AlertBox><h2>Type erasure: o segredinho sujo</h2><p>
          Genéricos no Java são uma <strong>ilusão de tempo de compilação</strong>. Em runtime eles somem — viram <code>Object</code> (ou o upper bound, se houver). Isso se chama <em>type erasure</em>, escolha histórica para manter compatibilidade com código pré-Java-5.
        </p><CodeBlock title="O que o compilador faz por baixo dos panos" code={`// Voce escreve:
class Caixa<T> {
    T valor;
    T pegar() { return valor; }
}

// O bytecode efetivo e (aproximadamente):
class Caixa {
    Object valor;
    Object pegar() { return valor; }
}

// E nas chamadas o compilador insere casts:
Caixa<String> c = new Caixa<>();
String s = c.pegar(); // gera: (String) c.pegar()`} /><h2>Consequências práticas do erasure</h2><ul>
          <li>
            <strong>Não dá para criar new T()</strong>: o construtor de T não existe em runtime. Solução: receber um <code>
              Supplier{"<T>"}
            </code> ou um <code>
              Class{"<T>"}
            </code> como parâmetro.
          </li><li>
            <strong>instanceof T não compila</strong>: pelo mesmo motivo. Você só consegue <code>
              obj instanceof List{"<?>"}
            </code>, nunca <code>
              obj instanceof List{"<String>"}
            </code>.
          </li><li>
            <strong>Não dá para criar new T[]</strong>: arrays precisam saber o tipo em runtime. Use <code>
              List{"<T>"}
            </code> em vez disso.
          </li><li>
            <strong>Dois métodos sobrecarregados que diferem só por T somem</strong>: após erasure ficam com a mesma assinatura.
          </li>
        </ul><CodeBlock title="Truques para contornar o erasure" code={`import java.util.function.Supplier;

class Fabrica<T> {
    private final Supplier<T> criador;

    public Fabrica(Supplier<T> criador) {
        this.criador = criador;
    }

    public T novo() {
        return criador.get();
    }
}

// Uso:
Fabrica<StringBuilder> f = new Fabrica<>(StringBuilder::new);
StringBuilder sb = f.novo();`} /><h2>Reificação parcial: arrays vs generics</h2><AlertBox type="warning" title="Cuidado ao misturar">
          Arrays sabem seu tipo em runtime (são <em>reified</em>) e checam toda atribuição. Generics não. Por isso <code>
            new List{"<String>"}[10]
          </code> é proibido — o array tentaria checar algo que o JVM não conhece. Em geral, prefira <code>
            List{"<T>"}
          </code> a arrays de genéricos.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um método <code>
              maior(List{"<? extends Number>"} nums)
            </code> que devolve o maior valor como <code>double</code>.
          </li><li>
            Escreva um método <code>
              encherDeZeros(List{"<? super Integer>"} destino, int n)
            </code> que adiciona <code>n</code> zeros ao destino. Teste passando uma <code>
              List{"<Number>"}
            </code> e uma <code>
              List{"<Object>"}
            </code>.
          </li><li>
            Tente compilar <code>
              obj instanceof List{"<String>"}
            </code> e veja a mensagem do compilador. Depois reescreva usando <code>
              obj instanceof List{"<?>"} lista
            </code> e itere checando cada item com <code>instanceof String</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
