import{j as e}from"./index-BpXci30S.js";import{P as n,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(n,{title:"Lambdas & Method References",subtitle:"Sintaxe enxuta para Functional Interfaces — Java 8+ ficou outro idioma.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Antes do Java 8, sempre que você queria passar comportamento como argumento — um ",e.jsx("code",{children:"Comparator"}),", um ",e.jsx("code",{children:"Runnable"}),", um listener — tinha que escrever uma classe anônima de 6 linhas pra um método de 1. Lambdas cortaram esse boilerplate e abriram caminho para a Stream API. Hoje, código Java moderno é praticamente lambda em todo lugar."]}),e.jsx(a,{title:"Antes e depois",code:`// Antes (classe anonima):
Runnable antigo = new Runnable() {
    @Override
    public void run() {
        System.out.println("rodando");
    }
};

// Depois (lambda):
Runnable novo = () -> System.out.println("rodando");`}),e.jsx("h2",{children:"Sintaxe da lambda"}),e.jsxs("p",{children:["A forma geral é ",e.jsxs("code",{children:["(parametros) ","->"," corpo"]}),". Variações:"]}),e.jsx(a,{title:"Todos os formatos",code:`// Sem parametros
Runnable r = () -> System.out.println("oi");

// Um parametro - parenteses opcionais
Function<String, Integer> tam = s -> s.length();

// Multiplos parametros
BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;

// Tipos explicitos (raro, so quando o compilador nao infere)
BiFunction<Integer, Integer, Integer> soma2 = (Integer a, Integer b) -> a + b;

// Corpo de bloco com return
Function<Integer, String> classificar = n -> {
    if (n > 0) return "positivo";
    if (n < 0) return "negativo";
    return "zero";
};`}),e.jsx("h2",{children:"Inferência de tipo"}),e.jsxs("p",{children:["Você não escreve o tipo dos parâmetros porque o compilador deduz do ",e.jsx("strong",{children:"contexto"})," (chamado de ",e.jsx("em",{children:"target type"}),"). Quando você atribui a um ",e.jsxs("code",{children:["Function","<String, Integer>"]}),", o compilador sabe que ",e.jsx("code",{children:"s"})," é ",e.jsx("code",{children:"String"}),"."]}),e.jsxs(r,{type:"note",title:"Lambda sozinha não existe",children:["Você não pode escrever ",e.jsxs("code",{children:["var f = s ","->"," s.length();"]}),". O compilador precisa de um tipo alvo para descobrir qual interface funcional você quer. Sempre dê um nome de tipo concreto à esquerda."]}),e.jsx("h2",{children:"Method references — atalhos pra lambdas óbvias"}),e.jsxs("p",{children:["Quando sua lambda só está chamando um método existente, dá para usar a sintaxe ",e.jsx("code",{children:"::"}),". Existem 4 formatos:"]}),e.jsxs("h3",{children:["1. Referência a método estático: ",e.jsx("code",{children:"Classe::metodo"})]}),e.jsx(a,{code:`// Lambda:
Function<String, Integer> parse1 = s -> Integer.parseInt(s);
// Reference:
Function<String, Integer> parse2 = Integer::parseInt;`}),e.jsx("h3",{children:"2. Referência a método de uma instância específica"}),e.jsx(a,{code:`String prefixo = "log: ";
// Lambda:
Function<String, String> com1 = s -> prefixo.concat(s);
// Reference:
Function<String, String> com2 = prefixo::concat;`}),e.jsx("h3",{children:"3. Referência a método de instância de uma classe (sem instância fixa)"}),e.jsx(a,{code:`// Lambda:
Function<String, Integer> tam1 = s -> s.length();
// Reference: chamado em CADA instancia recebida
Function<String, Integer> tam2 = String::length;

// O primeiro argumento vira o "this" da chamada
List.of("Java", "Kotlin").stream()
    .map(String::toUpperCase)
    .forEach(System.out::println);`}),e.jsxs("h3",{children:["4. Referência a construtor: ",e.jsx("code",{children:"Classe::new"})]}),e.jsx(a,{code:`// Lambda:
Supplier<List<String>> nova1 = () -> new ArrayList<>();
// Reference:
Supplier<List<String>> nova2 = ArrayList::new;

// Com argumento - precisa de uma Function compativel
Function<String, StringBuilder> sb = StringBuilder::new;`}),e.jsx("h2",{children:'Captura de variáveis: "effectively final"'}),e.jsxs("p",{children:["Lambdas conseguem usar variáveis do escopo externo, mas com uma regra: a variável precisa ser ",e.jsx("strong",{children:"final ou efetivamente final"})," — ou seja, você não reatribui depois de inicializada. Isso evita bugs sutis quando a lambda é executada em outra thread."]}),e.jsx(a,{title:"Captura válida",code:`int multiplicador = 3; // nunca e reatribuido = effectively final
Function<Integer, Integer> mult = n -> n * multiplicador;
System.out.println(mult.apply(5)); // 15`}),e.jsx(a,{title:"Captura inválida",code:`int contador = 0;
Runnable r = () -> contador++; // ERRO: variavel modificada
contador = 1;                  // se descomentar, tambem quebra a lambda acima`}),e.jsxs(r,{type:"tip",title:"Truque: array de 1 elemento ou AtomicInteger",children:["Quando você precisa ",e.jsx("em",{children:"realmente"})," mudar um valor de dentro da lambda, use uma referência mutável: um array ",e.jsx("code",{children:"int[] c = 0; c[0]++;"})," ou, melhor ainda, ",e.jsx("code",{children:"AtomicInteger"}),". Mas pense bem se isso não está escondendo um problema de design."]}),e.jsxs("h2",{children:["Lambda vs classe anônima: a sutileza do ",e.jsx("code",{children:"this"})]}),e.jsxs("p",{children:["A diferença mais importante: dentro de uma lambda, ",e.jsx("code",{children:"this"})," é o ",e.jsx("strong",{children:"this da classe que envolve"})," a lambda. Dentro de uma classe anônima, ",e.jsx("code",{children:"this"})," é a própria instância anônima."]}),e.jsx(a,{title:"this comporta-se diferente",code:`public class Servico {
    private String nome = "Servico";

    public void rodarLambda() {
        Runnable r = () -> System.out.println(this.nome); // "Servico"
        r.run();
    }

    public void rodarAnonima() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                // this aqui e a Runnable anonima, nao Servico
                System.out.println(this.getClass().getSimpleName()); // Servico$1
            }
        };
        r.run();
    }
}`}),e.jsx("h2",{children:"Outras diferenças práticas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sem campos próprios"}),": lambdas não podem declarar campos. Classe anônima pode."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não dá para sombrear variáveis"}),": o nome do parâmetro conflitaria com nomes do escopo externo. Em classe anônima dá."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Performance"}),": o compilador usa ",e.jsx("code",{children:"invokedynamic"})," para lambdas — sem criar uma classe nova no disco. Mais leve."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Reescreva o código abaixo usando lambda e depois method reference: ",e.jsxs("code",{children:["Comparator","<String>"," c = new Comparator","<String>","() ","{ public int compare(String a, String b) { return a.length() - b.length(); } }"]}),"."]}),e.jsxs("li",{children:["Crie uma ",e.jsxs("code",{children:["List","<String>"]})," com 5 nomes. Use ",e.jsx("code",{children:"list.forEach(System.out::println)"})," e depois ordene com ",e.jsx("code",{children:"list.sort(Comparator.comparing(String::length))"}),"."]}),e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Carro"})," com construtor que recebe ",e.jsx("code",{children:"String modelo"}),". Use ",e.jsxs("code",{children:["Function","<String, Carro>"," fab = Carro::new;"]})," e fabrique 3 carros aplicando a função numa lista de modelos."]})]})]})}export{t as default};
