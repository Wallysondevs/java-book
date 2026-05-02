import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InstalarJdk() {
  return (
    <PageContainer title="Instalar o JDK" subtitle="Windows, Linux e macOS — passo a passo, sem mistério." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Antes de escrever uma única linha de Java, você precisa de duas coisas na sua máquina: um <strong>compilador</strong> (que transforma seu código em algo que a JVM entende) e uma <strong>JVM</strong> (que executa esse algo). Os dois vêm juntos num pacote chamado<strong> JDK</strong> (Java Development Kit). Sem JDK, nada de <code>javac</code>, nada de <code>java</code>, nada de programar.
        </p><p>
          Existe também o <strong>JRE</strong> (só roda, não compila). Esquece ele. Você é desenvolvedor agora — instala o JDK e pronto.
        </p><h2>Qual JDK escolher?</h2><p>
          O ecossistema Java tem várias distribuições do mesmo OpenJDK: Oracle JDK, Amazon Corretto, Microsoft Build, Azul Zulu, Eclipse Temurin... Todas compilam o mesmo código. A diferença está em licença, suporte e binários pré-prontos.
        </p><p>
          A recomendação deste livro é <strong>Eclipse Temurin</strong> (mantido pelo projeto Adoptium da Eclipse Foundation):
        </p><ul>
          <li>100% gratuito, sem pegadinha de licença comercial</li><li>Binários oficiais para Windows, macOS e Linux</li><li>Atualizações de segurança regulares</li><li>É o que a maioria das empresas usa em produção</li>
        </ul><p>
          Vamos usar a versão <strong>Java 21 LTS</strong> (Long Term Support). LTS significa que ela recebe correções por anos — escolha segura para aprender e para projetos reais.
        </p><AlertBox type="tip" title="LTS é o que importa">
          As versões LTS atuais são 8, 11, 17 e 21. As "intermediárias" (18, 19, 20, 22...) saem a cada 6 meses e duram pouco. Para estudo e produção, fique com uma LTS.
        </AlertBox><h2>Windows</h2><p>
          O caminho mais rápido é baixar o instalador <code>.msi</code> do Temurin no site<a href="https://adoptium.net"> adoptium.net</a>. Escolha "Temurin 21 (LTS)" para Windows x64 e baixe o <code>.msi</code>.
        </p><p>Durante a instalação, marque estas opções (ficam desmarcadas por padrão):</p><ul>
          <li>
            <strong>Set JAVA_HOME variable</strong>
          </li><li>
            <strong>Add to PATH</strong>
          </li><li>
            <strong>JavaSoft (Oracle) registry keys</strong>
          </li>
        </ul><p>
          Com isso, qualquer terminal novo (PowerShell, cmd, Git Bash) já enxerga o<code>java</code> e o <code>javac</code> sem você precisar configurar nada.
        </p><h2>macOS</h2><p>
          Se você usa <a href="https://brew.sh">Homebrew</a> (e deveria), é uma linha:
        </p><CodeBlock title="Instalar Temurin 21 no macOS" code="brew install --cask temurin@21" /><p>
          O Homebrew coloca o JDK em <code>/Library/Java/JavaVirtualMachines/</code> e o macOS descobre ele automaticamente via <code>/usr/libexec/java_home</code>.
        </p><h2>Linux</h2><p>Em Debian/Ubuntu (e derivados como Mint, Pop!_OS):</p><CodeBlock title="Debian / Ubuntu" code={`sudo apt update
sudo apt install openjdk-21-jdk`} /><p>Em Fedora/RHEL/Rocky:</p><CodeBlock title="Fedora / RHEL" code="sudo dnf install java-21-openjdk-devel" /><p>Em Arch/Manjaro:</p><CodeBlock title="Arch Linux" code="sudo pacman -S jdk21-openjdk" /><AlertBox type="note" title="OpenJDK vs Temurin">
          Os pacotes <code>openjdk-*</code> dos repositórios oficiais já são builds do OpenJDK com qualidade de produção. Use eles tranquilo. Se quiser exatamente o Temurin, baixe o <code>.tar.gz</code> do adoptium.net e extraia em <code>/opt/</code>.
        </AlertBox><h2>Conferindo se deu certo</h2><p>
          Abra um terminal <strong>novo</strong> (importante: o antigo não recarrega o PATH) e rode os dois comandos:
        </p><CodeBlock title="Verificar instalação" code={`java --version
javac --version`} /><p>Você deve ver algo parecido com:</p><CodeBlock code={`openjdk 21.0.4 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode)

javac 21.0.4`} /><p>
          Se um dos dois deu <em>command not found</em>, o PATH não foi atualizado. Feche e abra o terminal de novo. Se ainda assim não funcionar, configure o JAVA_HOME (próxima seção).
        </p><h2>SDKMAN! — gerenciar várias versões</h2><p>
          Trabalhando com mais de um projeto, é normal ter um cliente em Java 17 e outro em 21. Trocar de versão na mão é doloroso. Use o <strong>SDKMAN!</strong> (Linux/macOS/WSL):
        </p><CodeBlock title="Instalar e usar SDKMAN!" code={`curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

sdk list java                  # ver tudo que dá pra instalar
sdk install java 21.0.4-tem    # instala Temurin 21
sdk install java 17.0.12-tem   # instala Temurin 17
sdk use java 17.0.12-tem       # troca só nesta sessão
sdk default java 21.0.4-tem    # define o padrão`} /><p>
          Em Windows, a alternativa equivalente é o <a href="https://github.com/Schniz/fnm">scoop</a>ou o gerenciador da JetBrains. Mas se você usa WSL2, SDKMAN! resolve.
        </p><h2>Configurar JAVA_HOME quando faltar</h2><p>
          Muita ferramenta (Maven, Gradle, IDEs) procura o JDK pela variável <code>JAVA_HOME</code>. Se ela não existe, dá erro. Vamos definir.
        </p><p>
          No Linux/macOS, edite seu <code>~/.bashrc</code>, <code>~/.zshrc</code> ou similar:
        </p><CodeBlock title="JAVA_HOME no Linux/macOS" code={`# Linux (caminho do apt)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# macOS (descobre sozinho)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

export PATH=$JAVA_HOME/bin:$PATH`} /><p>No Windows (PowerShell, como administrador):</p><CodeBlock title="JAVA_HOME no Windows" code={`[System.Environment]::SetEnvironmentVariable(
  "JAVA_HOME",
  "C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.4.7-hotspot",
  "Machine"
)`} /><AlertBox type="warning" title="Uma versão por vez no PATH">
          Se você tem JDK 17 e JDK 21 instalados manualmente, o que vale é o que aparece primeiro no PATH. Em caso de conflito, <code>which java</code> (Linux/macOS) ou<code>where java</code> (Windows) mostra qual está sendo usado.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Instale o JDK 21 LTS (Temurin) seguindo o caminho do seu sistema operacional. Rode<code>java --version</code> e <code>javac --version</code> e confirme que ambos retornam a versão 21.
          </li><li>
            Descubra onde o JDK ficou instalado: rode <code>java -XshowSettings:properties</code> e procure pela linha <code>java.home</code>. Anote esse caminho — é exatamente o valor que vai no <code>JAVA_HOME</code>.
          </li><li>
            (Opcional, mas recomendado) Instale o SDKMAN! e use ele pra adicionar também a versão 17 do Temurin. Alterne entre as duas com <code>sdk use java ...</code> e confirme com<code>java --version</code> que a troca funcionou.
          </li>
        </ol>
      </PageContainer>
  );
}
