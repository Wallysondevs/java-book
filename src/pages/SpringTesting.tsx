import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringTesting() {
  return (
    <PageContainer title="Testes em Spring Boot" subtitle="@SpringBootTest, @WebMvcTest, @DataJpaTest — fatiar o contexto pra testar rápido." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Carregar o contexto Spring inteiro toda vez que roda um teste é lento — 5 a 30 segundos por classe. Multiplicado por centenas de testes, vira meia hora de pipeline. Spring oferece <em>slices</em>: anotações que carregam só a fatia do contexto que aquele teste precisa. Web sem JPA, JPA sem web, configuração mínima. Você ganha 10x em velocidade sem perder cobertura.
        </p><h2>Setup</h2><p>
          O starter <code>spring-boot-starter-test</code> já vem incluso quando você gera o projeto. Ele traz JUnit 5, AssertJ, Mockito, MockMvc, JsonPath, Spring TestContext.
        </p><CodeBlock title="pom.xml" code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>`} /><h2>@SpringBootTest: contexto inteiro</h2><p>
          Carrega tudo: web, JPA, beans customizados. Use para testes de integração de ponta a ponta. É o mais lento.
        </p><CodeBlock code={`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AppIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    @Test
    void deveRetornarListaDeUsuarios() {
        ResponseEntity<Usuario[]> resp = rest.getForEntity("/api/usuarios", Usuario[].class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotEmpty();
    }
}`} /><p>
          <code>RANDOM_PORT</code> sobe o servidor numa porta livre — evita conflito quando vários testes rodam em paralelo. <code>TestRestTemplate</code> já vem configurado com a base URL correta.
        </p><h2>@WebMvcTest: só a camada web</h2><p>
          Carrega <code>@RestController</code>, filters, ControllerAdvice. <strong>Não</strong> carrega services, repositories, JPA. Você mocka o que falta.
        </p><CodeBlock code={`@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UsuarioService service;

    @Test
    void deveRetornar404QuandoNaoExiste() throws Exception {
        when(service.buscar(99L)).thenThrow(new EntityNotFoundException("não existe"));

        mvc.perform(get("/api/usuarios/99"))
           .andExpect(status().isNotFound());
    }

    @Test
    void deveCriarUsuario() throws Exception {
        when(service.criar(any())).thenReturn(new UsuarioResponse(1L, "Ana", "ana@ex.com"));

        mvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"nome\\":\\"Ana\\",\\"email\\":\\"ana@ex.com\\",\\"idade\\":30}"))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(1))
           .andExpect(jsonPath("$.nome").value("Ana"));
    }
}`} /><p>
          <code>MockMvc</code> simula requisições HTTP <strong>sem subir servidor</strong>. Roda em milissegundos. <code>jsonPath</code> navega no JSON da resposta.
        </p><h2>@MockBean</h2><p>
          <code>@MockBean</code> coloca um mock no contexto Spring no lugar do bean real. Qualquer outro bean que injetar essa dependência vai receber o mock.
        </p><AlertBox type="tip" title="A diferença com @Mock">
          <code>@Mock</code> (Mockito puro) cria um mock numa variável. <code>@MockBean</code> registra esse mock no <strong>contexto Spring</strong>, então a injeção via construtor pega o mock automaticamente.
        </AlertBox><h2>@DataJpaTest: só JPA</h2><p>
          Carrega entidades, repositórios e EntityManager. Por padrão, troca o datasource real por H2 em memória. Cada teste roda em transação que dá <strong>rollback no fim</strong> — o banco fica limpo.
        </p><CodeBlock code={`@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private TestEntityManager em;

    @Test
    void deveEncontrarPorEmail() {
        Usuario u = new Usuario();
        u.setNome("Bruno");
        u.setEmail("bruno@ex.com");
        em.persistAndFlush(u);

        Optional<Usuario> achado = repo.findByEmail("bruno@ex.com");
        assertThat(achado).isPresent();
        assertThat(achado.get().getNome()).isEqualTo("Bruno");
    }
}`} /><h2>Outros slices</h2><ul>
          <li>
            <strong>
              <code>@JsonTest</code>
            </strong> — testar serialização Jackson.
          </li><li>
            <strong>
              <code>@RestClientTest</code>
            </strong> — testar clientes HTTP.
          </li><li>
            <strong>
              <code>@JdbcTest</code>
            </strong> — JdbcTemplate puro.
          </li>
        </ul><h2>@ActiveProfiles</h2><p>
          Para testes, geralmente você quer um <code>application-test.properties</code> separado (ex.: H2 em vez de Postgres):
        </p><CodeBlock code={`@SpringBootTest
@ActiveProfiles("test")
class MeuTeste { ... }`} /><CodeBlock title="src/test/resources/application-test.properties" code={`spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
logging.level.org.hibernate.SQL=DEBUG`} /><h2>@Transactional em testes</h2><p>
          Testes anotados com <code>@Transactional</code> (ou que herdam isso de <code>@DataJpaTest</code>) fazem <strong>rollback automático no fim</strong>. Útil para isolar testes — cada um deixa o banco como achou. Cuidado: se você testa código que precisa que a transação <em>commite</em> de fato (triggers, eventos), use <code>@Commit</code> ou monte com <code>TestRestTemplate</code>.
        </p><h2>AssertJ: assertions fluentes</h2><CodeBlock code={`import static org.assertj.core.api.Assertions.*;

assertThat(usuarios)
    .hasSize(3)
    .extracting(Usuario::getNome)
    .containsExactly("Ana", "Bruno", "Carla");

assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.OK);

assertThat(produto.getPreco())
    .isPositive()
    .isLessThan(BigDecimal.valueOf(1000));

assertThatThrownBy(() -> service.buscar(99L))
    .isInstanceOf(EntityNotFoundException.class)
    .hasMessageContaining("não existe");`} /><h2>Comparando JSON</h2><p>
          Para verificar resposta inteira sem se preocupar com ordem de campos, use <code>JSONAssert</code> ou o <code>jsonPath</code> do MockMvc:
        </p><CodeBlock code={`mvc.perform(get("/api/usuarios/1"))
   .andExpect(content().json("""
       {
         "id": 1,
         "nome": "Ana",
         "email": "ana@ex.com"
       }
   """, false));   // false = comparação leniente, ignora campos extras`} /><h2>Estratégia geral</h2><ul>
          <li>
            <strong>Unitário</strong> (sem Spring): para regras puras de domínio, services com mocks. Rápido e abundante.
          </li><li>
            <strong>@WebMvcTest</strong>: para validar contrato HTTP (status, JSON, validação).
          </li><li>
            <strong>@DataJpaTest</strong>: para queries derivadas e <code>@Query</code> customizadas.
          </li><li>
            <strong>@SpringBootTest</strong>: poucos, para integração ponta a ponta de fluxos críticos.
          </li>
        </ul><AlertBox type="note" title="Pirâmide de testes">
          Muito unitário, médio de slice, pouco de integração. Esse formato pirâmide mantém a suíte rápida e confiável.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um <code>@WebMvcTest</code> para um <code>ProdutoController</code>: teste GET, POST com JSON válido (espera 201) e POST com JSON inválido (espera 400). Use <code>@MockBean</code> no service.
          </li><li>
            Escreva um <code>@DataJpaTest</code> que persiste 3 produtos e verifica que <code>findByPrecoLessThan</code> retorna a quantidade correta.
          </li><li>
            Crie um <code>@SpringBootTest</code> com <code>RANDOM_PORT</code> e <code>TestRestTemplate</code> que cadastra um produto via POST e depois lista via GET, verificando que ele aparece.
          </li>
        </ol>
      </PageContainer>
  );
}
