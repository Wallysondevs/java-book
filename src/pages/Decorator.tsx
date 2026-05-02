import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Decorator() {
  return (
    <PageContainer title="Decorator" subtitle="Adicionar comportamento sem modificar a classe — wrapping em camadas." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>Imagine modelar bebidas de uma cafeteria via herança:</p><CodeBlock code={`Cafe
CafeComLeite
CafeComLeiteComChantilly
CafeComLeiteComChantillyComCanela
CafeComCanela
CafeSemAcucar
CafeSemAcucarComLeite
CafeSemAcucarComLeiteComCanela
// ... 32 classes pra cobrir todas as combinacoes`} /><p>
          Esse é o <strong>problema da explosão combinatória de subclasses</strong>. Cada novo modificador (sabor, ingrediente, opção) duplica a árvore.
        </p><p>
          O <strong>Decorator</strong> resolve <em>compondo em runtime</em>: você tem uma bebida base e a "envolve" em decorators que adicionam comportamento.
        </p><CodeBlock code={`Bebida b = new ComCanela(new ComLeite(new CafePuro()));
b.descricao();    // "Cafe puro + leite + canela"
b.preco();        // soma os precos`} /><h2>Estrutura</h2><ul>
          <li>
            <strong>Componente</strong>: interface comum (ex: <code>Bebida</code>).
          </li><li>
            <strong>ConcreteComponent</strong>: implementação básica (ex: <code>CafePuro</code>).
          </li><li>
            <strong>Decorator</strong>: classe abstrata que <em>contém</em> outro <code>Bebida</code> e implementa a mesma interface, delegando.
          </li><li>
            <strong>ConcreteDecorator</strong>: cada acréscimo (<code>ComLeite</code>, <code>ComCanela</code>).
          </li>
        </ul><h2>Exemplo completo: bebidas</h2><CodeBlock title="Bebida.java + base" code={`public interface Bebida {
    String descricao();
    double preco();
}

public class CafePuro implements Bebida {
    public String descricao() { return "cafe"; }
    public double preco() { return 5.0; }
}

public class ChaPreto implements Bebida {
    public String descricao() { return "cha preto"; }
    public double preco() { return 4.0; }
}`} /><CodeBlock title="Decorator base + concretos" code={`public abstract class BebidaDecorator implements Bebida {
    protected final Bebida base;
    protected BebidaDecorator(Bebida b) { this.base = b; }
}

public class ComLeite extends BebidaDecorator {
    public ComLeite(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + leite"; }
    public double preco()     { return base.preco() + 2.0; }
}

public class ComCanela extends BebidaDecorator {
    public ComCanela(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + canela"; }
    public double preco()     { return base.preco() + 1.0; }
}

public class ComChantilly extends BebidaDecorator {
    public ComChantilly(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + chantilly"; }
    public double preco()     { return base.preco() + 3.5; }
}`} /><CodeBlock title="Uso" code={`Bebida pedido1 = new ComCanela(new ComLeite(new CafePuro()));
System.out.println(pedido1.descricao());   // cafe + leite + canela
System.out.println(pedido1.preco());       // 8.0

Bebida pedido2 = new ComChantilly(new ComChantilly(new ChaPreto()));
System.out.println(pedido2.descricao());   // cha preto + chantilly + chantilly
System.out.println(pedido2.preco());       // 11.0`} /><p>
          Note: <em>nenhuma nova classe</em> precisou ser criada para combinar coisas. Combinação acontece em runtime.
        </p><h2>O exemplo gigante da JDK: java.io</h2><p>Toda a hierarquia de streams é Decorator. Você empilha capacidades:</p><CodeBlock code={`BufferedReader br = new BufferedReader(           // adiciona buffer
    new InputStreamReader(                       // bytes -> chars
        new FileInputStream("dados.txt")));      // bytes do arquivo

String linha = br.readLine();`} /><ul>
          <li>
            <code>FileInputStream</code> — fonte concreta de bytes.
          </li><li>
            <code>InputStreamReader</code> — decorator que converte bytes em chars.
          </li><li>
            <code>BufferedReader</code> — decorator que adiciona buffer + <code>readLine()</code>.
          </li>
        </ul><p>
          Se você quer comprimir a saída? Adiciona um <code>GZIPOutputStream</code> em cima. Quer criptografar? <code>CipherOutputStream</code>. Encadeia.
        </p><AlertBox type="warning" title="Cuidado com profundidade">
          5 decorators aninhados ficam ilegíveis — e ninguém vai conseguir lembrar a ordem certa. Se ficar muito fundo, considere uma fábrica que monte a pilha pra você, ou repense o desenho.
        </AlertBox><h2>Versão funcional: Function.andThen</h2><p>
          Pra "decoradores" simples (transformações de dados sem estado), você não precisa de classes. <code>Function</code> tem <code>andThen</code> e <code>compose</code>:
        </p><CodeBlock code={`import java.util.function.Function;

Function<String, String> trim    = String::trim;
Function<String, String> upper   = String::toUpperCase;
Function<String, String> envolve = s -> "[" + s + "]";

Function<String, String> pipeline = trim.andThen(upper).andThen(envolve);

System.out.println(pipeline.apply("  ola  "));   // [OLA]`} /><p>
          Cada <code>andThen</code> é um decorator funcional. Java 8+ tornou isso o jeito idiomático para transformação de dados; classes Decorator ficam para casos com estado ou interface rica.
        </p><h2>Decorator vs Herança</h2><p>
          Por que não <code>class CafeComLeite extends Cafe</code>? Porque herança é decidida em compile time. Composição (Decorator) é decidida em runtime — você pode envolver na ordem que quiser, quantas vezes quiser, condicional ao input do usuário.
        </p><AlertBox type="tip" title="Decorator vs Proxy">
          Ambos envolvem outro objeto. Diferença de intenção:<ul>
            <li>
              <strong>Decorator</strong> adiciona comportamento.
            </li><li>
              <strong>Proxy</strong> controla acesso (lazy load, cache, segurança, RMI).
            </li>
          </ul>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Adicione <code>SemAcucar</code> e <code>ComMel</code> ao exemplo da bebida. Quantas classes novas? Compare com herança que precisaria de novas combinações.
          </li><li>
            Implemente um <code>TextoFormatador</code> com decorators<code> Negrito</code>, <code>Italico</code>, <code>Sublinhado</code>. Cada um envolve com tags HTML (<code>
              {"<b>...</b>"}
            </code>, etc).
          </li><li>
            Refaça o exercício 2 usando <code>Function.andThen</code>. Compare. Em qual situação você prefere classe Decorator e em qual prefere função?
          </li>
        </ol>
      </PageContainer>
  );
}
