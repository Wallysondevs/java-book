import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EstruturaProjeto() {
  return (
    <PageContainer title="Estrutura de um Projeto Java" subtitle="Pacotes, src/main/java, target/ — o esqueleto padrão." difficulty="iniciante" timeToRead="12 min">
        <h2>Por que você precisa disso</h2><p>
          Um arquivo <code>Hello.java</code> solto na raiz funciona pra aprender. Mas um projeto de verdade tem dezenas (ou milhares) de classes. Sem uma <strong>estrutura</strong>, vira bagunça: nomes colidindo, imports impossíveis, build quebrado.
        </p><p>
          Java tem dois conceitos que organizam tudo: <strong>pacotes</strong> (namespaces no código) e o <strong>layout padrão Maven</strong> (organização de pastas no disco). Os dois andam juntos. Vamos entender ambos.
        </p><h2>Pacotes: o "endereço" da sua classe</h2><p>
          Um pacote é um agrupamento lógico de classes relacionadas. Pense como pasta no sistema de arquivos — só que no nível do código. Sem pacotes, duas classes chamadas<code> Cliente</code> não podem coexistir no projeto. Com pacotes, você pode ter<code> com.loja.vendas.Cliente</code> e <code>com.loja.suporte.Cliente</code> sem briga.
        </p><h3>Convenção de nomes</h3><p>
          A convenção universal é usar <strong>domínio reverso</strong> da sua empresa/projeto:
        </p><ul>
          <li>
            Empresa <em>acme.com.br</em> → pacote raiz <code>br.com.acme</code>
          </li><li>
            Projeto pessoal no GitHub <em>github.com/maria</em> → <code>io.github.maria</code>
          </li><li>
            Dentro disso, divida por funcionalidade: <code>br.com.acme.estoque.modelo</code>, <code>br.com.acme.estoque.servico</code>
          </li>
        </ul><p>Regras práticas:</p><ul>
          <li>Tudo minúsculo</li><li>Sem hífen, sem underscore (pacote válido = identificador Java válido)</li><li>
            Começa com letra (se seu domínio começa com número, prefixe com algo como <code>br.com._123empresa</code>)
          </li>
        </ul><h3>Declarando o pacote</h3><p>
          Toda classe precisa declarar seu pacote na <strong>primeira linha</strong> do arquivo (descontando comentários):
        </p><CodeBlock title="src/main/java/br/com/acme/estoque/modelo/Produto.java" code={`package br.com.acme.estoque.modelo;

public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }
}`} /><AlertBox type="warning" title="Pacote = pasta">
          A regra é absoluta: o pacote <code>br.com.acme.estoque.modelo</code> obriga o arquivo a estar na pasta <code>br/com/acme/estoque/modelo/</code>. Se mover o arquivo sem atualizar o <code>package</code> (ou vice-versa), o compilador reclama.
        </AlertBox><h2>Importando classes de outros pacotes</h2><p>
          Para usar uma classe que não está no mesmo pacote, você precisa <strong>importar</strong>:
        </p><CodeBlock title="src/main/java/br/com/acme/estoque/servico/CalculadoraDePreco.java" code={`package br.com.acme.estoque.servico;

import br.com.acme.estoque.modelo.Produto;
import java.util.List;

public class CalculadoraDePreco {
    public double total(List<Produto> produtos) {
        double soma = 0;
        for (Produto p : produtos) {
            soma += p.getPreco();
        }
        return soma;
    }
}`} /><p>Algumas regras úteis:</p><ul>
          <li>
            Classes do mesmo pacote <strong>não precisam</strong> de import
          </li><li>
            Classes do pacote <code>java.lang</code> (como <code>String</code>, <code>System</code>, <code>Integer</code>) são importadas <strong>automaticamente</strong>
          </li><li>
            <code>import java.util.*;</code> traz tudo de <code>java.util</code> de uma vez (válido, mas a convenção é importar uma classe por linha pra ficar explícito)
          </li>
        </ul><h2>O default package — NÃO use</h2><p>
          Se você criar um arquivo <code>.java</code> sem declarar <code>package</code>, ele cai no chamado <strong>default package</strong>. Funciona pra exemplos de uma linha, mas tem problemas sérios:
        </p><ul>
          <li>
            Outras classes em pacotes nomeados <strong>não conseguem importar</strong> nada do default
          </li><li>Maven, Gradle e a maioria das ferramentas reclamam</li><li>Frameworks como Spring nem enxergam suas classes</li>
        </ul><AlertBox type="danger" title="Regra de ouro">
          Toda classe de projeto real declara um <code>package</code>. O default package é só pra script descartável.
        </AlertBox><h2>Maven Standard Directory Layout</h2><p>
          Quando o projeto cresce, organizar pastas vira problema. A comunidade adotou o<strong> Maven Standard Directory Layout</strong> — um padrão que praticamente todo projeto Java moderno (Maven, Gradle, ou misto) segue.
        </p><CodeBlock title="Estrutura típica" code={`meu-projeto/
├── pom.xml                     (ou build.gradle)
├── src/
│   ├── main/
│   │   ├── java/               código fonte da aplicação
│   │   │   └── br/com/acme/...
│   │   └── resources/          arquivos não-Java (configs, SQL, imagens)
│   │       ├── application.properties
│   │       └── logback.xml
│   └── test/
│       ├── java/               código fonte dos testes
│       │   └── br/com/acme/...
│       └── resources/          recursos usados nos testes
└── target/                     gerado pelo build (NÃO commitar)
    ├── classes/                .class compilados
    ├── test-classes/
    └── meu-projeto-1.0.jar     o artefato final`} /><h3>
          Por que separar <code>main</code> e <code>test</code>?
        </h3><p>
          O código de teste tem dependências diferentes (JUnit, Mockito) e <strong>não vai pro JAR final</strong>. Manter em pastas separadas deixa essa fronteira óbvia tanto pra você quanto pra ferramenta de build.
        </p><h3>O que vai para o JAR?</h3><p>
          Quando você roda <code>mvn package</code> (ou <code>./gradlew build</code>), o build empacota num <code>.jar</code>:
        </p><ul>
          <li>
            Tudo que estava em <code>src/main/java</code>, compilado pra <code>.class</code>
          </li><li>
            Tudo que estava em <code>src/main/resources</code>, copiado como está
          </li>
        </ul><p>
          <strong>Não vai</strong> para o JAR: nada de <code>src/test</code>, nada de<code> target/</code> em si (ele é a saída, não a entrada), nada de arquivos do seu IDE (<code>.idea</code>, <code>.vscode</code>).
        </p><h2>Classpath: como o Java acha as classes</h2><p>
          Quando você roda <code>java MinhaClasse</code>, a JVM precisa saber onde procurar os<code> .class</code>. Isso é o <strong>classpath</strong>. Por padrão, é o diretório atual. Para outras pastas ou JARs, use <code>-cp</code> (ou <code>-classpath</code>):
        </p><CodeBlock title="Compilando e rodando manualmente com classpath" code={`# Compila tudo a partir de src/main/java, saída em target/classes
javac -d target/classes \\
      src/main/java/br/com/acme/estoque/modelo/Produto.java \\
      src/main/java/br/com/acme/estoque/servico/CalculadoraDePreco.java

# Roda apontando o classpath para target/classes
java -cp target/classes br.com.acme.estoque.servico.Main`} /><p>Repare em duas coisas importantes:</p><ul>
          <li>
            Você passa o <strong>nome totalmente qualificado</strong> da classe (com pacote), não o caminho do arquivo
          </li><li>
            No <code>-cp</code>, separe múltiplas entradas com <code>:</code> em Linux/macOS e <code>;</code> em Windows
          </li>
        </ul><CodeBlock title="Múltiplas entradas no classpath" code={`# Linux/macOS
java -cp target/classes:libs/gson-2.10.jar br.com.acme.Main

# Windows
java -cp target/classes;libs/gson-2.10.jar br.com.acme.Main`} /><AlertBox type="tip" title="Na prática você quase nunca digita -cp na mão">
          Maven, Gradle e as IDEs montam o classpath automaticamente lendo o <code>pom.xml</code>ou <code>build.gradle</code>. Mas saber que ele existe te salva quando algo dá errado.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie a estrutura <code>src/main/java/br/com/seunome/jogo/</code> com duas classes:<code> Personagem</code> (com nome e vida) e <code>Main</code> que cria um personagem e imprime o nome. Compile com <code>javac -d target/classes ...</code> e rode com<code> java -cp target/classes br.com.seunome.jogo.Main</code>.
          </li><li>
            Tente mover <code>Personagem.java</code> para uma pasta diferente do que diz o<code> package</code> (por exemplo, jogue em <code>src/main/java/</code> direto). Recompile e leia atentamente o erro do <code>javac</code>. Volte o arquivo pro lugar certo.
          </li><li>
            Crie uma terceira classe <code>Inventario</code> num pacote diferente (<code>br.com.seunome.jogo.itens</code>). Faça <code>Personagem</code> usar<code> Inventario</code> — você vai precisar do <code>import</code>. Confirme que tudo compila e que o programa roda.
          </li>
        </ol>
      </PageContainer>
  );
}
