import{j as e}from"./index-BpXci30S.js";import{P as i,A as r}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Collections Framework",subtitle:"List, Set, Map, Queue — o ecossistema de coleções da JDK.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Na vida real você quase nunca trabalha com um valor só: são listas de pedidos, conjuntos de usuários únicos, mapas de configurações, filas de tarefas. O ",e.jsx("strong",{children:"Collections Framework"})," é a caixa de ferramentas pronta da JDK pra isso. Saber escolher a coleção certa é o que separa código rápido de código que arrasta o servidor."]}),e.jsx("h2",{children:"O mapa mental"}),e.jsxs("p",{children:["Existem duas árvores de interfaces principais. ",e.jsx("code",{children:"Collection"}),' agrupa coisas que se comportam como "uma porção de elementos"; ',e.jsx("code",{children:"Map"})," é separado porque associa ",e.jsx("em",{children:"chaves a valores"}),"."]}),e.jsx(s,{title:"Hierarquia simplificada",code:`Iterable
└── Collection
    ├── List   (ordenado, permite duplicados, acesso por índice)
    ├── Set    (sem duplicatas)
    └── Queue  (fila — geralmente FIFO)

Map           (chave única → valor)`}),e.jsx("h2",{children:"Quando usar cada uma"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"List"})," — você precisa de ordem, acesso por índice ou itens repetidos. Pense numa playlist de músicas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Set"}),' — não pode haver duplicatas. Pense em "usuários únicos que clicaram no botão hoje".']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Map"})," — você quer buscar algo por uma chave. Pense em dicionário: palavra → definição."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Queue"})," — processar em ordem (FIFO). Pense numa fila do banco.",e.jsx("code",{children:"Deque"})," permite adicionar/remover dos dois lados."]})]}),e.jsx("h2",{children:"Interface vs implementação: o costume profissional"}),e.jsxs("p",{children:["Declare sempre pela ",e.jsx("strong",{children:"interface"})," e instancie a ",e.jsx("strong",{children:"implementação"}),". Isso te deixa trocar a implementação depois sem mexer no resto do código."]}),e.jsx(s,{title:"Padrão correto",code:`import java.util.*;

List<String> nomes = new ArrayList<>();      // não: ArrayList<String> nomes = ...
Set<Integer> ids   = new HashSet<>();
Map<String, Integer> idades = new HashMap<>();`}),e.jsx("h2",{children:"Adicionando, lendo, iterando"}),e.jsx(s,{title:"Operações básicas e for-each",code:`import java.util.*;

public class Demo {
    public static void main(String[] args) {
        List<String> frutas = new ArrayList<>();
        frutas.add("maçã");
        frutas.add("banana");
        frutas.add("uva");

        // for-each (funciona em qualquer Iterable)
        for (String f : frutas) {
            System.out.println(f);
        }

        // tamanho, contém, índice
        System.out.println("total = " + frutas.size());
        System.out.println("tem banana? " + frutas.contains("banana"));
        System.out.println("uva está em " + frutas.indexOf("uva"));
    }
}`}),e.jsxs("p",{children:["Tudo que herda de ",e.jsx("code",{children:"Iterable"})," funciona no ",e.jsx("code",{children:"for-each"}),". Por isso ",e.jsx("code",{children:"List"}),", ",e.jsx("code",{children:"Set"})," e ",e.jsx("code",{children:"Queue"})," aceitam o loop direto. Já o ",e.jsx("code",{children:"Map"})," não é Iterable — você itera por ",e.jsx("code",{children:"entrySet()"}),", ",e.jsx("code",{children:"keySet()"})," ou ",e.jsx("code",{children:"values()"}),"."]}),e.jsx("h2",{children:"Fábricas modernas: List.of, Set.of, Map.of (Java 9+)"}),e.jsxs("p",{children:["Para coleções ",e.jsx("strong",{children:"imutáveis"}),", criadas em uma linha com valores fixos, use os métodos ",e.jsx("code",{children:".of()"}),". São perfeitas para constantes e dados que não mudam."]}),e.jsx(s,{title:"Fábricas imutáveis",code:`import java.util.*;

List<String> cores  = List.of("vermelho", "verde", "azul");
Set<Integer> primos = Set.of(2, 3, 5, 7, 11);
Map<String, Integer> precos = Map.of(
    "café",  6,
    "bolo", 12,
    "suco",  9
);

// cores.add("amarelo");  // UnsupportedOperationException!`}),e.jsxs(r,{type:"warning",title:"Imutável de verdade",children:["Tentar modificar uma coleção criada por ",e.jsx("code",{children:".of()"})," joga ",e.jsx("code",{children:"UnsupportedOperationException"})," em runtime. Isso é proposital: imutabilidade previne uma classe inteira de bugs."]}),e.jsx("h2",{children:"Collections.unmodifiableList: envolvendo uma mutável"}),e.jsxs("p",{children:['Se você já tem uma lista mutável e quer expor uma "vista" que não pode ser alterada por quem chamar (clássico em getters), envolva com ',e.jsx("code",{children:"Collections.unmodifiableList"}),"."]}),e.jsx(s,{title:"View imutável de uma lista interna",code:`import java.util.*;

public class Carrinho {
    private final List<String> itens = new ArrayList<>();

    public void adicionar(String item) {
        itens.add(item);
    }

    public List<String> getItens() {
        // quem receber não consegue alterar
        return Collections.unmodifiableList(itens);
    }
}`}),e.jsx("h2",{children:"Iterable, Iterator e for-each"}),e.jsxs("p",{children:["Por baixo dos panos, o ",e.jsx("code",{children:"for-each"})," usa um ",e.jsx("code",{children:"Iterator"}),". Você raramente precisa lidar com ele diretamente — exceto quando quer ",e.jsx("strong",{children:"remover"})," elementos com segurança durante a iteração (mais sobre isso na página de List)."]}),e.jsx(s,{title:"Iterator manual",code:`Iterator<String> it = frutas.iterator();
while (it.hasNext()) {
    String f = it.next();
    if (f.startsWith("b")) {
        it.remove(); // remoção segura durante iteração
    }
}`}),e.jsx("h2",{children:"Coleções e threads"}),e.jsxs("p",{children:["As coleções padrão (",e.jsx("code",{children:"ArrayList"}),", ",e.jsx("code",{children:"HashMap"}),"...) ",e.jsx("strong",{children:"não são seguras"})," para acesso simultâneo por múltiplas threads. Se você compartilha entre threads, use o pacote ",e.jsx("code",{children:"java.util.concurrent"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ConcurrentHashMap"})," — versão thread-safe e rápida do HashMap."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CopyOnWriteArrayList"})," — boa para listas com muita leitura, pouca escrita."]}),e.jsxs("li",{children:[e.jsx("code",{children:"BlockingQueue"})," — filas para produtor/consumidor."]})]}),e.jsxs(r,{type:"info",title:"Synchronized é o jeito antigo",children:[e.jsx("code",{children:"Collections.synchronizedList(...)"})," existe, mas é menos eficiente que as alternativas de ",e.jsx("code",{children:"java.util.concurrent"}),". Prefira as concorrentes em código novo."]}),e.jsx("h2",{children:"Resumo decisório"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Lista de coisas com ordem? ",e.jsx("strong",{children:"ArrayList"}),"."]}),e.jsxs("li",{children:["Sem duplicatas, ordem não importa? ",e.jsx("strong",{children:"HashSet"}),"."]}),e.jsxs("li",{children:["Sem duplicatas, ordem natural? ",e.jsx("strong",{children:"TreeSet"}),"."]}),e.jsxs("li",{children:["Buscar por chave? ",e.jsx("strong",{children:"HashMap"}),"."]}),e.jsxs("li",{children:["Constante imutável? ",e.jsx("strong",{children:"List.of / Set.of / Map.of"}),"."]}),e.jsxs("li",{children:["Multi-thread? ",e.jsx("strong",{children:"ConcurrentHashMap"})," e amigos."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"List<String>"}),' com 5 nomes e itere imprimindo "Olá, X" para cada um. Depois converta a mesma lista em um ',e.jsx("code",{children:"Set"})," e veja o que acontece se houver repetição."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"Map<String, Integer>"})," com 3 produtos e seus preços usando ",e.jsx("code",{children:"Map.of"}),". Tente adicionar um quarto e observe o erro. Depois recrie como ",e.jsx("code",{children:"HashMap"})," e adicione com sucesso."]}),e.jsxs("li",{children:["Faça uma classe ",e.jsx("code",{children:"Estoque"})," com uma ",e.jsx("code",{children:"List"})," interna mutável e um getter que retorna ",e.jsx("code",{children:"Collections.unmodifiableList"}),". Tente alterar a lista externa e veja o erro."]})]})]})}export{n as default};
