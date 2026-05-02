import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mockito() {
  return (
    <PageContainer title="Mockito" subtitle="Mock de dependências — teste classes isoladas sem subir banco/HTTP/etc." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine testar um <code>ServicoDeCadastro</code> que depende de um <code>RepositorioDeUsuarios</code> (que fala com Postgres) e de um <code>EmailSender</code> (que chama API de SMTP). Pra testar a lógica do serviço de verdade, você não quer subir banco nem mandar email — você quer <em>fingir</em> essas dependências e checar como o serviço se comporta. É exatamente isso que Mockito faz: cria objetos falsos (mocks) que respondem como você manda, e te deixa verificar quais métodos foram chamados.
        </p><AlertBox type="tip" title="Quando usar mock">
          Use mock pra <strong>dependências externas</strong> (banco, HTTP, filesystem, fila). Não mocke value objects, listas, strings, lógica pura — pra essas coisas, use o objeto real.
        </AlertBox><h2>Adicionando Mockito</h2><CodeBlock title="Maven" code={`<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.12.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.12.0</version>
    <scope>test</scope>
</dependency>`} /><CodeBlock title="Gradle" code={`testImplementation("org.mockito:mockito-core:5.12.0")
testImplementation("org.mockito:mockito-junit-jupiter:5.12.0")`} /><h2>Setup com JUnit 5</h2><p>
          A integração padrão usa <code>@ExtendWith(MockitoExtension.class)</code> na classe de teste. Aí você anota campos com <code>@Mock</code> pra criar mocks e <code>@InjectMocks</code> pra que o Mockito injete os mocks no objeto sob teste.
        </p><CodeBlock title="Estrutura típica" code={`import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ServicoDeCadastroTest {

    @Mock
    RepositorioDeUsuarios repo;

    @Mock
    EmailSender emailSender;

    @InjectMocks
    ServicoDeCadastro servico;

    @Test
    void cadastraEnviaEmailDeBoasVindas() {
        // ...
    }
}`} /><h2>Stubbing: when().thenReturn()</h2><p>
          Você ensina o mock a responder a chamadas específicas. Sem stub, mocks retornam valores "vazios" (<code>0</code>, <code>null</code>, lista vazia).
        </p><CodeBlock title="Comportando o mock" code={`@Test
void retornaUsuarioQuandoExiste() {
    when(repo.buscarPorId(1))
        .thenReturn(new Usuario(1, "Ana"));

    Usuario u = servico.obter(1);

    assertEquals("Ana", u.nome());
}

@Test
void lancaExcecaoQuandoBancoFalha() {
    when(repo.buscarPorId(anyInt()))
        .thenThrow(new RuntimeException("DB fora do ar"));

    assertThrows(RuntimeException.class, () -> servico.obter(99));
}`} /><p>
          Argument matchers como <code>anyInt()</code>, <code>anyString()</code>, <code>any()</code> deixam o stub responder pra qualquer entrada daquele tipo. Cuidado: se você usa um matcher pra um argumento, todos os argumentos precisam ser matchers (use <code>eq("valor")</code> pra valor literal).
        </p><h2>verify: confirmando que algo aconteceu</h2><p>
          Usa-se <code>verify(mock).metodo(...)</code> pra checar que o método foi chamado com os argumentos esperados. Útil pra validar comportamento "side effect" — chamou email, gravou log, etc.
        </p><CodeBlock title="Verificando interação" code={`@Test
void cadastraEnviaEmailDeBoasVindas() {
    Usuario novo = new Usuario(1, "Ana", "ana@x.com");

    servico.cadastrar(novo);

    verify(repo).salvar(novo);
    verify(emailSender).enviar("ana@x.com", "Bem-vinda!");
    verifyNoMoreInteractions(emailSender);
}

@Test
void naoEnviaEmailSeUsuarioJaExiste() {
    when(repo.existe("ana@x.com")).thenReturn(true);

    servico.cadastrar(new Usuario(1, "Ana", "ana@x.com"));

    verify(emailSender, never()).enviar(any(), any());
}`} /><p>
          Modificadores comuns: <code>times(n)</code>, <code>never()</code>, <code>atLeastOnce()</code>, <code>atMost(n)</code>.
        </p><h2>ArgumentCaptor: capturando argumentos</h2><p>Quando o argumento é construído internamente e você quer inspecioná-lo:</p><CodeBlock title="ArgumentCaptor" code={`@Test
void emailContemNomeDoUsuario() {
    servico.cadastrar(new Usuario(1, "Ana", "ana@x.com"));

    ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);
    verify(emailSender).enviar(captor.capture());

    Email enviado = captor.getValue();
    assertTrue(enviado.corpo().contains("Ana"));
    assertEquals("ana@x.com", enviado.destinatario());
}`} /><h2>Spy vs Mock</h2><ul>
          <li>
            <strong>Mock:</strong> objeto totalmente fake. Por padrão, todo método retorna valor "vazio". Você ensina o que quiser.
          </li><li>
            <strong>Spy:</strong> envolve um objeto real. Por padrão, chamadas executam o código real, mas você pode "stubbar" métodos individuais.
          </li>
        </ul><CodeBlock title="Spy quando faz sentido" code={`List<String> lista = new ArrayList<>();
List<String> spy = spy(lista);

spy.add("a");
spy.add("b");

verify(spy).add("a");
assertEquals(2, spy.size());

// Stubando um método específico do spy:
when(spy.size()).thenReturn(100);
assertEquals(100, spy.size());`} /><AlertBox type="warning" title="Cuidado com spy">
          Spy costuma ser sinal de que sua classe sob teste está mal estruturada (faz coisa demais). Use com moderação — em código bem desenhado, mocks resolvem 90% dos casos.
        </AlertBox><h2>Mockando métodos estáticos</h2><p>
          Desde Mockito 3.4 você pode mockar métodos estáticos com <code>mockStatic</code>. É feature poderosa mas evite quando der: se você precisa muito disso, geralmente é porque há acoplamento forte com utility classes.
        </p><CodeBlock title="mockStatic" code={`@Test
void mockaMetodoEstatico() {
    try (MockedStatic<UUID> mocked = mockStatic(UUID.class)) {
        UUID fixo = UUID.fromString("00000000-0000-0000-0000-000000000001");
        mocked.when(UUID::randomUUID).thenReturn(fixo);

        UUID resultado = UUID.randomUUID();

        assertEquals(fixo, resultado);
    }
    // Fora do try, o método estático volta ao normal.
}`} /><h2>Cuidado com excesso de mock</h2><p>
          Se seu teste tem 10 mocks e 20 <code>when</code>/<code>verify</code>, você não está testando seu código — está testando seu mock. Sinais de que você está exagerando:
        </p><ul>
          <li>O teste quebra toda vez que você refatora a implementação.</li><li>Mais código de setup do mock do que código produtivo testado.</li><li>Você precisa stubar métodos que sua classe nem deveria conhecer.</li>
        </ul><p>
          Solução: refatore. Talvez sua classe esteja fazendo coisa demais. Quebre em partes menores que sejam testáveis sem mock.
        </p><AlertBox type="info" title="Mocks são para colaboradores externos">
          Mocke o que cruza fronteiras: banco, HTTP, sistema de arquivos, hora atual. Tudo dentro do seu domínio (entidades, value objects, regras puras) deve ser testado com objetos reais.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>ServicoDePedidos</code> que recebe um <code>RepositorioDePedidos</code>. Escreva um teste com <code>@Mock</code> e <code>@InjectMocks</code> que verifica que <code>servico.criar(pedido)</code> chama <code>repo.salvar(pedido)</code> exatamente uma vez.
          </li><li>
            Adicione um <code>NotificadorDeFraude</code> ao serviço. Quando o valor do pedido for {">"} R$ 10000, o serviço deve chamar <code>notificador.alertar(pedido)</code>. Escreva dois testes: um que confirma o alerta com <code>verify</code>, outro que confirma que <em>não</em> alerta para pedidos pequenos com <code>verify(..., never())</code>.
          </li><li>
            Use <code>ArgumentCaptor</code> pra capturar o objeto enviado pro notificador e fazer asserts nos campos dele.
          </li>
        </ol>
      </PageContainer>
  );
}
