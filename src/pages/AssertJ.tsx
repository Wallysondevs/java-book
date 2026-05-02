import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AssertJ() {
  return (
    <PageContainer title="AssertJ: assertions fluentes" subtitle="Asserts legíveis e poderosos — substitui assertEquals por completo." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>Olhe esse teste com JUnit puro:</p><CodeBlock code={`assertEquals(3, lista.size());
assertTrue(lista.contains("ana"));
assertNotNull(usuario);
assertTrue(usuario.getEmail().endsWith("@gmail.com"));`} /><p>
          Quando falha, a mensagem é genérica (<em>"expected: 3 but was: 2"</em> — mas qual lista mesmo?). E você precisa lembrar a ordem dos parâmetros toda vez (esperado vs real — quem nunca inverteu?).
        </p><p>
          AssertJ inverte o jogo: você começa pelo valor real e encadeia asserts que <strong>se leem como inglês</strong>, com mensagens de erro ricas de graça.
        </p><CodeBlock code={`assertThat(lista).hasSize(3).contains("ana");
assertThat(usuario).isNotNull();
assertThat(usuario.getEmail()).endsWith("@gmail.com");`} /><h2>Setup</h2><CodeBlock title="pom.xml" code={`<dependency>
  <groupId>org.assertj</groupId>
  <artifactId>assertj-core</artifactId>
  <version>3.26.3</version>
  <scope>test</scope>
</dependency>`} /><p>Spring Boot Starter Test já inclui AssertJ. Só importe estaticamente:</p><CodeBlock code="import static org.assertj.core.api.Assertions.*;" /><h2>Básico: igualdade, nulidade, tipo</h2><CodeBlock code={`assertThat(idade).isEqualTo(30);
assertThat(idade).isGreaterThan(18).isLessThan(120);
assertThat(usuario).isNotNull();
assertThat(usuario).isInstanceOf(Admin.class);
assertThat(senha).isEqualTo("123").isNotBlank();`} /><h2>Coleções: o ponto forte</h2><CodeBlock code={`List<String> nomes = List.of("ana", "bruno", "carla");

assertThat(nomes).hasSize(3);
assertThat(nomes).contains("ana", "bruno");          // tem esses (em qualquer ordem)
assertThat(nomes).containsExactly("ana", "bruno", "carla");  // ordem importa
assertThat(nomes).containsExactlyInAnyOrder("carla", "ana", "bruno");
assertThat(nomes).doesNotContain("zico");
assertThat(nomes).anyMatch(n -> n.startsWith("a"));
assertThat(nomes).allMatch(n -> n.length() > 2);`} /><p>
          O <code>extracting</code> mapeia um campo dos elementos antes do assert — ótimo para listas de objetos:
        </p><CodeBlock code={`List<Usuario> users = service.listarAtivos();

assertThat(users)
    .extracting(Usuario::getEmail)
    .containsExactlyInAnyOrder("ana@x.com", "bruno@x.com");

// Múltiplos campos como tupla:
assertThat(users)
    .extracting("nome", "idade")
    .contains(tuple("Ana", 30), tuple("Bruno", 25));`} /><h2>Strings</h2><CodeBlock code={`assertThat(texto).contains("erro").doesNotContain("sucesso");
assertThat(texto).startsWith("ERRO:").endsWith(".");
assertThat(texto).isEqualToIgnoringCase("OLA MUNDO");
assertThat(texto).matches("\\\\d{3}-\\\\d{4}"); // regex
assertThat(texto).hasSize(11).isNotBlank();`} /><h2>Números (e o cuidado com float)</h2><CodeBlock code={`assertThat(0.1 + 0.2).isCloseTo(0.3, within(0.0001));
assertThat(preco).isPositive().isLessThanOrEqualTo(1000);
assertThat(BigDecimal.valueOf(10.00))
    .isEqualByComparingTo("10.0"); // ignora escala`} /><AlertBox type="warning" title="Nunca compare float com isEqualTo">
          <code>0.1 + 0.2</code> não é exatamente <code>0.3</code> em IEEE 754. Sempre use <code>isCloseTo</code> com um delta para floats/doubles.
        </AlertBox><h2>Exceções fluentes</h2><CodeBlock code={`assertThatThrownBy(() -> service.buscar(null))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessage("id não pode ser nulo")
    .hasMessageContaining("nulo");

// Atalho para tipos específicos:
assertThatNullPointerException()
    .isThrownBy(() -> service.buscar(null));

// Garante que NÃO lança:
assertThatNoException().isThrownBy(() -> service.buscar(1L));`} /><h2>Soft assertions: ver todos os erros de uma vez</h2><p>
          Por padrão o teste para no primeiro <code>fail</code>. Às vezes você quer ver todos os problemas de uma vez (formulário, DTO grande):
        </p><CodeBlock code={`@Test
void validaUsuarioCompleto() {
    Usuario u = service.buscar(1L);

    SoftAssertions.assertSoftly(softly -> {
        softly.assertThat(u.getNome()).isEqualTo("Ana");
        softly.assertThat(u.getIdade()).isEqualTo(30);
        softly.assertThat(u.getEmail()).endsWith("@x.com");
        softly.assertThat(u.isAtivo()).isTrue();
    });
    // se 3 falharem, você vê os 3 no relatório
}`} /><h2>
          Mensagens custom com <code>.as(...)</code>
        </h2><CodeBlock code={`assertThat(usuario.isAtivo())
    .as("Usuário %s deveria estar ativo", usuario.getEmail())
    .isTrue();`} /><p>
          Quando falhar, o relatório mostra <em>"Usuário ana@x.com deveria estar ativo"</em> em vez de só <em>"expected true but was false"</em>. Diferença gigante quando o teste roda no CI às 3h da manhã.
        </p><AlertBox type="tip" title="Migrar gradual">
          Você pode misturar JUnit asserts e AssertJ no mesmo projeto. Comece nos testes novos, e quando tocar em testes antigos, converta. Não precisa big bang.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Reescreva 3 testes existentes do seu projeto em AssertJ. Compare a mensagem de erro forçando uma falha.
          </li><li>
            Crie um teste com <code>extracting</code> sobre uma lista de <code>Pedido</code>, validando que existe um pedido com <code>cliente="Ana"</code> e <code>total=99.90</code>.
          </li><li>
            Use <code>SoftAssertions</code> num DTO de cadastro com 5 campos. Quebre 2 deles de propósito e veja o relatório listar os 2.
          </li>
        </ol>
      </PageContainer>
  );
}
