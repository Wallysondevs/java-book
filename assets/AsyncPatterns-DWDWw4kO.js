import{j as e}from"./index-BpXci30S.js";import{P as o,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(o,{title:"Padrões assíncronos com Virtual Threads",subtitle:"Java 21 mudou o jogo — async fica simples sem reativo.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Por anos a gente escolhia entre dois venenos: código bloqueante simples (mas que não escala) ou código reativo (escala, mas é difícil de ler e debugar). Java 21 trouxe Virtual Threads e tirou a necessidade do trade-off para a maioria dos casos: você escreve código ",e.jsx("strong",{children:"síncrono e legível"}),", e a JVM faz o scheduling escalar como reativo."]}),e.jsx("h2",{children:"O passado recente"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Callback hell"})," — listeners aninhados que viram pirâmide de chaves."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CompletableFuture"})," — melhorou, mas ainda força você a pensar em pipelines."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reactor / RxJava"})," — resolve escalabilidade e backpressure, com custo alto de complexidade."]})]}),e.jsx("h2",{children:"Virtual Threads: o que muda"}),e.jsxs("p",{children:['Virtual Thread (Java 21+) é uma thread leve gerenciada pela JVM, não pelo SO. Você cria milhões delas. Quando bloqueia em I/O, a JVM "desmonta" a virtual thread da carrier (thread real) e usa a carrier para outra. Resultado: código tradicional ',e.jsx("code",{children:"InputStream.read()"})," escala como código reativo."]}),e.jsx(a,{title:"Executor de virtual threads",code:`try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<String> f = exec.submit(() -> {
        Thread.sleep(1000);
        return "ok";
    });
    System.out.println(f.get());
} // close espera tudo terminar`}),e.jsx("h2",{children:"Padrão fan-out / fan-in"}),e.jsxs("p",{children:["Disparar várias tarefas em paralelo e esperar todas. Antes precisava de pool cuidadoso e ",e.jsx("code",{children:"CompletableFuture.allOf"}),". Agora:"]}),e.jsx(a,{title:"Buscar 100 URLs em paralelo, sem suor",code:`List<String> urls = carregarUrls(); // 100 URLs

try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = urls.stream()
        .map(url -> exec.submit(() -> baixar(url)))
        .toList();

    List<String> respostas = futures.stream()
        .map(Future::resultNow) // Java 21: pega resultado já pronto
        .toList();
}`}),e.jsx("h2",{children:"Structured Concurrency (preview)"}),e.jsxs("p",{children:[e.jsx("code",{children:"StructuredTaskScope"})," (preview no Java 21/22) trata um grupo de tarefas como uma unidade — se uma falha, as outras são canceladas; se você sai do bloco, nada vaza."]}),e.jsx(a,{title:"ShutdownOnFailure: tudo ou nada",code:`try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<Usuario>  user   = scope.fork(() -> buscarUsuario(id));
    Subtask<Pedidos>  pedidos = scope.fork(() -> buscarPedidos(id));

    scope.join();              // espera ambas
    scope.throwIfFailed();     // se uma falhou, lança e cancela a outra

    return new Dashboard(user.get(), pedidos.get());
}`}),e.jsx(a,{title:"ShutdownOnSuccess: o primeiro vence",code:`// Útil para fallback entre fontes redundantes
try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
    scope.fork(() -> chamarReplicaA());
    scope.fork(() -> chamarReplicaB());
    scope.fork(() -> chamarReplicaC());

    scope.join();
    return scope.result(); // primeiro que terminou; cancela os outros
}`}),e.jsxs(r,{type:"info",title:"Status preview",children:["Em Java 21 e 22 está como preview (precisa de ",e.jsx("code",{children:"--enable-preview"}),"). A API pode mudar. No Java 25 LTS deve estabilizar."]}),e.jsx("h2",{children:"Rate limiting com Semaphore"}),e.jsxs("p",{children:["Virtual Threads permitem milhões de tarefas, mas a API externa pode ter limite. Use",e.jsx("code",{children:"Semaphore"})," para segurar o ritmo:"]}),e.jsx(a,{title:"Máximo 10 chamadas simultâneas",code:`Semaphore limite = new Semaphore(10);

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
}`}),e.jsx("h2",{children:"Circuit breaker básico"}),e.jsx("p",{children:'Padrão clássico: se o serviço externo falhou N vezes seguidas, "abre o circuito" e rejeita chamadas por algum tempo (em vez de continuar batendo num serviço caído).'}),e.jsx(a,{title:"Versão simplificada (sem lib)",code:`class CircuitBreaker {
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
}`}),e.jsxs("p",{children:["Em produção, use ",e.jsx("strong",{children:"Resilience4j"})," — ele tem circuit breaker, retry, bulkhead, rate limiter e timeouts, todos componíveis."]}),e.jsx("h2",{children:"Quando ainda vale usar reativo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Streaming infinito"}),' — eventos contínuos (SSE, WebSocket, Kafka), onde o modelo de "consumer pede N" se encaixa naturalmente.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Backpressure crítico"})," — quando o consumer pode realmente afogar e você precisa do contrato."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ecossistema reativo existente"})," — projeto já em WebFlux + R2DBC, não faz sentido reescrever só por moda."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Composição declarativa rica"})," — pipelines com muitos operadores (zip, merge, retryWhen, window) ficam mais limpos em Reactor."]})]}),e.jsx(r,{type:"tip",title:"Regra prática 2024+",children:"Aplicação nova com Java 21? Comece com Spring MVC + Virtual Threads. Migre para WebFlux só se medir gargalo real ou tiver requisito de streaming/backpressure."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um programa que busca o tamanho de 50 páginas web em paralelo usando ",e.jsx("code",{children:"newVirtualThreadPerTaskExecutor"})," e ",e.jsx("code",{children:"HttpClient"}),". Imprima o tempo total e compare com a versão sequencial."]}),e.jsxs("li",{children:["Reescreva a busca acima usando ",e.jsx("code",{children:"StructuredTaskScope.ShutdownOnFailure"}),": se qualquer URL falhar, todas as outras são canceladas. Capture o erro e mostre qual URL caiu."]}),e.jsxs("li",{children:["Adicione um ",e.jsx("code",{children:"Semaphore"})," com 5 permits ao código anterior. Veja que nunca há mais de 5 conexões abertas simultaneamente — útil quando a API tem rate limit."]})]})]})}export{c as default};
