import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer title="História do Java" subtitle="De 1991 (projeto Oak na Sun) até Oracle e o OpenJDK de hoje." difficulty="iniciante" timeToRead="10 min">
        <h2>POR QUE você precisa disso</h2><p>
          Saber a história do Java não é decoreba pra prova. É o que te ajuda a entender decisões esquisitas que a linguagem ainda carrega: por que o nome do arquivo precisa bater com o nome da classe, por que <code>System.out.println</code> existe desde sempre, por que tudo é orientado a objeto até quando incomoda. Cada uma dessas peculiaridades nasceu de um problema real que alguém estava tentando resolver lá nos anos 90. Quando você entende o contexto, o "porquê" para de ser arbitrário.
        </p><h2>1991: começa numa geladeira</h2><p>
          Em 1991, dentro da <strong>Sun Microsystems</strong>, um grupo chamado <em>Green Team</em> liderado por <strong>James Gosling</strong> recebeu uma missão estranha: criar uma linguagem pra rodar em <em>eletrodomésticos inteligentes</em> — TVs, controles, geladeiras. O alvo nunca foi computador.
        </p><p>
          O problema era que cada fabricante usava um chip diferente. Escrever em C para cada arquitetura era um inferno. A ideia genial foi: <strong>
            e se a gente compilasse para uma "máquina imaginária" e cada aparelho tivesse um interpretador dela?
          </strong>
        </p><AlertBox type="info" title="A primeira versão se chamava Oak">
          Gosling batizou a linguagem de <strong>Oak</strong> (carvalho), por causa de uma árvore que ele via da janela do escritório. Só que o nome já era marca registrada de outra empresa. Numa sessão de brainstorm regada a café, alguém sugeriu Java — uma gíria pra café — e pegou.
        </AlertBox><h2>1995: a Web salva o projeto</h2><p>
          O mercado de eletrodomésticos não decolou. O projeto Oak quase morreu. Mas em 1995 a Web começou a explodir e a Sun percebeu que a tal "máquina imaginária" resolveria EXATAMENTE o problema da Web: <em>código que precisa rodar em qualquer computador, em qualquer sistema</em>.
        </p><p>
          Java 1.0 foi lançado oficialmente em 23 de maio de 1995, junto com os famosos <strong>applets</strong> — pequenos programas Java que rodavam dentro do navegador. O slogan virou marketing: <strong>"Write Once, Run Anywhere"</strong>.
        </p><CodeBlock title="Hello World do jeito que era em 1995 (e ainda é em 2024)" code={`public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}`} /><p>
          Esse código compila no Java 21 sem mudar uma vírgula. Essa é a obsessão da plataforma com retrocompatibilidade: código antigo continua rodando.
        </p><h2>Linha do tempo das versões importantes</h2><ul>
          <li>
            <strong>1995 — Java 1.0:</strong> nasce a plataforma, junto com os applets.
          </li><li>
            <strong>1998 — Java 2 (1.2):</strong> chega o framework de coleções (List, Map, Set). Muda o jogo.
          </li><li>
            <strong>2004 — Java 5:</strong> generics, foreach, autoboxing, enums. A versão que modernizou a linguagem.
          </li><li>
            <strong>2014 — Java 8 LTS:</strong> lambdas e Streams. Java entra na era funcional.
          </li><li>
            <strong>2017 — Java 9:</strong> sistema de módulos. E muda o ciclo de releases.
          </li><li>
            <strong>2018 — Java 11 LTS:</strong> primeiro LTS do novo modelo. Adeus a applets.
          </li><li>
            <strong>2021 — Java 17 LTS:</strong> records, sealed classes, pattern matching começa a aparecer.
          </li><li>
            <strong>2023 — Java 21 LTS:</strong> virtual threads, pattern matching pra switch maduro. <em>Esta é a versão base deste livro.</em>
          </li>
        </ul><h2>2010: a Oracle compra a Sun</h2><p>
          A Sun Microsystems entrou em crise financeira nos anos 2000 e foi comprada pela <strong>Oracle</strong> em janeiro de 2010, por cerca de 7,4 bilhões de dólares. Junto vieram Java, MySQL, Solaris, VirtualBox e muito mais.
        </p><p>
          A comunidade ficou nervosa. A Oracle tem fama de ser agressiva com licenciamento. E de fato, anos depois, mudou as regras do JDK oficial — que passou a ter restrição de uso comercial em produção sem assinatura paga.
        </p><AlertBox type="tip" title="Não se preocupa, ninguém precisa pagar pra Oracle">
          Quase nenhuma empresa hoje usa o JDK da Oracle. Use <strong>OpenJDK</strong>, que é a implementação de referência open source, mantida pela própria Oracle, IBM, Red Hat, Microsoft, Amazon, Azul... todo mundo. É gratuito, livre, e idêntico em funcionalidade ao JDK comercial.
        </AlertBox><h2>OpenJDK: o Java de verdade que todo mundo usa</h2><p>
          Em 2006 a Sun começou a abrir o código do Java sob licença GPL, e em 2007 nasceu o<strong> OpenJDK</strong>. A partir do Java 11, o OpenJDK virou a fonte oficial: várias empresas pegam o código, compilam, testam e distribuem com seu próprio nome.
        </p><p>
          Os principais "sabores" (chamados <em>distribuições</em> ou <em>builds</em>) que você vai encontrar:
        </p><ul>
          <li>
            <strong>Eclipse Temurin (Adoptium):</strong> o mais popular, neutro, mantido pela Eclipse Foundation.
          </li><li>
            <strong>Amazon Corretto:</strong> da AWS, com suporte gratuito de longa duração.
          </li><li>
            <strong>Azul Zulu:</strong> da Azul Systems, opções community e enterprise.
          </li><li>
            <strong>Microsoft Build of OpenJDK:</strong> usado internamente no Azure e LinkedIn.
          </li><li>
            <strong>Oracle JDK:</strong> o oficial-comercial; gratuito pra desenvolvimento, pago pra produção.
          </li>
        </ul><h2>O modelo LTS (Long Term Support)</h2><p>
          Desde 2017 o Java segue um ciclo de release rápido: uma versão nova a cada <strong>6 meses</strong>. Mas só algumas versões recebem suporte de longo prazo — normalmente uma a cada <strong>2 anos</strong>. Essas são as <em>LTS</em>.
        </p><p>
          Em produção, empresas usam quase sempre LTS: <strong>Java 8, 11, 17 e 21</strong> são as que você vai encontrar no mercado. As versões "intermediárias" (12, 13, 14...) servem mais pra experimentar recursos novos.
        </p><AlertBox type="note" title="Qual versão estudar?">
          Use <strong>Java 21 LTS</strong>. Ela tem tudo que vale a pena aprender hoje, é suportada por anos e roda código antigo sem problema. Se a empresa onde você for trabalhar usa Java 11 ou 17, vai ser tranquilo "voltar" — quase nada que você aprender em Java 21 é incompatível.
        </AlertBox><h2>Por que Java continua dominante em 2024</h2><p>
          Java tem quase 30 anos. Por que ainda está nas listas das linguagens mais usadas do mundo? Por causa de três fortalezas:
        </p><ol>
          <li>
            <strong>Android:</strong> bilhões de celulares rodam apps escritos em Java (e Kotlin, que compila pra bytecode da JVM também).
          </li><li>
            <strong>Sistemas bancários e corporativos:</strong> 80% dos bancos do mundo têm Java no core. Migrar isso custaria bilhões — então não migram.
          </li><li>
            <strong>Big Data e backend de larga escala:</strong> Hadoop, Kafka, Elasticsearch, Spark, Cassandra... a infraestrutura moderna de dados é majoritariamente Java/JVM.
          </li>
        </ol><p>
          Some a isso a estabilidade da plataforma, ferramentas profissionais maduras (IntelliJ, Maven, Gradle) e uma comunidade gigante. Java não é "moderno e brilhante" como Rust ou Go, mas é uma escolha segura e cheia de oportunidades.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pesquise e descubra <strong>quem mantém o OpenJDK hoje</strong> — não a empresa, mas o "dono" técnico do projeto. Quem decide o que entra em cada versão?
          </li><li>
            Liste 3 produtos famosos (apps, sites, sistemas) que rodam em Java na sua experiência diária. Dica: pense em internet banking, compras online, streaming.
          </li><li>
            Compare a data de lançamento do <strong>Java 8</strong> (LTS clássico) com a do <strong>Java 21</strong>. Quantos anos separam um do outro? Por que tanta empresa ainda está em Java 8?
          </li>
        </ol>
      </PageContainer>
  );
}
