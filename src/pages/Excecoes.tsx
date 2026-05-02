import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Excecoes() {
  return (
    <PageContainer title="Exceções: visão geral" subtitle="Hierarquia Throwable, checked vs unchecked, e quando usar cada uma." difficulty="intermediario" timeToRead="18 min">
        <h2>Por que você precisa disso</h2><p>
          Programa que não trata erro é programa que cai em produção às 3 da manhã. Em Java, erros viram <strong>objetos</strong> — você consegue capturá-los, decidir o que fazer e seguir a vida. Sem isso, qualquer leitura de arquivo, requisição HTTP ou divisão por zero derruba sua aplicação inteira.
        </p><h2>A hierarquia em uma imagem mental</h2><p>
          Tudo que pode ser lançado em Java herda de <code>Throwable</code>. Abaixo dele a árvore se divide em duas famílias com personalidades muito diferentes:
        </p><ul>
          <li>
            <strong>Error</strong> — coisa séria da JVM. Você <em>não trata</em>.
          </li><li>
            <strong>Exception</strong> — problema da sua aplicação. Você trata.
          </li>
        </ul><p>
          E dentro de <code>Exception</code> existe um filho especial: <code>RuntimeException</code>. Tudo que herda dele é <em>unchecked</em> (o compilador não obriga a tratar). O resto é <em>checked</em> (o compilador obriga).
        </p><CodeBlock title="Hierarquia simplificada" code={`Throwable
├── Error                    // não trata: OutOfMemoryError, StackOverflowError
└── Exception                // CHECKED: IOException, SQLException, etc
    └── RuntimeException     // UNCHECKED: NullPointerException, IllegalArgumentException...`} /><h2>Checked: o compilador te cobra</h2><p>
          Se um método pode lançar uma checked exception, você é <strong>obrigado</strong> a uma de duas coisas: tratar com <code>try/catch</code> ou repassar declarando <code>throws</code> na assinatura. O exemplo clássico é I/O:
        </p><CodeBlock title="Checked: ou trata, ou declara" code={`import java.nio.file.*;
import java.io.IOException;

public class LeArquivo {
    // opção 1: declara throws e empurra para quem chamar
    public static String ler(String caminho) throws IOException {
        return Files.readString(Path.of(caminho));
    }

    public static void main(String[] args) {
        // opção 2: trata aqui mesmo
        try {
            String conteudo = ler("config.txt");
            System.out.println(conteudo);
        } catch (IOException e) {
            System.err.println("Falha ao ler: " + e.getMessage());
        }
    }
}`} /><h2>Unchecked: o compilador te deixa em paz</h2><p>
          Subclasses de <code>RuntimeException</code> não precisam ser declaradas nem capturadas. Elas normalmente representam <em>bug do programador</em>: você passou <code>null</code> onde não devia, índice fora do array, argumento inválido. A ideia é <strong>corrigir o código</strong>, não tapar com <code>try/catch</code>.
        </p><CodeBlock title="Unchecked: surge sem aviso prévio" code={`public class Demo {
    public static void main(String[] args) {
        String s = null;
        // NullPointerException: você está chamando método em null
        System.out.println(s.length());

        int[] nums = {1, 2, 3};
        // ArrayIndexOutOfBoundsException
        System.out.println(nums[10]);

        // IllegalArgumentException: lance você mesmo quando faz sentido
        validarIdade(-5);
    }

    static void validarIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("idade não pode ser negativa: " + idade);
        }
    }
}`} /><AlertBox type="warning" title="NullPointerException é a mais famosa">
          Em Java moderno (14+), a mensagem do NPE diz exatamente <em>qual</em> variável estava nula. Use isso a seu favor — leia a stack trace inteira antes de chutar.
        </AlertBox><h2>Error: nem encoste</h2><p>
          <code>Error</code> sinaliza problema da JVM ou ambiente: memória esgotada, stack estourada, biblioteca nativa quebrada. Capturar isso é quase sempre errado — a aplicação já está em estado instável. Deixe ela morrer e investigue a causa.
        </p><ul>
          <li>
            <code>OutOfMemoryError</code> — heap cheio. Aumente memória ou conserte vazamento.
          </li><li>
            <code>StackOverflowError</code> — recursão sem fim, geralmente.
          </li><li>
            <code>NoClassDefFoundError</code> — classe sumiu do classpath em runtime.
          </li>
        </ul><h2>Criando sua própria exception</h2><p>
          Quando o domínio do seu sistema tem erros próprios (saldo insuficiente, pedido inválido, usuário não encontrado), crie classes específicas. Isso deixa o <code>catch</code> mais expressivo e os logs mais úteis.
        </p><CodeBlock title="Exception customizada de domínio" code={`public class SaldoInsuficienteException extends RuntimeException {
    private final double saldoAtual;
    private final double tentativa;

    public SaldoInsuficienteException(double saldoAtual, double tentativa) {
        super("Saldo R$" + saldoAtual + " insuficiente para sacar R$" + tentativa);
        this.saldoAtual = saldoAtual;
        this.tentativa = tentativa;
    }

    public double getSaldoAtual() { return saldoAtual; }
    public double getTentativa() { return tentativa; }
}

class Conta {
    private double saldo = 100.0;

    public void sacar(double valor) {
        if (valor > saldo) {
            throw new SaldoInsuficienteException(saldo, valor);
        }
        saldo -= valor;
    }
}`} /><AlertBox type="tip" title="Checked ou unchecked para a sua exception?">
          Se quem chama o método consegue se recuperar de forma razoável (tentar de novo, mostrar diálogo), considere checked. Se é erro de programação ou estado inválido, use unchecked (estenda <code>RuntimeException</code>). Hoje a comunidade tende a preferir unchecked para a maioria dos casos.
        </AlertBox><h2>Estilo: o que NÃO fazer</h2><ul>
          <li>
            <strong>Engolir</strong> exception silenciosamente: <code>catch (Exception e) {"{}"}</code> é crime. Loga, no mínimo.
          </li><li>
            Capturar <code>Exception</code> ou <code>Throwable</code> "para garantir" — só faz isso no <em>topo</em> da aplicação (handler global), não no meio do código.
          </li><li>Usar exception como controle de fluxo (ex: parar um loop). É lento e ilegível.</li><li>
            Lançar mensagens vagas tipo <code>"erro"</code>. Diga <em>o quê</em> aconteceu e <em>com quais valores</em>.
          </li>
        </ul><CodeBlock title="Anti-padrão clássico — NÃO faça" code={`try {
    fazerCoisa();
} catch (Exception e) {
    // silêncio absoluto: você nunca vai saber que algo deu errado
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Idade</code> com método estático <code>validar(int)</code> que lança <code>IllegalArgumentException</code> se for menor que 0 ou maior que 150. Teste com três valores e mostre a mensagem da exception.
          </li><li>
            Escreva um programa que tenta ler o arquivo <code>"naoexiste.txt"</code> com <code>Files.readString</code>. Trate <code>IOException</code> mostrando uma mensagem amigável em vez da stack trace bruta.
          </li><li>
            Crie a exception customizada <code>EmailInvalidoException</code> (estendendo <code>RuntimeException</code>) e um método <code>cadastrar(String email)</code> que lança ela quando o email não tem <code>@</code>. Capture e mostre o email problemático.
          </li>
        </ol>
      </PageContainer>
  );
}
