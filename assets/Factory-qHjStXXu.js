import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(i,{title:"Factory Method",subtitle:"Encapsular a criação de objetos quando 'qual classe instanciar' depende de algo.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Toda vez que você escreve ",e.jsx("code",{children:"new EmailNotificacao()"})," espalhado por 30 arquivos, está se condenando: pra trocar por ",e.jsx("code",{children:"SmtpEmailNotificacao"}),', precisa achar e mudar os 30. Pior: se a escolha "qual classe usar" depender de configuração ou input do usuário, você termina com ',e.jsx("code",{children:"if/else"})," idêntico copiado em vários lugares."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Factory centraliza a decisão de criação em um único lugar."}),' Quem chama só pede "me dá um Notificador" — não sabe nem quer saber qual concreto vem.']}),e.jsx("h2",{children:"Os três sabores"}),e.jsx("h3",{children:"Simple Factory (não é GoF, mas é o mais usado)"}),e.jsx("p",{children:"Um método estático que decide o que retornar. Simples e suficiente em 90% dos casos."}),e.jsx("h3",{children:"Factory Method (GoF clássico)"}),e.jsxs("p",{children:["Uma classe abstrata define ",e.jsx("code",{children:"criar()"}),' e cada subclasse decide o que instanciar. Mais cerimônia, útil quando o "criar" varia entre famílias de classes.']}),e.jsx("h3",{children:"Abstract Factory"}),e.jsxs("p",{children:["Uma fábrica de fábricas. Útil quando você tem famílias inteiras de produtos relacionados (ex: ",e.jsx("code",{children:"WidgetFactoryWindows"})," vs",e.jsx("code",{children:" WidgetFactoryLinux"}),"). Raro no dia a dia."]}),e.jsx("h2",{children:"O problema, na prática"}),e.jsx(o,{title:"Antes: new espalhado e if/else duplicado",code:`public void processarPedido(Pedido p, String canal) {
    if (canal.equals("EMAIL")) {
        new EmailNotificacao().enviar(p);
    } else if (canal.equals("SMS")) {
        new SmsNotificacao().enviar(p);
    } else if (canal.equals("PUSH")) {
        new PushNotificacao().enviar(p);
    }
}

// e esse mesmo bloco aparece em outros 4 lugares...`}),e.jsx("h2",{children:"Solução com Simple Factory"}),e.jsx(o,{title:"NotificacaoFactory.java",code:`public enum TipoNotificacao { EMAIL, SMS, PUSH }

public interface Notificacao {
    void enviar(Pedido p);
}

public class NotificacaoFactory {
    public static Notificacao criar(TipoNotificacao tipo) {
        return switch (tipo) {
            case EMAIL -> new EmailNotificacao();
            case SMS   -> new SmsNotificacao();
            case PUSH  -> new PushNotificacao();
        };
    }
}

// uso
Notificacao n = NotificacaoFactory.criar(TipoNotificacao.EMAIL);
n.enviar(pedido);`}),e.jsxs("p",{children:["Agora a decisão mora num único arquivo. Adicionar ",e.jsx("code",{children:"WHATSAPP"})," = mexer em ",e.jsx("strong",{children:"um lugar"}),"."]}),e.jsx("h2",{children:"Versão moderna: Map de Suppliers"}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"switch"}),", registre as fábricas num mapa. Fica fácil acrescentar novos tipos sem mexer no método de criação:"]}),e.jsx(o,{title:"Factory com Map de Supplier",code:`import java.util.EnumMap;
import java.util.Map;
import java.util.function.Supplier;

public class NotificacaoFactory {
    private static final Map<TipoNotificacao, Supplier<Notificacao>> REGISTRO =
        new EnumMap<>(TipoNotificacao.class);

    static {
        REGISTRO.put(TipoNotificacao.EMAIL, EmailNotificacao::new);
        REGISTRO.put(TipoNotificacao.SMS,   SmsNotificacao::new);
        REGISTRO.put(TipoNotificacao.PUSH,  PushNotificacao::new);
    }

    public static Notificacao criar(TipoNotificacao tipo) {
        Supplier<Notificacao> s = REGISTRO.get(tipo);
        if (s == null) throw new IllegalArgumentException("Tipo nao suportado: " + tipo);
        return s.get();
    }
}`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"Supplier"})," é lazy: o objeto só nasce quando alguém chama",e.jsx("code",{children:" .get()"}),". Útil se a construção for cara."]}),e.jsx("h2",{children:"Static factory methods (o jeito Java moderno)"}),e.jsxs("p",{children:["A JDK abandonou o Factory clássico em favor de ",e.jsx("strong",{children:"métodos estáticos de fábrica"})," dentro da própria classe. Você os usa todo dia sem perceber:"]}),e.jsx(o,{title:"Exemplos da JDK",code:`List<Integer> lista = List.of(1, 2, 3);          // factory imutavel
Optional<String> op = Optional.of("ola");        // wrapper
Integer i = Integer.valueOf("42");               // parse + cache
LocalDate d = LocalDate.of(2024, 12, 25);        // construcao validada
Path p = Path.of("/tmp/x.txt");                  // factory por string`}),e.jsxs("h3",{children:["Vantagens vs ",e.jsx("code",{children:"new"})]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Nome"}),": ",e.jsx("code",{children:"BigInteger.probablePrime(...)"})," deixa claro o que faz."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cache"}),": ",e.jsx("code",{children:"Integer.valueOf(1)"})," pode reaproveitar instância."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pode retornar subtipo"}),": ",e.jsx("code",{children:"List.of()"})," retorna uma ",e.jsx("code",{children:"ImmutableCollections.ListN"})," sem expor a classe."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lazy"}),": pode adiar criação real."]})]}),e.jsx("h2",{children:"Convenção de nomes (siga!)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"of(...)"})," — agrega itens (",e.jsx("code",{children:"List.of"}),", ",e.jsx("code",{children:"Set.of"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"valueOf(...)"})," — converte (",e.jsx("code",{children:"Integer.valueOf"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"from(...)"})," — converte de outro tipo (",e.jsx("code",{children:"Date.from(instant)"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"getInstance()"})," — singleton-like (",e.jsx("code",{children:"Calendar.getInstance"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"create()"})," / ",e.jsx("code",{children:"newInstance()"})," — sempre nova instância."]}),e.jsxs("li",{children:[e.jsx("code",{children:"parse(...)"})," — texto → objeto."]})]}),e.jsxs(a,{type:"tip",title:"Quando usar Factory vs new",children:["Use ",e.jsx("code",{children:"new"})," direto quando: a classe é simples, sempre você usa essa concreta, e não há lógica de seleção. Use Factory quando: precisa decidir o tipo, precisa esconder o concreto, ou quer cache/lazy."]}),e.jsx("h2",{children:"Cuidado com excesso"}),e.jsxs("p",{children:["Se você só vai criar um ",e.jsx("code",{children:"UsuarioDTO"}),", não precisa de",e.jsx("code",{children:" UsuarioDTOFactory"}),". ",e.jsx("code",{children:"new UsuarioDTO(...)"})," está perfeito. Factory paga seu preço quando há ",e.jsx("em",{children:"variação"})," a esconder."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Implemente uma ",e.jsx("code",{children:"FormaPagamentoFactory"})," que crie",e.jsx("code",{children:" Pix"}),", ",e.jsx("code",{children:"CartaoCredito"})," ou ",e.jsx("code",{children:"Boleto"})," a partir de uma enum. Use a versão com ",e.jsx("code",{children:"Map"})," de ",e.jsx("code",{children:"Supplier"}),"."]}),e.jsxs("li",{children:["Compare a sua factory com ",e.jsx("code",{children:"List.of(1, 2, 3)"}),": por que a JDK escolheu método estático na própria classe ao invés de uma ",e.jsx("code",{children:"ListFactory"}),"?"]}),e.jsxs("li",{children:["Adicione ",e.jsx("code",{children:"CRYPTO"})," à factory de pagamento. Quantos arquivos você precisou tocar? Compare com a versão sem factory (com ",e.jsx("code",{children:"if/else"}),")."]})]})]})}export{t as default};
