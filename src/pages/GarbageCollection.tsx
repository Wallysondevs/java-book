import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GarbageCollection() {
  return (
    <PageContainer title="Garbage Collection" subtitle="Como a JVM libera memória sozinha — e por que isso afeta sua latência." difficulty="avancado" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Em C, você chama <code>malloc</code> e depois <code>free</code>. Esquece o <code>free</code>e tem vazamento; libera duas vezes e o programa explode. Em Java, esse trabalho é da JVM. Mas isso não significa que dá pra ignorar memória: o coletor (GC) <strong>pausa</strong> a sua aplicação enquanto trabalha. Se você não entende como ele decide o que limpar, sua API de 10ms vai ter picos de 800ms sem explicação.
        </p><h2>A premissa: alcançabilidade</h2><p>
          O GC parte de uma ideia simples: um objeto está <em>vivo</em> se alguma referência partindo das <strong>GC roots</strong> (variáveis locais em threads ativas, campos estáticos, JNI) consegue chegar nele. O resto é lixo. Isso é varrido periodicamente.
        </p><CodeBlock title="Alcançabilidade na prática" code={`void exemplo() {
    Cliente c = new Cliente("Ana"); // 'c' é GC root local
    salvar(c);
    c = null; // agora não há mais referência viva — vira lixo
}`} /><h2>Hipótese geracional</h2><p>
          Empiricamente, <strong>a maioria dos objetos morre cedo</strong> (uma string montada num loop, um DTO de request HTTP). Por isso o heap é dividido em gerações:
        </p><ul>
          <li>
            <strong>Young Generation</strong>: onde objetos novos nascem (Eden + 2 Survivors).
          </li><li>
            <strong>Old Generation</strong>: para objetos que sobreviveram a vários ciclos.
          </li>
        </ul><h3>Minor GC vs Major/Full GC</h3><ul>
          <li>
            <strong>Minor GC</strong>: limpa só a Young. Rápido (poucos ms), frequente.
          </li><li>
            <strong>Major / Full GC</strong>: mexe na Old (e às vezes em tudo). Lento, pode pausar centenas de ms.
          </li>
        </ul><h2>Algoritmos disponíveis no Java 21</h2><ul>
          <li>
            <strong>G1 (Garbage First)</strong>: padrão desde Java 11. Divide o heap em regiões e prioriza as mais cheias de lixo. Bom default geral.
          </li><li>
            <strong>Parallel GC</strong>: foco em <em>throughput</em> bruto. Pausas maiores, mas faz mais trabalho por minuto. Útil em batch.
          </li><li>
            <strong>ZGC</strong>: pausas sub-milissegundo mesmo com heap de centenas de GB. Para baixa latência.
          </li><li>
            <strong>Shenandoah</strong>: filosofia parecida com ZGC (concurrent compaction), mantida pela Red Hat.
          </li>
        </ul><CodeBlock title="Escolhendo o coletor por flag" code={`# G1 (default no 21, não precisa setar)
java -XX:+UseG1GC -jar app.jar

# Throughput máximo
java -XX:+UseParallelGC -jar app.jar

# Latência mínima
java -XX:+UseZGC -jar app.jar

# Generational ZGC (Java 21+)
java -XX:+UseZGC -XX:+ZGenerational -jar app.jar`} /><AlertBox type="tip" title="Regra do dedão">
          Web/API com SLA apertado → ZGC. Job batch noturno → Parallel. Microserviço genérico → G1 (não invente).
        </AlertBox><h2>System.gc() — não chame</h2><p>
          É só uma <em>sugestão</em> pra JVM. Em produção, força um Full GC quando ela ia fazer algo mais inteligente. Praticamente todo guideline sério proíbe.
        </p><CodeBlock title="Anti-padrão clássico" code={`// Se você está tentado a fazer isso, o problema é outro
List<byte[]> cache = new ArrayList<>();
// ... enche o cache ...
cache.clear();
System.gc(); // não vai te salvar`} /><h2>Finalize() está morto</h2><p>
          O método <code>finalize()</code> está deprecado desde o Java 9 (e marcado pra remoção). Era imprevisível, lento e podia ressuscitar objetos. Use <code>try-with-resources</code>para fechar recursos, ou <code>java.lang.ref.Cleaner</code> quando precisa de limpeza nativa fora do <code>close()</code>.
        </p><CodeBlock title="Cleaner em vez de finalize" code={`import java.lang.ref.Cleaner;

public class Recurso implements AutoCloseable {
    private static final Cleaner CLEANER = Cleaner.create();
    private final Cleaner.Cleanable cleanable;

    public Recurso() {
        long handle = abrirRecursoNativo();
        this.cleanable = CLEANER.register(this, () -> liberar(handle));
    }

    @Override public void close() { cleanable.clean(); }

    private static long abrirRecursoNativo() { return 42L; }
    private static void liberar(long h) { System.out.println("liberado " + h); }
}`} /><h2>Logs de GC</h2><p>Sem logs, você está adivinhando. Ative o unified logging:</p><CodeBlock title="Logging de GC moderno" code={`# Resumo simples
java -Xlog:gc -jar app.jar

# Detalhado, com timestamps, em arquivo rotativo
java -Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=10M -jar app.jar`} /><h2>Ferramentas para olhar</h2><ul>
          <li>
            <strong>GCViewer</strong>: abre o <code>gc.log</code> e mostra gráficos de pausa, throughput, ocupação.
          </li><li>
            <strong>VisualVM</strong>: ao vivo, monitora heap, threads, classes carregadas.
          </li><li>
            <strong>JDK Mission Control</strong>: análise profunda via JFR (próxima página).
          </li>
        </ul><AlertBox type="warning" title="Não tune sem medir">
          99% dos problemas atribuídos ao GC são, na verdade, código alocando demais. Reduza<code>new</code> em hot path antes de mudar coletor.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um programinha que aloca 1 milhão de <code>byte[]</code> de 1KB num loop. Rode com <code>-Xlog:gc</code> e observe minor GCs acontecendo. Depois rode com<code>-XX:+UseParallelGC</code> e compare a frequência das pausas.
          </li><li>
            Force um <code>OutOfMemoryError</code> com <code>-Xmx64m</code> e uma lista que cresce sem fim. Adicione <code>-XX:+HeapDumpOnOutOfMemoryError</code> e abra o dump no VisualVM.
          </li><li>
            Implemente uma classe com <code>Cleaner</code> que apenas imprime <em>“liberado”</em>quando o objeto vira lixo. Crie 1000 instâncias num loop, descarte e force GC para ver a ordem (não garantida) das limpezas.
          </li>
        </ol>
      </PageContainer>
  );
}
