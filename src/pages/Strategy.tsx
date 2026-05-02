import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Strategy() {
  return (
    <PageContainer title="Strategy" subtitle="Trocar algoritmo em runtime — adeus if/else gigante." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>Toda vez que você escreve algo assim, está pedindo um Strategy:</p><CodeBlock title="O cheiro de código" code={`public double calcularFrete(Pedido p, String tipo) {
    if (tipo.equals("PAC")) {
        return p.getPeso() * 5.0 + 10;
    } else if (tipo.equals("SEDEX")) {
        return p.getPeso() * 8.0 + 20;
    } else if (tipo.equals("RETIRA")) {
        return 0.0;
    } else if (tipo.equals("MOTOBOY")) {
        return 25.0;
    }
    throw new IllegalArgumentException(tipo);
}`} /><p>Problemas:</p><ul>
          <li>
            Adicionar <code>DRONE</code> = mexer nesse método (e talvez em outros 5 que têm o mesmo if).
          </li><li>Não dá pra "passar" o cálculo como dado — está hardcoded.</li><li>Testar cada cálculo isoladamente é difícil.</li>
        </ul><p>
          <strong>Strategy</strong>: cada algoritmo vira uma classe (ou lambda) que implementa uma interface comum. Você passa qual usar.
        </p><h2>Estrutura clássica</h2><ul>
          <li>
            <strong>Strategy</strong>: interface com o método do algoritmo.
          </li><li>
            <strong>ConcreteStrategy</strong>: cada implementação.
          </li><li>
            <strong>Context</strong>: quem usa a strategy. Recebe via construtor ou setter.
          </li>
        </ul><h2>Exemplo: cálculo de frete</h2><CodeBlock title="Frete.java — interface" code={`public interface Frete {
    double calcular(Pedido p);
}`} /><CodeBlock title="Implementações" code={`public class FretePac implements Frete {
    public double calcular(Pedido p) { return p.getPeso() * 5.0 + 10; }
}

public class FreteSedex implements Frete {
    public double calcular(Pedido p) { return p.getPeso() * 8.0 + 20; }
}

public class FreteRetira implements Frete {
    public double calcular(Pedido p) { return 0.0; }
}`} /><CodeBlock title="Context" code={`public class CalculadoraFrete {
    private Frete estrategia;

    public CalculadoraFrete(Frete inicial) { this.estrategia = inicial; }

    public void setEstrategia(Frete f) { this.estrategia = f; }

    public double calcular(Pedido p) { return estrategia.calcular(p); }
}

// uso
CalculadoraFrete c = new CalculadoraFrete(new FretePac());
double v = c.calcular(pedido);

c.setEstrategia(new FreteSedex());   // troca em runtime
double v2 = c.calcular(pedido);`} /><h2>Java 8+: Strategy ficou trivial com lambda</h2><p>
          Como <code>Frete</code> tem 1 método, é functional interface. Você pode usar diretamente <code>Function</code> / <code>BiFunction</code> e nem criar interface:
        </p><CodeBlock code={`import java.util.function.Function;

Function<Pedido, Double> pac    = p -> p.getPeso() * 5.0 + 10;
Function<Pedido, Double> sedex  = p -> p.getPeso() * 8.0 + 20;
Function<Pedido, Double> retira = p -> 0.0;

double v = pac.apply(pedido);`} /><p>
          Em código moderno, esse é o jeito mais comum. A interface explícita só vale a pena se você quer um nome de domínio ("isso é um Frete") ou múltiplos métodos.
        </p><h2>Strategy + Map = lookup table</h2><p>Junte com a ideia de Factory e você tem um padrão que aparece o tempo todo:</p><CodeBlock code={`import java.util.Map;

Map<String, Frete> tabela = Map.of(
    "PAC",    new FretePac(),
    "SEDEX",  new FreteSedex(),
    "RETIRA", new FreteRetira()
);

Frete f = tabela.get(tipoEscolhido);
if (f == null) throw new IllegalArgumentException(tipoEscolhido);
double valor = f.calcular(pedido);`} /><p>
          Adicionar <code>DRONE</code> = uma linha no mapa. Zero <code>if</code>. Zero método grande pra mexer.
        </p><h2>Strategy vs Template Method</h2><p>São primos, mas resolvem coisas parecidas de jeito diferente:</p><ul>
          <li>
            <strong>Strategy</strong>: composição. O algoritmo é um <em>objeto</em> passado de fora. Trocável em runtime.
          </li><li>
            <strong>Template Method</strong>: herança. A classe base define o esqueleto, subclasses preenchem os "buracos". Decidido em compile time.
          </li>
        </ul><CodeBlock title="Template Method (pra comparar)" code={`public abstract class RelatorioBase {
    public final void gerar() {
        abrirArquivo();
        escreverCabecalho();
        escreverConteudo();   // hook
        escreverRodape();
        fecharArquivo();
    }
    protected abstract void escreverConteudo();   // subclasse decide
}`} /><p>
          Regra de bolso: prefira <strong>Strategy</strong> (composição). Mais flexível, mais testável, menos amarrado a hierarquia.
        </p><AlertBox type="tip" title="Sintoma claro">
          Se você ouvir "preciso decidir, em runtime, qual algoritmo aplicar", é Strategy. Se for "todos seguem o mesmo passo a passo, mas um pedacinho varia por subclasse", é Template Method.
        </AlertBox><h2>Caso real: Comparator é Strategy</h2><p>Você usa Strategy todo dia sem perceber:</p><CodeBlock code={`List<Pessoa> pessoas = ...;
pessoas.sort(Comparator.comparing(Pessoa::getNome));      // strategy 1
pessoas.sort(Comparator.comparingInt(Pessoa::getIdade));  // strategy 2`} /><p>
          <code>Collections.sort</code> é o context. <code>Comparator</code> é a interface Strategy. Cada lambda é uma ConcreteStrategy.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Refaça o cálculo de frete com <code>Map</code> + lambda. Adicione<code> DRONE</code> sem tocar em nenhuma classe existente.
          </li><li>
            Crie um <code>CalculadoraDesconto</code> com strategies <code>SemDesconto</code>,<code> DescontoPercentual</code> e <code>DescontoFixo</code>. Permita trocar via setter.
          </li><li>
            Pegue um <code>switch</code> grande de algum projeto seu e converta para Strategy + Map. Compare legibilidade e quantidade de mudança necessária para adicionar um novo caso.
          </li>
        </ol>
      </PageContainer>
  );
}
