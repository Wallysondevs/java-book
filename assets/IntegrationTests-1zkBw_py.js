import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Testes de Integração",subtitle:"Fora do isolamento de unidade — testar pedaços conectados de verdade.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Unit tests são ótimos: rápidos, isolados, mockam tudo. Mas eles têm um problema fundamental — ",e.jsx("strong",{children:"cada peça funciona sozinha, e o sistema continua quebrado"}),". O controller chama o service que chama o repository, mas o mapeamento JPA tá errado, ou a URL no ",e.jsx("code",{children:"application.yml"})," aponta pro lugar errado, ou o filter de segurança bloqueia tudo."]}),e.jsx("p",{children:"Teste de integração é onde você liga as peças e vê se a engrenagem gira de verdade."}),e.jsx("h2",{children:"A pirâmide de testes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Base — Unit (muitos)"}),": rápidos (ms), isolam classes individuais. 70-80% do total."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Meio — Integration (alguns)"}),": testam camadas conectadas (controller→service→repo, repo+banco real). Segundos cada. 15-25%."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Topo — E2E (poucos)"}),": app inteiro subido, browser falso clicando. Lentos, frágeis. 5%."]})]}),e.jsx(o,{type:"warning",title:"Anti-pirâmide (cone de sorvete)",children:"Se você tem mais E2E do que unit, está sofrendo. CI demora horas, testes falham por flakiness, ninguém roda local. Inverta."}),e.jsx("h2",{children:"O que vale testar em integração"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Repository real com banco real"}),": queries customizadas, ",e.jsx("code",{children:"@Query"})," JPQL, native SQL, mapeamento de tipos (",e.jsx("code",{children:"JSONB"}),", ",e.jsx("code",{children:"enum"}),", ",e.jsx("code",{children:"LocalDateTime"})," com timezone)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cliente HTTP"}),": seu ",e.jsx("code",{children:"RestTemplate"}),"/",e.jsx("code",{children:"WebClient"})," contra um mock server (WireMock)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fluxo completo Spring"}),": request HTTP → controller → service → repo → banco → response."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Configuração"}),": o ",e.jsx("code",{children:"application.yml"})," sobe? O security filter deixa o endpoint público passar?"]})]}),e.jsx("h2",{children:"@SpringBootTest com porta aleatória"}),e.jsx(s,{title:"UsuarioControllerIT.java",code:`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
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
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"RANDOM_PORT"})," sobe o servidor numa porta livre — útil pra rodar paralelo sem colisão. ",e.jsx("code",{children:"TestRestTemplate"})," já vem configurado com a porta certa (",e.jsx("code",{children:"http://localhost:{porta}"}),")."]}),e.jsx("h2",{children:"WebTestClient (alternativa moderna, fluente)"}),e.jsx(s,{code:`@Autowired WebTestClient web;

@Test
void getRetornaUsuario() {
    web.get().uri("/usuarios/{id}", 1L)
       .exchange()
       .expectStatus().isOk()
       .expectBody()
         .jsonPath("$.email").isEqualTo("ana@x.com")
         .jsonPath("$.idade").isNumber();
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"WebTestClient"})," nasceu pro WebFlux mas funciona com Spring MVC também. Tem asserts JSON Path embutidos."]}),e.jsx("h2",{children:"Fatias de teste (mais leves)"}),e.jsx("p",{children:"Nem sempre você precisa subir o app inteiro. Spring oferece anotações que sobem só uma fatia:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"@DataJpaTest"})," — só JPA + repositórios, com banco em memória (ou Testcontainers)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@WebMvcTest(UsuarioController.class)"})," — só a camada web, mocka services."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@RestClientTest"})," — para clientes HTTP, com ",e.jsx("code",{children:"MockRestServiceServer"}),"."]})]}),e.jsx(s,{title:"@DataJpaTest com Testcontainers",code:`@DataJpaTest
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
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@AutoConfigureTestDatabase(replace = NONE)"})," impede o Spring de trocar seu Postgres por H2. Sem isso, o ",e.jsx("code",{children:"@DataJpaTest"})," usa H2 — voltando ao problema original."]}),e.jsx("h2",{children:"Separar unit de integration"}),e.jsx("p",{children:"Use tags JUnit 5 e configure o Maven Surefire para rodar separado:"}),e.jsx(s,{code:`@Tag("integration")
class UsuarioControllerIT { ... }

@Tag("unit")
class UsuarioServiceTest { ... }`}),e.jsx(s,{title:"pom.xml — só unit no build padrão",code:`<plugin>
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
</plugin>`}),e.jsxs("p",{children:["Convenção: classes que terminam em ",e.jsx("code",{children:"Test"})," = unit (Surefire); ",e.jsx("code",{children:"IT"})," = integration (Failsafe). ",e.jsx("code",{children:"mvn test"})," roda unit; ",e.jsx("code",{children:"mvn verify"})," roda tudo."]}),e.jsx("h2",{children:"Manter rápido"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Reuse de containers"}),": singleton pattern (veja capítulo de Testcontainers)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Paralelismo"}),": ",e.jsx("code",{children:"junit.jupiter.execution.parallel.enabled=true"})," em ",e.jsx("code",{children:"junit-platform.properties"}),". Cuidado com estado compartilhado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Limpeza por teste"}),": ",e.jsx("code",{children:"@Sql"})," ou ",e.jsx("code",{children:"@Transactional"})," + rollback (Spring rollback automático em ",e.jsx("code",{children:"@DataJpaTest"}),")."]})]}),e.jsx("h2",{children:"Contract tests (menção rápida)"}),e.jsxs("p",{children:["Quando você tem microserviços, testes de integração tradicionais não cobrem tudo: o serviço A pode mudar o JSON e o B descobre só em prod. ",e.jsx("strong",{children:"Contract tests"}),' (Pact, Spring Cloud Contract) capturam o "contrato" entre consumer e provider e validam dos dois lados. Tema para outro capítulo, mas guarde o nome.']}),e.jsx(o,{type:"tip",title:"Regra prática",children:"Se um teste de integração sobe em < 5 segundos e roda em < 1 segundo depois, está saudável. Se cada teste leva 30s, algo está errado: container não reutilizado, contexto Spring sendo reconstruído, ou app pesada demais."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um ",e.jsx("code",{children:"@SpringBootTest"})," + Testcontainers que faz POST em ",e.jsx("code",{children:"/usuarios"}),", GET por id, e valida o status 200 e o JSON retornado com ",e.jsx("code",{children:"WebTestClient"}),"."]}),e.jsxs("li",{children:["Adicione tags ",e.jsx("code",{children:'@Tag("integration")'})," e configure o Surefire/Failsafe para que ",e.jsx("code",{children:"mvn test"})," rode só unit e ",e.jsx("code",{children:"mvn verify"})," rode tudo. Meça os tempos."]}),e.jsxs("li",{children:["Converta um ",e.jsx("code",{children:"@DataJpaTest"})," existente do H2 para Postgres via Testcontainers usando ",e.jsx("code",{children:"@AutoConfigureTestDatabase(replace = NONE)"}),". Veja se alguma query quebra."]})]})]})}export{n as default};
