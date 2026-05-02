import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Executors() {
  return (
    <PageContainer title="Executors & Callable" subtitle="Pool de threads do jeito profissional — esqueça new Thread()." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Sair criando <code>new Thread()</code> pra cada tarefa é como contratar um funcionário novo cada vez que chega um e-mail e demitir quando termina de responder. Caro, lento e sem controle. Em produção, você quer um <strong>pool</strong>: um time fixo (ou elástico) que reaproveita threads.
        </p><p>
          O Java te dá isso pronto desde 2004 (Java 5) com <code>java.util.concurrent</code>. Não invente — use.
        </p><AlertBox type="warning" title="O custo escondido de new Thread()">
          Cada <code>Thread</code> platform reserva ~1MB de stack e custa milissegundos pra subir. Criar 10000 dessas = OutOfMemoryError. Pool resolve isso.
        </AlertBox><h2>ExecutorService: o gerente do pool</h2><p>
          Você submete tarefas, o pool decide qual thread executa. A fábrica é a classe utilitária <code>Executors</code>:
        </p><CodeBlock title="Pool fixo com 4 threads" code={`import java.util.concurrent.*;

public class PoolBasico {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 10; i++) {
            int id = i;
            pool.submit(() -> {
                System.out.println("Tarefa " + id + " na " +
                    Thread.currentThread().getName());
            });
        }

        pool.shutdown(); // não aceita mais tarefas; espera as ativas
    }
}`} /><h2>Tipos de pool prontos</h2><ul>
          <li>
            <code>newFixedThreadPool(n)</code>: N threads fixas. Ótimo pra carga previsível.
          </li><li>
            <code>newCachedThreadPool()</code>: cresce sob demanda, mata threads ociosas após 60s. Bom pra muitas tarefas curtas e esporádicas.
          </li><li>
            <code>newSingleThreadExecutor()</code>: 1 thread só, fila FIFO. Útil pra serializar acesso a um recurso (ex: um arquivo).
          </li><li>
            <code>newScheduledThreadPool(n)</code>: agenda tarefas pra rodar daqui X tempo, ou periodicamente. Substitui <code>Timer</code>.
          </li><li>
            <code>newVirtualThreadPerTaskExecutor()</code> (Java 21+): uma virtual thread por tarefa. Ver capítulo de Virtual Threads.
          </li>
        </ul><CodeBlock title="Agendando tarefas" code={`ScheduledExecutorService agendador = Executors.newScheduledThreadPool(2);

// Roda uma vez, daqui 3 segundos
agendador.schedule(() -> System.out.println("Atrasou!"), 3, TimeUnit.SECONDS);

// Roda agora, depois a cada 1 segundo
agendador.scheduleAtFixedRate(
    () -> System.out.println("Tic"),
    0, 1, TimeUnit.SECONDS
);`} /><h2>Runnable vs Callable</h2><p>
          <code>Runnable</code> é "faça isso, sem retorno". <code>
            {"Callable<T>"}
          </code> é "faça isso e me devolva um T — e pode lançar exception checked". Ambos viram<code>Future</code> quando você submete:
        </p><CodeBlock title="Callable retornando valor" code={`ExecutorService pool = Executors.newFixedThreadPool(2);

Callable<Integer> tarefa = () -> {
    Thread.sleep(500);
    return 42;
};

Future<Integer> futuro = pool.submit(tarefa);

// ... pode fazer outras coisas aqui ...

Integer resultado = futuro.get(); // BLOQUEIA até ter resposta
System.out.println("Resposta: " + resultado);

pool.shutdown();`} /><AlertBox type="info" title="Future.get() com timeout">
          <code>futuro.get(2, TimeUnit.SECONDS)</code> espera no máximo 2s e lança<code>TimeoutException</code> se passar disso. Sempre prefira a versão com timeout em produção pra não travar pra sempre.
        </AlertBox><h2>Várias tarefas, vários futuros</h2><CodeBlock code={`List<Callable<Integer>> tarefas = List.of(
    () -> { Thread.sleep(300); return 1; },
    () -> { Thread.sleep(100); return 2; },
    () -> { Thread.sleep(200); return 3; }
);

ExecutorService pool = Executors.newFixedThreadPool(3);
List<Future<Integer>> futuros = pool.invokeAll(tarefas);

for (Future<Integer> f : futuros) {
    System.out.println(f.get());
}

pool.shutdown();`} /><h2>Encerrando o pool: shutdown vs shutdownNow</h2><ul>
          <li>
            <code>shutdown()</code>: para de aceitar novas tarefas, mas deixa as enfileiradas terminarem. É o gentil.
          </li><li>
            <code>shutdownNow()</code>: tenta interromper o que está rodando e devolve a lista das que nem começaram. É o "agora".
          </li><li>
            <code>awaitTermination(t, unit)</code>: bloqueia até tudo acabar OU dar timeout. Retorna <code>true</code> se conseguiu encerrar.
          </li>
        </ul><CodeBlock title="Padrão de shutdown educado" code={`pool.shutdown();
try {
    if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {
        pool.shutdownNow(); // forçar
        if (!pool.awaitTermination(5, TimeUnit.SECONDS)) {
            System.err.println("Pool não encerrou!");
        }
    }
} catch (InterruptedException e) {
    pool.shutdownNow();
    Thread.currentThread().interrupt();
}`} /><h2>Try-with-resources (Java 19+)</h2><p>
          Desde Java 19, <code>ExecutorService</code> implementa <code>AutoCloseable</code>. Saindo do bloco, ele chama <code>close()</code> que faz <code>shutdown</code> + espera. Use sempre que puder:
        </p><CodeBlock code={`try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
    for (int i = 0; i < 5; i++) {
        int id = i;
        pool.submit(() -> System.out.println("Tarefa " + id));
    }
} // shutdown automático aqui — espera as tarefas terminarem`} /><AlertBox type="danger" title="Esqueceu o shutdown?">
          Se o pool nunca for fechado, suas threads (inclusive não-daemon) seguram a JVM viva pra sempre. Seu programa "não termina" e você não entende o motivo.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um pool fixo de 3 threads e submeta 10 <code>
              {"Callable<Long>"}
            </code> que retornam um número aleatório após dormir 200ms. Imprima a soma de todos.
          </li><li>
            Use <code>ScheduledExecutorService</code> pra imprimir "ping" a cada 500ms. Após 5 segundos, encerre o agendador.
          </li><li>
            Refaça o exercício 1 usando try-with-resources. Confirme que o programa termina sozinho sem chamar <code>shutdown()</code> manualmente.
          </li>
        </ol>
      </PageContainer>
  );
}
