import{j as e}from"./index-BpXci30S.js";import{P as a,A as s}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"Mockito",subtitle:"Mock de dependências — teste classes isoladas sem subir banco/HTTP/etc.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine testar um ",e.jsx("code",{children:"ServicoDeCadastro"})," que depende de um ",e.jsx("code",{children:"RepositorioDeUsuarios"})," (que fala com Postgres) e de um ",e.jsx("code",{children:"EmailSender"})," (que chama API de SMTP). Pra testar a lógica do serviço de verdade, você não quer subir banco nem mandar email — você quer ",e.jsx("em",{children:"fingir"})," essas dependências e checar como o serviço se comporta. É exatamente isso que Mockito faz: cria objetos falsos (mocks) que respondem como você manda, e te deixa verificar quais métodos foram chamados."]}),e.jsxs(s,{type:"tip",title:"Quando usar mock",children:["Use mock pra ",e.jsx("strong",{children:"dependências externas"})," (banco, HTTP, filesystem, fila). Não mocke value objects, listas, strings, lógica pura — pra essas coisas, use o objeto real."]}),e.jsx("h2",{children:"Adicionando Mockito"}),e.jsx(o,{title:"Maven",code:`<dependency>
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
</dependency>`}),e.jsx(o,{title:"Gradle",code:`testImplementation("org.mockito:mockito-core:5.12.0")
testImplementation("org.mockito:mockito-junit-jupiter:5.12.0")`}),e.jsx("h2",{children:"Setup com JUnit 5"}),e.jsxs("p",{children:["A integração padrão usa ",e.jsx("code",{children:"@ExtendWith(MockitoExtension.class)"})," na classe de teste. Aí você anota campos com ",e.jsx("code",{children:"@Mock"})," pra criar mocks e ",e.jsx("code",{children:"@InjectMocks"})," pra que o Mockito injete os mocks no objeto sob teste."]}),e.jsx(o,{title:"Estrutura típica",code:`import org.junit.jupiter.api.Test;
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
}`}),e.jsx("h2",{children:"Stubbing: when().thenReturn()"}),e.jsxs("p",{children:['Você ensina o mock a responder a chamadas específicas. Sem stub, mocks retornam valores "vazios" (',e.jsx("code",{children:"0"}),", ",e.jsx("code",{children:"null"}),", lista vazia)."]}),e.jsx(o,{title:"Comportando o mock",code:`@Test
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
}`}),e.jsxs("p",{children:["Argument matchers como ",e.jsx("code",{children:"anyInt()"}),", ",e.jsx("code",{children:"anyString()"}),", ",e.jsx("code",{children:"any()"})," deixam o stub responder pra qualquer entrada daquele tipo. Cuidado: se você usa um matcher pra um argumento, todos os argumentos precisam ser matchers (use ",e.jsx("code",{children:'eq("valor")'})," pra valor literal)."]}),e.jsx("h2",{children:"verify: confirmando que algo aconteceu"}),e.jsxs("p",{children:["Usa-se ",e.jsx("code",{children:"verify(mock).metodo(...)"}),' pra checar que o método foi chamado com os argumentos esperados. Útil pra validar comportamento "side effect" — chamou email, gravou log, etc.']}),e.jsx(o,{title:"Verificando interação",code:`@Test
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
}`}),e.jsxs("p",{children:["Modificadores comuns: ",e.jsx("code",{children:"times(n)"}),", ",e.jsx("code",{children:"never()"}),", ",e.jsx("code",{children:"atLeastOnce()"}),", ",e.jsx("code",{children:"atMost(n)"}),"."]}),e.jsx("h2",{children:"ArgumentCaptor: capturando argumentos"}),e.jsx("p",{children:"Quando o argumento é construído internamente e você quer inspecioná-lo:"}),e.jsx(o,{title:"ArgumentCaptor",code:`@Test
void emailContemNomeDoUsuario() {
    servico.cadastrar(new Usuario(1, "Ana", "ana@x.com"));

    ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);
    verify(emailSender).enviar(captor.capture());

    Email enviado = captor.getValue();
    assertTrue(enviado.corpo().contains("Ana"));
    assertEquals("ana@x.com", enviado.destinatario());
}`}),e.jsx("h2",{children:"Spy vs Mock"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Mock:"}),' objeto totalmente fake. Por padrão, todo método retorna valor "vazio". Você ensina o que quiser.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Spy:"}),' envolve um objeto real. Por padrão, chamadas executam o código real, mas você pode "stubbar" métodos individuais.']})]}),e.jsx(o,{title:"Spy quando faz sentido",code:`List<String> lista = new ArrayList<>();
List<String> spy = spy(lista);

spy.add("a");
spy.add("b");

verify(spy).add("a");
assertEquals(2, spy.size());

// Stubando um método específico do spy:
when(spy.size()).thenReturn(100);
assertEquals(100, spy.size());`}),e.jsx(s,{type:"warning",title:"Cuidado com spy",children:"Spy costuma ser sinal de que sua classe sob teste está mal estruturada (faz coisa demais). Use com moderação — em código bem desenhado, mocks resolvem 90% dos casos."}),e.jsx("h2",{children:"Mockando métodos estáticos"}),e.jsxs("p",{children:["Desde Mockito 3.4 você pode mockar métodos estáticos com ",e.jsx("code",{children:"mockStatic"}),". É feature poderosa mas evite quando der: se você precisa muito disso, geralmente é porque há acoplamento forte com utility classes."]}),e.jsx(o,{title:"mockStatic",code:`@Test
void mockaMetodoEstatico() {
    try (MockedStatic<UUID> mocked = mockStatic(UUID.class)) {
        UUID fixo = UUID.fromString("00000000-0000-0000-0000-000000000001");
        mocked.when(UUID::randomUUID).thenReturn(fixo);

        UUID resultado = UUID.randomUUID();

        assertEquals(fixo, resultado);
    }
    // Fora do try, o método estático volta ao normal.
}`}),e.jsx("h2",{children:"Cuidado com excesso de mock"}),e.jsxs("p",{children:["Se seu teste tem 10 mocks e 20 ",e.jsx("code",{children:"when"}),"/",e.jsx("code",{children:"verify"}),", você não está testando seu código — está testando seu mock. Sinais de que você está exagerando:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"O teste quebra toda vez que você refatora a implementação."}),e.jsx("li",{children:"Mais código de setup do mock do que código produtivo testado."}),e.jsx("li",{children:"Você precisa stubar métodos que sua classe nem deveria conhecer."})]}),e.jsx("p",{children:"Solução: refatore. Talvez sua classe esteja fazendo coisa demais. Quebre em partes menores que sejam testáveis sem mock."}),e.jsx(s,{type:"info",title:"Mocks são para colaboradores externos",children:"Mocke o que cruza fronteiras: banco, HTTP, sistema de arquivos, hora atual. Tudo dentro do seu domínio (entidades, value objects, regras puras) deve ser testado com objetos reais."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"ServicoDePedidos"})," que recebe um ",e.jsx("code",{children:"RepositorioDePedidos"}),". Escreva um teste com ",e.jsx("code",{children:"@Mock"})," e ",e.jsx("code",{children:"@InjectMocks"})," que verifica que ",e.jsx("code",{children:"servico.criar(pedido)"})," chama ",e.jsx("code",{children:"repo.salvar(pedido)"})," exatamente uma vez."]}),e.jsxs("li",{children:["Adicione um ",e.jsx("code",{children:"NotificadorDeFraude"})," ao serviço. Quando o valor do pedido for ",">"," R$ 10000, o serviço deve chamar ",e.jsx("code",{children:"notificador.alertar(pedido)"}),". Escreva dois testes: um que confirma o alerta com ",e.jsx("code",{children:"verify"}),", outro que confirma que ",e.jsx("em",{children:"não"})," alerta para pedidos pequenos com ",e.jsx("code",{children:"verify(..., never())"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"ArgumentCaptor"})," pra capturar o objeto enviado pro notificador e fazer asserts nos campos dele."]})]})]})}export{c as default};
