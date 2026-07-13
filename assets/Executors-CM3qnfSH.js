import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(a,{title:"Executors & Callable",subtitle:"Pool de threads do jeito profissional — esqueça new Thread().",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Sair criando ",e.jsx("code",{children:"new Thread()"})," pra cada tarefa é como contratar um funcionário novo cada vez que chega um e-mail e demitir quando termina de responder. Caro, lento e sem controle. Em produção, você quer um ",e.jsx("strong",{children:"pool"}),": um time fixo (ou elástico) que reaproveita threads."]}),e.jsxs("p",{children:["O Java te dá isso pronto desde 2004 (Java 5) com ",e.jsx("code",{children:"java.util.concurrent"}),". Não invente — use."]}),e.jsxs(r,{type:"warning",title:"O custo escondido de new Thread()",children:["Cada ",e.jsx("code",{children:"Thread"})," platform reserva ~1MB de stack e custa milissegundos pra subir. Criar 10000 dessas = OutOfMemoryError. Pool resolve isso."]}),e.jsx("h2",{children:"ExecutorService: o gerente do pool"}),e.jsxs("p",{children:["Você submete tarefas, o pool decide qual thread executa. A fábrica é a classe utilitária ",e.jsx("code",{children:"Executors"}),":"]}),e.jsx(o,{title:"Pool fixo com 4 threads",code:`import java.util.concurrent.*;

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
}`}),e.jsx("h2",{children:"Tipos de pool prontos"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"newFixedThreadPool(n)"}),": N threads fixas. Ótimo pra carga previsível."]}),e.jsxs("li",{children:[e.jsx("code",{children:"newCachedThreadPool()"}),": cresce sob demanda, mata threads ociosas após 60s. Bom pra muitas tarefas curtas e esporádicas."]}),e.jsxs("li",{children:[e.jsx("code",{children:"newSingleThreadExecutor()"}),": 1 thread só, fila FIFO. Útil pra serializar acesso a um recurso (ex: um arquivo)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"newScheduledThreadPool(n)"}),": agenda tarefas pra rodar daqui X tempo, ou periodicamente. Substitui ",e.jsx("code",{children:"Timer"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"newVirtualThreadPerTaskExecutor()"})," (Java 21+): uma virtual thread por tarefa. Ver capítulo de Virtual Threads."]})]}),e.jsx(o,{title:"Agendando tarefas",code:`ScheduledExecutorService agendador = Executors.newScheduledThreadPool(2);

// Roda uma vez, daqui 3 segundos
agendador.schedule(() -> System.out.println("Atrasou!"), 3, TimeUnit.SECONDS);

// Roda agora, depois a cada 1 segundo
agendador.scheduleAtFixedRate(
    () -> System.out.println("Tic"),
    0, 1, TimeUnit.SECONDS
);`}),e.jsx("h2",{children:"Runnable vs Callable"}),e.jsxs("p",{children:[e.jsx("code",{children:"Runnable"}),' é "faça isso, sem retorno". ',e.jsx("code",{children:"Callable<T>"}),' é "faça isso e me devolva um T — e pode lançar exception checked". Ambos viram',e.jsx("code",{children:"Future"})," quando você submete:"]}),e.jsx(o,{title:"Callable retornando valor",code:`ExecutorService pool = Executors.newFixedThreadPool(2);

Callable<Integer> tarefa = () -> {
    Thread.sleep(500);
    return 42;
};

Future<Integer> futuro = pool.submit(tarefa);

// ... pode fazer outras coisas aqui ...

Integer resultado = futuro.get(); // BLOQUEIA até ter resposta
System.out.println("Resposta: " + resultado);

pool.shutdown();`}),e.jsxs(r,{type:"info",title:"Future.get() com timeout",children:[e.jsx("code",{children:"futuro.get(2, TimeUnit.SECONDS)"})," espera no máximo 2s e lança",e.jsx("code",{children:"TimeoutException"})," se passar disso. Sempre prefira a versão com timeout em produção pra não travar pra sempre."]}),e.jsx("h2",{children:"Várias tarefas, vários futuros"}),e.jsx(o,{code:`List<Callable<Integer>> tarefas = List.of(
    () -> { Thread.sleep(300); return 1; },
    () -> { Thread.sleep(100); return 2; },
    () -> { Thread.sleep(200); return 3; }
);

ExecutorService pool = Executors.newFixedThreadPool(3);
List<Future<Integer>> futuros = pool.invokeAll(tarefas);

for (Future<Integer> f : futuros) {
    System.out.println(f.get());
}

pool.shutdown();`}),e.jsx("h2",{children:"Encerrando o pool: shutdown vs shutdownNow"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"shutdown()"}),": para de aceitar novas tarefas, mas deixa as enfileiradas terminarem. É o gentil."]}),e.jsxs("li",{children:[e.jsx("code",{children:"shutdownNow()"}),': tenta interromper o que está rodando e devolve a lista das que nem começaram. É o "agora".']}),e.jsxs("li",{children:[e.jsx("code",{children:"awaitTermination(t, unit)"}),": bloqueia até tudo acabar OU dar timeout. Retorna ",e.jsx("code",{children:"true"})," se conseguiu encerrar."]})]}),e.jsx(o,{title:"Padrão de shutdown educado",code:`pool.shutdown();
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
}`}),e.jsx("h2",{children:"Try-with-resources (Java 19+)"}),e.jsxs("p",{children:["Desde Java 19, ",e.jsx("code",{children:"ExecutorService"})," implementa ",e.jsx("code",{children:"AutoCloseable"}),". Saindo do bloco, ele chama ",e.jsx("code",{children:"close()"})," que faz ",e.jsx("code",{children:"shutdown"})," + espera. Use sempre que puder:"]}),e.jsx(o,{code:`try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
    for (int i = 0; i < 5; i++) {
        int id = i;
        pool.submit(() -> System.out.println("Tarefa " + id));
    }
} // shutdown automático aqui — espera as tarefas terminarem`}),e.jsx(r,{type:"danger",title:"Esqueceu o shutdown?",children:'Se o pool nunca for fechado, suas threads (inclusive não-daemon) seguram a JVM viva pra sempre. Seu programa "não termina" e você não entende o motivo.'}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um pool fixo de 3 threads e submeta 10 ",e.jsx("code",{children:"Callable<Long>"})," que retornam um número aleatório após dormir 200ms. Imprima a soma de todos."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"ScheduledExecutorService"}),' pra imprimir "ping" a cada 500ms. Após 5 segundos, encerre o agendador.']}),e.jsxs("li",{children:["Refaça o exercício 1 usando try-with-resources. Confirme que o programa termina sozinho sem chamar ",e.jsx("code",{children:"shutdown()"})," manualmente."]})]})]})}export{d as default};
