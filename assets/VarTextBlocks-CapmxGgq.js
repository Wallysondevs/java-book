import{j as e}from"./index-BpXci30S.js";import{P as o,A as a}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(o,{title:"var & Text Blocks",subtitle:"Java 10 e Java 13 trouxeram açúcar sintático que mudou o dia a dia.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Java tem fama (justa) de verboso. As versões modernas estão atacando isso. Duas melhorias simples salvam muito digitação no dia a dia: ",e.jsx("code",{children:"var"})," pra deduzir tipos e ",e.jsx("strong",{children:"text blocks"})," pra strings multilinha sem dor."]}),e.jsx("h2",{children:"var (desde Java 10)"}),e.jsxs("p",{children:[e.jsx("code",{children:"var"}),' diz ao compilador: "se vira e descobre o tipo dessa variável local sozinho". Não é tipagem dinâmica — o tipo é fixado em tempo de compilação e nunca muda. É só uma economia de digitação.']}),e.jsx(i,{title:"Antes vs depois",code:`// Antes
ArrayList<Map<String, List<Pessoa>>> mapa = new ArrayList<>();

// Depois
var mapa = new ArrayList<Map<String, List<Pessoa>>>();`}),e.jsxs(a,{type:"warning",title:"var não é dynamic typing",children:[e.jsx("code",{children:"var x = 10;"})," deduz ",e.jsx("code",{children:"int"}),". Depois disso, ",e.jsx("code",{children:'x = "oi"'}),"é erro de compilação. Diferente de Python ou JavaScript."]}),e.jsx("h2",{children:"Onde dá pra usar var"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Variáveis locais com inicialização (precisa do valor pra deduzir)."}),e.jsxs("li",{children:["Em ",e.jsx("code",{children:"for"})," e ",e.jsx("code",{children:"for-each"}),"."]}),e.jsx("li",{children:"Em try-with-resources."}),e.jsx("li",{children:"Parâmetros de lambda (desde Java 11) — útil pra anotações."})]}),e.jsx(i,{code:`for (var i = 0; i < 10; i++) { /* i é int */ }

for (var pessoa : pessoas) { /* tipo deduzido do List */ }

try (var arq = new BufferedReader(new FileReader("a.txt"))) { /* ... */ }

// Lambda com var (Java 11+) — útil pra anotação
list.stream().map((@NotNull var x) -> x.toString());`}),e.jsx("h2",{children:"Onde NÃO dá"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Campos de classe (",e.jsx("code",{children:"private var nome;"})," não compila)."]}),e.jsx("li",{children:"Parâmetros de método."}),e.jsx("li",{children:"Tipo de retorno."}),e.jsxs("li",{children:["Sem inicialização: ",e.jsx("code",{children:"var x;"})," não compila."]}),e.jsxs("li",{children:["Inicializando com ",e.jsx("code",{children:"null"})," (sem como deduzir)."]}),e.jsx("li",{children:"Inicializando com lambda ou array literal sem tipo."})]}),e.jsx("h2",{children:"Quando var ajuda"}),e.jsx("p",{children:"Quando o tipo é óbvio pelo lado direito. Repetir o mesmo nome dos dois lados é ruído:"}),e.jsx(i,{code:`var clientes = new HashMap<String, Cliente>();
var stream   = arquivo.lines();
var resposta = httpClient.send(req, BodyHandlers.ofString());`}),e.jsx("h2",{children:"Quando var atrapalha"}),e.jsx("p",{children:"Quando o lado direito não diz o tipo claramente. Ler o código fica adivinhação:"}),e.jsx(i,{code:`// Ruim — o que é x?
var x = service.processar(dados);

// Bom — você sabe sem rodar
Resultado x = service.processar(dados);`}),e.jsx(a,{type:"tip",title:"Regra de bolso",children:"Se você precisa abrir o IDE pra descobrir o tipo, escreva o tipo. Código se lê muitas vezes mais do que se escreve."}),e.jsx("h2",{children:"Text Blocks (desde Java 13, oficial em Java 15)"}),e.jsxs("p",{children:["Cansou de ",e.jsx("code",{children:'"linha1\\\\n" + "linha2\\\\n" + "linha3"'}),"? Use três aspas duplas:"]}),e.jsx(i,{title:"Antes vs depois",code:`// Antes
String json = "{\\n" +
              "  \\"nome\\": \\"Ana\\",\\n" +
              "  \\"idade\\": 30\\n" +
              "}";

// Depois
String json = """
        {
          "nome": "Ana",
          "idade": 30
        }
        """;`}),e.jsx("h2",{children:"Indentação automática"}),e.jsx("p",{children:"O compilador olha a posição da menor indentação (geralmente das aspas finais) e remove essa quantidade de espaços de cada linha. Isso permite alinhar bonito no código sem que apareça espaço extra na string final:"}),e.jsx(i,{code:`String html = """
        <p>Olá!</p>
        """;
// Vira: "<p>Olá!</p>\\n" — sem os 8 espaços da indentação.`}),e.jsx("h2",{children:"Continuando linha sem quebrar"}),e.jsxs("p",{children:["Barra invertida no fim da linha junta com a próxima sem inserir ",e.jsx("code",{children:"\\\\n"}),":"]}),e.jsx(i,{code:`String texto = """
        Esse é um texto bem grande \\
        que cabe melhor em duas \\
        linhas no código fonte.
        """;
// Vira uma linha só (com quebra final).`}),e.jsx("h2",{children:"Casos onde brilha"}),e.jsx(i,{title:"SQL",code:`String sql = """
        SELECT p.id, p.nome, COUNT(c.id) AS total
        FROM produto p
        LEFT JOIN compra c ON c.produto_id = p.id
        WHERE p.ativo = true
        GROUP BY p.id, p.nome
        """;`}),e.jsx(i,{title:"JSON inline pra teste",code:`String body = """
        {
          "nome": "%s",
          "preco": %.2f
        }
        """.formatted(produto.nome(), produto.preco());`}),e.jsx(i,{title:"HTML / template",code:`String email = """
        <h1>Olá, %s!</h1>
        <p>Seu pedido nº %d foi confirmado.</p>
        """.formatted(usuario, pedido);`}),e.jsxs(a,{type:"info",title:"É String comum",children:["Text block ainda é ",e.jsx("code",{children:"String"})," normal. Vale tudo: ",e.jsx("code",{children:".formatted()"}),", concatenação, ",e.jsx("code",{children:"+"}),", regex, parsing."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Pegue um método antigo seu cheio de declarações ",e.jsx("code",{children:"HashMap<Long, List<...>>"}),"e troque pelo ",e.jsx("code",{children:"var"})," onde o tipo for óbvio. Avalie se ficou mais legível."]}),e.jsxs("li",{children:["Crie uma string com um JSON de 5 linhas usando text block e",e.jsx("code",{children:".formatted()"})," pra preencher dois valores dinâmicos."]}),e.jsx("li",{children:"Escreva uma query SQL multilinha como text block. Garanta que a indentação no código não vaze pra string final (imprima e confira)."})]})]})}export{n as default};
