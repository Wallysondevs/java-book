import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JarPackaging() {
  return (
    <PageContainer title="Empacotar Java: JAR, fat-JAR e nativo" subtitle="Do simples manifest ao executável standalone com GraalVM." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você compilou: tem uma pasta <code>target/classes</code> cheia de arquivos<code> .class</code>. Isso é ótimo no seu IDE — péssimo pra mandar pro servidor ou pro cliente. Empacotar é transformar dezenas (ou milhares) de arquivos soltos em <strong>uma unidade</strong> que possa ser distribuída, executada e versionada.
        </p><p>
          Java tem várias formas: o JAR clássico, o fat-JAR auto-suficiente, o WAR pra servidores antigos, runtimes customizados com <em>jlink</em> e até binário nativo via GraalVM. Cada um resolve um problema. Você vai entender quando usar cada coisa.
        </p><h2>1. JAR comum (Java Archive)</h2><p>
          JAR é um ZIP com cara de Java. Junta as classes compiladas, recursos (<em>resources</em>), e um arquivo especial <code>META-INF/MANIFEST.MF</code>que descreve o pacote.
        </p><CodeBlock title="Criando JAR manualmente" code={`# compila pra target/classes
javac -d target/classes src/main/java/com/exemplo/*.java

# empacota tudo dentro
jar cf app.jar -C target/classes .

# vê o conteúdo
jar tf app.jar`} /><p>
          Esse JAR é uma biblioteca: dá pra adicionar no classpath de outro projeto. Mas ainda não é executável.
        </p><h2>2. JAR executável: o MANIFEST faz a mágica</h2><p>
          Pra rodar com <code>java -jar app.jar</code>, o manifest precisa apontar a classe principal:
        </p><CodeBlock title="META-INF/MANIFEST.MF" code={`Manifest-Version: 1.0
Main-Class: com.exemplo.App
Class-Path: lib/gson.jar lib/slf4j.jar`} /><CodeBlock title="Empacotando com manifest customizado" code={`jar cfm app.jar MANIFEST.MF -C target/classes .

java -jar app.jar`} /><p>
          Note <code>Class-Path</code>: ele lista <em>outros</em> JARs que precisam estar ao lado. Se faltar um, dá <code>NoClassDefFoundError</code>. É exatamente o problema que o fat-JAR resolve.
        </p><AlertBox type="warning" title="O manifest tem regras chatas">
          Cada linha precisa terminar com quebra de linha. A última linha também. E o arquivo precisa terminar com linha em branco. Se algo não funciona "sem motivo", confira isso primeiro.
        </AlertBox><h2>3. Fat-JAR (uber JAR): tudo em um só arquivo</h2><p>
          Fat-JAR descompacta as dependências e funde tudo num único JAR. Você manda<strong>um arquivo</strong> e basta <code>java -jar</code>. Em Maven, o plugin mais comum é o <em>Shade</em>:
        </p><CodeBlock title="pom.xml — Maven Shade Plugin" code={`<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>3.5.3</version>
  <executions>
    <execution>
      <phase>package</phase>
      <goals><goal>shade</goal></goals>
      <configuration>
        <transformers>
          <transformer
            implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.exemplo.App</mainClass>
          </transformer>
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>`} /><p>
          Roda <code>mvn package</code> e aparece <code>app-1.0-SNAPSHOT.jar</code>com tudo dentro. Em Gradle, o equivalente é o <em>Shadow plugin</em>:
        </p><CodeBlock title="build.gradle.kts — Shadow" code={`plugins {
    java
    id("com.gradleup.shadow") version "8.3.5"
}

tasks.named<Jar>("jar") {
    manifest { attributes["Main-Class"] = "com.exemplo.App" }
}

// gera build/libs/app-all.jar
// rodar: ./gradlew shadowJar`} /><AlertBox type="tip" title="Conflitos de recursos">
          Quando duas dependências têm um arquivo com o mesmo caminho (clássico:<code> META-INF/services/...</code>), o Shade precisa ser configurado pra<em>concatenar</em> em vez de sobrescrever. Use<code> ServicesResourceTransformer</code>. Sem isso, frameworks como SLF4J e JDBC param de funcionar.
        </AlertBox><h2>4. Spring Boot fat-JAR: estrutura especial</h2><p>
          Spring Boot não usa Shade. Ele cria um JAR com layout próprio onde as dependências ficam em <code>BOOT-INF/lib/</code> e suas classes em<code> BOOT-INF/classes/</code>. Existe um classloader customizado (<code>JarLauncher</code>) que sabe ler isso.
        </p><CodeBlock title="Estrutura interna de app.jar do Spring Boot" code={`app.jar
├── META-INF/MANIFEST.MF       (Main-Class: org.springframework.boot.loader.launch.JarLauncher)
├── org/springframework/boot/loader/...   (loader)
└── BOOT-INF/
    ├── classes/com/exemplo/App.class
    ├── lib/spring-core-6.x.jar
    └── lib/...`} /><p>
          Por que essa complicação? Porque <strong>JAR dentro de JAR</strong> não é nativo da JVM. O loader do Spring Boot resolve sem precisar descompactar as libs em disco. Você não precisa configurar nada — o<code> spring-boot-maven-plugin</code> faz tudo.
        </p><h2>5. jlink: runtime customizado e enxuto</h2><p>
          A JDK inteira tem uns 300 MB. Mas seu app talvez use só meia dúzia de módulos.<code> jlink</code> (Java 9+) gera um runtime contendo <strong>só os módulos que você importou</strong>. Resultado: imagens de 30-50 MB.
        </p><CodeBlock title="Gerando runtime customizado" code={`# descobre os módulos que sua app usa
jdeps --print-module-deps --ignore-missing-deps app.jar
# saída exemplo: java.base,java.logging,java.net.http

jlink \\
  --add-modules java.base,java.logging,java.net.http \\
  --strip-debug --no-header-files --no-man-pages \\
  --compress=2 \\
  --output runtime-pequeno

# usa o java desse runtime
./runtime-pequeno/bin/java -jar app.jar`} /><p>
          Excelente pra container Docker: o <em>image layer</em> com runtime fica pequeno e o <em>cold start</em> melhora. Pré-requisito: seu app (ou pelo menos as deps mais pesadas) ser modular ou usar só módulos automáticos identificáveis.
        </p><h2>6. GraalVM Native Image: binário standalone</h2><p>
          GraalVM compila <em>ahead-of-time</em>: gera um executável nativo do sistema operacional, sem JVM por baixo. Características:
        </p><ul>
          <li>
            Startup em <strong>milissegundos</strong> (vs. segundos de JVM normal).
          </li><li>Consumo de memória bem menor.</li><li>Binário único, sem precisar de Java instalado no destino.</li><li>Ideal pra serverless, CLI tools, microsserviços com auto-scaling agressivo.</li>
        </ul><CodeBlock title="Spring Boot 3 + GraalVM" code={`# pré-requisito: GraalVM JDK instalado, comando 'native-image' no PATH

# build do binário nativo
./mvnw -Pnative native:compile

# resultado:
ls target/
# → app  (executável Linux/macOS)

./target/app    # roda direto, sem JVM`} /><p>O preço a pagar:</p><ul>
          <li>
            Compilação <strong>lenta</strong> (5-15 minutos numa app média).
          </li><li>
            Reflection, proxies dinâmicos e carregamento dinâmico de classes precisam ser declarados em hints. Frameworks modernos (Spring Boot 3+, Quarkus, Micronaut) já cuidam disso — código antigo pode dar trabalho.
          </li><li>
            Sem JIT: não há otimização <em>warm-up</em> em runtime.
          </li>
        </ul><h2>7. WAR: o passado que ainda paga conta</h2><p>
          WAR (Web Application Archive) era o formato pra subir num servidor de aplicação externo: Tomcat, JBoss, WebLogic. Você fazia <em>deploy</em> do<code> meuapp.war</code> e o servidor reaproveitava a JVM já em pé.
        </p><p>
          Hoje, com Spring Boot embarcando o próprio Tomcat e a era dos containers, WAR está em retirada. Ainda existe em ambientes corporativos legados — saiba reconhecer:
        </p><CodeBlock title="pom.xml gerando WAR" code={`<packaging>war</packaging>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>  <!-- container já tem -->
  </dependency>
</dependencies>`} /><p>
          Se está começando projeto novo em 2025, prefira <strong>fat-JAR</strong>. Mais simples de containerizar, versionar, observar e escalar.
        </p><h2>Resumo: qual escolher?</h2><ul>
          <li>
            <strong>Biblioteca</strong> pra outro projeto Java? JAR comum.
          </li><li>
            <strong>App standalone</strong> ou microsserviço? Fat-JAR (Shade ou Spring Boot).
          </li><li>
            <strong>Container minimalista</strong>? jlink + JAR.
          </li><li>
            <strong>Serverless / CLI / cold start crítico</strong>? GraalVM Native Image.
          </li><li>
            <strong>Servidor de aplicação corporativo legado</strong>? WAR.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um Hello World em Java puro, compile e empacote como JAR executável manualmente (com <code>jar cfm</code> e MANIFEST.MF). Rode com<code> java -jar</code>.
          </li><li>
            Pegue um projeto Maven que tenha pelo menos uma dependência externa. Adicione o <em>maven-shade-plugin</em> e gere um fat-JAR. Confirme que ele roda em outra máquina sem precisar das dependências.
          </li><li>
            Em uma app Spring Boot 3 simples, instale GraalVM, rode<code> ./mvnw -Pnative native:compile</code> e meça o startup do binário versus o startup da versão JAR. A diferença vai te impressionar.
          </li>
        </ol>
      </PageContainer>
  );
}
