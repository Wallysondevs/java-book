import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MapPage() {
  return (
    <PageContainer title="Map: HashMap, LinkedHashMap, TreeMap" subtitle="Chave → Valor, a estrutura mais útil de toda a biblioteca." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Map é <em>dicionário</em>, <em>tabela</em>, <em>índice</em>. Toda vez que você precisa responder rápido a "qual o valor associado a essa chave?" — preço de um produto pelo código, configuração por nome, contador por palavra — Map é a resposta. É de longe a coleção mais útil da JDK.
        </p><h2>O conceito</h2><p>
          <code>
            {"Map<K, V>"}
          </code> guarda pares "chave única → valor". Não pode ter duas entradas com a mesma chave; se você fizer <code>put</code> de novo na mesma chave, o valor antigo é substituído.
        </p><AlertBox type="info" title="Map não é Collection">
          Map fica fora da hierarquia de <code>Collection</code> porque o conceito é diferente (pares, não elementos). Você itera por <code>entrySet()</code>, <code>keySet()</code> ou <code>values()</code>.
        </AlertBox><h2>As três implementações principais</h2><h3>HashMap — o padrão</h3><p>
          Tabela hash. Operações em <strong>O(1)</strong> em média. Não preserva ordem. É o que você usa em 95% dos casos.
        </p><h3>LinkedHashMap — ordem de inserção</h3><p>
          Mesma performance <strong>O(1)</strong>, mas iterar devolve as entradas na ordem em que foram inseridas. Útil para JSON previsível, caches LRU (tem modo "ordem de acesso") e relatórios.
        </p><h3>TreeMap — chaves ordenadas</h3><p>
          Árvore balanceada. <strong>O(log n)</strong>. Iteração em ordem natural das chaves (ou Comparator). Tem operações como <code>firstKey</code>, <code>floorKey</code>, <code>headMap</code>.
        </p><CodeBlock title="As três em ação" code={`import java.util.*;

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
System.out.println(tree);    // {abacate=12, banana=5, uva=8}`} /><h2>Métodos essenciais</h2><CodeBlock title="O kit básico" code={`Map<String, Integer> precos = new HashMap<>();

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
precos.clear();`} /><h2>putIfAbsent e computeIfAbsent</h2><p>
          Padrão clássico: "se não existe, cria; se existe, mantém". Em vez de checar e fazer <code>put</code> manualmente, use os métodos prontos.
        </p><CodeBlock title="Inicialização preguiçosa" code={`Map<String, List<String>> tarefasPorPessoa = new HashMap<>();

// chato: precisa checar
if (!tarefasPorPessoa.containsKey("Ana")) {
    tarefasPorPessoa.put("Ana", new ArrayList<>());
}
tarefasPorPessoa.get("Ana").add("estudar");

// limpo: cria a lista só se faltar
tarefasPorPessoa
    .computeIfAbsent("Bruno", k -> new ArrayList<>())
    .add("ler livro");`} /><h2>Iterando: três jeitos</h2><CodeBlock title="entrySet (mais comum, dá chave e valor)" code={`for (Map.Entry<String, Integer> entry : precos.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}`} /><CodeBlock title="keySet (só as chaves)" code={`for (String chave : precos.keySet()) {
    System.out.println(chave);
}`} /><CodeBlock title="values (só os valores)" code={`for (Integer v : precos.values()) {
    System.out.println(v);
}`} /><CodeBlock title="forEach com lambda (Java 8+)" code={`precos.forEach((chave, valor) ->
    System.out.println(chave + " custa R$" + valor)
);`} /><h2>Map.of: imutável e direto</h2><p>
          Desde Java 9, <code>Map.of</code> cria mapas imutáveis em uma linha. Suporta até 10 pares; para mais, use <code>Map.ofEntries</code>.
        </p><CodeBlock title="Map.of e Map.ofEntries" code={`Map<String, Integer> diasMes = Map.of(
    "jan", 31,
    "fev", 28,
    "mar", 31
);

Map<String, String> grandes = Map.ofEntries(
    Map.entry("BR", "Brasil"),
    Map.entry("AR", "Argentina"),
    Map.entry("CL", "Chile")
);`} /><h2>A chave precisa ter equals/hashCode coerentes</h2><p>
          Mesma regra do Set: a chave é localizada pelo hash e comparada por equals. Use <code>String</code>, números, enums ou <code>record</code> e você está em paz. Se for uma classe sua, implemente os dois (a IDE gera).
        </p><AlertBox type="danger" title="Não mude a chave depois de inserir">
          Se você muta a chave de um jeito que muda o hashCode, o Map perde a entrada. Por isso chaves devem ser imutáveis (Strings e records são perfeitos).
        </AlertBox><h2>null como chave: cuidado</h2><ul>
          <li>
            <code>HashMap</code> permite <strong>uma</strong> chave null (e quantos values null quiser).
          </li><li>
            <code>LinkedHashMap</code> idem.
          </li><li>
            <code>TreeMap</code> <strong>não permite</strong> chave null (joga NullPointerException).
          </li><li>
            <code>Map.of</code> não permite null nem em chave nem em valor.
          </li>
        </ul><h2>Map.Entry: o par como objeto</h2><p>
          Cada par é um <code>
            {"Map.Entry<K, V>"}
          </code>. Você pode pegar com <code>getKey</code> e <code>getValue</code>, ou criar avulso com <code>Map.entry(...)</code>.
        </p><CodeBlock title="Trabalhando com Map.Entry" code={`var par = Map.entry("idade", 30);
System.out.println(par.getKey() + " = " + par.getValue());`} /><h2>Exemplo completo: contador de palavras</h2><CodeBlock title="Contando ocorrências com merge" code={`import java.util.*;

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
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              {"HashMap<String, Double>"}
            </code> com nome de produto e preço. Escreva uma função que dado um nome retorna o preço, ou 0.0 se não existir (use <code>getOrDefault</code>).
          </li><li>
            Receba uma frase do usuário e imprima <strong>quantas vezes cada palavra aparece</strong> (use <code>merge</code> ou <code>computeIfAbsent</code>).
          </li><li>
            Compare a iteração de <code>HashMap</code>, <code>LinkedHashMap</code> e <code>TreeMap</code> populando os três com as mesmas 5 chaves fora de ordem alfabética. Imprima cada um e observe a diferença.
          </li>
        </ol>
      </PageContainer>
  );
}
