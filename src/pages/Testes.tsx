import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function Testes() {
  return (
    <PageContainer
      title="Testes com JUnit 5"
      subtitle="Testes unitários, @Test, assertions, @BeforeEach/@AfterEach, testes parametrizados e Mockito."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        Testes unitários são fundamentais para código confiável e sustentável. JUnit 5 é o framework
        de testes padrão no ecossistema Java. Mockito é a biblioteca de mocking mais popular.
      </p>

      <h2>1. Configuração com Maven</h2>
      <CodeBlock
        language="xml"
        title="pom.xml — dependências de teste"
        code={`<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>

    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>5.11.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <version>5.11.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.2.5</version>
        </plugin>
    </plugins>
</build>`}
      />

      <h2>2. Primeiro Teste com JUnit 5</h2>
      <CodeBlock
        language="java"
        title="CalculadoraTest.java"
        code={`import org.junit.jupiter.api.*;
import org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculadoraTest {

    private Calculadora calc;

    @BeforeEach
    void setUp() {
        calc = new Calculadora(); // cria instância antes de cada teste
    }

    @AfterEach
    void tearDown() {
        // limpeza após cada teste
    }

    @BeforeAll
    static void setUpAll() {
        System.out.println("Iniciando suite de testes"); // executa uma vez antes de todos
    }

    @Test
    void deveSomarDoisNumeros() {
        int resultado = calc.somar(2, 3);
        assertEquals(5, resultado, "2 + 3 deve ser 5");
    }

    @Test
    void deveDividir() {
        assertEquals(2.5, calc.dividir(5, 2), 0.001); // delta para doubles
    }

    @Test
    void deveLancarExcecaoAoDividirPorZero() {
        assertThrows(ArithmeticException.class, () -> calc.dividir(10, 0));
    }

    @Test
    @DisplayName("Calcula raiz quadrada corretamente")
    void deveCalcularRaizQuadrada() {
        assertEquals(3.0, Math.sqrt(9), 0.001);
    }

    @Test
    @Disabled("Funcionalidade ainda não implementada")
    void deveMostrarHistorico() { }
}`}
      />

      <h2>3. Assertions do JUnit 5</h2>
      <CodeBlock
        language="java"
        code={`// Assertions básicas
assertEquals(expected, actual);
assertEquals(3.14, valor, 0.001);  // com delta para doubles
assertNotEquals(expected, actual);
assertTrue(condicao);
assertFalse(condicao);
assertNull(objeto);
assertNotNull(objeto);

// Assertions de coleções
assertIterableEquals(esperado, atual); // ordem importa
assertArrayEquals(new int[]{1,2,3}, array);

// assertAll — executa todos mesmo se algum falhar
assertAll("dados do usuário",
    () -> assertEquals("Ana", usuario.getNome()),
    () -> assertEquals(30, usuario.getIdade()),
    () -> assertNotNull(usuario.getEmail())
);

// Exceções
Exception ex = assertThrows(IllegalArgumentException.class,
    () -> service.validar(null));
assertEquals("Nome não pode ser null", ex.getMessage());

assertDoesNotThrow(() -> service.salvar(usuario));

// Timeout (Java não executa o teste mais que o tempo especificado)
assertTimeout(Duration.ofMillis(100), () -> {
    // operação que deve ser rápida
    processarDados();
});`}
      />

      <h2>4. Testes Parametrizados</h2>
      <CodeBlock
        language="java"
        code={`import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

class ValidadorTest {

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "  \t\n"})
    void deveRejeitarTextoVazio(String texto) {
        assertFalse(Validador.isValido(texto));
    }

    @ParameterizedTest
    @CsvSource({
        "2, 3, 5",
        "10, -5, 5",
        "0, 0, 0"
    })
    void deveSomarCorretamente(int a, int b, int esperado) {
        assertEquals(esperado, calc.somar(a, b));
    }

    @ParameterizedTest
    @MethodSource("provedorDeEmails")
    void deveValidarEmail(String email, boolean esperado) {
        assertEquals(esperado, Validador.isEmailValido(email));
    }

    static Stream<Arguments> provedorDeEmails() {
        return Stream.of(
            Arguments.of("user@example.com", true),
            Arguments.of("invalido", false),
            Arguments.of("", false)
        );
    }
}`}
      />

      <h2>5. Mockito — Simulando Dependências</h2>
      <CodeBlock
        language="java"
        code={`import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository repository;  // mock automático

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PedidoService pedidoService; // injeta os mocks automaticamente

    @Test
    void deveSalvarPedidoEEnviarEmail() {
        // Arrange — configurar comportamento dos mocks
        Pedido pedido = new Pedido("cliente@email.com", 150.0);
        when(repository.save(any(Pedido.class))).thenReturn(pedido);

        // Act — executar a ação
        pedidoService.criarPedido(pedido);

        // Assert — verificar o que aconteceu
        verify(repository).save(pedido);       // foi chamado 1x com esse objeto
        verify(emailService).enviarConfirmacao("cliente@email.com");
        verifyNoMoreInteractions(emailService); // sem chamadas extras

        // Verificar exceção
        when(repository.save(null)).thenThrow(new IllegalArgumentException());
        assertThrows(IllegalArgumentException.class,
            () -> pedidoService.criarPedido(null));
    }
}`}
      />

      <ParamTable
        comando="Anotações JUnit 5"
        descricaoHelp="Principais anotações do JUnit Jupiter (JUnit 5) para organizar e configurar testes."
        params={[
          { flag: "@Test", descricao: "Marca um método como teste. O método não deve ter parâmetros nem retorno.", exemplo: "@Test void meuTeste() {}" },
          { flag: "@DisplayName", descricao: "Define um nome legível para o teste mostrado nos relatórios.", exemplo: "@DisplayName(\"Deve somar\")" },
          { flag: "@BeforeEach", descricao: "Executa antes de CADA método @Test. Usa para reset/setup de estado.", exemplo: "@BeforeEach void setUp() {}" },
          { flag: "@AfterEach", descricao: "Executa após cada @Test. Usa para limpeza (fechar recursos, etc.).", exemplo: "@AfterEach void tearDown() {}" },
          { flag: "@BeforeAll", descricao: "Executa UMA VEZ antes de todos os testes da classe. Deve ser static.", exemplo: "@BeforeAll static void init() {}" },
          { flag: "@AfterAll", descricao: "Executa uma vez após todos os testes. Deve ser static.", exemplo: "@AfterAll static void cleanup() {}" },
          { flag: "@Disabled", descricao: "Desativa o teste temporariamente. Use com justificativa.", exemplo: "@Disabled(\"Bug #123\")" },
          { flag: "@ParameterizedTest", descricao: "Executa o teste múltiplas vezes com diferentes argumentos.", exemplo: "@ParameterizedTest @ValueSource(...)" },
          { flag: "@Nested", descricao: "Agrupa testes relacionados em uma classe interna.", exemplo: "@Nested class QuandoVazio {}" },
          { flag: "@Tag", descricao: "Classifica testes para execução seletiva.", exemplo: "@Tag(\"integracao\")" },
        ]}
      />
    </PageContainer>
  );
}
