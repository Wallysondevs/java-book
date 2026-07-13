import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(a,{title:"Strings & Formatação",subtitle:"Imutabilidade, métodos essenciais, StringBuilder e os Text Blocks de Java 13+.",difficulty:"iniciante",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Texto é provavelmente o tipo de dado que você mais vai manipular: nomes, e-mails, JSON, logs, SQL. ",e.jsx("code",{children:"String"})," em Java tem detalhes que derrubam programador iniciante todo dia — comparar com ",e.jsx("code",{children:"=="}),", concatenar dentro de loop, e a confusão com mutabilidade. Dominar essa página resolve uns 30% dos bugs típicos do começo."]}),e.jsx("h2",{children:"Strings são imutáveis"}),e.jsxs("p",{children:["Toda ",e.jsx("code",{children:"String"})," em Java é imutável: depois de criada, o conteúdo não muda. Métodos como ",e.jsx("code",{children:"toUpperCase()"})," ou",e.jsx("code",{children:"replace()"})," não alteram a String original — eles devolvem uma nova com o resultado."]}),e.jsx(o,{title:"Imutabilidade na prática",code:`public class Imutavel {
    public static void main(String[] args) {
        String nome = "ana";
        nome.toUpperCase();
        System.out.println(nome); // ainda "ana"

        nome = nome.toUpperCase();
        System.out.println(nome); // agora "ANA"
    }
}`}),e.jsxs(r,{type:"tip",title:"Por que imutável é bom",children:["Strings imutáveis são seguras para compartilhar entre threads, podem ser usadas como chave em ",e.jsx("code",{children:"Map"})," sem medo de mudarem, e permitem otimizações como o pool de strings."]}),e.jsx("h2",{children:"O pool de strings"}),e.jsxs("p",{children:["Quando você escreve um literal como ",e.jsx("code",{children:'"oi"'}),", a JVM guarda essa String num pool interno. Se outro lugar do código também usar",e.jsx("code",{children:'"oi"'}),", é o ",e.jsx("em",{children:"mesmo objeto"}),". Já o ",e.jsx("code",{children:'new String("oi")'}),"força a criação de um novo objeto fora do pool."]}),e.jsx(o,{title:"Pool em ação",code:`String a = "java";
String b = "java";
String c = new String("java");

System.out.println(a == b);        // true  (mesmo objeto no pool)
System.out.println(a == c);        // false (objeto novo)
System.out.println(a.equals(c));   // true  (mesmo conteúdo)`}),e.jsx("h2",{children:"Compare com .equals(), nunca com =="}),e.jsxs("p",{children:[e.jsx("code",{children:"=="})," em objetos compara ",e.jsx("strong",{children:"identidade"})," (mesmo endereço de memória), não conteúdo. Para Strings (e qualquer objeto) use ",e.jsx("code",{children:".equals()"})," para comparar conteúdo. Use",e.jsx("code",{children:".equalsIgnoreCase()"})," se diferenças de maiúsculas/minúsculas não importarem."]}),e.jsx(o,{title:"Comparação correta",code:`String entrada = new String("admin");
String esperado = "admin";

if (entrada == esperado) {
    System.out.println("nunca cai aqui");
}

if (entrada.equals(esperado)) {
    System.out.println("acesso liberado");
}

if ("ADMIN".equalsIgnoreCase(entrada)) {
    System.out.println("também combina");
}`}),e.jsxs(r,{type:"tip",title:"Truque contra NullPointerException",children:["Coloque o literal à esquerda: ",e.jsx("code",{children:'"admin".equals(entrada)'}),"funciona mesmo se ",e.jsx("code",{children:"entrada"})," for ",e.jsx("code",{children:"null"}),". O contrário, ",e.jsx("code",{children:'entrada.equals("admin")'}),", explode."]}),e.jsx("h2",{children:"Métodos essenciais"}),e.jsxs("p",{children:["A classe ",e.jsx("code",{children:"String"})," tem dezenas de métodos. Esses são os que você vai usar quase todo dia:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"length()"})," — quantidade de caracteres."]}),e.jsxs("li",{children:[e.jsx("code",{children:"charAt(int i)"})," — caractere na posição ",e.jsx("code",{children:"i"})," (0-based)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"substring(int ini, int fim)"})," — pedaço da string, fim exclusivo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"indexOf(String s)"})," — posição da primeira ocorrência (ou -1)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"contains(CharSequence s)"})," — true se contém o trecho."]}),e.jsxs("li",{children:[e.jsx("code",{children:"replace(CharSequence alvo, CharSequence novo)"})," — substitui todas as ocorrências."]}),e.jsxs("li",{children:[e.jsx("code",{children:"split(String regex)"})," — quebra em array por um separador."]}),e.jsxs("li",{children:[e.jsx("code",{children:"toLowerCase()"})," / ",e.jsx("code",{children:"toUpperCase()"})," — caixa."]}),e.jsxs("li",{children:[e.jsx("code",{children:"trim()"})," — remove espaços, tabs e quebras nas pontas (ASCII)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"strip()"})," — como trim mas considera Unicode (Java 11+)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"isBlank()"})," — true se vazia ou só espaços (Java 11+)."]})]}),e.jsx(o,{title:"Métodos em uso",code:`public class Metodos {
    public static void main(String[] args) {
        String s = "  Java é massa  ";

        System.out.println(s.length());           // 16
        System.out.println(s.strip());            // "Java é massa"
        System.out.println(s.strip().toUpperCase()); // "JAVA É MASSA"
        System.out.println(s.contains("massa"));  // true
        System.out.println(s.indexOf("é"));       // 7
        System.out.println(s.replace("massa", "top"));
        System.out.println(s.isBlank());          // false

        String csv = "ana,bia,carla";
        String[] partes = csv.split(",");
        for (String p : partes) {
            System.out.println(p);
        }
    }
}`}),e.jsx("h2",{children:"Concatenação: + vs StringBuilder"}),e.jsxs("p",{children:["Concatenar Strings com ",e.jsx("code",{children:"+"})," em código casual é tranquilo. O compilador transforma em ",e.jsx("code",{children:"StringBuilder"})," nos bastidores. O problema aparece dentro de loops grandes, onde cada ",e.jsx("code",{children:"+"})," pode criar objetos temporários."]}),e.jsx(o,{title:"Loop ruim com +",code:`String resultado = "";
for (int i = 0; i < 10000; i++) {
    resultado += i + ",";
}
// cria milhares de Strings intermediárias`}),e.jsx(o,{title:"Loop bom com StringBuilder",code:`StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i).append(",");
}
String resultado = sb.toString();`}),e.jsxs(r,{type:"note",title:"Quando se preocupar",children:["Para 3 ou 4 concatenações, ",e.jsx("code",{children:"+"})," está ótimo e fica mais legível. Use ",e.jsx("code",{children:"StringBuilder"})," quando estiver dentro de loop ou construindo texto em várias etapas."]}),e.jsx("h2",{children:"Formatação: String.format e printf"}),e.jsxs("p",{children:["Quando você precisa montar uma String com placeholders tipados (números com casas decimais, alinhamento, padding), ",e.jsx("code",{children:"String.format"})," e",e.jsx("code",{children:"System.out.printf"})," são seus amigos. A sintaxe é parecida com C."]}),e.jsx(o,{title:"Placeholders comuns",code:`String nome = "Ana";
int idade = 30;
double saldo = 1234.5;

String linha = String.format("%s tem %d anos e R$ %.2f", nome, idade, saldo);
System.out.println(linha);
// "Ana tem 30 anos e R$ 1234,50"

System.out.printf("%-10s %5d%n", "produto", 42);
// "produto        42"`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"%s"})," — string."]}),e.jsxs("li",{children:[e.jsx("code",{children:"%d"})," — inteiro."]}),e.jsxs("li",{children:[e.jsx("code",{children:"%f"})," — decimal (use ",e.jsx("code",{children:"%.2f"})," para 2 casas)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"%n"})," — quebra de linha portável."]}),e.jsxs("li",{children:[e.jsx("code",{children:"%-10s"})," — alinha à esquerda em 10 colunas."]})]}),e.jsx("h2",{children:"Text blocks (Java 13+)"}),e.jsxs("p",{children:["Strings multilinha ficaram fáceis com text blocks. Em vez de concatenar várias linhas com ",e.jsx("code",{children:"\\\\n"}),", você usa três aspas duplas. Útil para HTML, JSON, SQL embutidos no código."]}),e.jsx(o,{title:"Text block versus o jeito antigo",code:`String velho = "{\\n" +
               "  \\"nome\\": \\"Ana\\",\\n" +
               "  \\"idade\\": 30\\n" +
               "}";

String novo = """
        {
          "nome": "Ana",
          "idade": 30
        }
        """;

System.out.println(novo);`}),e.jsx(r,{type:"note",title:"Indentação inteligente",children:"O compilador detecta o menor recuo comum em todas as linhas e remove para você. Aspas duplas dentro do bloco não precisam de escape."}),e.jsx("h2",{children:"String.join: junte coleções"}),e.jsxs("p",{children:["Para o caminho inverso do ",e.jsx("code",{children:"split"}),", use ",e.jsx("code",{children:"String.join"}),". Ele aceita um separador e uma série de Strings (ou um ",e.jsx("code",{children:"Iterable"}),")."]}),e.jsx(o,{title:"String.join",code:`import java.util.List;

public class Join {
    public static void main(String[] args) {
        String csv = String.join(",", "ana", "bia", "carla");
        System.out.println(csv); // ana,bia,carla

        List<String> nomes = List.of("João", "Maria", "Pedro");
        System.out.println(String.join(" - ", nomes));
    }
}`}),e.jsx("h2",{children:"Convertendo para char[]"}),e.jsxs("p",{children:["Quando você precisa percorrer caractere a caractere ou aplicar algoritmos que mexem em índices, ",e.jsx("code",{children:"toCharArray()"})," entrega um array de ",e.jsx("code",{children:"char"}),"."]}),e.jsx(o,{title:"char[] para iteração",code:`String palavra = "java";
char[] letras = palavra.toCharArray();

for (char c : letras) {
    System.out.println(c);
}

// alternativa sem alocar array:
for (int i = 0; i < palavra.length(); i++) {
    System.out.println(palavra.charAt(i));
}`}),e.jsxs(r,{type:"tip",title:"char[] para senhas",children:[e.jsx("code",{children:"String"})," fica no pool e na memória até o GC limpar. Para senhas, o ideal é usar ",e.jsx("code",{children:"char[]"})," e zerar manualmente depois de usar — minimiza o tempo em que o segredo fica na heap."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um método que receba uma ",e.jsx("code",{children:"String"})," e retorne",e.jsx("code",{children:"true"})," se ela é palíndromo (lê igual de trás para frente), ignorando caixa. Use ",e.jsx("code",{children:"toLowerCase()"}),",",e.jsx("code",{children:"charAt()"})," e um loop."]}),e.jsxs("li",{children:["Construa uma String CSV com 1000 números de 1 a 1000 separados por vírgula, primeiro usando ",e.jsx("code",{children:"+="})," em loop e depois usando",e.jsx("code",{children:"StringBuilder"}),". Compare o tempo com",e.jsx("code",{children:"System.currentTimeMillis()"}),"."]}),e.jsxs("li",{children:["Crie um text block com um JSON de exemplo (pelo menos 4 campos) e use ",e.jsx("code",{children:"String.format"})," para preencher os valores dinamicamente. Imprima no console."]})]})]})}export{t as default};
