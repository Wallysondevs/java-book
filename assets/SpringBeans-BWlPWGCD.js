import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Beans, Injeção e Lifecycle no Spring",subtitle:"@Component, @Service, @Repository, @Configuration — o coração do IoC.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Sem Spring, em algum lugar do seu código tem ",e.jsx("code",{children:"new ServicoX(new RepositorioY(new DataSource(...)))"}),". Cada classe precisa saber montar suas dependências. Spring inverte isso: você ",e.jsx("strong",{children:"declara"})," que precisa de um ",e.jsx("code",{children:"ServicoX"})," e o framework te entrega instanciado, com tudo plugado. Isso é ",e.jsx("em",{children:"Inversion of Control"})," (IoC), e a entrega é ",e.jsx("em",{children:"Dependency Injection"})," (DI)."]}),e.jsx("p",{children:"Resultado: classes desacopladas, fáceis de testar (você troca a dependência real por um mock no teste sem mudar uma linha do código de produção)."}),e.jsx("h2",{children:"ApplicationContext: o container"}),e.jsxs("p",{children:["Quando o Spring inicia, ele cria um ",e.jsx("code",{children:"ApplicationContext"}),' — um Map enorme de "nome → objeto". Esses objetos são os ',e.jsx("strong",{children:"beans"}),". O contexto sabe criar, injetar, gerenciar ciclo de vida e destruir cada um."]}),e.jsx("h2",{children:"Estereótipos: marcando o que é bean"}),e.jsxs("p",{children:["Você não cria beans com ",e.jsx("code",{children:"new"}),". Você anota a classe e o Spring descobre via ",e.jsx("code",{children:"@ComponentScan"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@Component"})})," — genérico, qualquer bean."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@Service"})})," — semanticamente: lógica de negócio."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@Repository"})})," — persistência. Bônus: traduz exceções de JDBC/JPA para ",e.jsx("code",{children:"DataAccessException"})," do Spring."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@Controller"})})," / ",e.jsx("strong",{children:e.jsx("code",{children:"@RestController"})})," — camada web."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@Configuration"})})," — fábrica de beans (ver abaixo)."]})]}),e.jsxs("p",{children:["Tecnicamente, todos derivam de ",e.jsx("code",{children:"@Component"}),". A diferença é semântica e algumas funcionalidades extras."]}),e.jsx(i,{code:`@Service
public class CalculadoraService {
    public BigDecimal calcularImposto(BigDecimal valor) {
        return valor.multiply(new BigDecimal("0.15"));
    }
}`}),e.jsx("h2",{children:"@Configuration + @Bean"}),e.jsxs("p",{children:["Quando você precisa de um bean que ",e.jsx("strong",{children:"não é uma classe sua"})," (ex.: um ",e.jsx("code",{children:"RestClient"}),", um ",e.jsx("code",{children:"ObjectMapper"})," customizado), use ",e.jsx("code",{children:"@Bean"})," dentro de uma ",e.jsx("code",{children:"@Configuration"}),":"]}),e.jsx(i,{code:`@Configuration
public class AppConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl("https://api.externa.com")
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
}`}),e.jsx("h2",{children:"Injeção de dependência: 3 jeitos"}),e.jsx("h3",{children:"1. Construtor (PREFERIDO)"}),e.jsx(i,{code:`@Service
public class PedidoService {

    private final UsuarioRepository usuarios;
    private final EmailService email;

    public PedidoService(UsuarioRepository usuarios, EmailService email) {
        this.usuarios = usuarios;
        this.email = email;
    }
}`}),e.jsxs("p",{children:["Por que é o melhor: campos podem ser ",e.jsx("code",{children:"final"})," (imutáveis), o objeto é criado já consistente, e em ",e.jsx("strong",{children:"teste unitário"})," você instancia direto: ",e.jsx("code",{children:"new PedidoService(mockRepo, mockEmail)"})," — sem framework."]}),e.jsxs(o,{type:"tip",title:"Atalho com Lombok",children:[e.jsx("code",{children:"@RequiredArgsConstructor"})," do Lombok gera o construtor com todos os campos ",e.jsx("code",{children:"final"}),". Bem comum em código moderno de Spring."]}),e.jsx("h3",{children:"2. Setter"}),e.jsx(i,{code:`@Service
public class PedidoService {
    private EmailService email;

    @Autowired
    public void setEmail(EmailService email) { this.email = email; }
}`}),e.jsx("p",{children:"Útil para dependências opcionais ou para quebrar ciclos. Pouco comum hoje."}),e.jsx("h3",{children:"3. Campo (EVITE)"}),e.jsx(i,{code:`@Service
public class PedidoService {
    @Autowired
    private EmailService email;   // ruim
}`}),e.jsxs("p",{children:["Parece menos código, mas: campo não pode ser ",e.jsx("code",{children:"final"}),", dá pra esquecer de injetar em testes (vira ",e.jsx("code",{children:"NullPointerException"}),"), esconde dependências (alguém olha o construtor e acha que a classe não precisa de nada)."]}),e.jsx("h2",{children:"@Qualifier e @Primary"}),e.jsx("p",{children:"E se houver duas implementações da mesma interface?"}),e.jsx(i,{code:`public interface NotificadorService { void enviar(String msg); }

@Service
public class EmailNotificador implements NotificadorService { ... }

@Service
public class SmsNotificador implements NotificadorService { ... }

@Service
public class AlertaService {
    public AlertaService(NotificadorService n) { ... }   // BOOM: ambíguo
}`}),e.jsx("p",{children:"Soluções:"}),e.jsx(i,{title:"Qualifier — escolhe na injeção",code:`@Service
public class AlertaService {
    public AlertaService(@Qualifier("emailNotificador") NotificadorService n) { ... }
}`}),e.jsx(i,{title:"Primary — define o padrão",code:`@Service
@Primary
public class EmailNotificador implements NotificadorService { ... }`}),e.jsx("h2",{children:"Scopes"}),e.jsxs("p",{children:["Por padrão, todo bean é ",e.jsx("strong",{children:"singleton"}),": uma única instância no contexto inteiro. Outros scopes:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"singleton"})," (padrão): um por contexto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"prototype"}),": nova instância a cada injeção/lookup."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"request"}),": uma por requisição HTTP (precisa contexto web)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"session"}),": uma por sessão HTTP."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"application"}),": uma por ",e.jsx("code",{children:"ServletContext"}),"."]})]}),e.jsx(i,{code:`@Service
@Scope("prototype")
public class GeradorRelatorio {
    // cada chamador recebe sua própria cópia
}`}),e.jsxs(o,{type:"warning",title:"Cuidado: estado em singleton",children:["Como singleton é compartilhado entre threads, ",e.jsx("strong",{children:"não guarde estado mutável"})," em campos. Senão duas requisições simultâneas pisam no pé uma da outra. Use variáveis locais ou ",e.jsx("code",{children:"ThreadLocal"}),"."]}),e.jsx("h2",{children:"Lifecycle: @PostConstruct e @PreDestroy"}),e.jsx("p",{children:"Quer rodar código quando o bean é criado (cache warm-up, validação de config) ou destruído (fechar conexão)? Anote métodos:"}),e.jsx(i,{code:`@Service
public class CacheService {

    @PostConstruct
    public void aoIniciar() {
        System.out.println("Carregando cache do disco...");
    }

    @PreDestroy
    public void aoEncerrar() {
        System.out.println("Salvando cache no disco...");
    }
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@PostConstruct"})," roda ",e.jsx("strong",{children:"depois"})," da injeção das dependências (se rodasse no construtor, elas ainda seriam null em alguns casos). ",e.jsx("code",{children:"@PreDestroy"})," roda quando o contexto é fechado (Ctrl+C / shutdown)."]}),e.jsx("h2",{children:"Inspecionando o contexto"}),e.jsx(i,{code:`@SpringBootApplication
public class App implements CommandLineRunner {

    private final ApplicationContext ctx;

    public App(ApplicationContext ctx) { this.ctx = ctx; }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override
    public void run(String... args) {
        Arrays.stream(ctx.getBeanDefinitionNames())
              .sorted()
              .forEach(System.out::println);
    }
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma interface ",e.jsx("code",{children:"SaudacaoService"})," com duas implementações (",e.jsx("code",{children:"SaudacaoFormal"}),", ",e.jsx("code",{children:"SaudacaoInformal"}),"). Use ",e.jsx("code",{children:"@Primary"})," para definir uma como padrão e ",e.jsx("code",{children:"@Qualifier"})," para usar a outra explicitamente em outro bean."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"@Service"})," com ",e.jsx("code",{children:"@PostConstruct"}),' que imprime "Iniciado!" e ',e.jsx("code",{children:"@PreDestroy"}),' que imprime "Encerrado!". Suba e desça a aplicação (Ctrl+C) para ver os dois.']}),e.jsxs("li",{children:["Refatore um service existente que usa ",e.jsx("code",{children:"@Autowired"})," em campo para usar injeção via construtor com campos ",e.jsx("code",{children:"final"}),". Note como o teste unitário fica trivial."]})]})]})}export{n as default};
