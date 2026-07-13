import{j as o}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as e}from"./CodeBlock-CuSzYSd8.js";function t(){return o.jsxs(a,{title:"Comparable & Comparator",subtitle:"Como ordenar suas próprias classes.",difficulty:"intermediario",timeToRead:"15 min",children:[o.jsx("h2",{children:"Por que você precisa disso"}),o.jsxs("p",{children:["Ordenar uma ",o.jsx("code",{children:"List<Integer>"})," é fácil — Java já sabe comparar. Mas e quando você tem uma ",o.jsx("code",{children:"List<Pessoa>"}),'? Java pergunta: "ordenar por quê? nome, idade, salário?". ',o.jsx("strong",{children:"Comparable"})," e ",o.jsx("strong",{children:"Comparator"}),' são as duas respostas para esse "por quê".']}),o.jsx("h2",{children:"A regra de ouro do compare"}),o.jsxs("p",{children:["Tanto ",o.jsx("code",{children:"compareTo"})," (de Comparable) quanto ",o.jsx("code",{children:"compare"})," (de Comparator) retornam um ",o.jsx("code",{children:"int"}),":"]}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"negativo"})," — o primeiro vem antes do segundo"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"zero"}),' — são "iguais" para fins de ordenação']}),o.jsxs("li",{children:[o.jsx("strong",{children:"positivo"})," — o primeiro vem depois"]})]}),o.jsxs(r,{type:"tip",title:"Truque seguro",children:["Para comparar números primitivos, use ",o.jsx("code",{children:"Integer.compare(a, b)"}),", ",o.jsx("code",{children:"Long.compare"}),", ",o.jsx("code",{children:"Double.compare"}),". Evite ",o.jsx("code",{children:"a - b"})," — pode estourar overflow para valores extremos."]}),o.jsx("h2",{children:"Comparable: a ordem natural"}),o.jsxs("p",{children:['Quando uma classe tem uma ordem "óbvia" (CPF para Pessoa, código para Produto, data para Evento), implemente ',o.jsx("code",{children:"Comparable<T>"})," ",o.jsx("strong",{children:"nela mesma"}),". Essa é a ordem natural — quem chamar ",o.jsx("code",{children:"Collections.sort(lista)"})," sem argumentos vai usar essa."]}),o.jsx(e,{title:"Comparable na própria classe",code:`public class Produto implements Comparable<Produto> {
    private final String codigo;
    private final double preco;

    public Produto(String codigo, double preco) {
        this.codigo = codigo;
        this.preco = preco;
    }

    public String getCodigo() { return codigo; }
    public double getPreco()  { return preco; }

    @Override
    public int compareTo(Produto outro) {
        // ordem natural: por código alfabético
        return this.codigo.compareTo(outro.codigo);
    }
}`}),o.jsx(e,{title:"Usando a ordem natural",code:`import java.util.*;

List<Produto> lista = new ArrayList<>(List.of(
    new Produto("Z9", 10.0),
    new Produto("A1", 30.0),
    new Produto("M5", 20.0)
));

Collections.sort(lista);
// ou: lista.sort(null);
// ordenado por código: A1, M5, Z9`}),o.jsx("h2",{children:"Comparator: ordens alternativas"}),o.jsxs("p",{children:["E se você quiser ordenar por ",o.jsx("em",{children:"preço"}),"? Aí vem o ",o.jsx("code",{children:"Comparator"}),' — uma classe ou lambda separada que diz "compare assim".']}),o.jsx(e,{title:"Comparator clássico",code:`Comparator<Produto> porPreco = new Comparator<>() {
    @Override
    public int compare(Produto a, Produto b) {
        return Double.compare(a.getPreco(), b.getPreco());
    }
};

lista.sort(porPreco);`}),o.jsx(e,{title:"Mesma coisa com lambda (mais limpo)",code:"lista.sort((a, b) -> Double.compare(a.getPreco(), b.getPreco()));"}),o.jsx("h2",{children:"Comparator.comparing: o jeito moderno"}),o.jsxs("p",{children:["Em quase 100% dos casos você usa as fábricas estáticas de ",o.jsx("code",{children:"Comparator"}),". Elas deixam o código declarativo e curto."]}),o.jsx(e,{title:"comparing, comparingInt, comparingDouble",code:`import java.util.Comparator;

// por código (String)
lista.sort(Comparator.comparing(Produto::getCodigo));

// por preço (double) — versão especializada evita autoboxing
lista.sort(Comparator.comparingDouble(Produto::getPreco));

// existem comparingInt e comparingLong também`}),o.jsx("h2",{children:"thenComparing: ordem secundária"}),o.jsxs("p",{children:["E se dois produtos tiverem o mesmo preço? Você quer um critério de desempate. Encadeie com ",o.jsx("code",{children:"thenComparing"}),"."]}),o.jsx(e,{title:"Critérios em cascata",code:`Comparator<Produto> ord = Comparator
    .comparingDouble(Produto::getPreco)        // primeiro pelo preço
    .thenComparing(Produto::getCodigo);        // empate? pelo código

lista.sort(ord);`}),o.jsx("h2",{children:"reversed: ordem inversa"}),o.jsx(e,{title:"Inverter qualquer comparator",code:`// preços do maior para o menor
lista.sort(Comparator.comparingDouble(Produto::getPreco).reversed());

// inverso da ordem natural
lista.sort(Comparator.<Produto>naturalOrder().reversed());
// ou: Comparator.reverseOrder()`}),o.jsx("h2",{children:"nullsFirst e nullsLast"}),o.jsxs("p",{children:["Quando o campo pode ser null, ",o.jsx("code",{children:"Comparator.comparing(...)"})," sozinho explode. Envolva com ",o.jsx("code",{children:"nullsFirst"})," ou ",o.jsx("code",{children:"nullsLast"}),":"]}),o.jsx(e,{title:"Lidando com null",code:`Comparator<Produto> seguro = Comparator.comparing(
    Produto::getCodigo,
    Comparator.nullsLast(Comparator.naturalOrder())
);`}),o.jsx("h2",{children:"Onde os comparators entram"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"Collections.sort(lista)"})," — usa Comparable."]}),o.jsxs("li",{children:[o.jsx("code",{children:"Collections.sort(lista, comp)"})," — usa Comparator."]}),o.jsxs("li",{children:[o.jsx("code",{children:"lista.sort(null)"})," ou ",o.jsx("code",{children:"lista.sort(comp)"})," — idem."]}),o.jsxs("li",{children:[o.jsx("code",{children:"Arrays.sort(arr)"})," e ",o.jsx("code",{children:"Arrays.sort(arr, comp)"}),"."]}),o.jsxs("li",{children:[o.jsx("code",{children:"TreeSet"})," e ",o.jsx("code",{children:"TreeMap"})," aceitam Comparator no construtor para definir a ordem dos elementos/chaves."]}),o.jsxs("li",{children:[o.jsx("code",{children:"Stream.sorted()"})," e ",o.jsx("code",{children:"Stream.sorted(comp)"})," em streams."]})]}),o.jsx(e,{title:"TreeSet com Comparator customizado",code:`Set<Produto> ordenadosPorPreco = new TreeSet<>(
    Comparator.comparingDouble(Produto::getPreco)
);
ordenadosPorPreco.add(new Produto("A", 30.0));
ordenadosPorPreco.add(new Produto("B", 10.0));
// itera do mais barato pro mais caro`}),o.jsx("h2",{children:"Comparable vs Comparator: quando usar cada um"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"Comparable"}),": quando existe ",o.jsx("em",{children:"uma"})," ordem óbvia para a classe e ela é parte da identidade do tipo (CPF, código, data)."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Comparator"}),": para ordens alternativas, ordens contextuais, ou quando você não controla a classe (ex: ",o.jsx("code",{children:"String"}),", ",o.jsx("code",{children:"Integer"})," — vêm prontas mas você pode ordenar por qualquer critério com Comparator)."]})]}),o.jsxs(r,{type:"warning",title:"Cuidado com TreeSet e equals",children:['TreeSet considera "iguais" os elementos cujo ',o.jsx("code",{children:"compareTo"}),"/comparator retorna 0,",o.jsx("em",{children:"mesmo que equals diga que são diferentes"}),". Se seu comparator só olha o preço, produtos com mesmo preço viram um só no Set. Isso é causa famosa de bug."]}),o.jsx("h2",{children:"🎯 Mãos à massa"}),o.jsxs("ol",{children:[o.jsxs("li",{children:["Crie a classe ",o.jsx("code",{children:"Pessoa(String nome, int idade)"}),". Implemente ",o.jsx("code",{children:"Comparable"})," ordenando por idade. Crie uma lista com 4 pessoas e ordene."]}),o.jsxs("li",{children:["Mantenha a classe acima e adicione um ",o.jsx("code",{children:"Comparator"})," alternativo que ordena por nome (use ",o.jsx("code",{children:"Comparator.comparing"}),"). Ordene a mesma lista pelos dois critérios e compare."]}),o.jsxs("li",{children:["Crie uma lista de produtos onde o desempate por preço usa o nome em ordem",o.jsx("strong",{children:" inversa"}),". Use ",o.jsx("code",{children:"thenComparing(...).reversed()"})," com cuidado — observe se o reversed afeta toda a cadeia ou só o último critério."]})]})]})}export{t as default};
