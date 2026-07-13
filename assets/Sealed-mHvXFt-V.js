import{j as e}from"./index-BpXci30S.js";import{P as o,A as s}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(o,{title:"Sealed Classes (Java 17+)",subtitle:"Controle exatamente quem pode estender sua classe — fecha hierarquia.",difficulty:"avancado",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine que você modela formas de pagamento no seu sistema:",e.jsx("code",{children:"Dinheiro"}),", ",e.jsx("code",{children:"Pix"}),", ",e.jsx("code",{children:"Cartao"}),". Você quer ter certeza absoluta de que NÃO existe uma quarta opção surgindo do nada num pacote qualquer da aplicação. Quer que o compilador te avise se um dia alguém adicionar",e.jsx("code",{children:"Cripto"})," e você esquecer de tratar isso no seu ",e.jsx("code",{children:"switch"}),"."]}),e.jsxs("p",{children:["Antes do Java 17, suas opções eram: deixar a classe pública e cruzar os dedos, ou marcar ",e.jsx("code",{children:"final"}),' e perder hierarquia. Sealed classes resolvem isso: você diz "essa classe pode ser estendida, mas APENAS por essas três aqui". É uma cerca: aberta pra quem você convidou, fechada pro resto.']}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsx(a,{title:"Hierarquia fechada",code:`public sealed class Pagamento
        permits Dinheiro, Pix, Cartao {
    private final double valor;
    public Pagamento(double valor) { this.valor = valor; }
    public double valor() { return valor; }
}

public final class Dinheiro extends Pagamento {
    public Dinheiro(double valor) { super(valor); }
}

public final class Pix extends Pagamento {
    private final String chave;
    public Pix(double valor, String chave) {
        super(valor);
        this.chave = chave;
    }
    public String chave() { return chave; }
}

public final class Cartao extends Pagamento {
    private final String bandeira;
    public Cartao(double valor, String bandeira) {
        super(valor);
        this.bandeira = bandeira;
    }
    public String bandeira() { return bandeira; }
}`}),e.jsxs("p",{children:["A classe ",e.jsx("code",{children:"Pagamento"})," usa ",e.jsx("code",{children:"sealed"})," e ",e.jsx("code",{children:"permits"}),"pra listar quem pode herdar dela. Qualquer outra classe que tentar",e.jsx("code",{children:"extends Pagamento"})," recebe erro de compilação. Acabou a brincadeira."]}),e.jsx("h2",{children:"A regra dos três modificadores"}),e.jsx("p",{children:"Toda subclasse permitida em um sealed precisa escolher um destes três modificadores. O compilador não te deixa esquecer:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"final"})}),": termina a hierarquia. Ninguém estende essa subclasse. É o caso mais comum."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"sealed"})}),": continua a cerca — a subclasse também restringe seus filhos com seu próprio ",e.jsx("code",{children:"permits"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"non-sealed"})}),": abre o portão. A subclasse pode ser estendida livremente por qualquer um. Use com critério."]})]}),e.jsx(a,{title:"Os três sabores",code:`public sealed class Forma permits Circulo, Poligono, Linha {}

public final class Circulo extends Forma {}                      // fim de hierarquia

public sealed class Poligono extends Forma                        // continua restringindo
        permits Triangulo, Quadrado {}

public non-sealed class Linha extends Forma {}                    // abre pra qualquer um

public final class Triangulo extends Poligono {}
public final class Quadrado extends Poligono {}`}),e.jsxs(s,{type:"tip",title:"Mesmo arquivo, ainda mais simples",children:["Se as subclasses moram no MESMO arquivo .java do sealed pai, você pode até omitir a cláusula ",e.jsx("code",{children:"permits"})," — o compilador deduz a lista. Mas escrever explícito é considerado melhor estilo, porque deixa óbvio quem participa."]}),e.jsx("h2",{children:"Sum types: o uso clássico"}),e.jsxs("p",{children:["Sealed classes são a forma do Java de expressar ",e.jsx("strong",{children:"tipos algébricos somados"}),' (sum types) — comuns em linguagens como Kotlin, Rust, Scala. A ideia é: "esse valor é UM destes N casos possíveis, e nada mais".']}),e.jsx("p",{children:"Combinando com records, fica ainda melhor:"}),e.jsx(a,{title:"Sum type com records",code:`sealed interface Resultado<T> permits Sucesso, Falha {}

record Sucesso<T>(T valor)        implements Resultado<T> {}
record Falha<T>(String mensagem) implements Resultado<T> {}`}),e.jsxs("p",{children:["Agora qualquer função no seu sistema pode retornar ",e.jsx("code",{children:"Resultado<Pedido>"}),"e quem chama sabe que vai receber EXATAMENTE um ",e.jsx("code",{children:"Sucesso"})," ou um",e.jsx("code",{children:"Falha"}),". Sem null, sem exceção surpresa, sem terceira opção."]}),e.jsx("h2",{children:"Combinando com pattern matching no switch"}),e.jsxs("p",{children:["Aqui mora a maior vantagem prática: quando você usa um sealed type num",e.jsx("code",{children:"switch"})," moderno (Java 21+), o compilador checa",e.jsx("strong",{children:"exaustividade"}),". Se você esquecer de tratar um dos casos, ele recusa compilar. É refatoração assistida: adicionou um caso novo? O compilador te leva pelo time inteiro mostrando onde você precisa atualizar."]}),e.jsx(a,{title:"Switch exaustivo",code:`public static String descrever(Pagamento p) {
    return switch (p) {
        case Dinheiro d -> "Pagamento em dinheiro de R$ " + d.valor();
        case Pix x      -> "Pix de R$ " + x.valor() + " pra chave " + x.chave();
        case Cartao c   -> "Cartao " + c.bandeira() + " no valor de R$ " + c.valor();
        // Se você esquecer um caso, ERRO de compilação.
        // Não precisa de "default"!
    };
}`}),e.jsxs(s,{type:"success",title:"Sem default = melhor design",children:["O ",e.jsx("code",{children:"default"}),' num switch costuma esconder bugs. Com sealed + switch exaustivo, você nunca tem o "e se aparecer um caso novo?" — porque o compilador não deixa esse caso passar despercebido. Refatoração segura.']}),e.jsx("h2",{children:"Por que isso importa pra APIs e bibliotecas"}),e.jsx("p",{children:"Quando você publica uma biblioteca, classes públicas viram parte do contrato com seus usuários. Se uma classe é aberta pra herança, alguém vai herdar dela — e a partir desse momento você não pode mais mudá-la sem quebrar código alheio."}),e.jsx("p",{children:'Sealed te dá controle: "essa hierarquia é minha, eu evoluo com segurança". Você pode adicionar uma nova subclasse permitida (compatível) ou refatorar livremente as existentes, sabendo que ninguém de fora estendeu o que não devia.'}),e.jsx("h2",{children:"Sealed vs enum"}),e.jsx("p",{children:'À primeira vista parecem similares — os dois descrevem "um conjunto fechado". Mas tem diferenças importantes:'}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Enum"}),": cada constante é uma ",e.jsx("em",{children:"instância única"})," e fixa. Você não cria ",e.jsx("code",{children:"Dia.SEGUNDA"})," em runtime — ela já existe."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sealed"}),": cada subclasse pode ter ",e.jsx("em",{children:"vários objetos"}),", com dados diferentes. ",e.jsx("code",{children:'new Pix(100, "x@y.com")'})," e ",e.jsx("code",{children:'new Pix(50, "z@w.com")'})," são dois Pix distintos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Enum"}),': comportamento por constante, mas todos compartilham o mesmo "shape" (mesmos campos).']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sealed"}),": cada subclasse tem seus próprios campos e construtor."]})]}),e.jsx("p",{children:"Regra prática: se cada caso é uma constante simples (estados de pedido, dias da semana), use enum. Se cada caso carrega dados próprios diferentes, use sealed."}),e.jsxs(s,{type:"warning",title:"Restrição importante de pacote/módulo",children:["As subclasses listadas em ",e.jsx("code",{children:"permits"}),' precisam estar no MESMO módulo (se você usa o sistema de módulos), ou no mesmo pacote (se está sem módulos). Não dá pra "permitir" uma classe num jar externo.']}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma sealed interface ",e.jsx("code",{children:"Notificacao"})," que permita os records",e.jsx("code",{children:"EmailMsg(String para, String assunto)"}),",",e.jsx("code",{children:"SmsMsg(String numero, String texto)"})," e",e.jsx("code",{children:"PushMsg(String dispositivo, String corpo)"}),". Escreva uma função",e.jsx("code",{children:"enviar"})," com switch exaustivo."]}),e.jsxs("li",{children:["Modele uma árvore binária com ",e.jsx("code",{children:"sealed interface Arvore permits No, Folha"}),", onde ",e.jsx("code",{children:"No(int valor, Arvore esquerda, Arvore direita)"})," e",e.jsx("code",{children:"Folha"})," é vazia. Escreva uma função ",e.jsx("code",{children:"somar(Arvore)"})," que percorre tudo."]}),e.jsxs("li",{children:["Crie uma hierarquia: ",e.jsx("code",{children:"sealed Animal permits Mamifero, Reptil"}),", onde ",e.jsx("code",{children:"Mamifero"})," também é ",e.jsx("code",{children:"sealed permits Cachorro, Gato"}),"e ",e.jsx("code",{children:"Reptil"})," é ",e.jsx("code",{children:"non-sealed"}),". Crie um ",e.jsx("code",{children:"Lagarto"}),"que herda de Reptil sem precisar de permissão. Tente criar uma classe que herde de ",e.jsx("code",{children:"Mamifero"})," sem estar no permits e veja o erro."]})]})]})}export{d as default};
