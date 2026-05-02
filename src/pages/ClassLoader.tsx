import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassLoader() {
  return (
    <PageContainer title="ClassLoader" subtitle="Como classes são carregadas — entenda pra debugar conflito de versão." difficulty="avancado" timeToRead="18 min">
        <h2>POR QUE você precisa disso</h2><p>
          Já viu uma <code>NoSuchMethodError</code> em produção, mesmo com o método claramente existindo no código? Ou um <code>ClassCastException: com.x.Foo cannot be cast to com.x.Foo</code> que parece insanidade? Ambos têm a mesma causa raiz: ClassLoaders. Entender quem carrega o quê é a diferença entre passar 4 horas chutando <code>mvn clean</code> ou achar a versão duplicada em 5 minutos.
        </p><h2>Hierarquia padrão</h2><p>
          Quando a JVM inicia, três (ou mais) ClassLoaders entram em cena, formando uma árvore:
        </p><ul>
          <li>
            <strong>Bootstrap</strong> — escrito em C++, carrega o core do JDK (<code>java.lang</code>,<code>java.util</code>...). Em Java 8 era o <code>rt.jar</code>; desde Java 9 são os módulos<code>java.base</code> etc. Sem pai.
          </li><li>
            <strong>Platform</strong> (antes "Extension") — carrega módulos da plataforma como<code>java.sql</code>, <code>java.xml</code>.
          </li><li>
            <strong>Application / System</strong> — o que você usa todo dia: lê o <code>-classpath</code>/<code>-cp</code> ou o <code>--module-path</code>. É o pai default das classes da sua app.
          </li>
        </ul><CodeBlock title="Vendo a hierarquia" code={`public class VerLoaders {
    public static void main(String[] args) {
        ClassLoader cl = VerLoaders.class.getClassLoader();
        while (cl != null) {
            System.out.println(cl);
            cl = cl.getParent();
        }
        // bootstrap aparece como null
        System.out.println("String -> " + String.class.getClassLoader());
    }
}`} /><h2>Delegação parent-first</h2><p>
          Por padrão, quando alguém pede uma classe, o ClassLoader <strong>delega pro pai primeiro</strong>. Só se o pai não achar é que ele tenta carregar. Isso garante que <code>java.lang.String</code> sempre vem do Bootstrap — você não consegue "sequestrar" classes do JDK colocando um JAR malicioso no classpath.
        </p><AlertBox type="tip" title="OSGi e servidores de aplicação invertem isso">
          <p>
            OSGi, Tomcat (em parte) e plugins de IDE usam <em>child-first</em> ou loaders isolados pra permitir que cada bundle/webapp tenha sua própria versão de uma lib sem conflitar com as outras.
          </p>
        </AlertBox><h2>Identidade de classe = nome + ClassLoader</h2><p>
          Aqui está a regra que <strong>todo dev sênior aprende na dor</strong>: duas classes com o mesmíssimo nome <code>com.foo.Bar</code>, mas carregadas por ClassLoaders diferentes, são<em>tipos diferentes</em> pra JVM. Por isso o <code>ClassCastException</code> "Foo não pode ser convertido pra Foo" — porque são mesmo classes distintas internamente.
        </p><CodeBlock title="O paradoxo do cast" code={`URL[] jars = { new File("v1/lib.jar").toURI().toURL() };
URLClassLoader a = new URLClassLoader(jars, null); // sem pai
URLClassLoader b = new URLClassLoader(jars, null);

Object x = a.loadClass("com.foo.Bar").getDeclaredConstructor().newInstance();
Class<?> bBar = b.loadClass("com.foo.Bar");

System.out.println(x.getClass() == bBar); // false!
bBar.cast(x); // ClassCastException`} /><h2>Carregar classe sob demanda</h2><CodeBlock title="Class.forName" code={`// força inicialização (executa static blocks)
Class<?> c = Class.forName("com.minha.Plugin");

// versão completa: classe, inicializa?, qual loader
Class<?> c2 = Class.forName("com.minha.Plugin", false, meuLoader);`} /><h2>URLClassLoader: plug-ins em runtime</h2><p>
          Quer carregar um JAR que nem existia quando a app subiu? <code>URLClassLoader</code> é a ferramenta clássica.
        </p><CodeBlock title="Plugin loader minimalista" code={`import java.net.*;
import java.io.File;

public class PluginLoader {
    public static void main(String[] args) throws Exception {
        URL jar = new File("plugins/saudacao.jar").toURI().toURL();
        try (URLClassLoader cl = new URLClassLoader(new URL[]{jar}, PluginLoader.class.getClassLoader())) {
            Class<?> c = cl.loadClass("plugins.SaudacaoPt");
            Runnable r = (Runnable) c.getDeclaredConstructor().newInstance();
            r.run();
        }
    }
}`} /><AlertBox type="note" title="Prefira ServiceLoader pra coisas simples">
          <p>
            Se seus plugins são "qualquer JAR no diretório que implementa a interface X", use<code>java.util.ServiceLoader</code>. É o padrão do JDK desde Java 6 e desde Java 9 funciona via módulos com <code>provides ... with ...</code>.
          </p>
        </AlertBox><h2>Pitfalls clássicos do classpath</h2><ul>
          <li>
            <strong>
              <code>NoSuchMethodError</code>
            </strong>: você compilou contra a v2 da lib, mas no classpath em runtime tem a v1 (ou vice-versa). Algum lugar declara dependência mais antiga.
          </li><li>
            <strong>
              <code>NoClassDefFoundError</code>
            </strong>: a classe existia em compile-time mas sumiu em runtime — JAR faltando, scope <code>provided</code> errado, ou <em>shading</em>que removeu acidentalmente.
          </li><li>
            <strong>Jar hell</strong>: duas versões da mesma lib no classpath. Quem ganha? Depende da ordem do classpath — frágil pra caramba.
          </li><li>
            <strong>SLF4J / log4j NoOp</strong>: classpath com 2 binders e nenhum carrega.
          </li>
        </ul><h2>Ferramentas pra investigar</h2><ul>
          <li>
            <code>jdeps app.jar</code> — mostra dependências, módulos usados, APIs internas, JDKs alvo.
          </li><li>
            <code>mvn dependency:tree</code> / <code>gradle dependencies</code> — descobre versão transitiva.
          </li><li>
            <code>java -verbose:class</code> — loga cada classe carregada e de qual JAR. Verboso mas mata a dúvida.
          </li><li>
            <code>jar tf lib.jar | grep Classe</code> — confirma se a classe está mesmo no JAR esperado.
          </li>
        </ul><CodeBlock title="Checando de onde uma classe veio" code={`var cls = SuaClasse.class;
var src = cls.getProtectionDomain().getCodeSource();
System.out.println(src != null ? src.getLocation() : "bootstrap");`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um JAR com uma classe <code>plugins.OlaMundo</code> que implementa <code>Runnable</code>. Escreva um loader que use <code>URLClassLoader</code> pra carregar e executar sem ter o JAR no classpath inicial.
          </li><li>
            Reproduza o <code>ClassCastException</code> de classes "iguais" carregando o mesmo JAR em dois <code>URLClassLoader</code> e tentando converter de um pro outro.
          </li><li>
            Em um projeto Maven seu, rode <code>mvn dependency:tree -Dverbose</code> e identifique uma dependência que esteja vindo em duas versões. Resolva com <code>
              {"<dependencyManagement>"}
            </code>.
          </li>
        </ol>
      </PageContainer>
  );
}
