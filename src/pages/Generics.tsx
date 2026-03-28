import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Generics() {
  return (
    <PageContainer
      title="Generics"
      subtitle="Type parameters, bounded wildcards, classes e métodos genéricos — código reutilizável e type-safe."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Generics permitem escrever código parametrizado por tipo, evitando casts desnecessários
        e detectando erros de tipo em <strong>tempo de compilação</strong>, não em runtime.
        São amplamente usados no Collections Framework e em APIs modernas do Java.
      </p>

      <h2>1. Por que Generics?</h2>
      <CodeBlock
        language="java"
        code={`// SEM Generics — inseguro!
List lista = new ArrayList();
lista.add("Java");
lista.add(42);             // compilador deixa passar!
String s = (String) lista.get(1); // ClassCastException em runtime!

// COM Generics — seguro!
List<String> strings = new ArrayList<>();
strings.add("Java");
// strings.add(42); // ERRO DE COMPILAÇÃO! 
String s2 = strings.get(0); // sem cast necessário`}
      />

      <h2>2. Classes Genéricas</h2>
      <CodeBlock
        language="java"
        code={`// Caixa que pode conter qualquer tipo
public class Caixa<T> {           // T = Type parameter
    private T conteudo;

    public void guardar(T item) {
        this.conteudo = item;
    }

    public T pegar() {
        return conteudo;
    }

    public boolean estaVazia() {
        return conteudo == null;
    }
}

// Usando a classe genérica
Caixa<String> caixaTexto = new Caixa<>();
caixaTexto.guardar("Hello, Generics!");
String texto = caixaTexto.pegar(); // String — sem cast!

Caixa<Integer> caixaNum = new Caixa<>();
caixaNum.guardar(42);
int numero = caixaNum.pegar(); // Integer auto-unboxed

// Par genérico (dois tipos)
public class Par<A, B> {
    private final A primeiro;
    private final B segundo;

    public Par(A primeiro, B segundo) {
        this.primeiro = primeiro;
        this.segundo = segundo;
    }

    public A getPrimeiro() { return primeiro; }
    public B getSegundo() { return segundo; }

    @Override
    public String toString() {
        return "(" + primeiro + ", " + segundo + ")";
    }
}

Par<String, Integer> par = new Par<>("Java", 21);
System.out.println(par); // (Java, 21)`}
      />

      <h2>3. Métodos Genéricos</h2>
      <CodeBlock
        language="java"
        code={`// Método genérico — T é declarado antes do tipo de retorno
public static <T> T primeiroElemento(List<T> lista) {
    if (lista.isEmpty()) throw new NoSuchElementException();
    return lista.get(0);
}

public static <T extends Comparable<T>> T maximo(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

public static <T> void trocar(T[] array, int i, int j) {
    T temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

// Usando
List<String> nomes = List.of("Ana", "Bruno", "Carlos");
String primeiro = primeiroElemento(nomes); // "Ana"

System.out.println(maximo(10, 20));        // 20
System.out.println(maximo("Java", "Go"));  // "Java"`}
      />

      <h2>4. Bounded Type Parameters</h2>
      <CodeBlock
        language="java"
        code={`// <T extends Number> — T deve ser Number ou subclasse
public static <T extends Number> double somar(List<T> lista) {
    return lista.stream()
                .mapToDouble(Number::doubleValue)
                .sum();
}

somar(List.of(1, 2, 3));        // funciona: Integer extends Number
somar(List.of(1.5, 2.5, 3.0)); // funciona: Double extends Number
// somar(List.of("a", "b"));    // ERRO: String não extends Number

// Múltiplos bounds
public static <T extends Comparable<T> & Cloneable> T encontrarMin(T[] arr) {
    T min = arr[0];
    for (T e : arr) if (e.compareTo(min) < 0) min = e;
    return min;
}`}
      />

      <h2>5. Wildcards</h2>
      <CodeBlock
        language="java"
        code={`// ? wildcard — tipo desconhecido

// Upper bound — ? extends T: pode LER, não pode escrever
public static void imprimirNumeros(List<? extends Number> lista) {
    for (Number n : lista) {
        System.out.println(n.doubleValue()); // OK — ler como Number
    }
    // lista.add(42); // ERRO — não pode adicionar (tipo exato desconhecido)
}

imprimirNumeros(List.of(1, 2, 3));     // OK: Integer extends Number
imprimirNumeros(List.of(1.5, 2.5));    // OK: Double extends Number

// Lower bound — ? super T: pode ESCREVER, leitura limitada
public static void adicionarInteiros(List<? super Integer> lista) {
    lista.add(1);    // OK — Integer é subtype de ? super Integer
    lista.add(2);
}

List<Number> nums = new ArrayList<>();
adicionarInteiros(nums); // OK: Number é super de Integer`}
      />

      <AlertBox type="info" title='PECS — "Producer Extends, Consumer Super"'>
        Regra mnemônica para wildcards:
        <ul className="mb-0">
          <li><strong>? extends T</strong>: lista produz elementos (você lê dela)</li>
          <li><strong>? super T</strong>: lista consome elementos (você escreve nela)</li>
        </ul>
        Se precisa tanto ler quanto escrever, use o tipo concreto sem wildcard.
      </AlertBox>
    </PageContainer>
  );
}
