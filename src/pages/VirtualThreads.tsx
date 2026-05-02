import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VirtualThreads() {
  return (
    <PageContainer title="Virtual Threads (Java 21)" subtitle="Milhões de threads no mesmo processo — o futuro da concorrência em Java." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine um servidor web atendendo 100 mil clientes ao mesmo tempo. Com threads tradicionais (chamadas <em>platform threads</em>), cada uma custa ~1 MB de memória e é mapeada 1:1 com uma thread do sistema operacional. Resultado: você bate no teto em poucos milhares e começa a usar truques chatos como callbacks, reactive streams, async/await.
        </p><p>
          <strong>Virtual threads</strong> (Java 21, JEP 444) resolvem isso: são threads gerenciadas pela JVM, baratíssimas (poucos KB), e a JVM multiplexa milhares delas em cima de um pequeno grupo de platform threads (chamadas <em>carriers</em>). Você pode criar <strong>milhões</strong> sem suar.
        </p><AlertBox type="info" title="A grande sacada">
          Você continua escrevendo código bloqueante simples — mas a JVM, quando a virtual thread bloqueia em I/O, desencaixa ela do carrier e usa esse carrier pra rodar outra virtual thread. Sem callback, sem complicação.
        </AlertBox><h2>Criando uma virtual thread</h2><CodeBlock title="Forma curta: startVirtualThread" code={`Thread vt = Thread.startVirtualThread(() -> {
    System.out.println("Sou virtual: " + Thread.currentThread());
});
vt.join();`} /><CodeBlock title="Builder: Thread.ofVirtual()" code={`Thread vt = Thread.ofVirtual()
    .name("worker-1")
    .start(() -> System.out.println("Oi"));

vt.join();

// Sem iniciar agora (factory):
Thread.Builder fabrica = Thread.ofVirtual().name("vt-", 0);
Thread t = fabrica.unstarted(() -> { /* ... */ });
t.start();`} /><h2>Pool de virtual threads (a forma idiomática)</h2><p>
          Em vez de criar manualmente, use o executor que cria uma virtual thread por tarefa. Combinado com try-with-resources fica lindo:
        </p><CodeBlock title="10000 requisições simuladas" code={`import java.util.concurrent.*;
import java.time.Duration;

try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        int id = i;
        pool.submit(() -> {
            // simulando uma chamada HTTP
            try { Thread.sleep(Duration.ofSeconds(1)); } catch (Exception e) {}
            return id;
        });
    }
} // espera todas terminarem

System.out.println("Todas as 10k tarefas terminaram em ~1s");`} /><AlertBox type="success" title="Compare com platform threads">
          Com <code>newFixedThreadPool(200)</code>, 10000 tarefas de 1s cada levariam 50s. Com virtual threads, ~1s. E você não precisou mudar a lógica de jeito nenhum.
        </AlertBox><h2>Quando USAR virtual threads</h2><ul>
          <li>
            <strong>I/O bound</strong>: HTTP, banco de dados, leitura de arquivo, fila.
          </li><li>
            <strong>Alta concorrência</strong>: milhares ou milhões de tarefas independentes.
          </li><li>
            <strong>Servidores</strong> (web, gRPC, mensageria) — substitui pools fixos.
          </li><li>Código legado bloqueante — você ganha escala sem reescrever em reactive.</li>
        </ul><h2>Quando NÃO usar virtual threads</h2><ul>
          <li>
            <strong>CPU bound</strong> (cálculo pesado, criptografia, compressão): você não ganha nada — o gargalo é a CPU, não a espera. Use <code>ForkJoinPool</code> ou pool fixo do tamanho dos núcleos.
          </li><li>
            Código que segura recursos limitados (ex: 5 conexões de banco) — não adianta ter 1 milhão de threads se só 5 conseguem trabalhar.
          </li>
        </ul><h2>O problema do pinning</h2><p>
          Quando uma virtual thread está dentro de um bloco <code>synchronized</code> e bloqueia (ex: em I/O), ela <strong>prende</strong> (pin) a carrier thread junto. Isso anula o ganho. Solução: troque <code>synchronized</code> por<code>ReentrantLock</code> em código que pode bloquear:
        </p><CodeBlock title="Antes (pode causar pinning)" code={`public synchronized void salvarLog(String msg) throws IOException {
    arquivo.write(msg); // bloqueia no I/O — segura a carrier!
}`} /><CodeBlock title="Depois (sem pinning)" code={`private final ReentrantLock lock = new ReentrantLock();

public void salvarLog(String msg) throws IOException {
    lock.lock();
    try {
        arquivo.write(msg); // pode liberar a carrier
    } finally {
        lock.unlock();
    }
}`} /><AlertBox type="tip" title="Detectando pinning">
          Rode com <code>-Djdk.tracePinnedThreads=full</code> que a JVM imprime stack traces sempre que uma virtual thread fica presa. Em Java 24+ esse problema foi muito reduzido pela própria JVM, mas em Java 21 ainda vale a atenção.
        </AlertBox><h2>Não compartilhe ThreadLocal entre milhões de virtuais</h2><p>
          <code>ThreadLocal</code> faz cada thread ter sua cópia. Com 1 milhão de threads, é 1 milhão de cópias. Use <code>ScopedValue</code> (Java 21+, em preview) pra passar contexto sem esse custo.
        </p><h2>Structured Concurrency (preview Java 21)</h2><p>
          Outra peça do quebra-cabeça moderno é a <strong>concorrência estruturada</strong>: várias subtarefas tratadas como uma unidade — se uma falha, as outras são canceladas automaticamente. É preview no Java 21 (<code>--enable-preview</code>):
        </p><CodeBlock code={`import java.util.concurrent.StructuredTaskScope;

try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var usuario  = scope.fork(() -> buscarUsuario(id));
    var pedidos  = scope.fork(() -> buscarPedidos(id));

    scope.join();           // espera ambos
    scope.throwIfFailed();  // se um falhou, propaga

    return new Dashboard(usuario.get(), pedidos.get());
}`} /><h2>Dica final: virtual thread NÃO é "thread mais rápida"</h2><p>
          Uma virtual thread sozinha não roda mais rápido que uma platform thread. O ganho vem da <strong>quantidade</strong> que você pode ter ao mesmo tempo. Pra uma tarefa única, use o que for mais simples.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie 50000 virtual threads que dormem 2 segundos cada e imprimem o índice ao terminar. Meça o tempo total — deve ser pouco mais de 2s.
          </li><li>
            Faça uma função <code>baixar(String url)</code> usando <code>HttpClient</code> que bloqueia até receber a resposta. Dispare 100 dessas em paralelo via<code>newVirtualThreadPerTaskExecutor()</code> e colete todos os resultados.
          </li><li>
            Reproduza o pinning: faça uma classe com método <code>synchronized</code> que dorme 1s. Rode 1000 virtual threads chamando esse método. Ative<code>-Djdk.tracePinnedThreads=full</code> e observe os warnings. Refatore pra<code>ReentrantLock</code> e confirme que sumiu.
          </li>
        </ol>
      </PageContainer>
  );
}
