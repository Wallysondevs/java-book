import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Threads() {
  return (
    <PageContainer title="Threads & Runnable" subtitle="Concorrência básica — duas formas de criar uma thread, qual usar." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine que seu programa precisa baixar 10 arquivos da internet. Sem threads, você baixa um, espera terminar, baixa o próximo, espera... e o usuário olha pra tela parada. Com threads, você dispara os 10 downloads ao mesmo tempo e o tempo total cai drasticamente.
        </p><p>
          Threads são unidades de execução dentro do mesmo processo. Elas compartilham memória (cuidado!) mas rodam de forma "paralela" — em CPUs com vários núcleos, de verdade; em um núcleo só, alternando rapidinho (concorrência).
        </p><AlertBox type="tip" title="Concorrência ≠ Paralelismo">
          Concorrência é lidar com várias coisas ao mesmo tempo (alternar). Paralelismo é executar várias coisas ao mesmo tempo (vários núcleos). Java te dá ambos.
        </AlertBox><h2>Forma 1: herdando da classe Thread (não recomendada)</h2><p>
          Funciona, mas você gasta sua única herança em algo que não é parte do domínio do seu programa. Mostro só pra você reconhecer no código de outros:
        </p><CodeBlock title="MinhaThread.java — herdando Thread" code={`public class MinhaThread extends Thread {
    @Override
    public void run() {
        System.out.println("Rodando em: " + Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        MinhaThread t = new MinhaThread();
        t.start();
    }
}`} /><h2>Forma 2: implementando Runnable (preferida)</h2><p>
          Runnable é uma interface funcional com um único método <code>run()</code>. Você passa o que quer executar pra um <code>Thread</code>, sem amarrar sua classe a nada. Hoje em dia, com lambdas, fica curtinho:
        </p><CodeBlock title="HelloThread.java" code={`public class HelloThread {
    public static void main(String[] args) throws InterruptedException {
        Runnable tarefa = () -> {
            System.out.println("Oi de " + Thread.currentThread().getName());
        };

        Thread t = new Thread(tarefa, "minha-thread");
        t.start();   // dispara em PARALELO
        t.join();    // espera ela terminar

        System.out.println("Main acabou.");
    }
}`} /><AlertBox type="danger" title="start() vs run() — o erro clássico">
          Chamar <code>t.run()</code> NÃO cria thread nenhuma. Executa o método na thread atual, igualzinho a uma chamada normal. Sempre <code>start()</code> pra rodar em paralelo.
        </AlertBox><h2>Esperando uma thread terminar com join()</h2><p>
          <code>join()</code> bloqueia a thread atual até a thread alvo terminar. Útil quando você precisa do resultado antes de continuar:
        </p><CodeBlock code={`Thread t = new Thread(() -> {
    try { Thread.sleep(1000); } catch (InterruptedException e) {}
    System.out.println("Filha terminou");
});
t.start();
t.join(); // main fica parado 1 segundo aqui
System.out.println("Main continua");`} /><h2>sleep() vs wait()</h2><ul>
          <li>
            <code>Thread.sleep(ms)</code>: pausa a thread atual por X milissegundos. NÃO solta locks. Use pra dar uma respirada ou simular delay.
          </li><li>
            <code>obj.wait()</code>: usado dentro de <code>synchronized(obj)</code>, solta o lock e fica esperando alguém chamar <code>obj.notify()</code>. Coisa antiga e perigosa — hoje prefira <code>BlockingQueue</code>, <code>CompletableFuture</code> ou virtual threads.
          </li>
        </ul><h2>Os 6 estados de uma Thread</h2><p>
          O enum <code>Thread.State</code> define todos:
        </p><ul>
          <li>
            <strong>NEW</strong>: criada com <code>new Thread(...)</code>, ainda não começou.
          </li><li>
            <strong>RUNNABLE</strong>: rodando OU pronta esperando o escalonador.
          </li><li>
            <strong>BLOCKED</strong>: esperando entrar num bloco <code>synchronized</code>.
          </li><li>
            <strong>WAITING</strong>: esperando indefinidamente (após <code>wait()</code> ou <code>join()</code>).
          </li><li>
            <strong>TIMED_WAITING</strong>: esperando com timeout (após <code>sleep(ms)</code> ou <code>join(ms)</code>).
          </li><li>
            <strong>TERMINATED</strong>: <code>run()</code> retornou, fim.
          </li>
        </ul><CodeBlock code={`Thread t = new Thread(() -> {
    try { Thread.sleep(500); } catch (InterruptedException e) {}
});
System.out.println(t.getState()); // NEW
t.start();
System.out.println(t.getState()); // RUNNABLE
Thread.sleep(100);
System.out.println(t.getState()); // TIMED_WAITING
t.join();
System.out.println(t.getState()); // TERMINATED`} /><h2>Daemon threads</h2><p>
          Thread daemon é "thread de fundo": a JVM encerra quando só sobram daemons. Útil pra coisas tipo coletor de lixo, monitor periódico. Setar ANTES do <code>start()</code>:
        </p><CodeBlock code={`Thread t = new Thread(() -> {
    while (true) {
        System.out.println("tic");
        try { Thread.sleep(500); } catch (InterruptedException e) { return; }
    }
});
t.setDaemon(true);
t.start();
Thread.sleep(2000); // main acaba e leva o daemon junto`} /><h2>Identificando a thread atual</h2><p>
          <code>Thread.currentThread()</code> retorna quem está executando agora. Útil pra debug e logs:
        </p><CodeBlock code={`System.out.println("Eu sou: " + Thread.currentThread().getName());
// Em Java 19+, threadId() retorna long único
System.out.println("ID: " + Thread.currentThread().threadId());`} /><AlertBox type="warning" title="Por que NÃO usar stop(), suspend(), resume()">
          Esses métodos foram <strong>deprecated faz mais de 20 anos</strong> e removidos em Java 21+. Eles matam a thread no meio do caminho, deixando locks travados e dados corrompidos. O caminho moderno: cooperação por flag <code>volatile boolean</code>ou via <code>Thread.interrupt()</code> + checagem de <code>isInterrupted()</code>.
        </AlertBox><CodeBlock title="Parando uma thread do jeito certo" code={`Thread t = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // trabalho...
    }
    System.out.println("Saí limpo!");
});
t.start();
Thread.sleep(1000);
t.interrupt(); // pede pra parar
t.join();`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie 5 threads que imprimem o próprio nome 3 vezes cada, com um <code>sleep(100)</code>entre prints. Use <code>join()</code> no main pra esperar todas terminarem antes de imprimir "fim".
          </li><li>
            Faça uma thread daemon que imprime a hora atual a cada segundo. No main, durma 5 segundos e termine. Confirme que a JVM encerra junto.
          </li><li>
            Crie uma thread que fica num loop infinito incrementando um contador. No main, após 1 segundo, chame <code>interrupt()</code> e imprima o valor final do contador. (Dica: deixe a variável como <code>volatile</code> ou use <code>AtomicLong</code>.)
          </li>
        </ol>
      </PageContainer>
  );
}
