import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TryCatch() {
  return (
    <PageContainer title="try / catch / finally" subtitle="Capturar, tratar e garantir limpeza." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Toda operação que toca o mundo externo (arquivo, rede, banco) pode falhar. O bloco <code>try/catch/finally</code> é a ferramenta que transforma o pânico de "deu exception" em um plano: <strong>tente</strong>, <strong>capture o problema</strong>, e <strong>limpe a bagunça</strong> no final, dê certo ou não.
        </p><h2>A sintaxe básica</h2><CodeBlock title="Forma canônica" code={`try {
    // código que pode lançar exception
} catch (TipoDaExcecao e) {
    // o que fazer quando der errado
} finally {
    // SEMPRE executa — ideal para liberar recursos
}`} /><p>
          O <code>try</code> sozinho não vale: você precisa pelo menos de um <code>catch</code> ou um <code>finally</code>. Pode ter vários <code>catch</code> e um único <code>finally</code>.
        </p><h2>Exemplo concreto</h2><CodeBlock title="Dividir dois números pedidos pelo usuário" code={`import java.util.Scanner;

public class Divisao {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            System.out.print("Numerador: ");
            int a = Integer.parseInt(sc.nextLine());
            System.out.print("Denominador: ");
            int b = Integer.parseInt(sc.nextLine());
            System.out.println("Resultado: " + (a / b));
        } catch (NumberFormatException e) {
            System.err.println("Você precisa digitar números inteiros.");
        } catch (ArithmeticException e) {
            System.err.println("Não dá pra dividir por zero.");
        } finally {
            sc.close();
            System.out.println("Programa encerrado.");
        }
    }
}`} /><h2>Ordem dos catches: do mais específico para o mais geral</h2><p>
          Se você capturar <code>Exception</code> antes de <code>IOException</code>, o segundo nunca é alcançado — e o compilador reclama. Pense numa peneira: as malhas finas vêm primeiro.
        </p><CodeBlock title="Ordem correta" code={`try {
    abrirArquivo();
} catch (FileNotFoundException e) {     // mais específico
    System.err.println("Arquivo não existe.");
} catch (IOException e) {                // mais genérico
    System.err.println("Erro de I/O: " + e.getMessage());
} catch (Exception e) {                  // último recurso
    System.err.println("Algo inesperado.");
}`} /><h2>Multi-catch: dois (ou mais) tipos no mesmo bloco</h2><p>
          Quando você trataria duas exceptions exatamente do mesmo jeito, junte com <code>|</code> (desde Java 7). Menos código duplicado.
        </p><CodeBlock title="Multi-catch" code={`try {
    processar();
} catch (IOException | SQLException e) {
    log.error("Falha externa", e);
    throw new RuntimeException("Não foi possível processar", e);
}`} /><AlertBox type="note" title="A variável e é implicitamente final no multi-catch">
          Você não pode reatribuir <code>e</code> dentro do bloco. Isso evita confusão sobre qual tipo ela tem.
        </AlertBox><h2>finally: o bloco que sempre roda</h2><p>
          O <code>finally</code> executa <strong>sempre</strong>: se o try terminou normalmente, se caiu numa exception (capturada ou não), e até se houve <code>return</code> dentro do try. É o lugar histórico para fechar conexões, arquivos e sockets.
        </p><CodeBlock title="finally roda mesmo com return" code={`public static String demo() {
    try {
        System.out.println("dentro do try");
        return "valor do try";
    } finally {
        System.out.println("finally rodou mesmo com o return!");
    }
}`} /><AlertBox type="warning" title="Não retorne de dentro do finally">
          Se você fizer <code>return</code> no finally, ele <em>sobrescreve</em> o return do try e ainda engole exceptions. É uma das piores armadilhas da linguagem. Evite.
        </AlertBox><h2>Lançando manualmente: throw</h2><p>
          <code>throw</code> dispara uma exception agora. Use quando o estado é inválido ou um invariante foi quebrado.
        </p><CodeBlock title="throw em ação" code={`public void transferir(double valor) {
    if (valor <= 0) {
        throw new IllegalArgumentException("valor deve ser positivo: " + valor);
    }
    // ...
}`} /><h2>throws: declarando que o método pode falhar</h2><p>
          Se seu método lança uma <em>checked exception</em> e você não trata, declare na assinatura. Quem chamar fica sabendo (e o compilador exige tratamento).
        </p><CodeBlock title="throws na assinatura" code={`import java.io.*;

public class Leitor {
    // declara: quem chamar precisa lidar com IOException
    public String lerLinha(String caminho) throws IOException {
        try (var br = new BufferedReader(new FileReader(caminho))) {
            return br.readLine();
        }
    }
}`} /><h2>Inspecionando a exception</h2><p>Os métodos mais úteis de qualquer Throwable:</p><ul>
          <li>
            <code>getMessage()</code> — texto descritivo curto.
          </li><li>
            <code>printStackTrace()</code> — joga a stack inteira no erro padrão (use só pra debug rápido).
          </li><li>
            <code>getCause()</code> — a exception original, quando a atual a "embrulhou".
          </li><li>
            <code>getStackTrace()</code> — array de <code>StackTraceElement</code> programaticamente.
          </li>
        </ul><h2>Chained exceptions: empacotando a causa</h2><p>
          Frequentemente você captura uma exception de baixo nível e quer relançar como algo do seu domínio, <strong>sem perder</strong> a stack original. Passe a exception original como segundo argumento — ela vira a <em>cause</em>.
        </p><CodeBlock title="Encadeando causas" code={`public Usuario buscar(long id) {
    try {
        return repositorio.findById(id);
    } catch (SQLException e) {
        throw new RuntimeException("Falha ao buscar usuário " + id, e);
    }
}`} /><p>
          Quando alguém imprimir essa exception, vai ver as duas: "RuntimeException... Caused by: SQLException..." — e o ponto exato onde o SQL quebrou.
        </p><AlertBox type="tip" title="Nunca perca a causa">
          Se você relançar sem passar a exception original, a stack trace de baixo some — e debugar vira pesadelo.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um método <code>parseIntSeguro(String s)</code> que retorna 0 quando a string não é número (capturando <code>NumberFormatException</code>) e o valor convertido caso contrário.
          </li><li>
            Crie um programa que tenta abrir um arquivo, captura <code>FileNotFoundException</code> e <code>IOException</code> separadamente, e em <code>finally</code> imprime "fim". Verifique que o finally roda nos dois casos.
          </li><li>
            Faça um método <code>cadastrar</code> que lança <code>SQLException</code>. Capture-a e relance como <code>RuntimeException</code> usando o construtor com causa. Imprima a exception resultante e veja o "Caused by" no terminal.
          </li>
        </ol>
      </PageContainer>
  );
}
