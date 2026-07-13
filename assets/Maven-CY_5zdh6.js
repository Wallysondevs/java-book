import{j as e}from"./index-BpXci30S.js";import{P as r,A as n}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(r,{title:"Maven",subtitle:"Build tool veterano — convenção sobre configuração, dominante no enterprise.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Compilar com ",e.jsx("code",{children:"javac"})," na mão funciona pra um arquivo. Aí você adiciona uma dependência (Jackson, JDBC driver, JUnit) e tem que baixar o JAR, pôr no classpath, lembrar das transitivas... vira pesadelo. Uma build tool resolve isso: declara dependências, ela baixa, compila, empacota, testa, publica. Maven é o veterano do ecossistema Java — vasta maioria dos projetos enterprise usa."]}),e.jsx("h2",{children:"Instalação"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Linux (Debian/Ubuntu):"})," ",e.jsx("code",{children:"sudo apt install maven"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"macOS:"})," ",e.jsx("code",{children:"brew install maven"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Windows:"})," baixe em ",e.jsx("code",{children:"maven.apache.org/download.cgi"})," e adicione ao PATH."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Melhor opção:"})," use o ",e.jsx("code",{children:"mvnw"})," (Maven Wrapper) dentro do projeto. Quem clonar não precisa instalar nada."]})]}),e.jsx("p",{children:"Confira:"}),e.jsx(o,{title:"Verificando versão",code:`mvn -v
# Apache Maven 3.9.x
# Java version: 21.x.x ...`}),e.jsx("h2",{children:"Estrutura padrão de projeto"}),e.jsx("p",{children:'Maven é "convention over configuration": se você seguir a estrutura padrão, quase nada precisa ser configurado.'}),e.jsx(o,{title:"Layout esperado",code:`meu-projeto/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/exemplo/App.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/
│       │   └── com/exemplo/AppTest.java
│       └── resources/
└── target/        (gerado pelo build)`}),e.jsx("h2",{children:"O pom.xml"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"pom.xml"})," (Project Object Model) é o coração. Define identidade do projeto, versão do Java, dependências e plugins."]}),e.jsx(o,{title:"pom.xml mínimo decente",code:`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.exemplo</groupId>
    <artifactId>meu-projeto</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.17.2</version>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.3</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"groupId:"}),' sua "organização" (geralmente domínio invertido, ex.: ',e.jsx("code",{children:"com.empresa"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"artifactId:"})," nome do projeto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"version:"})," versão. ",e.jsx("code",{children:"SNAPSHOT"})," = em desenvolvimento; sem isso = release imutável."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"packaging:"})," ",e.jsx("code",{children:"jar"})," (padrão), ",e.jsx("code",{children:"war"})," (web), ",e.jsx("code",{children:"pom"})," (agregador)."]})]}),e.jsx("h2",{children:"Ciclo de vida"}),e.jsx("p",{children:"Maven define fases ordenadas. Quando você roda uma fase, todas as anteriores rodam antes dela."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"validate"})," — checa o pom."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"compile"})," — compila ",e.jsx("code",{children:"src/main/java"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"test"})," — compila e roda testes em ",e.jsx("code",{children:"src/test/java"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"package"})," — empacota em JAR/WAR no ",e.jsx("code",{children:"target/"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"verify"})," — testes de integração."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"install"})," — copia o artefato pro repositório local (",e.jsx("code",{children:"~/.m2/repository"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"deploy"})," — sobe pra um repositório remoto."]})]}),e.jsx(o,{title:"Comandos do dia a dia",code:`mvn clean              # apaga target/
mvn compile            # compila código principal
mvn test               # compila + roda testes
mvn package            # gera o JAR em target/
mvn install            # publica localmente
mvn clean package      # combinação clássica
mvn dependency:tree    # mostra árvore de dependências`}),e.jsx("h2",{children:"Dependency scope"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"compile"})," (padrão) — disponível em compilação, teste e runtime."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"test"})," — só durante testes (JUnit, Mockito)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"provided"})," — disponível em compilação, mas o ambiente fornece em runtime (ex.: Servlet API num servidor Tomcat)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"runtime"})," — não precisa em compilação, mas precisa em execução (ex.: driver JDBC)."]})]}),e.jsx("h2",{children:"Plugins essenciais"}),e.jsx("p",{children:"Por padrão, Maven já vem com plugins comuns ligados ao ciclo de vida. Você só configura quando quer mudar o default."}),e.jsx(o,{title:"Definindo versão do Java explicitamente",code:`<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <release>21</release>
            </configuration>
        </plugin>

        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.2.5</version>
        </plugin>
    </plugins>
</build>`}),e.jsxs(n,{type:"tip",title:"release > source/target",children:["Use ",e.jsx("code",{children:"<release>21</release>"})," em vez do antigo par ",e.jsx("code",{children:"source"})," + ",e.jsx("code",{children:"target"}),". Mais simples e garante que você não usa APIs novas demais por engano."]}),e.jsx("h2",{children:"BOM: dominando versões"}),e.jsxs("p",{children:["Quando você usa um ecossistema (Spring, Jackson, AWS SDK), há vários artefatos que precisam estar na mesma versão. Um ",e.jsx("strong",{children:"BOM"})," (Bill of Materials) é um pom especial que importa as versões já compatíveis."]}),e.jsx(o,{title:"Importando o BOM do Jackson",code:`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.fasterxml.jackson</groupId>
            <artifactId>jackson-bom</artifactId>
            <version>2.17.2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- Agora suas dependencies não precisam de <version>: -->
<dependencies>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
</dependencies>`}),e.jsx("h2",{children:"Maven Wrapper (mvnw)"}),e.jsxs("p",{children:["Gera scripts ",e.jsx("code",{children:"mvnw"})," e ",e.jsx("code",{children:"mvnw.cmd"})," no projeto que baixam a versão exata do Maven em qualquer máquina. Quem clonar não precisa instalar nada — só rodar ",e.jsx("code",{children:"./mvnw"}),"."]}),e.jsx(o,{title:"Gerando o wrapper",code:`mvn wrapper:wrapper
# Cria mvnw, mvnw.cmd e .mvn/wrapper/

./mvnw clean package   # usa a versão fixada no projeto`}),e.jsxs(n,{type:"success",title:"Sempre comite o wrapper",children:[e.jsx("code",{children:"mvnw"}),", ",e.jsx("code",{children:"mvnw.cmd"})," e a pasta ",e.jsx("code",{children:".mvn/"})," entram no Git. ",e.jsx("code",{children:"target/"})," entra no ",e.jsx("code",{children:".gitignore"}),"."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um projeto novo manualmente: pasta com ",e.jsx("code",{children:"pom.xml"})," mínimo, ",e.jsx("code",{children:"src/main/java/exemplo/Hello.java"})," com um ",e.jsx("code",{children:"main"}),' imprimindo "Olá Maven". Rode ',e.jsx("code",{children:"mvn package"})," e execute o JAR gerado."]}),e.jsxs("li",{children:["Adicione Jackson como dependência, leia um JSON literal qualquer e imprima um campo. Veja com ",e.jsx("code",{children:"mvn dependency:tree"})," quais dependências transitivas vieram junto."]}),e.jsxs("li",{children:['Gere o Maven Wrapper no projeto e simule "outro dev": exclua sua instalação do Maven do PATH temporariamente e rode ',e.jsx("code",{children:"./mvnw clean package"})," — deve funcionar do mesmo jeito."]})]})]})}export{d as default};
