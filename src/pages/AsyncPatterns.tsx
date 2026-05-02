import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncPatterns() {
  return (
    <PageContainer title="Padrões assíncronos com Virtual Threads" subtitle="Java 21 mudou o jogo — async fica simples sem reativo." difficulty="avancado" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Por anos a gente escolhia entre dois venenos: código bloqueante simples (mas que não escala) ou código reativo (escala, mas é difícil de ler e debugar). Java 21 trouxe Virtual Threads e tirou a necessidade do trade-off para a maioria dos casos: você escreve código <strong>síncrono e legível</strong>, e a JVM faz o scheduling escalar como reativo.
        </p><h2>O passado recente</h2><ul>
          <li>
            <strong>Callback hell</strong> — listeners aninhados que viram pirâmide de chaves.
          </li><li>
            <strong>CompletableFuture</strong> — melhorou, mas ainda força você a pensar em pipelines.
          </li><li>
            <strong>Reactor / RxJava</strong> — resolve escalabilidade e backpressure, com custo alto de complexidade.
          </li>
        </ul><h2>Virtual Threads: o que muda</h2><p>
          Virtual Thread (Java 21+) é uma thread leve gerenciada pela JVM, não pelo SO. Você cria milhões delas. Quando bloqueia em I/O, a JVM "desmonta" a virtual thread da carrier (thread real) e usa a carrier para outra. Resultado: código tradicional <code>InputStream.read()</code> escala como código reativo.
        </p><CodeBlock title="Executor de virtual threads" code={`try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<String> f = exec.submit(() -> {
        Thread.sleep(1000);
        return "ok";
    });
    System.out.println(f.get());
} // close espera tudo terminar`} /><h2>Padrão fan-out / fan-in</h2><p>
          Disparar várias tarefas em paralelo e esperar todas. Antes precisava de pool cuidadoso e <code>CompletableFuture.allOf</code>. Agora:
        </p><CodeBlock title="Buscar 100 URLs em paralelo, sem suor" code={`List<String> urls = carregarUrls(); // 100 URLs

try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = urls.stream()
        .map(url -> exec.submit(() -> baixar(url)))
        .toList();

    List<String> respostas = futures.stream()
        .map(Future::resultNow) // Java 21: pega resultado já pronto
        .toList();
}`} /><h2>Structured Concurrency (preview)</h2><p>
          <code>StructuredTaskScope</code> (preview no Java 21/22) trata um grupo de tarefas como uma unidade — se uma falha, as outras são canceladas; se você sai do bloco, nada vaza.
        </p><CodeBlock title="ShutdownOnFailure: tudo ou nada" code={`try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<Usuario>  user   = scope.fork(() -> buscarUsuario(id));
    Subtask<Pedidos>  pedidos = scope.fork(() -> buscarPedidos(id));

    scope.join();              // espera ambas
    scope.throwIfFailed();     // se uma falhou, lança e cancela a outra

    return new Dashboard(user.get(), pedidos.get());
}`} /><CodeBlock title="ShutdownOnSuccess: o primeiro vence" code={`// Útil para fallback entre fontes redundantes
try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
    scope.fork(() -> chamarReplicaA());
    scope.fork(() -> chamarReplicaB());
    scope.fork(() -> chamarReplicaC());

    scope.join();
    return scope.result(); // primeiro que terminou; cancela os outros
}`} /><AlertBox type="info" title="Status preview">
          Em Java 21 e 22 está como preview (precisa de <code>--enable-preview</code>). A API pode mudar. No Java 25 LTS deve estabilizar.
        </AlertBox><h2>Rate limiting com Semaphore</h2><p>
          Virtual Threads permitem milhões de tarefas, mas a API externa pode ter limite. Use<code>Semaphore</code> para segurar o ritmo:
        </p><CodeBlock title="Máximo 10 chamadas simultâneas" code={`Semaphore limite = new Semaphore(10);

try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    for (var url : urls) {
        exec.submit(() -> {
            limite.acquire();
            try {
                return baixar(url);
            } finally {
                limite.release();
            }
        });
    }
}`} /><h2>Circuit breaker básico</h2><p>
          Padrão clássico: se o serviço externo falhou N vezes seguidas, "abre o circuito" e rejeita chamadas por algum tempo (em vez de continuar batendo num serviço caído).
        </p><CodeBlock title="Versão simplificada (sem lib)" code={`class CircuitBreaker {
    private final int limiar;
    private final Duration cooldown;
    private final AtomicInteger falhas = new AtomicInteger();
    private volatile Instant abertoAte = Instant.MIN;

    CircuitBreaker(int limiar, Duration cooldown) {
        this.limiar = limiar;
        this.cooldown = cooldown;
    }

    <T> T executar(Callable<T> acao) throws Exception {
        if (Instant.now().isBefore(abertoAte)) {
            throw new IllegalStateException("circuito aberto");
        }
        try {
            T r = acao.call();
            falhas.set(0);
            return r;
        } catch (Exception ex) {
            if (falhas.incrementAndGet() >= limiar) {
                abertoAte = Instant.now().plus(cooldown);
            }
            throw ex;
        }
    }
}`} /><p>
          Em produção, use <strong>Resilience4j</strong> — ele tem circuit breaker, retry, bulkhead, rate limiter e timeouts, todos componíveis.
        </p><h2>Quando ainda vale usar reativo</h2><ul>
          <li>
            <strong>Streaming infinito</strong> — eventos contínuos (SSE, WebSocket, Kafka), onde o modelo de "consumer pede N" se encaixa naturalmente.
          </li><li>
            <strong>Backpressure crítico</strong> — quando o consumer pode realmente afogar e você precisa do contrato.
          </li><li>
            <strong>Ecossistema reativo existente</strong> — projeto já em WebFlux + R2DBC, não faz sentido reescrever só por moda.
          </li><li>
            <strong>Composição declarativa rica</strong> — pipelines com muitos operadores (zip, merge, retryWhen, window) ficam mais limpos em Reactor.
          </li>
        </ul><AlertBox type="tip" title="Regra prática 2024+">
          Aplicação nova com Java 21? Comece com Spring MVC + Virtual Threads. Migre para WebFlux só se medir gargalo real ou tiver requisito de streaming/backpressure.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um programa que busca o tamanho de 50 páginas web em paralelo usando <code>newVirtualThreadPerTaskExecutor</code> e <code>HttpClient</code>. Imprima o tempo total e compare com a versão sequencial.
          </li><li>
            Reescreva a busca acima usando <code>StructuredTaskScope.ShutdownOnFailure</code>: se qualquer URL falhar, todas as outras são canceladas. Capture o erro e mostre qual URL caiu.
          </li><li>
            Adicione um <code>Semaphore</code> com 5 permits ao código anterior. Veja que nunca há mais de 5 conexões abertas simultaneamente — útil quando a API tem rate limit.
          </li>
        </ol>
      </PageContainer>
  );
}
