import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JvmTuning() {
  return (
    <PageContainer title="JVM Tuning na prática" subtitle="-Xmx, -Xms, -XX flags — quando ajustar e quando deixar a JVM decidir." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Mais cedo ou mais tarde sua aplicação vai dar <code>OutOfMemoryError</code> em produção, ou vai ficar comendo 200% de CPU sem motivo aparente. Saber as flags certas é a diferença entre ajustar uma linha do <em>Dockerfile</em> e passar a madrugada inteira no Slack.
        </p><AlertBox type="warning" title="Regra de ouro">
          Meça <strong>antes</strong> de tunar. Tuning sem perfil é superstição.
        </AlertBox><h2>Heap: -Xms e -Xmx</h2><p>
          <code>-Xms</code> é o tamanho inicial do heap, <code>-Xmx</code> é o máximo. A JVM começa com <code>-Xms</code>, cresce até <code>-Xmx</code> e nunca passa disso.
        </p><CodeBlock title="Definindo heap" code={`# 512MB inicial, 2GB máximo
java -Xms512m -Xmx2g -jar app.jar

# Comum em produção: igualar inicial e máximo
# (evita resize durante o pico e fragmentação)
java -Xms2g -Xmx2g -jar app.jar`} /><h2>JVM ergonomics</h2><p>
          Sem flags, a JVM <em>escolhe sozinha</em> com base na máquina: normalmente <strong>25% da RAM</strong> como <code>-Xmx</code>, número de GC threads baseado nos cores. Em desktop isso é razoável; em container é geralmente errado.
        </p><h2>Container-aware</h2><p>
          Desde o Java 10, a JVM lê os limites do cgroup do container — <code>-XX:+UseContainerSupport</code>está ligado por padrão. Sem isso, a JVM via toda a RAM do host e tomava OOM-kill do Linux.
        </p><CodeBlock title="Tamanho de heap por porcentagem (recomendado em containers)" code={`# Use 75% da memória do container como heap máximo
java -XX:MaxRAMPercentage=75 -jar app.jar

# Também existem InitialRAMPercentage e MinRAMPercentage
java -XX:InitialRAMPercentage=50 \\
     -XX:MaxRAMPercentage=75 \\
     -jar app.jar`} /><AlertBox type="tip" title="Por que não 100%?">
          Heap não é a única memória da JVM. Tem Metaspace, thread stacks, code cache, buffers nativos. Se você setar 100%, o sistema operacional mata seu container.
        </AlertBox><h2>Metaspace</h2><p>
          Metadados de classes carregadas vivem fora do heap, no Metaspace (Java 8+). Por padrão é ilimitado — o que pode mascarar vazamento de classloader. Em produção vale limitar:
        </p><CodeBlock title="Limites de Metaspace" code={`java -XX:MetaspaceSize=128m \\
     -XX:MaxMetaspaceSize=512m \\
     -jar app.jar`} /><h2>Stack por thread</h2><p>
          Cada thread tem sua própria stack (default ~1MB). Se você cria 5000 threads, lá vão 5GB só de stack. <code>-Xss</code> ajusta:
        </p><CodeBlock title="Stack menor para muitas threads" code="java -Xss256k -jar app.jar" /><h2>Flags diagnósticas que você sempre quer</h2><p>
          Em qualquer ambiente que possa quebrar (ou seja: produção), ative captura automática de heap dump no OOM:
        </p><CodeBlock title="OOM = heap dump na próxima vez" code={`java -XX:+HeapDumpOnOutOfMemoryError \\
     -XX:HeapDumpPath=/var/log/app/heapdumps \\
     -XX:+ExitOnOutOfMemoryError \\
     -jar app.jar`} /><h2>Ver flags efetivas</h2><p>Quer saber quais valores a JVM está usando agora? Ela imprime tudo:</p><CodeBlock title="Flags resolvidas" code={`# Imprime todas as flags com valor final
java -XX:+PrintFlagsFinal -version | grep MaxHeapSize

# Só as alteradas em relação ao default
java -XX:+PrintCommandLineFlags -version`} /><h2>Onde ajustar e onde não ajustar</h2><ul>
          <li>
            <strong>Sempre defina</strong> <code>-Xmx</code> ou <code>-XX:MaxRAMPercentage</code> em containers.
          </li><li>
            <strong>Sempre ative</strong> <code>HeapDumpOnOutOfMemoryError</code> em produção.
          </li><li>
            <strong>Pense duas vezes</strong> antes de mexer em GC threads, survivor ratio, tenuring threshold. Default existe por bom motivo.
          </li><li>
            <strong>Nunca</strong> copie um conjunto de flags de blog post de 2015 sem entender cada uma.
          </li>
        </ul><AlertBox type="danger" title="O cemitério das flags">
          <code>-XX:+UseConcMarkSweepGC</code> (CMS) foi removido no Java 14. <code>-XX:PermSize</code>não existe desde o 8. Se você herdou um script com essas, limpe.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Suba sua aplicação Spring Boot favorita em um container com 512MB de RAM. Sem nenhuma flag, observe a JVM decidir o heap. Depois force <code>-XX:MaxRAMPercentage=75</code> e compare via <code>
              {"jcmd <pid> VM.flags"}
            </code>.
          </li><li>
            Crie um app que aloca <code>new byte[50 * 1024 * 1024]</code> num loop. Rode com<code>-Xmx256m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp</code> e abra o dump no Eclipse MAT.
          </li><li>
            Use <code>-XX:+PrintFlagsFinal</code> para descobrir o valor padrão de<code>MaxGCPauseMillis</code> na sua JVM. Depois mude para <code>50</code> e meça se afeta latência percentil 99.
          </li>
        </ol>
      </PageContainer>
  );
}
