import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(s,{title:"Operadores",subtitle:"Aritméticos, lógicos, bit a bit e a divisão integer que pega gente desprevenida.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Operadores são os verbos da linguagem. Você usa eles em praticamente toda linha de código — somar, comparar, decidir. Java tem algumas armadilhas clássicas (divisão entre inteiros, precedência) que fazem iniciante ficar horas debugando coisa boba. Esta página é o guia rápido para evitar essas pegadinhas."}),e.jsx("h2",{children:"Aritméticos"}),e.jsxs("p",{children:["Os básicos são ",e.jsx("code",{children:"+"}),", ",e.jsx("code",{children:"-"}),", ",e.jsx("code",{children:"*"}),",",e.jsx("code",{children:"/"})," e ",e.jsx("code",{children:"%"})," (resto da divisão). Funcionam como você espera, com uma exceção importante na divisão."]}),e.jsx(i,{title:"Operações aritméticas",code:`public class Aritmetica {
    public static void main(String[] args) {
        int soma = 10 + 3;
        int sub = 10 - 3;
        int mult = 10 * 3;
        int div = 10 / 3;
        int resto = 10 % 3;

        System.out.println(soma);   // 13
        System.out.println(sub);    // 7
        System.out.println(mult);   // 30
        System.out.println(div);    // 3
        System.out.println(resto);  // 1
    }
}`}),e.jsx("h3",{children:"A divisão integer que pega todo mundo"}),e.jsxs("p",{children:["Quando os dois operandos da divisão são inteiros, o resultado também é inteiro — a parte fracionária some sem aviso. Para obter o decimal, pelo menos um dos lados precisa ser ",e.jsx("code",{children:"double"})," ou ",e.jsx("code",{children:"float"}),"."]}),e.jsx(i,{title:"A diferença entre 5/2 e 5/2.0",code:`int a = 5 / 2;            // 2  (truncado)
double b = 5 / 2;         // 2.0 (já truncou antes de virar double)
double c = 5 / 2.0;       // 2.5
double d = 5.0 / 2;       // 2.5
double e = (double) 5 / 2; // 2.5

System.out.println(a + " " + b + " " + c + " " + d + " " + e);`}),e.jsxs(o,{type:"warning",title:"Cast antes ou depois?",children:[e.jsx("code",{children:"(double) (5 / 2)"})," dá ",e.jsx("code",{children:"2.0"})," porque a divisão acontece primeiro como ",e.jsx("code",{children:"int"}),". Já ",e.jsx("code",{children:"(double) 5 / 2"}),"dá ",e.jsx("code",{children:"2.5"})," porque o cast acontece antes da divisão. A ordem importa."]}),e.jsx("h2",{children:"Atribuição e atribuição composta"}),e.jsxs("p",{children:["Além do ",e.jsx("code",{children:"="})," simples, Java tem versões compactas que combinam operação e atribuição: ",e.jsx("code",{children:"+="}),", ",e.jsx("code",{children:"-="}),", ",e.jsx("code",{children:"*="}),",",e.jsx("code",{children:"/="}),", ",e.jsx("code",{children:"%="})," e os bit a bit (",e.jsx("code",{children:"&="}),",",e.jsx("code",{children:"|="}),", ",e.jsx("code",{children:"^="}),", ",e.jsx("code",{children:"<<="}),",",e.jsx("code",{children:">>="}),")."]}),e.jsx(i,{title:"Atribuição composta",code:`int x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // 12
x *= 2;   // 24
x /= 4;   // 6
x %= 4;   // 2

System.out.println(x); // 2`}),e.jsxs(o,{type:"tip",title:"Cast implícito grátis",children:["Atribuição composta faz cast automático: ",e.jsx("code",{children:"byte b = 10; b += 1000;"}),"compila (mesmo sendo ",e.jsx("code",{children:"b = (byte)(b + 1000)"}),") enquanto",e.jsx("code",{children:"b = b + 1000;"})," não compila. Útil, mas pode esconder overflow."]}),e.jsx("h2",{children:"Incremento e decremento"}),e.jsxs("p",{children:[e.jsx("code",{children:"++"})," aumenta em 1, ",e.jsx("code",{children:"--"}),' diminui em 1. A posição (antes ou depois da variável) muda quando o valor "novo" entra na expressão.']}),e.jsx(i,{title:"Prefixo vs postfixo",code:`int a = 5;
int b = ++a; // pré: incrementa primeiro, usa depois → a=6, b=6
System.out.println(a + " " + b);

int c = 5;
int d = c++; // pós: usa primeiro, incrementa depois → c=6, d=5
System.out.println(c + " " + d);`}),e.jsxs(o,{type:"note",title:"Em loops, dá no mesmo",children:["Em ",e.jsx("code",{children:"for (int i = 0; i < 10; i++)"})," ou",e.jsx("code",{children:"for (int i = 0; i < 10; ++i)"})," o resultado é igual, porque o valor da expressão não está sendo usado. Use o que ler melhor."]}),e.jsx("h2",{children:"Comparação"}),e.jsxs("p",{children:["Devolvem sempre um ",e.jsx("code",{children:"boolean"}),": ",e.jsx("code",{children:"=="}),", ",e.jsx("code",{children:"!="}),",",e.jsx("code",{children:"<"}),", ",e.jsx("code",{children:">"}),", ",e.jsx("code",{children:"<="}),",",e.jsx("code",{children:">="}),"."]}),e.jsx(i,{title:"Comparações",code:`int idade = 18;
System.out.println(idade == 18); // true
System.out.println(idade != 21); // true
System.out.println(idade >= 18); // true
System.out.println(idade < 16);  // false`}),e.jsxs(o,{type:"danger",title:"Não use == para comparar Strings",children:["Para tipos primitivos, ",e.jsx("code",{children:"=="})," compara o valor. Para objetos (incluindo ",e.jsx("code",{children:"String"}),"), ",e.jsx("code",{children:"=="})," compara se é o mesmo endereço de memória. Sempre use ",e.jsx("code",{children:".equals()"})," em objetos. Mais detalhes na página de Strings."]}),e.jsx("h2",{children:"Lógicos com short-circuit"}),e.jsxs("p",{children:[e.jsx("code",{children:"&&"})," (E) e ",e.jsx("code",{children:"||"})," (OU) avaliam da esquerda para a direita e param assim que o resultado já está decidido. Esse comportamento, chamado ",e.jsx("em",{children:"short-circuit"}),", é o que permite escrever:"]}),e.jsx(i,{title:"Short-circuit salvando vidas",code:`String texto = null;

if (texto != null && texto.length() > 0) {
    System.out.println("não vazio");
}

// Se você usasse & em vez de &&, a JVM tentaria
// avaliar texto.length() mesmo com texto == null
// e jogaria NullPointerException.`}),e.jsxs("p",{children:["Os operadores ",e.jsx("code",{children:"&"})," e ",e.jsx("code",{children:"|"})," sem duplicar também existem como lógicos: avaliam os dois lados sempre. Use só quando você quer garantir efeitos colaterais (raro). Para a maioria dos casos,",e.jsx("code",{children:"&&"})," e ",e.jsx("code",{children:"||"})," são a escolha certa."]}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"!"})," nega um booleano: ",e.jsx("code",{children:"!true == false"}),"."]}),e.jsx("h2",{children:"Bit a bit (bitwise)"}),e.jsx("p",{children:"Operam nos bits individuais de inteiros. Úteis em manipulação de flags, protocolos binários e otimizações de baixo nível."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"&"})," — AND bit a bit."]}),e.jsxs("li",{children:[e.jsx("code",{children:"|"})," — OR bit a bit."]}),e.jsxs("li",{children:[e.jsx("code",{children:"^"})," — XOR bit a bit."]}),e.jsxs("li",{children:[e.jsx("code",{children:"~"})," — NOT bit a bit (inverte todos os bits)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"<<"})," — shift à esquerda (multiplica por 2)."]}),e.jsxs("li",{children:[e.jsx("code",{children:">>"})," — shift à direita preservando o sinal."]}),e.jsxs("li",{children:[e.jsx("code",{children:">>>"})," — shift à direita preenchendo com zero."]})]}),e.jsx(i,{title:"Bit a bit em ação",code:`int a = 0b1100; // 12
int b = 0b1010; // 10

System.out.println(a & b);  // 0b1000 = 8
System.out.println(a | b);  // 0b1110 = 14
System.out.println(a ^ b);  // 0b0110 = 6
System.out.println(a << 2); // 0b110000 = 48
System.out.println(a >> 1); // 0b110 = 6`}),e.jsx("h2",{children:"Operador ternário"}),e.jsxs("p",{children:["É um ",e.jsx("code",{children:"if/else"})," compactado em uma expressão:",e.jsx("code",{children:"condicao ? valorSeVerdadeiro : valorSeFalso"}),"."]}),e.jsx(i,{title:"Ternário substituindo if curto",code:`int idade = 17;
String status = (idade >= 18) ? "maior" : "menor";
System.out.println(status);`}),e.jsxs(o,{type:"tip",title:"Quando usar ternário",children:["Para escolhas simples entre dois valores. Se a expressão começar a ficar comprida ou aninhar outros ternários, prefira um ",e.jsx("code",{children:"if/else"}),"normal — a legibilidade vence sempre."]}),e.jsx("h2",{children:"Precedência: quando os parênteses te salvam"}),e.jsx("p",{children:"Java tem regras detalhadas de precedência (ordem em que os operadores são aplicados). Em vez de decorar a tabela inteira, lembre destes princípios:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Multiplicação e divisão antes de soma e subtração: ",e.jsx("code",{children:"2 + 3 * 4 == 14"}),"."]}),e.jsxs("li",{children:["Comparações antes dos lógicos: ",e.jsx("code",{children:"a > 0 && b < 10"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"&&"})," tem precedência maior que ",e.jsx("code",{children:"||"}),"."]}),e.jsx("li",{children:"Atribuição é a operação de menor precedência."})]}),e.jsx(i,{title:"Sem parênteses pode te enganar",code:`int resultado = 2 + 3 * 4;          // 14
int comParens = (2 + 3) * 4;        // 20

boolean ok = 5 > 3 && 2 < 4 || false; // true
boolean idem = ((5 > 3) && (2 < 4)) || false;`}),e.jsx(o,{type:"tip",title:"Regra de ouro",children:"Se você precisa pensar mais que 2 segundos para entender a ordem, coloque parênteses. Eles não custam nada e tornam a intenção óbvia para quem lê depois."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um programa que leia (ou tenha hardcoded) dois inteiros",e.jsx("code",{children:"a"})," e ",e.jsx("code",{children:"b"})," e imprima a divisão como inteiro, como decimal e o resto. Use cast para evitar a armadilha da divisão integer."]}),e.jsxs("li",{children:["Implemente uma verificação que aceite uma ",e.jsx("code",{children:"String"})," e só imprima seu tamanho se ela não for ",e.jsx("code",{children:"null"})," nem vazia. Use short-circuit para evitar ",e.jsx("code",{children:"NullPointerException"}),"."]}),e.jsxs("li",{children:["Usando operadores bit a bit, escreva uma função que verifique se um número inteiro é par sem usar ",e.jsx("code",{children:"%"})," (dica:",e.jsx("code",{children:"n & 1"}),")."]})]})]})}export{t as default};
