import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IDE() {
  return (
    <PageContainer title="Escolher uma IDE para Java" subtitle="IntelliJ IDEA, VS Code ou Eclipse — qual usar e por quê." difficulty="iniciante" timeToRead="12 min">
        <h2>Por que você precisa disso</h2><p>
          Dá pra escrever Java no Bloco de Notas? Dá. Mas seria como cortar madeira com faca de cozinha. Java é uma linguagem <strong>verbosa e tipada</strong>, e uma IDE bem configurada faz três coisas que multiplicam sua produtividade:
        </p><ul>
          <li>
            <strong>Autocomplete inteligente</strong> — você escreve menos e erra menos
          </li><li>
            <strong>Refactorings seguros</strong> — renomear uma classe atualiza 200 arquivos sem você se preocupar
          </li><li>
            <strong>Debugger visual</strong> — você consegue parar a execução e olhar variáveis em tempo real
          </li>
        </ul><p>
          Tem três opções dominantes hoje. Vamos comparar pra você decidir com base no seu contexto, e não em "o que meu professor mandou usar".
        </p><h2>IntelliJ IDEA Community (recomendada)</h2><p>
          Da JetBrains, gratuita e open source na edição <strong>Community</strong>. É a IDE com a melhor experiência pura de Java do mercado — autocomplete que parece adivinhar o que você quer, refactorings que funcionam de verdade, integração com Maven e Gradle out of the box.
        </p><p>Pontos fortes:</p><ul>
          <li>Detecta bugs e code smells enquanto você digita</li><li>Refactoring é o melhor entre todas — extrair método, renomear, mover classe</li><li>Debugger excelente, com expressões inline e hot reload</li><li>
            Suporte nativo a Spring Boot vem na Ultimate (paga), mas Community já é ótima pra estudar
          </li>
        </ul><p>Pontos fracos:</p><ul>
          <li>Pesada (consome RAM com fome)</li><li>Curva de aprendizado dos atalhos é íngreme no início</li><li>Community não tem suporte a JavaEE/Jakarta nem aos frameworks web mais pesados</li>
        </ul><p>
          Como criar um projeto novo: <em>File → New → Project → Java</em>, escolha o JDK 21 que você instalou no capítulo anterior, opte por <strong>Maven</strong> ou<strong> Gradle</strong> como build system, dê um nome e clique em Create. A IDE gera a estrutura de pastas, baixa as dependências e abre uma classe <code>Main</code> pronta pra rodar.
        </p><AlertBox type="tip" title="Para iniciante: vai de IntelliJ">
          Se você está começando agora e não tem opinião formada, instale o IntelliJ Community. É o que vai te ensinar boas práticas via warnings inteligentes.
        </AlertBox><h2>VS Code com Extension Pack for Java</h2><p>
          Se você já vive no VS Code (vindo do mundo JS/Python), pode continuar nele. A Microsoft mantém o <strong>Extension Pack for Java</strong>, que junta:
        </p><ul>
          <li>
            <em>Language Support for Java</em> (da Red Hat — usa o Eclipse JDT por baixo)
          </li><li>
            <em>Debugger for Java</em>
          </li><li>
            <em>Test Runner for Java</em>
          </li><li>
            <em>Maven for Java</em> e <em>Gradle for Java</em>
          </li><li>
            <em>Project Manager for Java</em>
          </li>
        </ul><p>Pontos fortes:</p><ul>
          <li>Leve, abre em segundos</li><li>Mesmo workflow se você já alterna entre TypeScript, Python, Java</li><li>Configuração via JSON, fácil de versionar</li>
        </ul><p>Pontos fracos:</p><ul>
          <li>Refactorings menos potentes que o IntelliJ</li><li>Indexação de projetos grandes é mais lenta</li><li>Recursos avançados de debug ficam atrás do IntelliJ</li>
        </ul><p>
          Como criar um projeto novo: pressione <code>Ctrl+Shift+P</code>, digite<em> Java: Create Java Project</em>, escolha <em>Maven</em> ou <em>No build tools</em>, siga o assistente. O VS Code abre uma nova janela com a estrutura pronta.
        </p><h2>Eclipse IDE</h2><p>
          A IDE clássica do Java, mantida pela Eclipse Foundation. Foi a IDE dominante por ~15 anos e ainda tem uma comunidade gigante, especialmente em ambientes corporativos.
        </p><p>Pontos fortes:</p><ul>
          <li>100% gratuita, sem versão paga</li><li>
            Ecossistema gigante de plugins (incluindo coisas exóticas como UML, BPMN, modeladores)
          </li><li>Padrão em muitas universidades e empresas tradicionais</li><li>Excelente suporte a Jakarta EE, Spring, OSGi</li>
        </ul><p>Pontos fracos:</p><ul>
          <li>UI mais datada</li><li>Configuração inicial pode ser confusa (workspace, perspective, etc.)</li><li>
            Builds incrementais às vezes ficam inconsistentes — o famoso <em>Project → Clean</em>
          </li>
        </ul><p>
          Como criar um projeto novo: <em>File → New → Maven Project</em>, marque<em> Create a simple project</em>, preencha groupId/artifactId, finish.
        </p><h2>Atalhos essenciais (que você precisa decorar)</h2><p>
          Os atalhos abaixo são quase iguais nas três IDEs (com pequenas variações). Decore esses cinco e sua produtividade dobra.
        </p><ul>
          <li>
            <strong>Ctrl+Space</strong> — autocomplete. Você vai apertar isso a cada 2 segundos.
          </li><li>
            <strong>Shift+F6</strong> (IntelliJ) / <strong>F2</strong> (VS Code, Eclipse) — renomear símbolo (variável, método, classe) em todo o projeto.
          </li><li>
            <strong>F5</strong> — começar/continuar debug. <strong>F8</strong> step over,<strong> F7</strong> step into.
          </li><li>
            <strong>Ctrl+B</strong> (IntelliJ) / <strong>F12</strong> (VS Code, Eclipse) — ir para a definição do símbolo sob o cursor.
          </li><li>
            <strong>Ctrl+Alt+L</strong> (IntelliJ) / <strong>Shift+Alt+F</strong> (VS Code) /<strong> Ctrl+Shift+F</strong> (Eclipse) — formatar o arquivo inteiro.
          </li>
        </ul><AlertBox type="note" title="No macOS troque Ctrl por Cmd">
          Quase todos os atalhos seguem essa regra. Exceção: o IntelliJ tem um conjunto próprio no macOS que vale a pena conhecer no <em>Help → Keymap Reference</em>.
        </AlertBox><h2>Um plugin que vale ouro: SonarLint</h2><p>
          Independente da IDE escolhida, instale o <strong>SonarLint</strong>. É um analisador estático que detecta bugs, vulnerabilidades e code smells <em>enquanto você digita</em>. Ele aponta coisas como:
        </p><ul>
          <li>
            Comparar Strings com <code>==</code> em vez de <code>.equals()</code>
          </li><li>
            Possível <code>NullPointerException</code>
          </li><li>Recursos não fechados (streams, conexões)</li><li>Métodos longos, classes complexas demais</li>
        </ul><p>
          Para iniciante, é como ter um sênior olhando seu código de canto. Disponível como plugin oficial nas três IDEs: procure por "SonarLint" no marketplace.
        </p><CodeBlock title="Exemplo: SonarLint marca isso como bug" code={`String nome = lerNome();
if (nome == "Maria") {           // ⚠️ comparação errada de String
    System.out.println("Oi!");
}

// SonarLint sugere:
if ("Maria".equals(nome)) {
    System.out.println("Oi!");
}`} /><h2>Veredito rápido</h2><ul>
          <li>
            <strong>Iniciante absoluto</strong> → IntelliJ Community
          </li><li>
            <strong>Já uso VS Code pra tudo</strong> → VS Code + Extension Pack for Java
          </li><li>
            <strong>Trabalho em empresa que padroniza Eclipse</strong> → Eclipse, sem drama
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Instale a IDE da sua escolha. Crie um projeto novo chamado <code>primeiro-projeto</code>e adicione uma classe <code>Hello</code> com um <code>main</code> que imprime "Funcionou!". Rode pelo botão verde de play da IDE.
          </li><li>
            Coloque um <strong>breakpoint</strong> (clique na margem esquerda da linha) na linha do <code>println</code>. Rode em modo debug (F5 ou ícone de bichinho). Quando parar, inspecione o valor da variável <code>args</code> no painel de variáveis.
          </li><li>
            Instale o plugin SonarLint. Crie uma string e compare com outra usando <code>==</code>(errado de propósito). Confirme que o SonarLint marcou o erro com um aviso amarelo ou vermelho.
          </li>
        </ol>
      </PageContainer>
  );
}
