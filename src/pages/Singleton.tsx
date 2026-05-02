import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Singleton() {
  return (
    <PageContainer title="Singleton" subtitle="Uma instância única — fácil de errar, fácil de abusar." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Existem objetos que <strong>não fazem sentido existir em duplicata</strong> no sistema: o logger global, um cache em memória compartilhado, a configuração lida do <code>application.properties</code>, um pool de conexões. Criar 5 instâncias diferentes de cache = 5 caches inconsistentes. O Singleton garante que existe uma e apenas uma.
        </p><p>
          Spoiler: na prática moderna você raramente <em>escreve</em> um Singleton à mão. Você deixa o Spring (ou Guice, ou CDI) gerenciar isso. Mas você precisa entender o padrão pra debugar bibliotecas e pra entrevista.
        </p><h2>Quando faz sentido (de verdade)</h2><ul>
          <li>Logger global da aplicação.</li><li>Cache compartilhado em memória.</li><li>Pool de conexões com banco.</li><li>Configuração imutável carregada uma vez.</li>
        </ul><p>
          Note: <strong>raro</strong>. Se você está pensando em Singleton pra evitar passar um parâmetro, está errado — isso é variável global disfarçada.
        </p><h2>Implementação 1: Lazy com synchronized (clássica)</h2><CodeBlock title="Logger.java" code={`public class Logger {
    private static Logger instancia;

    private Logger() {} // construtor privado!

    public static synchronized Logger getInstancia() {
        if (instancia == null) {
            instancia = new Logger();
        }
        return instancia;
    }

    public void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

// uso
Logger.getInstancia().log("aplicacao iniciada");`} /><p>
          Funciona, mas <code>synchronized</code> trava o método inteiro toda chamada — só precisa travar na primeira (durante a criação). Em código quente, isso pesa.
        </p><h2>Implementação 2: Double-checked locking</h2><CodeBlock title="Logger.java — versão otimizada" code={`public class Logger {
    private static volatile Logger instancia;

    private Logger() {}

    public static Logger getInstancia() {
        if (instancia == null) {              // primeiro check (sem lock)
            synchronized (Logger.class) {
                if (instancia == null) {      // segundo check (com lock)
                    instancia = new Logger();
                }
            }
        }
        return instancia;
    }
}`} /><AlertBox type="warning" title="O volatile é OBRIGATÓRIO">
          Sem <code>volatile</code>, outra thread pode ver uma referência "meio construída" do objeto por causa de reordenação de instruções. Esse foi um bug clássico pré-Java 5.
        </AlertBox><h2>Implementação 3: Bill Pugh (inner static class)</h2><p>
          A JVM garante que classes só são carregadas quando referenciadas pela primeira vez, e o carregamento é thread-safe nativamente. Use isso a seu favor:
        </p><CodeBlock title="Lazy + thread-safe sem synchronized" code={`public class Logger {
    private Logger() {}

    private static class Holder {
        private static final Logger INSTANCIA = new Logger();
    }

    public static Logger getInstancia() {
        return Holder.INSTANCIA;
    }
}`} /><p>
          Elegante: lazy, thread-safe, zero <code>synchronized</code>. Foi a "melhor" forma por anos.
        </p><h2>Implementação 4: ENUM (a recomendada)</h2><p>
          Joshua Bloch, no <em>Effective Java</em>, recomenda <strong>enum</strong> como o Singleton ideal. Por quê?
        </p><ul>
          <li>Thread-safe de graça (a JVM cuida).</li><li>Imune a serialização quebrar a unicidade.</li><li>
            Imune a reflexão (<code>setAccessible(true)</code> no construtor) quebrar.
          </li><li>3 linhas.</li>
        </ul><CodeBlock title="Configuracao.java — Singleton enum" code={`public enum Configuracao {
    INSTANCIA;

    private final String urlApi = "https://api.exemplo.com";
    private final int timeoutSegundos = 30;

    public String getUrlApi() { return urlApi; }
    public int getTimeoutSegundos() { return timeoutSegundos; }
}

// uso
String url = Configuracao.INSTANCIA.getUrlApi();
int t = Configuracao.INSTANCIA.getTimeoutSegundos();`} /><h2>Por que Singleton dificulta teste</h2><p>
          Imagine testar um <code>PedidoService</code> que internamente chama<code> Logger.getInstancia().log(...)</code>. Como você troca esse logger por um mock? Não dá facilmente — está hardcoded. Singleton vira <strong>acoplamento global</strong>: toda classe que usa fica amarrada nele.
        </p><CodeBlock title="O problema do teste" code={`public class PedidoService {
    public void salvar(Pedido p) {
        Logger.getInstancia().log("salvando " + p);  // como mockar isso?
        // ...
    }
}`} /><h2>A alternativa moderna: injeção de dependência</h2><p>
          Em vez de cada classe pegar o Singleton, você <strong>recebe a dependência no construtor</strong>. O Spring (ou similar) cria <em>uma única instância</em> do bean e injeta em quem precisa. Você ganha:
        </p><ul>
          <li>Unicidade (escopo singleton do Spring).</li><li>Testabilidade (passa um mock no construtor).</li><li>Sem código boilerplate de Singleton.</li>
        </ul><CodeBlock title="DI no lugar do Singleton" code={`@Service
public class PedidoService {
    private final Logger logger;

    public PedidoService(Logger logger) {  // Spring injeta o singleton
        this.logger = logger;
    }

    public void salvar(Pedido p) {
        logger.log("salvando " + p);  // facilmente mockavel no teste
    }
}`} /><AlertBox type="tip" title="Resumo prático">
          <p>
            Se precisar escrever Singleton à mão: use <strong>enum</strong>.
          </p><p>
            Se está num projeto Spring: <strong>não escreva Singleton</strong>, use <code>@Component</code>/<code>@Service</code> e injete.
          </p>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Implemente um <code>ContadorAcessos</code> como Singleton enum, com método<code> incrementar()</code> e <code>getTotal()</code>. Chame de várias threads (<code>Thread.start()</code>) e veja se conta certo.
          </li><li>
            Pegue a versão "Bill Pugh" e converta para enum. Compare quantas linhas sumiram.
          </li><li>
            Procure no código de algum projeto seu (ou da JDK) classes com<code> getInstance()</code>. Identifique se realmente precisam ser Singleton ou se foi over-engineering.
          </li>
        </ol>
      </PageContainer>
  );
}
