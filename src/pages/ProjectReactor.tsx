import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjectReactor() {
  return (
    <PageContainer title="Project Reactor: Mono e Flux" subtitle="Lib reativa do Spring — programação reactive funcional." difficulty="avancado" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          Reactor é a implementação reativa que o Spring escolheu. Se você usa WebFlux, R2DBC, Spring Cloud Gateway ou qualquer coisa "reativa" no ecossistema Spring, você está usando Reactor. As assinaturas são todas <code>
            {"Mono<X>"}
          </code> ou <code>
            {"Flux<X>"}
          </code>.
        </p><p>
          A graça: você compõe pipelines como faz com Streams, mas sem bloquear thread, com backpressure embutido e operadores prontos para retry, timeout, paralelismo, cache, etc.
        </p><h2>Os dois tipos centrais</h2><ul>
          <li>
            <code>
              {"Mono<T>"}
            </code> — produz <strong>0 ou 1</strong> valor. Pense em "Promise". Use para um GET por id, um insert, um count.
          </li><li>
            <code>
              {"Flux<T>"}
            </code> — produz <strong>0..N</strong> valores. Pense em "Observable". Use para listagens, streaming, eventos.
          </li>
        </ul><AlertBox type="info" title="Cold por padrão">
          Os dois são <em>cold/lazy</em>: nada acontece até alguém chamar <code>subscribe()</code>. Criar um Flux não dispara nenhum trabalho.
        </AlertBox><h2>Criando Mono e Flux</h2><CodeBlock title="Fábricas mais usadas" code={`import reactor.core.publisher.*;

// Mono
Mono<String> m1 = Mono.just("oi");
Mono<String> m2 = Mono.empty();
Mono<String> m3 = Mono.error(new RuntimeException("falhou"));
Mono<String> m4 = Mono.fromCallable(() -> chamadaSincrona()); // wrap de código bloqueante
Mono<String> m5 = Mono.fromFuture(completableFuture);

// Flux
Flux<Integer> f1 = Flux.just(1, 2, 3);
Flux<String>  f2 = Flux.fromIterable(List.of("a", "b"));
Flux<Integer> f3 = Flux.range(1, 100);
Flux<Long>    f4 = Flux.interval(Duration.ofSeconds(1)); // tick a cada 1s, infinito`} /><h2>Subscrevendo (disparando o trabalho)</h2><CodeBlock title="subscribe libera o pipeline" code={`Flux.range(1, 5)
    .map(i -> i * 10)
    .subscribe(
        valor -> System.out.println("rec: " + valor),
        erro  -> System.err.println("err: " + erro),
        ()    -> System.out.println("fim")
    );`} /><h2>Operadores estilo Stream</h2><p>
          A API de transformação é parecida com Streams, mas roda em modo push e nunca bloqueia:
        </p><CodeBlock title="map, filter, flatMap, take" code={`Flux.range(1, 20)
    .filter(i -> i % 2 == 0)
    .map(i -> "num: " + i)
    .take(5)                       // só os 5 primeiros
    .collectList()                 // vira Mono<List<String>>
    .subscribe(System.out::println);`} /><p>
          <code>flatMap</code> é central: serve para "para cada item, dispare um novo publisher e mescle os resultados":
        </p><CodeBlock title="flatMap para chamadas async em sequência" code={`Flux<Long> ids = Flux.just(1L, 2L, 3L);

ids.flatMap(id -> buscarUsuario(id))   // cada id vira Mono<Usuario>, mesclado em Flux
   .subscribe(u -> System.out.println(u.nome()));`} /><h2>Combinando publishers</h2><CodeBlock title="zip, merge, concat" code={`Flux<String> nomes  = Flux.just("ana", "bia", "caio");
Flux<Integer> idades = Flux.just(30, 25, 40);

// zip: combina par a par
Flux.zip(nomes, idades, (n, i) -> n + " (" + i + ")")
    .subscribe(System.out::println);

// merge: intercala conforme chega (não preserva ordem)
Flux.merge(fluxA, fluxB);

// concat: liga em sequência (espera A terminar para começar B)
Flux.concat(fluxA, fluxB);`} /><h2>Tratando erros</h2><CodeBlock title="onErrorReturn, onErrorResume, retry" code={`Flux.just(1, 2, 0, 4)
    .map(i -> 10 / i)
    .onErrorReturn(-1)              // valor de fallback no primeiro erro
    .subscribe(System.out::println);

buscarUsuario(id)
    .onErrorResume(ex -> buscarNoCache(id))   // troca por outro publisher
    .retry(3)                                  // tenta de novo até 3 vezes
    .retryWhen(Retry.backoff(5, Duration.ofMillis(200))); // backoff exponencial`} /><h2>Schedulers: subscribeOn vs publishOn</h2><p>Quem decide em que thread o pipeline roda. Confunde todo mundo na primeira vez:</p><ul>
          <li>
            <code>subscribeOn(scheduler)</code> — afeta a fonte (de onde os dados saem). Usado uma vez no início.
          </li><li>
            <code>publishOn(scheduler)</code> — muda a thread <strong>a partir daqui</strong> para os operadores seguintes. Pode aparecer várias vezes.
          </li>
        </ul><CodeBlock title="Trocando schedulers no meio" code={`Flux.range(1, 5)
    .subscribeOn(Schedulers.boundedElastic())  // fonte roda em boundedElastic
    .map(i -> i * 2)                           // ainda em boundedElastic
    .publishOn(Schedulers.parallel())          // daqui pra frente, parallel
    .map(i -> i + 1)
    .subscribe(System.out::println);`} /><AlertBox type="tip" title="Qual scheduler usar">
          <code>Schedulers.parallel()</code> para CPU-bound; <code>Schedulers.boundedElastic()</code> para I/O bloqueante (ex: JDBC, arquivos); <code>Schedulers.immediate()</code> para testes determinísticos.
        </AlertBox><h2>Testando com StepVerifier</h2><CodeBlock title="Asserções declarativas" code={`import reactor.test.StepVerifier;

Flux<Integer> flux = Flux.just(1, 2, 3).map(i -> i * 10);

StepVerifier.create(flux)
    .expectNext(10)
    .expectNext(20)
    .expectNext(30)
    .verifyComplete();`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              {"Flux<Integer>"}
            </code> com <code>range(1, 100)</code>, filtre pares, eleve ao quadrado, pegue os 10 primeiros e some tudo (<code>reduce</code>). Imprima o resultado.
          </li><li>
            Implemente <code>
              {"Mono<Usuario> buscarUsuario(long id)"}
            </code> usando <code>fromCallable</code> com <code>Thread.sleep(200)</code>. Dispare três buscas em paralelo com <code>Flux.fromIterable + flatMap</code> e meça o tempo — deve ser ~200ms, não 600ms.
          </li><li>
            Faça uma chamada que lança erro aleatório 50% das vezes. Use <code>retry(3)</code> e depois <code>onErrorReturn("fallback")</code>. Teste com <code>StepVerifier</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
