import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"Strategy",subtitle:"Trocar algoritmo em runtime — adeus if/else gigante.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsx("p",{children:"Toda vez que você escreve algo assim, está pedindo um Strategy:"}),e.jsx(o,{title:"O cheiro de código",code:`public double calcularFrete(Pedido p, String tipo) {
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
}`}),e.jsx("p",{children:"Problemas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Adicionar ",e.jsx("code",{children:"DRONE"})," = mexer nesse método (e talvez em outros 5 que têm o mesmo if)."]}),e.jsx("li",{children:'Não dá pra "passar" o cálculo como dado — está hardcoded.'}),e.jsx("li",{children:"Testar cada cálculo isoladamente é difícil."})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Strategy"}),": cada algoritmo vira uma classe (ou lambda) que implementa uma interface comum. Você passa qual usar."]}),e.jsx("h2",{children:"Estrutura clássica"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Strategy"}),": interface com o método do algoritmo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ConcreteStrategy"}),": cada implementação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Context"}),": quem usa a strategy. Recebe via construtor ou setter."]})]}),e.jsx("h2",{children:"Exemplo: cálculo de frete"}),e.jsx(o,{title:"Frete.java — interface",code:`public interface Frete {
    double calcular(Pedido p);
}`}),e.jsx(o,{title:"Implementações",code:`public class FretePac implements Frete {
    public double calcular(Pedido p) { return p.getPeso() * 5.0 + 10; }
}

public class FreteSedex implements Frete {
    public double calcular(Pedido p) { return p.getPeso() * 8.0 + 20; }
}

public class FreteRetira implements Frete {
    public double calcular(Pedido p) { return 0.0; }
}`}),e.jsx(o,{title:"Context",code:`public class CalculadoraFrete {
    private Frete estrategia;

    public CalculadoraFrete(Frete inicial) { this.estrategia = inicial; }

    public void setEstrategia(Frete f) { this.estrategia = f; }

    public double calcular(Pedido p) { return estrategia.calcular(p); }
}

// uso
CalculadoraFrete c = new CalculadoraFrete(new FretePac());
double v = c.calcular(pedido);

c.setEstrategia(new FreteSedex());   // troca em runtime
double v2 = c.calcular(pedido);`}),e.jsx("h2",{children:"Java 8+: Strategy ficou trivial com lambda"}),e.jsxs("p",{children:["Como ",e.jsx("code",{children:"Frete"})," tem 1 método, é functional interface. Você pode usar diretamente ",e.jsx("code",{children:"Function"})," / ",e.jsx("code",{children:"BiFunction"})," e nem criar interface:"]}),e.jsx(o,{code:`import java.util.function.Function;

Function<Pedido, Double> pac    = p -> p.getPeso() * 5.0 + 10;
Function<Pedido, Double> sedex  = p -> p.getPeso() * 8.0 + 20;
Function<Pedido, Double> retira = p -> 0.0;

double v = pac.apply(pedido);`}),e.jsx("p",{children:'Em código moderno, esse é o jeito mais comum. A interface explícita só vale a pena se você quer um nome de domínio ("isso é um Frete") ou múltiplos métodos.'}),e.jsx("h2",{children:"Strategy + Map = lookup table"}),e.jsx("p",{children:"Junte com a ideia de Factory e você tem um padrão que aparece o tempo todo:"}),e.jsx(o,{code:`import java.util.Map;

Map<String, Frete> tabela = Map.of(
    "PAC",    new FretePac(),
    "SEDEX",  new FreteSedex(),
    "RETIRA", new FreteRetira()
);

Frete f = tabela.get(tipoEscolhido);
if (f == null) throw new IllegalArgumentException(tipoEscolhido);
double valor = f.calcular(pedido);`}),e.jsxs("p",{children:["Adicionar ",e.jsx("code",{children:"DRONE"})," = uma linha no mapa. Zero ",e.jsx("code",{children:"if"}),". Zero método grande pra mexer."]}),e.jsx("h2",{children:"Strategy vs Template Method"}),e.jsx("p",{children:"São primos, mas resolvem coisas parecidas de jeito diferente:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Strategy"}),": composição. O algoritmo é um ",e.jsx("em",{children:"objeto"})," passado de fora. Trocável em runtime."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Template Method"}),': herança. A classe base define o esqueleto, subclasses preenchem os "buracos". Decidido em compile time.']})]}),e.jsx(o,{title:"Template Method (pra comparar)",code:`public abstract class RelatorioBase {
    public final void gerar() {
        abrirArquivo();
        escreverCabecalho();
        escreverConteudo();   // hook
        escreverRodape();
        fecharArquivo();
    }
    protected abstract void escreverConteudo();   // subclasse decide
}`}),e.jsxs("p",{children:["Regra de bolso: prefira ",e.jsx("strong",{children:"Strategy"})," (composição). Mais flexível, mais testável, menos amarrado a hierarquia."]}),e.jsx(r,{type:"tip",title:"Sintoma claro",children:'Se você ouvir "preciso decidir, em runtime, qual algoritmo aplicar", é Strategy. Se for "todos seguem o mesmo passo a passo, mas um pedacinho varia por subclasse", é Template Method.'}),e.jsx("h2",{children:"Caso real: Comparator é Strategy"}),e.jsx("p",{children:"Você usa Strategy todo dia sem perceber:"}),e.jsx(o,{code:`List<Pessoa> pessoas = ...;
pessoas.sort(Comparator.comparing(Pessoa::getNome));      // strategy 1
pessoas.sort(Comparator.comparingInt(Pessoa::getIdade));  // strategy 2`}),e.jsxs("p",{children:[e.jsx("code",{children:"Collections.sort"})," é o context. ",e.jsx("code",{children:"Comparator"})," é a interface Strategy. Cada lambda é uma ConcreteStrategy."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Refaça o cálculo de frete com ",e.jsx("code",{children:"Map"})," + lambda. Adicione",e.jsx("code",{children:" DRONE"})," sem tocar em nenhuma classe existente."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"CalculadoraDesconto"})," com strategies ",e.jsx("code",{children:"SemDesconto"}),",",e.jsx("code",{children:" DescontoPercentual"})," e ",e.jsx("code",{children:"DescontoFixo"}),". Permita trocar via setter."]}),e.jsxs("li",{children:["Pegue um ",e.jsx("code",{children:"switch"})," grande de algum projeto seu e converta para Strategy + Map. Compare legibilidade e quantidade de mudança necessária para adicionar um novo caso."]})]})]})}export{c as default};
