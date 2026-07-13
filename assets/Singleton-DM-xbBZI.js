import{j as e}from"./index-BpXci30S.js";import{P as o,A as a}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(o,{title:"Singleton",subtitle:"Uma instância única — fácil de errar, fácil de abusar.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Existem objetos que ",e.jsx("strong",{children:"não fazem sentido existir em duplicata"})," no sistema: o logger global, um cache em memória compartilhado, a configuração lida do ",e.jsx("code",{children:"application.properties"}),", um pool de conexões. Criar 5 instâncias diferentes de cache = 5 caches inconsistentes. O Singleton garante que existe uma e apenas uma."]}),e.jsxs("p",{children:["Spoiler: na prática moderna você raramente ",e.jsx("em",{children:"escreve"})," um Singleton à mão. Você deixa o Spring (ou Guice, ou CDI) gerenciar isso. Mas você precisa entender o padrão pra debugar bibliotecas e pra entrevista."]}),e.jsx("h2",{children:"Quando faz sentido (de verdade)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Logger global da aplicação."}),e.jsx("li",{children:"Cache compartilhado em memória."}),e.jsx("li",{children:"Pool de conexões com banco."}),e.jsx("li",{children:"Configuração imutável carregada uma vez."})]}),e.jsxs("p",{children:["Note: ",e.jsx("strong",{children:"raro"}),". Se você está pensando em Singleton pra evitar passar um parâmetro, está errado — isso é variável global disfarçada."]}),e.jsx("h2",{children:"Implementação 1: Lazy com synchronized (clássica)"}),e.jsx(i,{title:"Logger.java",code:`public class Logger {
    private static Logger instancia;

    private Logger() {} // construtor privado!

    public static synchronized Logger getInstancia() {
        if (instancia == null) {
            instancia = new Logger();
        }
        return instancia;
    }

    public void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

// uso
Logger.getInstancia().log("aplicacao iniciada");`}),e.jsxs("p",{children:["Funciona, mas ",e.jsx("code",{children:"synchronized"})," trava o método inteiro toda chamada — só precisa travar na primeira (durante a criação). Em código quente, isso pesa."]}),e.jsx("h2",{children:"Implementação 2: Double-checked locking"}),e.jsx(i,{title:"Logger.java — versão otimizada",code:`public class Logger {
    private static volatile Logger instancia;

    private Logger() {}

    public static Logger getInstancia() {
        if (instancia == null) {              // primeiro check (sem lock)
            synchronized (Logger.class) {
                if (instancia == null) {      // segundo check (com lock)
                    instancia = new Logger();
                }
            }
        }
        return instancia;
    }
}`}),e.jsxs(a,{type:"warning",title:"O volatile é OBRIGATÓRIO",children:["Sem ",e.jsx("code",{children:"volatile"}),', outra thread pode ver uma referência "meio construída" do objeto por causa de reordenação de instruções. Esse foi um bug clássico pré-Java 5.']}),e.jsx("h2",{children:"Implementação 3: Bill Pugh (inner static class)"}),e.jsx("p",{children:"A JVM garante que classes só são carregadas quando referenciadas pela primeira vez, e o carregamento é thread-safe nativamente. Use isso a seu favor:"}),e.jsx(i,{title:"Lazy + thread-safe sem synchronized",code:`public class Logger {
    private Logger() {}

    private static class Holder {
        private static final Logger INSTANCIA = new Logger();
    }

    public static Logger getInstancia() {
        return Holder.INSTANCIA;
    }
}`}),e.jsxs("p",{children:["Elegante: lazy, thread-safe, zero ",e.jsx("code",{children:"synchronized"}),'. Foi a "melhor" forma por anos.']}),e.jsx("h2",{children:"Implementação 4: ENUM (a recomendada)"}),e.jsxs("p",{children:["Joshua Bloch, no ",e.jsx("em",{children:"Effective Java"}),", recomenda ",e.jsx("strong",{children:"enum"})," como o Singleton ideal. Por quê?"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Thread-safe de graça (a JVM cuida)."}),e.jsx("li",{children:"Imune a serialização quebrar a unicidade."}),e.jsxs("li",{children:["Imune a reflexão (",e.jsx("code",{children:"setAccessible(true)"})," no construtor) quebrar."]}),e.jsx("li",{children:"3 linhas."})]}),e.jsx(i,{title:"Configuracao.java — Singleton enum",code:`public enum Configuracao {
    INSTANCIA;

    private final String urlApi = "https://api.exemplo.com";
    private final int timeoutSegundos = 30;

    public String getUrlApi() { return urlApi; }
    public int getTimeoutSegundos() { return timeoutSegundos; }
}

// uso
String url = Configuracao.INSTANCIA.getUrlApi();
int t = Configuracao.INSTANCIA.getTimeoutSegundos();`}),e.jsx("h2",{children:"Por que Singleton dificulta teste"}),e.jsxs("p",{children:["Imagine testar um ",e.jsx("code",{children:"PedidoService"})," que internamente chama",e.jsx("code",{children:" Logger.getInstancia().log(...)"}),". Como você troca esse logger por um mock? Não dá facilmente — está hardcoded. Singleton vira ",e.jsx("strong",{children:"acoplamento global"}),": toda classe que usa fica amarrada nele."]}),e.jsx(i,{title:"O problema do teste",code:`public class PedidoService {
    public void salvar(Pedido p) {
        Logger.getInstancia().log("salvando " + p);  // como mockar isso?
        // ...
    }
}`}),e.jsx("h2",{children:"A alternativa moderna: injeção de dependência"}),e.jsxs("p",{children:["Em vez de cada classe pegar o Singleton, você ",e.jsx("strong",{children:"recebe a dependência no construtor"}),". O Spring (ou similar) cria ",e.jsx("em",{children:"uma única instância"})," do bean e injeta em quem precisa. Você ganha:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unicidade (escopo singleton do Spring)."}),e.jsx("li",{children:"Testabilidade (passa um mock no construtor)."}),e.jsx("li",{children:"Sem código boilerplate de Singleton."})]}),e.jsx(i,{title:"DI no lugar do Singleton",code:`@Service
public class PedidoService {
    private final Logger logger;

    public PedidoService(Logger logger) {  // Spring injeta o singleton
        this.logger = logger;
    }

    public void salvar(Pedido p) {
        logger.log("salvando " + p);  // facilmente mockavel no teste
    }
}`}),e.jsxs(a,{type:"tip",title:"Resumo prático",children:[e.jsxs("p",{children:["Se precisar escrever Singleton à mão: use ",e.jsx("strong",{children:"enum"}),"."]}),e.jsxs("p",{children:["Se está num projeto Spring: ",e.jsx("strong",{children:"não escreva Singleton"}),", use ",e.jsx("code",{children:"@Component"}),"/",e.jsx("code",{children:"@Service"})," e injete."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Implemente um ",e.jsx("code",{children:"ContadorAcessos"})," como Singleton enum, com método",e.jsx("code",{children:" incrementar()"})," e ",e.jsx("code",{children:"getTotal()"}),". Chame de várias threads (",e.jsx("code",{children:"Thread.start()"}),") e veja se conta certo."]}),e.jsx("li",{children:'Pegue a versão "Bill Pugh" e converta para enum. Compare quantas linhas sumiram.'}),e.jsxs("li",{children:["Procure no código de algum projeto seu (ou da JDK) classes com",e.jsx("code",{children:" getInstance()"}),". Identifique se realmente precisam ser Singleton ou se foi over-engineering."]})]})]})}export{c as default};
