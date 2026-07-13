import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(a,{title:"Defensive Copying",subtitle:"Quando o cliente passa ou recebe objeto mutável — copie pra proteger seu invariante.",difficulty:"avancado",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Imagine que você guarda uma ",e.jsx("code",{children:"List<String>"})," que veio de fora. Você confia. Em algum momento, o cliente que te passou a lista ",e.jsx("strong",{children:"modifica ela do lado dele"}),". Surpresa: o estado interno do seu objeto mudou sem você saber. Tchau invariantes, olá bug intermitente."]}),e.jsxs("p",{children:["Defensive copying é o cinto de segurança: ",e.jsx("em",{children:"copie o que entra"})," e ",e.jsx("em",{children:"copie o que sai"})," sempre que o tipo for mutável. Como num cofre — você não guarda a chave que o cliente trouxe, faz uma cópia."]}),e.jsx("h2",{children:"O bug em ação"}),e.jsx(i,{title:"Sem defensive copy — vulnerável",code:`public final class Periodo {
    private final Date inicio;
    private final Date fim;

    public Periodo(Date inicio, Date fim) {
        if (inicio.after(fim)) throw new IllegalArgumentException();
        this.inicio = inicio; // guarda a referência
        this.fim = fim;
    }
    public Date inicio() { return inicio; } // devolve a referência
    public Date fim()    { return fim; }
}

// Cliente sabotando:
Date i = new Date();
Date f = new Date(i.getTime() + 1000);
Periodo p = new Periodo(i, f);
f.setTime(0); // p.fim agora é antes de p.inicio. Invariante quebrado!`}),e.jsx("h2",{children:"Defesa 1 — copiar no construtor"}),e.jsxs("p",{children:["Antes de validar e guardar, copie. Assim, mesmo que o cliente mexa na referência original, sua cópia segue intacta. ",e.jsx("strong",{children:"Copie antes de validar"}),", senão um atacante com TOCTOU (time-of-check / time-of-use) pode mudar entre a validação e a atribuição."]}),e.jsx(i,{code:`public Periodo(Date inicio, Date fim) {
    this.inicio = new Date(inicio.getTime()); // copia primeiro
    this.fim    = new Date(fim.getTime());
    if (this.inicio.after(this.fim))           // valida a cópia
        throw new IllegalArgumentException();
}`}),e.jsx("h2",{children:"Defesa 2 — copiar no getter"}),e.jsx("p",{children:"Não basta copiar entrada. Se o getter devolve a referência guardada, o cliente modifica e bagunça você. Devolva sempre uma cópia (ou um wrapper imutável)."}),e.jsx(i,{code:`public Date inicio() { return new Date(inicio.getTime()); }
public Date fim()    { return new Date(fim.getTime()); }`}),e.jsx("h2",{children:"Coleções: cópia ou imutável"}),e.jsxs("p",{children:["Para listas/mapas/sets, prefira ",e.jsx("code",{children:"List.copyOf"})," (Java 10+). Cópia + retorna coleção imutável. Dois pássaros, uma cajadada."]}),e.jsx(i,{code:`public final class Pedido {
    private final List<String> itens;

    public Pedido(List<String> itens) {
        this.itens = List.copyOf(itens); // cópia + imutável
    }
    public List<String> itens() {
        return itens; // já é unmodifiable, pode devolver direto
    }
}`}),e.jsx("h2",{children:"Records têm a mesma armadilha"}),e.jsxs("p",{children:["Records são imutáveis quanto à ",e.jsx("em",{children:"referência"})," dos componentes, mas se o componente for mutável, o acessor gerado ",e.jsx("strong",{children:"devolve a referência"}),". Use o construtor compacto pra blindar."]}),e.jsx(i,{code:`public record Carrinho(List<String> itens) {
    public Carrinho {
        itens = List.copyOf(itens); // congela na construção
    }
    // acessor gerado devolve a List imutável; OK.
}

// Pegadinha: se você não fizer o copyOf no construtor compacto:
List<String> mutavel = new ArrayList<>(List.of("a"));
Carrinho c = new Carrinho(mutavel);
mutavel.add("b");
System.out.println(c.itens()); // [a, b] ← o carrinho mudou`}),e.jsx("h2",{children:"Custo vs benefício"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Custo"}),": uma alocação extra por ponto de entrada/saída. Em coleções grandes pode pesar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Benefício"}),": invariante garantido, código previsível, thread-safety parcial."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quando pular"}),": classes ",e.jsx("em",{children:"package-private"})," entre código que você controla totalmente, ou tipos que já são imutáveis (",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"LocalDate"}),", ",e.jsx("code",{children:"BigDecimal"}),")."]})]}),e.jsxs(o,{type:"tip",title:"Use tipos imutáveis modernos",children:["O exemplo clássico do ",e.jsx("em",{children:"Effective Java"})," usa ",e.jsx("code",{children:"java.util.Date"})," (mutável). Em código novo, use ",e.jsx("code",{children:"LocalDate"}),", ",e.jsx("code",{children:"LocalDateTime"}),", ",e.jsx("code",{children:"Instant"})," — todos imutáveis. Aí o defensive copy se torna desnecessário pra esses campos. O conceito segue valendo pra qualquer tipo mutável (listas, arrays, objetos de domínio com setters)."]}),e.jsxs(o,{type:"warning",title:"Atenção a arrays",children:["Arrays Java são sempre mutáveis. Se você guarda ",e.jsx("code",{children:"byte[]"})," ou ",e.jsx("code",{children:"String[]"}),", faça ",e.jsx("code",{children:"arr.clone()"})," na entrada e na saída."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Reproduza o bug do ",e.jsx("code",{children:"Periodo"})," sem defensive copy. Depois aplique copia em construtor e getter e prove que o cliente não consegue mais quebrar o invariante."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"record Time(List<Jogador> jogadores)"}),". Sem cópia, mostre que o cliente consegue alterar a lista. Adicione o construtor compacto com ",e.jsx("code",{children:"List.copyOf"})," e prove que parou."]}),e.jsxs("li",{children:["Tem uma classe que guarda ",e.jsx("code",{children:"byte[]"})," (ex: senha hashada, payload binário). Adicione ",e.jsx("code",{children:".clone()"})," em construtor e getter, e teste que mudar o array original não afeta mais o objeto."]})]})]})}export{n as default};
