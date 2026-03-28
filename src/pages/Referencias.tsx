import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências e Próximos Passos"
      subtitle="Documentação oficial, livros recomendados, plataformas de prática e o que estudar depois."
      difficulty="iniciante"
      timeToRead="5 min"
    >
      <p>
        Parabéns por concluir o Guia Completo de Java! Você passou pelos fundamentos da linguagem,
        OOP, collections, programação funcional, concorrência, testes e ferramentas de build.
        Agora é hora de aprofundar e praticar!
      </p>

      <h2>📚 Documentação Oficial</h2>
      <ul>
        <li>
          <strong>Java Documentation (Oracle)</strong> — docs.oracle.com/en/java/javase/21/<br />
          A referência definitiva: tutoriais, especificações, Javadoc da API standard.
        </li>
        <li>
          <strong>OpenJDK</strong> — openjdk.org<br />
          JEPs (Java Enhancement Proposals), JDK sources e roadmap da linguagem.
        </li>
        <li>
          <strong>JUnit 5</strong> — junit.org/junit5/docs/current/user-guide/<br />
          Guia completo do JUnit Jupiter com todos os recursos.
        </li>
      </ul>

      <h2>📖 Livros Recomendados</h2>
      <ul>
        <li>
          <strong>Effective Java (3ª ed.) — Joshua Bloch</strong><br />
          O livro mais importante sobre Java avançado. 90 "items" de boas práticas da linguagem.
          Leitura obrigatória para todo desenvolvedor Java sério.
        </li>
        <li>
          <strong>Clean Code — Robert C. Martin</strong><br />
          Princípios de código limpo com exemplos em Java. Essencial para escrever código legível e manutenível.
        </li>
        <li>
          <strong>Java Concurrency in Practice — Brian Goetz</strong><br />
          A bíblia da concorrência em Java. Indispensável para quem trabalha com multithreading.
        </li>
        <li>
          <strong>Design Patterns — Gang of Four</strong><br />
          Padrões de projeto clássicos. Muitos exemplos na JDK usam esses padrões.
        </li>
        <li>
          <strong>Modern Java in Action — Raoul-Gabriel Urma</strong><br />
          Java 8-17 moderno: lambdas, streams, módulos, reactive programming.
        </li>
      </ul>

      <h2>🎯 Plataformas de Prática</h2>
      <ul>
        <li>
          <strong>Exercism.io</strong> (exercism.org/tracks/java) — Exercícios com feedback da comunidade. Começa com katas simples e avança progressivamente.
        </li>
        <li>
          <strong>LeetCode</strong> (leetcode.com) — Problemas de algoritmos e estruturas de dados. Essencial para entrevistas técnicas.
        </li>
        <li>
          <strong>HackerRank</strong> (hackerrank.com/domains/java) — Trilha específica de Java com desafios por nível.
        </li>
        <li>
          <strong>Codewars</strong> (codewars.com) — Katas de programação com ranking.
        </li>
        <li>
          <strong>Spring Guides</strong> (spring.io/guides) — Tutoriais práticos do Spring Boot, o framework mais usado em Java.
        </li>
      </ul>

      <h2>🚀 O que Estudar Depois</h2>
      <ul>
        <li>
          <strong>Spring Boot</strong> — Framework web mais popular do Java. REST APIs, injeção de dependência, segurança, banco de dados.
        </li>
        <li>
          <strong>Hibernate / JPA</strong> — Mapeamento objeto-relacional (ORM). Persist objetos Java em bancos de dados SQL.
        </li>
        <li>
          <strong>Design Patterns</strong> — Singleton, Factory, Builder, Strategy, Observer, Decorator, etc. Padrões usados em todo código Java profissional.
        </li>
        <li>
          <strong>SOLID Principles</strong> — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.
        </li>
        <li>
          <strong>Microservices</strong> — Spring Cloud, Docker, Kubernetes, mensageria com Kafka e RabbitMQ.
        </li>
        <li>
          <strong>Kotlin</strong> — Linguagem moderna da JVM, 100% interoperável com Java. Adotada amplamente em Android e backend.
        </li>
        <li>
          <strong>Reactive Programming</strong> — Project Reactor, WebFlux, RxJava para aplicações não-bloqueantes.
        </li>
      </ul>

      <h2>🎓 Certificações Java</h2>
      <ul>
        <li>
          <strong>Oracle Certified Associate (OCA) — Java SE 21</strong><br />
          Fundamentos da linguagem. Boa certificação de entrada.
        </li>
        <li>
          <strong>Oracle Certified Professional (OCP) — Java SE 21</strong><br />
          Nível avançado, inclui concorrência, módulos, streams e mais.
        </li>
      </ul>

      <AlertBox type="success" title="Continue praticando!">
        A melhor forma de aprender Java é construindo projetos reais. Comece com:
        <ol className="mt-2 mb-0">
          <li>Uma API REST simples com Spring Boot</li>
          <li>Um sistema de gerenciamento (CRUD) com banco de dados</li>
          <li>Contribua com projetos open source no GitHub</li>
        </ol>
        O ecossistema Java é vasto e há sempre algo novo para aprender. Boa jornada! ☕
      </AlertBox>
    </PageContainer>
  );
}
