import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HelloWorld() {
  return (
    <PageContainer title="Hello, World! e o ciclo de compilação" subtitle="Sua primeira classe — entenda CADA linha e o que javac faz." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Em Python ou JavaScript, você escreve <code>print("oi")</code> e roda. Em Java, esse "rodar" passa por uma etapa extra que assusta no começo: a <strong>compilação</strong>. Entender esse ciclo agora vai te poupar horas de "por que meu código não atualizou?" no futuro.
        </p><p>
          Nesta página você vai escrever, compilar e executar seu primeiro programa Java na unha — sem IDE, sem mágica. Só você, o terminal e o JDK.
        </p><h2>O código</h2><p>
          Crie uma pasta vazia, abra ela no seu editor preferido e crie um arquivo chamado<strong> Hello.java</strong> (com H maiúsculo, isso importa).
        </p><CodeBlock title="Hello.java" code={`public class Hello {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}`} /><p>
          Pronto, é isso. Cinco linhas. Agora vamos dissecar cada palavra — porque cada uma tem um motivo.
        </p><h2>Palavra a palavra</h2><h3>
          <code>public class Hello</code>
        </h3><p>
          Em Java, todo código vive dentro de uma <strong>classe</strong>. Pense na classe como uma caixa que agrupa funções e dados relacionados. <code>public</code> diz que essa caixa pode ser vista por qualquer outra parte do programa. <code>Hello</code> é o nome que você escolheu.
        </p><h3>
          <code>public static void main(String[] args)</code>
        </h3><p>
          Esta linha define o <strong>ponto de entrada</strong> — onde a JVM começa a executar quando você roda o programa. É uma assinatura quase mágica: precisa ser exatamente assim, na ordem certa. Vamos quebrar:
        </p><ul>
          <li>
            <code>public</code>: a JVM (que está fora da sua classe) precisa enxergar o método.
          </li><li>
            <code>static</code>: pertence à classe, não a uma instância. Ou seja, a JVM consegue chamar sem precisar criar um objeto <code>Hello</code> antes.
          </li><li>
            <code>void</code>: o método não devolve nada. Ele só faz coisas e termina.
          </li><li>
            <code>main</code>: o nome combinado entre você e a JVM. Trocou pra <code>Main</code>ou <code>start</code>? A JVM não acha e dá erro.
          </li><li>
            <code>String[] args</code>: um array de Strings com os argumentos passados na linha de comando. Se você rodar <code>java Hello tchau bola</code>, <code>args</code> vai ter <code>["tchau", "bola"]</code>.
          </li>
        </ul><h3>
          <code>System.out.println("Olá, mundo!");</code>
        </h3><p>
          <code>System</code> é uma classe da biblioteca padrão. <code>out</code> é um objeto dentro dela que representa a saída padrão (o terminal). <code>println</code> é o método que escreve uma linha (com quebra no final). O ponto-e-vírgula no fim é<strong> obrigatório</strong> em Java — toda instrução termina com ele.
        </p><AlertBox type="tip" title="Indentação não importa pro compilador">
          Java ignora espaços em branco e quebras de linha. Mas importa MUITO pra quem lê. O padrão da comunidade é 4 espaços (não tab). Configure isso no seu editor.
        </AlertBox><h2>
          Compilando: o que <code>javac</code> faz
        </h2><p>Abra o terminal na pasta onde está o arquivo e rode:</p><CodeBlock code="javac Hello.java" /><p>
          Se nada aparecer no terminal, deu certo (Java é silencioso quando dá certo). Liste os arquivos da pasta:
        </p><CodeBlock code={`$ ls
Hello.class  Hello.java`} /><p>
          Apareceu um <code>Hello.class</code>. Esse é o <strong>bytecode</strong>: uma versão intermediária do seu código, em binário, que a JVM consegue executar. Não é código de máquina (não roda direto na CPU) e não é mais código fonte (não dá pra ler com olho humano).
        </p><AlertBox type="info" title="Por que essa etapa extra?">
          O bytecode é portável: o mesmo <code>.class</code> roda em Windows, Linux, macOS, Raspberry Pi... desde que tenha uma JVM ali. É o famoso "write once, run anywhere".
        </AlertBox><h2>Executando</h2><p>Agora rode:</p><CodeBlock code={`$ java Hello
Olá, mundo!`} /><p>
          Repare em duas coisas: você passa <code>Hello</code> (o nome da classe), <strong>não</strong><code> Hello.class</code> nem <code>Hello.java</code>. E precisa estar na pasta certa (ou configurar o classpath, mas isso é assunto pra depois).
        </p><h2>A regra do nome do arquivo</h2><p>
          Toda classe <code>public</code> precisa estar num arquivo com o <strong>mesmo nome</strong>e extensão <code>.java</code>. Se você renomear o arquivo pra <code>oi.java</code>:
        </p><CodeBlock code={`$ javac oi.java
oi.java:1: error: class Hello is public, should be declared in a file named Hello.java
public class Hello {
       ^
1 error`} /><p>
          O compilador é implacável. Mantenha sempre <strong>arquivo = nome da classe pública</strong>.
        </p><h2>Bytecode vs código fonte</h2><p>
          Quer ver o bytecode com seus próprios olhos? O JDK vem com a ferramenta<code> javap</code> que faz disassembly:
        </p><CodeBlock title="Inspecionando o .class" code="javap -c Hello" /><p>Você vai ver algo assim:</p><CodeBlock code={`Compiled from "Hello.java"
public class Hello {
  public Hello();
    Code:
       0: aload_0
       1: invokespecial #1   // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #7   // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #13  // String Olá, mundo!
       5: invokevirtual #15  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}`} /><p>
          Não precisa entender essas instruções agora. O importante é perceber: a JVM lê<em> isso</em>, não o seu <code>.java</code>. Cada operação ali (<code>getstatic</code>,<code>ldc</code>, <code>invokevirtual</code>) é um passo que a máquina virtual executa.
        </p><h2>
          Atalho moderno: <em>java sem javac</em>
        </h2><p>
          Desde o <strong>Java 11</strong>, você pode pular a compilação manual quando o programa cabe num arquivo só:
        </p><CodeBlock code={`$ java Hello.java
Olá, mundo!`} /><p>
          Repare que aqui você passa <code>Hello.java</code> (com extensão!). Por baixo, a JVM compila em memória e executa na hora. Ótimo pra scripts e prototipagem rápida. Para projetos com várias classes, você ainda vai usar o ciclo<code> javac → java</code> (ou um Maven/Gradle por cima).
        </p><AlertBox type="success" title="E desde Java 21...">
          ...você pode até omitir a classe e o método <code>main</code> em modo <em>preview</em>(Unnamed Classes & Instance Main Methods). Vamos ver isso lá no capítulo de novidades.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Modifique o programa para imprimir três linhas: seu nome, sua cidade e a data de hoje. Recompile com <code>javac</code> e rode com <code>java</code>.
          </li><li>
            Faça o programa imprimir o primeiro argumento da linha de comando. Use<code> args[0]</code>. Rode com <code>java Hello Maria</code> e veja a saída<em> Olá, Maria!</em>. O que acontece se você rodar sem passar argumento? (Spoiler: uma exceção bonita chamada <code>ArrayIndexOutOfBoundsException</code>.)
          </li><li>
            Rode <code>javap -c Hello</code> e identifique a linha do bytecode que carrega a string <em>"Olá, mundo!"</em>. Mude o texto no <code>.java</code>, recompile e rode o <code>javap</code> de novo — confirme que a string mudou no bytecode também.
          </li>
        </ol>
      </PageContainer>
  );
}
