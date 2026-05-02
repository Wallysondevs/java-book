import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MemoryModel() {
  return (
    <PageContainer title="Memory Model: heap, stack e metaspace" subtitle="Onde cada coisa mora e como vazamentos acontecem." difficulty="avancado" timeToRead="18 min">
        <h2>Por que você precisa disso</h2><p>
          Quando alguém te pergunta “onde fica o objeto <code>X</code>?” e você responde “na memória”, é porque ainda não passou por um <code>OutOfMemoryError</code> em produção. Saber a divisão da memória da JVM transforma erros crípticos em diagnóstico de 30 segundos.
        </p><h2>Stack: rápida e por thread</h2><p>
          Cada thread tem sua própria <strong>stack</strong>. A cada chamada de método, um<em>frame</em> é empilhado contendo:
        </p><ul>
          <li>
            Variáveis locais primitivas (<code>int</code>, <code>boolean</code>, etc).
          </li><li>
            <strong>Referências</strong> a objetos (a referência mora na stack; o objeto, no heap).
          </li><li>Endereço de retorno e parâmetros.</li>
        </ul><p>
          Quando o método retorna, o frame é descartado — sem GC envolvido. Por isso variáveis locais primitivas são gratuitas.
        </p><CodeBlock title="O que vai onde" code={`void exemplo() {
    int idade = 30;              // 'idade' (primitivo) → STACK
    String nome = "Ana";         // 'nome' (referência) → STACK
                                 // a String "Ana" em si → HEAP
    Pessoa p = new Pessoa(nome); // 'p' → STACK; objeto Pessoa → HEAP
}`} /><AlertBox type="tip" title="StackOverflowError">
          Recursão sem caso base estoura a stack. Não é o heap que enche, é a pilha de frames.
        </AlertBox><h2>Heap: onde os objetos vivem</h2><p>
          Tudo que você cria com <code>new</code> mora no <strong>heap</strong>, compartilhado entre todas as threads. É a maior área e a única gerenciada pelo GC. Internamente é dividida em gerações:
        </p><ul>
          <li>
            <strong>Young Generation</strong>:<ul>
              <li>
                <strong>Eden</strong>: onde objetos novos nascem.
              </li><li>
                <strong>Survivor 0 e Survivor 1</strong>: dois espaços que se alternam para guardar quem sobreviveu ao último Minor GC.
              </li>
            </ul>
          </li><li>
            <strong>Old Generation</strong>: para objetos que sobreviveram a vários ciclos de Minor GC.
          </li>
        </ul><h2>Metaspace</h2><p>
          Desde o Java 8, metadados de classes (estrutura, métodos, constantes) vivem no<strong> Metaspace</strong>, que substituiu o antigo <em>PermGen</em>. Diferenças importantes:
        </p><ul>
          <li>
            Mora em <strong>memória nativa</strong>, não no heap.
          </li><li>Cresce dinamicamente — sem limite por padrão.</li><li>
            Pode estourar em apps que fazem hot-reload de classes (servidores de aplicação, frameworks de plugin).
          </li>
        </ul><CodeBlock title="Limitando metaspace" code="java -XX:MaxMetaspaceSize=512m -jar app.jar" /><h2>Code Cache</h2><p>
          O código nativo gerado pelo JIT é guardado no <strong>Code Cache</strong>. Se enche, o JIT para de compilar e tudo volta a rodar interpretado — você vê uma queda misteriosa de performance. Em apps grandes, vale ajustar:
        </p><CodeBlock title="Aumentando o code cache" code="java -XX:ReservedCodeCacheSize=512m -jar app.jar" /><h2>Off-heap</h2><p>
          Algumas APIs alocam memória <strong>fora do heap</strong>, gerenciada manualmente:
        </p><ul>
          <li>
            <code>DirectByteBuffer</code>: usado por NIO, Netty, drivers de banco. Liberada quando o objeto java é coletado, mas pode demorar.
          </li><li>
            <code>sun.misc.Unsafe</code>: API interna histórica, em vias de remoção.
          </li><li>
            <strong>Foreign Function & Memory API</strong> (Java 21+, finalizada no 22): substituto moderno e seguro do <code>Unsafe</code>.
          </li><li>
            Memory-mapped files via <code>FileChannel.map</code>.
          </li>
        </ul><CodeBlock title="Buffer direto (off-heap)" code={`import java.nio.ByteBuffer;

ByteBuffer buf = ByteBuffer.allocateDirect(1024 * 1024); // 1MB off-heap
buf.putInt(42);
// Não conta no -Xmx, mas conta no RSS do processo`} /><h2>Como você vaza memória em Java</h2><p>
          “Mas o GC não cuida disso?” Cuida do que vira <em>inalcançável</em>. Se você mantém referência viva sem perceber, o GC é obrigado a manter o objeto. Padrões clássicos:
        </p><ul>
          <li>
            <strong>Cache estático infinito</strong>: um <code>
              {"static Map<K,V>"}
            </code> que só cresce. Use <code>WeakHashMap</code> ou Caffeine com expiração.
          </li><li>
            <strong>Listeners não removidos</strong>: você registra callback e nunca chama <code>remove</code>; o publicador segura você pra sempre.
          </li><li>
            <strong>ThreadLocal não limpo em pool</strong>: thread volta pro pool com <code>ThreadLocal</code> ainda preenchido. Sempre faça <code>remove()</code> em <code>finally</code>.
          </li><li>
            <strong>Coleções dentro de objetos longos</strong>: o <code>
              {"List<Pedido>"}
            </code> daquele <code>Cliente</code> singleton só cresce.
          </li>
        </ul><CodeBlock title="ThreadLocal seguro em pool" code={`private static final ThreadLocal<Contexto> CTX = new ThreadLocal<>();

void handle() {
    CTX.set(new Contexto());
    try {
        processar();
    } finally {
        CTX.remove(); // CRÍTICO em thread pool
    }
}`} /><h2>Diagnóstico</h2><CodeBlock title="Histograma de objetos vivos" code={`# Top classes por bytes ocupados
jmap -histo:live <pid> | head -30

# Saída (resumida):
#  num     #instances         #bytes  class name
#    1:        1234567       98765432  [B (byte arrays)
#    2:         500000       40000000  java.util.HashMap$Node`} /><CodeBlock title="Heap dump completo" code={`# Gera arquivo de algumas centenas de MB
jmap -dump:live,format=b,file=heap.hprof <pid>

# Abra com:
#  - Eclipse MAT (melhor pra leak suspect)
#  - VisualVM
#  - JDK Mission Control`} /><AlertBox type="warning" title="Cuidado com jmap em produção">
          <code>jmap -dump</code> congela a JVM enquanto escreve o arquivo. Em apps grandes pode pausar segundos. Prefira <code>
            {"jcmd <pid> GC.heap_dump arquivo.hprof"}
          </code>, que também faz dump mas com semântica mais suave.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um programa com <code>
              {"static List<byte[]> cache = new ArrayList<>()"}
            </code>que adiciona 10MB por iteração até morrer. Antes do OOM, tire heap dump e identifique a classe culpada no MAT.
          </li><li>
            Crie uma thread pool com 4 threads e um <code>ThreadLocal</code> propositalmente sem<code>remove()</code>. Submeta 100 mil tarefas e observe via <code>jmap -histo</code> a memória crescer indefinidamente. Adicione o <code>remove()</code> e veja a curva achatar.
          </li><li>
            Compare alocação on-heap (<code>new byte[1_000_000]</code>) vs off-heap (<code>ByteBuffer.allocateDirect(1_000_000)</code>) num loop de 1000 iterações. Observe como o <code>-Xmx</code> reage de modos diferentes.
          </li>
        </ol>
      </PageContainer>
  );
}
