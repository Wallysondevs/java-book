import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function s(){return e.jsxs(i,{title:"Optional",subtitle:"Adeus NullPointerException — encapsule pode-não-ter-valor explicitamente.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:[e.jsx("code",{children:"NullPointerException"}),' é apelidada de "o erro de bilhão de dólares" — o próprio criador do ',e.jsx("code",{children:"null"}),", Tony Hoare, pediu desculpas em público por tê-lo inventado. ",e.jsx("code",{children:"Optional"}),", que chegou no Java 8, ataca o problema na raiz: em vez de devolver ",e.jsx("code",{children:"null"})," e torcer pra quem chamou lembrar de checar, você devolve um objeto que ",e.jsx("strong",{children:"obriga"})," o consumidor a tratar a ausência."]}),e.jsx(o,{title:"O que Optional resolve",code:`// Antes: facil esquecer da checagem
public Usuario buscar(String email) {
    // pode retornar null
}
Usuario u = buscar("ana@x.com");
System.out.println(u.getNome()); // BOOM se for null

// Depois: o tipo grita "pode nao existir"
public Optional<Usuario> buscar(String email) { ... }
buscar("ana@x.com").ifPresent(u -> System.out.println(u.getNome()));`}),e.jsx("h2",{children:"Criando um Optional"}),e.jsx(o,{code:`import java.util.Optional;

// Quando voce TEM CERTEZA que o valor nao e null:
Optional<String> a = Optional.of("Java");

// Quando o valor PODE ser null:
Optional<String> b = Optional.ofNullable(possivelmenteNulo);

// Vazio explicito:
Optional<String> c = Optional.empty();

// CUIDADO: of(null) lanca NullPointerException na hora.`}),e.jsx("h2",{children:"Consumindo: do pior ao melhor"}),e.jsx("p",{children:"Existem várias formas de extrair o valor. A ordem da pior para a melhor:"}),e.jsx(o,{title:"get() — quase nunca use",code:`Optional<String> nome = buscarNome();
String n = nome.get(); // NoSuchElementException se vazio

// Use so quando voce ja garantiu antes que tem valor.
// Codigo melhor: use orElse, ifPresent ou map.`}),e.jsx(o,{title:"isPresent / isEmpty (Java 11+)",code:`if (nome.isPresent()) {
    System.out.println(nome.get());
}
if (nome.isEmpty()) {
    System.out.println("Sem nome");
}

// Funciona, mas e o estilo "if-de-null disfarcado" — prefira ifPresent.`}),e.jsx(o,{title:"ifPresent / ifPresentOrElse (Java 9+)",code:`nome.ifPresent(n -> System.out.println("Olá " + n));

nome.ifPresentOrElse(
    n -> System.out.println("Olá " + n),
    () -> System.out.println("Visitante anonimo")
);`}),e.jsx("h2",{children:"Transformando com map e flatMap"}),e.jsx("p",{children:"Você pode encadear operações sem se preocupar com null entre elas. Se em algum ponto da cadeia o valor é vazio, o restante simplesmente não roda."}),e.jsx(o,{title:"map: transforma o valor (se houver)",code:`Optional<String> nome = Optional.of("ana");
Optional<Integer> tamanho = nome.map(String::length);
// Optional[3]

Optional<String> vazio = Optional.empty();
Optional<Integer> nada = vazio.map(String::length);
// Optional.empty (sem NPE)`}),e.jsx(o,{title:"flatMap: quando a função já devolve Optional",code:`record Usuario(String nome, Optional<String> apelido) {}

Optional<Usuario> u = Optional.of(new Usuario("Ana", Optional.of("Aninha")));

// Sem flatMap viraria Optional<Optional<String>> — feio
Optional<String> apelido = u.flatMap(Usuario::apelido);
// Optional[Aninha]`}),e.jsx(o,{title:"filter: condicional embutido",code:`Optional<Integer> idade = Optional.of(22);

Optional<Integer> adulto = idade.filter(i -> i >= 18);
// Optional[22]

Optional<Integer> crianca = Optional.of(10).filter(i -> i >= 18);
// Optional.empty`}),e.jsx("h2",{children:"Valor padrão: orElse, orElseGet, orElseThrow"}),e.jsx(o,{title:"As três variantes",code:`String nome1 = buscarNome().orElse("Anonimo");
// Sempre AVALIA "Anonimo", mesmo se houver valor.

String nome2 = buscarNome().orElseGet(() -> calcularPadrao());
// Preguicoso: so chama o supplier se for vazio.

String nome3 = buscarNome().orElseThrow(); // NoSuchElementException
String nome4 = buscarNome().orElseThrow(
    () -> new IllegalStateException("usuario sem nome")
);`}),e.jsxs(a,{type:"tip",title:"orElse vs orElseGet",children:["Use ",e.jsx("code",{children:"orElse"})," com valores baratos (constantes, literais). Use ",e.jsx("code",{children:"orElseGet"})," quando o padrão exigir cálculo, criação de objeto ou chamada de método — assim você não paga o custo se o valor existir."]}),e.jsx("h2",{children:"Como usar (e como NÃO usar)"}),e.jsxs(a,{type:"success",title:"Use Optional como tipo de RETORNO",children:["Quando seu método pode legitimamente não ter resposta (busca em repositório, configuração opcional, cache miss), devolva ",e.jsx("code",{children:"Optional"}),". Quem consumir é forçado a pensar no caso vazio."]}),e.jsx(a,{type:"danger",title:"NÃO use Optional como…",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Campo de classe"})," — Optional não é serializável e ocupa espaço extra. Para campos opcionais, deixe o tipo nullable e documente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Parâmetro de método"})," — quem chama precisa embrulhar tudo em Optional, e ainda assim pode passar ",e.jsx("code",{children:"null"}),". Em vez disso, faça sobrecarga de método ou aceite o tipo direto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Em coleções"})," — ",e.jsxs("code",{children:["List","<Optional<String>>"]})," é quase sempre sintoma de design errado. Filtre os ausentes antes."]})]})}),e.jsx("h2",{children:"Combinando com Stream"}),e.jsxs("p",{children:["Stream e Optional foram pensados pra trabalhar juntos. Métodos como ",e.jsx("code",{children:"findFirst"})," e ",e.jsx("code",{children:"findAny"})," já devolvem ",e.jsx("code",{children:"Optional"}),"."]}),e.jsx(o,{title:"Pipeline natural",code:`import java.util.List;

record Produto(String nome, double preco) {}

List<Produto> catalogo = List.of(
    new Produto("Notebook", 4500),
    new Produto("Mouse", 80),
    new Produto("Teclado", 200)
);

String maisCaro = catalogo.stream()
    .filter(p -> p.preco() > 100)
    .max((a, b) -> Double.compare(a.preco(), b.preco()))
    .map(Produto::nome)
    .orElse("nenhum encontrado");

System.out.println(maisCaro); // Notebook`}),e.jsx(o,{title:"Optional.stream() — Java 9+",code:`// Achata uma lista de Optionals filtrando os vazios
List<Optional<String>> brutos = List.of(
    Optional.of("a"), Optional.empty(), Optional.of("c")
);

List<String> limpos = brutos.stream()
    .flatMap(Optional::stream)
    .toList();
// [a, c]`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um método ",e.jsxs("code",{children:["Optional","<Integer>"," parseSeguro(String s)"]})," que devolve ",e.jsx("code",{children:"Optional.empty()"})," se a string não for um número. Use-o numa lista de strings e some os números válidos."]}),e.jsxs("li",{children:["Modele um ",e.jsx("code",{children:"record Cliente(String nome, Optional<String> cpf)"}),". Crie uma lista, e use ",e.jsx("code",{children:"flatMap"})," + ",e.jsx("code",{children:"Optional::stream"})," para gerar uma lista só com os CPFs informados."]}),e.jsxs("li",{children:["Reescreva esse trecho usando Optional sem ",e.jsx("code",{children:"if"}),": ",e.jsx("code",{children:'String r = obj == null ? "vazio" : obj.toUpperCase();'}),"."]})]})]})}export{s as default};
