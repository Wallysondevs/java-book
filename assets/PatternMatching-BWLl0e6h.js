import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Pattern Matching e switch expressions",subtitle:"Switch deixou de ser cláusula imperativa — virou expressão poderosa (Java 21).",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["O Java passou décadas com um ",e.jsx("code",{children:"switch"})," herdado do C: cheio de",e.jsx("code",{children:"break"}),", fall-through traiçoeiro, sem retornar valor. E pra checar tipo a gente fazia ",e.jsx("code",{children:"instanceof"})," + cast feio. Tudo isso melhorou drasticamente nas versões recentes — e em Java 21 ficou pronto pra produção."]}),e.jsx("h2",{children:"Pattern matching para instanceof (Java 16+)"}),e.jsx("p",{children:"Antes você fazia o ritual chato:"}),e.jsx(o,{title:"Velho jeito",code:`if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}`}),e.jsxs("p",{children:["Agora declara a variável dentro do ",e.jsx("code",{children:"instanceof"})," e usa direto:"]}),e.jsx(o,{title:"Novo jeito",code:`if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}

// Funciona até com negação:
if (!(obj instanceof String s)) return;
System.out.println(s.length()); // s está disponível aqui`}),e.jsxs(a,{type:"tip",title:"Escopo é esperto",children:["O compilador sabe onde a variável é seguramente do tipo testado e onde não é. Você não precisa declarar nada. É chamado ",e.jsx("em",{children:"flow scoping"}),"."]}),e.jsx("h2",{children:"switch como expressão (Java 14+)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"switch"})," agora pode ",e.jsx("strong",{children:"retornar valor"})," com a sintaxe de seta (",e.jsx("code",{children:"->"}),"), sem fall-through e sem ",e.jsx("code",{children:"break"}),":"]}),e.jsx(o,{code:`enum Dia { SEG, TER, QUA, QUI, SEX, SAB, DOM }

String tipo = switch (dia) {
    case SEG, TER, QUA, QUI, SEX -> "útil";
    case SAB, DOM -> "fim de semana";
};`}),e.jsxs("p",{children:["Precisa de bloco com várias linhas? Use chaves e ",e.jsx("code",{children:"yield"}),' pra "retornar":']}),e.jsx(o,{code:`int valor = switch (codigo) {
    case "A" -> 1;
    case "B" -> 2;
    default -> {
        log.warn("código desconhecido: {}", codigo);
        yield -1;
    }
};`}),e.jsx("h2",{children:"Type patterns no switch (Java 21)"}),e.jsxs("p",{children:["Combine switch expression + pattern matching e tchau cadeia de",e.jsx("code",{children:"if/instanceof"}),":"]}),e.jsx(o,{title:"Despachando por tipo",code:`String descricao = switch (obj) {
    case Integer i -> "inteiro: " + i;
    case Long l    -> "long: " + l;
    case String s  -> "string de " + s.length() + " chars";
    case null      -> "veio nulo!";
    default        -> "outro tipo: " + obj.getClass().getSimpleName();
};`}),e.jsxs(a,{type:"info",title:"case null",children:["Antes do Java 21, passar ",e.jsx("code",{children:"null"})," num switch dava NullPointerException. Agora você pode tratar como case próprio — opcional, mas seguro."]}),e.jsx("h2",{children:"Record patterns (Java 21)"}),e.jsxs("p",{children:["Se você tem um ",e.jsx("code",{children:"record"}),", dá pra desestruturar dentro do case. Cabe o cérebro inteiro num exemplo:"]}),e.jsx(o,{code:`record Ponto(int x, int y) {}
record Circulo(Ponto centro, double raio) {}
record Retangulo(Ponto inicio, Ponto fim) {}

sealed interface Forma permits Circulo, Retangulo {}

double area(Forma f) {
    return switch (f) {
        case Circulo(Ponto c, double r)        -> Math.PI * r * r;
        case Retangulo(Ponto a, Ponto b)       ->
            Math.abs((b.x() - a.x()) * (b.y() - a.y()));
    };
}`}),e.jsxs("p",{children:["Repare: o compilador sabe que ",e.jsx("code",{children:"Forma"})," é ",e.jsx("code",{children:"sealed"})," com só duas implementações. Não precisa ",e.jsx("code",{children:"default"})," — ",e.jsx("strong",{children:"exaustividade"}),"garantida."]}),e.jsx("h2",{children:"Record patterns aninhados"}),e.jsx(o,{code:`// Desempacota Circulo e o Ponto interno de uma vez
String descricao = switch (forma) {
    case Circulo(Ponto(int cx, int cy), double r) ->
        "círculo em (" + cx + "," + cy + ") raio " + r;
    case Retangulo(Ponto(int x1, int y1), Ponto(int x2, int y2)) ->
        "retângulo de (" + x1 + "," + y1 + ") até (" + x2 + "," + y2 + ")";
};`}),e.jsx("h2",{children:"Guarded patterns: case com condição extra"}),e.jsxs("p",{children:["A palavra-chave ",e.jsx("code",{children:"when"})," adiciona condição ao case:"]}),e.jsx(o,{code:`String classificar(Object obj) {
    return switch (obj) {
        case Integer i when i < 0   -> "negativo";
        case Integer i when i == 0  -> "zero";
        case Integer i              -> "positivo: " + i;
        case String s when s.isBlank() -> "string vazia";
        case String s               -> "string: " + s;
        case null, default          -> "outro";
    };
}`}),e.jsxs(a,{type:"warning",title:"Ordem importa",children:["Os ",e.jsx("code",{children:"when"})," são checados de cima pra baixo. Coloque os casos mais específicos antes dos genéricos."]}),e.jsx("h2",{children:"Exaustividade com sealed"}),e.jsxs("p",{children:["Quando o tipo do switch é ",e.jsx("code",{children:"sealed"}),", o compilador ",e.jsx("strong",{children:"exige"}),"que você cubra todas as variantes — ou usa ",e.jsx("code",{children:"default"}),". Se amanhã alguém adicionar uma nova subclasse, o compilador grita em todos os switches afetados. Isso é ouro pra refactor seguro."]}),e.jsx(o,{code:`sealed interface Pagamento permits Pix, Cartao, Boleto {}
record Pix(String chave) implements Pagamento {}
record Cartao(String numero, int parcelas) implements Pagamento {}
record Boleto(String linhaDigitavel) implements Pagamento {}

double taxa(Pagamento p) {
    return switch (p) {
        case Pix x        -> 0.0;
        case Cartao c     -> c.parcelas() > 1 ? 2.99 : 0.99;
        case Boleto b     -> 1.50;
    }; // sem default — compilador feliz
}`}),e.jsx("h2",{children:"switch tradicional ainda funciona"}),e.jsxs("p",{children:["A sintaxe antiga (com ",e.jsx("code",{children:":"}),", ",e.jsx("code",{children:"break"}),", fall-through) continua válida pra compatibilidade. Mas pra código novo: prefira sempre a forma com",e.jsx("code",{children:"->"}),". É mais segura e mais expressiva."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Refatore um trecho seu com ",e.jsx("code",{children:"if/else if"})," de ",e.jsx("code",{children:"instanceof"}),"+ cast pra usar pattern matching."]}),e.jsxs("li",{children:["Crie uma ",e.jsx("code",{children:"sealed interface Notificacao"})," com records",e.jsx("code",{children:"Email"}),", ",e.jsx("code",{children:"SMS"})," e ",e.jsx("code",{children:"Push"}),". Escreva uma função",e.jsx("code",{children:"enviar(Notificacao n)"})," usando switch expression — sem default."]}),e.jsxs("li",{children:["Faça uma função ",e.jsx("code",{children:"tipoNumero(Object o)"}),' que classifique entre "inteiro positivo", "inteiro negativo", "decimal", "outro" usando guards (',e.jsx("code",{children:"when"}),")."]})]})]})}export{n as default};
