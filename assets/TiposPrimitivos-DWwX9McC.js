import{j as e}from"./index-BpXci30S.js";import{P as s,A as i}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function l(){return e.jsxs(s,{title:"Tipos Primitivos",subtitle:"byte, short, int, long, float, double, char, boolean — tamanhos e armadilhas.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Em Java, todo valor numérico ocupa um espaço fixo na memória. Se você escolher o tipo errado, dois problemas aparecem: ou o valor estoura silenciosamente (overflow) e seu programa entrega um resultado absurdo, ou você desperdiça memória multiplicada por milhões de objetos. Conhecer os 8 tipos primitivos é a base para escrever código que não trava no meio da madrugada."}),e.jsx("h2",{children:"Os 8 tipos primitivos"}),e.jsxs("p",{children:["Java tem exatamente 8 tipos primitivos. Eles são escritos em letra minúscula (diferente de classes como ",e.jsx("code",{children:"String"})," ou ",e.jsx("code",{children:"Integer"}),") e guardam o valor diretamente, não uma referência. A versão base aqui é o Java 21 LTS, mas esses tipos estão estáveis desde a versão 1.0."]}),e.jsx("h3",{children:"Inteiros"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"byte"})," — 8 bits, faixa de -128 a 127."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"short"})," — 16 bits, faixa de -32.768 a 32.767."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"int"})," — 32 bits, faixa de aproximadamente -2,1 bilhões a 2,1 bilhões. É o padrão para a maioria dos casos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"long"})," — 64 bits, faixa absurdamente grande (cerca de 9 quintilhões positivos ou negativos)."]})]}),e.jsx("h3",{children:"Ponto flutuante"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"float"})," — 32 bits, ~7 dígitos de precisão decimal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"double"})," — 64 bits, ~15 dígitos de precisão. É o padrão para decimais."]})]}),e.jsx("h3",{children:"Outros dois"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"char"})," — 16 bits, guarda um único caractere Unicode (UTF-16)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"boolean"})," — só pode ser ",e.jsx("code",{children:"true"})," ou ",e.jsx("code",{children:"false"}),". O tamanho não é especificado pela JVM."]})]}),e.jsx(o,{title:"Declarando cada tipo",code:`public class Primitivos {
    public static void main(String[] args) {
        byte idade = 30;
        short ano = 2025;
        int populacao = 215_000_000;
        long distanciaSol = 149_600_000_000L;

        float pi = 3.14f;
        double precisao = 3.141592653589793;

        char letra = 'A';
        boolean ativo = true;

        System.out.println(idade + " - " + populacao + " - " + distanciaSol);
        System.out.println(pi + " vs " + precisao);
        System.out.println(letra + " - " + ativo);
    }
}`}),e.jsx("h2",{children:"Literais: jeitos de escrever números"}),e.jsxs("p",{children:["O compilador precisa de pistas para entender o que você quer. Sem o sufixo certo, ele assume ",e.jsx("code",{children:"int"})," para inteiros e ",e.jsx("code",{children:"double"})," para decimais."]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"1L"})," — sufixo L marca um ",e.jsx("code",{children:"long"}),". Use maiúsculo (l minúsculo parece o número 1)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"1.5f"})," — sufixo f marca um ",e.jsx("code",{children:"float"}),". Sem o f, vira double."]}),e.jsxs("li",{children:[e.jsx("code",{children:"0b1010"})," — literal binário (vale 10 em decimal)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"0x1A"})," — literal hexadecimal (vale 26)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"077"})," — literal octal, começa com zero. Cuidado, raramente é o que você quer."]})]}),e.jsx(o,{title:"Literais em ação",code:`long grande = 9_999_999_999L;
float taxa = 0.05f;
int permissoes = 0b111_101_001;
int corVermelha = 0xFF0000;

System.out.println(grande);
System.out.println(taxa);
System.out.println(permissoes);
System.out.println(corVermelha);`}),e.jsxs(i,{type:"tip",title:"Underscore em números (Java 7+)",children:[e.jsxs("p",{children:["Desde o Java 7 você pode colocar ",e.jsx("code",{children:"_"})," entre dígitos só para deixar números grandes legíveis. O compilador ignora completamente os underscores — funciona como o ponto/vírgula que você usa no dia a dia (R$ 1.000.000), só que Java escolheu ",e.jsx("code",{children:"_"})," porque ponto e vírgula já têm outros usos."]}),e.jsx("p",{children:e.jsx("strong",{children:"Vale para qualquer base:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"215_000_000"})," — decimal"]}),e.jsxs("li",{children:[e.jsx("code",{children:"0b1010_0001_0011"})," — binário, agrupado em nibbles"]}),e.jsxs("li",{children:[e.jsx("code",{children:"0xFF_EC_DE_5E"})," — hexadecimal, agrupado em bytes"]}),e.jsxs("li",{children:[e.jsx("code",{children:"3.141_592_653"})," — decimais também"]})]}),e.jsx("p",{children:e.jsx("strong",{children:"Onde NÃO pode aparecer:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:["No começo: ",e.jsx("code",{children:"_100"})," ❌ (vira nome de variável)"]}),e.jsxs("li",{children:["No fim: ",e.jsx("code",{children:"100_"})," ❌"]}),e.jsxs("li",{children:["Colado no ponto decimal: ",e.jsx("code",{children:"3._14"})," ou ",e.jsx("code",{children:"3_.14"})," ❌"]}),e.jsxs("li",{children:["Colado no sufixo: ",e.jsx("code",{children:"100_L"})," ❌ (precisa ser ",e.jsx("code",{children:"100L"})," ou ",e.jsx("code",{children:"1_000L"}),")"]})]})]}),e.jsxs(i,{type:"note",title:"Por que aquele L no final do long?",children:[e.jsxs("p",{children:["Todo número inteiro que você escreve em Java é tratado como",e.jsx("code",{children:"int"})," por padrão (32 bits, vai até ~2,1 bilhões). Se o valor passar disso, o compilador reclama:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"long x = 149_600_000_000;"}),' ❌ "integer number too large"']}),e.jsxs("li",{children:[e.jsx("code",{children:"long x = 149_600_000_000L;"})," ✅ o ",e.jsx("code",{children:"L"}),' diz "trate este literal como long"']})]}),e.jsxs("p",{children:["Sempre escreva o ",e.jsx("code",{children:"L"})," em maiúsculo. O ",e.jsx("code",{children:"l"}),"minúsculo se confunde com o número 1 e já causou bugs sérios em código legado."]})]}),e.jsx("h2",{children:"Promoção automática de tipos"}),e.jsx("p",{children:'Quando você mistura tipos numéricos diferentes numa operação, Java promove o "menor" para o "maior" automaticamente. A escala vai assim:'}),e.jsx("p",{children:e.jsx("code",{children:"byte → short → int → long → float → double"})}),e.jsxs("p",{children:["Repare que ",e.jsx("code",{children:"float"})," vem depois de ",e.jsx("code",{children:"long"})," mesmo tendo menos bits — é porque float consegue representar valores muito maiores (com perda de precisão)."]}),e.jsx(o,{title:"Promoção em ação",code:`int a = 10;
long b = 20L;
long resultado = a + b;

int x = 5;
double y = 2.0;
double divisao = x / y;

System.out.println(resultado);
System.out.println(divisao);`}),e.jsxs(i,{type:"warning",title:"A volta (downcast) não é automática",children:["Ir do maior para o menor exige cast explícito e pode perder dados:",e.jsx("code",{children:"int n = (int) 3.99;"})," resulta em ",e.jsx("code",{children:"3"}),", sem arredondar. Você assume o risco quando escreve o cast."]}),e.jsxs(i,{type:"danger",title:"Pegadinha clássica: overflow silencioso em multiplicação de int",children:[e.jsxs("p",{children:["A conta inteira é feita no tipo dos ",e.jsx("em",{children:"operandos"}),", não no tipo do destino. Se todos forem ",e.jsx("code",{children:"int"}),", ela estoura silenciosamente ANTES de virar ",e.jsx("code",{children:"long"}),":"]}),e.jsx(o,{title:"O bug e a correção",code:`// ❌ Estoura int e vira número negativo aleatório
long msPorAno = 1000 * 60 * 60 * 24 * 365;

// ✅ O L em pelo menos UM operando força a conta inteira em long
long msPorAno = 1000L * 60 * 60 * 24 * 365;

System.out.println(msPorAno); // 31_536_000_000`}),e.jsxs("p",{children:["Toda vez que você multiplicar números grandes que cabem em",e.jsx("code",{children:"long"}),", mas cujos fatores são ",e.jsx("code",{children:"int"}),", marque o primeiro com ",e.jsx("code",{children:"L"}),". Esse bug é responsável por contadores de tempo malucos em produção."]})]}),e.jsx("h2",{children:"int vs Integer: primitivo vs wrapper"}),e.jsxs("p",{children:['Para cada primitivo numérico existe uma classe "wrapper" que o embrulha como objeto: ',e.jsx("code",{children:"int → Integer"}),", ",e.jsx("code",{children:"long → Long"}),",",e.jsx("code",{children:"double → Double"}),", e por aí vai. Wrappers são necessários quando você precisa de um tipo de objeto — por exemplo, dentro de uma",e.jsx("code",{children:"List"})," ou de um ",e.jsx("code",{children:"Map"}),"."]}),e.jsx(o,{title:"Boxing e unboxing",code:`int primitivo = 42;
Integer objeto = primitivo;       // autoboxing
int devolta = objeto;             // unboxing

Integer pode = null;              // wrappers aceitam null
// int naoPode = null;            // não compila

System.out.println(objeto + 1);   // 43`}),e.jsxs(i,{type:"warning",title:"Cuidado com NullPointerException",children:["Quando você faz unboxing de um wrapper que vale ",e.jsx("code",{children:"null"}),", a JVM joga ",e.jsx("code",{children:"NullPointerException"}),". Sempre verifique antes ou prefira primitivos quando a ausência de valor não fizer sentido."]}),e.jsx("h2",{children:"BigDecimal: dinheiro nunca em double"}),e.jsx("p",{children:'Aqui mora uma das pegadinhas mais cruéis. Computadores guardam decimais em base 2, e muitos números que você considera "redondos" em base 10 não têm representação exata. Resultado:'}),e.jsx(o,{title:"Por que double não serve para dinheiro",code:`double a = 0.1;
double b = 0.2;
System.out.println(a + b);
// imprime 0.30000000000000004`}),e.jsxs("p",{children:["Para valores monetários, financeiros ou qualquer cálculo que exija precisão decimal exata, use ",e.jsx("code",{children:"BigDecimal"}),":"]}),e.jsx(o,{title:"Dinheiro do jeito certo",code:`import java.math.BigDecimal;

public class Dinheiro {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("19.99");
        BigDecimal qtd = new BigDecimal("3");
        BigDecimal total = preco.multiply(qtd);
        System.out.println(total); // 59.97 exato
    }
}`}),e.jsxs(i,{type:"tip",title:"Sempre passe String para BigDecimal",children:["Use ",e.jsx("code",{children:'new BigDecimal("0.1")'})," em vez de",e.jsx("code",{children:"new BigDecimal(0.1)"}),". O segundo recebe um double impreciso e propaga o erro."]}),e.jsx("h2",{children:"char é um número de 16 bits"}),e.jsxs("p",{children:["Apesar de representar um caractere, ",e.jsx("code",{children:"char"})," é internamente um número inteiro sem sinal de 16 bits que aponta para uma posição na tabela Unicode (especificamente UTF-16). Isso significa que você pode fazer aritmética com chars:"]}),e.jsx(o,{title:"char é número disfarçado",code:`char letra = 'A';
int codigo = letra;
System.out.println(codigo);     // 65

char proxima = (char) (letra + 1);
System.out.println(proxima);    // B

char acento = 'á';
System.out.println((int) acento); // 225`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um programa que declare um ",e.jsx("code",{children:"int"})," com o valor máximo possível (",e.jsx("code",{children:"Integer.MAX_VALUE"}),"), some 1 e imprima o resultado. Observe o overflow. Depois faça a mesma coisa usando ",e.jsx("code",{children:"long"}),"e veja a diferença."]}),e.jsxs("li",{children:["Calcule ",e.jsx("code",{children:"0.1 + 0.2 + 0.3"})," usando ",e.jsx("code",{children:"double"})," e depois usando ",e.jsx("code",{children:"BigDecimal"}),". Imprima os dois resultados lado a lado."]}),e.jsxs("li",{children:["Escreva um trecho que receba um ",e.jsx("code",{children:"char"})," de letra minúscula e devolva o equivalente em maiúscula somando ou subtraindo o valor numérico certo (dica: ",e.jsx("code",{children:"'a' - 'A' = 32"}),")."]})]})]})}export{l as default};
