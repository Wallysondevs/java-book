import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos"
      subtitle="Escreva, compile e execute seu primeiro programa Java. Entenda a estrutura básica da linguagem."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Todo aprendizado em programação começa com o clássico "Hello, World!". Em Java, esse simples
        programa já revela muito sobre a linguagem: estrutura de classes, método main, e como o compilador
        e a JVM trabalham juntos.
      </p>

      <h2>1. Hello, World!</h2>
      <CodeBlock
        language="java"
        title="HelloWorld.java"
        code={`// Todo arquivo Java tem o mesmo nome da classe pública
public class HelloWorld {

    // O método main é o ponto de entrada de qualquer programa Java
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // Imprime com nova linha
        System.out.print("Sem quebra de linha"); // Imprime sem \n
        System.out.printf("Formatado: %s, %d anos%n", "Java", 30); // Formatado
    }
}`}
      />

      <h2>2. Compilar e Executar</h2>
      <CodeBlock
        language="bash"
        title="Terminal — compilar e rodar"
        code={`# 1. Compilar: gera HelloWorld.class (bytecode)
javac HelloWorld.java

# 2. Executar: a JVM interpreta o bytecode
java HelloWorld

# Saída:
# Hello, World!
# Sem quebra de linhaFormatado: Java, 30 anos

# Java 11+ permite rodar diretamente sem compilar explicitamente
java HelloWorld.java`}
      />

      <AlertBox type="info" title="O que acontece nos bastidores?">
        <code>javac</code> compila o código-fonte <code>.java</code> para <strong>bytecode</strong> (<code>.class</code>).
        O bytecode é independente de sistema operacional — a JVM de cada plataforma o executa.
        Isso é o "Write Once, Run Anywhere" do Java.
      </AlertBox>

      <h2>3. Estrutura de um Programa Java</h2>
      <CodeBlock
        language="java"
        title="Estrutura básica"
        code={`// 1. Declaração de pacote (opcional, mas boa prática)
package com.exemplo.app;

// 2. Imports de classes de outras bibliotecas
import java.util.Scanner;
import java.util.ArrayList;

// 3. Declaração da classe (nome = nome do arquivo)
public class NomeDaClasse {

    // 4. Atributos (campos) da classe
    private String nome;
    private int idade;

    // 5. Construtor
    public NomeDaClasse(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    // 6. Métodos
    public void apresentar() {
        System.out.println("Olá, sou " + nome + " e tenho " + idade + " anos.");
    }

    // 7. Método main — ponto de entrada
    public static void main(String[] args) {
        NomeDaClasse pessoa = new NomeDaClasse("Ana", 28);
        pessoa.apresentar();
    }
}`}
      />

      <h2>4. Leitura de Entrada do Usuário</h2>
      <CodeBlock
        language="java"
        title="Lendo dados com Scanner"
        code={`import java.util.Scanner;

public class LeituraEntrada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine();       // Lê String (linha inteira)

        System.out.print("Digite sua idade: ");
        int idade = scanner.nextInt();          // Lê inteiro

        System.out.print("Digite sua altura: ");
        double altura = scanner.nextDouble();   // Lê double

        System.out.printf("Olá %s! %d anos, %.2f m%n", nome, idade, altura);

        scanner.close(); // Sempre feche o Scanner
    }
}`}
      />

      <h2>5. Comentários em Java</h2>
      <CodeBlock
        language="java"
        title="Tipos de comentários"
        code={`// Comentário de linha — ignorado pelo compilador

/* Comentário de bloco
   pode ter múltiplas linhas */

/**
 * Comentário Javadoc — documenta classes, métodos e campos.
 * Usado para gerar documentação HTML automaticamente.
 *
 * @param nome O nome do usuário
 * @return true se o nome for válido
 */
public boolean validarNome(String nome) {
    return nome != null && !nome.isEmpty();
}`}
      />

      <h2>6. Convenções de Nomenclatura</h2>
      <CodeBlock
        language="java"
        title="Naming conventions do Java"
        code={`// Classes: PascalCase (primeira letra de cada palavra maiúscula)
public class ContaBancaria { }
public class ClienteVIP { }

// Métodos e variáveis: camelCase (primeira palavra minúscula)
String nomeCompleto = "João Silva";
int idadeDoCliente = 30;
double calcularSaldo() { return 0; }

// Constantes: SNAKE_CASE em MAIÚSCULAS
static final double TAXA_JUROS = 0.05;
static final int LIMITE_TENTATIVAS = 3;

// Pacotes: tudo minúsculo, domínio invertido
package com.empresa.projeto.modulo;

// Interfaces: PascalCase, geralmente substantivo ou adjetivo
interface Comparable { }
interface Serializable { }
interface Pagavel { }  // padrão alternativo em PT`}
      />

      <AlertBox type="warning" title="Java é case-sensitive!">
        <code>nome</code>, <code>Nome</code> e <code>NOME</code> são três variáveis completamente diferentes.
        Siga as convenções de nomenclatura — elas são seguidas por toda a comunidade Java e tornam
        o código mais legível.
      </AlertBox>

      <h2>7. Usando o JShell (REPL)</h2>
      <CodeBlock
        language="bash"
        title="JShell — teste código sem criar arquivos"
        code={`# Abrir o JShell (Java 9+)
jshell

# Dentro do JShell:
jshell> System.out.println("Hello!")
Hello!

jshell> int x = 10
x ==> 10

jshell> x * 2
$3 ==> 20

jshell> String nome = "Java"
nome ==> "Java"

jshell> nome.length()
$5 ==> 4

# Sair
jshell> /exit`}
      />
    </PageContainer>
  );
}
