import{j as e}from"./index-BpXci30S.js";import{P as s,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function l(){return e.jsxs(s,{title:"Gradle",subtitle:"Build tool moderno — usado por Android, Spring Boot, projetos novos.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Gradle é o build tool mais usado em projetos Java modernos. Toda app Android usa Gradle. Spring Boot recomenda. A diferença pro Maven? Em vez de XML rígido, você escreve scripts em Kotlin (ou Groovy) — dá pra programar a build, criar tarefas custom em poucas linhas, e o cache incremental é absurdamente rápido."}),e.jsx("h2",{children:"Instalação"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"SDKMAN (recomendado em Linux/macOS):"})," ",e.jsx("code",{children:"sdk install gradle"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Homebrew:"})," ",e.jsx("code",{children:"brew install gradle"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Wrapper (melhor opção):"})," use ",e.jsx("code",{children:"./gradlew"})," dentro do projeto. Quem clonar não precisa instalar nada."]})]}),e.jsx(a,{title:"Verificando",code:`gradle -v
# Gradle 8.x
# JVM: 21.x ...`}),e.jsx("h2",{children:"Estrutura padrão"}),e.jsxs("p",{children:["Gradle segue o mesmo layout do Maven (",e.jsx("code",{children:"src/main/java"})," e ",e.jsx("code",{children:"src/test/java"}),"). O que muda é o arquivo de build:"]}),e.jsx(a,{title:"Layout",code:`meu-projeto/
├── build.gradle.kts        (ou build.gradle)
├── settings.gradle.kts
├── gradle/
├── gradlew
├── gradlew.bat
├── src/
│   ├── main/java/...
│   └── test/java/...
└── build/                  (gerado)`}),e.jsx("h2",{children:"Groovy DSL vs Kotlin DSL"}),e.jsx("p",{children:"Existem duas linguagens pra escrever scripts Gradle:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Groovy DSL"})," (",e.jsx("code",{children:"build.gradle"}),") — mais antigo, sintaxe mais flexível, predominante em projetos legados e Android mais antigos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Kotlin DSL"})," (",e.jsx("code",{children:"build.gradle.kts"}),") — mais novo, com ",e.jsx("em",{children:"type-safety"}),", autocomplete excelente em IDE. Recomendado pra projetos novos."]})]}),e.jsx("h2",{children:"build.gradle.kts típico"}),e.jsx(a,{title:"Projeto Java executável",code:`plugins {
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
}`}),e.jsx("h2",{children:"Plugins"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'id("java")'})," — habilita compilação Java."]}),e.jsxs("li",{children:[e.jsx("code",{children:'id("application")'})," — adiciona ",e.jsx("code",{children:"run"})," e gera scripts pra rodar a app."]}),e.jsxs("li",{children:[e.jsx("code",{children:'id("java-library")'})," — pra projetos que serão consumidos por outros (libera o scope ",e.jsx("code",{children:"api"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:'id("org.springframework.boot")'})," — empacota fat JAR de Spring Boot."]})]}),e.jsx("h2",{children:"Configurações de dependência"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"implementation"})," — disponível em compilação e runtime;",e.jsx("em",{children:"não"})," vaza pros consumidores da sua lib (encapsulamento)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"api"})," — igual a ",e.jsx("code",{children:"implementation"}),", mas ",e.jsx("em",{children:"vaza"})," pra quem depende de você. Use só quando o tipo aparece na sua API pública."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"testImplementation"})," — só nos testes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"runtimeOnly"})," — não precisa pra compilar, precisa pra rodar (ex.: driver JDBC)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"compileOnly"})," — só pra compilar (ex.: Lombok)."]})]}),e.jsxs(r,{type:"tip",title:"implementation, não compile",children:["O scope ",e.jsx("code",{children:"compile"})," existia no Gradle antigo e foi descontinuado. Use ",e.jsx("code",{children:"implementation"}),"."]}),e.jsx("h2",{children:"Repositórios"}),e.jsx(a,{title:"Onde buscar dependências",code:`repositories {
    mavenCentral()       // o repositório padrão
    mavenLocal()         // ~/.m2 (útil pra libs locais)
    google()             // pra projetos Android
    maven {
        url = uri("https://meu-nexus.empresa.com/releases")
    }
}`}),e.jsx("h2",{children:"Tarefas (tasks)"}),e.jsx("p",{children:"Gradle não tem ciclo de vida fixo como Maven. Em vez disso, ele tem um grafo de tarefas; cada uma declara as suas dependências."}),e.jsx(a,{title:"Comandos do dia a dia",code:`gradle build         # compila + testa + empacota
gradle test          # roda só testes
gradle run           # executa main (precisa do plugin application)
gradle clean         # apaga build/
gradle tasks         # lista todas as tarefas disponíveis
gradle dependencies  # mostra árvore de dependências

# Com o wrapper:
./gradlew build`}),e.jsx("h2",{children:"O Wrapper (gradlew)"}),e.jsxs("p",{children:["Gera scripts no projeto que baixam a versão exata do Gradle. Mesmo princípio do ",e.jsx("code",{children:"mvnw"}),", mas o ecossistema Gradle adota ",e.jsx("strong",{children:"de forma quase universal"})," — projetos sem wrapper são raros."]}),e.jsx(a,{title:"Gerando ou atualizando",code:`gradle wrapper --gradle-version 8.10
# Cria/atualiza gradlew, gradlew.bat e gradle/wrapper/`}),e.jsxs(r,{type:"success",title:"Sempre comite o wrapper",children:[e.jsx("code",{children:"gradlew"}),", ",e.jsx("code",{children:"gradlew.bat"})," e a pasta ",e.jsx("code",{children:"gradle/"})," vão pro Git. ",e.jsx("code",{children:"build/"})," vai pro ",e.jsx("code",{children:".gitignore"}),"."]}),e.jsx("h2",{children:"Cache e build incremental"}),e.jsxs("p",{children:["Gradle só recompila o que mudou. Ele guarda hashes dos inputs (arquivos fonte, classpath, propriedades) e reaproveita outputs cacheados — inclusive entre builds diferentes na mesma máquina, ou (com ",e.jsx("em",{children:"build cache"}),' remoto) entre membros do time. É por isso que o Gradle ganha fama de "rápido depois da primeira vez".']}),e.jsx("h2",{children:"Maven vs Gradle: comparação prática"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sintaxe:"})," Maven é XML verboso e estático. Gradle é DSL programável (você pode usar ",e.jsx("code",{children:"if"}),", criar funções, etc)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Curva:"})," Maven é mais previsível e fácil de aprender. Gradle pede que você entenda configurações e tarefas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Velocidade:"})," Gradle é mais rápido em projetos médios e grandes graças ao cache incremental."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ecossistema:"}),' ambos consomem dependências do Maven Central. Plugins gradle são mais flexíveis mas há mais "magia" pra entender.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quando usar qual:"})," seguindo um projeto/empresa? use o que ele já usa. Começando do zero? escolha Gradle se conforto com DSL programável; Maven se prefere convenção rígida."]})]}),e.jsx("h2",{children:"Migrar de um pro outro"}),e.jsxs("p",{children:["Existe ",e.jsx("code",{children:"gradle init --type pom"})," que tenta converter um ",e.jsx("code",{children:"pom.xml"})," em build Gradle. Funciona pra projetos simples; builds complexos precisam de ajuste manual. No sentido inverso, não há ferramenta automática boa — geralmente é manual."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um projeto novo: ",e.jsx("code",{children:"gradle init --type java-application"})," — responda Kotlin DSL e JUnit Jupiter. Explore os arquivos gerados."]}),e.jsxs("li",{children:["Adicione Jackson como ",e.jsx("code",{children:"implementation"}),", escreva uma classe que serializa um record qualquer. Rode ",e.jsx("code",{children:"./gradlew run"})," e confira a saída."]}),e.jsxs("li",{children:["Crie uma tarefa custom no ",e.jsx("code",{children:"build.gradle.kts"})," chamada ",e.jsx("code",{children:"helloMundo"}),' que imprime "Olá Gradle!". Rode com ',e.jsx("code",{children:"./gradlew helloMundo"}),"."]})]})]})}export{l as default};
