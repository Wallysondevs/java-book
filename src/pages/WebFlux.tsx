import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WebFlux() {
  return (
    <PageContainer title="Spring WebFlux" subtitle="Stack reativo do Spring — alternativa não-bloqueante ao MVC." difficulty="avancado" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Spring MVC usa o modelo "thread por requisição": cada request ocupa uma thread do Tomcat até a resposta sair. Se você tem 10 mil clientes esperando uma chamada externa lenta, são 10 mil threads dormindo — RAM e context switching demais.
        </p><p>
          WebFlux roda sobre Netty e troca isso por um pequeno pool de event-loop threads que nunca bloqueiam. Mil conexões podem ser servidas com 8 threads, desde que o código todo seja não-bloqueante (Reactor + R2DBC + WebClient).
        </p><AlertBox type="warning" title="Java 21 mudou o jogo">
          Com Virtual Threads (Java 21), o Spring MVC tradicional ficou competitivo de novo: você escreve código bloqueante simples e a JVM cuida da escalabilidade. WebFlux continua valendo para streaming e backpressure crítico, mas não é mais "a única solução para alta concorrência".
        </AlertBox><h2>Quando WebFlux vale a pena</h2><ul>
          <li>
            Muita concorrência <strong>I/O bound</strong> (chamadas a APIs lentas, microservices).
          </li><li>Streaming de dados (SSE, WebSocket, chunks longos).</li><li>Backpressure crítico (consumer mais lento que producer).</li><li>Você já tem um stack reativo end-to-end (R2DBC, Mongo reativo, Kafka reativo).</li>
        </ul><h2>Quando NÃO vale</h2><ul>
          <li>CRUD simples com baixo tráfego — overhead de aprendizado não compensa.</li><li>Banco de dados bloqueante (JDBC). Misturar JDBC em WebFlux destrói o benefício.</li><li>Time sem experiência em reativo — debugar pipeline reativo é cruel.</li><li>Java 21 disponível? Considere MVC + Virtual Threads primeiro.</li>
        </ul><h2>Setup mínimo</h2><CodeBlock title="pom.xml — só trocar a dependência" code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>`} /><h2>Estilo anotação: @RestController</h2><p>
          Quase igual ao MVC, só que retornando <code>Mono</code> ou <code>Flux</code>:
        </p><CodeBlock title="UsuarioController.java" code={`@RestController
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
}`} /><h2>Estilo funcional: RouterFunction</h2><p>Alternativa sem anotações — rotas declaradas em código:</p><CodeBlock title="RouterConfig.java" code={`@Configuration
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
}`} /><h2>WebClient: o substituto do RestTemplate</h2><p>
          <code>RestTemplate</code> é bloqueante e está em maintenance mode. Em WebFlux (e cada vez mais em MVC) use <code>WebClient</code>:
        </p><CodeBlock title="Chamando uma API externa" code={`WebClient client = WebClient.builder()
    .baseUrl("https://api.exemplo.com")
    .build();

Mono<Cotacao> cotacao = client.get()
    .uri("/cotacao/{moeda}", "USD")
    .retrieve()
    .bodyToMono(Cotacao.class)
    .timeout(Duration.ofSeconds(2))
    .onErrorResume(ex -> Mono.just(Cotacao.padrao()));`} /><h2>Banco reativo: R2DBC</h2><p>
          JDBC é bloqueante por design. Em WebFlux você quer R2DBC (Reactive Relational Database Connectivity), que tem drivers para Postgres, MySQL e MSSQL.
        </p><CodeBlock title="Repository reativo" code={`public interface UsuarioRepository extends ReactiveCrudRepository<Usuario, Long> {
    Flux<Usuario> findByNomeContaining(String trecho);
    Mono<Long> countByAtivoTrue();
}`} /><AlertBox type="danger" title="Misturar JDBC em WebFlux = bug invisível">
          Se você chamar <code>jdbcTemplate.query(...)</code> dentro de um pipeline WebFlux, vai bloquear uma das poucas threads do event loop. Em produção, isso derruba a aplicação inteira sob carga. Use sempre R2DBC, ou mude para Spring MVC.
        </AlertBox><h2>Streaming: server-sent events</h2><CodeBlock title="Endpoint que stream-a a cada segundo" code={`@GetMapping(value = "/ticks", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> ticks() {
    return Flux.interval(Duration.ofSeconds(1))
        .map(i -> "tick #" + i);
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Suba um projeto Spring Boot com <code>spring-boot-starter-webflux</code>. Crie um <code>@RestController</code> com um GET que devolve <code>Flux.range(1, 10)</code> a cada 200ms via SSE. Acesse no navegador e veja os números chegando aos poucos.
          </li><li>
            Use <code>WebClient</code> para chamar a API pública <code>https://api.github.com/users/{"{login}"}</code>. Mapeie a resposta para um record <code>GhUser(String login, int public_repos)</code>. Adicione <code>timeout</code> e fallback.
          </li><li>
            Configure R2DBC com Postgres em Docker. Crie <code>UsuarioRepository</code> reativo e exponha CRUD completo. Force um cenário com 500 requests simultâneos (use <code>ab</code> ou <code>hey</code>) e compare com o mesmo CRUD em Spring MVC + JDBC.
          </li>
        </ol>
      </PageContainer>
  );
}
