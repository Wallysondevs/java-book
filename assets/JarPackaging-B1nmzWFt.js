import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(s,{title:"Empacotar Java: JAR, fat-JAR e nativo",subtitle:"Do simples manifest ao executável standalone com GraalVM.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Você compilou: tem uma pasta ",e.jsx("code",{children:"target/classes"})," cheia de arquivos",e.jsx("code",{children:" .class"}),". Isso é ótimo no seu IDE — péssimo pra mandar pro servidor ou pro cliente. Empacotar é transformar dezenas (ou milhares) de arquivos soltos em ",e.jsx("strong",{children:"uma unidade"})," que possa ser distribuída, executada e versionada."]}),e.jsxs("p",{children:["Java tem várias formas: o JAR clássico, o fat-JAR auto-suficiente, o WAR pra servidores antigos, runtimes customizados com ",e.jsx("em",{children:"jlink"})," e até binário nativo via GraalVM. Cada um resolve um problema. Você vai entender quando usar cada coisa."]}),e.jsx("h2",{children:"1. JAR comum (Java Archive)"}),e.jsxs("p",{children:["JAR é um ZIP com cara de Java. Junta as classes compiladas, recursos (",e.jsx("em",{children:"resources"}),"), e um arquivo especial ",e.jsx("code",{children:"META-INF/MANIFEST.MF"}),"que descreve o pacote."]}),e.jsx(a,{title:"Criando JAR manualmente",code:`# compila pra target/classes
javac -d target/classes src/main/java/com/exemplo/*.java

# empacota tudo dentro
jar cf app.jar -C target/classes .

# vê o conteúdo
jar tf app.jar`}),e.jsx("p",{children:"Esse JAR é uma biblioteca: dá pra adicionar no classpath de outro projeto. Mas ainda não é executável."}),e.jsx("h2",{children:"2. JAR executável: o MANIFEST faz a mágica"}),e.jsxs("p",{children:["Pra rodar com ",e.jsx("code",{children:"java -jar app.jar"}),", o manifest precisa apontar a classe principal:"]}),e.jsx(a,{title:"META-INF/MANIFEST.MF",code:`Manifest-Version: 1.0
Main-Class: com.exemplo.App
Class-Path: lib/gson.jar lib/slf4j.jar`}),e.jsx(a,{title:"Empacotando com manifest customizado",code:`jar cfm app.jar MANIFEST.MF -C target/classes .

java -jar app.jar`}),e.jsxs("p",{children:["Note ",e.jsx("code",{children:"Class-Path"}),": ele lista ",e.jsx("em",{children:"outros"})," JARs que precisam estar ao lado. Se faltar um, dá ",e.jsx("code",{children:"NoClassDefFoundError"}),". É exatamente o problema que o fat-JAR resolve."]}),e.jsx(o,{type:"warning",title:"O manifest tem regras chatas",children:'Cada linha precisa terminar com quebra de linha. A última linha também. E o arquivo precisa terminar com linha em branco. Se algo não funciona "sem motivo", confira isso primeiro.'}),e.jsx("h2",{children:"3. Fat-JAR (uber JAR): tudo em um só arquivo"}),e.jsxs("p",{children:["Fat-JAR descompacta as dependências e funde tudo num único JAR. Você manda",e.jsx("strong",{children:"um arquivo"})," e basta ",e.jsx("code",{children:"java -jar"}),". Em Maven, o plugin mais comum é o ",e.jsx("em",{children:"Shade"}),":"]}),e.jsx(a,{title:"pom.xml — Maven Shade Plugin",code:`<plugin>
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
</plugin>`}),e.jsxs("p",{children:["Roda ",e.jsx("code",{children:"mvn package"})," e aparece ",e.jsx("code",{children:"app-1.0-SNAPSHOT.jar"}),"com tudo dentro. Em Gradle, o equivalente é o ",e.jsx("em",{children:"Shadow plugin"}),":"]}),e.jsx(a,{title:"build.gradle.kts — Shadow",code:`plugins {
    java
    id("com.gradleup.shadow") version "8.3.5"
}

tasks.named<Jar>("jar") {
    manifest { attributes["Main-Class"] = "com.exemplo.App" }
}

// gera build/libs/app-all.jar
// rodar: ./gradlew shadowJar`}),e.jsxs(o,{type:"tip",title:"Conflitos de recursos",children:["Quando duas dependências têm um arquivo com o mesmo caminho (clássico:",e.jsx("code",{children:" META-INF/services/..."}),"), o Shade precisa ser configurado pra",e.jsx("em",{children:"concatenar"})," em vez de sobrescrever. Use",e.jsx("code",{children:" ServicesResourceTransformer"}),". Sem isso, frameworks como SLF4J e JDBC param de funcionar."]}),e.jsx("h2",{children:"4. Spring Boot fat-JAR: estrutura especial"}),e.jsxs("p",{children:["Spring Boot não usa Shade. Ele cria um JAR com layout próprio onde as dependências ficam em ",e.jsx("code",{children:"BOOT-INF/lib/"})," e suas classes em",e.jsx("code",{children:" BOOT-INF/classes/"}),". Existe um classloader customizado (",e.jsx("code",{children:"JarLauncher"}),") que sabe ler isso."]}),e.jsx(a,{title:"Estrutura interna de app.jar do Spring Boot",code:`app.jar
├── META-INF/MANIFEST.MF       (Main-Class: org.springframework.boot.loader.launch.JarLauncher)
├── org/springframework/boot/loader/...   (loader)
└── BOOT-INF/
    ├── classes/com/exemplo/App.class
    ├── lib/spring-core-6.x.jar
    └── lib/...`}),e.jsxs("p",{children:["Por que essa complicação? Porque ",e.jsx("strong",{children:"JAR dentro de JAR"})," não é nativo da JVM. O loader do Spring Boot resolve sem precisar descompactar as libs em disco. Você não precisa configurar nada — o",e.jsx("code",{children:" spring-boot-maven-plugin"})," faz tudo."]}),e.jsx("h2",{children:"5. jlink: runtime customizado e enxuto"}),e.jsxs("p",{children:["A JDK inteira tem uns 300 MB. Mas seu app talvez use só meia dúzia de módulos.",e.jsx("code",{children:" jlink"})," (Java 9+) gera um runtime contendo ",e.jsx("strong",{children:"só os módulos que você importou"}),". Resultado: imagens de 30-50 MB."]}),e.jsx(a,{title:"Gerando runtime customizado",code:`# descobre os módulos que sua app usa
jdeps --print-module-deps --ignore-missing-deps app.jar
# saída exemplo: java.base,java.logging,java.net.http

jlink \\
  --add-modules java.base,java.logging,java.net.http \\
  --strip-debug --no-header-files --no-man-pages \\
  --compress=2 \\
  --output runtime-pequeno

# usa o java desse runtime
./runtime-pequeno/bin/java -jar app.jar`}),e.jsxs("p",{children:["Excelente pra container Docker: o ",e.jsx("em",{children:"image layer"})," com runtime fica pequeno e o ",e.jsx("em",{children:"cold start"})," melhora. Pré-requisito: seu app (ou pelo menos as deps mais pesadas) ser modular ou usar só módulos automáticos identificáveis."]}),e.jsx("h2",{children:"6. GraalVM Native Image: binário standalone"}),e.jsxs("p",{children:["GraalVM compila ",e.jsx("em",{children:"ahead-of-time"}),": gera um executável nativo do sistema operacional, sem JVM por baixo. Características:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Startup em ",e.jsx("strong",{children:"milissegundos"})," (vs. segundos de JVM normal)."]}),e.jsx("li",{children:"Consumo de memória bem menor."}),e.jsx("li",{children:"Binário único, sem precisar de Java instalado no destino."}),e.jsx("li",{children:"Ideal pra serverless, CLI tools, microsserviços com auto-scaling agressivo."})]}),e.jsx(a,{title:"Spring Boot 3 + GraalVM",code:`# pré-requisito: GraalVM JDK instalado, comando 'native-image' no PATH

# build do binário nativo
./mvnw -Pnative native:compile

# resultado:
ls target/
# → app  (executável Linux/macOS)

./target/app    # roda direto, sem JVM`}),e.jsx("p",{children:"O preço a pagar:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Compilação ",e.jsx("strong",{children:"lenta"})," (5-15 minutos numa app média)."]}),e.jsx("li",{children:"Reflection, proxies dinâmicos e carregamento dinâmico de classes precisam ser declarados em hints. Frameworks modernos (Spring Boot 3+, Quarkus, Micronaut) já cuidam disso — código antigo pode dar trabalho."}),e.jsxs("li",{children:["Sem JIT: não há otimização ",e.jsx("em",{children:"warm-up"})," em runtime."]})]}),e.jsx("h2",{children:"7. WAR: o passado que ainda paga conta"}),e.jsxs("p",{children:["WAR (Web Application Archive) era o formato pra subir num servidor de aplicação externo: Tomcat, JBoss, WebLogic. Você fazia ",e.jsx("em",{children:"deploy"})," do",e.jsx("code",{children:" meuapp.war"})," e o servidor reaproveitava a JVM já em pé."]}),e.jsx("p",{children:"Hoje, com Spring Boot embarcando o próprio Tomcat e a era dos containers, WAR está em retirada. Ainda existe em ambientes corporativos legados — saiba reconhecer:"}),e.jsx(a,{title:"pom.xml gerando WAR",code:`<packaging>war</packaging>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>  <!-- container já tem -->
  </dependency>
</dependencies>`}),e.jsxs("p",{children:["Se está começando projeto novo em 2025, prefira ",e.jsx("strong",{children:"fat-JAR"}),". Mais simples de containerizar, versionar, observar e escalar."]}),e.jsx("h2",{children:"Resumo: qual escolher?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Biblioteca"})," pra outro projeto Java? JAR comum."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"App standalone"})," ou microsserviço? Fat-JAR (Shade ou Spring Boot)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Container minimalista"}),"? jlink + JAR."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Serverless / CLI / cold start crítico"}),"? GraalVM Native Image."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Servidor de aplicação corporativo legado"}),"? WAR."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um Hello World em Java puro, compile e empacote como JAR executável manualmente (com ",e.jsx("code",{children:"jar cfm"})," e MANIFEST.MF). Rode com",e.jsx("code",{children:" java -jar"}),"."]}),e.jsxs("li",{children:["Pegue um projeto Maven que tenha pelo menos uma dependência externa. Adicione o ",e.jsx("em",{children:"maven-shade-plugin"})," e gere um fat-JAR. Confirme que ele roda em outra máquina sem precisar das dependências."]}),e.jsxs("li",{children:["Em uma app Spring Boot 3 simples, instale GraalVM, rode",e.jsx("code",{children:" ./mvnw -Pnative native:compile"})," e meça o startup do binário versus o startup da versão JAR. A diferença vai te impressionar."]})]})]})}export{c as default};
