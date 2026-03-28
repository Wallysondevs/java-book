import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Metodos() {
  return (
    <PageContainer
      title="Métodos"
      subtitle="Declaração, parâmetros, sobrecarga, recursão e passagem de parâmetros em Java."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Métodos são blocos de código reutilizável que executam uma tarefa específica.
        Eles permitem dividir programas complexos em partes menores e mais gerenciáveis,
        seguindo o princípio da responsabilidade única.
      </p>

      <h2>1. Declarando Métodos</h2>
      <CodeBlock
        language="java"
        code={`// Sintaxe: modificador tipoRetorno nomeMetodo(parâmetros) { corpo }
public class Calculadora {

    // Método com retorno
    public int somar(int a, int b) {
        return a + b;
    }

    // Método sem retorno (void)
    public void imprimir(String mensagem) {
        System.out.println(mensagem);
    }

    // Método estático — chamado sem criar objeto
    public static double calcularJuros(double capital, double taxa, int meses) {
        return capital * Math.pow(1 + taxa, meses);
    }

    // Retorno antecipado com return
    public String classificar(int nota) {
        if (nota >= 90) return "A";
        if (nota >= 80) return "B";
        if (nota >= 70) return "C";
        return "Reprovado"; // return obrigatório em todos os caminhos!
    }
}`}
      />

      <h2>2. Parâmetros e Argumentos</h2>
      <CodeBlock
        language="java"
        code={`// Java é SEMPRE passagem por valor!
// Para primitivos: copia o valor
// Para objetos: copia a referência (mas não o objeto)

public static void incrementar(int x) {
    x = x + 1; // modifica apenas a cópia local
}

int valor = 10;
incrementar(valor);
System.out.println(valor); // ainda 10!

// Para modificar o objeto em si, você modifica através da referência
public static void adicionarItem(List<String> lista, String item) {
    lista.add(item); // modifica o objeto apontado pela referência
}

List<String> frutas = new ArrayList<>(Arrays.asList("maçã"));
adicionarItem(frutas, "banana");
System.out.println(frutas); // [maçã, banana] — modificado!`}
      />

      <h2>3. Varargs (Parâmetros Variáveis)</h2>
      <CodeBlock
        language="java"
        code={`// Varargs: aceita 0 ou mais argumentos do mesmo tipo
public static int somar(int... numeros) {  // int... = array de int
    int total = 0;
    for (int n : numeros) total += n;
    return total;
}

System.out.println(somar());           // 0
System.out.println(somar(5));          // 5
System.out.println(somar(1, 2, 3));    // 6
System.out.println(somar(1, 2, 3, 4, 5)); // 15

// Varargs deve ser o ÚLTIMO parâmetro
public static String formatar(String prefixo, String... valores) {
    return prefixo + String.join(", ", valores);
}
System.out.println(formatar("Frutas: ", "maçã", "banana", "laranja"));`}
      />

      <h2>4. Sobrecarga (Method Overloading)</h2>
      <CodeBlock
        language="java"
        code={`// Mesmo nome de método, parâmetros diferentes
public class Impressora {

    public void imprimir(int n) {
        System.out.println("Inteiro: " + n);
    }

    public void imprimir(double d) {
        System.out.println("Double: " + d);
    }

    public void imprimir(String s) {
        System.out.println("String: " + s);
    }

    public void imprimir(int a, int b) {
        System.out.println("Dois inteiros: " + a + " e " + b);
    }
}

Impressora p = new Impressora();
p.imprimir(42);          // "Inteiro: 42"
p.imprimir(3.14);        // "Double: 3.14"
p.imprimir("Olá");       // "String: Olá"
p.imprimir(1, 2);        // "Dois inteiros: 1 e 2"`}
      />

      <h2>5. Recursão</h2>
      <CodeBlock
        language="java"
        code={`// Método que chama a si mesmo
// OBRIGATÓRIO: caso base para evitar StackOverflowError

// Fatorial
public static long fatorial(int n) {
    if (n <= 1) return 1;           // caso base
    return n * fatorial(n - 1);    // chamada recursiva
}
System.out.println(fatorial(5)); // 120

// Fibonacci
public static int fibonacci(int n) {
    if (n <= 1) return n;           // casos base: fib(0)=0, fib(1)=1
    return fibonacci(n - 1) + fibonacci(n - 2);
}
System.out.println(fibonacci(10)); // 55

// Busca binária recursiva
public static int buscaBinaria(int[] arr, int alvo, int esq, int dir) {
    if (esq > dir) return -1;         // não encontrado
    int meio = (esq + dir) / 2;
    if (arr[meio] == alvo) return meio;
    if (arr[meio] < alvo) return buscaBinaria(arr, alvo, meio + 1, dir);
    return buscaBinaria(arr, alvo, esq, meio - 1);
}`}
      />

      <AlertBox type="warning" title="Cuidado com recursão profunda!">
        Java tem um limite de profundidade de chamadas (stack). Para fatorial de números grandes,
        prefira a versão iterativa ou use <strong>tail recursion</strong>. Para Fibonacci, use
        memoization ou programação dinâmica — a versão recursiva ingênua tem complexidade O(2ⁿ).
      </AlertBox>
    </PageContainer>
  );
}
