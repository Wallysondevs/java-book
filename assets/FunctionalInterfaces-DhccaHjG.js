import{j as e}from"./index-BpXci30S.js";import{P as i,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function s(){return e.jsxs(i,{title:"Functional Interfaces",subtitle:"Interface com 1 método abstrato — base de toda a programação funcional em Java.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Toda vez que você escreve uma ",e.jsx("em",{children:"lambda"})," em Java — ",e.jsxs("code",{children:["x ","->"," x * 2"]}),' — o compilador precisa de um "molde" pra encaixar. Esse molde é uma ',e.jsx("strong",{children:"functional interface"}),". Sem entender esse conceito, Stream, CompletableFuture, listeners de UI e quase tudo que é moderno em Java fica meio mágico. Vamos tirar o véu."]}),e.jsx("h2",{children:"Definição: SAM (Single Abstract Method)"}),e.jsxs("p",{children:["Uma functional interface é simplesmente uma interface com ",e.jsx("strong",{children:"exatamente um método abstrato"}),". Pode ter quantos métodos ",e.jsx("code",{children:"default"})," ou ",e.jsx("code",{children:"static"})," quiser — só não pode ter mais de um abstrato."]}),e.jsx(a,{title:"Sua primeira functional interface",code:`@FunctionalInterface
public interface Calculadora {
    int operar(int a, int b);

    default int dobrarResultado(int a, int b) {
        return operar(a, b) * 2;
    }
}

class Demo {
    public static void main(String[] args) {
        Calculadora soma = (a, b) -> a + b;
        Calculadora mult = (a, b) -> a * b;

        System.out.println(soma.operar(2, 3));        // 5
        System.out.println(mult.dobrarResultado(2, 3)); // 12
    }
}`}),e.jsxs(o,{type:"tip",title:"@FunctionalInterface é opcional, mas use",children:["A anotação ",e.jsx("code",{children:"@FunctionalInterface"}),' não muda o comportamento — qualquer interface com 1 método abstrato já é funcional. Mas ela diz ao compilador "vigie pra mim: se alguém adicionar outro método abstrato, dê erro". Em equipe, isso evita que sua API quebre por descuido.']}),e.jsxs("h2",{children:["O kit pronto: ",e.jsx("code",{children:"java.util.function"})]}),e.jsx("p",{children:"Em vez de você criar uma interface nova pra cada operação, o Java 8 trouxe um pacote cheio de functional interfaces prontas. Decorar as 6 principais já cobre 90% dos casos."}),e.jsxs("h3",{children:[e.jsx("code",{children:"Function<T, R>"})," — recebe T, devolve R"]}),e.jsx(a,{code:`import java.util.function.Function;

Function<String, Integer> tamanho = s -> s.length();
System.out.println(tamanho.apply("Java")); // 4

// Composicao:
Function<Integer, Integer> dobro = n -> n * 2;
Function<String, Integer> tamanhoDobrado = tamanho.andThen(dobro);
System.out.println(tamanhoDobrado.apply("Java")); // 8`}),e.jsxs("h3",{children:[e.jsx("code",{children:"Predicate<T>"})," — recebe T, devolve boolean"]}),e.jsx(a,{code:`import java.util.function.Predicate;

Predicate<Integer> positivo = n -> n > 0;
Predicate<Integer> par = n -> n % 2 == 0;

System.out.println(positivo.test(5));               // true
System.out.println(positivo.and(par).test(4));      // true
System.out.println(positivo.or(par).test(-2));      // true
System.out.println(positivo.negate().test(-5));     // true`}),e.jsxs("h3",{children:[e.jsx("code",{children:"Consumer<T>"})," — recebe T, devolve nada"]}),e.jsx(a,{code:`import java.util.function.Consumer;
import java.util.List;

Consumer<String> imprimir = s -> System.out.println(">> " + s);
List.of("a", "b", "c").forEach(imprimir);`}),e.jsxs("h3",{children:[e.jsx("code",{children:"Supplier<T>"})," — não recebe nada, devolve T"]}),e.jsx(a,{code:`import java.util.function.Supplier;

Supplier<Double> aleatorio = Math::random;
System.out.println(aleatorio.get()); // ex: 0.4523...

// Util para inicializacao preguicosa
Supplier<List<String>> listaVazia = ArrayList::new;`}),e.jsx("h3",{children:"Variantes mais usadas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("code",{children:["BiFunction","<T, U, R>"]})," — recebe dois argumentos diferentes, devolve R. Ex: ",e.jsxs("code",{children:["(a, b) ","->"," a + b"]}),"."]}),e.jsxs("li",{children:[e.jsxs("code",{children:["UnaryOperator","<T>"]})," — Function de T pra T. Ex: ",e.jsxs("code",{children:["x ","->"," x.toUpperCase()"]}),"."]}),e.jsxs("li",{children:[e.jsxs("code",{children:["BinaryOperator","<T>"]})," — BiFunction onde os 3 tipos são iguais. Ex: ",e.jsxs("code",{children:["(a, b) ","->"," a + b"]})," para inteiros."]}),e.jsxs("li",{children:[e.jsx("code",{children:"BiPredicate"}),", ",e.jsx("code",{children:"BiConsumer"})," — versões de 2 argumentos."]})]}),e.jsxs(o,{type:"info",title:"Versões para primitivos",children:["Para evitar autoboxing existem variantes especializadas: ",e.jsx("code",{children:"IntFunction"}),", ",e.jsx("code",{children:"IntPredicate"}),", ",e.jsx("code",{children:"ToIntFunction"}),", ",e.jsx("code",{children:"IntUnaryOperator"}),"... Use quando estiver processando muitos números em sequência (em Streams, por exemplo)."]}),e.jsx("h2",{children:"Onde isso aparece na vida real"}),e.jsxs("p",{children:["Quando você usa ",e.jsx("code",{children:"Stream"}),", está chamando métodos que recebem functional interfaces:"]}),e.jsx(a,{title:"Stream usando Function e Predicate",code:`import java.util.List;
import java.util.stream.Collectors;

List<String> nomes = List.of("Ana", "Bruno", "Carlos", "Bia");

List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("B"))   // Predicate<String>
    .map(n -> n.toUpperCase())        // Function<String, String>
    .collect(Collectors.toList());

System.out.println(resultado); // [BRUNO, BIA]`}),e.jsx("h2",{children:"Criando suas próprias"}),e.jsxs("p",{children:["Vale criar uma interface customizada quando o nome do método ajuda a documentar a intenção. Comparar ",e.jsxs("code",{children:["Validador","<Pedido>"]})," com ",e.jsxs("code",{children:["Function","<Pedido, Boolean>"]})," — qual fica mais claro?"]}),e.jsx(a,{title:"Functional interface de domínio",code:`@FunctionalInterface
public interface Validador<T> {
    boolean ehValido(T item);

    default Validador<T> e(Validador<T> outro) {
        return item -> this.ehValido(item) && outro.ehValido(item);
    }
}

class Demo {
    public static void main(String[] args) {
        Validador<String> naoVazio = s -> !s.isBlank();
        Validador<String> ate100 = s -> s.length() <= 100;

        Validador<String> textoOk = naoVazio.e(ate100);

        System.out.println(textoOk.ehValido("oi"));  // true
        System.out.println(textoOk.ehValido(""));    // false
    }
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsxs("code",{children:["Predicate","<String>"]})," que aceita apenas e-mails terminados em ",e.jsx("code",{children:".br"}),". Combine com outro que verifica se contém ",e.jsx("code",{children:"@"}),". Teste com 4 strings."]}),e.jsxs("li",{children:["Crie uma functional interface ",e.jsxs("code",{children:["Transformacao","<T>"]})," com método ",e.jsx("code",{children:"aplicar(T entrada): T"}),". Use-a para encapsular operações em textos: ",e.jsx("code",{children:"trim"}),", ",e.jsx("code",{children:"toUpperCase"}),", remover espaços duplos. Componha as três num pipeline."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"Function.andThen"})," para criar uma função que recebe um número, calcula seu quadrado e depois soma 10. Aplique aos números de 1 a 5."]})]})]})}export{s as default};
