import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListPage() {
  return (
    <PageContainer title="List: ArrayList & LinkedList" subtitle="A coleção mais usada de Java — mas qual implementação escolher?" difficulty="intermediario" timeToRead="18 min">
        <h2>Por que você precisa disso</h2><p>
          90% do tempo, quando você precisa guardar uma porção de coisas em ordem, é uma <code>List</code>. Lista de tarefas, mensagens de chat, linhas de um CSV. Saber escolher entre <code>ArrayList</code> e <code>LinkedList</code> faz diferença real em performance — mas o veredito final é mais simples do que parece.
        </p><h2>List é uma interface</h2><p>
          <code>
            {"List<E>"}
          </code> é o contrato: "coleção ordenada com acesso por índice". Quem cumpre o contrato? Várias classes. As duas que importam:
        </p><ul>
          <li>
            <strong>ArrayList</strong> — array dinâmico por baixo.
          </li><li>
            <strong>LinkedList</strong> — lista duplamente ligada.
          </li>
        </ul><CodeBlock title="Sempre declare pela interface" code={`import java.util.*;

List<String> tarefas = new ArrayList<>();
tarefas.add("estudar Java");
tarefas.add("fazer café");
tarefas.add("commitar");`} /><h2>ArrayList: o padrão</h2><p>
          Por dentro é um <code>Object[]</code> que cresce sozinho quando enche. Acesso por índice é direto — pular pro <code>get(500)</code> custa o mesmo que <code>get(0)</code>: <strong>O(1)</strong>. Por outro lado, inserir ou remover no <em>meio</em> obriga a deslocar todos os elementos depois: <strong>O(n)</strong>.
        </p><h2>LinkedList: o caso especial</h2><p>
          Cada elemento é um nó com ponteiros pro anterior e pro próximo. Inserir/remover nas extremidades é <strong>O(1)</strong>. Mas pegar o elemento na posição 500? Java percorre nó por nó: <strong>O(n)</strong>.
        </p><AlertBox type="tip" title="Veredito prático">
          <strong>Use ArrayList sempre.</strong> Só troque por LinkedList se você fez <em>medição</em> e tem muita inserção/remoção nas pontas. Na prática, a localidade de memória do ArrayList ganha quase sempre — inclusive em casos onde a teoria diria o contrário.
        </AlertBox><h2>Métodos essenciais</h2><CodeBlock title="Operações que você usa todo dia" code={`import java.util.*;

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
}`} /><AlertBox type="warning" title="subList é uma view, não uma cópia">
          Modificar o subList altera a lista original (e vice-versa). Se você quer cópia independente, faça <code>
            {"new ArrayList<>(lista.subList(...))"}
          </code>.
        </AlertBox><h2>Três jeitos de iterar</h2><CodeBlock title="for-each (o mais comum)" code={`for (String n : nomes) {
    System.out.println(n);
}`} /><CodeBlock title="for tradicional com índice (quando precisa do índice)" code={`for (int i = 0; i < nomes.size(); i++) {
    System.out.println(i + ": " + nomes.get(i));
}`} /><CodeBlock title="Iterator (quando precisa remover durante a iteração)" code={`Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    String n = it.next();
    if (n.startsWith("B")) {
        it.remove(); // SEGURO
    }
}`} /><AlertBox type="danger" title="Não remova durante for-each">
          Chamar <code>nomes.remove(...)</code> dentro de um <code>for-each</code> joga <code>ConcurrentModificationException</code>. Use <code>Iterator.remove()</code>, ou <code>list.removeIf(...)</code> que é mais elegante:
        </AlertBox><CodeBlock title="removeIf — o jeito moderno" code={"nomes.removeIf(n -> n.startsWith(\"B\"));"} /><h2>Ordenando</h2><p>
          <code>List.sort</code> ordena no lugar. Sem argumento, usa a ordem natural (precisa que os elementos implementem <code>Comparable</code>). Com um <code>Comparator</code>, você define a ordem que quiser. Isso vai aparecer com mais detalhes na página de Comparable & Comparator.
        </p><CodeBlock title="Sort em ação" code={`import java.util.*;

List<String> palavras = new ArrayList<>(List.of("uva", "abacate", "mamão"));

palavras.sort(null);                   // ordem natural (alfabética)
System.out.println(palavras);          // [abacate, mamão, uva]

palavras.sort(Comparator.reverseOrder());
System.out.println(palavras);          // [uva, mamão, abacate]

// alternativa equivalente
Collections.sort(palavras);`} /><h2>Conversões úteis</h2><CodeBlock title="De array para List e vice-versa" code={`String[] arr = {"a", "b", "c"};

// array -> List (mutável de tamanho fixo, cuidado!)
List<String> view = Arrays.asList(arr);

// melhor: cópia mutável real
List<String> copia = new ArrayList<>(Arrays.asList(arr));

// List -> array
String[] arr2 = copia.toArray(new String[0]);`} /><h2>List.copyOf: cópia imutável</h2><p>
          Desde Java 10, <code>List.copyOf(outraLista)</code> devolve uma cópia imutável. Útil para snapshots ou quando você quer congelar uma lista que recebeu de fora.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>
              {"ArrayList<Integer>"}
            </code> com os números de 1 a 10. Remova todos os pares usando <code>removeIf</code>. Imprima o resultado.
          </li><li>
            Faça um programa que recebe vários nomes do usuário (<code>Scanner</code>) até ele digitar "fim". Guarde numa <code>List</code> e no final imprima ordenado alfabeticamente.
          </li><li>
            Dada a lista <code>List.of("banana", "uva", "abacate", "uva")</code>, conte quantas vezes "uva" aparece. (Dica: percorra com for-each ou use <code>Collections.frequency</code>.)
          </li>
        </ol>
      </PageContainer>
  );
}
