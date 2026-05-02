import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer title="Referências & Recursos" subtitle="Onde aprofundar depois desse livro." difficulty="iniciante" timeToRead="5 min">
        <h2>Por que você precisa disso</h2><p>
          Este livro te dá a base sólida pra escrever Java moderno com confiança, mas o ecossistema é gigantesco — frameworks, libs novas todo mês, especificações que evoluem. Aqui está um mapa enxuto de onde continuar estudando: documentação oficial, sites de qualidade, livros que valem o investimento, e comunidades onde tirar dúvidas.
        </p><h2>Documentação oficial</h2><ul>
          <li>
            <a href="https://docs.oracle.com/en/java/javase/21/">docs.oracle.com/en/java/javase/21/</a> — referência completa do Java SE 21 (LTS): API, especificação da linguagem, ferramentas.
          </li><li>
            <a href="https://openjdk.org/">openjdk.org</a> — projeto OpenJDK (implementação de referência open source). Aqui você acompanha downloads, builds e roadmap.
          </li><li>
            <a href="https://openjdk.org/jeps/0">openjdk.org/jeps/0</a> — índice de JEPs (JDK Enhancement Proposals). Lê aqui pra saber quais features estão chegando, em preview ou em incubação.
          </li>
        </ul><h2>Sites de aprendizado</h2><ul>
          <li>
            <a href="https://dev.java/learn/">dev.java/learn</a> — guia oficial, gratuito, mantido pela Oracle. Em inglês, mas a didática é excelente. A inspiração estrutural do livro que você está lendo.
          </li><li>
            <a href="https://www.baeldung.com/">baeldung.com</a> — repositório gigante de tutoriais práticos focados em Spring, JUnit, JPA, frameworks. Bom pra "como faço X em Y?".
          </li><li>
            <a href="http://tutorials.jenkov.com/">jenkov.com</a> — referências mais profundas e técnicas, especialmente em concorrência, NIO e design patterns.
          </li>
        </ul><h2>Livros</h2><ul>
          <li>
            <strong>Effective Java</strong> (Joshua Bloch) — leitura <em>obrigatória</em> depois que você dominar o básico. 90 itens com melhores práticas que transformam código mediano em código profissional.
          </li><li>
            <strong>Java Concurrency in Practice</strong> (Brian Goetz) — a bíblia de programação concorrente em Java. Denso, mas a referência definitiva pra quem vai mexer com threads de verdade.
          </li><li>
            <strong>Modern Java in Action</strong> (Urma, Fusco, Mycroft) — panorama de streams, lambdas, Optional, programação funcional e features modernas (até Java 11/12). Bom complemento pro Effective Java.
          </li>
        </ul><h2>Comunidades</h2><ul>
          <li>
            <a href="https://stackoverflow.com/questions/tagged/java">Stack Overflow (tag java)</a> — primeiro lugar pra buscar erros e dúvidas pontuais. Quase tudo já foi perguntado.
          </li><li>
            <a href="https://www.reddit.com/r/java/">reddit.com/r/java</a> — discussões, novidades do ecossistema, opiniões.
          </li><li>
            <a href="https://dev.to/t/java">dev.to/t/java</a> — artigos da comunidade, mais informais, ótimo pra acompanhar tendências.
          </li><li>
            Slack/Discord de comunidades brasileiras: procure "Java BR", "DevsBR" e a comunidade do <strong>SouJava</strong>.
          </li>
        </ul><h2>Vídeos e canais</h2><ul>
          <li>
            <strong>Bro Code</strong> — playlist Java do zero, ritmo rápido, bom pra revisar conceitos.
          </li><li>
            <strong>Coding with John</strong> — explicações técnicas claras de tópicos específicos (records, generics, async, etc).
          </li><li>
            <strong>Devoxx</strong> (YouTube) — palestras das maiores conferências Java do mundo. Aqui você vê a comunidade discutindo o futuro da linguagem.
          </li><li>
            <strong>Inside Java</strong> (canal oficial da Oracle) — entrevistas com os arquitetos da JDK. Vale acompanhar pra entender o "porquê" das decisões.
          </li>
        </ul><h2>Ferramentas</h2><ul>
          <li>
            <a href="https://sdkman.io/">sdkman.io</a> — gerencia múltiplas versões de JDK, Maven, Gradle no Linux/macOS. Instalar e trocar de JDK fica trivial.
          </li><li>
            <a href="https://maven.apache.org/guides/">maven.apache.org/guides</a> e <a href="https://docs.gradle.org/">docs.gradle.org</a> — docs oficiais das build tools.
          </li><li>
            <a href="https://search.maven.org/">search.maven.org</a> e <a href="https://central.sonatype.com/">central.sonatype.com</a> — buscar dependências disponíveis no Maven Central.
          </li><li>
            <a href="https://start.spring.io/">start.spring.io</a> — gerador de projeto Spring Boot. Quando começar com Spring, é o ponto de partida.
          </li>
        </ul><h2>Acompanhar o que vem por aí</h2><p>
          Java tem ciclo de release de 6 meses (com versões LTS a cada 2 anos). Pra não ficar pra trás:
        </p><ul>
          <li>
            Leia o changelog de cada release no <a href="https://openjdk.org/projects/jdk/">openjdk.org/projects/jdk</a>.
          </li><li>
            Newsletter <strong>Java Weekly</strong> (Baeldung) — toda terça com links curados.
          </li><li>
            Siga arquitetos da JDK no Twitter/Mastodon: Brian Goetz, Mark Reinhold, Stuart Marks.
          </li>
        </ul><AlertBox type="success" title="O segredo é praticar">
          Ler é o começo, mas Java entra na cabeça quando você escreve código todo dia. Pega um projetinho — uma API REST, um CLI que processa CSVs, um bot de Telegram — e termine. Mesmo pequeno, projeto terminado ensina mais do que 10 tutoriais começados. Bom código vem da quilometragem.
        </AlertBox><h2>🎯 Próximos passos</h2><ol>
          <li>
            Escolha um framework "real" pra estudar a fundo. Pra web/API, comece com Spring Boot. Pra apps desktop, JavaFX. Pra Android, Jetpack Compose.
          </li><li>
            Pegue um projeto open source no GitHub que você usa, leia o código, tente entender uma feature. Faça um PR pequeno (corrigir typo na doc já vale).
          </li><li>
            Estabeleça um ritmo: 30 minutos de Java por dia é mais valioso do que 5 horas no fim de semana. Boa jornada!
          </li>
        </ol>
      </PageContainer>
  );
}
