import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CompletableFuturePage() {
  return (
    <PageContainer title="CompletableFuture" subtitle="Async em Java 8+ — pipelines de operações que rodam fora da thread principal." difficulty="avancado" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine que você precisa chamar três APIs externas: uma de usuário, uma de pedidos e uma de pagamentos. Em código sequencial bloqueante, cada chamada espera a anterior — se cada uma leva 200ms, você gasta 600ms à toa. Com <code>CompletableFuture</code> você dispara as três em paralelo e combina o resultado quando todas terminarem, gastando ~200ms.
        </p><p>
          É a forma idiomática de fazer programação assíncrona em Java entre 8 e 20. Mesmo com Virtual Threads do Java 21, entender <code>CompletableFuture</code> é obrigatório porque metade das libs do ecossistema usa ele na assinatura.
        </p><h2>O Future antigo: a dor</h2><p>
          O <code>java.util.concurrent.Future</code> existe desde Java 5, mas é frustrante: a única forma de pegar o resultado é chamar <code>get()</code>, que <strong>bloqueia</strong> a thread atual. Não dá para encadear, não dá para combinar, não dá para reagir a falhas sem try/catch grosso.
        </p><CodeBlock title="Future antigo (chato)" code={`ExecutorService pool = Executors.newFixedThreadPool(2);
Future<String> f = pool.submit(() -> {
    Thread.sleep(500);
    return "ok";
});
String resultado = f.get(); // BLOQUEIA aqui
System.out.println(resultado);
pool.shutdown();`} /><h2>CompletableFuture: o que muda</h2><ul>
          <li>
            <strong>Encadear</strong> operações sem bloquear (estilo Promise do JS).
          </li><li>
            <strong>Combinar</strong> múltiplos futures em um só.
          </li><li>
            <strong>Completar manualmente</strong> (útil para testes e callbacks legados).
          </li><li>
            <strong>Tratar erros</strong> dentro do pipeline.
          </li>
        </ul><h2>Criando um CompletableFuture</h2><CodeBlock title="supplyAsync e runAsync" code={`ExecutorService exec = Executors.newFixedThreadPool(4);

// Retorna valor
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
    return "Olá " + Thread.currentThread().getName();
}, exec);

// Sem retorno (Runnable)
CompletableFuture<Void> cf2 = CompletableFuture.runAsync(() -> {
    System.out.println("rodando em background");
}, exec);

System.out.println(cf1.join()); // join = get sem checked exception`} /><AlertBox type="warning" title="Sempre passe um Executor">
          Se você omitir o segundo argumento, o Java usa o <code>ForkJoinPool.commonPool()</code>, que é compartilhado com Streams paralelas e outras libs. Em produção, isso vira gargalo invisível. Crie seu próprio pool e passe explicitamente.
        </AlertBox><h2>Encadeando: thenApply, thenAccept, thenRun</h2><CodeBlock title="Três jeitos de continuar" code={`CompletableFuture.supplyAsync(() -> "joao", exec)
    .thenApply(String::toUpperCase)        // transforma: String -> String
    .thenApply(s -> "Olá, " + s)           // transforma de novo
    .thenAccept(System.out::println)       // consome: aceita o valor, retorna Void
    .thenRun(() -> System.out.println("fim")); // só roda, ignora valor`} /><p>
          Regra de bolso: <code>thenApply</code> quando você quer um valor novo; <code>thenAccept</code> quando só quer reagir; <code>thenRun</code> quando nem precisa do valor.
        </p><h2>Composição: thenCompose e thenCombine</h2><p>
          <code>thenCompose</code> é o <em>flatMap</em> do mundo async: usado quando o próximo passo também devolve um <code>
            {"CompletableFuture<T>"}
          </code>. Sem ele você ficaria com <code>
            {"CompletableFuture<CompletableFuture<T>>"}
          </code>.
        </p><CodeBlock title="thenCompose evita aninhamento" code={`CompletableFuture<String> buscarUsuario(long id) {
    return CompletableFuture.supplyAsync(() -> "user-" + id, exec);
}

CompletableFuture<Integer> contarPedidos(String user) {
    return CompletableFuture.supplyAsync(() -> user.length(), exec);
}

CompletableFuture<Integer> pipeline = buscarUsuario(42)
    .thenCompose(user -> contarPedidos(user)); // achata o nested future`} /><p>
          <code>thenCombine</code> junta dois futures independentes em um único resultado:
        </p><CodeBlock title="thenCombine = zip de dois" code={`CompletableFuture<Integer> preco = CompletableFuture.supplyAsync(() -> 100, exec);
CompletableFuture<Double>  taxa  = CompletableFuture.supplyAsync(() -> 0.15, exec);

CompletableFuture<Double> total = preco.thenCombine(taxa, (p, t) -> p * (1 + t));
System.out.println(total.join()); // 115.0`} /><h2>Esperar muitos: allOf e anyOf</h2><CodeBlock title="allOf espera todos; anyOf, o primeiro" code={`CompletableFuture<String> a = CompletableFuture.supplyAsync(() -> "A", exec);
CompletableFuture<String> b = CompletableFuture.supplyAsync(() -> "B", exec);
CompletableFuture<String> c = CompletableFuture.supplyAsync(() -> "C", exec);

// allOf retorna Void — você precisa pegar os valores manualmente
CompletableFuture<Void> todos = CompletableFuture.allOf(a, b, c);
todos.join();
System.out.println(a.join() + b.join() + c.join());

// anyOf devolve o primeiro que terminar (como Object)
CompletableFuture<Object> primeiro = CompletableFuture.anyOf(a, b, c);
System.out.println(primeiro.join());`} /><h2>Tratando erros: exceptionally e handle</h2><CodeBlock title="Recuperação de falhas" code={`CompletableFuture<Integer> seguro = CompletableFuture
    .supplyAsync(() -> { throw new RuntimeException("boom"); }, exec)
    .exceptionally(ex -> -1);          // só roda se houve erro

CompletableFuture<String> completo = CompletableFuture
    .supplyAsync(() -> "ok", exec)
    .handle((valor, ex) -> {           // SEMPRE roda (sucesso ou falha)
        if (ex != null) return "erro: " + ex.getMessage();
        return "valor: " + valor;
    });`} /><h2>Timeout (Java 9+)</h2><CodeBlock title="orTimeout e completeOnTimeout" code={`CompletableFuture<String> chamada = CompletableFuture
    .supplyAsync(() -> chamadaLenta(), exec)
    .orTimeout(2, TimeUnit.SECONDS)              // lança TimeoutException
    .exceptionally(ex -> "fallback");

CompletableFuture<String> outra = CompletableFuture
    .supplyAsync(() -> chamadaLenta(), exec)
    .completeOnTimeout("default", 2, TimeUnit.SECONDS); // completa silenciosamente`} /><AlertBox type="tip" title="Async no nome do método">
          Variantes como <code>thenApplyAsync</code> rodam o callback em outra thread (do executor). Sem o sufixo <code>Async</code>, o callback pode rodar na thread que completou o future anterior — bom para latência, ruim se o callback é pesado.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie três métodos que simulam chamadas a APIs (use <code>Thread.sleep</code> com tempos diferentes) retornando <code>
              {"CompletableFuture<String>"}
            </code>. Use <code>allOf</code> para esperar todos e imprimir os três resultados juntos. Meça o tempo total — deve ser próximo da chamada mais lenta, não a soma.
          </li><li>
            Implemente um pipeline: <code>buscarIdUsuario(login)</code> → <code>buscarPerfil(id)</code> → <code>buscarPedidos(perfil)</code>, todos retornando CompletableFuture. Use <code>thenCompose</code> para encadear sem aninhar. Adicione <code>orTimeout(1, SECONDS)</code> e um <code>exceptionally</code> com mensagem amigável.
          </li><li>
            Crie um pool fixo com 2 threads e dispare 5 <code>supplyAsync</code> que dormem 1s cada. Observe que só 2 rodam por vez. Mude para <code>Executors.newCachedThreadPool()</code> e veja a diferença no tempo total.
          </li>
        </ol>
      </PageContainer>
  );
}
