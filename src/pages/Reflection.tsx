import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Reflection() {
  return (
    <PageContainer title="Reflection" subtitle="Inspecionar e manipular classes em runtime — base de frameworks como Spring." difficulty="avancado" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine que você está escrevendo um framework de injeção de dependências. Você não sabe quais classes o usuário vai criar, mas mesmo assim precisa instanciá-las, encontrar campos anotados com<code>@Inject</code> e preenchê-los. Como? Sem <em>reflection</em> seria impossível.
        </p><p>
          Reflection é a capacidade do Java olhar pra si mesmo em runtime: descobrir métodos, campos, construtores, anotações e até invocar coisas sem conhecer os tipos em tempo de compilação. Spring, Hibernate, Jackson, JUnit — todos respiram reflection.
        </p><h2>
          O ponto de partida: <code>
            {"Class<?>"}
          </code>
        </h2><p>
          Tudo começa com um objeto <code>
            {"Class<?>"}
          </code>. Há três jeitos de obter:
        </p><CodeBlock title="Três formas de pegar o Class" code={`Class<String> c1 = String.class;              // literal de classe
Class<?> c2 = "ola".getClass();               // a partir da instância
Class<?> c3 = Class.forName("java.util.ArrayList"); // pelo nome (lança ClassNotFoundException)

System.out.println(c1.getName());        // java.lang.String
System.out.println(c3.getSimpleName());  // ArrayList`} /><h2>Inspecionar: Constructor, Method, Field</h2><p>
          Cada classe tem coleções de membros. <code>getDeclaredXxx()</code> traz tudo (inclusive private), enquanto <code>getXxx()</code> traz só os públicos (incluindo herdados).
        </p><CodeBlock title="Listando a estrutura" code={`import java.lang.reflect.*;

public class Pessoa {
    private String nome;
    public int idade;
    public Pessoa() {}
    public Pessoa(String nome) { this.nome = nome; }
    public String saudacao() { return "Oi, " + nome; }
    private void segredo() { System.out.println("shhh"); }

    public static void main(String[] args) {
        Class<?> c = Pessoa.class;

        for (Constructor<?> ct : c.getDeclaredConstructors())
            System.out.println("CT: " + ct);
        for (Field f : c.getDeclaredFields())
            System.out.println("FIELD: " + f.getName() + " : " + f.getType().getSimpleName());
        for (Method m : c.getDeclaredMethods())
            System.out.println("METHOD: " + m.getName());
    }
}`} /><h2>Criar instância dinamicamente</h2><CodeBlock title="newInstance moderno" code={`Class<?> clazz = Class.forName("Pessoa");
Constructor<?> ctor = clazz.getDeclaredConstructor(String.class);
Object p = ctor.newInstance("Ana");
System.out.println(p); // Pessoa@... (toString padrão)`} /><AlertBox type="warning" title="newInstance() do Class está deprecated">
          <p>
            Desde Java 9, <code>clazz.newInstance()</code> está deprecated. Use sempre<code>clazz.getDeclaredConstructor().newInstance()</code> — assim você decide qual construtor chamar e as exceções ficam claras.
          </p>
        </AlertBox><h2>Invocar método em runtime</h2><CodeBlock title="method.invoke" code={`Method m = clazz.getDeclaredMethod("saudacao");
String r = (String) m.invoke(p);  // primeiro arg é a instância (null se for static)
System.out.println(r);            // Oi, Ana`} /><h2>
          <code>setAccessible(true)</code> — burlando o <code>private</code>
        </h2><p>
          Reflection consegue ler/escrever campos privados e chamar métodos privados, contanto que você peça permissão. É o que serializadores fazem pra reconstruir um objeto sem chamar setters.
        </p><CodeBlock title="Mexendo no privado" code={`Field nome = clazz.getDeclaredField("nome");
nome.setAccessible(true);
nome.set(p, "Bruno");
System.out.println(nome.get(p)); // Bruno

Method seg = clazz.getDeclaredMethod("segredo");
seg.setAccessible(true);
seg.invoke(p); // shhh`} /><AlertBox type="danger" title="JPMS bloqueia desde Java 9">
          <p>
            O sistema de módulos pode <strong>fechar</strong> pacotes. Se um módulo não fizer<code>opens com.exemplo to seu.modulo</code>, o <code>setAccessible</code> lança<code>InaccessibleObjectException</code>. É por isso que você vê <code>--add-opens</code>em scripts de start de muitos serviços antigos.
          </p>
        </AlertBox><h2>O custo: reflection é lenta</h2><p>
          Uma chamada via <code>method.invoke</code> é tipicamente <strong>uma ordem de magnitude</strong>mais lenta que a chamada direta. A JIT consegue otimizar bastante hoje, mas nunca iguala. Por isso frameworks fazem reflection <em>uma vez</em> no startup e cacheiam tudo.
        </p><CodeBlock title="Padrão: cachear o Method" code={`// Errado: pega o Method dentro do loop
for (var x : lista) {
    Method m = x.getClass().getMethod("processar"); // caro
    m.invoke(x);
}

// Certo: pega uma vez, reusa
Method m = MinhaClasse.class.getMethod("processar");
for (var x : lista) {
    m.invoke(x); // ainda paga overhead, mas bem menor
}`} /><h2>Quando usar reflection</h2><ul>
          <li>Frameworks de DI (Spring, Guice, CDI)</li><li>Serializadores genéricos (Jackson, Gson)</li><li>
            ORMs (Hibernate mapeia <code>@Entity</code> em colunas)
          </li><li>
            Testes (JUnit descobre métodos <code>@Test</code>)
          </li><li>Plugins / scripting</li>
        </ul><p>
          <strong>Não use</strong> reflection pra "burlar" encapsulamento no código de aplicação. Se você precisa do private, normalmente o design tá pedindo refatoração.
        </p><h2>Alternativa moderna: MethodHandle e VarHandle</h2><p>
          Desde Java 7 (e turbinado em Java 9 com VarHandle), existe uma API de invocação dinâmica que é<strong>quase tão rápida quanto chamada direta</strong>, porque a JVM consegue inline.
        </p><CodeBlock title="MethodHandle — versão rápida do invoke" code={`import java.lang.invoke.*;

MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType tipo = MethodType.methodType(String.class); // retorna String, sem args
MethodHandle mh = lookup.findVirtual(Pessoa.class, "saudacao", tipo);

String r = (String) mh.invoke(p);
System.out.println(r);`} /><AlertBox type="tip" title="VarHandle pra campos">
          <p>
            <code>VarHandle</code> faz o mesmo pra <em>campos</em> e ainda dá acesso a operações atômicas (compareAndSet, getVolatile etc.) sem precisar de <code>java.util.concurrent.atomic</code>. Se você está construindo algo de altíssima performance, prefira sobre reflection clássica.
          </p>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Produto</code> com 3 campos privados. Escreva um método<code>toMap(Object o)</code> que use reflection pra retornar um<code>
              {"Map<String, Object>"}
            </code> com todos os campos e seus valores.
          </li><li>
            Implemente um mini "JUnit": dado o nome de uma classe, descubra métodos sem argumentos cujo nome comece com <code>test</code> e invoque cada um, contando sucessos e falhas.
          </li><li>
            Compare a performance: rode 1 milhão de chamadas a <code>saudacao()</code> de três jeitos — direto, <code>Method.invoke</code> e <code>MethodHandle.invoke</code>. Anote os tempos.
          </li>
        </ol>
      </PageContainer>
  );
}
