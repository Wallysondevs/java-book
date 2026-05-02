import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sincronizacao() {
  return (
    <PageContainer title="synchronized, locks e volatile" subtitle="Compartilhar estado entre threads sem race condition." difficulty="avancado" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Threads compartilham memória. Se duas mexem na mesma variável ao mesmo tempo, vira uma loteria — às vezes funciona, às vezes perde dado. Isso se chama <strong>race condition</strong>, e é o tipo de bug mais cruel: não dá pra reproduzir.
        </p><h2>Demonstrando o problema: contador++ não é atômico</h2><p>
          <code>contador++</code> parece uma operação só, mas o processador faz três passos: ler, somar 1, escrever. Se duas threads leem ao mesmo tempo, ambas escrevem o mesmo valor +1, perdendo um incremento.
        </p><CodeBlock title="Race condition na prática" code={`public class Quebrado {
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
}`} /><h2>Solução 1: synchronized método</h2><p>
          Adicionar <code>synchronized</code> no método garante que só uma thread por vez entra. O lock usado é o próprio objeto (<code>this</code>) — ou a classe, se o método for<code>static</code>:
        </p><CodeBlock code={`public class Contador {
    private int valor = 0;

    public synchronized void incrementar() {
        valor++;
    }

    public synchronized int valor() {
        return valor;
    }
}`} /><h2>Solução 2: synchronized bloco</h2><p>
          Mais cirúrgico — você escolhe qual objeto serve de lock e qual trecho protege. Recomendado quando só parte do método precisa de proteção:
        </p><CodeBlock code={`public class Carteira {
    private final Object lock = new Object();
    private double saldo;

    public void depositar(double v) {
        // validações fora do lock
        if (v <= 0) throw new IllegalArgumentException();

        synchronized (lock) {
            saldo += v;
        }
    }
}`} /><AlertBox type="tip" title="Lock dedicado é melhor que this">
          Usar <code>synchronized (this)</code> expõe seu lock pro mundo — qualquer um pode sincronizar no seu objeto e te bloquear. Lock <code>private final</code> é à prova de bobo.
        </AlertBox><h2>Intrinsic lock: cada objeto tem o seu</h2><p>
          Todo objeto Java carrega um lock interno (também chamado de <em>monitor</em>). É o que<code>synchronized</code> usa por baixo. <code>synchronized (x)</code> = "trave o monitor de x; outros que tentarem o mesmo monitor esperam".
        </p><p>
          É <strong>reentrante</strong>: a mesma thread pode entrar duas vezes no mesmo lock sem se travar.
        </p><h2>ReentrantLock: o synchronized turbinado</h2><p>
          Em <code>java.util.concurrent.locks</code> mora <code>ReentrantLock</code>, que faz o mesmo do <code>synchronized</code> mas com superpoderes:
        </p><ul>
          <li>
            <code>tryLock()</code>: tenta adquirir, retorna <code>false</code> se ocupado.
          </li><li>
            <code>tryLock(t, unit)</code>: tenta adquirir esperando até o timeout.
          </li><li>
            <code>lockInterruptibly()</code>: deixa interromper a thread que está esperando.
          </li><li>
            Suporta múltiplas <code>Condition</code> (filas de espera independentes).
          </li>
        </ul><CodeBlock title="ReentrantLock com tryLock" code={`import java.util.concurrent.locks.ReentrantLock;

ReentrantLock lock = new ReentrantLock();

if (lock.tryLock()) {
    try {
        // seção crítica
    } finally {
        lock.unlock(); // SEMPRE no finally
    }
} else {
    System.out.println("Tá ocupado, faço outra coisa.");
}`} /><AlertBox type="danger" title="Esqueceu unlock()? Travou pra sempre.">
          Diferente de <code>synchronized</code>, que solta o lock automaticamente, em<code>ReentrantLock</code> o <code>unlock()</code> é por sua conta. Sempre dentro de <code>try/finally</code>.
        </AlertBox><h2>volatile: visibilidade, não atomicidade</h2><p>
          Sem <code>volatile</code>, uma thread pode cachear uma variável em registrador e nunca ver as alterações de outra thread. <code>volatile</code> diz ao compilador e à CPU: "essa variável muda, leia/escreva sempre direto na memória".
        </p><p>
          <strong>Importante:</strong> <code>volatile</code> NÃO torna operações compostas atômicas. <code>contador++</code> volatile ainda perde incrementos.
        </p><CodeBlock title="Caso clássico de volatile: flag de parada" code={`public class Worker implements Runnable {
    private volatile boolean rodando = true;

    public void parar() { rodando = false; }

    @Override
    public void run() {
        while (rodando) {
            // trabalho...
        }
    }
}`} /><h2>Atomic*: operações atômicas sem lock</h2><p>
          Pacote <code>java.util.concurrent.atomic</code> traz classes que usam instruções de CPU (<em>compare-and-swap</em>) pra atualizar valores atomicamente, sem bloquear ninguém. Mais rápido que <code>synchronized</code> em casos simples:
        </p><CodeBlock code={`import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

AtomicInteger contador = new AtomicInteger(0);
contador.incrementAndGet();        // ++ atômico
contador.compareAndSet(5, 10);     // muda só se for 5

AtomicReference<String> nome = new AtomicReference<>("Ana");
nome.compareAndSet("Ana", "Bia");`} /><h2>Coleções concorrentes</h2><p>
          Nunca compartilhe um <code>HashMap</code> entre threads — em casos extremos pode até entrar em loop infinito. Use as coleções do <code>java.util.concurrent</code>:
        </p><ul>
          <li>
            <code>ConcurrentHashMap</code>: substitui <code>HashMap</code>.
          </li><li>
            <code>CopyOnWriteArrayList</code>: lista boa pra ler muito, escrever pouco.
          </li><li>
            <code>ConcurrentLinkedQueue</code>, <code>BlockingQueue</code>: filas thread-safe.
          </li>
        </ul><CodeBlock code={`ConcurrentHashMap<String, Integer> placar = new ConcurrentHashMap<>();
placar.merge("Brasil", 1, Integer::sum); // atômico!`} /><h2>Deadlock: o impasse mortal</h2><p>
          Thread A trava o lock 1 e quer o 2. Thread B trava o 2 e quer o 1. Ninguém solta, ninguém anda. JVM não detecta nem resolve sozinha.
        </p><CodeBlock title="Deadlock clássico" code={`Object a = new Object(), b = new Object();

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
}).start();`} /><AlertBox type="success" title="Receita anti-deadlock">
          <strong>Sempre adquira locks na mesma ordem global.</strong> Se todo mundo pega A antes de B, deadlock entre esses dois é impossível. Outras dicas: use<code>tryLock</code> com timeout, evite chamar código externo segurando lock, prefira dados imutáveis (<code>final</code> + <code>record</code>).
        </AlertBox><h2>O melhor lock é o que não existe</h2><p>
          Estado imutável não tem race condition. Sempre que possível, use <code>record</code>, campos <code>final</code>, coleções imutáveis (<code>List.of(...)</code>) e troque o objeto inteiro em vez de mutar. É a abordagem que escala melhor.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Reescreva o exemplo do contador quebrado usando <code>AtomicInteger</code>. Rode várias vezes e confirme que sempre dá 200000.
          </li><li>
            Implemente uma classe <code>EstoqueProduto</code> com método <code>vender(int qtd)</code>que só vende se houver saldo. Use <code>ReentrantLock</code> + <code>tryLock(1, SECONDS)</code>e devolva <code>boolean</code> indicando sucesso.
          </li><li>
            Reproduza o deadlock do exemplo. Depois corrija forçando que ambas as threads peguem os locks em ordem alfabética (A primeiro, B depois).
          </li>
        </ol>
      </PageContainer>
  );
}
