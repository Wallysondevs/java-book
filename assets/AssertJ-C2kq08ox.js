import{j as e}from"./index-BpXci30S.js";import{P as t,A as a}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(t,{title:"AssertJ: assertions fluentes",subtitle:"Asserts legíveis e poderosos — substitui assertEquals por completo.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Olhe esse teste com JUnit puro:"}),e.jsx(s,{code:`assertEquals(3, lista.size());
assertTrue(lista.contains("ana"));
assertNotNull(usuario);
assertTrue(usuario.getEmail().endsWith("@gmail.com"));`}),e.jsxs("p",{children:["Quando falha, a mensagem é genérica (",e.jsx("em",{children:'"expected: 3 but was: 2"'})," — mas qual lista mesmo?). E você precisa lembrar a ordem dos parâmetros toda vez (esperado vs real — quem nunca inverteu?)."]}),e.jsxs("p",{children:["AssertJ inverte o jogo: você começa pelo valor real e encadeia asserts que ",e.jsx("strong",{children:"se leem como inglês"}),", com mensagens de erro ricas de graça."]}),e.jsx(s,{code:`assertThat(lista).hasSize(3).contains("ana");
assertThat(usuario).isNotNull();
assertThat(usuario.getEmail()).endsWith("@gmail.com");`}),e.jsx("h2",{children:"Setup"}),e.jsx(s,{title:"pom.xml",code:`<dependency>
  <groupId>org.assertj</groupId>
  <artifactId>assertj-core</artifactId>
  <version>3.26.3</version>
  <scope>test</scope>
</dependency>`}),e.jsx("p",{children:"Spring Boot Starter Test já inclui AssertJ. Só importe estaticamente:"}),e.jsx(s,{code:"import static org.assertj.core.api.Assertions.*;"}),e.jsx("h2",{children:"Básico: igualdade, nulidade, tipo"}),e.jsx(s,{code:`assertThat(idade).isEqualTo(30);
assertThat(idade).isGreaterThan(18).isLessThan(120);
assertThat(usuario).isNotNull();
assertThat(usuario).isInstanceOf(Admin.class);
assertThat(senha).isEqualTo("123").isNotBlank();`}),e.jsx("h2",{children:"Coleções: o ponto forte"}),e.jsx(s,{code:`List<String> nomes = List.of("ana", "bruno", "carla");

assertThat(nomes).hasSize(3);
assertThat(nomes).contains("ana", "bruno");          // tem esses (em qualquer ordem)
assertThat(nomes).containsExactly("ana", "bruno", "carla");  // ordem importa
assertThat(nomes).containsExactlyInAnyOrder("carla", "ana", "bruno");
assertThat(nomes).doesNotContain("zico");
assertThat(nomes).anyMatch(n -> n.startsWith("a"));
assertThat(nomes).allMatch(n -> n.length() > 2);`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"extracting"})," mapeia um campo dos elementos antes do assert — ótimo para listas de objetos:"]}),e.jsx(s,{code:`List<Usuario> users = service.listarAtivos();

assertThat(users)
    .extracting(Usuario::getEmail)
    .containsExactlyInAnyOrder("ana@x.com", "bruno@x.com");

// Múltiplos campos como tupla:
assertThat(users)
    .extracting("nome", "idade")
    .contains(tuple("Ana", 30), tuple("Bruno", 25));`}),e.jsx("h2",{children:"Strings"}),e.jsx(s,{code:`assertThat(texto).contains("erro").doesNotContain("sucesso");
assertThat(texto).startsWith("ERRO:").endsWith(".");
assertThat(texto).isEqualToIgnoringCase("OLA MUNDO");
assertThat(texto).matches("\\\\d{3}-\\\\d{4}"); // regex
assertThat(texto).hasSize(11).isNotBlank();`}),e.jsx("h2",{children:"Números (e o cuidado com float)"}),e.jsx(s,{code:`assertThat(0.1 + 0.2).isCloseTo(0.3, within(0.0001));
assertThat(preco).isPositive().isLessThanOrEqualTo(1000);
assertThat(BigDecimal.valueOf(10.00))
    .isEqualByComparingTo("10.0"); // ignora escala`}),e.jsxs(a,{type:"warning",title:"Nunca compare float com isEqualTo",children:[e.jsx("code",{children:"0.1 + 0.2"})," não é exatamente ",e.jsx("code",{children:"0.3"})," em IEEE 754. Sempre use ",e.jsx("code",{children:"isCloseTo"})," com um delta para floats/doubles."]}),e.jsx("h2",{children:"Exceções fluentes"}),e.jsx(s,{code:`assertThatThrownBy(() -> service.buscar(null))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessage("id não pode ser nulo")
    .hasMessageContaining("nulo");

// Atalho para tipos específicos:
assertThatNullPointerException()
    .isThrownBy(() -> service.buscar(null));

// Garante que NÃO lança:
assertThatNoException().isThrownBy(() -> service.buscar(1L));`}),e.jsx("h2",{children:"Soft assertions: ver todos os erros de uma vez"}),e.jsxs("p",{children:["Por padrão o teste para no primeiro ",e.jsx("code",{children:"fail"}),". Às vezes você quer ver todos os problemas de uma vez (formulário, DTO grande):"]}),e.jsx(s,{code:`@Test
void validaUsuarioCompleto() {
    Usuario u = service.buscar(1L);

    SoftAssertions.assertSoftly(softly -> {
        softly.assertThat(u.getNome()).isEqualTo("Ana");
        softly.assertThat(u.getIdade()).isEqualTo(30);
        softly.assertThat(u.getEmail()).endsWith("@x.com");
        softly.assertThat(u.isAtivo()).isTrue();
    });
    // se 3 falharem, você vê os 3 no relatório
}`}),e.jsxs("h2",{children:["Mensagens custom com ",e.jsx("code",{children:".as(...)"})]}),e.jsx(s,{code:`assertThat(usuario.isAtivo())
    .as("Usuário %s deveria estar ativo", usuario.getEmail())
    .isTrue();`}),e.jsxs("p",{children:["Quando falhar, o relatório mostra ",e.jsx("em",{children:'"Usuário ana@x.com deveria estar ativo"'})," em vez de só ",e.jsx("em",{children:'"expected true but was false"'}),". Diferença gigante quando o teste roda no CI às 3h da manhã."]}),e.jsx(a,{type:"tip",title:"Migrar gradual",children:"Você pode misturar JUnit asserts e AssertJ no mesmo projeto. Comece nos testes novos, e quando tocar em testes antigos, converta. Não precisa big bang."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Reescreva 3 testes existentes do seu projeto em AssertJ. Compare a mensagem de erro forçando uma falha."}),e.jsxs("li",{children:["Crie um teste com ",e.jsx("code",{children:"extracting"})," sobre uma lista de ",e.jsx("code",{children:"Pedido"}),", validando que existe um pedido com ",e.jsx("code",{children:'cliente="Ana"'})," e ",e.jsx("code",{children:"total=99.90"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"SoftAssertions"})," num DTO de cadastro com 5 campos. Quebre 2 deles de propósito e veja o relatório listar os 2."]})]})]})}export{n as default};
