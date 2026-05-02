import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Metodos() {
  return (
    <PageContainer title="Métodos" subtitle="Modular código com parâmetros, retorno, sobrecarga e varargs." difficulty="iniciante" timeToRead="18 min">
        <h2>Por que você precisa disso</h2><p>
          Método é uma receita: você dá um nome, lista os ingredientes (parâmetros) e descreve o que sai no final (retorno). Sem método, todo programa vira um <code>main</code> gigante, impossível de testar e de reaproveitar. Cada vez que você se pega copiando 5 linhas pra outro lugar, é sinal de que ali deveria ter um método.
        </p><p>
          Em Java, todo método mora dentro de uma classe — não existe função solta como em Python ou JavaScript.
        </p><h2>Sintaxe básica</h2><p>Anatomia de um método:</p><CodeBlock title="Estrutura" code={`// modificadores | tipo de retorno | nome | (parâmetros) { corpo }
public static int somar(int a, int b) {
    return a + b;
}`} /><ul>
          <li>
            <code>public</code>: visibilidade (quem pode chamar).
          </li><li>
            <code>static</code>: pertence à classe, não à instância (já vamos detalhar).
          </li><li>
            <code>int</code>: tipo do valor que devolve.
          </li><li>
            <code>somar</code>: nome — convenção camelCase, verbo de preferência.
          </li><li>
            <code>(int a, int b)</code>: parâmetros (tipo + nome).
          </li>
        </ul><CodeBlock title="Programa completo" code={`public class Calc {
    public static int somar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int r = somar(3, 4);
        System.out.println(r);  // 7
    }
}`} /><h2>void: método sem retorno</h2><p>
          Quando o método só faz alguma coisa e não devolve valor, o tipo de retorno é <code>void</code>. Você pode usar <code>return;</code> sem valor pra sair antes.
        </p><CodeBlock code={`public static void cumprimentar(String nome) {
    if (nome == null) return;  // sai cedo
    System.out.println("Olá, " + nome + "!");
}`} /><h2>return: sair com um valor</h2><p>
          Em métodos que não são <code>void</code>, todo caminho de execução precisa devolver um valor — senão, erro de compilação.
        </p><CodeBlock code={`public static String classificar(int idade) {
    if (idade < 12) return "criança";
    if (idade < 18) return "adolescente";
    return "adulto";
}`} /><h2>Sobrecarga (overloading)</h2><p>
          Você pode ter <strong>vários métodos com o mesmo nome</strong> desde que a lista de parâmetros seja diferente (quantidade ou tipos). O compilador escolhe qual chamar baseado nos argumentos. <strong>Apenas o tipo de retorno não conta</strong> pra diferenciar.
        </p><CodeBlock title="Sobrecarga de imprimir" code={`public class Imprimir {
    public static void mostrar(int x) {
        System.out.println("inteiro: " + x);
    }

    public static void mostrar(double x) {
        System.out.println("decimal: " + x);
    }

    public static void mostrar(String x) {
        System.out.println("texto: " + x);
    }

    public static void main(String[] args) {
        mostrar(10);       // inteiro: 10
        mostrar(3.14);     // decimal: 3.14
        mostrar("oi");     // texto: oi
    }
}`} /><AlertBox type="tip" title="Quando vale a pena sobrecarregar">
          Use sobrecarga quando os métodos fazem <em>conceitualmente a mesma coisa</em> com tipos diferentes. Se a lógica diverge muito, dê nomes distintos — fica mais claro.
        </AlertBox><h2>Varargs: número variável de argumentos</h2><p>
          Use <code>Tipo... nome</code> pra aceitar zero ou mais argumentos do mesmo tipo. Por dentro é um array. Só pode haver um varargs e ele tem que ser o último parâmetro.
        </p><CodeBlock code={`public static int somarTodos(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}

public static void main(String[] args) {
    System.out.println(somarTodos());           // 0
    System.out.println(somarTodos(1, 2, 3));    // 6
    System.out.println(somarTodos(10, 20));     // 30

    int[] arr = {1, 2, 3, 4};
    System.out.println(somarTodos(arr));        // 10 — pode passar array
}`} /><h2>Passagem por valor (com pegadinha de referência)</h2><p>
          Java passa parâmetros <strong>sempre por valor</strong>. Pra primitivos, o método recebe uma cópia — alterar dentro não muda fora.
        </p><CodeBlock title="Primitivo: cópia" code={`public static void dobrar(int x) {
    x = x * 2;
}

public static void main(String[] args) {
    int n = 5;
    dobrar(n);
    System.out.println(n);  // ainda 5
}`} /><p>
          Pra objetos, a "cópia" é da <strong>referência</strong>, não do objeto em si. Então o método pode <em>modificar o estado</em> do objeto apontado, mas não pode trocar a referência externa.
        </p><CodeBlock title="Objeto: estado pode mudar" code={`import java.util.ArrayList;
import java.util.List;

public static void adicionar(List<String> lista, String item) {
    lista.add(item);   // modifica o objeto original
}

public static void trocar(List<String> lista) {
    lista = new ArrayList<>();  // só altera a referência LOCAL
    lista.add("novo");
}

public static void main(String[] args) {
    List<String> nomes = new ArrayList<>();
    adicionar(nomes, "Ana");
    System.out.println(nomes);  // [Ana]

    trocar(nomes);
    System.out.println(nomes);  // [Ana] — não mudou!
}`} /><AlertBox type="note" title="Resumindo">
          Java é sempre <em>pass-by-value</em>. O que confunde é que o "valor" de uma variável de objeto é a referência (endereço). Você modifica o objeto, mas não troca quem a variável externa aponta.
        </AlertBox><h2>static vs instância</h2><p>
          <strong>Método static</strong> pertence à classe. Você chama com <code>NomeDaClasse.metodo(...)</code>, sem precisar criar objeto. Use pra utilitários puros (recebe entrada, devolve saída, sem estado).
        </p><p>
          <strong>Método de instância</strong> precisa de um objeto criado com <code>new</code>. Acessa os campos daquele objeto (<code>this.algo</code>). Use quando o comportamento depende do estado do objeto.
        </p><CodeBlock code={`public class Contador {
    private int valor = 0;

    public void incrementar() {       // de instância — mexe em this.valor
        this.valor++;
    }

    public int getValor() {
        return this.valor;
    }

    public static int dobro(int x) {  // static — não depende de instância
        return x * 2;
    }

    public static void main(String[] args) {
        Contador c = new Contador();
        c.incrementar();
        c.incrementar();
        System.out.println(c.getValor());      // 2

        System.out.println(Contador.dobro(5)); // 10 — sem criar objeto
    }
}`} /><h2>Métodos privados (encapsulamento)</h2><p>
          Marque com <code>private</code> tudo que é detalhe interno. Quem usa sua classe só vê o que é <code>public</code>. Isso te dá liberdade pra mudar a implementação sem quebrar quem depende de você.
        </p><CodeBlock code={`public class Senha {
    public boolean valida(String s) {
        return temTamanhoMinimo(s) && temNumero(s);
    }

    private boolean temTamanhoMinimo(String s) {
        return s != null && s.length() >= 8;
    }

    private boolean temNumero(String s) {
        return s.matches(".*\\\\d.*");
    }
}`} /><h2>Recursão: o método que chama a si mesmo</h2><p>
          Recursão é quando um método chama a si próprio com um problema menor, até chegar num caso base que devolve direto. O exemplo clássico é fatorial:
        </p><CodeBlock title="Fatorial recursivo" code={`public class Fatorial {
    public static long fat(int n) {
        if (n <= 1) return 1;       // caso base
        return n * fat(n - 1);      // passo recursivo
    }

    public static void main(String[] args) {
        System.out.println(fat(5));   // 120
        System.out.println(fat(10));  // 3628800
    }
}`} /><AlertBox type="warning" title="Cuidado com a pilha">
          Toda chamada recursiva ocupa um quadro na pilha. Recursão profunda demais estoura <code>StackOverflowError</code>. Pra cálculos grandes (Fibonacci de 100, por exemplo), prefira versão iterativa ou memoização.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um método <code>static int max(int a, int b)</code> que devolve o maior. Sobrecarregue pra também aceitar <code>(int a, int b, int c)</code>.
          </li><li>
            Escreva <code>static double media(double... valores)</code> usando varargs. Trate o caso de array vazio devolvendo <code>0</code>.
          </li><li>
            Implemente <code>static int fibonacci(int n)</code> em duas versões: recursiva e iterativa. Compare o tempo (use <code>System.nanoTime()</code>) pra <code>n = 35</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
