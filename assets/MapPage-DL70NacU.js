import{j as e}from"./index-BpXci30S.js";import{P as s,A as r}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(s,{title:"Map: HashMap, LinkedHashMap, TreeMap",subtitle:"Chave → Valor, a estrutura mais útil de toda a biblioteca.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Map é ",e.jsx("em",{children:"dicionário"}),", ",e.jsx("em",{children:"tabela"}),", ",e.jsx("em",{children:"índice"}),'. Toda vez que você precisa responder rápido a "qual o valor associado a essa chave?" — preço de um produto pelo código, configuração por nome, contador por palavra — Map é a resposta. É de longe a coleção mais útil da JDK.']}),e.jsx("h2",{children:"O conceito"}),e.jsxs("p",{children:[e.jsx("code",{children:"Map<K, V>"}),' guarda pares "chave única → valor". Não pode ter duas entradas com a mesma chave; se você fizer ',e.jsx("code",{children:"put"})," de novo na mesma chave, o valor antigo é substituído."]}),e.jsxs(r,{type:"info",title:"Map não é Collection",children:["Map fica fora da hierarquia de ",e.jsx("code",{children:"Collection"})," porque o conceito é diferente (pares, não elementos). Você itera por ",e.jsx("code",{children:"entrySet()"}),", ",e.jsx("code",{children:"keySet()"})," ou ",e.jsx("code",{children:"values()"}),"."]}),e.jsx("h2",{children:"As três implementações principais"}),e.jsx("h3",{children:"HashMap — o padrão"}),e.jsxs("p",{children:["Tabela hash. Operações em ",e.jsx("strong",{children:"O(1)"})," em média. Não preserva ordem. É o que você usa em 95% dos casos."]}),e.jsx("h3",{children:"LinkedHashMap — ordem de inserção"}),e.jsxs("p",{children:["Mesma performance ",e.jsx("strong",{children:"O(1)"}),', mas iterar devolve as entradas na ordem em que foram inseridas. Útil para JSON previsível, caches LRU (tem modo "ordem de acesso") e relatórios.']}),e.jsx("h3",{children:"TreeMap — chaves ordenadas"}),e.jsxs("p",{children:["Árvore balanceada. ",e.jsx("strong",{children:"O(log n)"}),". Iteração em ordem natural das chaves (ou Comparator). Tem operações como ",e.jsx("code",{children:"firstKey"}),", ",e.jsx("code",{children:"floorKey"}),", ",e.jsx("code",{children:"headMap"}),"."]}),e.jsx(a,{title:"As três em ação",code:`import java.util.*;

Map<String, Integer> hash   = new HashMap<>();
Map<String, Integer> linked = new LinkedHashMap<>();
Map<String, Integer> tree   = new TreeMap<>();

for (var m : List.of(hash, linked, tree)) {
    m.put("uva", 8);
    m.put("banana", 5);
    m.put("abacate", 12);
}

System.out.println(hash);    // ordem imprevisível
System.out.println(linked);  // {uva=8, banana=5, abacate=12}
System.out.println(tree);    // {abacate=12, banana=5, uva=8}`}),e.jsx("h2",{children:"Métodos essenciais"}),e.jsx(a,{title:"O kit básico",code:`Map<String, Integer> precos = new HashMap<>();

precos.put("café", 6);
precos.put("bolo", 12);

precos.get("café");                 // 6
precos.get("inexistente");          // null
precos.getOrDefault("inexistente", 0); // 0  (sem null)

precos.containsKey("bolo");         // true
precos.containsValue(12);           // true
precos.size();                      // 2
precos.isEmpty();                   // false

precos.remove("bolo");
precos.clear();`}),e.jsx("h2",{children:"putIfAbsent e computeIfAbsent"}),e.jsxs("p",{children:['Padrão clássico: "se não existe, cria; se existe, mantém". Em vez de checar e fazer ',e.jsx("code",{children:"put"})," manualmente, use os métodos prontos."]}),e.jsx(a,{title:"Inicialização preguiçosa",code:`Map<String, List<String>> tarefasPorPessoa = new HashMap<>();

// chato: precisa checar
if (!tarefasPorPessoa.containsKey("Ana")) {
    tarefasPorPessoa.put("Ana", new ArrayList<>());
}
tarefasPorPessoa.get("Ana").add("estudar");

// limpo: cria a lista só se faltar
tarefasPorPessoa
    .computeIfAbsent("Bruno", k -> new ArrayList<>())
    .add("ler livro");`}),e.jsx("h2",{children:"Iterando: três jeitos"}),e.jsx(a,{title:"entrySet (mais comum, dá chave e valor)",code:`for (Map.Entry<String, Integer> entry : precos.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}`}),e.jsx(a,{title:"keySet (só as chaves)",code:`for (String chave : precos.keySet()) {
    System.out.println(chave);
}`}),e.jsx(a,{title:"values (só os valores)",code:`for (Integer v : precos.values()) {
    System.out.println(v);
}`}),e.jsx(a,{title:"forEach com lambda (Java 8+)",code:`precos.forEach((chave, valor) ->
    System.out.println(chave + " custa R$" + valor)
);`}),e.jsx("h2",{children:"Map.of: imutável e direto"}),e.jsxs("p",{children:["Desde Java 9, ",e.jsx("code",{children:"Map.of"})," cria mapas imutáveis em uma linha. Suporta até 10 pares; para mais, use ",e.jsx("code",{children:"Map.ofEntries"}),"."]}),e.jsx(a,{title:"Map.of e Map.ofEntries",code:`Map<String, Integer> diasMes = Map.of(
    "jan", 31,
    "fev", 28,
    "mar", 31
);

Map<String, String> grandes = Map.ofEntries(
    Map.entry("BR", "Brasil"),
    Map.entry("AR", "Argentina"),
    Map.entry("CL", "Chile")
);`}),e.jsx("h2",{children:"A chave precisa ter equals/hashCode coerentes"}),e.jsxs("p",{children:["Mesma regra do Set: a chave é localizada pelo hash e comparada por equals. Use ",e.jsx("code",{children:"String"}),", números, enums ou ",e.jsx("code",{children:"record"})," e você está em paz. Se for uma classe sua, implemente os dois (a IDE gera)."]}),e.jsx(r,{type:"danger",title:"Não mude a chave depois de inserir",children:"Se você muta a chave de um jeito que muda o hashCode, o Map perde a entrada. Por isso chaves devem ser imutáveis (Strings e records são perfeitos)."}),e.jsx("h2",{children:"null como chave: cuidado"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"HashMap"})," permite ",e.jsx("strong",{children:"uma"})," chave null (e quantos values null quiser)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"LinkedHashMap"})," idem."]}),e.jsxs("li",{children:[e.jsx("code",{children:"TreeMap"})," ",e.jsx("strong",{children:"não permite"})," chave null (joga NullPointerException)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Map.of"})," não permite null nem em chave nem em valor."]})]}),e.jsx("h2",{children:"Map.Entry: o par como objeto"}),e.jsxs("p",{children:["Cada par é um ",e.jsx("code",{children:"Map.Entry<K, V>"}),". Você pode pegar com ",e.jsx("code",{children:"getKey"})," e ",e.jsx("code",{children:"getValue"}),", ou criar avulso com ",e.jsx("code",{children:"Map.entry(...)"}),"."]}),e.jsx(a,{title:"Trabalhando com Map.Entry",code:`var par = Map.entry("idade", 30);
System.out.println(par.getKey() + " = " + par.getValue());`}),e.jsx("h2",{children:"Exemplo completo: contador de palavras"}),e.jsx(a,{title:"Contando ocorrências com merge",code:`import java.util.*;

public class Contador {
    public static void main(String[] args) {
        String texto = "java é legal e java é rápido";
        Map<String, Integer> freq = new HashMap<>();

        for (String palavra : texto.split(" ")) {
            freq.merge(palavra, 1, Integer::sum);
        }
        // {java=2, é=2, legal=1, e=1, rápido=1}
        System.out.println(freq);
    }
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"HashMap<String, Double>"})," com nome de produto e preço. Escreva uma função que dado um nome retorna o preço, ou 0.0 se não existir (use ",e.jsx("code",{children:"getOrDefault"}),")."]}),e.jsxs("li",{children:["Receba uma frase do usuário e imprima ",e.jsx("strong",{children:"quantas vezes cada palavra aparece"})," (use ",e.jsx("code",{children:"merge"})," ou ",e.jsx("code",{children:"computeIfAbsent"}),")."]}),e.jsxs("li",{children:["Compare a iteração de ",e.jsx("code",{children:"HashMap"}),", ",e.jsx("code",{children:"LinkedHashMap"})," e ",e.jsx("code",{children:"TreeMap"})," populando os três com as mesmas 5 chaves fora de ordem alfabética. Imprima cada um e observe a diferença."]})]})]})}export{n as default};
