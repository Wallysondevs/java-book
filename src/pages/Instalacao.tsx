import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Instalacao() {
  return (
    <PageContainer
      title="Instalação & Setup"
      subtitle="Configure o ambiente de desenvolvimento Java com JDK, JAVA_HOME e uma IDE profissional."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Para desenvolver em Java você precisa do <strong>JDK (Java Development Kit)</strong> — que inclui
        o compilador <code>javac</code>, a JVM, e as bibliotecas padrão. Além do JDK, uma boa IDE
        acelera muito o desenvolvimento.
      </p>

      <h2>1. JDK vs JRE</h2>
      <ul>
        <li><strong>JDK (Java Development Kit):</strong> Tudo para desenvolver — compilador, depurador, JRE. Use para programar.</li>
        <li><strong>JRE (Java Runtime Environment):</strong> Apenas para executar aplicações Java, não para desenvolver.</li>
        <li><strong>JVM (Java Virtual Machine):</strong> A máquina virtual que executa o bytecode. Está dentro do JRE.</li>
      </ul>

      <AlertBox type="info" title="Qual versão usar?">
        Use sempre uma versão LTS (Long-Term Support): <strong>Java 21</strong> é o LTS mais recente (2023).
        Java 17 e Java 11 também têm suporte. Evite versões não-LTS para projetos sérios.
      </AlertBox>

      <h2>2. Instalando no Linux (Debian/Ubuntu)</h2>
      <CodeBlock
        language="bash"
        title="Instalar OpenJDK 21 no Debian/Ubuntu"
        code={`# Atualizar lista de pacotes
sudo apt update

# Instalar OpenJDK 21
sudo apt install openjdk-21-jdk

# Verificar instalação
java --version
javac --version

# Saída esperada:
# openjdk 21.0.x 2024-xx-xx
# javac 21.0.x`}
      />

      <h2>3. Instalando no Windows</h2>
      <CodeBlock
        language="bash"
        title="Instalar com winget (Windows 10/11)"
        code={`# Instalar OpenJDK 21 via winget
winget install Microsoft.OpenJDK.21

# Ou baixar o instalador diretamente de:
# https://adoptium.net/  (Eclipse Temurin — recomendado)
# https://www.oracle.com/java/technologies/downloads/

# Verificar após instalação
java --version`}
      />

      <h2>4. Configurando JAVA_HOME</h2>
      <p>
        <code>JAVA_HOME</code> é uma variável de ambiente que aponta para o diretório do JDK.
        Muitas ferramentas como Maven e Gradle precisam dela.
      </p>
      <CodeBlock
        language="bash"
        title="Configurar JAVA_HOME no Linux (arquivo ~/.bashrc)"
        code={`# Descobrir onde o Java está instalado
which java
readlink -f $(which java)
# Exemplo de saída: /usr/lib/jvm/java-21-openjdk-amd64/bin/java

# Adicionar ao ~/.bashrc ou ~/.zshrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verificar
echo $JAVA_HOME
java --version`}
      />

      <CodeBlock
        language="powershell"
        title="Configurar JAVA_HOME no Windows (PowerShell)"
        code={`# Definir JAVA_HOME (como Administrador)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot", "Machine")

# Adicionar ao PATH
$path = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
[System.Environment]::SetEnvironmentVariable("PATH", "$path;%JAVA_HOME%\bin", "Machine")

# Verificar (reabrir terminal)
$env:JAVA_HOME`}
      />

      <h2>5. Gerenciar Múltiplas Versões com SDKMAN</h2>
      <CodeBlock
        language="bash"
        title="SDKMAN — gerenciador de SDKs para Linux/macOS"
        code={`# Instalar SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Listar versões disponíveis
sdk list java

# Instalar Java 21 (Eclipse Temurin)
sdk install java 21.0.3-tem

# Instalar Java 17 ao mesmo tempo
sdk install java 17.0.11-tem

# Trocar entre versões
sdk use java 17.0.11-tem
sdk use java 21.0.3-tem

# Definir versão padrão
sdk default java 21.0.3-tem

# Ver versão atual
sdk current java`}
      />

      <h2>6. Escolha da IDE</h2>
      <ul>
        <li>
          <strong>IntelliJ IDEA Community</strong> (grátis) — A IDE mais popular e produtiva para Java.
          Autocompletion inteligente, refatoração poderosa, integração com Maven/Gradle.
          <strong> Recomendada para todos os níveis.</strong>
        </li>
        <li>
          <strong>Eclipse IDE</strong> (grátis) — IDE clássica, amplamente usada em ambientes corporativos.
        </li>
        <li>
          <strong>VS Code</strong> com Extension Pack for Java — Leve e gratuito.
          Bom para projetos menores ou se você já usa VS Code.
        </li>
        <li>
          <strong>NetBeans</strong> (grátis, Apache) — IDE completa com suporte nativo ao Maven.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Instalar IntelliJ IDEA Community no Linux (via Snap)"
        code={`# Via Snap (Ubuntu/Debian)
sudo snap install intellij-idea-community --classic

# Via JetBrains Toolbox (recomendado — gerencia todas as JetBrains IDEs)
# Baixar de: https://www.jetbrains.com/toolbox-app/`}
      />

      <AlertBox type="success" title="Pronto para programar!">
        Com JDK instalado e <code>java --version</code> funcionando, você está pronto.
        Vá para o próximo módulo e escreva seu primeiro programa Java!
      </AlertBox>
    </PageContainer>
  );
}
