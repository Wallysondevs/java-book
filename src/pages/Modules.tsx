import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Modules() {
  return (
    <PageContainer title="Módulos (JPMS)" subtitle="Java 9+ encapsulamento em escala maior que pacote — opcional, mas estratégico." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Por décadas, todo JAR no <code>classpath</code> tinha acesso a tudo dos outros JARs: bastava o pacote ser <code>public</code>. Isso virou um saco em projetos grandes — classes "internas" sendo importadas por todo lado, conflitos entre versões da mesma biblioteca (o famoso <em>JAR hell</em>), e a própria JDK era um monolito bilionário.
        </p><p>
          Em Java 9 a Oracle introduziu o <strong>JPMS</strong> (Java Platform Module System): uma camada acima de pacotes que permite dizer explicitamente "esse módulo depende daqueles" e "exporto SÓ esses pacotes pro mundo". A própria JDK foi quebrada em ~70 módulos.
        </p><AlertBox type="warning" title="Verdade incômoda">
          A maioria dos projetos com Maven/Gradle <strong>ainda usa só classpath</strong>. Módulos brilham pra bibliotecas e aplicações modulares de larga escala. Conheça, saiba quando vale a pena, mas não se sinta obrigado a converter tudo.
        </AlertBox><h2>O coração: module-info.java</h2><p>
          Cada módulo tem um arquivo <code>module-info.java</code> na raiz das fontes. Ele declara o nome do módulo e o que entra/sai:
        </p><CodeBlock title="src/main/java/module-info.java" code={`module com.empresa.cobranca {
    requires java.sql;            // depende do módulo java.sql da JDK
    requires com.empresa.usuarios; // depende de outro módulo nosso

    exports com.empresa.cobranca.api;       // expõe esse pacote
    exports com.empresa.cobranca.eventos;   // e esse

    // pacotes não listados em exports ficam INVISÍVEIS de fora
}`} /><h2>requires: declarando dependências</h2><ul>
          <li>
            <code>requires X</code>: usa o módulo X em compile e runtime.
          </li><li>
            <code>requires transitive X</code>: quem depende de você, automaticamente também depende de X. Útil quando seu API público devolve tipos do módulo X.
          </li><li>
            <code>requires static X</code>: dependência só de compilação (opcional em runtime). Útil pra anotações como Lombok.
          </li>
        </ul><CodeBlock code={`module com.empresa.api {
    requires transitive java.sql;  // quem usa nossa api ganha java.sql junto
    requires static lombok;        // só compile-time
}`} /><h2>exports: o que sai</h2><p>
          Sem <code>exports</code>, o pacote fica privado ao módulo — nem<code>public class</code> ajuda. Você pode também limitar pra módulos específicos:
        </p><CodeBlock code={`module com.empresa.core {
    exports com.empresa.core.api;                              // pra todo mundo
    exports com.empresa.core.internal to com.empresa.testes;   // só pros testes
}`} /><h2>opens: liberando reflection</h2><p>
          Ferramentas como Spring, Hibernate e Jackson usam reflection pra acessar campos privados. Por padrão, módulos bloqueiam isso. <code>opens</code> permite:
        </p><CodeBlock code={`module com.empresa.modelo {
    requires com.fasterxml.jackson.databind;

    exports com.empresa.modelo.dto;
    opens   com.empresa.modelo.dto to com.fasterxml.jackson.databind;
}

// Variantes:
//   open module X { ... }       — abre o módulo inteiro pra reflection
//   opens P;                    — abre P pra qualquer um
//   opens P to M1, M2;          — abre P só pra M1 e M2`} /><h2>Module path vs classpath</h2><p>Você compila e roda escolhendo um (ou os dois):</p><CodeBlock code={`# Compilar com module path
javac -d out --module-source-path src $(find src -name "*.java")

# Rodar
java --module-path out --module com.empresa.cobranca/com.empresa.cobranca.Main`} /><p>
          JARs jogados no <strong>classpath</strong> (jeito antigo) viram um <em>módulo anônimo</em>: enxergam tudo, mas códigos modulares não enxergam eles direito. Por isso conversão gradual é dolorosa.
        </p><h2>jdeps: descobrindo o que seu código usa</h2><p>Antes de modularizar, descubra dependências:</p><CodeBlock code={`jdeps --module-path libs minha-app.jar
jdeps --generate-module-info out minha-app.jar  # gera um module-info chutado`} /><h2>Por que muitos projetos NÃO modularizam</h2><ul>
          <li>
            Bibliotecas no Maven Central nem sempre são módulos "de verdade" — viram<em>automatic modules</em> (nome derivado do JAR) que não são estáveis.
          </li><li>
            Frameworks que usam reflection (Spring, JPA) exigem <code>opens</code> pra tudo, virando um <code>module-info</code> cheio de exceções.
          </li><li>
            Maven e Gradle escondem boa parte do "JAR hell" pelo gerenciamento de dependências, então o ganho na prática fica menor.
          </li><li>Projetos pequenos não sentem dor — overhead não compensa.</li>
        </ul><AlertBox type="tip" title="Quando vale o esforço">
          Bibliotecas que serão usadas por terceiros (controle do que é API pública), aplicações desktop com JLink, e SDKs grandes e estratificados.
        </AlertBox><h2>JLink: gerando uma JVM mínima só com o que você usa</h2><p>
          Talvez o maior benefício prático dos módulos: <code>jlink</code> monta uma distribuição da JVM contendo SÓ os módulos que sua aplicação precisa. Resultado: runtime de ~40 MB em vez de ~200 MB, e startup mais rápido. Excelente pra containers Docker:
        </p><CodeBlock code={`jlink \\
  --module-path "$JAVA_HOME/jmods:out" \\
  --add-modules com.empresa.cobranca \\
  --launcher cobranca=com.empresa.cobranca/com.empresa.cobranca.Main \\
  --output dist/runtime \\
  --strip-debug --no-header-files --no-man-pages --compress=2

# Roda sem precisar de JDK instalada
./dist/runtime/bin/cobranca`} /><h2>Resumo dos diretivas do module-info</h2><ul>
          <li>
            <code>requires</code> — depende de outro módulo.
          </li><li>
            <code>exports</code> — torna pacote acessível externamente.
          </li><li>
            <code>opens</code> — permite reflection no pacote.
          </li><li>
            <code>uses</code> — declara que consome um <em>service</em> via ServiceLoader.
          </li><li>
            <code>provides ... with ...</code> — fornece implementação de service.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um projeto com dois módulos: <code>com.exemplo.matematica</code> (com uma classe <code>Calc</code>) e <code>com.exemplo.app</code> (que usa <code>Calc</code>). Configure os <code>module-info.java</code> e rode pelo <code>--module-path</code>.
          </li><li>
            Tente acessar uma classe de pacote NÃO exportado a partir do outro módulo. Veja a mensagem do compilador. Depois adicione o <code>exports</code> e confirme que passa.
          </li><li>
            Use <code>jlink</code> pra gerar um runtime customizado da sua aplicação. Compare o tamanho com a JDK completa.
          </li>
        </ol>
      </PageContainer>
  );
}
