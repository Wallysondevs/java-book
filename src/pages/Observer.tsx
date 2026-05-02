import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Observer() {
  return (
    <PageContainer title="Observer" subtitle="Notificar muitos quando algo muda — base de eventos em UI e Reactive." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine uma cotação de ação: quando o preço muda, vários sistemas precisam reagir — gráfico atualiza, alerta toca, bot decide se compra. Sem padrão, você acaba escrevendo, dentro da classe <code>Acao</code>:
        </p><CodeBlock code={`public void atualizarPreco(double novo) {
    this.preco = novo;
    grafico.redesenhar(novo);
    alerta.verificar(novo);
    bot.avaliar(novo);
    // amanha: log.registrar(novo); analytics.send(novo); ...
}`} /><p>
          Cada novo "interessado" obriga você a mexer na classe <code>Acao</code>. Pior:<code> Acao</code> agora <strong>conhece</strong> grafico, alerta, bot — acoplamento absurdo.
        </p><p>
          O <strong>Observer</strong> inverte isso: a <code>Acao</code> só sabe que existem "observadores" (interface genérica). Quem quiser ser notificado se inscreve.
        </p><h2>Estrutura</h2><ul>
          <li>
            <strong>Subject</strong> (publisher): mantém uma lista de observers e notifica todos quando muda.
          </li><li>
            <strong>Observer</strong>: interface com método <code>atualizar(...)</code>.
          </li><li>
            Subject expõe <code>adicionarObserver</code>, <code>removerObserver</code>, <code>notificarTodos</code>.
          </li>
        </ul><h2>Exemplo: cotação de ação</h2><CodeBlock title="Observer.java + Acao.java" code={`import java.util.ArrayList;
import java.util.List;

public interface ObservadorPreco {
    void onPrecoMudou(String ticker, double novoPreco);
}

public class Acao {
    private final String ticker;
    private double preco;
    private final List<ObservadorPreco> observers = new ArrayList<>();

    public Acao(String ticker, double precoInicial) {
        this.ticker = ticker;
        this.preco = precoInicial;
    }

    public void adicionar(ObservadorPreco o) { observers.add(o); }
    public void remover(ObservadorPreco o)   { observers.remove(o); }

    public void atualizarPreco(double novo) {
        this.preco = novo;
        for (ObservadorPreco o : observers) {
            o.onPrecoMudou(ticker, novo);
        }
    }
}`} /><CodeBlock title="Observers concretos e uso" code={`public class Grafico implements ObservadorPreco {
    public void onPrecoMudou(String t, double p) {
        System.out.println("[grafico] " + t + " = " + p);
    }
}

public class Alerta implements ObservadorPreco {
    private final double limite;
    public Alerta(double l) { this.limite = l; }
    public void onPrecoMudou(String t, double p) {
        if (p > limite) System.out.println("[ALERTA] " + t + " passou de " + limite);
    }
}

public class App {
    public static void main(String[] a) {
        Acao petr = new Acao("PETR4", 30.0);
        petr.adicionar(new Grafico());
        petr.adicionar(new Alerta(35.0));

        petr.atualizarPreco(32.5);   // grafico imprime
        petr.atualizarPreco(36.0);   // grafico imprime + alerta dispara
    }
}`} /><p>
          Note: <code>Acao</code> não importa <code>Grafico</code> nem <code>Alerta</code>. Você pode adicionar 50 observers sem mexer em <code>Acao</code>.
        </p><h2>Versão lambda (mais limpa)</h2><p>
          Como <code>ObservadorPreco</code> tem 1 método, é uma functional interface:
        </p><CodeBlock code={`petr.adicionar((t, p) -> System.out.println(t + " virou " + p));
petr.adicionar((t, p) -> { if (p < 25) System.out.println("Comprar!"); });`} /><h2>O legado: java.util.Observable / Observer</h2><p>
          A JDK trouxe <code>java.util.Observable</code> e <code>java.util.Observer</code>desde o Java 1.0. Mas eles foram <strong>deprecated no Java 9</strong> porque:
        </p><ul>
          <li>
            <code>Observable</code> era classe (não interface) — forçava herança.
          </li><li>Não era thread-safe nem genérica.</li><li>
            O método <code>setChanged()</code> era contra-intuitivo.
          </li>
        </ul><p>Não use. Faça sua própria interface ou use uma das alternativas abaixo.</p><h2>Alternativas modernas</h2><h3>1. PropertyChangeSupport (java.beans)</h3><p>Existe desde sempre, ainda funciona, popular em Swing/JavaFX.</p><CodeBlock code={`import java.beans.PropertyChangeSupport;
import java.beans.PropertyChangeListener;

public class Acao {
    private double preco;
    private final PropertyChangeSupport pcs = new PropertyChangeSupport(this);

    public void addListener(PropertyChangeListener l) { pcs.addPropertyChangeListener(l); }

    public void setPreco(double novo) {
        double antigo = this.preco;
        this.preco = novo;
        pcs.firePropertyChange("preco", antigo, novo);
    }
}`} /><h3>2. Flow API (java.util.concurrent, Java 9+)</h3><p>
          A JDK ganhou Reactive Streams nativo: <code>Flow.Publisher</code>,<code> Flow.Subscriber</code>, <code>Flow.Subscription</code>. Pesado para casos simples, mas é o padrão pra reactive de verdade. Bibliotecas como Project Reactor e RxJava implementam essa interface.
        </p><h3>3. Event bus</h3><p>
          Spring tem <code>ApplicationEventPublisher</code>; Guava tem <code>EventBus</code>. Você publica um evento, qualquer componente que tenha <code>@EventListener</code>recebe. Desacopla ainda mais.
        </p><AlertBox type="warning" title="Memory leak: o pecado do Observer">
          Se você adiciona um observer e <strong>esquece de remover</strong>, a referência sobrevive enquanto o subject existir. Em apps long-running (servidor, UI), isso vaza memória. Sempre que você cria observer com vida curta, lembre de<code> remover()</code> no fim. Em alguns casos, use <code>WeakReference</code>.
        </AlertBox><h2>Reactive: Observer em escala</h2><p>RxJava, Reactor, Flux — toda a stack reactive é basicamente Observer com:</p><ul>
          <li>Backpressure (consumidor diz quanto aguenta).</li><li>Operadores (map, filter, flatMap...) entre publisher e subscriber.</li><li>Composição assíncrona em pipelines.</li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Implemente um <code>Termometro</code> que aceita observers reagindo a mudança de temperatura. Adicione um observer "alerta" que só dispara se a temperatura subir mais de 5 graus de uma vez.
          </li><li>
            Refaça o exemplo do <code>Termometro</code> usando <code>PropertyChangeSupport</code>. Compare a quantidade de código.
          </li><li>
            Provoque um memory leak: crie 10000 observers, mude o preço, e verifique com<code> jvisualvm</code> ou <code>jconsole</code> que a memória não é liberada até você chamar <code>remover()</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
