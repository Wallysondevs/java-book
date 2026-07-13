import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(r,{title:"JMH: Java Microbenchmark Harness",subtitle:"A única forma confiável de medir performance em Java — não use System.nanoTime().",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Você quer comparar duas implementações: ",e.jsx("code",{children:"StringBuilder"})," vs concatenação, recursivo vs iterativo, ",e.jsx("code",{children:"HashMap"})," vs ",e.jsx("code",{children:"ConcurrentHashMap"}),". Cronometra com ",e.jsx("code",{children:"System.nanoTime()"}),", vê resultado, posta no Slack — e está",e.jsx("strong",{children:" quase sempre errado"}),"."]}),e.jsx("h2",{children:"Por que benchmark ingênuo mente"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"JIT warmup"}),": as primeiras execuções rodam interpretadas, atrapalhando a média."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dead-code elimination"}),": se você não usa o resultado, o JIT remove o cálculo. Seu loop “de 1M iterações” vira 1 nanosegundo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Escape analysis"}),": objetos que “não escapam” do método são alocados na stack — seu benchmark de alocação some."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Loop unrolling"}),", ",e.jsx("strong",{children:"constant folding"}),": o compilador é esperto demais pra ser enganado por loops óbvios."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Power management do CPU"}),", GC, outros processos no mesmo host."]})]}),e.jsx(o,{title:"Benchmark furado clássico",code:`long t0 = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    Math.sqrt(i); // resultado descartado → JIT elimina tudo
}
long ns = System.nanoTime() - t0;
System.out.println(ns); // mede praticamente nada`}),e.jsx("h2",{children:"JMH ao resgate"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"JMH"})," (Java Microbenchmark Harness) é projeto oficial do OpenJDK, escrito pelos engenheiros que ",e.jsx("em",{children:"fazem"})," a JVM. Ele cuida de warmup, isola fork, evita dead-code elimination via ",e.jsx("code",{children:"Blackhole"}),", calcula erro estatístico e roda em JVM separada (sem interferência do classloader do build)."]}),e.jsx("h2",{children:"Setup"}),e.jsx("p",{children:"A forma oficial é via Maven archetype:"}),e.jsx(o,{title:"Criando projeto JMH",code:`mvn archetype:generate \\
   -DinteractiveMode=false \\
   -DarchetypeGroupId=org.openjdk.jmh \\
   -DarchetypeArtifactId=jmh-java-benchmark-archetype \\
   -DgroupId=com.exemplo \\
   -DartifactId=meu-bench \\
   -Dversion=1.0`}),e.jsxs("p",{children:["Isso gera um projeto que empacota um ",e.jsx("code",{children:"benchmarks.jar"})," executável."]}),e.jsx("h2",{children:"Anotações principais"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"@Benchmark"})," — marca o método que será medido."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@State(Scope.Benchmark|Thread)"})," — segura estado fora do método (não conta no tempo)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@Setup"})," e ",e.jsx("code",{children:"@TearDown"})," — preparação/limpeza por trial, iteration ou invocação."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@Warmup(iterations=5)"})," — quantas rodadas de aquecimento."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@Measurement(iterations=10)"})," — quantas rodadas valem."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@Fork(2)"})," — quantas JVMs separadas (mais fork = mais robusto)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@BenchmarkMode"})," — ",e.jsx("code",{children:"Throughput"}),", ",e.jsx("code",{children:"AverageTime"}),", ",e.jsx("code",{children:"SampleTime"}),", etc."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@OutputTimeUnit"})," — unidade do resultado (ns, us, ms)."]})]}),e.jsx("h2",{children:"Exemplo completo"}),e.jsx(o,{title:"MeuBenchmark.java",code:`package com.exemplo;

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
}`}),e.jsx(o,{title:"Rodando",code:`mvn clean package
java -jar target/benchmarks.jar MeuBenchmark`}),e.jsx("h2",{children:"Lendo a saída"}),e.jsx(o,{title:"Exemplo de resultado",code:`Benchmark               (n)   Mode  Cnt    Score    Error  Units
MeuBenchmark.somaForLoop  10   avgt   20    8.2 ±   0.3   ns/op
MeuBenchmark.somaForLoop 1000  avgt   20  790.1 ±  12.4   ns/op
MeuBenchmark.somaForLoop 100000 avgt  20  85211 ± 2104    ns/op`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Score"}),": a média."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Error"}),": half-width de intervalo de confiança 99,9%. Se o erro for grande (> 5% do score), refaça com mais iterações ou forks."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cnt"}),": número de samples (forks × iterations)."]})]}),e.jsx("h2",{children:"Blackhole: o anti-DCE"}),e.jsxs("p",{children:[e.jsx("code",{children:"Blackhole.consume(x)"})," garante que o JIT acredite que ",e.jsx("code",{children:"x"})," é usado. Sempre consuma o que você produz, ou retorne do método (JMH consome retornos automaticamente)."]}),e.jsx(o,{title:"Por que Blackhole",code:`@Benchmark
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
}`}),e.jsx("h2",{children:"Comparando duas variantes"}),e.jsx(o,{title:"Recursivo vs iterativo (Fibonacci)",code:`@State(Scope.Benchmark)
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
}`}),e.jsxs("p",{children:["Você obtém uma tabela com os dois lado a lado, para cada ",e.jsx("code",{children:"n"}),". Resultado típico: para ",e.jsx("code",{children:"n=30"}),", recursivo é centenas de milhares de vezes mais lento."]}),e.jsx("h2",{children:"Boas práticas de bench"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Rode em máquina ",e.jsx("strong",{children:"parada"})," (sem build, sem Spotify, sem Docker em loop)."]}),e.jsx("li",{children:"Desative turbo boost / scaling se quer números reproduzíveis."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"@Fork(value=2, jvmArgsAppend=-Xmx2g)"})," para fixar heap."]}),e.jsxs("li",{children:["Sempre olhe o ",e.jsx("strong",{children:"error"}),". Score sem erro é mentira."]}),e.jsxs("li",{children:["Não tente medir nanosegundos absolutos — meça ",e.jsx("strong",{children:"diferenças"}),"."]})]}),e.jsx(a,{type:"warning",title:"Microbenchmark ≠ realidade",children:"JMH te diz qual loop é mais rápido. Não te diz se sua API está lenta. Para isso, JFR e async-profiler em ambiente real continuam sendo as ferramentas certas."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um projeto JMH com o archetype e meça ",e.jsx("code",{children:"StringBuilder.append"})," vs concatenação com ",e.jsx("code",{children:"+"})," num loop de 1000. Compare scores e errors."]}),e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"HashMap"})," vs ",e.jsx("code",{children:"ConcurrentHashMap"})," só para ",e.jsx("em",{children:"get"}),"em chave existente. Use ",e.jsx("code",{children:"@Threads(8)"})," para ver o efeito de concorrência."]}),e.jsxs("li",{children:["Rode o benchmark recursivo vs iterativo de Fibonacci com ",e.jsx("code",{children:"n = 5, 15, 25, 35"}),". Plote a saída e descubra a partir de qual ",e.jsx("code",{children:"n"})," o recursivo se torna inviável."]})]})]})}export{c as default};
