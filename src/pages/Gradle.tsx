import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Gradle() {
  return (
    <PageContainer title="Gradle" subtitle="Build tool moderno — usado por Android, Spring Boot, projetos novos." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Gradle é o build tool mais usado em projetos Java modernos. Toda app Android usa Gradle. Spring Boot recomenda. A diferença pro Maven? Em vez de XML rígido, você escreve scripts em Kotlin (ou Groovy) — dá pra programar a build, criar tarefas custom em poucas linhas, e o cache incremental é absurdamente rápido.
        </p><h2>Instalação</h2><ul>
          <li>
            <strong>SDKMAN (recomendado em Linux/macOS):</strong> <code>sdk install gradle</code>
          </li><li>
            <strong>Homebrew:</strong> <code>brew install gradle</code>
          </li><li>
            <strong>Wrapper (melhor opção):</strong> use <code>./gradlew</code> dentro do projeto. Quem clonar não precisa instalar nada.
          </li>
        </ul><CodeBlock title="Verificando" code={`gradle -v
# Gradle 8.x
# JVM: 21.x ...`} /><h2>Estrutura padrão</h2><p>
          Gradle segue o mesmo layout do Maven (<code>src/main/java</code> e <code>src/test/java</code>). O que muda é o arquivo de build:
        </p><CodeBlock title="Layout" code={`meu-projeto/
├── build.gradle.kts        (ou build.gradle)
├── settings.gradle.kts
├── gradle/
├── gradlew
├── gradlew.bat
├── src/
│   ├── main/java/...
│   └── test/java/...
└── build/                  (gerado)`} /><h2>Groovy DSL vs Kotlin DSL</h2><p>Existem duas linguagens pra escrever scripts Gradle:</p><ul>
          <li>
            <strong>Groovy DSL</strong> (<code>build.gradle</code>) — mais antigo, sintaxe mais flexível, predominante em projetos legados e Android mais antigos.
          </li><li>
            <strong>Kotlin DSL</strong> (<code>build.gradle.kts</code>) — mais novo, com <em>type-safety</em>, autocomplete excelente em IDE. Recomendado pra projetos novos.
          </li>
        </ul><h2>build.gradle.kts típico</h2><CodeBlock title="Projeto Java executável" code={`plugins {
    id("java")
    id("application")
}

group = "com.exemplo"
version = "1.0.0"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.fasterxml.jackson.core:jackson-databind:2.17.2")

    testImplementation("org.junit.jupiter:junit-jupiter:5.10.3")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass.set("com.exemplo.App")
}

tasks.test {
    useJUnitPlatform()
}`} /><h2>Plugins</h2><ul>
          <li>
            <code>id("java")</code> — habilita compilação Java.
          </li><li>
            <code>id("application")</code> — adiciona <code>run</code> e gera scripts pra rodar a app.
          </li><li>
            <code>id("java-library")</code> — pra projetos que serão consumidos por outros (libera o scope <code>api</code>).
          </li><li>
            <code>id("org.springframework.boot")</code> — empacota fat JAR de Spring Boot.
          </li>
        </ul><h2>Configurações de dependência</h2><ul>
          <li>
            <strong>implementation</strong> — disponível em compilação e runtime;<em>não</em> vaza pros consumidores da sua lib (encapsulamento).
          </li><li>
            <strong>api</strong> — igual a <code>implementation</code>, mas <em>vaza</em> pra quem depende de você. Use só quando o tipo aparece na sua API pública.
          </li><li>
            <strong>testImplementation</strong> — só nos testes.
          </li><li>
            <strong>runtimeOnly</strong> — não precisa pra compilar, precisa pra rodar (ex.: driver JDBC).
          </li><li>
            <strong>compileOnly</strong> — só pra compilar (ex.: Lombok).
          </li>
        </ul><AlertBox type="tip" title="implementation, não compile">
          O scope <code>compile</code> existia no Gradle antigo e foi descontinuado. Use <code>implementation</code>.
        </AlertBox><h2>Repositórios</h2><CodeBlock title="Onde buscar dependências" code={`repositories {
    mavenCentral()       // o repositório padrão
    mavenLocal()         // ~/.m2 (útil pra libs locais)
    google()             // pra projetos Android
    maven {
        url = uri("https://meu-nexus.empresa.com/releases")
    }
}`} /><h2>Tarefas (tasks)</h2><p>
          Gradle não tem ciclo de vida fixo como Maven. Em vez disso, ele tem um grafo de tarefas; cada uma declara as suas dependências.
        </p><CodeBlock title="Comandos do dia a dia" code={`gradle build         # compila + testa + empacota
gradle test          # roda só testes
gradle run           # executa main (precisa do plugin application)
gradle clean         # apaga build/
gradle tasks         # lista todas as tarefas disponíveis
gradle dependencies  # mostra árvore de dependências

# Com o wrapper:
./gradlew build`} /><h2>O Wrapper (gradlew)</h2><p>
          Gera scripts no projeto que baixam a versão exata do Gradle. Mesmo princípio do <code>mvnw</code>, mas o ecossistema Gradle adota <strong>de forma quase universal</strong> — projetos sem wrapper são raros.
        </p><CodeBlock title="Gerando ou atualizando" code={`gradle wrapper --gradle-version 8.10
# Cria/atualiza gradlew, gradlew.bat e gradle/wrapper/`} /><AlertBox type="success" title="Sempre comite o wrapper">
          <code>gradlew</code>, <code>gradlew.bat</code> e a pasta <code>gradle/</code> vão pro Git. <code>build/</code> vai pro <code>.gitignore</code>.
        </AlertBox><h2>Cache e build incremental</h2><p>
          Gradle só recompila o que mudou. Ele guarda hashes dos inputs (arquivos fonte, classpath, propriedades) e reaproveita outputs cacheados — inclusive entre builds diferentes na mesma máquina, ou (com <em>build cache</em> remoto) entre membros do time. É por isso que o Gradle ganha fama de "rápido depois da primeira vez".
        </p><h2>Maven vs Gradle: comparação prática</h2><ul>
          <li>
            <strong>Sintaxe:</strong> Maven é XML verboso e estático. Gradle é DSL programável (você pode usar <code>if</code>, criar funções, etc).
          </li><li>
            <strong>Curva:</strong> Maven é mais previsível e fácil de aprender. Gradle pede que você entenda configurações e tarefas.
          </li><li>
            <strong>Velocidade:</strong> Gradle é mais rápido em projetos médios e grandes graças ao cache incremental.
          </li><li>
            <strong>Ecossistema:</strong> ambos consomem dependências do Maven Central. Plugins gradle são mais flexíveis mas há mais "magia" pra entender.
          </li><li>
            <strong>Quando usar qual:</strong> seguindo um projeto/empresa? use o que ele já usa. Começando do zero? escolha Gradle se conforto com DSL programável; Maven se prefere convenção rígida.
          </li>
        </ul><h2>Migrar de um pro outro</h2><p>
          Existe <code>gradle init --type pom</code> que tenta converter um <code>pom.xml</code> em build Gradle. Funciona pra projetos simples; builds complexos precisam de ajuste manual. No sentido inverso, não há ferramenta automática boa — geralmente é manual.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um projeto novo: <code>gradle init --type java-application</code> — responda Kotlin DSL e JUnit Jupiter. Explore os arquivos gerados.
          </li><li>
            Adicione Jackson como <code>implementation</code>, escreva uma classe que serializa um record qualquer. Rode <code>./gradlew run</code> e confira a saída.
          </li><li>
            Crie uma tarefa custom no <code>build.gradle.kts</code> chamada <code>helloMundo</code> que imprime "Olá Gradle!". Rode com <code>./gradlew helloMundo</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
