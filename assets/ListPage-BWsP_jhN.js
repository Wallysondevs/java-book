import{j as e}from"./index-BpXci30S.js";import{P as s,A as a}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(s,{title:"List: ArrayList & LinkedList",subtitle:"A coleção mais usada de Java — mas qual implementação escolher?",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["90% do tempo, quando você precisa guardar uma porção de coisas em ordem, é uma ",e.jsx("code",{children:"List"}),". Lista de tarefas, mensagens de chat, linhas de um CSV. Saber escolher entre ",e.jsx("code",{children:"ArrayList"})," e ",e.jsx("code",{children:"LinkedList"})," faz diferença real em performance — mas o veredito final é mais simples do que parece."]}),e.jsx("h2",{children:"List é uma interface"}),e.jsxs("p",{children:[e.jsx("code",{children:"List<E>"}),' é o contrato: "coleção ordenada com acesso por índice". Quem cumpre o contrato? Várias classes. As duas que importam:']}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ArrayList"})," — array dinâmico por baixo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LinkedList"})," — lista duplamente ligada."]})]}),e.jsx(r,{title:"Sempre declare pela interface",code:`import java.util.*;

List<String> tarefas = new ArrayList<>();
tarefas.add("estudar Java");
tarefas.add("fazer café");
tarefas.add("commitar");`}),e.jsx("h2",{children:"ArrayList: o padrão"}),e.jsxs("p",{children:["Por dentro é um ",e.jsx("code",{children:"Object[]"})," que cresce sozinho quando enche. Acesso por índice é direto — pular pro ",e.jsx("code",{children:"get(500)"})," custa o mesmo que ",e.jsx("code",{children:"get(0)"}),": ",e.jsx("strong",{children:"O(1)"}),". Por outro lado, inserir ou remover no ",e.jsx("em",{children:"meio"})," obriga a deslocar todos os elementos depois: ",e.jsx("strong",{children:"O(n)"}),"."]}),e.jsx("h2",{children:"LinkedList: o caso especial"}),e.jsxs("p",{children:["Cada elemento é um nó com ponteiros pro anterior e pro próximo. Inserir/remover nas extremidades é ",e.jsx("strong",{children:"O(1)"}),". Mas pegar o elemento na posição 500? Java percorre nó por nó: ",e.jsx("strong",{children:"O(n)"}),"."]}),e.jsxs(a,{type:"tip",title:"Veredito prático",children:[e.jsx("strong",{children:"Use ArrayList sempre."})," Só troque por LinkedList se você fez ",e.jsx("em",{children:"medição"})," e tem muita inserção/remoção nas pontas. Na prática, a localidade de memória do ArrayList ganha quase sempre — inclusive em casos onde a teoria diria o contrário."]}),e.jsx("h2",{children:"Métodos essenciais"}),e.jsx(r,{title:"Operações que você usa todo dia",code:`import java.util.*;

public class Demo {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        // adicionar
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carla");
        nomes.add(1, "Beatriz"); // insere no índice 1

        // ler
        System.out.println(nomes.get(0));      // Ana
        System.out.println(nomes.size());      // 4
        System.out.println(nomes.isEmpty());   // false

        // procurar
        System.out.println(nomes.contains("Ana"));   // true
        System.out.println(nomes.indexOf("Carla"));  // 3

        // alterar
        nomes.set(0, "Aline"); // substitui no índice 0

        // remover
        nomes.remove("Bruno");  // por valor
        nomes.remove(0);        // por índice

        // fatia
        List<String> sub = nomes.subList(0, 1); // view dos índices 0..0
        System.out.println(sub);

        // limpar
        nomes.clear();
        System.out.println(nomes.isEmpty()); // true
    }
}`}),e.jsxs(a,{type:"warning",title:"subList é uma view, não uma cópia",children:["Modificar o subList altera a lista original (e vice-versa). Se você quer cópia independente, faça ",e.jsx("code",{children:"new ArrayList<>(lista.subList(...))"}),"."]}),e.jsx("h2",{children:"Três jeitos de iterar"}),e.jsx(r,{title:"for-each (o mais comum)",code:`for (String n : nomes) {
    System.out.println(n);
}`}),e.jsx(r,{title:"for tradicional com índice (quando precisa do índice)",code:`for (int i = 0; i < nomes.size(); i++) {
    System.out.println(i + ": " + nomes.get(i));
}`}),e.jsx(r,{title:"Iterator (quando precisa remover durante a iteração)",code:`Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    String n = it.next();
    if (n.startsWith("B")) {
        it.remove(); // SEGURO
    }
}`}),e.jsxs(a,{type:"danger",title:"Não remova durante for-each",children:["Chamar ",e.jsx("code",{children:"nomes.remove(...)"})," dentro de um ",e.jsx("code",{children:"for-each"})," joga ",e.jsx("code",{children:"ConcurrentModificationException"}),". Use ",e.jsx("code",{children:"Iterator.remove()"}),", ou ",e.jsx("code",{children:"list.removeIf(...)"})," que é mais elegante:"]}),e.jsx(r,{title:"removeIf — o jeito moderno",code:'nomes.removeIf(n -> n.startsWith("B"));'}),e.jsx("h2",{children:"Ordenando"}),e.jsxs("p",{children:[e.jsx("code",{children:"List.sort"})," ordena no lugar. Sem argumento, usa a ordem natural (precisa que os elementos implementem ",e.jsx("code",{children:"Comparable"}),"). Com um ",e.jsx("code",{children:"Comparator"}),", você define a ordem que quiser. Isso vai aparecer com mais detalhes na página de Comparable & Comparator."]}),e.jsx(r,{title:"Sort em ação",code:`import java.util.*;

List<String> palavras = new ArrayList<>(List.of("uva", "abacate", "mamão"));

palavras.sort(null);                   // ordem natural (alfabética)
System.out.println(palavras);          // [abacate, mamão, uva]

palavras.sort(Comparator.reverseOrder());
System.out.println(palavras);          // [uva, mamão, abacate]

// alternativa equivalente
Collections.sort(palavras);`}),e.jsx("h2",{children:"Conversões úteis"}),e.jsx(r,{title:"De array para List e vice-versa",code:`String[] arr = {"a", "b", "c"};

// array -> List (mutável de tamanho fixo, cuidado!)
List<String> view = Arrays.asList(arr);

// melhor: cópia mutável real
List<String> copia = new ArrayList<>(Arrays.asList(arr));

// List -> array
String[] arr2 = copia.toArray(new String[0]);`}),e.jsx("h2",{children:"List.copyOf: cópia imutável"}),e.jsxs("p",{children:["Desde Java 10, ",e.jsx("code",{children:"List.copyOf(outraLista)"})," devolve uma cópia imutável. Útil para snapshots ou quando você quer congelar uma lista que recebeu de fora."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"ArrayList<Integer>"})," com os números de 1 a 10. Remova todos os pares usando ",e.jsx("code",{children:"removeIf"}),". Imprima o resultado."]}),e.jsxs("li",{children:["Faça um programa que recebe vários nomes do usuário (",e.jsx("code",{children:"Scanner"}),') até ele digitar "fim". Guarde numa ',e.jsx("code",{children:"List"})," e no final imprima ordenado alfabeticamente."]}),e.jsxs("li",{children:["Dada a lista ",e.jsx("code",{children:'List.of("banana", "uva", "abacate", "uva")'}),', conte quantas vezes "uva" aparece. (Dica: percorra com for-each ou use ',e.jsx("code",{children:"Collections.frequency"}),".)"]})]})]})}export{n as default};
