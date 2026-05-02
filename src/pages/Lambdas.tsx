import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Lambdas() {
  return (
    <PageContainer title="Lambdas & Method References" subtitle="Sintaxe enxuta para Functional Interfaces — Java 8+ ficou outro idioma." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Antes do Java 8, sempre que você queria passar comportamento como argumento — um <code>Comparator</code>, um <code>Runnable</code>, um listener — tinha que escrever uma classe anônima de 6 linhas pra um método de 1. Lambdas cortaram esse boilerplate e abriram caminho para a Stream API. Hoje, código Java moderno é praticamente lambda em todo lugar.
        </p><CodeBlock title="Antes e depois" code={`// Antes (classe anonima):
Runnable antigo = new Runnable() {
    @Override
    public void run() {
        System.out.println("rodando");
    }
};

// Depois (lambda):
Runnable novo = () -> System.out.println("rodando");`} /><h2>Sintaxe da lambda</h2><p>
          A forma geral é <code>(parametros) {"->"} corpo</code>. Variações:
        </p><CodeBlock title="Todos os formatos" code={`// Sem parametros
Runnable r = () -> System.out.println("oi");

// Um parametro - parenteses opcionais
Function<String, Integer> tam = s -> s.length();

// Multiplos parametros
BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;

// Tipos explicitos (raro, so quando o compilador nao infere)
BiFunction<Integer, Integer, Integer> soma2 = (Integer a, Integer b) -> a + b;

// Corpo de bloco com return
Function<Integer, String> classificar = n -> {
    if (n > 0) return "positivo";
    if (n < 0) return "negativo";
    return "zero";
};`} /><h2>Inferência de tipo</h2><p>
          Você não escreve o tipo dos parâmetros porque o compilador deduz do <strong>contexto</strong> (chamado de <em>target type</em>). Quando você atribui a um <code>
            Function{"<String, Integer>"}
          </code>, o compilador sabe que <code>s</code> é <code>String</code>.
        </p><AlertBox type="note" title="Lambda sozinha não existe">
          Você não pode escrever <code>var f = s {"->"} s.length();</code>. O compilador precisa de um tipo alvo para descobrir qual interface funcional você quer. Sempre dê um nome de tipo concreto à esquerda.
        </AlertBox><h2>Method references — atalhos pra lambdas óbvias</h2><p>
          Quando sua lambda só está chamando um método existente, dá para usar a sintaxe <code>::</code>. Existem 4 formatos:
        </p><h3>
          1. Referência a método estático: <code>Classe::metodo</code>
        </h3><CodeBlock code={`// Lambda:
Function<String, Integer> parse1 = s -> Integer.parseInt(s);
// Reference:
Function<String, Integer> parse2 = Integer::parseInt;`} /><h3>2. Referência a método de uma instância específica</h3><CodeBlock code={`String prefixo = "log: ";
// Lambda:
Function<String, String> com1 = s -> prefixo.concat(s);
// Reference:
Function<String, String> com2 = prefixo::concat;`} /><h3>3. Referência a método de instância de uma classe (sem instância fixa)</h3><CodeBlock code={`// Lambda:
Function<String, Integer> tam1 = s -> s.length();
// Reference: chamado em CADA instancia recebida
Function<String, Integer> tam2 = String::length;

// O primeiro argumento vira o "this" da chamada
List.of("Java", "Kotlin").stream()
    .map(String::toUpperCase)
    .forEach(System.out::println);`} /><h3>
          4. Referência a construtor: <code>Classe::new</code>
        </h3><CodeBlock code={`// Lambda:
Supplier<List<String>> nova1 = () -> new ArrayList<>();
// Reference:
Supplier<List<String>> nova2 = ArrayList::new;

// Com argumento - precisa de uma Function compativel
Function<String, StringBuilder> sb = StringBuilder::new;`} /><h2>Captura de variáveis: "effectively final"</h2><p>
          Lambdas conseguem usar variáveis do escopo externo, mas com uma regra: a variável precisa ser <strong>final ou efetivamente final</strong> — ou seja, você não reatribui depois de inicializada. Isso evita bugs sutis quando a lambda é executada em outra thread.
        </p><CodeBlock title="Captura válida" code={`int multiplicador = 3; // nunca e reatribuido = effectively final
Function<Integer, Integer> mult = n -> n * multiplicador;
System.out.println(mult.apply(5)); // 15`} /><CodeBlock title="Captura inválida" code={`int contador = 0;
Runnable r = () -> contador++; // ERRO: variavel modificada
contador = 1;                  // se descomentar, tambem quebra a lambda acima`} /><AlertBox type="tip" title="Truque: array de 1 elemento ou AtomicInteger">
          Quando você precisa <em>realmente</em> mudar um valor de dentro da lambda, use uma referência mutável: um array <code>int[] c = 0; c[0]++;</code> ou, melhor ainda, <code>AtomicInteger</code>. Mas pense bem se isso não está escondendo um problema de design.
        </AlertBox><h2>
          Lambda vs classe anônima: a sutileza do <code>this</code>
        </h2><p>
          A diferença mais importante: dentro de uma lambda, <code>this</code> é o <strong>this da classe que envolve</strong> a lambda. Dentro de uma classe anônima, <code>this</code> é a própria instância anônima.
        </p><CodeBlock title="this comporta-se diferente" code={`public class Servico {
    private String nome = "Servico";

    public void rodarLambda() {
        Runnable r = () -> System.out.println(this.nome); // "Servico"
        r.run();
    }

    public void rodarAnonima() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                // this aqui e a Runnable anonima, nao Servico
                System.out.println(this.getClass().getSimpleName()); // Servico$1
            }
        };
        r.run();
    }
}`} /><h2>Outras diferenças práticas</h2><ul>
          <li>
            <strong>Sem campos próprios</strong>: lambdas não podem declarar campos. Classe anônima pode.
          </li><li>
            <strong>Não dá para sombrear variáveis</strong>: o nome do parâmetro conflitaria com nomes do escopo externo. Em classe anônima dá.
          </li><li>
            <strong>Performance</strong>: o compilador usa <code>invokedynamic</code> para lambdas — sem criar uma classe nova no disco. Mais leve.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Reescreva o código abaixo usando lambda e depois method reference: <code>
              Comparator{"<String>"} c = new Comparator{"<String>"}() {"{ public int compare(String a, String b) { return a.length() - b.length(); } }"}
            </code>.
          </li><li>
            Crie uma <code>
              List{"<String>"}
            </code> com 5 nomes. Use <code>list.forEach(System.out::println)</code> e depois ordene com <code>list.sort(Comparator.comparing(String::length))</code>.
          </li><li>
            Crie uma classe <code>Carro</code> com construtor que recebe <code>String modelo</code>. Use <code>
              Function{"<String, Carro>"} fab = Carro::new;
            </code> e fabrique 3 carros aplicando a função numa lista de modelos.
          </li>
        </ol>
      </PageContainer>
  );
}
