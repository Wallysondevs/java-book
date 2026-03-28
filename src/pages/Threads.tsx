import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Threads() {
  return (
    <PageContainer
      title="Threads e Concorrência"
      subtitle="Thread, Runnable, sincronização, ExecutorService, CompletableFuture e Virtual Threads (Java 21)."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <p>
        Concorrência permite executar múltiplas tarefas simultaneamente, melhorando desempenho em
        operações paralelas como I/O, processamento de dados e servidores web. Java tem suporte
        nativo a threads desde a versão 1.0.
      </p>

      <h2>1. Thread e Runnable</h2>
      <CodeBlock
        language="java"
        code={`// Forma 1: estendendo Thread
class MinhaThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread " + getName() + ": " + i);
            try { Thread.sleep(100); } catch (InterruptedException e) { break; }
        }
    }
}

MinhaThread t = new MinhaThread();
t.setName("T1");
t.start(); // inicia a thread — NUNCA chame run() diretamente!

// Forma 2: implementando Runnable (preferida — não herda de Thread)
Runnable tarefa = () -> {
    System.out.println("Executando no thread: " + Thread.currentThread().getName());
};

Thread thread = new Thread(tarefa, "MinhaTarefa");
thread.start();
thread.join(); // espera a thread terminar

// Informações sobre a thread
System.out.println(thread.getName());     // nome
System.out.println(thread.isAlive());     // se ainda está rodando
System.out.println(thread.getState());   // NEW, RUNNABLE, BLOCKED, WAITING, TERMINATED`}
      />

      <h2>2. Sincronização</h2>
      <CodeBlock
        language="java"
        code={`// Problema: race condition
class ContadorInseguro {
    private int valor = 0;
    void incrementar() { valor++; } // NÃO é atômico!
    int getValor() { return valor; }
}

// Solução 1: synchronized
class ContadorSeguro {
    private int valor = 0;

    public synchronized void incrementar() { // apenas uma thread por vez
        valor++;
    }

    public synchronized int getValor() { return valor; }
}

// Solução 2: AtomicInteger (sem overhead de synchronized)
import java.util.concurrent.atomic.*;

AtomicInteger contador = new AtomicInteger(0);
contador.incrementAndGet(); // atômico
contador.getAndAdd(5);      // atômico
contador.compareAndSet(5, 10); // CAS — compare and swap

// Solução 3: synchronized block (granularidade fina)
class Carrinho {
    private List<String> itens = new ArrayList<>();
    private final Object lock = new Object();

    public void adicionar(String item) {
        synchronized (lock) {
            itens.add(item);
        }
    }
}`}
      />

      <h2>3. ExecutorService</h2>
      <CodeBlock
        language="java"
        code={`import java.util.concurrent.*;

// Pool de threads — gerencia threads automaticamente
ExecutorService executor = Executors.newFixedThreadPool(4); // 4 threads

// Submetendo tarefas
executor.submit(() -> System.out.println("Tarefa 1"));
executor.submit(() -> System.out.println("Tarefa 2"));

// Future — resultado de tarefa assíncrona
Future<Integer> futuro = executor.submit(() -> {
    Thread.sleep(1000);
    return 42;
});

// Outros pools
ExecutorService cached  = Executors.newCachedThreadPool();   // cresce/encolhe
ExecutorService single  = Executors.newSingleThreadExecutor(); // 1 thread
ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(2);

// Agendar execução
scheduled.schedule(() -> System.out.println("Após 2s"), 2, TimeUnit.SECONDS);
scheduled.scheduleAtFixedRate(() -> System.out.println("A cada 1s"), 0, 1, TimeUnit.SECONDS);

// SEMPRE feche o executor
executor.shutdown();
executor.awaitTermination(10, TimeUnit.SECONDS);

// Esperando resultado
try {
    Integer resultado = futuro.get(5, TimeUnit.SECONDS); // timeout
    System.out.println("Resultado: " + resultado); // 42
} catch (TimeoutException e) {
    futuro.cancel(true); // cancela se demorar mais que 5s
}`}
      />

      <h2>4. CompletableFuture (Java 8+)</h2>
      <CodeBlock
        language="java"
        code={`import java.util.concurrent.CompletableFuture;

// Assíncrono sem bloquear a thread atual
CompletableFuture<String> futuro = CompletableFuture.supplyAsync(() -> {
    // simulando busca lenta em BD
    try { Thread.sleep(1000); } catch (InterruptedException e) {}
    return "Dados do banco";
});

// Encadear operações assíncronas
futuro
    .thenApply(dados -> dados.toUpperCase())   // transforma o resultado
    .thenAccept(System.out::println)           // consome (void)
    .exceptionally(e -> {                      // trata erros
        System.out.println("Erro: " + e.getMessage());
        return null;
    });

// Combinar múltiplos futuros
CompletableFuture<String> api1 = CompletableFuture.supplyAsync(() -> "Dados API 1");
CompletableFuture<String> api2 = CompletableFuture.supplyAsync(() -> "Dados API 2");

// Esperar todos
CompletableFuture.allOf(api1, api2).thenRun(() -> {
    System.out.println("Ambas as APIs responderam!");
});

// Usar o resultado de ambos
api1.thenCombine(api2, (r1, r2) -> r1 + " | " + r2)
    .thenAccept(System.out::println);`}
      />

      <h2>5. Virtual Threads (Java 21)</h2>
      <CodeBlock
        language="java"
        code={`// Virtual Threads: threads leves gerenciadas pela JVM (não pelo OS)
// Permite criar MILHÕES de threads sem overhead de threads de plataforma

// Criar virtual thread diretamente
Thread vt = Thread.ofVirtual()
    .name("minha-vt")
    .start(() -> System.out.println("Virtual Thread!"));

// Via executor (recomendado para servidores)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Uma virtual thread por tarefa — escalável!
    for (int i = 0; i < 10_000; i++) {
        int id = i;
        executor.submit(() -> System.out.println("VT " + id));
    }
}

// Virtual threads são ideais para I/O-bound workloads
// (HTTP requests, BD queries, file I/O)
// Para CPU-bound: use threads de plataforma tradicionais`}
      />

      <AlertBox type="warning" title="Cuidados com Concorrência">
        <ul className="mb-0">
          <li>• Prefira <strong>imutabilidade</strong> — objetos imutáveis são thread-safe por natureza</li>
          <li>• Use <strong>AtomicXxx</strong> para contadores simples em vez de synchronized</li>
          <li>• Prefira <strong>ConcurrentHashMap</strong> a HashMap em contexto multi-threaded</li>
          <li>• Nunca chame <code>Thread.sleep()</code> dentro de um synchronized block</li>
          <li>• Use <strong>CompletableFuture</strong> em vez de Future.get() sempre que possível</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
