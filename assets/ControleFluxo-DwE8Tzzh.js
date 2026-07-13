import{j as e}from"./index-BpXci30S.js";import{P as o,A as s}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(o,{title:"Controle de Fluxo: if, switch, ternário",subtitle:"Decisões em código — incluindo switch expressions modernos.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Programa sem decisão é só uma receita linear. No mundo real você precisa reagir: se o usuário tem saldo, deixa comprar; se não, mostra um aviso. Controle de fluxo é o que transforma uma sequência burra de instruções em algo que ",e.jsx("em",{children:"pensa"}),". Em Java você tem três ferramentas principais: ",e.jsx("code",{children:"if"}),", ",e.jsx("code",{children:"switch"})," e o operador ternário."]}),e.jsx("h2",{children:"if / else if / else"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"if"})," avalia uma expressão booleana. Se for ",e.jsx("code",{children:"true"}),", executa o bloco. Senão, pula. Você encadeia condições com ",e.jsx("code",{children:"else if"})," e fecha com um ",e.jsx("code",{children:"else"})," opcional pra cobrir o resto."]}),e.jsx(i,{title:"Classificando uma nota",code:`public class Nota {
    public static void main(String[] args) {
        int nota = 78;

        if (nota >= 90) {
            System.out.println("A");
        } else if (nota >= 75) {
            System.out.println("B");
        } else if (nota >= 60) {
            System.out.println("C");
        } else {
            System.out.println("Reprovado");
        }
    }
}`}),e.jsxs(s,{type:"tip",title:"Chaves sempre, mesmo com 1 linha",children:["Java permite omitir as chaves quando o corpo do ",e.jsx("code",{children:"if"})," tem só uma instrução. Não faça isso. Custa zero escrever ",e.jsx("code",{children:"{ }"})," e evita bugs sutis quando alguém adiciona uma segunda linha depois."]}),e.jsx("h2",{children:"switch tradicional (cuidado com fall-through)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"switch"})," clássico compara uma variável com vários valores. Cada caso precisa de ",e.jsx("code",{children:"break"}),", senão a execução ",e.jsx("em",{children:"vaza"})," pro próximo caso. Esse comportamento se chama ",e.jsx("strong",{children:"fall-through"})," e é fonte clássica de bug."]}),e.jsx(i,{title:"switch antigo — note os break",code:`int dia = 3;
switch (dia) {
    case 1:
        System.out.println("Segunda");
        break;
    case 2:
        System.out.println("Terça");
        break;
    case 3:
        System.out.println("Quarta");
        break;
    default:
        System.out.println("Outro dia");
}`}),e.jsx("h2",{children:"switch expression (Java 14+)"}),e.jsxs("p",{children:["Desde Java 14 o ",e.jsx("code",{children:"switch"})," pode ser uma ",e.jsx("strong",{children:"expressão"})," — devolve um valor. A sintaxe nova usa ",e.jsx("code",{children:"->"})," em vez de ",e.jsx("code",{children:":"}),", não tem fall-through, e aceita múltiplos labels separados por vírgula."]}),e.jsx(i,{title:"switch expression moderno",code:`int dia = 3;
String nome = switch (dia) {
    case 1, 2, 3, 4, 5 -> "dia útil";
    case 6, 7 -> "fim de semana";
    default -> "inválido";
};
System.out.println(nome);`}),e.jsx(s,{type:"success",title:"Use sempre que puder",children:"O switch expression é mais seguro (compilador exige cobrir todos os casos quando vira expressão), mais conciso e mais legível. Só caia no estilo antigo se mantiver código legado."}),e.jsx("h2",{children:"yield: switch com bloco"}),e.jsxs("p",{children:["Se um caso precisa de mais de uma linha, abra um bloco ",e.jsx("code",{children:"{ }"})," e use ",e.jsx("code",{children:"yield"})," pra devolver o valor:"]}),e.jsx(i,{title:"yield em switch",code:`int codigo = 2;
String mensagem = switch (codigo) {
    case 1 -> "OK";
    case 2 -> {
        String prefixo = "ERRO: ";
        yield prefixo + "código 2";
    }
    default -> "desconhecido";
};
System.out.println(mensagem);`}),e.jsx("h2",{children:"Operador ternário"}),e.jsxs("p",{children:["Pra decisões curtas que devolvem valor, use ",e.jsx("code",{children:"condicao ? valorSeTrue : valorSeFalse"}),". É o atalho do ",e.jsx("code",{children:"if/else"}),"."]}),e.jsx(i,{title:"Ternário",code:`int idade = 18;
String status = (idade >= 18) ? "maior" : "menor";
System.out.println(status);`}),e.jsxs(s,{type:"warning",title:"Não abuse",children:["Ternário aninhado vira ilegível rápido. Se precisar de mais de um nível, volte pro ",e.jsx("code",{children:"if/else"})," ou ",e.jsx("code",{children:"switch"}),"."]}),e.jsx("h2",{children:"Pattern matching no switch (Java 21)"}),e.jsxs("p",{children:["Desde Java 21 o ",e.jsx("code",{children:"switch"})," aceita padrões de tipo: você verifica o tipo e já recebe a variável tipada no mesmo passo. Tem página dedicada sobre isso, mas a ideia é:"]}),e.jsx(i,{title:"Spoiler: pattern matching",code:`Object valor = 42;
String descricao = switch (valor) {
    case Integer i -> "número inteiro: " + i;
    case String s -> "texto de " + s.length() + " chars";
    case null -> "nulo";
    default -> "outro tipo";
};
System.out.println(descricao);`}),e.jsx("h2",{children:"Evite if aninhado profundo"}),e.jsxs("p",{children:["Quando você empilha 4 ou 5 ",e.jsx("code",{children:"if"})," dentro de ",e.jsx("code",{children:"if"}),", o código fica ilegível. Duas técnicas resolvem isso: ",e.jsx("strong",{children:"early return"})," (sai cedo dos casos inválidos) e ",e.jsx("strong",{children:"guard clauses"})," (validações no topo do método)."]}),e.jsx(i,{title:"Antes — aninhado",code:`String validar(String email) {
    if (email != null) {
        if (!email.isEmpty()) {
            if (email.contains("@")) {
                return "ok";
            } else {
                return "sem arroba";
            }
        } else {
            return "vazio";
        }
    } else {
        return "nulo";
    }
}`}),e.jsx(i,{title:"Depois — guard clauses",code:`String validar(String email) {
    if (email == null) return "nulo";
    if (email.isEmpty()) return "vazio";
    if (!email.contains("@")) return "sem arroba";
    return "ok";
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um programa que recebe um ",e.jsx("code",{children:"int mes"})," (1 a 12) e imprime a estação do ano. Faça duas versões: uma com ",e.jsx("code",{children:"if/else if"})," e outra com ",e.jsx("code",{children:"switch"})," expression usando múltiplos labels."]}),e.jsxs("li",{children:["Crie um método ",e.jsx("code",{children:"classificarIMC(double imc)"})," que devolve ",e.jsx("code",{children:'"abaixo"'}),", ",e.jsx("code",{children:'"normal"'}),", ",e.jsx("code",{children:'"sobrepeso"'})," ou ",e.jsx("code",{children:'"obeso"'}),". Use guard clauses em vez de if aninhado."]}),e.jsxs("li",{children:["Reescreva esse ",e.jsx("code",{children:"if"})," usando ternário: ",e.jsx("code",{children:'if (n % 2 == 0) tipo = "par"; else tipo = "ímpar";'})]})]})]})}export{n as default};
