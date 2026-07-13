import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function l(){return e.jsxs(a,{title:"Project Reactor: Mono e Flux",subtitle:"Lib reativa do Spring — programação reactive funcional.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:['Reactor é a implementação reativa que o Spring escolheu. Se você usa WebFlux, R2DBC, Spring Cloud Gateway ou qualquer coisa "reativa" no ecossistema Spring, você está usando Reactor. As assinaturas são todas ',e.jsx("code",{children:"Mono<X>"})," ou ",e.jsx("code",{children:"Flux<X>"}),"."]}),e.jsx("p",{children:"A graça: você compõe pipelines como faz com Streams, mas sem bloquear thread, com backpressure embutido e operadores prontos para retry, timeout, paralelismo, cache, etc."}),e.jsx("h2",{children:"Os dois tipos centrais"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Mono<T>"})," — produz ",e.jsx("strong",{children:"0 ou 1"}),' valor. Pense em "Promise". Use para um GET por id, um insert, um count.']}),e.jsxs("li",{children:[e.jsx("code",{children:"Flux<T>"})," — produz ",e.jsx("strong",{children:"0..N"}),' valores. Pense em "Observable". Use para listagens, streaming, eventos.']})]}),e.jsxs(o,{type:"info",title:"Cold por padrão",children:["Os dois são ",e.jsx("em",{children:"cold/lazy"}),": nada acontece até alguém chamar ",e.jsx("code",{children:"subscribe()"}),". Criar um Flux não dispara nenhum trabalho."]}),e.jsx("h2",{children:"Criando Mono e Flux"}),e.jsx(r,{title:"Fábricas mais usadas",code:`import reactor.core.publisher.*;

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
Flux<Long>    f4 = Flux.interval(Duration.ofSeconds(1)); // tick a cada 1s, infinito`}),e.jsx("h2",{children:"Subscrevendo (disparando o trabalho)"}),e.jsx(r,{title:"subscribe libera o pipeline",code:`Flux.range(1, 5)
    .map(i -> i * 10)
    .subscribe(
        valor -> System.out.println("rec: " + valor),
        erro  -> System.err.println("err: " + erro),
        ()    -> System.out.println("fim")
    );`}),e.jsx("h2",{children:"Operadores estilo Stream"}),e.jsx("p",{children:"A API de transformação é parecida com Streams, mas roda em modo push e nunca bloqueia:"}),e.jsx(r,{title:"map, filter, flatMap, take",code:`Flux.range(1, 20)
    .filter(i -> i % 2 == 0)
    .map(i -> "num: " + i)
    .take(5)                       // só os 5 primeiros
    .collectList()                 // vira Mono<List<String>>
    .subscribe(System.out::println);`}),e.jsxs("p",{children:[e.jsx("code",{children:"flatMap"}),' é central: serve para "para cada item, dispare um novo publisher e mescle os resultados":']}),e.jsx(r,{title:"flatMap para chamadas async em sequência",code:`Flux<Long> ids = Flux.just(1L, 2L, 3L);

ids.flatMap(id -> buscarUsuario(id))   // cada id vira Mono<Usuario>, mesclado em Flux
   .subscribe(u -> System.out.println(u.nome()));`}),e.jsx("h2",{children:"Combinando publishers"}),e.jsx(r,{title:"zip, merge, concat",code:`Flux<String> nomes  = Flux.just("ana", "bia", "caio");
Flux<Integer> idades = Flux.just(30, 25, 40);

// zip: combina par a par
Flux.zip(nomes, idades, (n, i) -> n + " (" + i + ")")
    .subscribe(System.out::println);

// merge: intercala conforme chega (não preserva ordem)
Flux.merge(fluxA, fluxB);

// concat: liga em sequência (espera A terminar para começar B)
Flux.concat(fluxA, fluxB);`}),e.jsx("h2",{children:"Tratando erros"}),e.jsx(r,{title:"onErrorReturn, onErrorResume, retry",code:`Flux.just(1, 2, 0, 4)
    .map(i -> 10 / i)
    .onErrorReturn(-1)              // valor de fallback no primeiro erro
    .subscribe(System.out::println);

buscarUsuario(id)
    .onErrorResume(ex -> buscarNoCache(id))   // troca por outro publisher
    .retry(3)                                  // tenta de novo até 3 vezes
    .retryWhen(Retry.backoff(5, Duration.ofMillis(200))); // backoff exponencial`}),e.jsx("h2",{children:"Schedulers: subscribeOn vs publishOn"}),e.jsx("p",{children:"Quem decide em que thread o pipeline roda. Confunde todo mundo na primeira vez:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"subscribeOn(scheduler)"})," — afeta a fonte (de onde os dados saem). Usado uma vez no início."]}),e.jsxs("li",{children:[e.jsx("code",{children:"publishOn(scheduler)"})," — muda a thread ",e.jsx("strong",{children:"a partir daqui"})," para os operadores seguintes. Pode aparecer várias vezes."]})]}),e.jsx(r,{title:"Trocando schedulers no meio",code:`Flux.range(1, 5)
    .subscribeOn(Schedulers.boundedElastic())  // fonte roda em boundedElastic
    .map(i -> i * 2)                           // ainda em boundedElastic
    .publishOn(Schedulers.parallel())          // daqui pra frente, parallel
    .map(i -> i + 1)
    .subscribe(System.out::println);`}),e.jsxs(o,{type:"tip",title:"Qual scheduler usar",children:[e.jsx("code",{children:"Schedulers.parallel()"})," para CPU-bound; ",e.jsx("code",{children:"Schedulers.boundedElastic()"})," para I/O bloqueante (ex: JDBC, arquivos); ",e.jsx("code",{children:"Schedulers.immediate()"})," para testes determinísticos."]}),e.jsx("h2",{children:"Testando com StepVerifier"}),e.jsx(r,{title:"Asserções declarativas",code:`import reactor.test.StepVerifier;

Flux<Integer> flux = Flux.just(1, 2, 3).map(i -> i * 10);

StepVerifier.create(flux)
    .expectNext(10)
    .expectNext(20)
    .expectNext(30)
    .verifyComplete();`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"Flux<Integer>"})," com ",e.jsx("code",{children:"range(1, 100)"}),", filtre pares, eleve ao quadrado, pegue os 10 primeiros e some tudo (",e.jsx("code",{children:"reduce"}),"). Imprima o resultado."]}),e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"Mono<Usuario> buscarUsuario(long id)"})," usando ",e.jsx("code",{children:"fromCallable"})," com ",e.jsx("code",{children:"Thread.sleep(200)"}),". Dispare três buscas em paralelo com ",e.jsx("code",{children:"Flux.fromIterable + flatMap"})," e meça o tempo — deve ser ~200ms, não 600ms."]}),e.jsxs("li",{children:["Faça uma chamada que lança erro aleatório 50% das vezes. Use ",e.jsx("code",{children:"retry(3)"})," e depois ",e.jsx("code",{children:'onErrorReturn("fallback")'}),". Teste com ",e.jsx("code",{children:"StepVerifier"}),"."]})]})]})}export{l as default};
