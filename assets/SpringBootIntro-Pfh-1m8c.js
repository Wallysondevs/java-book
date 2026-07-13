import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"Spring Boot: começando",subtitle:"Framework #1 de Java enterprise — convenção, autoconfig e produtividade.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Você quer escrever uma API REST em Java. Sem Spring Boot, você passa o primeiro dia configurando servlet container, ligando JDBC, escrevendo XML, plugando logger, definindo serializador JSON. Com Spring Boot, em 5 minutos você tem ",e.jsx("code",{children:"GET /hello"})," respondendo no ",e.jsx("code",{children:"localhost:8080"}),". É a diferença entre montar um carro do zero e ligar a chave."]}),e.jsx("h2",{children:"Spring Framework vs Spring Boot"}),e.jsxs("p",{children:["Spring Framework é a base — Inversion of Control, AOP, MVC, transações. Existe desde 2003 e é poderoso, mas configurar do zero dói. Spring Boot é uma camada acima que aplica o princípio ",e.jsx("em",{children:"convention over configuration"}),": ele ",e.jsx("strong",{children:"adivinha"})," o que você quer baseado no que está no classpath."]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Tem ",e.jsx("code",{children:"spring-boot-starter-web"})," nas dependências? Boot configura Tomcat embutido + Jackson + DispatcherServlet."]}),e.jsxs("li",{children:["Tem ",e.jsx("code",{children:"spring-boot-starter-data-jpa"})," + driver H2? Boot cria DataSource em memória, EntityManager e habilita repositórios."]})]}),e.jsxs("p",{children:["Você só sobrescreve o que precisa mudar. Isso é ",e.jsx("strong",{children:"autoconfiguration"}),"."]}),e.jsx("h2",{children:"Criando o projeto: start.spring.io"}),e.jsxs("p",{children:["O jeito oficial é o ",e.jsx("a",{href:"https://start.spring.io",children:"Spring Initializr"}),". Escolha:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Project"}),": Maven (mais comum) ou Gradle."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Language"}),": Java."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Spring Boot"}),": a versão estável mais recente (3.x exige Java 17+; use Java 21 LTS)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Packaging"}),": Jar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dependencies"}),": ",e.jsx("code",{children:"Spring Web"}),", ",e.jsx("code",{children:"Spring Data JPA"}),", ",e.jsx("code",{children:"H2 Database"}),", ",e.jsx("code",{children:"Lombok"}),", ",e.jsx("code",{children:"Spring Boot DevTools"}),"."]})]}),e.jsxs("p",{children:["Clique em ",e.jsx("em",{children:"Generate"}),", baixe o ZIP, abra na sua IDE."]}),e.jsx("h2",{children:"Estrutura padrão"}),e.jsx(o,{title:"Árvore do projeto",code:`meu-app/
├── pom.xml                       # ou build.gradle
├── src/main/java/com/exemplo/MeuAppApplication.java
├── src/main/resources/
│   ├── application.properties    # config principal
│   ├── application-dev.properties
│   └── application-prod.properties
└── src/test/java/com/exemplo/MeuAppApplicationTests.java`}),e.jsx(o,{title:"MeuAppApplication.java — o ponto de entrada",code:`package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MeuAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeuAppApplication.class, args);
    }
}`}),e.jsxs("p",{children:["A anotação ",e.jsx("code",{children:"@SpringBootApplication"})," é três em uma: ",e.jsx("code",{children:"@Configuration"})," (essa classe define beans), ",e.jsx("code",{children:"@EnableAutoConfiguration"})," (liga a mágica da autoconfig) e ",e.jsx("code",{children:"@ComponentScan"})," (varre o pacote atual e subpacotes em busca de ",e.jsx("code",{children:"@Component"}),", ",e.jsx("code",{children:"@Service"}),", ",e.jsx("code",{children:"@RestController"})," etc.)."]}),e.jsxs(r,{type:"tip",title:"Regra do pacote raiz",children:["Sempre coloque ",e.jsx("code",{children:"MeuAppApplication"})," no pacote raiz (ex.: ",e.jsx("code",{children:"com.exemplo"}),") e os demais em subpacotes (",e.jsx("code",{children:"com.exemplo.user"}),", ",e.jsx("code",{children:"com.exemplo.product"}),"). Senão o ",e.jsx("code",{children:"@ComponentScan"})," não acha seus beans."]}),e.jsx("h2",{children:"application.properties"}),e.jsx(o,{title:"src/main/resources/application.properties",code:`server.port=8080
spring.application.name=meu-app

# Datasource (H2 em memória)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Log
logging.level.org.springframework=INFO
logging.level.com.exemplo=DEBUG`}),e.jsxs("p",{children:["Se preferir YAML, renomeie para ",e.jsx("code",{children:"application.yml"})," e use indentação. É equivalente."]}),e.jsx("h2",{children:"Rodando"}),e.jsx(o,{title:"Terminal",code:`# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun

# ou empacote e execute o JAR
./mvnw package
java -jar target/meu-app-0.0.1-SNAPSHOT.jar`}),e.jsxs("p",{children:["Note que ",e.jsx("strong",{children:"não existe WAR"}),", não precisa de Tomcat instalado. O Tomcat (ou Jetty/Undertow) vem ",e.jsx("em",{children:"embutido"})," dentro do JAR. Você dá ",e.jsx("code",{children:"java -jar"})," e tem um servidor HTTP rodando. Isso é gigante para containers Docker e cloud."]}),e.jsx("h2",{children:"Profiles: dev, test, prod"}),e.jsx("p",{children:"Você não quer apontar pra Postgres de produção rodando localmente. Profiles separam configurações por ambiente."}),e.jsx(o,{title:"application-dev.properties",code:`spring.datasource.url=jdbc:h2:mem:devdb
logging.level.com.exemplo=DEBUG`}),e.jsx(o,{title:"application-prod.properties",code:`spring.datasource.url=jdbc:postgresql://db.empresa.com:5432/app
spring.datasource.username=appuser
spring.datasource.password=\${DB_PASSWORD}
logging.level.com.exemplo=WARN`}),e.jsx(o,{title:"Ativando o profile",code:`# por argumento
java -jar app.jar --spring.profiles.active=prod

# por variável de ambiente
SPRING_PROFILES_ACTIVE=prod java -jar app.jar

# no application.properties principal
spring.profiles.active=dev`}),e.jsx("h2",{children:"DevTools: livereload"}),e.jsxs("p",{children:["A dependência ",e.jsx("code",{children:"spring-boot-devtools"})," reinicia o app automaticamente quando você salva um ",e.jsx("code",{children:".java"}),". É um restart parcial (mantém o ClassLoader do framework, recarrega só o seu código), então leva 1-2 segundos em vez de 10."]}),e.jsxs(r,{type:"warning",title:"Só em desenvolvimento",children:["DevTools é desativado quando o JAR roda como produção (",e.jsx("code",{children:"java -jar"}),"). Mas remova ou mova para ",e.jsx("code",{children:"scope=runtime"})," antes de empacotar imagens Docker."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Gere um projeto no ",e.jsx("code",{children:"start.spring.io"})," com Java 21, Maven, Spring Web e DevTools. Crie um ",e.jsx("code",{children:"HelloController"})," que responda ",e.jsx("code",{children:"GET /ola"})," com a string ",e.jsx("em",{children:'"Bom dia!"'}),". Rode com ",e.jsx("code",{children:"./mvnw spring-boot:run"})," e teste no navegador."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"application-dev.properties"})," que mude a porta para ",e.jsx("code",{children:"9090"}),". Rode com ",e.jsx("code",{children:"--spring.profiles.active=dev"})," e confirme que o app subiu na nova porta."]}),e.jsxs("li",{children:["Adicione H2 + JPA, ative o console em ",e.jsx("code",{children:"/h2-console"})," e descubra a URL JDBC mostrada nos logs. Conecte pelo navegador."]})]})]})}export{c as default};
