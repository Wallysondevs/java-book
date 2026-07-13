import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(a,{title:"Set: HashSet, LinkedHashSet, TreeSet",subtitle:"Sem duplicatas — escolha a implementação pelo trade-off.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:['Toda vez que você se pegou escrevendo "se já existe não adiciona" antes de um ',e.jsx("code",{children:"list.add(...)"}),", era um ",e.jsx("code",{children:"Set"})," que você queria. ",e.jsx("strong",{children:"Set"})," é uma coleção que ",e.jsx("em",{children:"não permite duplicatas"}),' — adicionar o mesmo elemento duas vezes simplesmente não faz nada. Perfeito para "conjunto de tags", "ids únicos", "palavras distintas".']}),e.jsx("h2",{children:"Como Java sabe se é duplicata"}),e.jsxs("p",{children:["Set usa ",e.jsx("strong",{children:"dois"})," métodos: ",e.jsx("code",{children:"equals()"})," diz se são iguais e ",e.jsx("code",{children:"hashCode()"})," diz onde procurar. Os dois precisam ser ",e.jsx("em",{children:"coerentes"}),": se dois objetos são equals, têm que ter o mesmo hashCode. Strings, números e ",e.jsx("code",{children:"record"})," já vêm com isso correto. Para classes suas, você precisa implementar — ou usar ",e.jsx("code",{children:"record"}),", que gera tudo de graça."]}),e.jsx(s,{title:"record já implementa equals e hashCode",code:`public record Tag(String nome) {}

Set<Tag> tags = new HashSet<>();
tags.add(new Tag("java"));
tags.add(new Tag("backend"));
tags.add(new Tag("java"));   // ignorado: já existe
System.out.println(tags.size()); // 2`}),e.jsx("h2",{children:"As três implementações"}),e.jsx("h3",{children:"HashSet — o padrão"}),e.jsxs("p",{children:["Usa uma tabela hash. Operações em ",e.jsx("strong",{children:"O(1)"})," em média. Ordem de iteração aparentemente aleatória (depende dos hashes). É a escolha padrão quando você só quer unicidade."]}),e.jsx(s,{title:"HashSet",code:`import java.util.*;

Set<String> visitados = new HashSet<>();
visitados.add("home");
visitados.add("login");
visitados.add("home"); // ignorado

System.out.println(visitados.size());          // 2
System.out.println(visitados.contains("home")); // true`}),e.jsx("h3",{children:"LinkedHashSet — preserva ordem de inserção"}),e.jsxs("p",{children:["Mesma performance ",e.jsx("strong",{children:"O(1)"}),", mas mantém a ordem em que você inseriu. Use quando a ordem importa para exibição mas você ainda precisa de unicidade rápida."]}),e.jsx(s,{title:"LinkedHashSet",code:`Set<String> times = new LinkedHashSet<>();
times.add("Flamengo");
times.add("Vasco");
times.add("Botafogo");
times.add("Flamengo"); // ignorado

System.out.println(times); // [Flamengo, Vasco, Botafogo]`}),e.jsx("h3",{children:"TreeSet — ordenado"}),e.jsxs("p",{children:["Mantém os elementos sempre ordenados (ordem natural ou um ",e.jsx("code",{children:"Comparator"})," fornecido). Operações em ",e.jsx("strong",{children:"O(log n)"}),'. Use quando você quer iterar em ordem ou precisa de operações como "primeiro maior que X" (',e.jsx("code",{children:"ceiling"}),", ",e.jsx("code",{children:"floor"}),", ",e.jsx("code",{children:"higher"}),", ",e.jsx("code",{children:"lower"}),")."]}),e.jsx(s,{title:"TreeSet",code:`Set<Integer> notas = new TreeSet<>();
notas.add(7);
notas.add(3);
notas.add(10);
notas.add(5);

System.out.println(notas); // [3, 5, 7, 10]

NavigableSet<Integer> nav = (NavigableSet<Integer>) notas;
System.out.println(nav.first());     // 3
System.out.println(nav.ceiling(6));  // 7  (menor >= 6)`}),e.jsxs(o,{type:"warning",title:"TreeSet exige Comparable ou Comparator",children:["Se você colocar objetos seus num TreeSet sem implementar ",e.jsx("code",{children:"Comparable"})," e sem passar um ",e.jsx("code",{children:"Comparator"}),", vai tomar ",e.jsx("code",{children:"ClassCastException"}),"."]}),e.jsx("h2",{children:"equals e hashCode: o contrato sagrado"}),e.jsxs("p",{children:["Se você não usa ",e.jsx("code",{children:"record"}),", escreva os dois manualmente (sua IDE gera). Errar isso significa que o Set vai aceitar duplicatas e ",e.jsx("code",{children:"contains"})," vai retornar false para algo que está lá dentro."]}),e.jsx(s,{title:"equals/hashCode na mão",code:`import java.util.Objects;

public class Pessoa {
    private final String cpf;
    private final String nome;

    public Pessoa(String cpf, String nome) {
        this.cpf = cpf;
        this.nome = nome;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf); // identidade pelo CPF
    }

    @Override
    public int hashCode() {
        return Objects.hash(cpf);
    }
}`}),e.jsx("h2",{children:"Operações de conjunto"}),e.jsxs("p",{children:[e.jsx("code",{children:"Set"})," tem três operações clássicas escondidas em métodos genéricos da interface",e.jsx("code",{children:" Collection"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"addAll"})," — ",e.jsx("strong",{children:"união"})," (adiciona tudo do outro)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"retainAll"})," — ",e.jsx("strong",{children:"interseção"})," (mantém só o que está nos dois)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"removeAll"})," — ",e.jsx("strong",{children:"diferença"})," (remove o que está no outro)."]})]}),e.jsx(s,{title:"União, interseção, diferença",code:`Set<String> a = new HashSet<>(Set.of("java", "kotlin", "scala"));
Set<String> b = new HashSet<>(Set.of("java", "python", "go"));

Set<String> uniao = new HashSet<>(a);
uniao.addAll(b);          // [java, kotlin, scala, python, go]

Set<String> intersec = new HashSet<>(a);
intersec.retainAll(b);    // [java]

Set<String> diferenca = new HashSet<>(a);
diferenca.removeAll(b);   // [kotlin, scala]`}),e.jsx("h2",{children:"EnumSet: o segredo dos enums"}),e.jsxs("p",{children:["Para sets de valores de um ",e.jsx("code",{children:"enum"}),", use ",e.jsx("code",{children:"EnumSet"}),". Por baixo é um bitset — extremamente rápido e compacto, ordens de magnitude melhor que HashSet."]}),e.jsx(s,{title:"EnumSet",code:`import java.util.EnumSet;

enum Permissao { LER, ESCREVER, EXECUTAR, DELETAR }

EnumSet<Permissao> minhas = EnumSet.of(Permissao.LER, Permissao.ESCREVER);
System.out.println(minhas.contains(Permissao.LER)); // true

EnumSet<Permissao> todas = EnumSet.allOf(Permissao.class);
EnumSet<Permissao> nenhuma = EnumSet.noneOf(Permissao.class);`}),e.jsx("h2",{children:"Set imutável: Set.of"}),e.jsxs("p",{children:["Para conjuntos fixos, ",e.jsx("code",{children:"Set.of(...)"})," cria um Set imutável. Tentar modificar dá ",e.jsx("code",{children:"UnsupportedOperationException"}),"."]}),e.jsx(s,{title:"Set.of",code:'Set<String> diasUteis = Set.of("seg", "ter", "qua", "qui", "sex");'}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Receba uma frase do usuário e imprima ",e.jsx("strong",{children:"quantas palavras únicas"})," ela tem (separe por espaço, jogue tudo num ",e.jsx("code",{children:"HashSet"}),")."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"record Cliente(String email)"})," e tente adicionar dois clientes com o mesmo email num ",e.jsx("code",{children:"Set"}),". Confirme que só fica um. Depois remova ",e.jsx("code",{children:"record"})," e use uma classe normal sem equals/hashCode — veja o Set aceitando os dois."]}),e.jsxs("li",{children:["Tenha dois ",e.jsx("code",{children:"Set<Integer>"})," com os múltiplos de 2 e os múltiplos de 3 até 30. Calcule a interseção (múltiplos de 6) usando ",e.jsx("code",{children:"retainAll"}),"."]})]})]})}export{n as default};
