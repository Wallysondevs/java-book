import{j as e}from"./index-BpXci30S.js";import{P as o,A as a}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(o,{title:"Observer",subtitle:"Notificar muitos quando algo muda — base de eventos em UI e Reactive.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Imagine uma cotação de ação: quando o preço muda, vários sistemas precisam reagir — gráfico atualiza, alerta toca, bot decide se compra. Sem padrão, você acaba escrevendo, dentro da classe ",e.jsx("code",{children:"Acao"}),":"]}),e.jsx(r,{code:`public void atualizarPreco(double novo) {
    this.preco = novo;
    grafico.redesenhar(novo);
    alerta.verificar(novo);
    bot.avaliar(novo);
    // amanha: log.registrar(novo); analytics.send(novo); ...
}`}),e.jsxs("p",{children:['Cada novo "interessado" obriga você a mexer na classe ',e.jsx("code",{children:"Acao"}),". Pior:",e.jsx("code",{children:" Acao"})," agora ",e.jsx("strong",{children:"conhece"})," grafico, alerta, bot — acoplamento absurdo."]}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Observer"})," inverte isso: a ",e.jsx("code",{children:"Acao"}),' só sabe que existem "observadores" (interface genérica). Quem quiser ser notificado se inscreve.']}),e.jsx("h2",{children:"Estrutura"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Subject"})," (publisher): mantém uma lista de observers e notifica todos quando muda."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Observer"}),": interface com método ",e.jsx("code",{children:"atualizar(...)"}),"."]}),e.jsxs("li",{children:["Subject expõe ",e.jsx("code",{children:"adicionarObserver"}),", ",e.jsx("code",{children:"removerObserver"}),", ",e.jsx("code",{children:"notificarTodos"}),"."]})]}),e.jsx("h2",{children:"Exemplo: cotação de ação"}),e.jsx(r,{title:"Observer.java + Acao.java",code:`import java.util.ArrayList;
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
}`}),e.jsx(r,{title:"Observers concretos e uso",code:`public class Grafico implements ObservadorPreco {
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
}`}),e.jsxs("p",{children:["Note: ",e.jsx("code",{children:"Acao"})," não importa ",e.jsx("code",{children:"Grafico"})," nem ",e.jsx("code",{children:"Alerta"}),". Você pode adicionar 50 observers sem mexer em ",e.jsx("code",{children:"Acao"}),"."]}),e.jsx("h2",{children:"Versão lambda (mais limpa)"}),e.jsxs("p",{children:["Como ",e.jsx("code",{children:"ObservadorPreco"})," tem 1 método, é uma functional interface:"]}),e.jsx(r,{code:`petr.adicionar((t, p) -> System.out.println(t + " virou " + p));
petr.adicionar((t, p) -> { if (p < 25) System.out.println("Comprar!"); });`}),e.jsx("h2",{children:"O legado: java.util.Observable / Observer"}),e.jsxs("p",{children:["A JDK trouxe ",e.jsx("code",{children:"java.util.Observable"})," e ",e.jsx("code",{children:"java.util.Observer"}),"desde o Java 1.0. Mas eles foram ",e.jsx("strong",{children:"deprecated no Java 9"})," porque:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Observable"})," era classe (não interface) — forçava herança."]}),e.jsx("li",{children:"Não era thread-safe nem genérica."}),e.jsxs("li",{children:["O método ",e.jsx("code",{children:"setChanged()"})," era contra-intuitivo."]})]}),e.jsx("p",{children:"Não use. Faça sua própria interface ou use uma das alternativas abaixo."}),e.jsx("h2",{children:"Alternativas modernas"}),e.jsx("h3",{children:"1. PropertyChangeSupport (java.beans)"}),e.jsx("p",{children:"Existe desde sempre, ainda funciona, popular em Swing/JavaFX."}),e.jsx(r,{code:`import java.beans.PropertyChangeSupport;
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
}`}),e.jsx("h3",{children:"2. Flow API (java.util.concurrent, Java 9+)"}),e.jsxs("p",{children:["A JDK ganhou Reactive Streams nativo: ",e.jsx("code",{children:"Flow.Publisher"}),",",e.jsx("code",{children:" Flow.Subscriber"}),", ",e.jsx("code",{children:"Flow.Subscription"}),". Pesado para casos simples, mas é o padrão pra reactive de verdade. Bibliotecas como Project Reactor e RxJava implementam essa interface."]}),e.jsx("h3",{children:"3. Event bus"}),e.jsxs("p",{children:["Spring tem ",e.jsx("code",{children:"ApplicationEventPublisher"}),"; Guava tem ",e.jsx("code",{children:"EventBus"}),". Você publica um evento, qualquer componente que tenha ",e.jsx("code",{children:"@EventListener"}),"recebe. Desacopla ainda mais."]}),e.jsxs(a,{type:"warning",title:"Memory leak: o pecado do Observer",children:["Se você adiciona um observer e ",e.jsx("strong",{children:"esquece de remover"}),", a referência sobrevive enquanto o subject existir. Em apps long-running (servidor, UI), isso vaza memória. Sempre que você cria observer com vida curta, lembre de",e.jsx("code",{children:" remover()"})," no fim. Em alguns casos, use ",e.jsx("code",{children:"WeakReference"}),"."]}),e.jsx("h2",{children:"Reactive: Observer em escala"}),e.jsx("p",{children:"RxJava, Reactor, Flux — toda a stack reactive é basicamente Observer com:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Backpressure (consumidor diz quanto aguenta)."}),e.jsx("li",{children:"Operadores (map, filter, flatMap...) entre publisher e subscriber."}),e.jsx("li",{children:"Composição assíncrona em pipelines."})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Implemente um ",e.jsx("code",{children:"Termometro"}),' que aceita observers reagindo a mudança de temperatura. Adicione um observer "alerta" que só dispara se a temperatura subir mais de 5 graus de uma vez.']}),e.jsxs("li",{children:["Refaça o exemplo do ",e.jsx("code",{children:"Termometro"})," usando ",e.jsx("code",{children:"PropertyChangeSupport"}),". Compare a quantidade de código."]}),e.jsxs("li",{children:["Provoque um memory leak: crie 10000 observers, mude o preço, e verifique com",e.jsx("code",{children:" jvisualvm"})," ou ",e.jsx("code",{children:"jconsole"})," que a memória não é liberada até você chamar ",e.jsx("code",{children:"remover()"}),"."]})]})]})}export{n as default};
