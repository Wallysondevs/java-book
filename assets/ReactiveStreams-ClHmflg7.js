import{j as e}from"./index-BpXci30S.js";import{P as s,A as i}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function a(){return e.jsxs(s,{title:"Reactive Streams: Flow API",subtitle:"Backpressure padronizado — base de Reactor, RxJava, Akka.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Imagine um Kafka cuspindo 100 mil eventos por segundo e seu serviço só processa 10 mil. Sem controle, a fila cresce na memória até estourar — ",e.jsx("strong",{children:"OutOfMemoryError"}),". Esse é o problema que ",e.jsx("em",{children:"Reactive Streams"}),' resolve: dar ao consumidor uma forma padronizada de dizer "calma, me manda só N por vez".']}),e.jsx("p",{children:"Você raramente vai implementar essas interfaces na mão — usa Reactor, RxJava ou Mutiny. Mas conhecer o contrato é o que diferencia quem entende reativo de quem só copia código pronto."}),e.jsx("h2",{children:"As 3 estratégias clássicas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Pull (Iterator):"})," consumidor puxa um por um. Seguro, mas síncrono e lento — você bloqueia esperando o próximo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Push (Observer):"})," produtor empurra quando quiser. Rápido, mas sem freio — o consumidor pode afogar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reactive Streams:"})," push ",e.jsx("em",{children:"com"})," backpressure. Consumidor pede ",e.jsx("code",{children:"n"})," itens, produtor só manda essa quantidade."]})]}),e.jsx("h2",{children:"A Flow API (Java 9+)"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"java.util.concurrent.Flow"})," existem 4 interfaces, copiadas literalmente da especificação Reactive Streams:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Publisher<T>"})," — produz itens. Tem um único método: ",e.jsx("code",{children:"subscribe(Subscriber)"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Subscriber<T>"})," — consome. Tem ",e.jsx("code",{children:"onSubscribe"}),", ",e.jsx("code",{children:"onNext"}),", ",e.jsx("code",{children:"onError"}),", ",e.jsx("code",{children:"onComplete"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Subscription"})," — handshake. Tem ",e.jsx("code",{children:"request(long n)"})," e ",e.jsx("code",{children:"cancel()"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Processor<T,R>"})," — é Subscriber e Publisher ao mesmo tempo (transformador no meio)."]})]}),e.jsx(r,{title:"Subscriber mínimo (didático)",code:`import java.util.concurrent.Flow.*;

class LogSubscriber implements Subscriber<Integer> {
    private Subscription sub;

    @Override
    public void onSubscribe(Subscription s) {
        this.sub = s;
        s.request(1); // pede o primeiro item — backpressure!
    }

    @Override
    public void onNext(Integer item) {
        System.out.println("recebi: " + item);
        sub.request(1); // pede o próximo, um a um
    }

    @Override
    public void onError(Throwable t) {
        System.err.println("erro: " + t);
    }

    @Override
    public void onComplete() {
        System.out.println("fim");
    }
}`}),e.jsx("h2",{children:"Como o handshake funciona"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Você chama ",e.jsx("code",{children:"publisher.subscribe(meuSubscriber)"}),"."]}),e.jsxs("li",{children:["O publisher chama ",e.jsx("code",{children:"onSubscribe(subscription)"})," no seu subscriber."]}),e.jsxs("li",{children:["Você chama ",e.jsx("code",{children:"subscription.request(n)"})," para pedir até n itens."]}),e.jsxs("li",{children:["O publisher chama ",e.jsx("code",{children:"onNext"})," até n vezes (ou menos)."]}),e.jsxs("li",{children:["Você pede mais com ",e.jsx("code",{children:"request"}),", ou cancela com ",e.jsx("code",{children:"cancel"}),"."]}),e.jsxs("li",{children:["Quando acabou, vem ",e.jsx("code",{children:"onComplete"}),"; se falhou, ",e.jsx("code",{children:"onError"}),"."]})]}),e.jsx("h2",{children:"Usando o SubmissionPublisher pronto"}),e.jsxs("p",{children:["O JDK tem uma implementação básica, ",e.jsx("code",{children:"SubmissionPublisher"}),", útil para experimentar sem libs externas:"]}),e.jsx(r,{title:"Publisher e Subscriber em ação",code:`import java.util.concurrent.SubmissionPublisher;

try (var publisher = new SubmissionPublisher<Integer>()) {
    publisher.subscribe(new LogSubscriber());
    for (int i = 1; i <= 5; i++) {
        publisher.submit(i);
    }
} // close = onComplete automático`}),e.jsx(i,{type:"warning",title:"Não reinvente a roda",children:"Implementar Publisher correto (com regras de concorrência, cancelamento, etc.) é difícil. A spec tem +30 regras. Use Reactor ou RxJava — eles já passaram nos TCKs oficiais."}),e.jsx("h2",{children:"O ecossistema reativo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Project Reactor"})," — base do Spring WebFlux. Tipos ",e.jsx("code",{children:"Mono<T>"})," e ",e.jsx("code",{children:"Flux<T>"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RxJava 3"})," — original Netflix, ainda forte em Android."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mutiny"})," — usado pelo Quarkus, foco em legibilidade."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"R2DBC"})," — drivers reativos para banco (Postgres, MySQL, MSSQL)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"WebFlux / Vert.x"})," — HTTP server reativo, sobre Netty."]})]}),e.jsxs("p",{children:["Todos eles falam a mesma língua porque implementam Reactive Streams: você consegue ligar um ",e.jsx("code",{children:"Flux"})," do Reactor num ",e.jsx("code",{children:"Observable"})," do RxJava sem ginástica."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsxs("code",{children:["SubmissionPublisher","<String>"]}),", inscreva o ",e.jsx("code",{children:"LogSubscriber"})," adaptado para String, e envie 10 mensagens. Imprima no ",e.jsx("code",{children:"onNext"})," a thread atual e veja que o publisher usa um pool próprio."]}),e.jsxs("li",{children:["Modifique o subscriber para pedir ",e.jsx("code",{children:"request(3)"})," só uma vez (não pedir mais no ",e.jsx("code",{children:"onNext"}),"). Envie 10 itens — observe que só 3 chegam. Esse é o backpressure em ação."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"Processor"})," simples que recebe Integer, multiplica por 2 e republica. Encadeie: Publisher → Processor → Subscriber. Veja como ele participa dos dois lados do contrato."]})]})]})}export{a as default};
