import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JUnit() {
  return (
    <PageContainer title="JUnit 5" subtitle="Framework de teste padrão — escreva testes que documentam seu código." difficulty="intermediario" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Testar manualmente cada vez que você muda o código é insuportável e impreciso. Testes automatizados rodam em segundos, garantem que nada regrediu, e funcionam como documentação executável: "esse método se comporta assim, prova aqui". JUnit 5 (também chamado de "Jupiter") é o padrão absoluto pra testes em Java.
        </p><h2>Adicionando JUnit</h2><CodeBlock title="Maven" code={`<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.3</version>
    <scope>test</scope>
</dependency>`} /><CodeBlock title="Gradle (Kotlin DSL)" code={`testImplementation("org.junit.jupiter:junit-jupiter:5.10.3")
testRuntimeOnly("org.junit.platform:junit-platform-launcher")

tasks.test {
    useJUnitPlatform()
}`} /><h2>Estrutura de uma classe de teste</h2><p>
          Convenção: pra cada classe <code>src/main/java/.../Calculadora.java</code>existe uma <code>src/test/java/.../CalculadoraTest.java</code> no mesmo pacote. Métodos de teste são <code>void</code>, sem argumentos (em testes simples), anotados com <code>@Test</code>. Não precisa ser<code>public</code> — pacote-privado funciona e até é mais comum.
        </p><CodeBlock title="Primeiro teste" code={`package com.exemplo;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculadoraTest {

    @Test
    void somaDoisInteirosPositivos() {
        Calculadora calc = new Calculadora();
        int resultado = calc.somar(2, 3);
        assertEquals(5, resultado);
    }
}`} /><h2>Assertions</h2><p>
          Importe estaticamente <code>org.junit.jupiter.api.Assertions.*</code> e as principais são auto-explicativas:
        </p><ul>
          <li>
            <code>assertEquals(esperado, real)</code> — igualdade (com <code>.equals</code>).
          </li><li>
            <code>assertTrue(condicao)</code> / <code>assertFalse(condicao)</code>
          </li><li>
            <code>assertNull(obj)</code> / <code>assertNotNull(obj)</code>
          </li><li>
            <code>{"assertThrows(Excecao.class, () -> ...)"}</code> — verifica que uma operação lança a exceção esperada.
          </li><li>
            <code>assertAll(...)</code> — agrupa várias asserts; <em>todas</em> rodam mesmo se uma falhar (relatório completo).
          </li>
        </ul><CodeBlock title="Exemplos de asserts" code={`@Test
void divisaoPorZeroLancaExcecao() {
    Calculadora calc = new Calculadora();
    assertThrows(ArithmeticException.class, () -> calc.dividir(10, 0));
}

@Test
void usuarioCriadoTemCamposCorretos() {
    Usuario u = new Usuario(1, "Ana", "ana@x.com");

    assertAll("Usuário",
        () -> assertEquals(1, u.id()),
        () -> assertEquals("Ana", u.nome()),
        () -> assertNotNull(u.email())
    );
}`} /><AlertBox type="tip" title="Mensagem como último argumento">
          Toda assert aceita uma string final com a mensagem que aparece se falhar: <code>assertEquals(5, x, "soma deveria devolver 5")</code>. Útil quando você tem várias asserts iguais.
        </AlertBox><h2>Ciclo de vida</h2><p>Pra preparar/limpar estado entre testes:</p><ul>
          <li>
            <code>@BeforeEach</code> — roda antes de cada <code>@Test</code>.
          </li><li>
            <code>@AfterEach</code> — roda depois de cada <code>@Test</code>.
          </li><li>
            <code>@BeforeAll</code> — roda uma única vez antes da classe (método<code>static</code>).
          </li><li>
            <code>@AfterAll</code> — roda uma única vez no fim (também <code>static</code>).
          </li>
        </ul><CodeBlock title="Setup compartilhado" code={`class CarrinhoTest {

    private Carrinho carrinho;

    @BeforeEach
    void criarCarrinho() {
        carrinho = new Carrinho();
    }

    @Test
    void carrinhoComecaVazio() {
        assertEquals(0, carrinho.tamanho());
    }

    @Test
    void aoAdicionarItemTamanhoAumenta() {
        carrinho.adicionar(new Item("Café", 15.0));
        assertEquals(1, carrinho.tamanho());
    }
}`} /><h2>@DisplayName em PT-BR</h2><p>
          Por padrão, o nome do teste no relatório é o nome do método. Use <code>@DisplayName</code> pra deixar legível em português:
        </p><CodeBlock title="Nomes amigáveis" code={`@Test
@DisplayName("Carrinho deve começar vazio")
void carrinhoComecaVazio() { ... }

@Test
@DisplayName("Não permite saldo negativo")
void naoPermiteNegativo() { ... }`} /><h2>Testes parametrizados</h2><p>
          Em vez de copiar o mesmo teste várias vezes com valores diferentes, use <code>@ParameterizedTest</code> e uma fonte de dados.
        </p><CodeBlock title="@ValueSource" code={`import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@ParameterizedTest
@ValueSource(ints = {2, 4, 6, 100, 0, -2})
void numerosPares(int n) {
    assertTrue(n % 2 == 0);
}`} /><CodeBlock title="@CsvSource" code={`import org.junit.jupiter.params.provider.CsvSource;

@ParameterizedTest(name = "{0} + {1} = {2}")
@CsvSource({
    "1, 1, 2",
    "2, 3, 5",
    "10, 20, 30",
    "0, 0, 0"
})
void soma(int a, int b, int esperado) {
    assertEquals(esperado, new Calculadora().somar(a, b));
}`} /><CodeBlock title="@MethodSource (entrada complexa)" code={`import org.junit.jupiter.params.provider.MethodSource;
import java.util.stream.Stream;

@ParameterizedTest
@MethodSource("usuariosInvalidos")
void rejeitaUsuariosInvalidos(String nome, String email) {
    assertThrows(IllegalArgumentException.class,
                 () -> new Usuario(1, nome, email));
}

static Stream<Object[]> usuariosInvalidos() {
    return Stream.of(
        new Object[] { "", "ok@x.com" },
        new Object[] { "Ana", "" },
        new Object[] { null, "ok@x.com" }
    );
}`} /><h2>@Disabled e Assumptions</h2><p>
          <code>@Disabled("motivo")</code> pula um teste (use com moderação — teste pulado é problema escondido). Pra pular condicionalmente, use <code>Assumptions</code>:
        </p><CodeBlock title="Assumindo condição" code={`import static org.junit.jupiter.api.Assumptions.*;

@Test
void rodaSoNoLinux() {
    assumeTrue(System.getProperty("os.name").startsWith("Linux"),
               "Esse teste só faz sentido em Linux");
    // ... teste segue normalmente se a assumption passou
}`} /><h2>@Nested para agrupar</h2><p>
          Quando uma classe tem muitos testes, agrupe por contexto com classes internas anotadas com <code>@Nested</code>:
        </p><CodeBlock title="Estrutura aninhada" code={`class ContaBancariaTest {

    @Nested
    @DisplayName("Quando saldo é zero")
    class QuandoSaldoZero {

        @Test
        @DisplayName("não permite saque")
        void semSaque() { ... }

        @Test
        @DisplayName("permite depósito")
        void comDeposito() { ... }
    }

    @Nested
    @DisplayName("Quando saldo é positivo")
    class QuandoSaldoPositivo { ... }
}`} /><AlertBox type="info" title="Boa prática: 1 assert por teste (idealmente)">
          Não é regra absoluta, mas se um teste falhar com 5 asserts, fica difícil entender qual quebrou. Prefira testes pequenos e focados — ou use <code>assertAll</code>.
        </AlertBox><h2>Rodando os testes</h2><ul>
          <li>
            Maven: <code>mvn test</code>
          </li><li>
            Gradle: <code>./gradlew test</code>
          </li><li>IDE (IntelliJ, Eclipse, VS Code): clique direito na classe ou método.</li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Calculadora</code> com <code>somar, subtrair, multiplicar, dividir</code>. Escreva pelo menos 6 testes cobrindo casos normais e divisão por zero.
          </li><li>
            Use <code>@ParameterizedTest</code> com <code>@CsvSource</code> pra testar uma função <code>ehPalindromo(String s)</code> com pelo menos 5 entradas (positivas e negativas).
          </li><li>
            Crie uma classe <code>Carrinho</code> com <code>adicionar, remover, total</code>. Use <code>@BeforeEach</code> pra criar um carrinho novo a cada teste, e organize os testes em dois <code>@Nested</code>: "Carrinho vazio" e "Carrinho com itens".
          </li>
        </ol>
      </PageContainer>
  );
}
