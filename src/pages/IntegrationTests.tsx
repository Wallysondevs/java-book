import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IntegrationTests() {
  return (
    <PageContainer title="Testes de Integração" subtitle="Fora do isolamento de unidade — testar pedaços conectados de verdade." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Unit tests são ótimos: rápidos, isolados, mockam tudo. Mas eles têm um problema fundamental — <strong>cada peça funciona sozinha, e o sistema continua quebrado</strong>. O controller chama o service que chama o repository, mas o mapeamento JPA tá errado, ou a URL no <code>application.yml</code> aponta pro lugar errado, ou o filter de segurança bloqueia tudo.
        </p><p>
          Teste de integração é onde você liga as peças e vê se a engrenagem gira de verdade.
        </p><h2>A pirâmide de testes</h2><ul>
          <li>
            <strong>Base — Unit (muitos)</strong>: rápidos (ms), isolam classes individuais. 70-80% do total.
          </li><li>
            <strong>Meio — Integration (alguns)</strong>: testam camadas conectadas (controller→service→repo, repo+banco real). Segundos cada. 15-25%.
          </li><li>
            <strong>Topo — E2E (poucos)</strong>: app inteiro subido, browser falso clicando. Lentos, frágeis. 5%.
          </li>
        </ul><AlertBox type="warning" title="Anti-pirâmide (cone de sorvete)">
          Se você tem mais E2E do que unit, está sofrendo. CI demora horas, testes falham por flakiness, ninguém roda local. Inverta.
        </AlertBox><h2>O que vale testar em integração</h2><ul>
          <li>
            <strong>Repository real com banco real</strong>: queries customizadas, <code>@Query</code> JPQL, native SQL, mapeamento de tipos (<code>JSONB</code>, <code>enum</code>, <code>LocalDateTime</code> com timezone).
          </li><li>
            <strong>Cliente HTTP</strong>: seu <code>RestTemplate</code>/<code>WebClient</code> contra um mock server (WireMock).
          </li><li>
            <strong>Fluxo completo Spring</strong>: request HTTP → controller → service → repo → banco → response.
          </li><li>
            <strong>Configuração</strong>: o <code>application.yml</code> sobe? O security filter deixa o endpoint público passar?
          </li>
        </ul><h2>@SpringBootTest com porta aleatória</h2><CodeBlock title="UsuarioControllerIT.java" code={`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("integration")
@Testcontainers
class UsuarioControllerIT {

    @Container
    static PostgreSQLContainer<?> pg =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }

    @Autowired TestRestTemplate rest;
    @Autowired UsuarioRepository repo;

    @Test
    void postCriaUsuarioEDevolve201() {
        var body = Map.of("nome", "Ana", "email", "ana@x.com");

        var resp = rest.postForEntity("/usuarios", body, UsuarioDTO.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody().email()).isEqualTo("ana@x.com");
        assertThat(repo.findAll()).hasSize(1);
    }
}`} /><p>
          <code>RANDOM_PORT</code> sobe o servidor numa porta livre — útil pra rodar paralelo sem colisão. <code>TestRestTemplate</code> já vem configurado com a porta certa (<code>{"http://localhost:{porta}"}</code>).
        </p><h2>WebTestClient (alternativa moderna, fluente)</h2><CodeBlock code={`@Autowired WebTestClient web;

@Test
void getRetornaUsuario() {
    web.get().uri("/usuarios/{id}", 1L)
       .exchange()
       .expectStatus().isOk()
       .expectBody()
         .jsonPath("$.email").isEqualTo("ana@x.com")
         .jsonPath("$.idade").isNumber();
}`} /><p>
          <code>WebTestClient</code> nasceu pro WebFlux mas funciona com Spring MVC também. Tem asserts JSON Path embutidos.
        </p><h2>Fatias de teste (mais leves)</h2><p>
          Nem sempre você precisa subir o app inteiro. Spring oferece anotações que sobem só uma fatia:
        </p><ul>
          <li>
            <code>@DataJpaTest</code> — só JPA + repositórios, com banco em memória (ou Testcontainers).
          </li><li>
            <code>@WebMvcTest(UsuarioController.class)</code> — só a camada web, mocka services.
          </li><li>
            <code>@RestClientTest</code> — para clientes HTTP, com <code>MockRestServiceServer</code>.
          </li>
        </ul><CodeBlock title="@DataJpaTest com Testcontainers" code={`@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UsuarioRepositoryIT {

    @Container
    static PostgreSQLContainer<?> pg =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }

    @Autowired UsuarioRepository repo;

    @Test
    void buscaPorEmailIgnoraCase() {
        repo.save(new Usuario("Ana", "ANA@x.com"));
        assertThat(repo.findByEmailIgnoreCase("ana@x.com")).isPresent();
    }
}`} /><p>
          <code>@AutoConfigureTestDatabase(replace = NONE)</code> impede o Spring de trocar seu Postgres por H2. Sem isso, o <code>@DataJpaTest</code> usa H2 — voltando ao problema original.
        </p><h2>Separar unit de integration</h2><p>Use tags JUnit 5 e configure o Maven Surefire para rodar separado:</p><CodeBlock code={`@Tag("integration")
class UsuarioControllerIT { ... }

@Tag("unit")
class UsuarioServiceTest { ... }`} /><CodeBlock title="pom.xml — só unit no build padrão" code={`<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <configuration>
    <excludedGroups>integration</excludedGroups>
  </configuration>
</plugin>
<plugin>
  <artifactId>maven-failsafe-plugin</artifactId>
  <configuration>
    <groups>integration</groups>
  </configuration>
  <executions>
    <execution><goals><goal>integration-test</goal><goal>verify</goal></goals></execution>
  </executions>
</plugin>`} /><p>
          Convenção: classes que terminam em <code>Test</code> = unit (Surefire); <code>IT</code> = integration (Failsafe). <code>mvn test</code> roda unit; <code>mvn verify</code> roda tudo.
        </p><h2>Manter rápido</h2><ul>
          <li>
            <strong>Reuse de containers</strong>: singleton pattern (veja capítulo de Testcontainers).
          </li><li>
            <strong>Paralelismo</strong>: <code>junit.jupiter.execution.parallel.enabled=true</code> em <code>junit-platform.properties</code>. Cuidado com estado compartilhado.
          </li><li>
            <strong>Limpeza por teste</strong>: <code>@Sql</code> ou <code>@Transactional</code> + rollback (Spring rollback automático em <code>@DataJpaTest</code>).
          </li>
        </ul><h2>Contract tests (menção rápida)</h2><p>
          Quando você tem microserviços, testes de integração tradicionais não cobrem tudo: o serviço A pode mudar o JSON e o B descobre só em prod. <strong>Contract tests</strong> (Pact, Spring Cloud Contract) capturam o "contrato" entre consumer e provider e validam dos dois lados. Tema para outro capítulo, mas guarde o nome.
        </p><AlertBox type="tip" title="Regra prática">
          {"Se um teste de integração sobe em < 5 segundos e roda em < 1 segundo depois, está saudável. Se cada teste leva 30s, algo está errado: container não reutilizado, contexto Spring sendo reconstruído, ou app pesada demais."}
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um <code>@SpringBootTest</code> + Testcontainers que faz POST em <code>/usuarios</code>, GET por id, e valida o status 200 e o JSON retornado com <code>WebTestClient</code>.
          </li><li>
            Adicione tags <code>@Tag("integration")</code> e configure o Surefire/Failsafe para que <code>mvn test</code> rode só unit e <code>mvn verify</code> rode tudo. Meça os tempos.
          </li><li>
            Converta um <code>@DataJpaTest</code> existente do H2 para Postgres via Testcontainers usando <code>@AutoConfigureTestDatabase(replace = NONE)</code>. Veja se alguma query quebra.
          </li>
        </ol>
      </PageContainer>
  );
}
