import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AnnotationsCustom() {
  return (
    <PageContainer title="Anotações customizadas" subtitle="Crie suas próprias @Anotacao e processe em runtime ou compilação." difficulty="avancado" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você já usou <code>@Override</code>, <code>@Test</code>, <code>@Entity</code>,<code>@Autowired</code>. Mas alguma vez parou pra pensar como o JUnit <em>sabe</em> que aquele método é um teste? Resposta: anotação + reflection. Quando você cria uma anotação própria, está dando um superpoder ao seu código — uma forma de marcar elementos pra ferramentas, frameworks ou validações próprias agirem sobre eles.
        </p><h2>
          Anatomia: <code>@interface</code>
        </h2><p>
          Anotação se declara com <code>@interface</code> (com arroba!). É diferente de<code>interface</code> normal, embora a sintaxe pareça parecida.
        </p><CodeBlock title="Sua primeira anotação" code={`public @interface Apelido {
    String value();              // membro obrigatório
    String descricao() default ""; // com default vira opcional
}

// Uso:
@Apelido(value = "Beto", descricao = "fundador")
public class Pessoa { }`} /><p>
          Membros de anotação são declarados como métodos sem corpo. Tipos permitidos: primitivos,<code>String</code>, <code>Class</code>, enums, outras anotações e arrays desses.
        </p><h2>
          <code>@Target</code>: onde pode ser usada
        </h2><CodeBlock title="Restringindo o alvo" code={`import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD})
public @interface Cacheavel { }`} /><p>Os principais valores:</p><ul>
          <li>
            <code>TYPE</code> — classe, interface, enum, record
          </li><li>
            <code>METHOD</code> — métodos
          </li><li>
            <code>FIELD</code> — atributos
          </li><li>
            <code>PARAMETER</code> — parâmetros de método
          </li><li>
            <code>CONSTRUCTOR</code>, <code>LOCAL_VARIABLE</code>, <code>ANNOTATION_TYPE</code>, <code>PACKAGE</code>, <code>TYPE_USE</code>, <code>MODULE</code>
          </li>
        </ul><h2>
          <code>@Retention</code>: até quando ela vive
        </h2><ul>
          <li>
            <code>SOURCE</code> — só o compilador vê. Some no <code>.class</code>. Exemplo: <code>@Override</code>,<code>@SuppressWarnings</code>.
          </li><li>
            <code>CLASS</code> — fica no bytecode mas a JVM ignora em runtime. É o default. Útil pra ferramentas que leem <code>.class</code> direto.
          </li><li>
            <code>RUNTIME</code> — visível por reflection. <strong>Esse é o que você quer</strong> se for ler em runtime. Exemplo: <code>@Test</code>, <code>@Autowired</code>.
          </li>
        </ul><CodeBlock title="Anotação completa" code={`import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test {
    long timeoutMs() default 5000;
}`} /><h2>Marker annotation (sem campos)</h2><p>
          Anotação sem nenhum membro serve só pra marcar. <code>@Override</code> é o exemplo clássico.
        </p><CodeBlock code={`@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NaoSerializar { }

@NaoSerializar
public class Sessao { }`} /><h2>
          O atalho do <code>value</code>
        </h2><p>
          Se a anotação tem só um membro chamado <code>value</code>, você omite o nome no uso.
        </p><CodeBlock code={`public @interface Autor { String value(); }

@Autor("Maria")           // equivalente a @Autor(value = "Maria")
public class Modulo { }`} /><h2>Lendo em runtime</h2><CodeBlock title="Reflection + anotação" code={`import java.lang.reflect.*;

public class Runner {
    public static void main(String[] args) throws Exception {
        for (Method m : MeusTestes.class.getDeclaredMethods()) {
            Test t = m.getAnnotation(Test.class);
            if (t == null) continue;
            System.out.println("Rodando " + m.getName() + " (timeout=" + t.timeoutMs() + ")");
            m.invoke(MeusTestes.class.getDeclaredConstructor().newInstance());
        }
    }
}`} /><AlertBox type="warning" title="Sem RUNTIME, sem leitura">
          <p>
            Se esquecer <code>@Retention(RUNTIME)</code>, <code>getAnnotation</code> retorna<code>null</code> sempre. É o erro mais comum em quem está começando.
          </p>
        </AlertBox><h2>Meta-anotações úteis</h2><ul>
          <li>
            <code>@Repeatable</code> — permite usar a mesma anotação várias vezes no mesmo elemento (Java 8+). Exige uma "container annotation".
          </li><li>
            <code>@Inherited</code> — subclasses herdam a anotação aplicada a uma classe pai. Só funciona em <code>@Target(TYPE)</code>.
          </li><li>
            <code>@Documented</code> — faz a anotação aparecer no Javadoc.
          </li>
        </ul><CodeBlock title="@Repeatable na prática" code={`@Repeatable(Tags.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface Tag { String value(); }

@Retention(RetentionPolicy.RUNTIME)
public @interface Tags { Tag[] value(); }

@Tag("rapido") @Tag("integracao")
public class TesteX { }

// Leitura:
Tag[] tags = TesteX.class.getAnnotationsByType(Tag.class);`} /><h2>Processamento em compilação (APT)</h2><p>
          Algumas anotações geram código durante a compilação — é assim que Lombok cria getters/setters, MapStruct gera mappers, Dagger monta grafo de DI. Você implementa<code>javax.annotation.processing.AbstractProcessor</code>, declara em<code>META-INF/services/javax.annotation.processing.Processor</code> e o <code>javac</code> chama durante a build.
        </p><CodeBlock title="Esqueleto de um processor" code={`@SupportedAnnotationTypes("com.exemplo.GerarBuilder")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public class BuilderProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment env) {
        for (Element e : env.getElementsAnnotatedWith(GerarBuilder.class)) {
            // gera arquivo .java novo via processingEnv.getFiler()
        }
        return true;
    }
}`} /><AlertBox type="tip" title="Runtime vs compile-time">
          <p>
            Runtime processing é flexível mas custa CPU em produção. Compile-time gera código uma vez e some na build, deixando o runtime limpo. Frameworks modernos (Micronaut, Quarkus) preferem processadores pra ter startup rápido e funcionar em GraalVM Native Image.
          </p>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie <code>@JsonField(name = "...")</code> (RUNTIME, FIELD) e um método<code>toJson(Object o)</code> que use reflection pra montar um JSON respeitando o nome customizado dos campos.
          </li><li>
            Faça <code>@Validar</code> com <code>min</code> e <code>max</code> em campos<code>int</code>. Escreva <code>Validador.validar(Object o)</code> que jogue<code>IllegalArgumentException</code> se o valor estiver fora.
          </li><li>
            Implemente <code>@Repeatable</code> <code>@Role("admin")</code> e leia todas as roles de uma classe imprimindo numa linha separada por vírgula.
          </li>
        </ol>
      </PageContainer>
  );
}
