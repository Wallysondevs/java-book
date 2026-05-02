import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Interfaces() {
  return (
    <PageContainer title="Interfaces" subtitle="Contrato puro — desde Java 8 com default methods, ficou poderosa." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine que você está escrevendo uma função que ordena uma lista. Você não quer saber se os itens são pessoas, produtos ou planetas — quer apenas saber que eles sabem se comparar entre si. Em vez de pedir "me dê uma classe específica", você pede "me dê qualquer coisa que implemente <code>Comparable</code>". Isso é uma interface: um contrato. "Se você assina esse contrato, prometo que sei te tratar."
        </p><p>
          Pense numa tomada elétrica: ela não liga pra qual aparelho você plugou (geladeira, carregador, micro-ondas). Só importa que o plugue tem o formato certo. Interface é o formato do plugue. A classe que implementa é o aparelho.
        </p><h2>Sintaxe básica</h2><CodeBlock title="Definindo e implementando uma interface" code={`public interface Veiculo {
    void acelerar();
    void frear();
    int velocidadeMaxima();
}

public class Carro implements Veiculo {
    @Override
    public void acelerar() {
        System.out.println("Vrum!");
    }

    @Override
    public void frear() {
        System.out.println("Iiii!");
    }

    @Override
    public int velocidadeMaxima() {
        return 220;
    }
}`} /><p>
          Você usa <code>interface</code> no lugar de <code>class</code>, lista os métodos SEM corpo (só assinatura, terminando em <code>;</code>), e quem quiser cumprir o contrato usa <code>implements NomeDaInterface</code>.
        </p><h2>Múltipla herança de tipo</h2><p>
          Java não deixa uma classe estender duas classes (pra evitar o famoso "diamante da morte"). Mas uma classe pode implementar <strong>quantas interfaces quiser</strong>:
        </p><CodeBlock title="Várias interfaces de uma vez" code={`public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

public class Pato implements Voador, Nadador {
    @Override public void voar()  { System.out.println("Voando baixo..."); }
    @Override public void nadar() { System.out.println("Nadando tranquilo."); }
}`} /><AlertBox type="tip" title="Pense em interfaces como adjetivos">
          Classes costumam ser substantivos (<code>Pato</code>, <code>Carro</code>). Interfaces costumam ser adjetivos ou capacidades (<code>Voador</code>,<code>Comparable</code>, <code>Iterable</code>, <code>Runnable</code>). Um objeto pode ter várias capacidades ao mesmo tempo.
        </AlertBox><h2>Regras invisíveis: o que o Java assume pra você</h2><ul>
          <li>
            Todo método declarado numa interface é <code>public</code> automaticamente — você não precisa escrever a palavra.
          </li><li>
            Todo campo numa interface é <code>public static final</code> implicitamente. Ou seja: constantes públicas.
          </li><li>
            Você não pode ter campos de instância (estado por objeto). Interface não guarda estado, só comportamento.
          </li>
        </ul><CodeBlock title="Constantes implícitas" code={`public interface Config {
    int TIMEOUT = 5000;          // public static final
    String VERSAO = "1.0.0";     // public static final
}

// Uso: System.out.println(Config.TIMEOUT);`} /><h2>Default methods (Java 8+)</h2><p>
          Antes do Java 8, adicionar um método novo numa interface quebrava todas as classes que já a implementavam. Pra resolver isso, a galera do Java introduziu<strong>default methods</strong>: métodos com implementação dentro da própria interface. Se a classe não sobrescrever, herda a implementação default.
        </p><CodeBlock title="Default method" code={`public interface Saudacao {
    String nome();

    // Implementação default — opcional sobrescrever
    default String ola() {
        return "Olá, " + nome() + "!";
    }
}

public class Pessoa implements Saudacao {
    private final String nome;
    public Pessoa(String nome) { this.nome = nome; }

    @Override
    public String nome() { return nome; }
}

// new Pessoa("Maria").ola()  →  "Olá, Maria!"`} /><h2>Static methods em interface</h2><p>
          Também desde o Java 8, você pode colocar métodos <code>static</code> numa interface — normalmente utilitários relacionados ao contrato. Eles são chamados pelo nome da interface, não por instâncias.
        </p><CodeBlock title="Static method" code={`public interface Calculadora {
    int calcular(int a, int b);

    static Calculadora soma() {
        return (a, b) -> a + b;
    }
}

// Calculadora.soma().calcular(2, 3)  →  5`} /><h2>Private methods em interface (Java 9+)</h2><p>
          Quando você tem vários default methods que compartilham um pedaço de lógica, seria feio repetir esse pedaço. Java 9 trouxe métodos <code>private</code> em interface justamente pra isso: extrair lógica interna sem expô-la.
        </p><CodeBlock title="Private helper" code={`public interface Logger {
    default void info(String msg)  { log("INFO",  msg); }
    default void warn(String msg)  { log("WARN",  msg); }
    default void error(String msg) { log("ERROR", msg); }

    private void log(String nivel, String msg) {
        System.out.println("[" + nivel + "] " + msg);
    }
}`} /><h2>Functional interfaces — a base dos lambdas</h2><p>
          Uma <strong>functional interface</strong> é uma interface com exatamente <em>um</em>método abstrato. O Java permite escrever a implementação dela como uma expressão lambda, super compacta. <code>Runnable</code>, <code>Comparator</code>, <code>Function</code>são exemplos famosos.
        </p><CodeBlock title="Functional interface + lambda" code={`@FunctionalInterface
public interface Transformador {
    String aplicar(String entrada);
}

public class Demo {
    public static void main(String[] args) {
        Transformador maiusculas = s -> s.toUpperCase();
        Transformador exclamar   = s -> s + "!";

        System.out.println(maiusculas.aplicar("oi"));   // "OI"
        System.out.println(exclamar.aplicar("eba"));    // "eba!"
    }
}`} /><AlertBox type="info" title="A anotação @FunctionalInterface">
          É opcional, mas recomendada: ela faz o compilador verificar que sua interface realmente tem só um método abstrato. Se alguém adicionar um segundo, vira erro de compilação na hora — e não bug misterioso depois.
        </AlertBox><h2>Interface vs classe abstrata</h2><p>Pergunta clássica de entrevista. Diferenças práticas:</p><ul>
          <li>
            <strong>Múltipla:</strong> uma classe pode implementar várias interfaces, mas só estender UMA classe abstrata.
          </li><li>
            <strong>Estado:</strong> classe abstrata tem campos de instância normais; interface não tem (só constantes).
          </li><li>
            <strong>Construtor:</strong> classe abstrata pode ter; interface, não.
          </li><li>
            <strong>Quando usar interface:</strong> definir uma capacidade compartilhada por classes não relacionadas (<code>Comparable</code>, <code>AutoCloseable</code>).
          </li><li>
            <strong>Quando usar abstract:</strong> compartilhar código + estado entre classes que SÃO uma especialização da base.
          </li>
        </ul><p>
          Na dúvida, comece com interface. Migre pra classe abstrata só quando precisar carregar estado ou muito código comum.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie a interface <code>Tocavel</code> com método <code>tocar()</code>. Implemente<code>Violao</code> e <code>Bateria</code>. Crie um <code>
              {"List<Tocavel>"}
            </code>com instâncias dos dois e itere chamando <code>tocar()</code> em cada um.
          </li><li>
            Faça uma interface <code>Calculadora</code> com método <code>operar(int a, int b)</code>e default methods <code>dobrar(int n)</code> (chama <code>operar(n, n)</code>) e<code>zerar(int n)</code>. Implemente "Soma" e "Multiplicacao" como lambdas.
          </li><li>
            Crie duas interfaces, <code>A</code> e <code>B</code>, ambas com um default method de mesmo nome <code>metodo()</code>. Faça uma classe que implemente as duas. O compilador vai exigir que você sobrescreva. Veja o erro, corrija e entenda por que aconteceu.
          </li>
        </ol>
      </PageContainer>
  );
}
