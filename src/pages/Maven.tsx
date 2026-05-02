import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Maven() {
  return (
    <PageContainer title="Maven" subtitle="Build tool veterano — convenção sobre configuração, dominante no enterprise." difficulty="intermediario" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Compilar com <code>javac</code> na mão funciona pra um arquivo. Aí você adiciona uma dependência (Jackson, JDBC driver, JUnit) e tem que baixar o JAR, pôr no classpath, lembrar das transitivas... vira pesadelo. Uma build tool resolve isso: declara dependências, ela baixa, compila, empacota, testa, publica. Maven é o veterano do ecossistema Java — vasta maioria dos projetos enterprise usa.
        </p><h2>Instalação</h2><ul>
          <li>
            <strong>Linux (Debian/Ubuntu):</strong> <code>sudo apt install maven</code>
          </li><li>
            <strong>macOS:</strong> <code>brew install maven</code>
          </li><li>
            <strong>Windows:</strong> baixe em <code>maven.apache.org/download.cgi</code> e adicione ao PATH.
          </li><li>
            <strong>Melhor opção:</strong> use o <code>mvnw</code> (Maven Wrapper) dentro do projeto. Quem clonar não precisa instalar nada.
          </li>
        </ul><p>Confira:</p><CodeBlock title="Verificando versão" code={`mvn -v
# Apache Maven 3.9.x
# Java version: 21.x.x ...`} /><h2>Estrutura padrão de projeto</h2><p>
          Maven é "convention over configuration": se você seguir a estrutura padrão, quase nada precisa ser configurado.
        </p><CodeBlock title="Layout esperado" code={`meu-projeto/
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
└── target/        (gerado pelo build)`} /><h2>O pom.xml</h2><p>
          O <code>pom.xml</code> (Project Object Model) é o coração. Define identidade do projeto, versão do Java, dependências e plugins.
        </p><CodeBlock title="pom.xml mínimo decente" code={`<?xml version="1.0" encoding="UTF-8"?>
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
</project>`} /><ul>
          <li>
            <strong>groupId:</strong> sua "organização" (geralmente domínio invertido, ex.: <code>com.empresa</code>).
          </li><li>
            <strong>artifactId:</strong> nome do projeto.
          </li><li>
            <strong>version:</strong> versão. <code>SNAPSHOT</code> = em desenvolvimento; sem isso = release imutável.
          </li><li>
            <strong>packaging:</strong> <code>jar</code> (padrão), <code>war</code> (web), <code>pom</code> (agregador).
          </li>
        </ul><h2>Ciclo de vida</h2><p>
          Maven define fases ordenadas. Quando você roda uma fase, todas as anteriores rodam antes dela.
        </p><ul>
          <li>
            <strong>validate</strong> — checa o pom.
          </li><li>
            <strong>compile</strong> — compila <code>src/main/java</code>.
          </li><li>
            <strong>test</strong> — compila e roda testes em <code>src/test/java</code>.
          </li><li>
            <strong>package</strong> — empacota em JAR/WAR no <code>target/</code>.
          </li><li>
            <strong>verify</strong> — testes de integração.
          </li><li>
            <strong>install</strong> — copia o artefato pro repositório local (<code>~/.m2/repository</code>).
          </li><li>
            <strong>deploy</strong> — sobe pra um repositório remoto.
          </li>
        </ul><CodeBlock title="Comandos do dia a dia" code={`mvn clean              # apaga target/
mvn compile            # compila código principal
mvn test               # compila + roda testes
mvn package            # gera o JAR em target/
mvn install            # publica localmente
mvn clean package      # combinação clássica
mvn dependency:tree    # mostra árvore de dependências`} /><h2>Dependency scope</h2><ul>
          <li>
            <strong>compile</strong> (padrão) — disponível em compilação, teste e runtime.
          </li><li>
            <strong>test</strong> — só durante testes (JUnit, Mockito).
          </li><li>
            <strong>provided</strong> — disponível em compilação, mas o ambiente fornece em runtime (ex.: Servlet API num servidor Tomcat).
          </li><li>
            <strong>runtime</strong> — não precisa em compilação, mas precisa em execução (ex.: driver JDBC).
          </li>
        </ul><h2>Plugins essenciais</h2><p>
          Por padrão, Maven já vem com plugins comuns ligados ao ciclo de vida. Você só configura quando quer mudar o default.
        </p><CodeBlock title="Definindo versão do Java explicitamente" code={`<build>
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
</build>`} /><AlertBox type="tip" title="release > source/target">
          Use <code>
            {"<release>21</release>"}
          </code> em vez do antigo par <code>source</code> + <code>target</code>. Mais simples e garante que você não usa APIs novas demais por engano.
        </AlertBox><h2>BOM: dominando versões</h2><p>
          Quando você usa um ecossistema (Spring, Jackson, AWS SDK), há vários artefatos que precisam estar na mesma versão. Um <strong>BOM</strong> (Bill of Materials) é um pom especial que importa as versões já compatíveis.
        </p><CodeBlock title="Importando o BOM do Jackson" code={`<dependencyManagement>
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
</dependencies>`} /><h2>Maven Wrapper (mvnw)</h2><p>
          Gera scripts <code>mvnw</code> e <code>mvnw.cmd</code> no projeto que baixam a versão exata do Maven em qualquer máquina. Quem clonar não precisa instalar nada — só rodar <code>./mvnw</code>.
        </p><CodeBlock title="Gerando o wrapper" code={`mvn wrapper:wrapper
# Cria mvnw, mvnw.cmd e .mvn/wrapper/

./mvnw clean package   # usa a versão fixada no projeto`} /><AlertBox type="success" title="Sempre comite o wrapper">
          <code>mvnw</code>, <code>mvnw.cmd</code> e a pasta <code>.mvn/</code> entram no Git. <code>target/</code> entra no <code>.gitignore</code>.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um projeto novo manualmente: pasta com <code>pom.xml</code> mínimo, <code>src/main/java/exemplo/Hello.java</code> com um <code>main</code> imprimindo "Olá Maven". Rode <code>mvn package</code> e execute o JAR gerado.
          </li><li>
            Adicione Jackson como dependência, leia um JSON literal qualquer e imprima um campo. Veja com <code>mvn dependency:tree</code> quais dependências transitivas vieram junto.
          </li><li>
            Gere o Maven Wrapper no projeto e simule "outro dev": exclua sua instalação do Maven do PATH temporariamente e rode <code>./mvnw clean package</code> — deve funcionar do mesmo jeito.
          </li>
        </ol>
      </PageContainer>
  );
}
