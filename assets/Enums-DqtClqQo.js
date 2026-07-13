import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(s,{title:"Enums",subtitle:"Conjunto fechado de constantes — mais poderoso do que parece.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Você está modelando os status de um pedido: ",e.jsx("em",{children:"aguardando"}),",",e.jsx("em",{children:"pago"}),", ",e.jsx("em",{children:"enviado"}),", ",e.jsx("em",{children:"entregue"}),", ",e.jsx("em",{children:"cancelado"}),". A tentação inicial é usar ",e.jsx("code",{children:"String"})," ou ",e.jsx("code",{children:"int"}),":",e.jsx("code",{children:'status = "PAGO"'}),", ",e.jsx("code",{children:"status = 2"}),". Quase sempre, é uma decisão ruim. Strings deixam você passar ",e.jsx("code",{children:'"pgo"'})," com erro de digitação e o compilador nem pisca. Inteiros deixam você passar",e.jsx("code",{children:"42"})," sem que isso signifique nada."]}),e.jsx("p",{children:'Enum resolve esses dois problemas e ainda traz superpoderes. É um tipo que diz "eu só posso ser uma destas N opções, e o compilador vai te ajudar a garantir isso". Pense num botão de seletor de marcha do carro: P, R, N, D. Não tem como deslizar pra "L7" — fisicamente impossível. Enum é isso no código.'}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsx(a,{title:"Enum simples",code:`public enum StatusPedido {
    AGUARDANDO,
    PAGO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}

// Em outro lugar:
StatusPedido s = StatusPedido.PAGO;
if (s == StatusPedido.ENTREGUE) {
    System.out.println("Pedido finalizado!");
}`}),e.jsxs("p",{children:["Cada constante (",e.jsx("code",{children:"AGUARDANDO"}),", ",e.jsx("code",{children:"PAGO"}),"...) é uma",e.jsx("strong",{children:"instância única"})," do tipo ",e.jsx("code",{children:"StatusPedido"}),". Não dá pra criar uma sexta — se tentar atribuir ",e.jsx("code",{children:"StatusPedido.QUALQUER_OUTRO"}),", o compilador reclama imediatamente."]}),e.jsx("h2",{children:"Enums são classes de verdade"}),e.jsx("p",{children:"Aqui mora a maior surpresa de quem vem de outras linguagens: enum em Java NÃO é só uma lista de inteiros nomeados. É uma classe completa. Você pode adicionar campos, construtores e métodos. Cada constante carrega seus próprios dados."}),e.jsx(a,{title:"Enum com estado e comportamento",code:`public enum Planeta {
    MERCURIO(3.303e+23, 2.4397e6),
    TERRA   (5.976e+24, 6.37814e6),
    JUPITER (1.9e+27,   7.1492e7);

    private final double massa;
    private final double raio;

    // Construtor é IMPLICITAMENTE private — chamado uma vez por constante
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
    }

    public double gravidadeSuperficie() {
        final double G = 6.67300E-11;
        return G * massa / (raio * raio);
    }
}

// Planeta.TERRA.gravidadeSuperficie()  →  ~9.8`}),e.jsxs(o,{type:"info",title:"Por trás das cortinas",children:["Quando você escreve ",e.jsx("code",{children:"TERRA(5.976e+24, 6.37814e6)"}),", o Java executa o construtor uma vez na carga da classe e guarda essa instância pronta. As três constantes do enum acima são, literalmente, três objetos diferentes da classe",e.jsx("code",{children:"Planeta"}),"."]}),e.jsx("h2",{children:"Métodos prontos: values(), valueOf(), ordinal()"}),e.jsx("p",{children:"Todo enum ganha de graça alguns métodos super úteis:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"values()"}),": retorna um array com TODAS as constantes, na ordem declarada."]}),e.jsxs("li",{children:[e.jsx("code",{children:'valueOf("NOME")'}),": faz o caminho inverso — recebe a String e devolve a constante. Útil pra ler de banco/JSON."]}),e.jsxs("li",{children:[e.jsx("code",{children:"name()"}),": retorna o nome da constante como String."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ordinal()"}),": retorna a posição (0-based) na declaração."]})]}),e.jsx(a,{title:"Métodos automáticos",code:`for (StatusPedido s : StatusPedido.values()) {
    System.out.println(s.ordinal() + " - " + s.name());
}
// 0 - AGUARDANDO
// 1 - PAGO
// 2 - ENVIADO
// ...

StatusPedido p = StatusPedido.valueOf("PAGO");  // funciona
StatusPedido x = StatusPedido.valueOf("PGO");   // IllegalArgumentException`}),e.jsxs(o,{type:"warning",title:"Cuidado com ordinal()",children:["Nunca use ",e.jsx("code",{children:"ordinal()"})," pra persistir em banco ou enviar pra API. Se alguém reordenar as constantes (ou inserir uma no meio), todos os números mudam e seus dados antigos ficam errados. Prefira ",e.jsx("code",{children:"name()"}),", que é textual e estável."]}),e.jsx("h2",{children:"Enum em switch"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"switch"}),", você usa o nome da constante ",e.jsx("strong",{children:"sem o prefixo"}),"do enum. O compilador já sabe o tipo. Fica limpo e legível:"]}),e.jsx(a,{title:"Switch idiomático",code:`String mensagem = switch (status) {
    case AGUARDANDO -> "Estamos esperando o pagamento.";
    case PAGO       -> "Vamos preparar seu pedido.";
    case ENVIADO    -> "Já está a caminho!";
    case ENTREGUE   -> "Aproveite!";
    case CANCELADO  -> "Pedido cancelado.";
};`}),e.jsxs("p",{children:["Bônus: no switch expression do Java 21, se você cobrir TODAS as constantes do enum, não precisa de ",e.jsx("code",{children:"default"}),". E se um dia adicionarem uma constante nova, o compilador acusa e te leva direto onde precisa atualizar."]}),e.jsx("h2",{children:"Enum implementando interface"}),e.jsx("p",{children:"Como enum é uma classe, ele pode implementar interfaces normalmente. Isso é útil quando você quer tratar várias constantes (de enums diferentes ou não) sob um mesmo contrato."}),e.jsx(a,{title:"Enum + interface",code:`public interface Descritivel {
    String descricao();
}

public enum Prioridade implements Descritivel {
    BAIXA, MEDIA, ALTA;

    @Override
    public String descricao() {
        return "Prioridade " + name().toLowerCase();
    }
}`}),e.jsx("h2",{children:"Método abstract por constante"}),e.jsxs("p",{children:["E se cada constante precisar de um comportamento diferente? Você pode declarar um método ",e.jsx("code",{children:"abstract"})," no enum e implementar dentro de cada constante, usando blocos. Cada constante vira praticamente uma subclasse anônima."]}),e.jsx(a,{title:"Comportamento por constante",code:`public enum Operacao {
    SOMA {
        @Override public int aplicar(int a, int b) { return a + b; }
    },
    SUBTRACAO {
        @Override public int aplicar(int a, int b) { return a - b; }
    },
    MULTIPLICACAO {
        @Override public int aplicar(int a, int b) { return a * b; }
    };

    public abstract int aplicar(int a, int b);
}

// Operacao.SOMA.aplicar(2, 3)          →  5
// Operacao.MULTIPLICACAO.aplicar(2, 3) →  6`}),e.jsxs("p",{children:["Esse padrão é elegante porque elimina aquele ",e.jsx("code",{children:"switch"})," repetido em várias funções: o comportamento mora junto da constante."]}),e.jsx("h2",{children:"EnumSet e EnumMap: performance grátis"}),e.jsx("p",{children:"O JDK tem duas coleções especializadas pra enums e elas são absurdamente eficientes (internamente usam bitmaps/arrays, não tabelas hash). Sempre que você for guardar conjuntos ou mapas com chave de enum, prefira essas:"}),e.jsx(a,{title:"EnumSet e EnumMap",code:`import java.util.EnumSet;
import java.util.EnumMap;

EnumSet<StatusPedido> finais =
    EnumSet.of(StatusPedido.ENTREGUE, StatusPedido.CANCELADO);

if (finais.contains(pedido.status())) {
    System.out.println("Pedido já encerrado.");
}

EnumMap<StatusPedido, String> rotulos = new EnumMap<>(StatusPedido.class);
rotulos.put(StatusPedido.PAGO,     "Verde");
rotulos.put(StatusPedido.ENVIADO,  "Azul");
rotulos.put(StatusPedido.ENTREGUE, "Cinza");`}),e.jsxs(o,{type:"success",title:"Por que tão rápido?",children:["Como o conjunto de constantes do enum é fixo e conhecido em compilação,",e.jsx("code",{children:"EnumSet"})," guarda a presença de cada uma como um bit num",e.jsx("code",{children:"long"})," (até 64 valores). Operações como união, interseção e contains viram operações de CPU instantâneas."]}),e.jsx("h2",{children:"Por que enum é melhor que constantes int"}),e.jsxs("p",{children:["Antigamente, código Java estava cheio de ",e.jsx("code",{children:"public static final int"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sem segurança de tipo"}),": qualquer ",e.jsx("code",{children:"int"})," passa, mesmo um valor inválido como 999."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem nome em logs"}),": você imprime ",e.jsx("code",{children:"2"})," e ninguém sabe o que é."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem agrupamento"}),': nada impede misturar constantes de "tipos" diferentes.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem comportamento"}),": int não tem método."]})]}),e.jsx("p",{children:'Enum corrige tudo isso de uma vez. Se você se pegar criando um grupo de constantes relacionadas, pare e pergunte: "isso não deveria ser um enum?" Quase sempre a resposta é sim.'}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um enum ",e.jsx("code",{children:"DiaSemana"})," com os sete dias e um método",e.jsx("code",{children:"boolean ehFimDeSemana()"}),". Itere com ",e.jsx("code",{children:"values()"}),"imprimindo apenas os dias úteis."]}),e.jsxs("li",{children:["Modele um enum ",e.jsx("code",{children:"Moeda"})," com constantes ",e.jsx("code",{children:"REAL"}),",",e.jsx("code",{children:"DOLAR"}),", ",e.jsx("code",{children:"EURO"}),", cada uma com símbolo (R$, US$, €) e um método ",e.jsx("code",{children:"formatar(double valor)"})," que retorna a string formatada."]}),e.jsxs("li",{children:["Crie o enum ",e.jsx("code",{children:"Operacao"})," do exemplo (com método abstract por constante) e adicione ",e.jsx("code",{children:"DIVISAO"}),". Use um ",e.jsx("code",{children:"EnumMap<Operacao, String>"}),"mapeando cada operação ao seu símbolo (",e.jsx("code",{children:'"+"'}),", ",e.jsx("code",{children:'"-"'}),"...)."]})]})]})}export{t as default};
