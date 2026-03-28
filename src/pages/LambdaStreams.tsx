import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function LambdaStreams() {
  return (
    <PageContainer
      title="Lambda e Streams"
      subtitle="Programação funcional no Java 8+: lambdas, method references, Streams API e Optional."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <p>
        O Java 8 revolucionou a linguagem com lambdas e a Streams API, trazendo programação funcional
        ao Java. Agora é possível escrever código conciso, declarativo e paralelizável com facilidade.
      </p>

      <h2>1. Expressões Lambda</h2>
      <CodeBlock
        language="java"
        code={`// Lambda = função anônima — implementa interfaces funcionais
// Sintaxe: (parâmetros) -> { corpo } ou (parâmetros) -> expressão

// Interface funcional: apenas UM método abstrato
@FunctionalInterface
interface Saudacao {
    String cumprimentar(String nome);
}

// Antes do Java 8 — classe anônima verbose
Saudacao formal = new Saudacao() {
    @Override
    public String cumprimentar(String nome) {
        return "Bom dia, " + nome + "!";
    }
};

// Com lambda — muito mais conciso!
Saudacao informal = nome -> "Oi, " + nome + "!";
Saudacao formal2 = (nome) -> "Bom dia, " + nome + "!";

System.out.println(informal.cumprimentar("Ana")); // "Oi, Ana!"

// Interfaces funcionais da JDK
Runnable tarefa = () -> System.out.println("Executando!");
Comparator<String> porTamanho = (a, b) -> a.length() - b.length();
Predicate<String> ehLongo = s -> s.length() > 10;
Function<String, Integer> tamanho = String::length;   // method reference!
Consumer<String> imprimir = System.out::println;      // method reference!
Supplier<String> mensagem = () -> "Olá!";

// Usando nas coleções
List<String> nomes = Arrays.asList("Carlos", "Ana", "Beatriz", "João");
nomes.sort(porTamanho); // [Ana, João, Carlos, Beatriz]
nomes.forEach(imprimir); // imprime cada nome`}
      />

      <h2>2. Method References</h2>
      <CodeBlock
        language="java"
        code={`// Atalho para lambdas que chamam apenas um método

// 1. Método estático: Classe::metodoEstatico
Function<String, Integer> parseInt = Integer::parseInt;
// equivale a: s -> Integer.parseInt(s)

// 2. Método de instância de objeto específico
String prefixo = "Java-";
Function<String, String> adicionar = prefixo::concat;
// equivale a: s -> prefixo.concat(s)

// 3. Método de instância de tipo arbitrário
Function<String, String> maiusculas = String::toUpperCase;
// equivale a: s -> s.toUpperCase()

// 4. Construtor: Classe::new
Supplier<ArrayList<String>> criar = ArrayList::new;
// equivale a: () -> new ArrayList<String>()

// Exemplos práticos
List<String> nomes = List.of("Ana", "Bruno", "Carlos");
nomes.stream()
     .map(String::toUpperCase)     // método de instância
     .forEach(System.out::println); // método de instância de objeto específico

List<String> strings = List.of("3", "1", "4", "1", "5");
List<Integer> numeros = strings.stream()
    .map(Integer::parseInt)  // método estático
    .collect(Collectors.toList());`}
      />

      <h2>3. Streams API</h2>
      <CodeBlock
        language="java"
        code={`import java.util.stream.*;

List<String> nomes = List.of("Ana", "Bruno", "Carlos", "Beatriz", "Andre", "Camila");

// Pipeline de operações: source → intermediate ops → terminal op

// filter + map + collect
List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("A"))      // filtra: Ana, Andre
    .map(String::toUpperCase)             // transforma: ANA, ANDRE
    .sorted()                             // ordena: ANDRE, ANA
    .collect(Collectors.toList());        // coleta em List
System.out.println(resultado); // [ANDRE, ANA]

// count, findFirst, anyMatch, allMatch, noneMatch
long qtd = nomes.stream().filter(n -> n.length() > 4).count(); // 4

Optional<String> primeiro = nomes.stream()
    .filter(n -> n.contains("u"))
    .findFirst(); // Optional["Bruno"]

boolean algumB = nomes.stream().anyMatch(n -> n.startsWith("B")); // true
boolean todosGrandes = nomes.stream().allMatch(n -> n.length() > 2); // true
boolean nenhumZ = nomes.stream().noneMatch(n -> n.startsWith("Z")); // true

// reduce — combinar todos os elementos
List<Integer> nums = List.of(1, 2, 3, 4, 5);
int soma = nums.stream().reduce(0, Integer::sum); // 15
int produto = nums.stream().reduce(1, (a, b) -> a * b); // 120

// Collectors avançados
Map<Integer, List<String>> porTamanho = nomes.stream()
    .collect(Collectors.groupingBy(String::length));
// {3=[Ana], 5=[Bruno, Andre], 6=[Carlos, Camila], 7=[Beatriz]}

String unido = nomes.stream().collect(Collectors.joining(", ", "[", "]"));
// "[Ana, Bruno, Carlos, Beatriz, Andre, Camila]"

// Statistics
IntSummaryStatistics stats = nums.stream()
    .mapToInt(Integer::intValue)
    .summaryStatistics();
System.out.println(stats.getMin() + "/" + stats.getMax() + "/" + stats.getAverage());
// 1/5/3.0`}
      />

      <h2>4. Optional</h2>
      <CodeBlock
        language="java"
        code={`import java.util.Optional;

// Optional: contentor que pode ou não ter um valor (evita null)
Optional<String> vazio = Optional.empty();
Optional<String> comValor = Optional.of("Java");
Optional<String> nulavel = Optional.ofNullable(null); // não lança NPE

// Verificando
comValor.isPresent(); // true
vazio.isEmpty();      // true (Java 11+)

// Obtendo o valor
String valor = comValor.get();           // lança NoSuchElementException se vazio!
String seguro = vazio.orElse("padrão"); // "padrão" se vazio
String computado = vazio.orElseGet(() -> calcularPadrao()); // lazy
String ouLance = comValor.orElseThrow(() -> new RuntimeException("Vazio!"));

// Transformando
Optional<Integer> tamanho = comValor.map(String::length); // Optional[4]
Optional<String> maiusc = comValor.map(String::toUpperCase); // Optional["JAVA"]

// Encadeando
String resultado = Optional.ofNullable(buscarUsuario(1L))
    .map(usuario -> usuario.getEmail())
    .filter(email -> email.contains("@"))
    .orElse("email inválido");

// ifPresent — executar se presente
comValor.ifPresent(v -> System.out.println("Valor: " + v));

// ifPresentOrElse (Java 9+)
comValor.ifPresentOrElse(
    v -> System.out.println("Presente: " + v),
    () -> System.out.println("Vazio")
);`}
      />

      <ParamTable
        comando="Stream — Operações Principais"
        descricaoHelp="Operações intermediárias (lazy) e terminais (eager) da Streams API do Java 8+."
        params={[
          { flag: "filter(Predicate)", descricao: "Intermediária. Mantém apenas elementos que satisfazem o predicado.", exemplo: ".filter(n -> n > 0)" },
          { flag: "map(Function)", descricao: "Intermediária. Transforma cada elemento usando a função.", exemplo: ".map(String::toUpperCase)" },
          { flag: "flatMap(Function)", descricao: "Intermediária. Transforma e achata streams aninhados.", exemplo: ".flatMap(Collection::stream)" },
          { flag: "sorted()", descricao: "Intermediária. Ordena os elementos (ordem natural ou Comparator).", exemplo: ".sorted(Comparator.reverseOrder())" },
          { flag: "distinct()", descricao: "Intermediária. Remove duplicatas usando equals().", exemplo: ".distinct()" },
          { flag: "limit(n)", descricao: "Intermediária. Limita o stream aos primeiros n elementos.", exemplo: ".limit(5)" },
          { flag: "skip(n)", descricao: "Intermediária. Pula os primeiros n elementos.", exemplo: ".skip(2)" },
          { flag: "peek(Consumer)", descricao: "Intermediária. Executa ação em cada elemento sem modificar (útil para debug).", exemplo: ".peek(System.out::println)" },
          { flag: "collect(Collector)", descricao: "Terminal. Coleta elementos em uma coleção.", exemplo: ".collect(Collectors.toList())" },
          { flag: "forEach(Consumer)", descricao: "Terminal. Executa ação para cada elemento.", exemplo: ".forEach(System.out::println)" },
          { flag: "count()", descricao: "Terminal. Conta o número de elementos.", exemplo: ".count()" },
          { flag: "reduce(identity, BinaryOp)", descricao: "Terminal. Combina todos os elementos em um resultado.", exemplo: ".reduce(0, Integer::sum)" },
          { flag: "anyMatch/allMatch/noneMatch", descricao: "Terminal. Verifica se algum/todos/nenhum elemento satisfaz o predicado.", exemplo: ".anyMatch(n -> n > 0)" },
          { flag: "findFirst() / findAny()", descricao: "Terminal. Retorna Optional com o primeiro/qualquer elemento.", exemplo: ".findFirst()" },
        ]}
      />
    </PageContainer>
  );
}
