import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Factory() {
  return (
    <PageContainer title="Factory Method" subtitle="Encapsular a criação de objetos quando 'qual classe instanciar' depende de algo." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Toda vez que você escreve <code>new EmailNotificacao()</code> espalhado por 30 arquivos, está se condenando: pra trocar por <code>SmtpEmailNotificacao</code>, precisa achar e mudar os 30. Pior: se a escolha "qual classe usar" depender de configuração ou input do usuário, você termina com <code>if/else</code> idêntico copiado em vários lugares.
        </p><p>
          <strong>Factory centraliza a decisão de criação em um único lugar.</strong> Quem chama só pede "me dá um Notificador" — não sabe nem quer saber qual concreto vem.
        </p><h2>Os três sabores</h2><h3>Simple Factory (não é GoF, mas é o mais usado)</h3><p>
          Um método estático que decide o que retornar. Simples e suficiente em 90% dos casos.
        </p><h3>Factory Method (GoF clássico)</h3><p>
          Uma classe abstrata define <code>criar()</code> e cada subclasse decide o que instanciar. Mais cerimônia, útil quando o "criar" varia entre famílias de classes.
        </p><h3>Abstract Factory</h3><p>
          Uma fábrica de fábricas. Útil quando você tem famílias inteiras de produtos relacionados (ex: <code>WidgetFactoryWindows</code> vs<code> WidgetFactoryLinux</code>). Raro no dia a dia.
        </p><h2>O problema, na prática</h2><CodeBlock title="Antes: new espalhado e if/else duplicado" code={`public void processarPedido(Pedido p, String canal) {
    if (canal.equals("EMAIL")) {
        new EmailNotificacao().enviar(p);
    } else if (canal.equals("SMS")) {
        new SmsNotificacao().enviar(p);
    } else if (canal.equals("PUSH")) {
        new PushNotificacao().enviar(p);
    }
}

// e esse mesmo bloco aparece em outros 4 lugares...`} /><h2>Solução com Simple Factory</h2><CodeBlock title="NotificacaoFactory.java" code={`public enum TipoNotificacao { EMAIL, SMS, PUSH }

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
n.enviar(pedido);`} /><p>
          Agora a decisão mora num único arquivo. Adicionar <code>WHATSAPP</code> = mexer em <strong>um lugar</strong>.
        </p><h2>Versão moderna: Map de Suppliers</h2><p>
          Em vez de <code>switch</code>, registre as fábricas num mapa. Fica fácil acrescentar novos tipos sem mexer no método de criação:
        </p><CodeBlock title="Factory com Map de Supplier" code={`import java.util.EnumMap;
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
}`} /><p>
          O <code>Supplier</code> é lazy: o objeto só nasce quando alguém chama<code> .get()</code>. Útil se a construção for cara.
        </p><h2>Static factory methods (o jeito Java moderno)</h2><p>
          A JDK abandonou o Factory clássico em favor de <strong>métodos estáticos de fábrica</strong> dentro da própria classe. Você os usa todo dia sem perceber:
        </p><CodeBlock title="Exemplos da JDK" code={`List<Integer> lista = List.of(1, 2, 3);          // factory imutavel
Optional<String> op = Optional.of("ola");        // wrapper
Integer i = Integer.valueOf("42");               // parse + cache
LocalDate d = LocalDate.of(2024, 12, 25);        // construcao validada
Path p = Path.of("/tmp/x.txt");                  // factory por string`} /><h3>
          Vantagens vs <code>new</code>
        </h3><ul>
          <li>
            <strong>Nome</strong>: <code>BigInteger.probablePrime(...)</code> deixa claro o que faz.
          </li><li>
            <strong>Cache</strong>: <code>Integer.valueOf(1)</code> pode reaproveitar instância.
          </li><li>
            <strong>Pode retornar subtipo</strong>: <code>List.of()</code> retorna uma <code>ImmutableCollections.ListN</code> sem expor a classe.
          </li><li>
            <strong>Lazy</strong>: pode adiar criação real.
          </li>
        </ul><h2>Convenção de nomes (siga!)</h2><ul>
          <li>
            <code>of(...)</code> — agrega itens (<code>List.of</code>, <code>Set.of</code>).
          </li><li>
            <code>valueOf(...)</code> — converte (<code>Integer.valueOf</code>).
          </li><li>
            <code>from(...)</code> — converte de outro tipo (<code>Date.from(instant)</code>).
          </li><li>
            <code>getInstance()</code> — singleton-like (<code>Calendar.getInstance</code>).
          </li><li>
            <code>create()</code> / <code>newInstance()</code> — sempre nova instância.
          </li><li>
            <code>parse(...)</code> — texto → objeto.
          </li>
        </ul><AlertBox type="tip" title="Quando usar Factory vs new">
          Use <code>new</code> direto quando: a classe é simples, sempre você usa essa concreta, e não há lógica de seleção. Use Factory quando: precisa decidir o tipo, precisa esconder o concreto, ou quer cache/lazy.
        </AlertBox><h2>Cuidado com excesso</h2><p>
          Se você só vai criar um <code>UsuarioDTO</code>, não precisa de<code> UsuarioDTOFactory</code>. <code>new UsuarioDTO(...)</code> está perfeito. Factory paga seu preço quando há <em>variação</em> a esconder.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Implemente uma <code>FormaPagamentoFactory</code> que crie<code> Pix</code>, <code>CartaoCredito</code> ou <code>Boleto</code> a partir de uma enum. Use a versão com <code>Map</code> de <code>Supplier</code>.
          </li><li>
            Compare a sua factory com <code>List.of(1, 2, 3)</code>: por que a JDK escolheu método estático na própria classe ao invés de uma <code>ListFactory</code>?
          </li><li>
            Adicione <code>CRYPTO</code> à factory de pagamento. Quantos arquivos você precisou tocar? Compare com a versão sem factory (com <code>if/else</code>).
          </li>
        </ol>
      </PageContainer>
  );
}
