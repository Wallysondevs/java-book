import{j as e}from"./index-BpXci30S.js";import{P as o,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function s(){return e.jsxs(o,{title:"Threads & Runnable",subtitle:"Concorrência básica — duas formas de criar uma thread, qual usar.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Imagine que seu programa precisa baixar 10 arquivos da internet. Sem threads, você baixa um, espera terminar, baixa o próximo, espera... e o usuário olha pra tela parada. Com threads, você dispara os 10 downloads ao mesmo tempo e o tempo total cai drasticamente."}),e.jsx("p",{children:'Threads são unidades de execução dentro do mesmo processo. Elas compartilham memória (cuidado!) mas rodam de forma "paralela" — em CPUs com vários núcleos, de verdade; em um núcleo só, alternando rapidinho (concorrência).'}),e.jsx(r,{type:"tip",title:"Concorrência ≠ Paralelismo",children:"Concorrência é lidar com várias coisas ao mesmo tempo (alternar). Paralelismo é executar várias coisas ao mesmo tempo (vários núcleos). Java te dá ambos."}),e.jsx("h2",{children:"Forma 1: herdando da classe Thread (não recomendada)"}),e.jsx("p",{children:"Funciona, mas você gasta sua única herança em algo que não é parte do domínio do seu programa. Mostro só pra você reconhecer no código de outros:"}),e.jsx(a,{title:"MinhaThread.java — herdando Thread",code:`public class MinhaThread extends Thread {
    @Override
    public void run() {
        System.out.println("Rodando em: " + Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        MinhaThread t = new MinhaThread();
        t.start();
    }
}`}),e.jsx("h2",{children:"Forma 2: implementando Runnable (preferida)"}),e.jsxs("p",{children:["Runnable é uma interface funcional com um único método ",e.jsx("code",{children:"run()"}),". Você passa o que quer executar pra um ",e.jsx("code",{children:"Thread"}),", sem amarrar sua classe a nada. Hoje em dia, com lambdas, fica curtinho:"]}),e.jsx(a,{title:"HelloThread.java",code:`public class HelloThread {
    public static void main(String[] args) throws InterruptedException {
        Runnable tarefa = () -> {
            System.out.println("Oi de " + Thread.currentThread().getName());
        };

        Thread t = new Thread(tarefa, "minha-thread");
        t.start();   // dispara em PARALELO
        t.join();    // espera ela terminar

        System.out.println("Main acabou.");
    }
}`}),e.jsxs(r,{type:"danger",title:"start() vs run() — o erro clássico",children:["Chamar ",e.jsx("code",{children:"t.run()"})," NÃO cria thread nenhuma. Executa o método na thread atual, igualzinho a uma chamada normal. Sempre ",e.jsx("code",{children:"start()"})," pra rodar em paralelo."]}),e.jsx("h2",{children:"Esperando uma thread terminar com join()"}),e.jsxs("p",{children:[e.jsx("code",{children:"join()"})," bloqueia a thread atual até a thread alvo terminar. Útil quando você precisa do resultado antes de continuar:"]}),e.jsx(a,{code:`Thread t = new Thread(() -> {
    try { Thread.sleep(1000); } catch (InterruptedException e) {}
    System.out.println("Filha terminou");
});
t.start();
t.join(); // main fica parado 1 segundo aqui
System.out.println("Main continua");`}),e.jsx("h2",{children:"sleep() vs wait()"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Thread.sleep(ms)"}),": pausa a thread atual por X milissegundos. NÃO solta locks. Use pra dar uma respirada ou simular delay."]}),e.jsxs("li",{children:[e.jsx("code",{children:"obj.wait()"}),": usado dentro de ",e.jsx("code",{children:"synchronized(obj)"}),", solta o lock e fica esperando alguém chamar ",e.jsx("code",{children:"obj.notify()"}),". Coisa antiga e perigosa — hoje prefira ",e.jsx("code",{children:"BlockingQueue"}),", ",e.jsx("code",{children:"CompletableFuture"})," ou virtual threads."]})]}),e.jsx("h2",{children:"Os 6 estados de uma Thread"}),e.jsxs("p",{children:["O enum ",e.jsx("code",{children:"Thread.State"})," define todos:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NEW"}),": criada com ",e.jsx("code",{children:"new Thread(...)"}),", ainda não começou."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RUNNABLE"}),": rodando OU pronta esperando o escalonador."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BLOCKED"}),": esperando entrar num bloco ",e.jsx("code",{children:"synchronized"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"WAITING"}),": esperando indefinidamente (após ",e.jsx("code",{children:"wait()"})," ou ",e.jsx("code",{children:"join()"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TIMED_WAITING"}),": esperando com timeout (após ",e.jsx("code",{children:"sleep(ms)"})," ou ",e.jsx("code",{children:"join(ms)"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TERMINATED"}),": ",e.jsx("code",{children:"run()"})," retornou, fim."]})]}),e.jsx(a,{code:`Thread t = new Thread(() -> {
    try { Thread.sleep(500); } catch (InterruptedException e) {}
});
System.out.println(t.getState()); // NEW
t.start();
System.out.println(t.getState()); // RUNNABLE
Thread.sleep(100);
System.out.println(t.getState()); // TIMED_WAITING
t.join();
System.out.println(t.getState()); // TERMINATED`}),e.jsx("h2",{children:"Daemon threads"}),e.jsxs("p",{children:['Thread daemon é "thread de fundo": a JVM encerra quando só sobram daemons. Útil pra coisas tipo coletor de lixo, monitor periódico. Setar ANTES do ',e.jsx("code",{children:"start()"}),":"]}),e.jsx(a,{code:`Thread t = new Thread(() -> {
    while (true) {
        System.out.println("tic");
        try { Thread.sleep(500); } catch (InterruptedException e) { return; }
    }
});
t.setDaemon(true);
t.start();
Thread.sleep(2000); // main acaba e leva o daemon junto`}),e.jsx("h2",{children:"Identificando a thread atual"}),e.jsxs("p",{children:[e.jsx("code",{children:"Thread.currentThread()"})," retorna quem está executando agora. Útil pra debug e logs:"]}),e.jsx(a,{code:`System.out.println("Eu sou: " + Thread.currentThread().getName());
// Em Java 19+, threadId() retorna long único
System.out.println("ID: " + Thread.currentThread().threadId());`}),e.jsxs(r,{type:"warning",title:"Por que NÃO usar stop(), suspend(), resume()",children:["Esses métodos foram ",e.jsx("strong",{children:"deprecated faz mais de 20 anos"})," e removidos em Java 21+. Eles matam a thread no meio do caminho, deixando locks travados e dados corrompidos. O caminho moderno: cooperação por flag ",e.jsx("code",{children:"volatile boolean"}),"ou via ",e.jsx("code",{children:"Thread.interrupt()"})," + checagem de ",e.jsx("code",{children:"isInterrupted()"}),"."]}),e.jsx(a,{title:"Parando uma thread do jeito certo",code:`Thread t = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // trabalho...
    }
    System.out.println("Saí limpo!");
});
t.start();
Thread.sleep(1000);
t.interrupt(); // pede pra parar
t.join();`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie 5 threads que imprimem o próprio nome 3 vezes cada, com um ",e.jsx("code",{children:"sleep(100)"}),"entre prints. Use ",e.jsx("code",{children:"join()"}),' no main pra esperar todas terminarem antes de imprimir "fim".']}),e.jsx("li",{children:"Faça uma thread daemon que imprime a hora atual a cada segundo. No main, durma 5 segundos e termine. Confirme que a JVM encerra junto."}),e.jsxs("li",{children:["Crie uma thread que fica num loop infinito incrementando um contador. No main, após 1 segundo, chame ",e.jsx("code",{children:"interrupt()"})," e imprima o valor final do contador. (Dica: deixe a variável como ",e.jsx("code",{children:"volatile"})," ou use ",e.jsx("code",{children:"AtomicLong"}),".)"]})]})]})}export{s as default};
