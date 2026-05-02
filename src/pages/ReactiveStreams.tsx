import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ReactiveStreams() {
  return (
    <PageContainer title="Reactive Streams: Flow API" subtitle="Backpressure padronizado — base de Reactor, RxJava, Akka." difficulty="avancado" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine um Kafka cuspindo 100 mil eventos por segundo e seu serviço só processa 10 mil. Sem controle, a fila cresce na memória até estourar — <strong>OutOfMemoryError</strong>. Esse é o problema que <em>Reactive Streams</em> resolve: dar ao consumidor uma forma padronizada de dizer "calma, me manda só N por vez".
        </p><p>
          Você raramente vai implementar essas interfaces na mão — usa Reactor, RxJava ou Mutiny. Mas conhecer o contrato é o que diferencia quem entende reativo de quem só copia código pronto.
        </p><h2>As 3 estratégias clássicas</h2><ul>
          <li>
            <strong>Pull (Iterator):</strong> consumidor puxa um por um. Seguro, mas síncrono e lento — você bloqueia esperando o próximo.
          </li><li>
            <strong>Push (Observer):</strong> produtor empurra quando quiser. Rápido, mas sem freio — o consumidor pode afogar.
          </li><li>
            <strong>Reactive Streams:</strong> push <em>com</em> backpressure. Consumidor pede <code>n</code> itens, produtor só manda essa quantidade.
          </li>
        </ul><h2>A Flow API (Java 9+)</h2><p>
          Em <code>java.util.concurrent.Flow</code> existem 4 interfaces, copiadas literalmente da especificação Reactive Streams:
        </p><ul>
          <li>
            <code>
              {"Publisher<T>"}
            </code> — produz itens. Tem um único método: <code>subscribe(Subscriber)</code>.
          </li><li>
            <code>
              {"Subscriber<T>"}
            </code> — consome. Tem <code>onSubscribe</code>, <code>onNext</code>, <code>onError</code>, <code>onComplete</code>.
          </li><li>
            <code>Subscription</code> — handshake. Tem <code>request(long n)</code> e <code>cancel()</code>.
          </li><li>
            <code>
              {"Processor<T,R>"}
            </code> — é Subscriber e Publisher ao mesmo tempo (transformador no meio).
          </li>
        </ul><CodeBlock title="Subscriber mínimo (didático)" code={`import java.util.concurrent.Flow.*;

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
}`} /><h2>Como o handshake funciona</h2><ol>
          <li>
            Você chama <code>publisher.subscribe(meuSubscriber)</code>.
          </li><li>
            O publisher chama <code>onSubscribe(subscription)</code> no seu subscriber.
          </li><li>
            Você chama <code>subscription.request(n)</code> para pedir até n itens.
          </li><li>
            O publisher chama <code>onNext</code> até n vezes (ou menos).
          </li><li>
            Você pede mais com <code>request</code>, ou cancela com <code>cancel</code>.
          </li><li>
            Quando acabou, vem <code>onComplete</code>; se falhou, <code>onError</code>.
          </li>
        </ol><h2>Usando o SubmissionPublisher pronto</h2><p>
          O JDK tem uma implementação básica, <code>SubmissionPublisher</code>, útil para experimentar sem libs externas:
        </p><CodeBlock title="Publisher e Subscriber em ação" code={`import java.util.concurrent.SubmissionPublisher;

try (var publisher = new SubmissionPublisher<Integer>()) {
    publisher.subscribe(new LogSubscriber());
    for (int i = 1; i <= 5; i++) {
        publisher.submit(i);
    }
} // close = onComplete automático`} /><AlertBox type="warning" title="Não reinvente a roda">
          Implementar Publisher correto (com regras de concorrência, cancelamento, etc.) é difícil. A spec tem +30 regras. Use Reactor ou RxJava — eles já passaram nos TCKs oficiais.
        </AlertBox><h2>O ecossistema reativo</h2><ul>
          <li>
            <strong>Project Reactor</strong> — base do Spring WebFlux. Tipos <code>
              {"Mono<T>"}
            </code> e <code>
              {"Flux<T>"}
            </code>.
          </li><li>
            <strong>RxJava 3</strong> — original Netflix, ainda forte em Android.
          </li><li>
            <strong>Mutiny</strong> — usado pelo Quarkus, foco em legibilidade.
          </li><li>
            <strong>R2DBC</strong> — drivers reativos para banco (Postgres, MySQL, MSSQL).
          </li><li>
            <strong>WebFlux / Vert.x</strong> — HTTP server reativo, sobre Netty.
          </li>
        </ul><p>
          Todos eles falam a mesma língua porque implementam Reactive Streams: você consegue ligar um <code>Flux</code> do Reactor num <code>Observable</code> do RxJava sem ginástica.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              SubmissionPublisher{"<String>"}
            </code>, inscreva o <code>LogSubscriber</code> adaptado para String, e envie 10 mensagens. Imprima no <code>onNext</code> a thread atual e veja que o publisher usa um pool próprio.
          </li><li>
            Modifique o subscriber para pedir <code>request(3)</code> só uma vez (não pedir mais no <code>onNext</code>). Envie 10 itens — observe que só 3 chegam. Esse é o backpressure em ação.
          </li><li>
            Crie um <code>Processor</code> simples que recebe Integer, multiplica por 2 e republica. Encadeie: Publisher → Processor → Subscriber. Veja como ele participa dos dois lados do contrato.
          </li>
        </ol>
      </PageContainer>
  );
}
