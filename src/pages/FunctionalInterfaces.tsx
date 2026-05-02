import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FunctionalInterfaces() {
  return (
    <PageContainer title="Functional Interfaces" subtitle="Interface com 1 método abstrato — base de toda a programação funcional em Java." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Toda vez que você escreve uma <em>lambda</em> em Java — <code>x {"->"} x * 2</code> — o compilador precisa de um "molde" pra encaixar. Esse molde é uma <strong>functional interface</strong>. Sem entender esse conceito, Stream, CompletableFuture, listeners de UI e quase tudo que é moderno em Java fica meio mágico. Vamos tirar o véu.
        </p><h2>Definição: SAM (Single Abstract Method)</h2><p>
          Uma functional interface é simplesmente uma interface com <strong>exatamente um método abstrato</strong>. Pode ter quantos métodos <code>default</code> ou <code>static</code> quiser — só não pode ter mais de um abstrato.
        </p><CodeBlock title="Sua primeira functional interface" code={`@FunctionalInterface
public interface Calculadora {
    int operar(int a, int b);

    default int dobrarResultado(int a, int b) {
        return operar(a, b) * 2;
    }
}

class Demo {
    public static void main(String[] args) {
        Calculadora soma = (a, b) -> a + b;
        Calculadora mult = (a, b) -> a * b;

        System.out.println(soma.operar(2, 3));        // 5
        System.out.println(mult.dobrarResultado(2, 3)); // 12
    }
}`} /><AlertBox type="tip" title="@FunctionalInterface é opcional, mas use">
          A anotação <code>@FunctionalInterface</code> não muda o comportamento — qualquer interface com 1 método abstrato já é funcional. Mas ela diz ao compilador "vigie pra mim: se alguém adicionar outro método abstrato, dê erro". Em equipe, isso evita que sua API quebre por descuido.
        </AlertBox><h2>
          O kit pronto: <code>java.util.function</code>
        </h2><p>
          Em vez de você criar uma interface nova pra cada operação, o Java 8 trouxe um pacote cheio de functional interfaces prontas. Decorar as 6 principais já cobre 90% dos casos.
        </p><h3>
          <code>
            {"Function<T, R>"}
          </code> — recebe T, devolve R
        </h3><CodeBlock code={`import java.util.function.Function;

Function<String, Integer> tamanho = s -> s.length();
System.out.println(tamanho.apply("Java")); // 4

// Composicao:
Function<Integer, Integer> dobro = n -> n * 2;
Function<String, Integer> tamanhoDobrado = tamanho.andThen(dobro);
System.out.println(tamanhoDobrado.apply("Java")); // 8`} /><h3>
          <code>
            {"Predicate<T>"}
          </code> — recebe T, devolve boolean
        </h3><CodeBlock code={`import java.util.function.Predicate;

Predicate<Integer> positivo = n -> n > 0;
Predicate<Integer> par = n -> n % 2 == 0;

System.out.println(positivo.test(5));               // true
System.out.println(positivo.and(par).test(4));      // true
System.out.println(positivo.or(par).test(-2));      // true
System.out.println(positivo.negate().test(-5));     // true`} /><h3>
          <code>
            {"Consumer<T>"}
          </code> — recebe T, devolve nada
        </h3><CodeBlock code={`import java.util.function.Consumer;
import java.util.List;

Consumer<String> imprimir = s -> System.out.println(">> " + s);
List.of("a", "b", "c").forEach(imprimir);`} /><h3>
          <code>
            {"Supplier<T>"}
          </code> — não recebe nada, devolve T
        </h3><CodeBlock code={`import java.util.function.Supplier;

Supplier<Double> aleatorio = Math::random;
System.out.println(aleatorio.get()); // ex: 0.4523...

// Util para inicializacao preguicosa
Supplier<List<String>> listaVazia = ArrayList::new;`} /><h3>Variantes mais usadas</h3><ul>
          <li>
            <code>
              BiFunction{"<T, U, R>"}
            </code> — recebe dois argumentos diferentes, devolve R. Ex: <code>(a, b) {"->"} a + b</code>.
          </li><li>
            <code>
              UnaryOperator{"<T>"}
            </code> — Function de T pra T. Ex: <code>x {"->"} x.toUpperCase()</code>.
          </li><li>
            <code>
              BinaryOperator{"<T>"}
            </code> — BiFunction onde os 3 tipos são iguais. Ex: <code>(a, b) {"->"} a + b</code> para inteiros.
          </li><li>
            <code>BiPredicate</code>, <code>BiConsumer</code> — versões de 2 argumentos.
          </li>
        </ul><AlertBox type="info" title="Versões para primitivos">
          Para evitar autoboxing existem variantes especializadas: <code>IntFunction</code>, <code>IntPredicate</code>, <code>ToIntFunction</code>, <code>IntUnaryOperator</code>... Use quando estiver processando muitos números em sequência (em Streams, por exemplo).
        </AlertBox><h2>Onde isso aparece na vida real</h2><p>
          Quando você usa <code>Stream</code>, está chamando métodos que recebem functional interfaces:
        </p><CodeBlock title="Stream usando Function e Predicate" code={`import java.util.List;
import java.util.stream.Collectors;

List<String> nomes = List.of("Ana", "Bruno", "Carlos", "Bia");

List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("B"))   // Predicate<String>
    .map(n -> n.toUpperCase())        // Function<String, String>
    .collect(Collectors.toList());

System.out.println(resultado); // [BRUNO, BIA]`} /><h2>Criando suas próprias</h2><p>
          Vale criar uma interface customizada quando o nome do método ajuda a documentar a intenção. Comparar <code>
            Validador{"<Pedido>"}
          </code> com <code>
            Function{"<Pedido, Boolean>"}
          </code> — qual fica mais claro?
        </p><CodeBlock title="Functional interface de domínio" code={`@FunctionalInterface
public interface Validador<T> {
    boolean ehValido(T item);

    default Validador<T> e(Validador<T> outro) {
        return item -> this.ehValido(item) && outro.ehValido(item);
    }
}

class Demo {
    public static void main(String[] args) {
        Validador<String> naoVazio = s -> !s.isBlank();
        Validador<String> ate100 = s -> s.length() <= 100;

        Validador<String> textoOk = naoVazio.e(ate100);

        System.out.println(textoOk.ehValido("oi"));  // true
        System.out.println(textoOk.ehValido(""));    // false
    }
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              Predicate{"<String>"}
            </code> que aceita apenas e-mails terminados em <code>.br</code>. Combine com outro que verifica se contém <code>@</code>. Teste com 4 strings.
          </li><li>
            Crie uma functional interface <code>
              Transformacao{"<T>"}
            </code> com método <code>aplicar(T entrada): T</code>. Use-a para encapsular operações em textos: <code>trim</code>, <code>toUpperCase</code>, remover espaços duplos. Componha as três num pipeline.
          </li><li>
            Use <code>Function.andThen</code> para criar uma função que recebe um número, calcula seu quadrado e depois soma 10. Aplique aos números de 1 a 5.
          </li>
        </ol>
      </PageContainer>
  );
}
