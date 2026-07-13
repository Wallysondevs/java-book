import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"CompletableFuture",subtitle:"Async em Java 8+ — pipelines de operações que rodam fora da thread principal.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Imagine que você precisa chamar três APIs externas: uma de usuário, uma de pedidos e uma de pagamentos. Em código sequencial bloqueante, cada chamada espera a anterior — se cada uma leva 200ms, você gasta 600ms à toa. Com ",e.jsx("code",{children:"CompletableFuture"})," você dispara as três em paralelo e combina o resultado quando todas terminarem, gastando ~200ms."]}),e.jsxs("p",{children:["É a forma idiomática de fazer programação assíncrona em Java entre 8 e 20. Mesmo com Virtual Threads do Java 21, entender ",e.jsx("code",{children:"CompletableFuture"})," é obrigatório porque metade das libs do ecossistema usa ele na assinatura."]}),e.jsx("h2",{children:"O Future antigo: a dor"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"java.util.concurrent.Future"})," existe desde Java 5, mas é frustrante: a única forma de pegar o resultado é chamar ",e.jsx("code",{children:"get()"}),", que ",e.jsx("strong",{children:"bloqueia"})," a thread atual. Não dá para encadear, não dá para combinar, não dá para reagir a falhas sem try/catch grosso."]}),e.jsx(o,{title:"Future antigo (chato)",code:`ExecutorService pool = Executors.newFixedThreadPool(2);
Future<String> f = pool.submit(() -> {
    Thread.sleep(500);
    return "ok";
});
String resultado = f.get(); // BLOQUEIA aqui
System.out.println(resultado);
pool.shutdown();`}),e.jsx("h2",{children:"CompletableFuture: o que muda"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Encadear"})," operações sem bloquear (estilo Promise do JS)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Combinar"})," múltiplos futures em um só."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Completar manualmente"})," (útil para testes e callbacks legados)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tratar erros"})," dentro do pipeline."]})]}),e.jsx("h2",{children:"Criando um CompletableFuture"}),e.jsx(o,{title:"supplyAsync e runAsync",code:`ExecutorService exec = Executors.newFixedThreadPool(4);

// Retorna valor
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
    return "Olá " + Thread.currentThread().getName();
}, exec);

// Sem retorno (Runnable)
CompletableFuture<Void> cf2 = CompletableFuture.runAsync(() -> {
    System.out.println("rodando em background");
}, exec);

System.out.println(cf1.join()); // join = get sem checked exception`}),e.jsxs(a,{type:"warning",title:"Sempre passe um Executor",children:["Se você omitir o segundo argumento, o Java usa o ",e.jsx("code",{children:"ForkJoinPool.commonPool()"}),", que é compartilhado com Streams paralelas e outras libs. Em produção, isso vira gargalo invisível. Crie seu próprio pool e passe explicitamente."]}),e.jsx("h2",{children:"Encadeando: thenApply, thenAccept, thenRun"}),e.jsx(o,{title:"Três jeitos de continuar",code:`CompletableFuture.supplyAsync(() -> "joao", exec)
    .thenApply(String::toUpperCase)        // transforma: String -> String
    .thenApply(s -> "Olá, " + s)           // transforma de novo
    .thenAccept(System.out::println)       // consome: aceita o valor, retorna Void
    .thenRun(() -> System.out.println("fim")); // só roda, ignora valor`}),e.jsxs("p",{children:["Regra de bolso: ",e.jsx("code",{children:"thenApply"})," quando você quer um valor novo; ",e.jsx("code",{children:"thenAccept"})," quando só quer reagir; ",e.jsx("code",{children:"thenRun"})," quando nem precisa do valor."]}),e.jsx("h2",{children:"Composição: thenCompose e thenCombine"}),e.jsxs("p",{children:[e.jsx("code",{children:"thenCompose"})," é o ",e.jsx("em",{children:"flatMap"})," do mundo async: usado quando o próximo passo também devolve um ",e.jsx("code",{children:"CompletableFuture<T>"}),". Sem ele você ficaria com ",e.jsx("code",{children:"CompletableFuture<CompletableFuture<T>>"}),"."]}),e.jsx(o,{title:"thenCompose evita aninhamento",code:`CompletableFuture<String> buscarUsuario(long id) {
    return CompletableFuture.supplyAsync(() -> "user-" + id, exec);
}

CompletableFuture<Integer> contarPedidos(String user) {
    return CompletableFuture.supplyAsync(() -> user.length(), exec);
}

CompletableFuture<Integer> pipeline = buscarUsuario(42)
    .thenCompose(user -> contarPedidos(user)); // achata o nested future`}),e.jsxs("p",{children:[e.jsx("code",{children:"thenCombine"})," junta dois futures independentes em um único resultado:"]}),e.jsx(o,{title:"thenCombine = zip de dois",code:`CompletableFuture<Integer> preco = CompletableFuture.supplyAsync(() -> 100, exec);
CompletableFuture<Double>  taxa  = CompletableFuture.supplyAsync(() -> 0.15, exec);

CompletableFuture<Double> total = preco.thenCombine(taxa, (p, t) -> p * (1 + t));
System.out.println(total.join()); // 115.0`}),e.jsx("h2",{children:"Esperar muitos: allOf e anyOf"}),e.jsx(o,{title:"allOf espera todos; anyOf, o primeiro",code:`CompletableFuture<String> a = CompletableFuture.supplyAsync(() -> "A", exec);
CompletableFuture<String> b = CompletableFuture.supplyAsync(() -> "B", exec);
CompletableFuture<String> c = CompletableFuture.supplyAsync(() -> "C", exec);

// allOf retorna Void — você precisa pegar os valores manualmente
CompletableFuture<Void> todos = CompletableFuture.allOf(a, b, c);
todos.join();
System.out.println(a.join() + b.join() + c.join());

// anyOf devolve o primeiro que terminar (como Object)
CompletableFuture<Object> primeiro = CompletableFuture.anyOf(a, b, c);
System.out.println(primeiro.join());`}),e.jsx("h2",{children:"Tratando erros: exceptionally e handle"}),e.jsx(o,{title:"Recuperação de falhas",code:`CompletableFuture<Integer> seguro = CompletableFuture
    .supplyAsync(() -> { throw new RuntimeException("boom"); }, exec)
    .exceptionally(ex -> -1);          // só roda se houve erro

CompletableFuture<String> completo = CompletableFuture
    .supplyAsync(() -> "ok", exec)
    .handle((valor, ex) -> {           // SEMPRE roda (sucesso ou falha)
        if (ex != null) return "erro: " + ex.getMessage();
        return "valor: " + valor;
    });`}),e.jsx("h2",{children:"Timeout (Java 9+)"}),e.jsx(o,{title:"orTimeout e completeOnTimeout",code:`CompletableFuture<String> chamada = CompletableFuture
    .supplyAsync(() -> chamadaLenta(), exec)
    .orTimeout(2, TimeUnit.SECONDS)              // lança TimeoutException
    .exceptionally(ex -> "fallback");

CompletableFuture<String> outra = CompletableFuture
    .supplyAsync(() -> chamadaLenta(), exec)
    .completeOnTimeout("default", 2, TimeUnit.SECONDS); // completa silenciosamente`}),e.jsxs(a,{type:"tip",title:"Async no nome do método",children:["Variantes como ",e.jsx("code",{children:"thenApplyAsync"})," rodam o callback em outra thread (do executor). Sem o sufixo ",e.jsx("code",{children:"Async"}),", o callback pode rodar na thread que completou o future anterior — bom para latência, ruim se o callback é pesado."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie três métodos que simulam chamadas a APIs (use ",e.jsx("code",{children:"Thread.sleep"})," com tempos diferentes) retornando ",e.jsx("code",{children:"CompletableFuture<String>"}),". Use ",e.jsx("code",{children:"allOf"})," para esperar todos e imprimir os três resultados juntos. Meça o tempo total — deve ser próximo da chamada mais lenta, não a soma."]}),e.jsxs("li",{children:["Implemente um pipeline: ",e.jsx("code",{children:"buscarIdUsuario(login)"})," → ",e.jsx("code",{children:"buscarPerfil(id)"})," → ",e.jsx("code",{children:"buscarPedidos(perfil)"}),", todos retornando CompletableFuture. Use ",e.jsx("code",{children:"thenCompose"})," para encadear sem aninhar. Adicione ",e.jsx("code",{children:"orTimeout(1, SECONDS)"})," e um ",e.jsx("code",{children:"exceptionally"})," com mensagem amigável."]}),e.jsxs("li",{children:["Crie um pool fixo com 2 threads e dispare 5 ",e.jsx("code",{children:"supplyAsync"})," que dormem 1s cada. Observe que só 2 rodam por vez. Mude para ",e.jsx("code",{children:"Executors.newCachedThreadPool()"})," e veja a diferença no tempo total."]})]})]})}export{n as default};
