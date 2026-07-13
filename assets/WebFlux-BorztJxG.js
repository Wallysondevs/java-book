import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(a,{title:"Spring WebFlux",subtitle:"Stack reativo do Spring — alternativa não-bloqueante ao MVC.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsx("p",{children:'Spring MVC usa o modelo "thread por requisição": cada request ocupa uma thread do Tomcat até a resposta sair. Se você tem 10 mil clientes esperando uma chamada externa lenta, são 10 mil threads dormindo — RAM e context switching demais.'}),e.jsx("p",{children:"WebFlux roda sobre Netty e troca isso por um pequeno pool de event-loop threads que nunca bloqueiam. Mil conexões podem ser servidas com 8 threads, desde que o código todo seja não-bloqueante (Reactor + R2DBC + WebClient)."}),e.jsx(r,{type:"warning",title:"Java 21 mudou o jogo",children:'Com Virtual Threads (Java 21), o Spring MVC tradicional ficou competitivo de novo: você escreve código bloqueante simples e a JVM cuida da escalabilidade. WebFlux continua valendo para streaming e backpressure crítico, mas não é mais "a única solução para alta concorrência".'}),e.jsx("h2",{children:"Quando WebFlux vale a pena"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Muita concorrência ",e.jsx("strong",{children:"I/O bound"})," (chamadas a APIs lentas, microservices)."]}),e.jsx("li",{children:"Streaming de dados (SSE, WebSocket, chunks longos)."}),e.jsx("li",{children:"Backpressure crítico (consumer mais lento que producer)."}),e.jsx("li",{children:"Você já tem um stack reativo end-to-end (R2DBC, Mongo reativo, Kafka reativo)."})]}),e.jsx("h2",{children:"Quando NÃO vale"}),e.jsxs("ul",{children:[e.jsx("li",{children:"CRUD simples com baixo tráfego — overhead de aprendizado não compensa."}),e.jsx("li",{children:"Banco de dados bloqueante (JDBC). Misturar JDBC em WebFlux destrói o benefício."}),e.jsx("li",{children:"Time sem experiência em reativo — debugar pipeline reativo é cruel."}),e.jsx("li",{children:"Java 21 disponível? Considere MVC + Virtual Threads primeiro."})]}),e.jsx("h2",{children:"Setup mínimo"}),e.jsx(o,{title:"pom.xml — só trocar a dependência",code:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>`}),e.jsx("h2",{children:"Estilo anotação: @RestController"}),e.jsxs("p",{children:["Quase igual ao MVC, só que retornando ",e.jsx("code",{children:"Mono"})," ou ",e.jsx("code",{children:"Flux"}),":"]}),e.jsx(o,{title:"UsuarioController.java",code:`@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) { this.repo = repo; }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Usuario>> buscar(@PathVariable Long id) {
        return repo.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping
    public Flux<Usuario> listar() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Usuario> criar(@RequestBody Usuario u) {
        return repo.save(u);
    }
}`}),e.jsx("h2",{children:"Estilo funcional: RouterFunction"}),e.jsx("p",{children:"Alternativa sem anotações — rotas declaradas em código:"}),e.jsx(o,{title:"RouterConfig.java",code:`@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> rotas(UsuarioHandler h) {
        return RouterFunctions.route()
            .GET("/usuarios/{id}", h::buscar)
            .GET("/usuarios", h::listar)
            .POST("/usuarios", h::criar)
            .build();
    }
}

@Component
class UsuarioHandler {
    private final UsuarioRepository repo;
    UsuarioHandler(UsuarioRepository r) { this.repo = r; }

    Mono<ServerResponse> buscar(ServerRequest req) {
        Long id = Long.valueOf(req.pathVariable("id"));
        return repo.findById(id)
            .flatMap(u -> ServerResponse.ok().bodyValue(u))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    Mono<ServerResponse> listar(ServerRequest req) {
        return ServerResponse.ok().body(repo.findAll(), Usuario.class);
    }

    Mono<ServerResponse> criar(ServerRequest req) {
        return req.bodyToMono(Usuario.class)
            .flatMap(repo::save)
            .flatMap(u -> ServerResponse.status(201).bodyValue(u));
    }
}`}),e.jsx("h2",{children:"WebClient: o substituto do RestTemplate"}),e.jsxs("p",{children:[e.jsx("code",{children:"RestTemplate"})," é bloqueante e está em maintenance mode. Em WebFlux (e cada vez mais em MVC) use ",e.jsx("code",{children:"WebClient"}),":"]}),e.jsx(o,{title:"Chamando uma API externa",code:`WebClient client = WebClient.builder()
    .baseUrl("https://api.exemplo.com")
    .build();

Mono<Cotacao> cotacao = client.get()
    .uri("/cotacao/{moeda}", "USD")
    .retrieve()
    .bodyToMono(Cotacao.class)
    .timeout(Duration.ofSeconds(2))
    .onErrorResume(ex -> Mono.just(Cotacao.padrao()));`}),e.jsx("h2",{children:"Banco reativo: R2DBC"}),e.jsx("p",{children:"JDBC é bloqueante por design. Em WebFlux você quer R2DBC (Reactive Relational Database Connectivity), que tem drivers para Postgres, MySQL e MSSQL."}),e.jsx(o,{title:"Repository reativo",code:`public interface UsuarioRepository extends ReactiveCrudRepository<Usuario, Long> {
    Flux<Usuario> findByNomeContaining(String trecho);
    Mono<Long> countByAtivoTrue();
}`}),e.jsxs(r,{type:"danger",title:"Misturar JDBC em WebFlux = bug invisível",children:["Se você chamar ",e.jsx("code",{children:"jdbcTemplate.query(...)"})," dentro de um pipeline WebFlux, vai bloquear uma das poucas threads do event loop. Em produção, isso derruba a aplicação inteira sob carga. Use sempre R2DBC, ou mude para Spring MVC."]}),e.jsx("h2",{children:"Streaming: server-sent events"}),e.jsx(o,{title:"Endpoint que stream-a a cada segundo",code:`@GetMapping(value = "/ticks", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> ticks() {
    return Flux.interval(Duration.ofSeconds(1))
        .map(i -> "tick #" + i);
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Suba um projeto Spring Boot com ",e.jsx("code",{children:"spring-boot-starter-webflux"}),". Crie um ",e.jsx("code",{children:"@RestController"})," com um GET que devolve ",e.jsx("code",{children:"Flux.range(1, 10)"})," a cada 200ms via SSE. Acesse no navegador e veja os números chegando aos poucos."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"WebClient"})," para chamar a API pública ",e.jsxs("code",{children:["https://api.github.com/users/","{login}"]}),". Mapeie a resposta para um record ",e.jsx("code",{children:"GhUser(String login, int public_repos)"}),". Adicione ",e.jsx("code",{children:"timeout"})," e fallback."]}),e.jsxs("li",{children:["Configure R2DBC com Postgres em Docker. Crie ",e.jsx("code",{children:"UsuarioRepository"})," reativo e exponha CRUD completo. Force um cenário com 500 requests simultâneos (use ",e.jsx("code",{children:"ab"})," ou ",e.jsx("code",{children:"hey"}),") e compare com o mesmo CRUD em Spring MVC + JDBC."]})]})]})}export{t as default};
