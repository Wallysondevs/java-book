import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function Colecoes() {
  return (
    <PageContainer
      title="Collections — List e Set"
      subtitle="ArrayList, LinkedList, HashSet, TreeSet — o Collections Framework do Java com exemplos práticos."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        O Java Collections Framework oferece estruturas de dados prontas, eficientes e flexíveis.
        As principais interfaces são <strong>List</strong> (ordenado, permite duplicatas),
        <strong>Set</strong> (sem duplicatas) e <strong>Queue</strong> (fila).
      </p>

      <h2>1. List — ArrayList</h2>
      <CodeBlock
        language="java"
        code={`import java.util.*;

// ArrayList — implementação mais usada de List
List<String> frutas = new ArrayList<>();

// Adicionando
frutas.add("maçã");
frutas.add("banana");
frutas.add("laranja");
frutas.add(1, "manga");    // insere na posição 1

System.out.println(frutas); // [maçã, manga, banana, laranja]

// Acessando
String primeira = frutas.get(0);     // "maçã"
int tamanho = frutas.size();         // 4
boolean temBanana = frutas.contains("banana"); // true
int indice = frutas.indexOf("laranja");        // 3

// Modificando
frutas.set(0, "abacaxi"); // substitui posição 0

// Removendo
frutas.remove("banana");  // remove por valor
frutas.remove(0);         // remove por índice

// Iterando
for (String f : frutas) System.out.println(f);

// Com forEach e lambda
frutas.forEach(f -> System.out.println(f.toUpperCase()));

// Ordenando
Collections.sort(frutas);
frutas.sort(Comparator.naturalOrder());
frutas.sort(Comparator.reverseOrder());
frutas.sort(Comparator.comparingInt(String::length)); // por tamanho

// Convertendo
List<String> imutavel = List.of("a", "b", "c"); // imutável (Java 9+)
List<String> copia = new ArrayList<>(imutavel);  // cópia mutável`}
      />

      <h2>2. LinkedList — Lista Encadeada</h2>
      <CodeBlock
        language="java"
        code={`LinkedList<String> fila = new LinkedList<>();

// Operações eficientes nas extremidades
fila.addFirst("primeiro");
fila.addLast("último");
fila.add("meio");

System.out.println(fila.getFirst()); // "primeiro"
System.out.println(fila.getLast());  // "último"
System.out.println(fila.peekFirst());// olha sem remover

fila.removeFirst(); // remove e retorna o primeiro
fila.removeLast();  // remove e retorna o último

// Como fila (FIFO)
Queue<String> pedidos = new LinkedList<>();
pedidos.offer("pedido1"); // adiciona ao final
pedidos.offer("pedido2");
String proximo = pedidos.poll(); // remove e retorna o primeiro

// Como pilha (LIFO) — prefira Deque
Deque<String> pilha = new ArrayDeque<>();
pilha.push("item1");
pilha.push("item2");
String topo = pilha.pop(); // "item2"`}
      />

      <h2>3. Set — Sem Duplicatas</h2>
      <CodeBlock
        language="java"
        code={`// HashSet — sem ordem garantida, O(1) para add/remove/contains
Set<String> cores = new HashSet<>();
cores.add("vermelho");
cores.add("azul");
cores.add("verde");
cores.add("vermelho"); // ignorado! já existe

System.out.println(cores.size()); // 3
System.out.println(cores.contains("azul")); // true

// LinkedHashSet — mantém ordem de inserção
Set<String> ordenado = new LinkedHashSet<>();
ordenado.add("banana");
ordenado.add("maçã");
ordenado.add("laranja");
System.out.println(ordenado); // [banana, maçã, laranja]

// TreeSet — ordenado naturalmente (ou por Comparator)
Set<Integer> numeros = new TreeSet<>();
numeros.addAll(Arrays.asList(5, 2, 8, 1, 9));
System.out.println(numeros); // [1, 2, 5, 8, 9]

// Operações de conjunto
Set<Integer> a = new HashSet<>(Set.of(1, 2, 3, 4));
Set<Integer> b = new HashSet<>(Set.of(3, 4, 5, 6));

Set<Integer> uniao = new HashSet<>(a);
uniao.addAll(b); // {1, 2, 3, 4, 5, 6}

Set<Integer> intersecao = new HashSet<>(a);
intersecao.retainAll(b); // {3, 4}

Set<Integer> diferenca = new HashSet<>(a);
diferenca.removeAll(b); // {1, 2}`}
      />

      <AlertBox type="info" title="Qual implementação de List usar?">
        <strong>ArrayList</strong>: acesso por índice O(1), inserção/remoção no meio O(n). Use em 99% dos casos.<br />
        <strong>LinkedList</strong>: inserção/remoção nas extremidades O(1), acesso por índice O(n). Use como fila ou pilha.<br />
        <strong>HashSet</strong>: lookup O(1), sem ordem. Ideal para verificação de duplicatas.<br />
        <strong>TreeSet</strong>: lookup O(log n), ordenado. Use quando precisar de ordenação automática.
      </AlertBox>

      <ParamTable
        comando="java.util.List"
        descricaoHelp="Principais métodos da interface List (ArrayList, LinkedList, etc.)"
        params={[
          { flag: "add(E e)", descricao: "Adiciona elemento ao final da lista.", exemplo: "lista.add(\"item\");" },
          { flag: "add(int i, E e)", descricao: "Insere elemento na posição especificada, deslocando os demais.", exemplo: "lista.add(0, \"primeiro\");" },
          { flag: "get(int i)", descricao: "Retorna o elemento na posição i. Lança IndexOutOfBoundsException se inválido.", exemplo: "lista.get(0);" },
          { flag: "set(int i, E e)", descricao: "Substitui o elemento na posição i e retorna o elemento anterior.", exemplo: "lista.set(1, \"novo\");" },
          { flag: "remove(int i)", descricao: "Remove e retorna o elemento na posição i.", exemplo: "lista.remove(0);" },
          { flag: "remove(Object o)", descricao: "Remove a primeira ocorrência do objeto especificado.", exemplo: "lista.remove(\"banana\");" },
          { flag: "size()", descricao: "Retorna o número de elementos na lista.", exemplo: "lista.size();" },
          { flag: "contains(Object o)", descricao: "Retorna true se a lista contém o elemento.", exemplo: "lista.contains(\"Java\");" },
          { flag: "indexOf(Object o)", descricao: "Retorna o índice da primeira ocorrência, ou -1 se não encontrado.", exemplo: "lista.indexOf(\"maçã\");" },
          { flag: "sort(Comparator c)", descricao: "Ordena a lista usando o Comparator. Null usa a ordem natural.", exemplo: "lista.sort(null);" },
          { flag: "subList(from, to)", descricao: "Retorna uma view da lista entre from (inclusivo) e to (exclusivo).", exemplo: "lista.subList(1, 3);" },
          { flag: "toArray()", descricao: "Converte a lista para um array Object[].", exemplo: "lista.toArray();" },
        ]}
      />
    </PageContainer>
  );
}
