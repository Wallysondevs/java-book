import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VarTextBlocks() {
  return (
    <PageContainer title="var & Text Blocks" subtitle="Java 10 e Java 13 trouxeram açúcar sintático que mudou o dia a dia." difficulty="iniciante" timeToRead="12 min">
        <h2>Por que você precisa disso</h2><p>
          Java tem fama (justa) de verboso. As versões modernas estão atacando isso. Duas melhorias simples salvam muito digitação no dia a dia: <code>var</code> pra deduzir tipos e <strong>text blocks</strong> pra strings multilinha sem dor.
        </p><h2>var (desde Java 10)</h2><p>
          <code>var</code> diz ao compilador: "se vira e descobre o tipo dessa variável local sozinho". Não é tipagem dinâmica — o tipo é fixado em tempo de compilação e nunca muda. É só uma economia de digitação.
        </p><CodeBlock title="Antes vs depois" code={`// Antes
ArrayList<Map<String, List<Pessoa>>> mapa = new ArrayList<>();

// Depois
var mapa = new ArrayList<Map<String, List<Pessoa>>>();`} /><AlertBox type="warning" title="var não é dynamic typing">
          <code>var x = 10;</code> deduz <code>int</code>. Depois disso, <code>x = "oi"</code>é erro de compilação. Diferente de Python ou JavaScript.
        </AlertBox><h2>Onde dá pra usar var</h2><ul>
          <li>Variáveis locais com inicialização (precisa do valor pra deduzir).</li><li>
            Em <code>for</code> e <code>for-each</code>.
          </li><li>Em try-with-resources.</li><li>Parâmetros de lambda (desde Java 11) — útil pra anotações.</li>
        </ul><CodeBlock code={`for (var i = 0; i < 10; i++) { /* i é int */ }

for (var pessoa : pessoas) { /* tipo deduzido do List */ }

try (var arq = new BufferedReader(new FileReader("a.txt"))) { /* ... */ }

// Lambda com var (Java 11+) — útil pra anotação
list.stream().map((@NotNull var x) -> x.toString());`} /><h2>Onde NÃO dá</h2><ul>
          <li>
            Campos de classe (<code>private var nome;</code> não compila).
          </li><li>Parâmetros de método.</li><li>Tipo de retorno.</li><li>
            Sem inicialização: <code>var x;</code> não compila.
          </li><li>
            Inicializando com <code>null</code> (sem como deduzir).
          </li><li>Inicializando com lambda ou array literal sem tipo.</li>
        </ul><h2>Quando var ajuda</h2><p>
          Quando o tipo é óbvio pelo lado direito. Repetir o mesmo nome dos dois lados é ruído:
        </p><CodeBlock code={`var clientes = new HashMap<String, Cliente>();
var stream   = arquivo.lines();
var resposta = httpClient.send(req, BodyHandlers.ofString());`} /><h2>Quando var atrapalha</h2><p>Quando o lado direito não diz o tipo claramente. Ler o código fica adivinhação:</p><CodeBlock code={`// Ruim — o que é x?
var x = service.processar(dados);

// Bom — você sabe sem rodar
Resultado x = service.processar(dados);`} /><AlertBox type="tip" title="Regra de bolso">
          Se você precisa abrir o IDE pra descobrir o tipo, escreva o tipo. Código se lê muitas vezes mais do que se escreve.
        </AlertBox><h2>Text Blocks (desde Java 13, oficial em Java 15)</h2><p>
          Cansou de <code>"linha1\\n" + "linha2\\n" + "linha3"</code>? Use três aspas duplas:
        </p><CodeBlock title="Antes vs depois" code={`// Antes
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
        """;`} /><h2>Indentação automática</h2><p>
          O compilador olha a posição da menor indentação (geralmente das aspas finais) e remove essa quantidade de espaços de cada linha. Isso permite alinhar bonito no código sem que apareça espaço extra na string final:
        </p><CodeBlock code={`String html = """
        <p>Olá!</p>
        """;
// Vira: "<p>Olá!</p>\\n" — sem os 8 espaços da indentação.`} /><h2>Continuando linha sem quebrar</h2><p>
          Barra invertida no fim da linha junta com a próxima sem inserir <code>\\n</code>:
        </p><CodeBlock code={`String texto = """
        Esse é um texto bem grande \\
        que cabe melhor em duas \\
        linhas no código fonte.
        """;
// Vira uma linha só (com quebra final).`} /><h2>Casos onde brilha</h2><CodeBlock title="SQL" code={`String sql = """
        SELECT p.id, p.nome, COUNT(c.id) AS total
        FROM produto p
        LEFT JOIN compra c ON c.produto_id = p.id
        WHERE p.ativo = true
        GROUP BY p.id, p.nome
        """;`} /><CodeBlock title="JSON inline pra teste" code={`String body = """
        {
          "nome": "%s",
          "preco": %.2f
        }
        """.formatted(produto.nome(), produto.preco());`} /><CodeBlock title="HTML / template" code={`String email = """
        <h1>Olá, %s!</h1>
        <p>Seu pedido nº %d foi confirmado.</p>
        """.formatted(usuario, pedido);`} /><AlertBox type="info" title="É String comum">
          Text block ainda é <code>String</code> normal. Vale tudo: <code>.formatted()</code>, concatenação, <code>+</code>, regex, parsing.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue um método antigo seu cheio de declarações <code>
              {"HashMap<Long, List<...>>"}
            </code>e troque pelo <code>var</code> onde o tipo for óbvio. Avalie se ficou mais legível.
          </li><li>
            Crie uma string com um JSON de 5 linhas usando text block e<code>.formatted()</code> pra preencher dois valores dinâmicos.
          </li><li>
            Escreva uma query SQL multilinha como text block. Garanta que a indentação no código não vaze pra string final (imprima e confira).
          </li>
        </ol>
      </PageContainer>
  );
}
