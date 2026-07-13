import{j as e}from"./index-BpXci30S.js";import{P as r,A as s}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Stream API",subtitle:"Pipeline declarativo: filtre, transforme, agregue coleções sem loops manuais.",difficulty:"intermediario",timeToRead:"30 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Você abre um código Java legado e vê: 15 linhas de ",e.jsx("code",{children:"for"}),", índices, listas auxiliares, ifs aninhados — tudo só pra contar quantos pedidos acima de R$ 100 cada cliente fez. Com Stream, isso vira 4 linhas que se leem quase como uma frase em inglês. Stream é o ferramental que torna processar coleções em Java tão expressivo quanto em Python ou Kotlin."]}),e.jsx(a,{title:"Loop tradicional vs Stream",code:`// Tradicional:
List<String> resultado = new ArrayList<>();
for (String nome : nomes) {
    if (nome.startsWith("A")) {
        resultado.add(nome.toUpperCase());
    }
}

// Stream:
List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .toList();`}),e.jsx("h2",{children:"O conceito: pipeline em 3 partes"}),e.jsx("p",{children:"Toda operação com Stream tem três fases:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Fonte"}),": de onde vêm os dados (uma coleção, um arquivo, um range...)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Operações intermediárias"}),": transformações ",e.jsx("em",{children:"preguiçosas"})," que devolvem outro Stream (",e.jsx("code",{children:"filter"}),", ",e.jsx("code",{children:"map"}),", ",e.jsx("code",{children:"sorted"}),"...)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Operação terminal"}),": dispara o processamento e produz um resultado (",e.jsx("code",{children:"collect"}),", ",e.jsx("code",{children:"count"}),", ",e.jsx("code",{children:"forEach"}),"...)."]})]}),e.jsxs(s,{type:"info",title:"Lazy = preguiçoso",children:['Operações intermediárias só "anotam o que fazer". Nada acontece até a operação terminal aparecer. Isso permite o Java otimizar — encadeando vários ',e.jsx("code",{children:"filter"})," e ",e.jsx("code",{children:"map"})," num único loop interno."]}),e.jsx("h2",{children:"Criando streams"}),e.jsx(a,{title:"Várias formas de começar",code:`import java.util.stream.*;

// De uma coleção:
Stream<String> s1 = List.of("a", "b", "c").stream();

// De valores avulsos:
Stream<Integer> s2 = Stream.of(1, 2, 3);

// Stream infinita - cuidado: precisa limit() depois
Stream<Integer> pares = Stream.iterate(0, n -> n + 2);
Stream<Double> aleatorios = Stream.generate(Math::random);

// Range de inteiros (sem autoboxing):
IntStream r = IntStream.range(1, 11);       // 1..10
IntStream rc = IntStream.rangeClosed(1, 10); // 1..10 inclusivo

// De um array:
Stream<String> arr = Arrays.stream(new String[]{"a", "b"});`}),e.jsx("h2",{children:"Operações intermediárias"}),e.jsx(a,{title:"filter, map, sorted, distinct, limit, skip",code:`List<String> nomes = List.of("Ana", "Bruno", "Carlos", "Ana", "Bia");

List<String> r = nomes.stream()
    .filter(n -> n.length() > 3)   // mantem so quem passa
    .distinct()                    // remove duplicatas
    .sorted()                      // ordena natural
    .skip(1)                       // pula 1
    .limit(2)                      // pega no maximo 2
    .toList();

System.out.println(r); // [Bruno, Carlos]`}),e.jsx(a,{title:"map e mapToInt para conversões",code:`List<String> palavras = List.of("Java", "e", "legal");

int totalLetras = palavras.stream()
    .mapToInt(String::length)  // vira IntStream
    .sum();

System.out.println(totalLetras); // 9`}),e.jsx(a,{title:"peek para depurar (não use para efeitos colaterais)",code:`List.of(1, 2, 3, 4).stream()
    .peek(n -> System.out.println("antes: " + n))
    .map(n -> n * n)
    .peek(n -> System.out.println("depois: " + n))
    .toList();`}),e.jsx("h2",{children:"Operações terminais"}),e.jsx(a,{title:"As mais comuns",code:`List<Integer> nums = List.of(3, 1, 4, 1, 5, 9, 2, 6);

// Coletar:
List<Integer> dobros = nums.stream().map(n -> n * 2).toList();

// Contar:
long qtd = nums.stream().filter(n -> n > 3).count();

// Soma/min/max via IntStream:
int soma = nums.stream().mapToInt(Integer::intValue).sum();
OptionalInt min = nums.stream().mapToInt(Integer::intValue).min();

// reduce: combinar elementos num só
int produto = nums.stream().reduce(1, (a, b) -> a * b);

// Booleanos:
boolean temNegativo = nums.stream().anyMatch(n -> n < 0);
boolean todosPositivos = nums.stream().allMatch(n -> n > 0);
boolean nenhumZero = nums.stream().noneMatch(n -> n == 0);

// Achar:
Optional<Integer> primeiro = nums.stream().filter(n -> n > 4).findFirst();`}),e.jsxs(s,{type:"tip",title:"findFirst vs findAny",children:["Em streams sequenciais os dois funcionam igual. Em streams paralelas, ",e.jsx("code",{children:"findAny"})," pode pegar qualquer elemento (mais rápido), enquanto ",e.jsx("code",{children:"findFirst"})," respeita a ordem do encontro (mais lento)."]}),e.jsx("h2",{children:"Collectors: a usina de transformações"}),e.jsxs("p",{children:[e.jsx("code",{children:"collect()"})," é o canivete suíço. Combinado com a classe ",e.jsx("code",{children:"Collectors"})," ele faz agrupamentos, joins, partições e muito mais."]}),e.jsx(a,{title:"Os Collectors essenciais",code:`import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

record Pessoa(String nome, String cidade, int idade) {}

List<Pessoa> p = List.of(
    new Pessoa("Ana", "SP", 30),
    new Pessoa("Bruno", "RJ", 25),
    new Pessoa("Carla", "SP", 35),
    new Pessoa("Diego", "RJ", 28)
);

// Para Set:
Set<String> cidades = p.stream().map(Pessoa::cidade).collect(toSet());

// Para Map:
Map<String, Integer> idadePorNome = p.stream()
    .collect(toMap(Pessoa::nome, Pessoa::idade));

// Juntar strings:
String nomes = p.stream().map(Pessoa::nome).collect(joining(", ", "[", "]"));
// "[Ana, Bruno, Carla, Diego]"

// Agrupar por cidade:
Map<String, List<Pessoa>> porCidade = p.stream().collect(groupingBy(Pessoa::cidade));

// Contar quantos por cidade:
Map<String, Long> qtdPorCidade = p.stream()
    .collect(groupingBy(Pessoa::cidade, counting()));

// Somar idades por cidade:
Map<String, Integer> idadesPorCidade = p.stream()
    .collect(groupingBy(Pessoa::cidade, summingInt(Pessoa::idade)));

// Particionar (split em true/false):
Map<Boolean, List<Pessoa>> maioresEMenores = p.stream()
    .collect(partitioningBy(pe -> pe.idade() >= 30));`}),e.jsx("h2",{children:"Streams paralelas"}),e.jsxs("p",{children:["Trocar ",e.jsx("code",{children:".stream()"})," por ",e.jsx("code",{children:".parallelStream()"})," faz o Java distribuir o trabalho entre os núcleos da CPU usando o ForkJoinPool comum. Soa mágico, mas tem regras."]}),e.jsxs(s,{type:"warning",title:"Quando usar parallelStream",children:[e.jsxs("ul",{children:[e.jsx("li",{children:"Volume grande (milhares de itens, no mínimo)."}),e.jsx("li",{children:"Operações pesadas em CPU (parsing, cálculo) — não em I/O."}),e.jsx("li",{children:"Operações sem efeitos colaterais e independentes entre si."}),e.jsx("li",{children:"Fonte que divide bem (ArrayList, IntStream.range — não LinkedList)."})]}),"Para listas pequenas, paralelismo adiciona overhead e fica mais lento.",e.jsx("strong",{children:" Meça antes de adotar."})]}),e.jsx(a,{title:"Paralelo na prática",code:`long pares = IntStream.rangeClosed(1, 10_000_000)
    .parallel()
    .filter(n -> n % 2 == 0)
    .count();
System.out.println(pares);`}),e.jsx("h2",{children:"Stream NÃO é Iterable"}),e.jsxs(s,{type:"danger",title:"Uma stream se consome uma vez só",children:['Depois de chamar uma operação terminal, a stream "acabou". Tentar reutilizar gera ',e.jsx("code",{children:"IllegalStateException: stream has already been operated upon"}),". Se precisa percorrer duas vezes, gere a stream de novo a partir da fonte ou materialize numa lista com ",e.jsx("code",{children:".toList()"}),"."]}),e.jsx(a,{title:"Erro clássico",code:`Stream<String> s = List.of("a", "b").stream();
s.forEach(System.out::println);
s.count(); // BOOM: IllegalStateException`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Dada ",e.jsxs("code",{children:["List","<Integer>"," nums = List.of(1,2,3,4,5,6,7,8,9,10)"]}),", calcule a soma dos quadrados dos pares usando Stream em uma única pipeline."]}),e.jsxs("li",{children:["Crie uma ",e.jsxs("code",{children:["List","<String>"]})," com 10 palavras. Conte quantas começam com vogal, agrupe por tamanho (",e.jsxs("code",{children:["Map","<Integer, List<String>>"]}),") e gere uma string única separada por ",e.jsx("code",{children:'" | "'})," em ordem alfabética."]}),e.jsxs("li",{children:["Usando ",e.jsx("code",{children:"IntStream.rangeClosed(1, 100)"}),", descubra quantos números são múltiplos de 3 ou 5 e some-os (problema clássico do Project Euler #1)."]})]})]})}export{n as default};
