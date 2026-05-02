import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Streams() {
  return (
    <PageContainer title="Stream API" subtitle="Pipeline declarativo: filtre, transforme, agregue coleções sem loops manuais." difficulty="intermediario" timeToRead="30 min">
        <h2>Por que você precisa disso</h2><p>
          Você abre um código Java legado e vê: 15 linhas de <code>for</code>, índices, listas auxiliares, ifs aninhados — tudo só pra contar quantos pedidos acima de R$ 100 cada cliente fez. Com Stream, isso vira 4 linhas que se leem quase como uma frase em inglês. Stream é o ferramental que torna processar coleções em Java tão expressivo quanto em Python ou Kotlin.
        </p><CodeBlock title="Loop tradicional vs Stream" code={`// Tradicional:
List<String> resultado = new ArrayList<>();
for (String nome : nomes) {
    if (nome.startsWith("A")) {
        resultado.add(nome.toUpperCase());
    }
}

// Stream:
List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .toList();`} /><h2>O conceito: pipeline em 3 partes</h2><p>Toda operação com Stream tem três fases:</p><ol>
          <li>
            <strong>Fonte</strong>: de onde vêm os dados (uma coleção, um arquivo, um range...).
          </li><li>
            <strong>Operações intermediárias</strong>: transformações <em>preguiçosas</em> que devolvem outro Stream (<code>filter</code>, <code>map</code>, <code>sorted</code>...).
          </li><li>
            <strong>Operação terminal</strong>: dispara o processamento e produz um resultado (<code>collect</code>, <code>count</code>, <code>forEach</code>...).
          </li>
        </ol><AlertBox type="info" title="Lazy = preguiçoso">
          Operações intermediárias só "anotam o que fazer". Nada acontece até a operação terminal aparecer. Isso permite o Java otimizar — encadeando vários <code>filter</code> e <code>map</code> num único loop interno.
        </AlertBox><h2>Criando streams</h2><CodeBlock title="Várias formas de começar" code={`import java.util.stream.*;

// De uma coleção:
Stream<String> s1 = List.of("a", "b", "c").stream();

// De valores avulsos:
Stream<Integer> s2 = Stream.of(1, 2, 3);

// Stream infinita - cuidado: precisa limit() depois
Stream<Integer> pares = Stream.iterate(0, n -> n + 2);
Stream<Double> aleatorios = Stream.generate(Math::random);

// Range de inteiros (sem autoboxing):
IntStream r = IntStream.range(1, 11);       // 1..10
IntStream rc = IntStream.rangeClosed(1, 10); // 1..10 inclusivo

// De um array:
Stream<String> arr = Arrays.stream(new String[]{"a", "b"});`} /><h2>Operações intermediárias</h2><CodeBlock title="filter, map, sorted, distinct, limit, skip" code={`List<String> nomes = List.of("Ana", "Bruno", "Carlos", "Ana", "Bia");

List<String> r = nomes.stream()
    .filter(n -> n.length() > 3)   // mantem so quem passa
    .distinct()                    // remove duplicatas
    .sorted()                      // ordena natural
    .skip(1)                       // pula 1
    .limit(2)                      // pega no maximo 2
    .toList();

System.out.println(r); // [Bruno, Carlos]`} /><CodeBlock title="map e mapToInt para conversões" code={`List<String> palavras = List.of("Java", "e", "legal");

int totalLetras = palavras.stream()
    .mapToInt(String::length)  // vira IntStream
    .sum();

System.out.println(totalLetras); // 9`} /><CodeBlock title="peek para depurar (não use para efeitos colaterais)" code={`List.of(1, 2, 3, 4).stream()
    .peek(n -> System.out.println("antes: " + n))
    .map(n -> n * n)
    .peek(n -> System.out.println("depois: " + n))
    .toList();`} /><h2>Operações terminais</h2><CodeBlock title="As mais comuns" code={`List<Integer> nums = List.of(3, 1, 4, 1, 5, 9, 2, 6);

// Coletar:
List<Integer> dobros = nums.stream().map(n -> n * 2).toList();

// Contar:
long qtd = nums.stream().filter(n -> n > 3).count();

// Soma/min/max via IntStream:
int soma = nums.stream().mapToInt(Integer::intValue).sum();
OptionalInt min = nums.stream().mapToInt(Integer::intValue).min();

// reduce: combinar elementos num só
int produto = nums.stream().reduce(1, (a, b) -> a * b);

// Booleanos:
boolean temNegativo = nums.stream().anyMatch(n -> n < 0);
boolean todosPositivos = nums.stream().allMatch(n -> n > 0);
boolean nenhumZero = nums.stream().noneMatch(n -> n == 0);

// Achar:
Optional<Integer> primeiro = nums.stream().filter(n -> n > 4).findFirst();`} /><AlertBox type="tip" title="findFirst vs findAny">
          Em streams sequenciais os dois funcionam igual. Em streams paralelas, <code>findAny</code> pode pegar qualquer elemento (mais rápido), enquanto <code>findFirst</code> respeita a ordem do encontro (mais lento).
        </AlertBox><h2>Collectors: a usina de transformações</h2><p>
          <code>collect()</code> é o canivete suíço. Combinado com a classe <code>Collectors</code> ele faz agrupamentos, joins, partições e muito mais.
        </p><CodeBlock title="Os Collectors essenciais" code={`import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

record Pessoa(String nome, String cidade, int idade) {}

List<Pessoa> p = List.of(
    new Pessoa("Ana", "SP", 30),
    new Pessoa("Bruno", "RJ", 25),
    new Pessoa("Carla", "SP", 35),
    new Pessoa("Diego", "RJ", 28)
);

// Para Set:
Set<String> cidades = p.stream().map(Pessoa::cidade).collect(toSet());

// Para Map:
Map<String, Integer> idadePorNome = p.stream()
    .collect(toMap(Pessoa::nome, Pessoa::idade));

// Juntar strings:
String nomes = p.stream().map(Pessoa::nome).collect(joining(", ", "[", "]"));
// "[Ana, Bruno, Carla, Diego]"

// Agrupar por cidade:
Map<String, List<Pessoa>> porCidade = p.stream().collect(groupingBy(Pessoa::cidade));

// Contar quantos por cidade:
Map<String, Long> qtdPorCidade = p.stream()
    .collect(groupingBy(Pessoa::cidade, counting()));

// Somar idades por cidade:
Map<String, Integer> idadesPorCidade = p.stream()
    .collect(groupingBy(Pessoa::cidade, summingInt(Pessoa::idade)));

// Particionar (split em true/false):
Map<Boolean, List<Pessoa>> maioresEMenores = p.stream()
    .collect(partitioningBy(pe -> pe.idade() >= 30));`} /><h2>Streams paralelas</h2><p>
          Trocar <code>.stream()</code> por <code>.parallelStream()</code> faz o Java distribuir o trabalho entre os núcleos da CPU usando o ForkJoinPool comum. Soa mágico, mas tem regras.
        </p><AlertBox type="warning" title="Quando usar parallelStream">
          <ul>
            <li>Volume grande (milhares de itens, no mínimo).</li><li>Operações pesadas em CPU (parsing, cálculo) — não em I/O.</li><li>Operações sem efeitos colaterais e independentes entre si.</li><li>Fonte que divide bem (ArrayList, IntStream.range — não LinkedList).</li>
          </ul>Para listas pequenas, paralelismo adiciona overhead e fica mais lento.<strong> Meça antes de adotar.</strong>
        </AlertBox><CodeBlock title="Paralelo na prática" code={`long pares = IntStream.rangeClosed(1, 10_000_000)
    .parallel()
    .filter(n -> n % 2 == 0)
    .count();
System.out.println(pares);`} /><h2>Stream NÃO é Iterable</h2><AlertBox type="danger" title="Uma stream se consome uma vez só">
          Depois de chamar uma operação terminal, a stream "acabou". Tentar reutilizar gera <code>IllegalStateException: stream has already been operated upon</code>. Se precisa percorrer duas vezes, gere a stream de novo a partir da fonte ou materialize numa lista com <code>.toList()</code>.
        </AlertBox><CodeBlock title="Erro clássico" code={`Stream<String> s = List.of("a", "b").stream();
s.forEach(System.out::println);
s.count(); // BOOM: IllegalStateException`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Dada <code>
              List{"<Integer>"} nums = List.of(1,2,3,4,5,6,7,8,9,10)
            </code>, calcule a soma dos quadrados dos pares usando Stream em uma única pipeline.
          </li><li>
            Crie uma <code>
              List{"<String>"}
            </code> com 10 palavras. Conte quantas começam com vogal, agrupe por tamanho (<code>
              Map{"<Integer, List<String>>"}
            </code>) e gere uma string única separada por <code>" | "</code> em ordem alfabética.
          </li><li>
            Usando <code>IntStream.rangeClosed(1, 100)</code>, descubra quantos números são múltiplos de 3 ou 5 e some-os (problema clássico do Project Euler #1).
          </li>
        </ol>
      </PageContainer>
  );
}
