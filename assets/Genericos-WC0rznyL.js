import{j as e}from"./index-BpXci30S.js";import{P as o,A as i}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(o,{title:"Tipos Genéricos",subtitle:"Type-safety em containers — escreva código que aceita qualquer tipo com segurança.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine uma caixa de papelão. Você pode colocar qualquer coisa dentro: um livro, uma fruta, um sapato. Mas quando alguém vai retirar, precisa adivinhar o que tem ali. Antes do Java 5, era assim que coleções funcionavam: tudo virava ",e.jsx("code",{children:"Object"})," e você fazia ",e.jsx("em",{children:"cast"})," manual na esperança de ter guardado a coisa certa."]}),e.jsx(a,{title:"A dor antes dos genéricos (estilo Java 1.4)",code:`List nomes = new ArrayList();
nomes.add("Maria");
nomes.add(42); // compila! ninguém impede

String primeiro = (String) nomes.get(0); // OK
String segundo = (String) nomes.get(1);  // BOOM em runtime: ClassCastException`}),e.jsxs("p",{children:["Genéricos resolvem isso colocando uma ",e.jsx("strong",{children:"etiqueta"}),' na caixa: "essa lista só aceita String". O compilador passa a vigiar você e barra erros antes mesmo do programa rodar.']}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsxs("p",{children:["Você declara o tipo dentro de ",e.jsx("code",{children:"<>"})," logo após o nome do tipo genérico. Os mais comuns são ",e.jsx("code",{children:"List"}),", ",e.jsx("code",{children:"Set"})," e ",e.jsx("code",{children:"Map"}),"."]}),e.jsx(a,{title:"Coleções tipadas",code:`import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        // nomes.add(42); // erro de compilacao!

        Map<String, Integer> idades = new HashMap<>();
        idades.put("Ana", 30);
        idades.put("Bruno", 25);

        for (String nome : nomes) {
            System.out.println(nome + " tem " + idades.get(nome) + " anos");
        }
    }
}`}),e.jsxs(i,{type:"tip",title:"Diamond operator (desde Java 7)",children:["Repare no ",e.jsxs("code",{children:["new ArrayList","<>","()"]}),". O ",e.jsx("code",{children:"<>"})," vazio é chamado de ",e.jsx("em",{children:"diamond operator"}),": o compilador deduz o tipo a partir da declaração à esquerda. Antes do Java 7 você tinha que escrever ",e.jsxs("code",{children:["new ArrayList","<String>","()"]})," de novo."]}),e.jsx("h2",{children:"Criando sua própria classe genérica"}),e.jsx("p",{children:'Você não precisa só consumir genéricos — pode criar os seus. A ideia é deixar um "espaço em branco" para o tipo, que é preenchido na hora de usar.'}),e.jsx(a,{title:"Uma Caixa<T> que guarda qualquer coisa com segurança",code:`public class Caixa<T> {
    private T conteudo;

    public void guardar(T item) {
        this.conteudo = item;
    }

    public T retirar() {
        return conteudo;
    }
}

class Demo {
    public static void main(String[] args) {
        Caixa<String> caixaDeTexto = new Caixa<>();
        caixaDeTexto.guardar("Olá!");
        String msg = caixaDeTexto.retirar(); // sem cast!

        Caixa<Integer> caixaDeNumero = new Caixa<>();
        caixaDeNumero.guardar(42);
        int n = caixaDeNumero.retirar();
    }
}`}),e.jsx("h2",{children:"Métodos genéricos"}),e.jsx("p",{children:"Um método pode ter seus próprios parâmetros de tipo, independentes da classe. A declaração vem antes do tipo de retorno."}),e.jsx(a,{title:"Método que troca o primeiro com o último de qualquer lista",code:`import java.util.List;

public class Utils {
    public static <T> void trocarPontas(List<T> lista) {
        if (lista.size() < 2) return;
        T primeiro = lista.get(0);
        T ultimo = lista.get(lista.size() - 1);
        lista.set(0, ultimo);
        lista.set(lista.size() - 1, primeiro);
    }

    public static void main(String[] args) {
        var nomes = new java.util.ArrayList<>(java.util.List.of("Ana", "Bia", "Caio"));
        trocarPontas(nomes);
        System.out.println(nomes); // [Caio, Bia, Ana]
    }
}`}),e.jsx("h2",{children:"Convenção de nomes"}),e.jsx("p",{children:"Por convenção, use letras maiúsculas curtas para parâmetros de tipo:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"T"})," — Type (genérico geral)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"E"})," — Element (elemento de coleção)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"K"}),", ",e.jsx("code",{children:"V"})," — Key e Value (em mapas)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"R"})," — Return (tipo de retorno em funções)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"N"})," — Number (numérico)"]})]}),e.jsx("h2",{children:"Cuidado com primitivos"}),e.jsxs(i,{type:"warning",title:"Genéricos não aceitam int, double, boolean...",children:["Você precisa usar as classes wrapper: ",e.jsx("code",{children:"Integer"}),", ",e.jsx("code",{children:"Double"}),", ",e.jsx("code",{children:"Boolean"}),", ",e.jsx("code",{children:"Character"}),". O Java faz ",e.jsx("em",{children:"autoboxing"})," automático, mas tem um custo de performance e memória — em cenários hot path considere bibliotecas como Eclipse Collections ou as ",e.jsx("code",{children:"IntStream"})," especializadas."]}),e.jsx(a,{title:"Wrappers em vez de primitivos",code:`List<Integer> numeros = new ArrayList<>();
numeros.add(10);   // autoboxing: int -> Integer
int x = numeros.get(0); // unboxing: Integer -> int

// List<int> numeros = ... // ERRO de compilacao`}),e.jsx("h2",{children:"Os benefícios na prática"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Erros pegos em tempo de compilação"})," — não em produção às 3 da manhã."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem cast manual"})," — código mais limpo e legível."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Documentação embutida"})," — quem lê ",e.jsxs("code",{children:["Map","<String, Usuario>"]})," sabe imediatamente o que esperar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Refatoração segura"})," — IDEs sabem exatamente o tipo de cada variável."]})]}),e.jsxs(i,{type:"info",title:"Java 21 LTS",children:["Tudo nesta página funciona desde Java 5 (genéricos) e Java 7 (diamond). Como usamos Java 21 LTS como base, dá ainda para combinar com ",e.jsx("code",{children:"var"})," (Java 10+) para deixar a declaração mais enxuta: ",e.jsxs("code",{children:["var lista = new ArrayList","<String>","()"]}),"."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsxs("code",{children:["Par","<A, B>"]})," com dois campos genéricos ",e.jsx("code",{children:"primeiro"})," e ",e.jsx("code",{children:"segundo"})," e um método ",e.jsx("code",{children:"inverter()"})," que retorna um ",e.jsxs("code",{children:["Par","<B, A>"]}),"."]}),e.jsxs("li",{children:["Escreva um método genérico ",e.jsx("code",{children:"<T> T ultimo(List<T> lista)"})," que devolve o último elemento da lista (ou lança ",e.jsx("code",{children:"NoSuchElementException"})," se vazia)."]}),e.jsxs("li",{children:["Crie um ",e.jsxs("code",{children:["Map","<String, List<String>>"]})," que guarda o nome de uma cidade como chave e a lista de bairros como valor. Adicione 2 cidades com 3 bairros cada e imprima."]})]})]})}export{t as default};
