import{j as e}from"./index-BpXci30S.js";import{P as t,A as s}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function i(){return e.jsxs(t,{title:"Testcontainers",subtitle:"Subir Postgres/Redis/Kafka real em Docker durante o teste — adeus mocks frágeis.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Você já passou horas debugando um teste que passa com H2 em memória mas explode em produção com Postgres? É clássico. H2 não tem ",e.jsx("code",{children:"JSONB"}),", não tem ",e.jsx("code",{children:"ON CONFLICT"})," idêntico ao Postgres, não tem extensões como ",e.jsx("code",{children:"pgcrypto"}),". Bancos em memória mentem."]}),e.jsxs("p",{children:["Mockar repositório também não resolve: você acaba testando o mock, não a query SQL. E quando a query tiver um ",e.jsx("code",{children:"JOIN"}),' errado, o mock sorri e diz "tudo certo".']}),e.jsxs("p",{children:["Testcontainers sobe o banco ",e.jsx("strong",{children:"de verdade"})," num container Docker durante o teste, expõe uma porta aleatória, e derruba ao final. Você testa contra Postgres real — e seu CI também."]}),e.jsxs(s,{type:"warning",title:"Pré-requisito",children:["Docker rodando na máquina (e no runner do CI). Sem Docker, sem Testcontainers. No CI use ",e.jsx("code",{children:"docker:dind"})," ou um runner com Docker socket."]}),e.jsx("h2",{children:"Setup no Maven"}),e.jsx(r,{title:"pom.xml",code:`<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>1.20.4</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>postgresql</artifactId>
  <version>1.20.4</version>
  <scope>test</scope>
</dependency>`}),e.jsxs("p",{children:["Tem módulos prontos para Postgres, MySQL, MongoDB, Kafka, Redis (via community), MinIO, Elasticsearch, RabbitMQ... e o curinga ",e.jsx("code",{children:"GenericContainer"})," para qualquer imagem Docker."]}),e.jsx("h2",{children:"Primeiro teste com Postgres"}),e.jsx(r,{title:"Teste isolado, sem Spring",code:`import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.*;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
class PostgresIT {

    @Container
    static PostgreSQLContainer<?> pg =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void deveConectarERodarQuery() throws Exception {
        try (Connection c = DriverManager.getConnection(
                pg.getJdbcUrl(), pg.getUsername(), pg.getPassword());
             Statement s = c.createStatement();
             ResultSet rs = s.executeQuery("SELECT 1")) {

            rs.next();
            assertThat(rs.getInt(1)).isEqualTo(1);
        }
    }
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@Testcontainers"})," é a extensão do JUnit 5 que gerencia o ciclo de vida. ",e.jsx("code",{children:"@Container"})," em campo ",e.jsx("code",{children:"static"})," sobe ",e.jsx("strong",{children:"uma vez por classe"}),"; em campo de instância sobe por teste (caro, evite)."]}),e.jsx("h2",{children:"Integração com Spring Boot"}),e.jsxs("p",{children:["O truque é injetar a URL/usuário/senha dinâmicos do container nas properties do Spring. Use ",e.jsx("code",{children:"@DynamicPropertySource"}),":"]}),e.jsx(r,{title:"UserRepositoryIT.java",code:`@SpringBootTest
@Testcontainers
class UserRepositoryIT {

    @Container
    static PostgreSQLContainer<?> pg =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }

    @Autowired UserRepository repo;

    @Test
    void salvaEBusca() {
        User u = repo.save(new User("ana@x.com"));
        assertThat(repo.findById(u.getId())).isPresent();
    }
}`}),e.jsxs("p",{children:["Note os ",e.jsx("code",{children:"method references"})," (",e.jsx("code",{children:"pg::getJdbcUrl"}),"): eles são ",e.jsx("em",{children:"suppliers"}),", então o Spring chama depois que o container já subiu."]}),e.jsx("h2",{children:"Reuso entre testes (acelera muito)"}),e.jsx(s,{type:"tip",title:"Cold start ~5 segundos por container",children:"Subir Postgres do zero leva alguns segundos. Multiplique por 50 classes de teste e seu CI chora. Duas estratégias:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Singleton container"}),": campo ",e.jsx("code",{children:"static"})," num base class, que ",e.jsx("em",{children:"todas"})," as classes de teste estendem. Sobe uma vez na JVM inteira."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reuse flag"}),": ative com ",e.jsx("code",{children:"testcontainers.reuse.enable=true"})," em ",e.jsx("code",{children:"~/.testcontainers.properties"})," e marque ",e.jsx("code",{children:".withReuse(true)"})," — o container fica vivo entre execuções locais."]})]}),e.jsx(r,{title:"AbstractIT.java — singleton pattern",code:`public abstract class AbstractIT {
    static final PostgreSQLContainer<?> PG =
        new PostgreSQLContainer<>("postgres:16-alpine")
            .withReuse(true);

    static { PG.start(); } // sobe na primeira referência

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      PG::getJdbcUrl);
        r.add("spring.datasource.username", PG::getUsername);
        r.add("spring.datasource.password", PG::getPassword);
    }
}`}),e.jsx("h2",{children:"Além de bancos: Kafka, Redis, MinIO, qualquer imagem"}),e.jsx(r,{title:"Kafka real num teste",code:`@Container
static KafkaContainer kafka =
    new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

@DynamicPropertySource
static void props(DynamicPropertyRegistry r) {
    r.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
}`}),e.jsx(r,{title:"Imagem genérica (qualquer coisa do Docker Hub)",code:`@Container
static GenericContainer<?> redis =
    new GenericContainer<>("redis:7-alpine")
        .withExposedPorts(6379);

String host = redis.getHost();
Integer port = redis.getMappedPort(6379); // porta dinâmica no host`}),e.jsxs("p",{children:[e.jsx("code",{children:"getMappedPort"})," é essencial: Docker mapeia a porta interna para uma porta aleatória no host. Nunca chute ",e.jsx("code",{children:"6379"})," direto."]}),e.jsx("h2",{children:"Custos e quando evitar"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Lentidão"}),": cada container = segundos. Use para testes de integração, não para unit tests."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Docker no CI"}),": nem todo runner tem. GitHub Actions tem por padrão; alguns runners corporativos não."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Imagens pesadas"}),": prefira tags ",e.jsx("code",{children:"-alpine"})," ou ",e.jsx("code",{children:"-slim"})," quando existirem."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"UserRepository"})," Spring Data JPA e teste ",e.jsx("code",{children:"save"}),"/",e.jsx("code",{children:"findByEmail"})," com Postgres real via Testcontainers."]}),e.jsxs("li",{children:["Adapte o teste anterior para usar a estratégia singleton (",e.jsx("code",{children:"AbstractIT"}),") e meça a diferença de tempo total rodando 5 classes de teste."]}),e.jsxs("li",{children:["Suba um ",e.jsx("code",{children:"GenericContainer"})," com ",e.jsx("code",{children:"redis:7-alpine"}),", conecte via Jedis/Lettuce e teste um ",e.jsx("code",{children:"SET"}),"/",e.jsx("code",{children:"GET"})," simples."]})]})]})}export{i as default};
