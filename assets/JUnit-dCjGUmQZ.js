import{j as e}from"./index-BpXci30S.js";import{P as o,A as a}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(o,{title:"JUnit 5",subtitle:"Framework de teste padrão — escreva testes que documentam seu código.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:'Testar manualmente cada vez que você muda o código é insuportável e impreciso. Testes automatizados rodam em segundos, garantem que nada regrediu, e funcionam como documentação executável: "esse método se comporta assim, prova aqui". JUnit 5 (também chamado de "Jupiter") é o padrão absoluto pra testes em Java.'}),e.jsx("h2",{children:"Adicionando JUnit"}),e.jsx(s,{title:"Maven",code:`<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.3</version>
    <scope>test</scope>
</dependency>`}),e.jsx(s,{title:"Gradle (Kotlin DSL)",code:`testImplementation("org.junit.jupiter:junit-jupiter:5.10.3")
testRuntimeOnly("org.junit.platform:junit-platform-launcher")

tasks.test {
    useJUnitPlatform()
}`}),e.jsx("h2",{children:"Estrutura de uma classe de teste"}),e.jsxs("p",{children:["Convenção: pra cada classe ",e.jsx("code",{children:"src/main/java/.../Calculadora.java"}),"existe uma ",e.jsx("code",{children:"src/test/java/.../CalculadoraTest.java"})," no mesmo pacote. Métodos de teste são ",e.jsx("code",{children:"void"}),", sem argumentos (em testes simples), anotados com ",e.jsx("code",{children:"@Test"}),". Não precisa ser",e.jsx("code",{children:"public"})," — pacote-privado funciona e até é mais comum."]}),e.jsx(s,{title:"Primeiro teste",code:`package com.exemplo;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculadoraTest {

    @Test
    void somaDoisInteirosPositivos() {
        Calculadora calc = new Calculadora();
        int resultado = calc.somar(2, 3);
        assertEquals(5, resultado);
    }
}`}),e.jsx("h2",{children:"Assertions"}),e.jsxs("p",{children:["Importe estaticamente ",e.jsx("code",{children:"org.junit.jupiter.api.Assertions.*"})," e as principais são auto-explicativas:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"assertEquals(esperado, real)"})," — igualdade (com ",e.jsx("code",{children:".equals"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"assertTrue(condicao)"})," / ",e.jsx("code",{children:"assertFalse(condicao)"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"assertNull(obj)"})," / ",e.jsx("code",{children:"assertNotNull(obj)"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"assertThrows(Excecao.class, () -> ...)"})," — verifica que uma operação lança a exceção esperada."]}),e.jsxs("li",{children:[e.jsx("code",{children:"assertAll(...)"})," — agrupa várias asserts; ",e.jsx("em",{children:"todas"})," rodam mesmo se uma falhar (relatório completo)."]})]}),e.jsx(s,{title:"Exemplos de asserts",code:`@Test
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
}`}),e.jsxs(a,{type:"tip",title:"Mensagem como último argumento",children:["Toda assert aceita uma string final com a mensagem que aparece se falhar: ",e.jsx("code",{children:'assertEquals(5, x, "soma deveria devolver 5")'}),". Útil quando você tem várias asserts iguais."]}),e.jsx("h2",{children:"Ciclo de vida"}),e.jsx("p",{children:"Pra preparar/limpar estado entre testes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"@BeforeEach"})," — roda antes de cada ",e.jsx("code",{children:"@Test"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@AfterEach"})," — roda depois de cada ",e.jsx("code",{children:"@Test"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@BeforeAll"})," — roda uma única vez antes da classe (método",e.jsx("code",{children:"static"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@AfterAll"})," — roda uma única vez no fim (também ",e.jsx("code",{children:"static"}),")."]})]}),e.jsx(s,{title:"Setup compartilhado",code:`class CarrinhoTest {

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
}`}),e.jsx("h2",{children:"@DisplayName em PT-BR"}),e.jsxs("p",{children:["Por padrão, o nome do teste no relatório é o nome do método. Use ",e.jsx("code",{children:"@DisplayName"})," pra deixar legível em português:"]}),e.jsx(s,{title:"Nomes amigáveis",code:`@Test
@DisplayName("Carrinho deve começar vazio")
void carrinhoComecaVazio() { ... }

@Test
@DisplayName("Não permite saldo negativo")
void naoPermiteNegativo() { ... }`}),e.jsx("h2",{children:"Testes parametrizados"}),e.jsxs("p",{children:["Em vez de copiar o mesmo teste várias vezes com valores diferentes, use ",e.jsx("code",{children:"@ParameterizedTest"})," e uma fonte de dados."]}),e.jsx(s,{title:"@ValueSource",code:`import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@ParameterizedTest
@ValueSource(ints = {2, 4, 6, 100, 0, -2})
void numerosPares(int n) {
    assertTrue(n % 2 == 0);
}`}),e.jsx(s,{title:"@CsvSource",code:`import org.junit.jupiter.params.provider.CsvSource;

@ParameterizedTest(name = "{0} + {1} = {2}")
@CsvSource({
    "1, 1, 2",
    "2, 3, 5",
    "10, 20, 30",
    "0, 0, 0"
})
void soma(int a, int b, int esperado) {
    assertEquals(esperado, new Calculadora().somar(a, b));
}`}),e.jsx(s,{title:"@MethodSource (entrada complexa)",code:`import org.junit.jupiter.params.provider.MethodSource;
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
}`}),e.jsx("h2",{children:"@Disabled e Assumptions"}),e.jsxs("p",{children:[e.jsx("code",{children:'@Disabled("motivo")'})," pula um teste (use com moderação — teste pulado é problema escondido). Pra pular condicionalmente, use ",e.jsx("code",{children:"Assumptions"}),":"]}),e.jsx(s,{title:"Assumindo condição",code:`import static org.junit.jupiter.api.Assumptions.*;

@Test
void rodaSoNoLinux() {
    assumeTrue(System.getProperty("os.name").startsWith("Linux"),
               "Esse teste só faz sentido em Linux");
    // ... teste segue normalmente se a assumption passou
}`}),e.jsx("h2",{children:"@Nested para agrupar"}),e.jsxs("p",{children:["Quando uma classe tem muitos testes, agrupe por contexto com classes internas anotadas com ",e.jsx("code",{children:"@Nested"}),":"]}),e.jsx(s,{title:"Estrutura aninhada",code:`class ContaBancariaTest {

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
}`}),e.jsxs(a,{type:"info",title:"Boa prática: 1 assert por teste (idealmente)",children:["Não é regra absoluta, mas se um teste falhar com 5 asserts, fica difícil entender qual quebrou. Prefira testes pequenos e focados — ou use ",e.jsx("code",{children:"assertAll"}),"."]}),e.jsx("h2",{children:"Rodando os testes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Maven: ",e.jsx("code",{children:"mvn test"})]}),e.jsxs("li",{children:["Gradle: ",e.jsx("code",{children:"./gradlew test"})]}),e.jsx("li",{children:"IDE (IntelliJ, Eclipse, VS Code): clique direito na classe ou método."})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Calculadora"})," com ",e.jsx("code",{children:"somar, subtrair, multiplicar, dividir"}),". Escreva pelo menos 6 testes cobrindo casos normais e divisão por zero."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"@ParameterizedTest"})," com ",e.jsx("code",{children:"@CsvSource"})," pra testar uma função ",e.jsx("code",{children:"ehPalindromo(String s)"})," com pelo menos 5 entradas (positivas e negativas)."]}),e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Carrinho"})," com ",e.jsx("code",{children:"adicionar, remover, total"}),". Use ",e.jsx("code",{children:"@BeforeEach"})," pra criar um carrinho novo a cada teste, e organize os testes em dois ",e.jsx("code",{children:"@Nested"}),': "Carrinho vazio" e "Carrinho com itens".']})]})]})}export{d as default};
