import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoExtraDesafios() {
  return (
    <PageContainer title="Desafios extras pra praticar" subtitle="10+ projetos com dificuldade crescente — escolha um e construa." difficulty="intermediario" timeToRead="10 min">
        <h2>Como usar essa lista</h2><p>
          A melhor forma de aprender Java não é ler mais um livro — é construir. Escolha um projeto que te dê coceira (ou que resolva uma dor sua) e ataque até virar um repositório público. Cada item abaixo tem <strong>uma linha do que é</strong> e <strong>uma linha do que você pratica</strong>. Comece pelo top da lista se ainda está aquecendo; vá pro fim se já se sente confortável.
        </p><AlertBox type="tip" title="Regra de ouro">
          Termine. Um projeto pequeno acabado vale 10 projetos abandonados. Defina escopo mínimo, construa, publique no GitHub, próximo.
        </AlertBox><h2>Os desafios</h2><ol>
          <li>
            <strong>Conversor de moedas CLI.</strong> Lê <code>USD 100 to BRL</code> e bate em uma API pública.<br /><em>Pratica:</em> <code>HttpClient</code> (Java 11+) e parsing JSON com Jackson.
          </li><li>
            <strong>Web scraper de notícias.</strong> Pega manchetes de um portal e salva em CSV.<br /><em>Pratica:</em> biblioteca <code>jsoup</code>, seletores CSS, IO de arquivos.
          </li><li>
            <strong>URL shortener.</strong> Encurta links, redireciona, conta cliques.<br /><em>Pratica:</em> Spring Boot, JPA com H2, algoritmo base62 pra gerar slugs.
          </li><li>
            <strong>Gerador de senhas seguro.</strong> Flags <code>--length 16 --symbols</code> no terminal.<br /><em>Pratica:</em> <code>SecureRandom</code>, Picocli, princípios de criptografia.
          </li><li>
            <strong>Quiz CLI.</strong> Lê perguntas de um JSON e dá score no fim.<br /><em>Pratica:</em> records, deserialização Jackson, controle de fluxo.
          </li><li>
            <strong>Calculadora de IMC web.</strong> Form HTML, mostra classificação e sugestão.<br /><em>Pratica:</em> Spring MVC, Thymeleaf, validação com Bean Validation.
          </li><li>
            <strong>Player de música em terminal.</strong> Toca arquivos MP3 da pasta atual.<br /><em>Pratica:</em> JavaFX <code>MediaPlayer</code>, listagem de arquivos com <code>Files.walk</code>.
          </li><li>
            <strong>Bot de Discord ou Telegram.</strong> Responde comandos e integra com APIs.<br /><em>Pratica:</em> JDA (Discord) ou TelegramBots; eventos assíncronos.
          </li><li>
            <strong>Dashboard de cripto em tempo real.</strong> Mostra preços de BTC/ETH atualizando ao vivo.<br /><em>Pratica:</em> Project Reactor, <code>WebClient</code>, conexão WebSocket.
          </li><li>
            <strong>Compilador de uma linguagem brinquedo.</strong> Sintaxe de 10 palavras-chave.<br /><em>Pratica:</em> parser combinator, AST, interpretação ou geração de bytecode.
          </li><li>
            <strong>Engine de jogo simples.</strong> Pong ou Tetris.<br /><em>Pratica:</em> LWJGL ou JavaFX, game loop, coordenadas e input.
          </li><li>
            <strong>Simulador de blockchain básico.</strong> Blocos, prova-de-trabalho, validação.<br /><em>Pratica:</em> hashing com <code>MessageDigest</code>, listas encadeadas, threads.
          </li>
        </ol><h2>Estrutura sugerida pra cada repo</h2><CodeBlock code={`meu-projeto/
├── README.md          ← descreva o problema, o como rodar, o que aprendeu
├── pom.xml            ← (ou build.gradle.kts)
├── src/main/java/...
├── src/test/java/...
└── .github/workflows/ci.yml   ← bonus: build automático no GitHub Actions`} /><h2>Checklist antes de publicar</h2><ul>
          <li>
            README explicando <strong>o que faz</strong>, <strong>como rodar</strong> e <strong>uma captura/gif</strong>
          </li><li>Pelo menos 2 testes unitários</li><li>
            <code>.gitignore</code> Java decente (ignore <code>target/</code>, <code>.idea/</code>, <code>*.class</code>)
          </li><li>
            Tag de release <code>v0.1.0</code> quando funcionar de ponta a ponta
          </li><li>Issue aberta com 1 melhoria — sinaliza que o projeto está vivo</li>
        </ul><AlertBox type="success" title="Publique tudo">
          Recrutador não lê seu CV de Java se você não tem código pra mostrar. Mesmo um conversor de moedas com README caprichado já te coloca à frente de 80% dos candidatos juniores. Construa, publique, escreva sobre o que aprendeu. <strong>Esse é o caminho.</strong>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escolha <strong>1</strong> projeto agora. Não 3, não 5. Um.
          </li><li>Quebre em 5 issues no GitHub e atribua a si mesmo.</li><li>
            Em 7 dias, faça o primeiro deploy/release público — mesmo que feio. Ajusta depois.
          </li>
        </ol>
      </PageContainer>
  );
}
