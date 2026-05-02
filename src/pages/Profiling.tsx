import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Profiling() {
  return (
    <PageContainer title="Profiling: JFR e async-profiler" subtitle="Achar gargalos sem chutômetro — CPU, alocação, locks." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Sua API está lenta. O time chuta: “é o banco”. Outro chuta: “deve ser GC”. Sem profiler, é tudo achismo. Com profiler, em 5 minutos você descobre que 70% do CPU está sendo gasto num <code>String.format</code> dentro de log que ninguém lê.
        </p><h2>Java Flight Recorder (JFR)</h2><p>
          O JFR vem <strong>embutido na JDK</strong> e é <strong>grátis para produção desde o Java 11</strong>. Era pago da Oracle até então. Overhead típico: menos de 1% de CPU. Pode rodar sempre ligado.
        </p><CodeBlock title="Coletar 60 segundos de profile" code={`# Descubra o PID
jps

# Inicia gravação de 60s
jcmd <pid> JFR.start name=meu duration=60s filename=meu.jfr

# Ou, se quiser controlar manualmente
jcmd <pid> JFR.start name=meu
jcmd <pid> JFR.dump name=meu filename=meu.jfr
jcmd <pid> JFR.stop name=meu`} /><p>Você também pode pedir gravação automática ao iniciar a JVM:</p><CodeBlock title="JFR no startup" code="java -XX:StartFlightRecording=duration=60s,filename=startup.jfr -jar app.jar" /><h3>Abrir o resultado</h3><p>
          Use o <strong>JDK Mission Control (JMC)</strong>. Ele decompõe o <code>.jfr</code> em várias visões: hot methods, alocações, pausas de GC, contenção de lock, IO de arquivo e socket, exceções lançadas. Tudo correlacionado por timestamp.
        </p><AlertBox type="tip" title="O que olhar primeiro">
          <strong>Method Profiling</strong> → ordene por “Total Sample Count”. O que está no topo é onde sua CPU foi parar. Geralmente surpreende.
        </AlertBox><h2>async-profiler</h2><p>
          Profiler externo, gratuito, baseado em <em>sampling</em> (muito barato). Vantagens sobre o JFR: pega <em>stacks nativos</em> também (JNI, syscalls), e gera <strong>flame graph</strong>direto em SVG/HTML.
        </p><CodeBlock title="Profiling de CPU por 30s, gera flame graph" code={`./profiler.sh -d 30 -f flame.html <pid>

# Profile de alocação (em vez de CPU)
./profiler.sh -d 30 -e alloc -f alloc.html <pid>

# Profile de wall-clock (inclui tempo bloqueado)
./profiler.sh -d 30 -e wall -f wall.html <pid>`} /><h3>Interpretando flame graph</h3><ul>
          <li>
            Cada caixa é um método. <strong>Largura = tempo gasto</strong> (samples).
          </li><li>Caixa em cima fica em cima da que a chamou. A pilha cresce de baixo pra cima.</li><li>
            “Platô largo” = o gargalo. Caixas finas e altas = profundidade de chamada, geralmente irrelevante.
          </li>
        </ul><AlertBox type="note" title="CPU vs Wall-clock">
          <code>cpu</code> mostra onde você queima ciclos. <code>wall</code> mostra onde a thread passa tempo (incluindo <em>esperando</em> IO ou lock). Se o problema é “tá lento mas CPU baixa”, use wall.
        </AlertBox><h2>JConsole e VisualVM</h2><p>
          Para uma visão ao vivo (sem gravar arquivo) das métricas básicas — heap, threads, classes, JMX MBeans — abra <strong>JConsole</strong> ou <strong>VisualVM</strong> e conecte no PID local. Útil em desenvolvimento. Em produção, prefira JFR contínuo + Prometheus.
        </p><h2>Native Memory Tracking</h2><p>
          Heap dump não mostra memória <em>nativa</em> (DirectByteBuffer, GC interno, threads, JIT). Para isso, ative o NMT:
        </p><CodeBlock title="NMT detalhado" code={`java -XX:NativeMemoryTracking=detail -jar app.jar

# Em outra janela:
jcmd <pid> VM.native_memory summary
jcmd <pid> VM.native_memory detail`} /><p>
          Quando você ver “processo Java consumindo 8GB e o heap só tem 2GB”, NMT é onde os outros 6GB aparecem.
        </p><h2>Resumindo a caixa de ferramentas</h2><ul>
          <li>
            <strong>JFR</strong>: profile rico, baixo overhead, pode ficar sempre ligado.
          </li><li>
            <strong>async-profiler</strong>: CPU e alocação detalhadíssima, flame graph.
          </li><li>
            <strong>VisualVM/JConsole</strong>: monitoramento ao vivo durante dev.
          </li><li>
            <strong>NMT</strong>: memória fora do heap.
          </li><li>
            <strong>jcmd</strong>: canivete suíço para dialogar com a JVM.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue uma aplicação sua, descubra o PID com <code>jps</code> e grave 30 segundos com JFR. Abra no JDK Mission Control e identifique o método mais quente.
          </li><li>
            Baixe o <code>async-profiler</code> e gere um flame graph de CPU. Encontre o platô mais largo e leia o código daquele método. Ele faz o que você esperava ser caro?
          </li><li>
            Rode com <code>-XX:NativeMemoryTracking=summary</code> e use<code>jcmd VM.native_memory summary</code> para descobrir quanto sua JVM está usando fora do heap. Compare com <code>top</code> / RSS do processo.
          </li>
        </ol>
      </PageContainer>
  );
}
