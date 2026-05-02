import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringBeans() {
  return (
    <PageContainer title="Beans, Injeção e Lifecycle no Spring" subtitle="@Component, @Service, @Repository, @Configuration — o coração do IoC." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Sem Spring, em algum lugar do seu código tem <code>new ServicoX(new RepositorioY(new DataSource(...)))</code>. Cada classe precisa saber montar suas dependências. Spring inverte isso: você <strong>declara</strong> que precisa de um <code>ServicoX</code> e o framework te entrega instanciado, com tudo plugado. Isso é <em>Inversion of Control</em> (IoC), e a entrega é <em>Dependency Injection</em> (DI).
        </p><p>
          Resultado: classes desacopladas, fáceis de testar (você troca a dependência real por um mock no teste sem mudar uma linha do código de produção).
        </p><h2>ApplicationContext: o container</h2><p>
          Quando o Spring inicia, ele cria um <code>ApplicationContext</code> — um Map enorme de "nome → objeto". Esses objetos são os <strong>beans</strong>. O contexto sabe criar, injetar, gerenciar ciclo de vida e destruir cada um.
        </p><h2>Estereótipos: marcando o que é bean</h2><p>
          Você não cria beans com <code>new</code>. Você anota a classe e o Spring descobre via <code>@ComponentScan</code>:
        </p><ul>
          <li>
            <strong>
              <code>@Component</code>
            </strong> — genérico, qualquer bean.
          </li><li>
            <strong>
              <code>@Service</code>
            </strong> — semanticamente: lógica de negócio.
          </li><li>
            <strong>
              <code>@Repository</code>
            </strong> — persistência. Bônus: traduz exceções de JDBC/JPA para <code>DataAccessException</code> do Spring.
          </li><li>
            <strong>
              <code>@Controller</code>
            </strong> / <strong>
              <code>@RestController</code>
            </strong> — camada web.
          </li><li>
            <strong>
              <code>@Configuration</code>
            </strong> — fábrica de beans (ver abaixo).
          </li>
        </ul><p>
          Tecnicamente, todos derivam de <code>@Component</code>. A diferença é semântica e algumas funcionalidades extras.
        </p><CodeBlock code={`@Service
public class CalculadoraService {
    public BigDecimal calcularImposto(BigDecimal valor) {
        return valor.multiply(new BigDecimal("0.15"));
    }
}`} /><h2>@Configuration + @Bean</h2><p>
          Quando você precisa de um bean que <strong>não é uma classe sua</strong> (ex.: um <code>RestClient</code>, um <code>ObjectMapper</code> customizado), use <code>@Bean</code> dentro de uma <code>@Configuration</code>:
        </p><CodeBlock code={`@Configuration
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
}`} /><h2>Injeção de dependência: 3 jeitos</h2><h3>1. Construtor (PREFERIDO)</h3><CodeBlock code={`@Service
public class PedidoService {

    private final UsuarioRepository usuarios;
    private final EmailService email;

    public PedidoService(UsuarioRepository usuarios, EmailService email) {
        this.usuarios = usuarios;
        this.email = email;
    }
}`} /><p>
          Por que é o melhor: campos podem ser <code>final</code> (imutáveis), o objeto é criado já consistente, e em <strong>teste unitário</strong> você instancia direto: <code>new PedidoService(mockRepo, mockEmail)</code> — sem framework.
        </p><AlertBox type="tip" title="Atalho com Lombok">
          <code>@RequiredArgsConstructor</code> do Lombok gera o construtor com todos os campos <code>final</code>. Bem comum em código moderno de Spring.
        </AlertBox><h3>2. Setter</h3><CodeBlock code={`@Service
public class PedidoService {
    private EmailService email;

    @Autowired
    public void setEmail(EmailService email) { this.email = email; }
}`} /><p>Útil para dependências opcionais ou para quebrar ciclos. Pouco comum hoje.</p><h3>3. Campo (EVITE)</h3><CodeBlock code={`@Service
public class PedidoService {
    @Autowired
    private EmailService email;   // ruim
}`} /><p>
          Parece menos código, mas: campo não pode ser <code>final</code>, dá pra esquecer de injetar em testes (vira <code>NullPointerException</code>), esconde dependências (alguém olha o construtor e acha que a classe não precisa de nada).
        </p><h2>@Qualifier e @Primary</h2><p>E se houver duas implementações da mesma interface?</p><CodeBlock code={`public interface NotificadorService { void enviar(String msg); }

@Service
public class EmailNotificador implements NotificadorService { ... }

@Service
public class SmsNotificador implements NotificadorService { ... }

@Service
public class AlertaService {
    public AlertaService(NotificadorService n) { ... }   // BOOM: ambíguo
}`} /><p>Soluções:</p><CodeBlock title="Qualifier — escolhe na injeção" code={`@Service
public class AlertaService {
    public AlertaService(@Qualifier("emailNotificador") NotificadorService n) { ... }
}`} /><CodeBlock title="Primary — define o padrão" code={`@Service
@Primary
public class EmailNotificador implements NotificadorService { ... }`} /><h2>Scopes</h2><p>
          Por padrão, todo bean é <strong>singleton</strong>: uma única instância no contexto inteiro. Outros scopes:
        </p><ul>
          <li>
            <strong>singleton</strong> (padrão): um por contexto.
          </li><li>
            <strong>prototype</strong>: nova instância a cada injeção/lookup.
          </li><li>
            <strong>request</strong>: uma por requisição HTTP (precisa contexto web).
          </li><li>
            <strong>session</strong>: uma por sessão HTTP.
          </li><li>
            <strong>application</strong>: uma por <code>ServletContext</code>.
          </li>
        </ul><CodeBlock code={`@Service
@Scope("prototype")
public class GeradorRelatorio {
    // cada chamador recebe sua própria cópia
}`} /><AlertBox type="warning" title="Cuidado: estado em singleton">
          Como singleton é compartilhado entre threads, <strong>não guarde estado mutável</strong> em campos. Senão duas requisições simultâneas pisam no pé uma da outra. Use variáveis locais ou <code>ThreadLocal</code>.
        </AlertBox><h2>Lifecycle: @PostConstruct e @PreDestroy</h2><p>
          Quer rodar código quando o bean é criado (cache warm-up, validação de config) ou destruído (fechar conexão)? Anote métodos:
        </p><CodeBlock code={`@Service
public class CacheService {

    @PostConstruct
    public void aoIniciar() {
        System.out.println("Carregando cache do disco...");
    }

    @PreDestroy
    public void aoEncerrar() {
        System.out.println("Salvando cache no disco...");
    }
}`} /><p>
          <code>@PostConstruct</code> roda <strong>depois</strong> da injeção das dependências (se rodasse no construtor, elas ainda seriam null em alguns casos). <code>@PreDestroy</code> roda quando o contexto é fechado (Ctrl+C / shutdown).
        </p><h2>Inspecionando o contexto</h2><CodeBlock code={`@SpringBootApplication
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
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma interface <code>SaudacaoService</code> com duas implementações (<code>SaudacaoFormal</code>, <code>SaudacaoInformal</code>). Use <code>@Primary</code> para definir uma como padrão e <code>@Qualifier</code> para usar a outra explicitamente em outro bean.
          </li><li>
            Crie um <code>@Service</code> com <code>@PostConstruct</code> que imprime "Iniciado!" e <code>@PreDestroy</code> que imprime "Encerrado!". Suba e desça a aplicação (Ctrl+C) para ver os dois.
          </li><li>
            Refatore um service existente que usa <code>@Autowired</code> em campo para usar injeção via construtor com campos <code>final</code>. Note como o teste unitário fica trivial.
          </li>
        </ol>
      </PageContainer>
  );
}
