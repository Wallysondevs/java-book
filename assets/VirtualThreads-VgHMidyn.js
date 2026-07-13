import{j as e}from"./index-BpXci30S.js";import{P as o,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(o,{title:"Virtual Threads (Java 21)",subtitle:"Milhões de threads no mesmo processo — o futuro da concorrência em Java.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine um servidor web atendendo 100 mil clientes ao mesmo tempo. Com threads tradicionais (chamadas ",e.jsx("em",{children:"platform threads"}),"), cada uma custa ~1 MB de memória e é mapeada 1:1 com uma thread do sistema operacional. Resultado: você bate no teto em poucos milhares e começa a usar truques chatos como callbacks, reactive streams, async/await."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Virtual threads"})," (Java 21, JEP 444) resolvem isso: são threads gerenciadas pela JVM, baratíssimas (poucos KB), e a JVM multiplexa milhares delas em cima de um pequeno grupo de platform threads (chamadas ",e.jsx("em",{children:"carriers"}),"). Você pode criar ",e.jsx("strong",{children:"milhões"})," sem suar."]}),e.jsx(r,{type:"info",title:"A grande sacada",children:"Você continua escrevendo código bloqueante simples — mas a JVM, quando a virtual thread bloqueia em I/O, desencaixa ela do carrier e usa esse carrier pra rodar outra virtual thread. Sem callback, sem complicação."}),e.jsx("h2",{children:"Criando uma virtual thread"}),e.jsx(a,{title:"Forma curta: startVirtualThread",code:`Thread vt = Thread.startVirtualThread(() -> {
    System.out.println("Sou virtual: " + Thread.currentThread());
});
vt.join();`}),e.jsx(a,{title:"Builder: Thread.ofVirtual()",code:`Thread vt = Thread.ofVirtual()
    .name("worker-1")
    .start(() -> System.out.println("Oi"));

vt.join();

// Sem iniciar agora (factory):
Thread.Builder fabrica = Thread.ofVirtual().name("vt-", 0);
Thread t = fabrica.unstarted(() -> { /* ... */ });
t.start();`}),e.jsx("h2",{children:"Pool de virtual threads (a forma idiomática)"}),e.jsx("p",{children:"Em vez de criar manualmente, use o executor que cria uma virtual thread por tarefa. Combinado com try-with-resources fica lindo:"}),e.jsx(a,{title:"10000 requisições simuladas",code:`import java.util.concurrent.*;
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

System.out.println("Todas as 10k tarefas terminaram em ~1s");`}),e.jsxs(r,{type:"success",title:"Compare com platform threads",children:["Com ",e.jsx("code",{children:"newFixedThreadPool(200)"}),", 10000 tarefas de 1s cada levariam 50s. Com virtual threads, ~1s. E você não precisou mudar a lógica de jeito nenhum."]}),e.jsx("h2",{children:"Quando USAR virtual threads"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"I/O bound"}),": HTTP, banco de dados, leitura de arquivo, fila."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Alta concorrência"}),": milhares ou milhões de tarefas independentes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Servidores"})," (web, gRPC, mensageria) — substitui pools fixos."]}),e.jsx("li",{children:"Código legado bloqueante — você ganha escala sem reescrever em reactive."})]}),e.jsx("h2",{children:"Quando NÃO usar virtual threads"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"CPU bound"})," (cálculo pesado, criptografia, compressão): você não ganha nada — o gargalo é a CPU, não a espera. Use ",e.jsx("code",{children:"ForkJoinPool"})," ou pool fixo do tamanho dos núcleos."]}),e.jsx("li",{children:"Código que segura recursos limitados (ex: 5 conexões de banco) — não adianta ter 1 milhão de threads se só 5 conseguem trabalhar."})]}),e.jsx("h2",{children:"O problema do pinning"}),e.jsxs("p",{children:["Quando uma virtual thread está dentro de um bloco ",e.jsx("code",{children:"synchronized"})," e bloqueia (ex: em I/O), ela ",e.jsx("strong",{children:"prende"})," (pin) a carrier thread junto. Isso anula o ganho. Solução: troque ",e.jsx("code",{children:"synchronized"})," por",e.jsx("code",{children:"ReentrantLock"})," em código que pode bloquear:"]}),e.jsx(a,{title:"Antes (pode causar pinning)",code:`public synchronized void salvarLog(String msg) throws IOException {
    arquivo.write(msg); // bloqueia no I/O — segura a carrier!
}`}),e.jsx(a,{title:"Depois (sem pinning)",code:`private final ReentrantLock lock = new ReentrantLock();

public void salvarLog(String msg) throws IOException {
    lock.lock();
    try {
        arquivo.write(msg); // pode liberar a carrier
    } finally {
        lock.unlock();
    }
}`}),e.jsxs(r,{type:"tip",title:"Detectando pinning",children:["Rode com ",e.jsx("code",{children:"-Djdk.tracePinnedThreads=full"})," que a JVM imprime stack traces sempre que uma virtual thread fica presa. Em Java 24+ esse problema foi muito reduzido pela própria JVM, mas em Java 21 ainda vale a atenção."]}),e.jsx("h2",{children:"Não compartilhe ThreadLocal entre milhões de virtuais"}),e.jsxs("p",{children:[e.jsx("code",{children:"ThreadLocal"})," faz cada thread ter sua cópia. Com 1 milhão de threads, é 1 milhão de cópias. Use ",e.jsx("code",{children:"ScopedValue"})," (Java 21+, em preview) pra passar contexto sem esse custo."]}),e.jsx("h2",{children:"Structured Concurrency (preview Java 21)"}),e.jsxs("p",{children:["Outra peça do quebra-cabeça moderno é a ",e.jsx("strong",{children:"concorrência estruturada"}),": várias subtarefas tratadas como uma unidade — se uma falha, as outras são canceladas automaticamente. É preview no Java 21 (",e.jsx("code",{children:"--enable-preview"}),"):"]}),e.jsx(a,{code:`import java.util.concurrent.StructuredTaskScope;

try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var usuario  = scope.fork(() -> buscarUsuario(id));
    var pedidos  = scope.fork(() -> buscarPedidos(id));

    scope.join();           // espera ambos
    scope.throwIfFailed();  // se um falhou, propaga

    return new Dashboard(usuario.get(), pedidos.get());
}`}),e.jsx("h2",{children:'Dica final: virtual thread NÃO é "thread mais rápida"'}),e.jsxs("p",{children:["Uma virtual thread sozinha não roda mais rápido que uma platform thread. O ganho vem da ",e.jsx("strong",{children:"quantidade"})," que você pode ter ao mesmo tempo. Pra uma tarefa única, use o que for mais simples."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Crie 50000 virtual threads que dormem 2 segundos cada e imprimem o índice ao terminar. Meça o tempo total — deve ser pouco mais de 2s."}),e.jsxs("li",{children:["Faça uma função ",e.jsx("code",{children:"baixar(String url)"})," usando ",e.jsx("code",{children:"HttpClient"})," que bloqueia até receber a resposta. Dispare 100 dessas em paralelo via",e.jsx("code",{children:"newVirtualThreadPerTaskExecutor()"})," e colete todos os resultados."]}),e.jsxs("li",{children:["Reproduza o pinning: faça uma classe com método ",e.jsx("code",{children:"synchronized"})," que dorme 1s. Rode 1000 virtual threads chamando esse método. Ative",e.jsx("code",{children:"-Djdk.tracePinnedThreads=full"})," e observe os warnings. Refatore pra",e.jsx("code",{children:"ReentrantLock"})," e confirme que sumiu."]})]})]})}export{d as default};
