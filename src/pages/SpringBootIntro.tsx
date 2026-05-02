import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringBootIntro() {
  return (
    <PageContainer title="Spring Boot: começando" subtitle="Framework #1 de Java enterprise — convenção, autoconfig e produtividade." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você quer escrever uma API REST em Java. Sem Spring Boot, você passa o primeiro dia configurando servlet container, ligando JDBC, escrevendo XML, plugando logger, definindo serializador JSON. Com Spring Boot, em 5 minutos você tem <code>GET /hello</code> respondendo no <code>localhost:8080</code>. É a diferença entre montar um carro do zero e ligar a chave.
        </p><h2>Spring Framework vs Spring Boot</h2><p>
          Spring Framework é a base — Inversion of Control, AOP, MVC, transações. Existe desde 2003 e é poderoso, mas configurar do zero dói. Spring Boot é uma camada acima que aplica o princípio <em>convention over configuration</em>: ele <strong>adivinha</strong> o que você quer baseado no que está no classpath.
        </p><ul>
          <li>
            Tem <code>spring-boot-starter-web</code> nas dependências? Boot configura Tomcat embutido + Jackson + DispatcherServlet.
          </li><li>
            Tem <code>spring-boot-starter-data-jpa</code> + driver H2? Boot cria DataSource em memória, EntityManager e habilita repositórios.
          </li>
        </ul><p>
          Você só sobrescreve o que precisa mudar. Isso é <strong>autoconfiguration</strong>.
        </p><h2>Criando o projeto: start.spring.io</h2><p>
          O jeito oficial é o <a href="https://start.spring.io">Spring Initializr</a>. Escolha:
        </p><ul>
          <li>
            <strong>Project</strong>: Maven (mais comum) ou Gradle.
          </li><li>
            <strong>Language</strong>: Java.
          </li><li>
            <strong>Spring Boot</strong>: a versão estável mais recente (3.x exige Java 17+; use Java 21 LTS).
          </li><li>
            <strong>Packaging</strong>: Jar.
          </li><li>
            <strong>Dependencies</strong>: <code>Spring Web</code>, <code>Spring Data JPA</code>, <code>H2 Database</code>, <code>Lombok</code>, <code>Spring Boot DevTools</code>.
          </li>
        </ul><p>
          Clique em <em>Generate</em>, baixe o ZIP, abra na sua IDE.
        </p><h2>Estrutura padrão</h2><CodeBlock title="Árvore do projeto" code={`meu-app/
├── pom.xml                       # ou build.gradle
├── src/main/java/com/exemplo/MeuAppApplication.java
├── src/main/resources/
│   ├── application.properties    # config principal
│   ├── application-dev.properties
│   └── application-prod.properties
└── src/test/java/com/exemplo/MeuAppApplicationTests.java`} /><CodeBlock title="MeuAppApplication.java — o ponto de entrada" code={`package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MeuAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeuAppApplication.class, args);
    }
}`} /><p>
          A anotação <code>@SpringBootApplication</code> é três em uma: <code>@Configuration</code> (essa classe define beans), <code>@EnableAutoConfiguration</code> (liga a mágica da autoconfig) e <code>@ComponentScan</code> (varre o pacote atual e subpacotes em busca de <code>@Component</code>, <code>@Service</code>, <code>@RestController</code> etc.).
        </p><AlertBox type="tip" title="Regra do pacote raiz">
          Sempre coloque <code>MeuAppApplication</code> no pacote raiz (ex.: <code>com.exemplo</code>) e os demais em subpacotes (<code>com.exemplo.user</code>, <code>com.exemplo.product</code>). Senão o <code>@ComponentScan</code> não acha seus beans.
        </AlertBox><h2>application.properties</h2><CodeBlock title="src/main/resources/application.properties" code={`server.port=8080
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
logging.level.com.exemplo=DEBUG`} /><p>
          Se preferir YAML, renomeie para <code>application.yml</code> e use indentação. É equivalente.
        </p><h2>Rodando</h2><CodeBlock title="Terminal" code={`# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun

# ou empacote e execute o JAR
./mvnw package
java -jar target/meu-app-0.0.1-SNAPSHOT.jar`} /><p>
          Note que <strong>não existe WAR</strong>, não precisa de Tomcat instalado. O Tomcat (ou Jetty/Undertow) vem <em>embutido</em> dentro do JAR. Você dá <code>java -jar</code> e tem um servidor HTTP rodando. Isso é gigante para containers Docker e cloud.
        </p><h2>Profiles: dev, test, prod</h2><p>
          Você não quer apontar pra Postgres de produção rodando localmente. Profiles separam configurações por ambiente.
        </p><CodeBlock title="application-dev.properties" code={`spring.datasource.url=jdbc:h2:mem:devdb
logging.level.com.exemplo=DEBUG`} /><CodeBlock title="application-prod.properties" code={`spring.datasource.url=jdbc:postgresql://db.empresa.com:5432/app
spring.datasource.username=appuser
spring.datasource.password=\${DB_PASSWORD}
logging.level.com.exemplo=WARN`} /><CodeBlock title="Ativando o profile" code={`# por argumento
java -jar app.jar --spring.profiles.active=prod

# por variável de ambiente
SPRING_PROFILES_ACTIVE=prod java -jar app.jar

# no application.properties principal
spring.profiles.active=dev`} /><h2>DevTools: livereload</h2><p>
          A dependência <code>spring-boot-devtools</code> reinicia o app automaticamente quando você salva um <code>.java</code>. É um restart parcial (mantém o ClassLoader do framework, recarrega só o seu código), então leva 1-2 segundos em vez de 10.
        </p><AlertBox type="warning" title="Só em desenvolvimento">
          DevTools é desativado quando o JAR roda como produção (<code>java -jar</code>). Mas remova ou mova para <code>scope=runtime</code> antes de empacotar imagens Docker.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Gere um projeto no <code>start.spring.io</code> com Java 21, Maven, Spring Web e DevTools. Crie um <code>HelloController</code> que responda <code>GET /ola</code> com a string <em>"Bom dia!"</em>. Rode com <code>./mvnw spring-boot:run</code> e teste no navegador.
          </li><li>
            Crie um <code>application-dev.properties</code> que mude a porta para <code>9090</code>. Rode com <code>--spring.profiles.active=dev</code> e confirme que o app subiu na nova porta.
          </li><li>
            Adicione H2 + JPA, ative o console em <code>/h2-console</code> e descubra a URL JDBC mostrada nos logs. Conecte pelo navegador.
          </li>
        </ol>
      </PageContainer>
  );
}
