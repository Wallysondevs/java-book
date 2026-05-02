import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JvmJdkJre() {
  return (
    <PageContainer title="JVM, JDK e JRE: a sopa de letrinhas" subtitle="Entenda quem é quem nesse trio antes de instalar qualquer coisa." difficulty="iniciante" timeToRead="12 min">
        <h2>POR QUE você precisa disso</h2><p>
          Quando você procura "como instalar Java" no Google, aparecem três siglas misturadas:<strong> JVM, JDK e JRE</strong>. Quase todo iniciante baixa a coisa errada e fica bravo. Pior: existem várias <em>versões</em> e várias <em>marcas</em> (Oracle, Temurin, Corretto, Zulu...). Antes de você gastar 40 minutos baixando o instalador errado, vamos entender quem faz o quê. Em 5 minutos você vai saber exatamente o que baixar e por quê.
        </p><h2>A analogia do restaurante</h2><p>Pensa num restaurante:</p><ul>
          <li>
            <strong>JVM = a cozinha.</strong> O lugar onde a comida é, de fato, cozida.
          </li><li>
            <strong>JRE = a cozinha + a despensa cheia de ingredientes prontos.</strong> Suficiente pra <em>servir pratos</em> (rodar programas), mas não pra inventar receitas.
          </li><li>
            <strong>JDK = a cozinha + despensa + os utensílios do chef.</strong> Tem tudo da JRE, mais o que você precisa pra <em>criar</em> pratos novos (compilar código).
          </li>
        </ul><p>
          Como desenvolvedor, você sempre quer o <strong>JDK</strong>. Quem quer só "rodar" Java instala JRE. E a JVM é o motor invisível que existe dentro dos dois.
        </p><h2>JVM: a Java Virtual Machine</h2><p>
          A <strong>JVM</strong> é a tal "máquina imaginária" que executa bytecode. Ela é um processo que roda no seu sistema operacional e simula uma CPU. Quando você digita<code> java MeuPrograma</code>, o que acontece é: uma JVM é iniciada, ela carrega o arquivo <code>MeuPrograma.class</code>, lê as instruções de bytecode, e executa.
        </p><p>A JVM faz muita coisa por baixo dos panos:</p><ul>
          <li>
            <strong>Carrega classes</strong> sob demanda (Class Loader).
          </li><li>
            <strong>Verifica</strong> o bytecode pra garantir que não vai quebrar a máquina.
          </li><li>
            <strong>Compila</strong> partes "quentes" pra código nativo (JIT).
          </li><li>
            <strong>Gerencia memória</strong>: aloca objetos no heap, limpa com o Garbage Collector.
          </li><li>
            <strong>Cuida das threads</strong>, sincronização, segurança.
          </li>
        </ul><AlertBox type="info" title="A JVM não roda só Java">
          Várias linguagens compilam pra bytecode da JVM e usam essa mesma máquina virtual:<strong> Kotlin</strong>, <strong>Scala</strong>, <strong>Groovy</strong>,<strong> Clojure</strong>. Tudo isso roda na JVM. Por isso a comunidade fala em "ecossistema JVM", não só "ecossistema Java".
        </AlertBox><h2>JRE: Java Runtime Environment</h2><p>
          A <strong>JRE</strong> é o pacote mínimo pra <em>rodar</em> aplicações Java. Ela contém:
        </p><ul>
          <li>
            A <strong>JVM</strong>.
          </li><li>
            As <strong>bibliotecas padrão</strong> (java.lang, java.util, java.io, java.net, e por aí vai).
          </li><li>Arquivos de configuração e recursos auxiliares.</li>
        </ul><p>
          Quem usa JRE sozinha? Usuários finais que só querem rodar programas Java prontos (um cliente bancário, um app desktop, um jogo Minecraft antigo). Você, como dev, provavelmente nunca vai instalar só a JRE.
        </p><AlertBox type="warning" title="A JRE separada quase não existe mais">
          Desde o Java 11, a Oracle parou de distribuir um instalador separado da JRE. A recomendação oficial é instalar o JDK (que já inclui tudo da JRE) ou usar a ferramenta <code>jlink</code> pra criar uma "mini JRE" customizada com só os módulos que sua app precisa. Na prática, hoje em dia: instale o JDK.
        </AlertBox><h2>JDK: Java Development Kit</h2><p>
          O <strong>JDK</strong> é o que VOCÊ quer. É o kit completo pra desenvolvedor:
        </p><ul>
          <li>Tudo que tem na JRE (JVM + libs).</li><li>
            <strong>
              <code>javac</code>
            </strong>: o compilador. Transforma <code>.java</code> em <code>.class</code>.
          </li><li>
            <strong>
              <code>java</code>
            </strong>: o lançador, que sobe a JVM e roda seu programa.
          </li><li>
            <strong>
              <code>jshell</code>
            </strong>: um REPL interativo (desde Java 9). Ótimo pra testar coisas rapidinho.
          </li><li>
            <strong>
              <code>jar</code>
            </strong>: empacota classes em arquivos <code>.jar</code>.
          </li><li>
            <strong>
              <code>jlink</code>, <code>jpackage</code>, <code>jdeps</code>
            </strong>: ferramentas modernas pra distribuir aplicações.
          </li><li>Documentação da API (Javadoc) e código-fonte das libs padrão.</li>
        </ul><CodeBlock title="Conferindo o que você tem instalado" code={`# Versão da JVM (vem em qualquer instalação Java)
$ java -version
openjdk version "21.0.2" 2024-01-16
OpenJDK Runtime Environment Temurin-21.0.2+13
OpenJDK 64-Bit Server VM Temurin-21.0.2+13

# Versão do compilador (só vem com o JDK!)
$ javac -version
javac 21.0.2

# Se 'javac' não for encontrado, você só tem JRE/JVM.
# Instale o JDK.`} /><h2>OpenJDK vs Oracle JDK: qual a diferença real?</h2><p>Aqui é onde muita gente se enrola. Vamos direto ao ponto:</p><ul>
          <li>
            <strong>OpenJDK</strong> é a implementação <em>open source</em> oficial da plataforma Java, sob licença GPL. É o "código-mãe" do qual todas as outras distribuições nascem.
          </li><li>
            <strong>Oracle JDK</strong> é uma distribuição da Oracle baseada no OpenJDK, com licença comercial. Funcionalmente, hoje em dia, é praticamente idêntica.
          </li>
        </ul><p>
          A diferença mais importante é <strong>a licença</strong>. Desde o Java 11, o Oracle JDK exige assinatura paga pra uso comercial em produção (a "Oracle No-Fee Terms and Conditions" mudou várias vezes — a regra é traiçoeira). Já o OpenJDK é livre pra qualquer uso, sempre.
        </p><AlertBox type="danger" title="Cuidado com o instalador padrão da Oracle">
          Se você for em <code>oracle.com/java</code> e baixar o JDK por lá, vai estar baixando o Oracle JDK comercial. Pra ambiente pessoal de estudo é ok; pra colocar em produção numa empresa, alguém pode levar uma multa surpresa anos depois. Use uma distribuição OpenJDK e durma tranquilo.
        </AlertBox><h2>As distribuições (vendors) que valem a pena conhecer</h2><p>
          Como o OpenJDK é open source, várias empresas pegam o código, compilam e distribuem com sua marca. Todas são funcionalmente equivalentes — escolher uma é mais sobre <em>suporte</em> e <em>preferência</em> do que sobre recursos.
        </p><h3>Eclipse Temurin (Adoptium)</h3><p>
          Mantida pela <strong>Eclipse Foundation</strong>, é hoje a escolha padrão da comunidade. Neutra, bem testada, com versões pra todos os SOs e arquiteturas. Se você não tiver uma razão pra escolher outra, escolha esta. Site:<code> adoptium.net</code>.
        </p><h3>Amazon Corretto</h3><p>
          Distribuição da <strong>AWS</strong>. Baseada no OpenJDK com patches de performance e segurança que a Amazon usa internamente. Suporte gratuito de longo prazo. Excelente pra quem trabalha em ambiente AWS.
        </p><h3>Azul Zulu</h3><p>
          Da <strong>Azul Systems</strong>. Tem versão community gratuita (Zulu) e versão enterprise paga com builds especiais (Zing, com GC otimizado pra baixa latência). Boa opção quando você precisa de suporte pago de uma empresa especialista em JVM.
        </p><h3>Microsoft Build of OpenJDK</h3><p>
          A <strong>Microsoft</strong> mantém sua própria distribuição, usada em produtos como Azure e Minecraft. Boa integração com VS Code e ambientes Windows.
        </p><h3>Oracle JDK</h3><p>
          Pode usar pra estudo. Para produção empresarial, só com licença paga ou se você atualizar antes de 1 ano (regra da NFTC). Não vale o risco de licenciamento — use uma alternativa OpenJDK.
        </p><h2>Então, o que você deve baixar AGORA?</h2><p>
          Resposta curta: <strong>Eclipse Temurin JDK 21 LTS</strong>. Ponto.
        </p><ol>
          <li>
            Vá em <code>adoptium.net</code>.
          </li><li>
            Escolha a versão <strong>21 - LTS</strong>.
          </li><li>Selecione seu SO (Windows, macOS, Linux).</li><li>
            Pacote: <strong>JDK</strong> (não JRE).
          </li><li>
            Instale. Conferência: <code>java -version</code> e <code>javac -version</code> no terminal.
          </li>
        </ol><AlertBox type="tip" title="Quem trabalha com várias versões usa SDKMAN!">
          Se você for trabalhar em projetos diferentes que exigem versões diferentes (Java 8 no projeto antigo, Java 21 no novo), use o <strong>SDKMAN!</strong> em Linux/macOS, ou <strong>scoop</strong>/<strong>jabba</strong> no Windows. Eles permitem trocar de versão com um comando, sem reinstalar nada. Vamos cobrir isso na página de configuração de ambiente.
        </AlertBox><h2>Resumo visual em texto</h2><p>Pensa em camadas, de dentro pra fora:</p><ul>
          <li>
            <strong>JVM</strong> — o motor que executa bytecode.
          </li><li>
            <strong>JRE</strong> = JVM + bibliotecas padrão. Roda programas.
          </li><li>
            <strong>JDK</strong> = JRE + ferramentas de dev (javac, jshell, jar...). Compila e roda.
          </li><li>
            <strong>Distribuição (vendor)</strong> = quem empacotou o JDK pra você (Temurin, Corretto, Zulu...).
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Abra o terminal e rode <code>java -version</code> e <code>javac -version</code>. Anote o que aparece. Se um deles não funcionar, identifique se você tem JDK ou só JRE.
          </li><li>
            Visite <code>adoptium.net</code> e simule baixar o <strong>Temurin 21 LTS</strong> pro seu sistema operacional. Não precisa instalar agora — só observe quais opções existem (JDK vs JRE, hotspot vs outras VMs).
          </li><li>
            Pesquise rapidinho: qual distribuição OpenJDK a empresa onde você quer trabalhar (ou já trabalha) usa? Tente descobrir nas vagas, README de projetos open source, ou perguntando. Você vai ver que Temurin e Corretto dominam.
          </li>
        </ol>
      </PageContainer>
  );
}
