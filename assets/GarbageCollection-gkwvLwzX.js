import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Garbage Collection",subtitle:"Como a JVM libera memória sozinha — e por que isso afeta sua latência.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Em C, você chama ",e.jsx("code",{children:"malloc"})," e depois ",e.jsx("code",{children:"free"}),". Esquece o ",e.jsx("code",{children:"free"}),"e tem vazamento; libera duas vezes e o programa explode. Em Java, esse trabalho é da JVM. Mas isso não significa que dá pra ignorar memória: o coletor (GC) ",e.jsx("strong",{children:"pausa"})," a sua aplicação enquanto trabalha. Se você não entende como ele decide o que limpar, sua API de 10ms vai ter picos de 800ms sem explicação."]}),e.jsx("h2",{children:"A premissa: alcançabilidade"}),e.jsxs("p",{children:["O GC parte de uma ideia simples: um objeto está ",e.jsx("em",{children:"vivo"})," se alguma referência partindo das ",e.jsx("strong",{children:"GC roots"})," (variáveis locais em threads ativas, campos estáticos, JNI) consegue chegar nele. O resto é lixo. Isso é varrido periodicamente."]}),e.jsx(a,{title:"Alcançabilidade na prática",code:`void exemplo() {
    Cliente c = new Cliente("Ana"); // 'c' é GC root local
    salvar(c);
    c = null; // agora não há mais referência viva — vira lixo
}`}),e.jsx("h2",{children:"Hipótese geracional"}),e.jsxs("p",{children:["Empiricamente, ",e.jsx("strong",{children:"a maioria dos objetos morre cedo"})," (uma string montada num loop, um DTO de request HTTP). Por isso o heap é dividido em gerações:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Young Generation"}),": onde objetos novos nascem (Eden + 2 Survivors)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Old Generation"}),": para objetos que sobreviveram a vários ciclos."]})]}),e.jsx("h3",{children:"Minor GC vs Major/Full GC"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Minor GC"}),": limpa só a Young. Rápido (poucos ms), frequente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Major / Full GC"}),": mexe na Old (e às vezes em tudo). Lento, pode pausar centenas de ms."]})]}),e.jsx("h2",{children:"Algoritmos disponíveis no Java 21"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"G1 (Garbage First)"}),": padrão desde Java 11. Divide o heap em regiões e prioriza as mais cheias de lixo. Bom default geral."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Parallel GC"}),": foco em ",e.jsx("em",{children:"throughput"})," bruto. Pausas maiores, mas faz mais trabalho por minuto. Útil em batch."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ZGC"}),": pausas sub-milissegundo mesmo com heap de centenas de GB. Para baixa latência."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Shenandoah"}),": filosofia parecida com ZGC (concurrent compaction), mantida pela Red Hat."]})]}),e.jsx(a,{title:"Escolhendo o coletor por flag",code:`# G1 (default no 21, não precisa setar)
java -XX:+UseG1GC -jar app.jar

# Throughput máximo
java -XX:+UseParallelGC -jar app.jar

# Latência mínima
java -XX:+UseZGC -jar app.jar

# Generational ZGC (Java 21+)
java -XX:+UseZGC -XX:+ZGenerational -jar app.jar`}),e.jsx(o,{type:"tip",title:"Regra do dedão",children:"Web/API com SLA apertado → ZGC. Job batch noturno → Parallel. Microserviço genérico → G1 (não invente)."}),e.jsx("h2",{children:"System.gc() — não chame"}),e.jsxs("p",{children:["É só uma ",e.jsx("em",{children:"sugestão"})," pra JVM. Em produção, força um Full GC quando ela ia fazer algo mais inteligente. Praticamente todo guideline sério proíbe."]}),e.jsx(a,{title:"Anti-padrão clássico",code:`// Se você está tentado a fazer isso, o problema é outro
List<byte[]> cache = new ArrayList<>();
// ... enche o cache ...
cache.clear();
System.gc(); // não vai te salvar`}),e.jsx("h2",{children:"Finalize() está morto"}),e.jsxs("p",{children:["O método ",e.jsx("code",{children:"finalize()"})," está deprecado desde o Java 9 (e marcado pra remoção). Era imprevisível, lento e podia ressuscitar objetos. Use ",e.jsx("code",{children:"try-with-resources"}),"para fechar recursos, ou ",e.jsx("code",{children:"java.lang.ref.Cleaner"})," quando precisa de limpeza nativa fora do ",e.jsx("code",{children:"close()"}),"."]}),e.jsx(a,{title:"Cleaner em vez de finalize",code:`import java.lang.ref.Cleaner;

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
}`}),e.jsx("h2",{children:"Logs de GC"}),e.jsx("p",{children:"Sem logs, você está adivinhando. Ative o unified logging:"}),e.jsx(a,{title:"Logging de GC moderno",code:`# Resumo simples
java -Xlog:gc -jar app.jar

# Detalhado, com timestamps, em arquivo rotativo
java -Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=10M -jar app.jar`}),e.jsx("h2",{children:"Ferramentas para olhar"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"GCViewer"}),": abre o ",e.jsx("code",{children:"gc.log"})," e mostra gráficos de pausa, throughput, ocupação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"VisualVM"}),": ao vivo, monitora heap, threads, classes carregadas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JDK Mission Control"}),": análise profunda via JFR (próxima página)."]})]}),e.jsxs(o,{type:"warning",title:"Não tune sem medir",children:["99% dos problemas atribuídos ao GC são, na verdade, código alocando demais. Reduza",e.jsx("code",{children:"new"})," em hot path antes de mudar coletor."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um programinha que aloca 1 milhão de ",e.jsx("code",{children:"byte[]"})," de 1KB num loop. Rode com ",e.jsx("code",{children:"-Xlog:gc"})," e observe minor GCs acontecendo. Depois rode com",e.jsx("code",{children:"-XX:+UseParallelGC"})," e compare a frequência das pausas."]}),e.jsxs("li",{children:["Force um ",e.jsx("code",{children:"OutOfMemoryError"})," com ",e.jsx("code",{children:"-Xmx64m"})," e uma lista que cresce sem fim. Adicione ",e.jsx("code",{children:"-XX:+HeapDumpOnOutOfMemoryError"})," e abra o dump no VisualVM."]}),e.jsxs("li",{children:["Implemente uma classe com ",e.jsx("code",{children:"Cleaner"})," que apenas imprime ",e.jsx("em",{children:"“liberado”"}),"quando o objeto vira lixo. Crie 1000 instâncias num loop, descarte e force GC para ver a ordem (não garantida) das limpezas."]})]})]})}export{n as default};
