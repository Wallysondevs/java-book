import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuildTools() {
  return (
    <PageContainer
      title="Maven e Gradle"
      subtitle="Gerenciamento de dependências, build automation e estrutura de projetos Java profissionais."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Build tools automatizam compilação, testes, empacotamento e deployment de aplicações Java.
        <strong> Maven</strong> usa XML (pom.xml) e convenção sobre configuração.
        <strong> Gradle</strong> usa Groovy/Kotlin DSL e é mais flexível e rápido.
      </p>

      <h2>1. Maven — Estrutura de Projeto</h2>
      <CodeBlock
        language="text"
        title="Estrutura Maven padrão"
        code={`meu-projeto/
├── pom.xml                    ← configuração do projeto
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/empresa/app/
│   │   │       ├── App.java
│   │   │       ├── service/
│   │   │       └── model/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── log4j2.xml
│   └── test/
│       ├── java/
│       │   └── com/empresa/app/
│       │       └── AppTest.java
│       └── resources/
└── target/                   ← gerado pelo Maven (não commite!)`}
      />

      <h2>2. pom.xml — Configuração do Maven</h2>
      <CodeBlock
        language="xml"
        title="pom.xml completo"
        code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <!-- Identificação do projeto -->
    <groupId>com.empresa</groupId>
    <artifactId>meu-projeto</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>${'${java.version}'}</maven.compiler.source>
        <maven.compiler.target>${'${java.version}'}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.2.0</version>
        </dependency>

        <!-- Jackson (JSON) -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.16.0</version>
        </dependency>

        <!-- JUnit 5 (apenas para testes) -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.12.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`}
      />

      <h2>3. Comandos Maven</h2>
      <CodeBlock
        language="bash"
        title="Ciclo de vida do Maven"
        code={`# Fases principais do ciclo de vida:
# validate → compile → test → package → verify → install → deploy

mvn compile          # Compila o código-fonte
mvn test             # Executa os testes
mvn package          # Empacota em JAR/WAR
mvn install          # Instala no repositório local (~/.m2)
mvn clean            # Remove o diretório target/
mvn clean package    # Limpa e empacota (mais comum)
mvn clean install -DskipTests  # Pula os testes

# Executar um JAR empacotado
java -jar target/meu-projeto-1.0.0.jar

# Baixar dependências sem compilar
mvn dependency:resolve

# Ver árvore de dependências
mvn dependency:tree

# Criar projeto a partir de archetype
mvn archetype:generate \
    -DgroupId=com.empresa \
    -DartifactId=meu-projeto \
    -DarchetypeArtifactId=maven-archetype-quickstart \
    -DarchetypeVersion=1.5`}
      />

      <h2>4. Gradle — build.gradle (Kotlin DSL)</h2>
      <CodeBlock
        language="kotlin"
        title="build.gradle.kts"
        code={`plugins {
    java
    application
}

group = "com.empresa"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    // Dependência de compilação
    implementation("com.google.guava:guava:33.0.0-jre")

    // Apenas para testes
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    testImplementation("org.mockito:mockito-core:5.8.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass = "com.empresa.App"
}

tasks.test {
    useJUnitPlatform()  // importante para JUnit 5!
}`}
      />

      <h2>5. Comandos Gradle</h2>
      <CodeBlock
        language="bash"
        title="Comandos Gradle"
        code={`# Com Gradle Wrapper (recomendado — sem instalar Gradle globalmente)
./gradlew build          # compila + testa + empacota
./gradlew clean build    # limpa e rebuilda
./gradlew test           # apenas testes
./gradlew run            # executa a aplicação (plugin application)
./gradlew jar            # gera o JAR
./gradlew dependencies   # mostra árvore de dependências

# Windows
gradlew.bat build

# Criar um projeto Gradle (com Gradle instalado)
gradle init --type java-application --dsl kotlin

# Gradle Daemon — mantém processo em background (mais rápido)
./gradlew build --daemon
./gradlew --stop         # para o daemon`}
      />

      <AlertBox type="info" title="Maven ou Gradle?">
        <strong>Maven</strong>: convencional, amplamente adotado em empresas, XML verboso mas previsível.
        Excelente para projetos Spring Boot. Boa integração com IDEs.<br /><br />
        <strong>Gradle</strong>: mais rápido (build incremental e caching), DSL Kotlin/Groovy mais expressivo.
        Preferido em projetos Android e monorepos. Mais flexível para projetos complexos.
      </AlertBox>
    </PageContainer>
  );
}
