import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Arrays() {
  return (
    <PageContainer title="Arrays" subtitle="Tamanho fixo, indexados em zero — e como passar pra ArrayList quando precisar crescer." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Array é o jeito mais primitivo (e mais rápido) de guardar uma coleção de valores em Java. Pense numa fileira de gavetas numeradas a partir do zero: cada uma guarda um valor do mesmo tipo. Você usa array quando o tamanho não muda e performance importa. Quando precisar crescer, troca por <code>ArrayList</code>.
        </p><h2>Declaração e inicialização</h2><p>
          Array tem tamanho fixo definido na criação. Em Java, prefira a forma <code>tipo[] nome</code> (colchetes do lado do tipo).
        </p><CodeBlock title="Várias formas de criar" code={`public class CriarArray {
    public static void main(String[] args) {
        // 1) tamanho conhecido, valores default (0 para int)
        int[] a = new int[5];

        // 2) inicializar com valores
        int[] b = {10, 20, 30, 40};

        // 3) explícito
        String[] c = new String[]{"java", "kotlin", "scala"};

        System.out.println(a[0]);  // 0
        System.out.println(b[2]);  // 30
        System.out.println(c[1]);  // kotlin
    }
}`} /><AlertBox type="note" title="Valores default">
          Array recém-criado vem preenchido com zero (numéricos), <code>false</code> (boolean) ou <code>null</code> (objetos). Não fica com lixo de memória como em C.
        </AlertBox><h2>.length é propriedade, não método</h2><p>
          Esse é um detalhe que pega quem vem de outras linguagens. No array é <code>arr.length</code> (sem parênteses). Em <code>String</code> e em coleções é método: <code>s.length()</code>, <code>list.size()</code>.
        </p><CodeBlock title="length" code={`int[] nums = {1, 2, 3, 4, 5};
System.out.println(nums.length);  // 5  — sem ()`} /><h2>Índice começa em zero — e cuidado com o limite</h2><p>
          O primeiro elemento é <code>arr[0]</code>, o último é <code>arr[arr.length - 1]</code>. Acessar fora dos limites lança <code>ArrayIndexOutOfBoundsException</code>.
        </p><CodeBlock code={`int[] nums = {10, 20, 30};
System.out.println(nums[0]);   // 10
System.out.println(nums[2]);   // 30
// System.out.println(nums[3]); // ArrayIndexOutOfBoundsException`} /><h2>Arrays multidimensionais</h2><p>
          Java na verdade não tem array 2D — tem array de arrays. Isso permite linhas com tamanhos diferentes (<em>jagged arrays</em>).
        </p><CodeBlock title="Matriz 3x3" code={`int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}`} /><h2>Imprimir array: use Arrays.toString</h2><p>
          Se você fizer <code>System.out.println(arr)</code> direto, vai sair algo tipo <code>[I@1540e19d</code> (referência). Pra ver o conteúdo, use <code>java.util.Arrays.toString</code>:
        </p><CodeBlock code={`import java.util.Arrays;

int[] nums = {3, 1, 4, 1, 5, 9, 2, 6};
System.out.println(Arrays.toString(nums));
// [3, 1, 4, 1, 5, 9, 2, 6]

int[][] m = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(m));
// [[1, 2], [3, 4]]`} /><h2>Utilitários da classe Arrays</h2><p>
          A classe <code>java.util.Arrays</code> tem muito helper útil:
        </p><CodeBlock title="sort, fill, copyOf, equals" code={`import java.util.Arrays;

int[] nums = {5, 2, 8, 1, 9};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums));  // [1, 2, 5, 8, 9]

int[] zeros = new int[5];
Arrays.fill(zeros, 7);
System.out.println(Arrays.toString(zeros)); // [7, 7, 7, 7, 7]

int[] copia = Arrays.copyOf(nums, 3);
System.out.println(Arrays.toString(copia)); // [1, 2, 5]

int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b);                 // false (referências diferentes)
System.out.println(Arrays.equals(a, b));    // true (conteúdo igual)`} /><AlertBox type="warning" title="== compara referência, não conteúdo">
          Esse erro é frequente. Pra comparar dois arrays elemento por elemento, sempre use <code>Arrays.equals</code> (ou <code>Arrays.deepEquals</code> pra multidimensional).
        </AlertBox><h2>Iterando: for clássico vs for-each</h2><CodeBlock title="Quando usar cada um" code={`int[] nums = {10, 20, 30, 40};

// for clássico — preciso do índice
for (int i = 0; i < nums.length; i++) {
    System.out.println(i + ": " + nums[i]);
}

// for-each — só leitura
for (int n : nums) {
    System.out.println(n);
}`} /><p>
          Lembre: <code>for-each</code> não dá pra <em>modificar</em> o array com <code>n = 99</code> (você só altera a variável local). Use <code>for</code> clássico se precisa atribuir.
        </p><h2>Array vs List — quando trocar</h2><ul>
          <li>
            <strong>Array:</strong> tamanho fixo, performance bruta, primitivos sem boxing (<code>int[]</code> é mais leve que <code>
              {"List<Integer>"}
            </code>).
          </li><li>
            <strong>List (ArrayList):</strong> cresce sozinho, tem <code>add</code>, <code>remove</code>, integração com Stream e Collections. Para 99% dos casos do dia a dia, prefira List.
          </li>
        </ul><CodeBlock title="De array pra ArrayList" code={`import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

String[] arr = {"a", "b", "c"};
List<String> lista = new ArrayList<>(Arrays.asList(arr));
lista.add("d");
System.out.println(lista);  // [a, b, c, d]`} /><h2>System.arraycopy: cópia rápida</h2><p>
          Pra cópias grandes, <code>System.arraycopy</code> é mais rápido que loop manual — usa instrução nativa por baixo. Assinatura: <code>arraycopy(origem, posOrig, destino, posDest, tamanho)</code>.
        </p><CodeBlock code={`int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[5];
System.arraycopy(origem, 1, destino, 0, 3);
System.out.println(java.util.Arrays.toString(destino));
// [2, 3, 4, 0, 0]`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>int[]</code> com 10 números aleatórios (use <code>Math.random()</code> × 100), ordene com <code>Arrays.sort</code> e imprima com <code>Arrays.toString</code>.
          </li><li>
            Escreva um método <code>boolean contem(int[] arr, int valor)</code> que devolve <code>true</code> se o valor está no array. Faça com <code>for-each</code>.
          </li><li>
            Crie uma matriz <code>int[][]</code> 4x4 e preencha com a tabuada (linha × coluna). Imprima formatado com <code>Arrays.deepToString</code> e depois com loop aninhado em colunas alinhadas.
          </li>
        </ol>
      </PageContainer>
  );
}
