import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Historia() {
  return (
    <PageContainer
      title="História do Java"
      subtitle="Conheça a origem e a evolução de uma das linguagens mais populares e influentes do mundo."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <p>
        Java é uma linguagem de programação de propósito geral, orientada a objetos, robusta e portável.
        Foi criada em 1991 pela Sun Microsystems e se tornou uma das linguagens mais utilizadas no mundo,
        presente em bilhões de dispositivos — de cartões inteligentes a supercomputadores.
      </p>

      <h2>1. O Projeto Green (1991)</h2>
      <p>
        Java nasceu do <strong>Projeto Green</strong>, iniciado por James Gosling, Mike Sheridan e Patrick Naughton
        na Sun Microsystems. O objetivo original era criar uma linguagem para dispositivos eletrônicos de consumo
        como televisores interativos e controles remotos inteligentes. A linguagem foi inicialmente chamada de
        <strong>Oak</strong> (carvalho), em referência a uma árvore vista da janela de Gosling.
      </p>

      <h2>2. De Oak para Java (1995)</h2>
      <p>
        Com o crescimento da internet nos anos 90, a equipe percebeu que Oak era perfeito para a Web — portável,
        seguro e pequeno. Em 1995, a Sun lançou o Java ao público com o slogan histórico:
      </p>

      <AlertBox type="info" title='"Write Once, Run Anywhere" (WORA)'>
        O grande diferencial do Java: escreva o código uma vez e execute em qualquer plataforma que tenha
        a Java Virtual Machine (JVM). O compilador gera <strong>bytecode</strong> independente de sistema
        operacional, e a JVM o executa em qualquer lugar.
      </AlertBox>

      <h2>3. Linha do Tempo</h2>
      <CodeBlock
        language="text"
        title="Versões importantes do Java"
        code={`1995  — Java 1.0: lançamento público. Applets no Netscape Navigator
1998  — Java 1.2 ("Java 2"): Swing, Collections Framework, JIT compiler
2004  — Java 5 (Tiger): Generics, Enums, Autoboxing, for-each, varargs
2006  — Java 6: Scripting API, melhorias de desempenho
2011  — Java 7: try-with-resources, diamond operator, NIO.2
2014  — Java 8 (LTS): Lambda, Streams API, Optional, nova API de datas
2017  — Java 9: módulos (Jigsaw), JShell (REPL)
2018  — Java 10: var (inferência de tipos locais)
2018  — Java 11 (LTS): HTTP Client, novos métodos de String
2021  — Java 17 (LTS): sealed classes, pattern matching (if instanceof)
2023  — Java 21 (LTS): virtual threads, sequenced collections, record patterns`}
      />

      <h2>4. Aquisição pela Oracle</h2>
      <p>
        Em 2010, a Oracle Corporation adquiriu a Sun Microsystems por US$ 7,4 bilhões e, com isso,
        passou a ser a responsável pelo desenvolvimento do Java. A Oracle mantém o Java como open source
        via OpenJDK, mas também oferece o Oracle JDK com suporte comercial.
      </p>

      <h2>5. Onde o Java é Usado Hoje</h2>
      <ul>
        <li><strong>Android:</strong> A plataforma Android usou Java como linguagem principal por muitos anos (hoje Kotlin é preferido, mas ambos rodam na JVM/ART).</li>
        <li><strong>Backend Corporativo:</strong> Bancos, governos e grandes empresas rodam sistemas críticos em Java com frameworks como Spring e Jakarta EE.</li>
        <li><strong>Big Data:</strong> Hadoop, Spark e Kafka são escritos em Java/Scala.</li>
        <li><strong>Microserviços:</strong> Spring Boot, Quarkus e Micronaut são amplamente usados.</li>
        <li><strong>Desktop:</strong> IDEs como IntelliJ IDEA, Eclipse e NetBeans são escritas em Java.</li>
      </ul>

      <h2>6. O Ecossistema JVM</h2>
      <p>
        A JVM criou um ecossistema rico de linguagens que compilam para bytecode Java e rodam na mesma máquina virtual:
      </p>
      <ul>
        <li><strong>Kotlin</strong> — Linguagem moderna, concisa, 100% interoperável com Java. Preferida para Android.</li>
        <li><strong>Scala</strong> — Combina OOP e programação funcional. Usado em Big Data.</li>
        <li><strong>Groovy</strong> — Linguagem dinâmica da JVM. Usada no Gradle.</li>
        <li><strong>Clojure</strong> — Dialeto de Lisp funcional para a JVM.</li>
      </ul>

      <AlertBox type="success" title="Por que aprender Java em 2025?">
        Java continua sendo uma das 3 linguagens mais demandadas no mercado de trabalho.
        Seu mercado inclui backend corporativo, serviços financeiros, Android, cloud (AWS Lambda suporta Java),
        e sistemas de missão crítica. Dominar Java abre muitas portas.
      </AlertBox>
    </PageContainer>
  );
}
