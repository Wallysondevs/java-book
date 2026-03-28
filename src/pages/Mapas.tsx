import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function Mapas() {
  return (
    <PageContainer
      title="Map e HashMap"
      subtitle="Dicionários Java: HashMap, LinkedHashMap, TreeMap, e os métodos modernos da interface Map."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Um <strong>Map</strong> é uma estrutura de dados que associa chaves a valores (como um dicionário).
        Cada chave é única. Java oferece várias implementações com diferentes características de
        ordenação e desempenho.
      </p>

      <h2>1. HashMap — O Map Mais Usado</h2>
      <CodeBlock
        language="java"
        code={`import java.util.*;

// HashMap<Chave, Valor>
Map<String, Integer> estoque = new HashMap<>();

// Inserindo
estoque.put("maçã", 50);
estoque.put("banana", 30);
estoque.put("laranja", 20);
estoque.put("maçã", 60);   // substitui o valor anterior!

// Lendo
int qtdMaca = estoque.get("maçã");              // 60
Integer qtdUva = estoque.get("uva");            // null (não existe)
int qtdPadrao = estoque.getOrDefault("uva", 0); // 0 (valor padrão)

// Verificando
boolean temBanana = estoque.containsKey("banana");  // true
boolean tem30 = estoque.containsValue(30);           // true

// Removendo
estoque.remove("laranja");
Integer removido = estoque.remove("banana"); // retorna o valor removido

// Tamanho
System.out.println(estoque.size()); // 1 (apenas maçã restou)

// Iterando — 3 formas
// 1. Por entradas (mais eficiente)
for (Map.Entry<String, Integer> entry : estoque.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}

// 2. Só chaves
for (String chave : estoque.keySet()) { }

// 3. Só valores
for (Integer valor : estoque.values()) { }

// 4. forEach com lambda (Java 8+)
estoque.forEach((chave, valor) ->
    System.out.printf("%s: %d unidades%n", chave, valor));`}
      />

      <h2>2. Métodos Modernos do Map (Java 8+)</h2>
      <CodeBlock
        language="java"
        code={`Map<String, Integer> contagem = new HashMap<>();

// putIfAbsent — insere APENAS se a chave não existir
contagem.putIfAbsent("java", 0);

// computeIfAbsent — calcula e insere se ausente
contagem.computeIfAbsent("python", k -> 0);

// merge — combina valor existente com novo valor
String texto = "java é legal java java";
for (String palavra : texto.split(" ")) {
    contagem.merge(palavra, 1, Integer::sum); // incrementa ou inicializa com 1
}
System.out.println(contagem); // {java=3, é=1, legal=1}

// compute — transforma o valor existente
contagem.compute("java", (k, v) -> v == null ? 1 : v + 1);

// replaceAll — aplica função a todos os valores
Map<String, Integer> precos = new HashMap<>(Map.of("banana", 3, "maçã", 5));
precos.replaceAll((produto, preco) -> preco + 1); // aumenta 1 em todos`}
      />

      <h2>3. LinkedHashMap e TreeMap</h2>
      <CodeBlock
        language="java"
        code={`// LinkedHashMap — mantém ORDEM DE INSERÇÃO
Map<String, Integer> pedido = new LinkedHashMap<>();
pedido.put("hamburguer", 25);
pedido.put("batata", 10);
pedido.put("refrigerante", 8);
System.out.println(pedido); // {hamburguer=25, batata=10, refrigerante=8}

// TreeMap — ordenado pela CHAVE (ordem natural ou Comparator)
Map<String, Integer> ranking = new TreeMap<>();
ranking.put("Carlos", 85);
ranking.put("Ana", 95);
ranking.put("Bruno", 78);
System.out.println(ranking); // {Ana=95, Bruno=78, Carlos=85}

// TreeMap tem métodos extras
TreeMap<String, Integer> tm = new TreeMap<>(ranking);
System.out.println(tm.firstKey()); // "Ana"
System.out.println(tm.lastKey());  // "Carlos"
System.out.println(tm.headMap("C")); // {Ana=95, Bruno=78} — menores que "C"
System.out.println(tm.tailMap("B")); // {Bruno=78, Carlos=85} — maiores ou iguais a "B"

// Map imutável (Java 9+)
Map<String, Integer> configuracao = Map.of(
    "timeout", 30,
    "maxRetries", 3,
    "maxConnections", 10
);
// configuracao.put("x", 1); // UnsupportedOperationException!

// Map.ofEntries para mais de 10 entradas
Map<String, String> grande = Map.ofEntries(
    Map.entry("chave1", "valor1"),
    Map.entry("chave2", "valor2")
);`}
      />

      <AlertBox type="info" title="HashMap e hashCode/equals">
        O HashMap usa <code>hashCode()</code> para encontrar o bucket e <code>equals()</code> para
        comparar chaves dentro do bucket. <strong>Se você usar um objeto como chave, SEMPRE sobrescreva
        ambos os métodos</strong>, ou use Records que os geram automaticamente.
      </AlertBox>

      <ParamTable
        comando="java.util.Map"
        descricaoHelp="Principais métodos da interface Map (HashMap, TreeMap, etc.)"
        params={[
          { flag: "put(K key, V value)", descricao: "Insere ou substitui o par chave-valor. Retorna o valor anterior (ou null).", exemplo: "map.put(\"nome\", \"Ana\");" },
          { flag: "get(Object key)", descricao: "Retorna o valor associado à chave, ou null se não existir.", exemplo: "map.get(\"nome\");" },
          { flag: "getOrDefault(key, def)", descricao: "Retorna o valor da chave ou o padrão se não existir.", exemplo: "map.getOrDefault(\"x\", 0);" },
          { flag: "containsKey(Object key)", descricao: "Retorna true se o mapa contém a chave.", exemplo: "map.containsKey(\"nome\");" },
          { flag: "containsValue(Object v)", descricao: "Retorna true se o mapa contém o valor. O(n).", exemplo: "map.containsValue(\"Ana\");" },
          { flag: "remove(Object key)", descricao: "Remove e retorna o valor associado à chave.", exemplo: "map.remove(\"nome\");" },
          { flag: "putIfAbsent(key, val)", descricao: "Insere somente se a chave não existir ou tiver valor null.", exemplo: "map.putIfAbsent(\"x\", 0);" },
          { flag: "merge(key, val, fn)", descricao: "Combina valor existente com novo usando a função fornecida.", exemplo: "map.merge(\"x\", 1, Integer::sum);" },
          { flag: "entrySet()", descricao: "Retorna Set das entradas (Map.Entry). Melhor forma de iterar.", exemplo: "map.entrySet().forEach(...);" },
          { flag: "keySet()", descricao: "Retorna Set de todas as chaves.", exemplo: "map.keySet();" },
          { flag: "values()", descricao: "Retorna Collection de todos os valores.", exemplo: "map.values();" },
        ]}
      />
    </PageContainer>
  );
}
