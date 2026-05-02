import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Jmh() {
  return (
    <PageContainer title="JMH: Java Microbenchmark Harness" subtitle="A única forma confiável de medir performance em Java — não use System.nanoTime()." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Você quer comparar duas implementações: <code>StringBuilder</code> vs concatenação, recursivo vs iterativo, <code>HashMap</code> vs <code>ConcurrentHashMap</code>. Cronometra com <code>System.nanoTime()</code>, vê resultado, posta no Slack — e está<strong> quase sempre errado</strong>.
        </p><h2>Por que benchmark ingênuo mente</h2><ul>
          <li>
            <strong>JIT warmup</strong>: as primeiras execuções rodam interpretadas, atrapalhando a média.
          </li><li>
            <strong>Dead-code elimination</strong>: se você não usa o resultado, o JIT remove o cálculo. Seu loop “de 1M iterações” vira 1 nanosegundo.
          </li><li>
            <strong>Escape analysis</strong>: objetos que “não escapam” do método são alocados na stack — seu benchmark de alocação some.
          </li><li>
            <strong>Loop unrolling</strong>, <strong>constant folding</strong>: o compilador é esperto demais pra ser enganado por loops óbvios.
          </li><li>
            <strong>Power management do CPU</strong>, GC, outros processos no mesmo host.
          </li>
        </ul><CodeBlock title="Benchmark furado clássico" code={`long t0 = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    Math.sqrt(i); // resultado descartado → JIT elimina tudo
}
long ns = System.nanoTime() - t0;
System.out.println(ns); // mede praticamente nada`} /><h2>JMH ao resgate</h2><p>
          O <strong>JMH</strong> (Java Microbenchmark Harness) é projeto oficial do OpenJDK, escrito pelos engenheiros que <em>fazem</em> a JVM. Ele cuida de warmup, isola fork, evita dead-code elimination via <code>Blackhole</code>, calcula erro estatístico e roda em JVM separada (sem interferência do classloader do build).
        </p><h2>Setup</h2><p>A forma oficial é via Maven archetype:</p><CodeBlock title="Criando projeto JMH" code={`mvn archetype:generate \\
   -DinteractiveMode=false \\
   -DarchetypeGroupId=org.openjdk.jmh \\
   -DarchetypeArtifactId=jmh-java-benchmark-archetype \\
   -DgroupId=com.exemplo \\
   -DartifactId=meu-bench \\
   -Dversion=1.0`} /><p>
          Isso gera um projeto que empacota um <code>benchmarks.jar</code> executável.
        </p><h2>Anotações principais</h2><ul>
          <li>
            <code>@Benchmark</code> — marca o método que será medido.
          </li><li>
            <code>@State(Scope.Benchmark|Thread)</code> — segura estado fora do método (não conta no tempo).
          </li><li>
            <code>@Setup</code> e <code>@TearDown</code> — preparação/limpeza por trial, iteration ou invocação.
          </li><li>
            <code>@Warmup(iterations=5)</code> — quantas rodadas de aquecimento.
          </li><li>
            <code>@Measurement(iterations=10)</code> — quantas rodadas valem.
          </li><li>
            <code>@Fork(2)</code> — quantas JVMs separadas (mais fork = mais robusto).
          </li><li>
            <code>@BenchmarkMode</code> — <code>Throughput</code>, <code>AverageTime</code>, <code>SampleTime</code>, etc.
          </li><li>
            <code>@OutputTimeUnit</code> — unidade do resultado (ns, us, ms).
          </li>
        </ul><h2>Exemplo completo</h2><CodeBlock title="MeuBenchmark.java" code={`package com.exemplo;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 10, time = 1)
@Fork(2)
@State(Scope.Benchmark)
public class MeuBenchmark {

    @Param({"10", "1000", "100000"})
    public int n;

    private int[] dados;

    @Setup
    public void setup() {
        dados = new int[n];
        for (int i = 0; i < n; i++) dados[i] = i;
    }

    @Benchmark
    public long somaForLoop() {
        long s = 0;
        for (int v : dados) s += v;
        return s; // retornar consome o resultado, evita DCE
    }

    @Benchmark
    public void somaComBlackhole(Blackhole bh) {
        long s = 0;
        for (int v : dados) s += v;
        bh.consume(s);
    }
}`} /><CodeBlock title="Rodando" code={`mvn clean package
java -jar target/benchmarks.jar MeuBenchmark`} /><h2>Lendo a saída</h2><CodeBlock title="Exemplo de resultado" code={`Benchmark               (n)   Mode  Cnt    Score    Error  Units
MeuBenchmark.somaForLoop  10   avgt   20    8.2 ±   0.3   ns/op
MeuBenchmark.somaForLoop 1000  avgt   20  790.1 ±  12.4   ns/op
MeuBenchmark.somaForLoop 100000 avgt  20  85211 ± 2104    ns/op`} /><ul>
          <li>
            <strong>Score</strong>: a média.
          </li><li>
            <strong>Error</strong>{": half-width de intervalo de confiança 99,9%. Se o erro for grande (> 5% do score), refaça com mais iterações ou forks."}
          </li><li>
            <strong>Cnt</strong>: número de samples (forks × iterations).
          </li>
        </ul><h2>Blackhole: o anti-DCE</h2><p>
          <code>Blackhole.consume(x)</code> garante que o JIT acredite que <code>x</code> é usado. Sempre consuma o que você produz, ou retorne do método (JMH consome retornos automaticamente).
        </p><CodeBlock title="Por que Blackhole" code={`@Benchmark
public void errado() {
    Math.sqrt(2.0); // resultado nunca usado → JIT remove
}

@Benchmark
public double certoComReturn() {
    return Math.sqrt(2.0); // JMH consome o retorno
}

@Benchmark
public void certoComBlackhole(Blackhole bh) {
    bh.consume(Math.sqrt(2.0));
}`} /><h2>Comparando duas variantes</h2><CodeBlock title="Recursivo vs iterativo (Fibonacci)" code={`@State(Scope.Benchmark)
public class FibBench {
    @Param({"10", "20", "30"}) public int n;

    @Benchmark public long recursivo() { return fibR(n); }
    @Benchmark public long iterativo() { return fibI(n); }

    static long fibR(int n) { return n < 2 ? n : fibR(n-1) + fibR(n-2); }
    static long fibI(int n) {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) { long t = a + b; a = b; b = t; }
        return a;
    }
}`} /><p>
          Você obtém uma tabela com os dois lado a lado, para cada <code>n</code>. Resultado típico: para <code>n=30</code>, recursivo é centenas de milhares de vezes mais lento.
        </p><h2>Boas práticas de bench</h2><ul>
          <li>
            Rode em máquina <strong>parada</strong> (sem build, sem Spotify, sem Docker em loop).
          </li><li>Desative turbo boost / scaling se quer números reproduzíveis.</li><li>
            Use <code>@Fork(value=2, jvmArgsAppend=-Xmx2g)</code> para fixar heap.
          </li><li>
            Sempre olhe o <strong>error</strong>. Score sem erro é mentira.
          </li><li>
            Não tente medir nanosegundos absolutos — meça <strong>diferenças</strong>.
          </li>
        </ul><AlertBox type="warning" title="Microbenchmark ≠ realidade">
          JMH te diz qual loop é mais rápido. Não te diz se sua API está lenta. Para isso, JFR e async-profiler em ambiente real continuam sendo as ferramentas certas.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um projeto JMH com o archetype e meça <code>StringBuilder.append</code> vs concatenação com <code>+</code> num loop de 1000. Compare scores e errors.
          </li><li>
            Implemente <code>HashMap</code> vs <code>ConcurrentHashMap</code> só para <em>get</em>em chave existente. Use <code>@Threads(8)</code> para ver o efeito de concorrência.
          </li><li>
            Rode o benchmark recursivo vs iterativo de Fibonacci com <code>n = 5, 15, 25, 35</code>. Plote a saída e descubra a partir de qual <code>n</code> o recursivo se torna inviável.
          </li>
        </ol>
      </PageContainer>
  );
}
