import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Collections() {
  return (
    <PageContainer title="Collections Framework" subtitle="List, Set, Map, Queue — o ecossistema de coleções da JDK." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Na vida real você quase nunca trabalha com um valor só: são listas de pedidos, conjuntos de usuários únicos, mapas de configurações, filas de tarefas. O <strong>Collections Framework</strong> é a caixa de ferramentas pronta da JDK pra isso. Saber escolher a coleção certa é o que separa código rápido de código que arrasta o servidor.
        </p><h2>O mapa mental</h2><p>
          Existem duas árvores de interfaces principais. <code>Collection</code> agrupa coisas que se comportam como "uma porção de elementos"; <code>Map</code> é separado porque associa <em>chaves a valores</em>.
        </p><CodeBlock title="Hierarquia simplificada" code={`Iterable
└── Collection
    ├── List   (ordenado, permite duplicados, acesso por índice)
    ├── Set    (sem duplicatas)
    └── Queue  (fila — geralmente FIFO)

Map           (chave única → valor)`} /><h2>Quando usar cada uma</h2><ul>
          <li>
            <strong>List</strong> — você precisa de ordem, acesso por índice ou itens repetidos. Pense numa playlist de músicas.
          </li><li>
            <strong>Set</strong> — não pode haver duplicatas. Pense em "usuários únicos que clicaram no botão hoje".
          </li><li>
            <strong>Map</strong> — você quer buscar algo por uma chave. Pense em dicionário: palavra → definição.
          </li><li>
            <strong>Queue</strong> — processar em ordem (FIFO). Pense numa fila do banco.<code>Deque</code> permite adicionar/remover dos dois lados.
          </li>
        </ul><h2>Interface vs implementação: o costume profissional</h2><p>
          Declare sempre pela <strong>interface</strong> e instancie a <strong>implementação</strong>. Isso te deixa trocar a implementação depois sem mexer no resto do código.
        </p><CodeBlock title="Padrão correto" code={`import java.util.*;

List<String> nomes = new ArrayList<>();      // não: ArrayList<String> nomes = ...
Set<Integer> ids   = new HashSet<>();
Map<String, Integer> idades = new HashMap<>();`} /><h2>Adicionando, lendo, iterando</h2><CodeBlock title="Operações básicas e for-each" code={`import java.util.*;

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
}`} /><p>
          Tudo que herda de <code>Iterable</code> funciona no <code>for-each</code>. Por isso <code>List</code>, <code>Set</code> e <code>Queue</code> aceitam o loop direto. Já o <code>Map</code> não é Iterable — você itera por <code>entrySet()</code>, <code>keySet()</code> ou <code>values()</code>.
        </p><h2>Fábricas modernas: List.of, Set.of, Map.of (Java 9+)</h2><p>
          Para coleções <strong>imutáveis</strong>, criadas em uma linha com valores fixos, use os métodos <code>.of()</code>. São perfeitas para constantes e dados que não mudam.
        </p><CodeBlock title="Fábricas imutáveis" code={`import java.util.*;

List<String> cores  = List.of("vermelho", "verde", "azul");
Set<Integer> primos = Set.of(2, 3, 5, 7, 11);
Map<String, Integer> precos = Map.of(
    "café",  6,
    "bolo", 12,
    "suco",  9
);

// cores.add("amarelo");  // UnsupportedOperationException!`} /><AlertBox type="warning" title="Imutável de verdade">
          Tentar modificar uma coleção criada por <code>.of()</code> joga <code>UnsupportedOperationException</code> em runtime. Isso é proposital: imutabilidade previne uma classe inteira de bugs.
        </AlertBox><h2>Collections.unmodifiableList: envolvendo uma mutável</h2><p>
          Se você já tem uma lista mutável e quer expor uma "vista" que não pode ser alterada por quem chamar (clássico em getters), envolva com <code>Collections.unmodifiableList</code>.
        </p><CodeBlock title="View imutável de uma lista interna" code={`import java.util.*;

public class Carrinho {
    private final List<String> itens = new ArrayList<>();

    public void adicionar(String item) {
        itens.add(item);
    }

    public List<String> getItens() {
        // quem receber não consegue alterar
        return Collections.unmodifiableList(itens);
    }
}`} /><h2>Iterable, Iterator e for-each</h2><p>
          Por baixo dos panos, o <code>for-each</code> usa um <code>Iterator</code>. Você raramente precisa lidar com ele diretamente — exceto quando quer <strong>remover</strong> elementos com segurança durante a iteração (mais sobre isso na página de List).
        </p><CodeBlock title="Iterator manual" code={`Iterator<String> it = frutas.iterator();
while (it.hasNext()) {
    String f = it.next();
    if (f.startsWith("b")) {
        it.remove(); // remoção segura durante iteração
    }
}`} /><h2>Coleções e threads</h2><p>
          As coleções padrão (<code>ArrayList</code>, <code>HashMap</code>...) <strong>não são seguras</strong> para acesso simultâneo por múltiplas threads. Se você compartilha entre threads, use o pacote <code>java.util.concurrent</code>:
        </p><ul>
          <li>
            <code>ConcurrentHashMap</code> — versão thread-safe e rápida do HashMap.
          </li><li>
            <code>CopyOnWriteArrayList</code> — boa para listas com muita leitura, pouca escrita.
          </li><li>
            <code>BlockingQueue</code> — filas para produtor/consumidor.
          </li>
        </ul><AlertBox type="info" title="Synchronized é o jeito antigo">
          <code>Collections.synchronizedList(...)</code> existe, mas é menos eficiente que as alternativas de <code>java.util.concurrent</code>. Prefira as concorrentes em código novo.
        </AlertBox><h2>Resumo decisório</h2><ul>
          <li>
            Lista de coisas com ordem? <strong>ArrayList</strong>.
          </li><li>
            Sem duplicatas, ordem não importa? <strong>HashSet</strong>.
          </li><li>
            Sem duplicatas, ordem natural? <strong>TreeSet</strong>.
          </li><li>
            Buscar por chave? <strong>HashMap</strong>.
          </li><li>
            Constante imutável? <strong>List.of / Set.of / Map.of</strong>.
          </li><li>
            Multi-thread? <strong>ConcurrentHashMap</strong> e amigos.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              {"List<String>"}
            </code> com 5 nomes e itere imprimindo "Olá, X" para cada um. Depois converta a mesma lista em um <code>Set</code> e veja o que acontece se houver repetição.
          </li><li>
            Crie um <code>
              {"Map<String, Integer>"}
            </code> com 3 produtos e seus preços usando <code>Map.of</code>. Tente adicionar um quarto e observe o erro. Depois recrie como <code>HashMap</code> e adicione com sucesso.
          </li><li>
            Faça uma classe <code>Estoque</code> com uma <code>List</code> interna mutável e um getter que retorna <code>Collections.unmodifiableList</code>. Tente alterar a lista externa e veja o erro.
          </li>
        </ol>
      </PageContainer>
  );
}
