import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Testes em Spring Boot",subtitle:"@SpringBootTest, @WebMvcTest, @DataJpaTest — fatiar o contexto pra testar rápido.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Carregar o contexto Spring inteiro toda vez que roda um teste é lento — 5 a 30 segundos por classe. Multiplicado por centenas de testes, vira meia hora de pipeline. Spring oferece ",e.jsx("em",{children:"slices"}),": anotações que carregam só a fatia do contexto que aquele teste precisa. Web sem JPA, JPA sem web, configuração mínima. Você ganha 10x em velocidade sem perder cobertura."]}),e.jsx("h2",{children:"Setup"}),e.jsxs("p",{children:["O starter ",e.jsx("code",{children:"spring-boot-starter-test"})," já vem incluso quando você gera o projeto. Ele traz JUnit 5, AssertJ, Mockito, MockMvc, JsonPath, Spring TestContext."]}),e.jsx(s,{title:"pom.xml",code:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>`}),e.jsx("h2",{children:"@SpringBootTest: contexto inteiro"}),e.jsx("p",{children:"Carrega tudo: web, JPA, beans customizados. Use para testes de integração de ponta a ponta. É o mais lento."}),e.jsx(s,{code:`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AppIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    @Test
    void deveRetornarListaDeUsuarios() {
        ResponseEntity<Usuario[]> resp = rest.getForEntity("/api/usuarios", Usuario[].class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotEmpty();
    }
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"RANDOM_PORT"})," sobe o servidor numa porta livre — evita conflito quando vários testes rodam em paralelo. ",e.jsx("code",{children:"TestRestTemplate"})," já vem configurado com a base URL correta."]}),e.jsx("h2",{children:"@WebMvcTest: só a camada web"}),e.jsxs("p",{children:["Carrega ",e.jsx("code",{children:"@RestController"}),", filters, ControllerAdvice. ",e.jsx("strong",{children:"Não"})," carrega services, repositories, JPA. Você mocka o que falta."]}),e.jsx(s,{code:`@WebMvcTest(UsuarioController.class)
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
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"MockMvc"})," simula requisições HTTP ",e.jsx("strong",{children:"sem subir servidor"}),". Roda em milissegundos. ",e.jsx("code",{children:"jsonPath"})," navega no JSON da resposta."]}),e.jsx("h2",{children:"@MockBean"}),e.jsxs("p",{children:[e.jsx("code",{children:"@MockBean"})," coloca um mock no contexto Spring no lugar do bean real. Qualquer outro bean que injetar essa dependência vai receber o mock."]}),e.jsxs(o,{type:"tip",title:"A diferença com @Mock",children:[e.jsx("code",{children:"@Mock"})," (Mockito puro) cria um mock numa variável. ",e.jsx("code",{children:"@MockBean"})," registra esse mock no ",e.jsx("strong",{children:"contexto Spring"}),", então a injeção via construtor pega o mock automaticamente."]}),e.jsx("h2",{children:"@DataJpaTest: só JPA"}),e.jsxs("p",{children:["Carrega entidades, repositórios e EntityManager. Por padrão, troca o datasource real por H2 em memória. Cada teste roda em transação que dá ",e.jsx("strong",{children:"rollback no fim"})," — o banco fica limpo."]}),e.jsx(s,{code:`@DataJpaTest
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
}`}),e.jsx("h2",{children:"Outros slices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@JsonTest"})})," — testar serialização Jackson."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@RestClientTest"})})," — testar clientes HTTP."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@JdbcTest"})})," — JdbcTemplate puro."]})]}),e.jsx("h2",{children:"@ActiveProfiles"}),e.jsxs("p",{children:["Para testes, geralmente você quer um ",e.jsx("code",{children:"application-test.properties"})," separado (ex.: H2 em vez de Postgres):"]}),e.jsx(s,{code:`@SpringBootTest
@ActiveProfiles("test")
class MeuTeste { ... }`}),e.jsx(s,{title:"src/test/resources/application-test.properties",code:`spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
logging.level.org.hibernate.SQL=DEBUG`}),e.jsx("h2",{children:"@Transactional em testes"}),e.jsxs("p",{children:["Testes anotados com ",e.jsx("code",{children:"@Transactional"})," (ou que herdam isso de ",e.jsx("code",{children:"@DataJpaTest"}),") fazem ",e.jsx("strong",{children:"rollback automático no fim"}),". Útil para isolar testes — cada um deixa o banco como achou. Cuidado: se você testa código que precisa que a transação ",e.jsx("em",{children:"commite"})," de fato (triggers, eventos), use ",e.jsx("code",{children:"@Commit"})," ou monte com ",e.jsx("code",{children:"TestRestTemplate"}),"."]}),e.jsx("h2",{children:"AssertJ: assertions fluentes"}),e.jsx(s,{code:`import static org.assertj.core.api.Assertions.*;

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
    .hasMessageContaining("não existe");`}),e.jsx("h2",{children:"Comparando JSON"}),e.jsxs("p",{children:["Para verificar resposta inteira sem se preocupar com ordem de campos, use ",e.jsx("code",{children:"JSONAssert"})," ou o ",e.jsx("code",{children:"jsonPath"})," do MockMvc:"]}),e.jsx(s,{code:`mvc.perform(get("/api/usuarios/1"))
   .andExpect(content().json("""
       {
         "id": 1,
         "nome": "Ana",
         "email": "ana@ex.com"
       }
   """, false));   // false = comparação leniente, ignora campos extras`}),e.jsx("h2",{children:"Estratégia geral"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unitário"})," (sem Spring): para regras puras de domínio, services com mocks. Rápido e abundante."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"@WebMvcTest"}),": para validar contrato HTTP (status, JSON, validação)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"@DataJpaTest"}),": para queries derivadas e ",e.jsx("code",{children:"@Query"})," customizadas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"@SpringBootTest"}),": poucos, para integração ponta a ponta de fluxos críticos."]})]}),e.jsx(o,{type:"note",title:"Pirâmide de testes",children:"Muito unitário, médio de slice, pouco de integração. Esse formato pirâmide mantém a suíte rápida e confiável."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um ",e.jsx("code",{children:"@WebMvcTest"})," para um ",e.jsx("code",{children:"ProdutoController"}),": teste GET, POST com JSON válido (espera 201) e POST com JSON inválido (espera 400). Use ",e.jsx("code",{children:"@MockBean"})," no service."]}),e.jsxs("li",{children:["Escreva um ",e.jsx("code",{children:"@DataJpaTest"})," que persiste 3 produtos e verifica que ",e.jsx("code",{children:"findByPrecoLessThan"})," retorna a quantidade correta."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"@SpringBootTest"})," com ",e.jsx("code",{children:"RANDOM_PORT"})," e ",e.jsx("code",{children:"TestRestTemplate"})," que cadastra um produto via POST e depois lista via GET, verificando que ele aparece."]})]})]})}export{n as default};
