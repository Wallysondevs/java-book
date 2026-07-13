import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function i(){return e.jsxs(a,{title:"synchronized, locks e volatile",subtitle:"Compartilhar estado entre threads sem race condition.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Threads compartilham memória. Se duas mexem na mesma variável ao mesmo tempo, vira uma loteria — às vezes funciona, às vezes perde dado. Isso se chama ",e.jsx("strong",{children:"race condition"}),", e é o tipo de bug mais cruel: não dá pra reproduzir."]}),e.jsx("h2",{children:"Demonstrando o problema: contador++ não é atômico"}),e.jsxs("p",{children:[e.jsx("code",{children:"contador++"})," parece uma operação só, mas o processador faz três passos: ler, somar 1, escrever. Se duas threads leem ao mesmo tempo, ambas escrevem o mesmo valor +1, perdendo um incremento."]}),e.jsx(o,{title:"Race condition na prática",code:`public class Quebrado {
    static int contador = 0;

    public static void main(String[] args) throws InterruptedException {
        Runnable tarefa = () -> {
            for (int i = 0; i < 100_000; i++) contador++;
        };
        Thread t1 = new Thread(tarefa);
        Thread t2 = new Thread(tarefa);
        t1.start(); t2.start();
        t1.join();  t2.join();
        System.out.println("Esperado: 200000, obtido: " + contador);
        // Você verá algo tipo 137829 — quase nunca 200000.
    }
}`}),e.jsx("h2",{children:"Solução 1: synchronized método"}),e.jsxs("p",{children:["Adicionar ",e.jsx("code",{children:"synchronized"})," no método garante que só uma thread por vez entra. O lock usado é o próprio objeto (",e.jsx("code",{children:"this"}),") — ou a classe, se o método for",e.jsx("code",{children:"static"}),":"]}),e.jsx(o,{code:`public class Contador {
    private int valor = 0;

    public synchronized void incrementar() {
        valor++;
    }

    public synchronized int valor() {
        return valor;
    }
}`}),e.jsx("h2",{children:"Solução 2: synchronized bloco"}),e.jsx("p",{children:"Mais cirúrgico — você escolhe qual objeto serve de lock e qual trecho protege. Recomendado quando só parte do método precisa de proteção:"}),e.jsx(o,{code:`public class Carteira {
    private final Object lock = new Object();
    private double saldo;

    public void depositar(double v) {
        // validações fora do lock
        if (v <= 0) throw new IllegalArgumentException();

        synchronized (lock) {
            saldo += v;
        }
    }
}`}),e.jsxs(r,{type:"tip",title:"Lock dedicado é melhor que this",children:["Usar ",e.jsx("code",{children:"synchronized (this)"})," expõe seu lock pro mundo — qualquer um pode sincronizar no seu objeto e te bloquear. Lock ",e.jsx("code",{children:"private final"})," é à prova de bobo."]}),e.jsx("h2",{children:"Intrinsic lock: cada objeto tem o seu"}),e.jsxs("p",{children:["Todo objeto Java carrega um lock interno (também chamado de ",e.jsx("em",{children:"monitor"}),"). É o que",e.jsx("code",{children:"synchronized"})," usa por baixo. ",e.jsx("code",{children:"synchronized (x)"}),' = "trave o monitor de x; outros que tentarem o mesmo monitor esperam".']}),e.jsxs("p",{children:["É ",e.jsx("strong",{children:"reentrante"}),": a mesma thread pode entrar duas vezes no mesmo lock sem se travar."]}),e.jsx("h2",{children:"ReentrantLock: o synchronized turbinado"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"java.util.concurrent.locks"})," mora ",e.jsx("code",{children:"ReentrantLock"}),", que faz o mesmo do ",e.jsx("code",{children:"synchronized"})," mas com superpoderes:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"tryLock()"}),": tenta adquirir, retorna ",e.jsx("code",{children:"false"})," se ocupado."]}),e.jsxs("li",{children:[e.jsx("code",{children:"tryLock(t, unit)"}),": tenta adquirir esperando até o timeout."]}),e.jsxs("li",{children:[e.jsx("code",{children:"lockInterruptibly()"}),": deixa interromper a thread que está esperando."]}),e.jsxs("li",{children:["Suporta múltiplas ",e.jsx("code",{children:"Condition"})," (filas de espera independentes)."]})]}),e.jsx(o,{title:"ReentrantLock com tryLock",code:`import java.util.concurrent.locks.ReentrantLock;

ReentrantLock lock = new ReentrantLock();

if (lock.tryLock()) {
    try {
        // seção crítica
    } finally {
        lock.unlock(); // SEMPRE no finally
    }
} else {
    System.out.println("Tá ocupado, faço outra coisa.");
}`}),e.jsxs(r,{type:"danger",title:"Esqueceu unlock()? Travou pra sempre.",children:["Diferente de ",e.jsx("code",{children:"synchronized"}),", que solta o lock automaticamente, em",e.jsx("code",{children:"ReentrantLock"})," o ",e.jsx("code",{children:"unlock()"})," é por sua conta. Sempre dentro de ",e.jsx("code",{children:"try/finally"}),"."]}),e.jsx("h2",{children:"volatile: visibilidade, não atomicidade"}),e.jsxs("p",{children:["Sem ",e.jsx("code",{children:"volatile"}),", uma thread pode cachear uma variável em registrador e nunca ver as alterações de outra thread. ",e.jsx("code",{children:"volatile"}),' diz ao compilador e à CPU: "essa variável muda, leia/escreva sempre direto na memória".']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Importante:"})," ",e.jsx("code",{children:"volatile"})," NÃO torna operações compostas atômicas. ",e.jsx("code",{children:"contador++"})," volatile ainda perde incrementos."]}),e.jsx(o,{title:"Caso clássico de volatile: flag de parada",code:`public class Worker implements Runnable {
    private volatile boolean rodando = true;

    public void parar() { rodando = false; }

    @Override
    public void run() {
        while (rodando) {
            // trabalho...
        }
    }
}`}),e.jsx("h2",{children:"Atomic*: operações atômicas sem lock"}),e.jsxs("p",{children:["Pacote ",e.jsx("code",{children:"java.util.concurrent.atomic"})," traz classes que usam instruções de CPU (",e.jsx("em",{children:"compare-and-swap"}),") pra atualizar valores atomicamente, sem bloquear ninguém. Mais rápido que ",e.jsx("code",{children:"synchronized"})," em casos simples:"]}),e.jsx(o,{code:`import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

AtomicInteger contador = new AtomicInteger(0);
contador.incrementAndGet();        // ++ atômico
contador.compareAndSet(5, 10);     // muda só se for 5

AtomicReference<String> nome = new AtomicReference<>("Ana");
nome.compareAndSet("Ana", "Bia");`}),e.jsx("h2",{children:"Coleções concorrentes"}),e.jsxs("p",{children:["Nunca compartilhe um ",e.jsx("code",{children:"HashMap"})," entre threads — em casos extremos pode até entrar em loop infinito. Use as coleções do ",e.jsx("code",{children:"java.util.concurrent"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ConcurrentHashMap"}),": substitui ",e.jsx("code",{children:"HashMap"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CopyOnWriteArrayList"}),": lista boa pra ler muito, escrever pouco."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ConcurrentLinkedQueue"}),", ",e.jsx("code",{children:"BlockingQueue"}),": filas thread-safe."]})]}),e.jsx(o,{code:`ConcurrentHashMap<String, Integer> placar = new ConcurrentHashMap<>();
placar.merge("Brasil", 1, Integer::sum); // atômico!`}),e.jsx("h2",{children:"Deadlock: o impasse mortal"}),e.jsx("p",{children:"Thread A trava o lock 1 e quer o 2. Thread B trava o 2 e quer o 1. Ninguém solta, ninguém anda. JVM não detecta nem resolve sozinha."}),e.jsx(o,{title:"Deadlock clássico",code:`Object a = new Object(), b = new Object();

new Thread(() -> {
    synchronized (a) {
        try { Thread.sleep(50); } catch (Exception ignored) {}
        synchronized (b) { System.out.println("A->B"); }
    }
}).start();

new Thread(() -> {
    synchronized (b) {
        try { Thread.sleep(50); } catch (Exception ignored) {}
        synchronized (a) { System.out.println("B->A"); } // travou
    }
}).start();`}),e.jsxs(r,{type:"success",title:"Receita anti-deadlock",children:[e.jsx("strong",{children:"Sempre adquira locks na mesma ordem global."})," Se todo mundo pega A antes de B, deadlock entre esses dois é impossível. Outras dicas: use",e.jsx("code",{children:"tryLock"})," com timeout, evite chamar código externo segurando lock, prefira dados imutáveis (",e.jsx("code",{children:"final"})," + ",e.jsx("code",{children:"record"}),")."]}),e.jsx("h2",{children:"O melhor lock é o que não existe"}),e.jsxs("p",{children:["Estado imutável não tem race condition. Sempre que possível, use ",e.jsx("code",{children:"record"}),", campos ",e.jsx("code",{children:"final"}),", coleções imutáveis (",e.jsx("code",{children:"List.of(...)"}),") e troque o objeto inteiro em vez de mutar. É a abordagem que escala melhor."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Reescreva o exemplo do contador quebrado usando ",e.jsx("code",{children:"AtomicInteger"}),". Rode várias vezes e confirme que sempre dá 200000."]}),e.jsxs("li",{children:["Implemente uma classe ",e.jsx("code",{children:"EstoqueProduto"})," com método ",e.jsx("code",{children:"vender(int qtd)"}),"que só vende se houver saldo. Use ",e.jsx("code",{children:"ReentrantLock"})," + ",e.jsx("code",{children:"tryLock(1, SECONDS)"}),"e devolva ",e.jsx("code",{children:"boolean"})," indicando sucesso."]}),e.jsx("li",{children:"Reproduza o deadlock do exemplo. Depois corrija forçando que ambas as threads peguem os locks em ordem alfabética (A primeiro, B depois)."})]})]})}export{i as default};
