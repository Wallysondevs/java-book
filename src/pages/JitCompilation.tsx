import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JitCompilation() {
  return (
    <PageContainer title="JIT: como Java fica rápido em runtime" subtitle="Bytecode → código nativo otimizado, peças quentes ganham priority." difficulty="avancado" timeToRead="18 min">
        <h2>Por que você precisa disso</h2><p>
          “Java é lento” é mito de 1998. Hoje código Java estável compete com C++ em throughput. O segredo é o <strong>JIT</strong> (Just-In-Time compiler), que transforma seu bytecode em código nativo otimizado <em>enquanto a aplicação roda</em>. Entender isso explica por que o primeiro request da sua API demora 200ms e o milésimo demora 2ms.
        </p><h2>O ponto de partida: interpretação</h2><p>
          Quando a JVM carrega uma classe, ela <strong>interpreta</strong> o bytecode instrução por instrução. É portátil, simples, e <em>lento</em> — talvez 10x mais lento que código nativo equivalente.
        </p><CodeBlock title="Bytecode antes de virar nativo" code={`// Java
int soma(int a, int b) { return a + b; }

// Bytecode (javap -c)
//   iload_1   // carrega 'a'
//   iload_2   // carrega 'b'
//   iadd      // soma
//   ireturn   // retorna`} /><h2>JIT entra em ação</h2><p>
          A JVM mantém um <strong>contador de invocações</strong> por método. Quando passa de um limite, o método é considerado <em>hot</em> e enviado pra fila do JIT. O resultado vira código nativo (assembly da sua CPU) cacheado no <strong>Code Cache</strong>.
        </p><h2>Tiered compilation</h2><p>
          A HotSpot tem <strong>dois</strong> compiladores, e usa os dois em camadas:
        </p><ul>
          <li>
            <strong>Tier 0 — Interpretado</strong>: começo de tudo.
          </li><li>
            <strong>C1 (client)</strong>: compila rápido, otimização leve. Ótimo pra warmup.
          </li><li>
            <strong>C2 (server)</strong>: compila lento, otimização agressiva (inlining, escape analysis, vectorização). Pra código quente que vai rodar muito.
          </li>
        </ul><p>O método sobe de tier conforme prova ser quente. Tudo automático.</p><CodeBlock title="Vendo o JIT trabalhar" code={`# Imprime cada compilação
java -XX:+PrintCompilation -jar app.jar

# Saída exemplo:
#   45   12       3       java.lang.String::hashCode (55 bytes)
#   ↑    ↑        ↑       ↑
#   ms   id       tier    método`} /><h2>Inlining: a otimização-mãe</h2><p>
          O JIT pega métodos pequenos chamados frequentemente e <strong>cola o corpo</strong> no chamador. Isso elimina o custo da chamada e desbloqueia <em>outras</em> otimizações (constant folding, dead code elimination). É a base de quase tudo.
        </p><CodeBlock title="O JIT enxerga isso..." code={`int dobro(int x) { return x * 2; }
int total = 0;
for (int i = 0; i < 1_000_000; i++) total += dobro(i);

// ...e gera algo equivalente a:
int total = 0;
for (int i = 0; i < 1_000_000; i++) total += i * 2;
// chamada de método: zero`} /><h2>Deoptimization</h2><p>
          O C2 faz <em>apostas</em>: “esse método sempre recebe <code>ArrayList</code>, então vou otimizar como se fosse só ele”. Se em algum momento aparece um <code>LinkedList</code>, o código nativo vira lixo e a JVM <strong>desotimiza</strong> — volta pra interpretação, coleta novas estatísticas, recompila depois.
        </p><AlertBox type="note" title="Por que isso importa">
          Mudar bruscamente o tipo concreto que um método recebe pode causar deopt em loop e derrubar performance. Em hot path, mantenha tipos estáveis.
        </AlertBox><h2>Warmup importa</h2><p>
          Suas primeiras requisições rodam interpretadas. Só depois de N invocações o JIT compila. Por isso, qualquer benchmark sério precisa <strong>descartar a fase de warmup</strong>— é o que o JMH (próxima página) faz por padrão.
        </p><CodeBlock title="Warmup explícito antes de medir" code={`// Aqueça antes de cronometrar
for (int i = 0; i < 50_000; i++) operacao();

long t0 = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) operacao();
long elapsed = System.nanoTime() - t0;
System.out.println("Tempo: " + elapsed + " ns");`} /><AlertBox type="warning" title="Mas não confie nesse benchmark">
          O snippet acima ainda sofre com dead-code elimination, escape analysis e ruído de OS. Use JMH pra valer.
        </AlertBox><h2>GraalVM Native Image: o caminho alternativo</h2><p>
          O <strong>Native Image</strong> da GraalVM compila tudo <em>antes</em> (AOT — Ahead Of Time). O resultado é um binário nativo que <strong>não tem JIT, não tem warmup</strong>, sobe em 50ms e usa pouca RAM.
        </p><p>Trade-off:</p><ul>
          <li>✅ Startup instantâneo — perfeito pra serverless e CLIs.</li><li>✅ Memória menor.</li><li>❌ Throughput de pico costuma ser menor que JIT C2 maduro.</li><li>
            ❌ Reflexão precisa ser declarada em <code>reachability-metadata.json</code>.
          </li>
        </ul><CodeBlock title="Compilando AOT (com Spring Boot 3+)" code={`mvn -Pnative native:compile

./target/minha-app
# Sobe em 0.05s, sem fase de warmup`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Rode um programa qualquer com <code>-XX:+PrintCompilation</code> e veja a torrente de métodos que viram nativos. Conte quantos chegam ao tier 4 (C2).
          </li><li>
            Compare o tempo do mesmo loop executado “frio” (primeira execução) e “quente” (após 50 mil iterações de aquecimento). A diferença é o JIT.
          </li><li>
            Compile uma app Spring Boot simples como Native Image (GraalVM). Compare startup, memória e throughput em carga sustentada com a versão JIT.
          </li>
        </ol>
      </PageContainer>
  );
}
