import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TestContainers() {
  return (
    <PageContainer title="Testcontainers" subtitle="Subir Postgres/Redis/Kafka real em Docker durante o teste — adeus mocks frágeis." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Você já passou horas debugando um teste que passa com H2 em memória mas explode em produção com Postgres? É clássico. H2 não tem <code>JSONB</code>, não tem <code>ON CONFLICT</code> idêntico ao Postgres, não tem extensões como <code>pgcrypto</code>. Bancos em memória mentem.
        </p><p>
          Mockar repositório também não resolve: você acaba testando o mock, não a query SQL. E quando a query tiver um <code>JOIN</code> errado, o mock sorri e diz "tudo certo".
        </p><p>
          Testcontainers sobe o banco <strong>de verdade</strong> num container Docker durante o teste, expõe uma porta aleatória, e derruba ao final. Você testa contra Postgres real — e seu CI também.
        </p><AlertBox type="warning" title="Pré-requisito">
          Docker rodando na máquina (e no runner do CI). Sem Docker, sem Testcontainers. No CI use <code>docker:dind</code> ou um runner com Docker socket.
        </AlertBox><h2>Setup no Maven</h2><CodeBlock title="pom.xml" code={`<dependency>
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
</dependency>`} /><p>
          Tem módulos prontos para Postgres, MySQL, MongoDB, Kafka, Redis (via community), MinIO, Elasticsearch, RabbitMQ... e o curinga <code>GenericContainer</code> para qualquer imagem Docker.
        </p><h2>Primeiro teste com Postgres</h2><CodeBlock title="Teste isolado, sem Spring" code={`import org.junit.jupiter.api.Test;
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
}`} /><p>
          <code>@Testcontainers</code> é a extensão do JUnit 5 que gerencia o ciclo de vida. <code>@Container</code> em campo <code>static</code> sobe <strong>uma vez por classe</strong>; em campo de instância sobe por teste (caro, evite).
        </p><h2>Integração com Spring Boot</h2><p>
          O truque é injetar a URL/usuário/senha dinâmicos do container nas properties do Spring. Use <code>@DynamicPropertySource</code>:
        </p><CodeBlock title="UserRepositoryIT.java" code={`@SpringBootTest
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
}`} /><p>
          Note os <code>method references</code> (<code>pg::getJdbcUrl</code>): eles são <em>suppliers</em>, então o Spring chama depois que o container já subiu.
        </p><h2>Reuso entre testes (acelera muito)</h2><AlertBox type="tip" title="Cold start ~5 segundos por container">
          Subir Postgres do zero leva alguns segundos. Multiplique por 50 classes de teste e seu CI chora. Duas estratégias:
        </AlertBox><ul>
          <li>
            <strong>Singleton container</strong>: campo <code>static</code> num base class, que <em>todas</em> as classes de teste estendem. Sobe uma vez na JVM inteira.
          </li><li>
            <strong>Reuse flag</strong>: ative com <code>testcontainers.reuse.enable=true</code> em <code>~/.testcontainers.properties</code> e marque <code>.withReuse(true)</code> — o container fica vivo entre execuções locais.
          </li>
        </ul><CodeBlock title="AbstractIT.java — singleton pattern" code={`public abstract class AbstractIT {
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
}`} /><h2>Além de bancos: Kafka, Redis, MinIO, qualquer imagem</h2><CodeBlock title="Kafka real num teste" code={`@Container
static KafkaContainer kafka =
    new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

@DynamicPropertySource
static void props(DynamicPropertyRegistry r) {
    r.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
}`} /><CodeBlock title="Imagem genérica (qualquer coisa do Docker Hub)" code={`@Container
static GenericContainer<?> redis =
    new GenericContainer<>("redis:7-alpine")
        .withExposedPorts(6379);

String host = redis.getHost();
Integer port = redis.getMappedPort(6379); // porta dinâmica no host`} /><p>
          <code>getMappedPort</code> é essencial: Docker mapeia a porta interna para uma porta aleatória no host. Nunca chute <code>6379</code> direto.
        </p><h2>Custos e quando evitar</h2><ul>
          <li>
            <strong>Lentidão</strong>: cada container = segundos. Use para testes de integração, não para unit tests.
          </li><li>
            <strong>Docker no CI</strong>: nem todo runner tem. GitHub Actions tem por padrão; alguns runners corporativos não.
          </li><li>
            <strong>Imagens pesadas</strong>: prefira tags <code>-alpine</code> ou <code>-slim</code> quando existirem.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>UserRepository</code> Spring Data JPA e teste <code>save</code>/<code>findByEmail</code> com Postgres real via Testcontainers.
          </li><li>
            Adapte o teste anterior para usar a estratégia singleton (<code>AbstractIT</code>) e meça a diferença de tempo total rodando 5 classes de teste.
          </li><li>
            Suba um <code>GenericContainer</code> com <code>redis:7-alpine</code>, conecte via Jedis/Lettuce e teste um <code>SET</code>/<code>GET</code> simples.
          </li>
        </ol>
      </PageContainer>
  );
}
