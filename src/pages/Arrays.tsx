import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function Arrays() {
  return (
    <PageContainer
      title="Arrays"
      subtitle="Arrays unidimensionais, multidimensionais, e a classe java.util.Arrays com seus métodos utilitários."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Um array é uma estrutura de dados que armazena múltiplos valores do mesmo tipo em posições
        contíguas na memória. Em Java, arrays têm tamanho fixo definido na criação e são indexados
        a partir de zero.
      </p>

      <h2>1. Declaração e Criação</h2>
      <CodeBlock
        language="java"
        code={`// Declaração e criação separadas
int[] numeros;            // declaração (preferida — colchete junto ao tipo)
numeros = new int[5];     // cria array de 5 inteiros (inicializados com 0)

// Declaração + criação
double[] precos = new double[10]; // inicializados com 0.0
String[] nomes  = new String[3];  // inicializados com null
boolean[] flags = new boolean[4]; // inicializados com false

// Declaração + inicialização com valores
int[] pares = {2, 4, 6, 8, 10};
String[] frutas = {"maçã", "banana", "laranja", "uva"};
int[] zeros = new int[]{0, 0, 0}; // forma alternativa

// Tamanho do array
System.out.println(frutas.length); // 4 (não é método, é atributo!)`}
      />

      <h2>2. Acessando e Modificando Elementos</h2>
      <CodeBlock
        language="java"
        code={`String[] frutas = {"maçã", "banana", "laranja"};

// Acesso por índice (começa em 0)
System.out.println(frutas[0]); // "maçã"
System.out.println(frutas[2]); // "laranja"

// Modificação
frutas[1] = "morango";
System.out.println(frutas[1]); // "morango"

// CUIDADO: ArrayIndexOutOfBoundsException
// frutas[5]; // lança exceção — índice fora do limite!

// Percorrendo com for clássico (acesso ao índice)
for (int i = 0; i < frutas.length; i++) {
    System.out.printf("[%d] %s%n", i, frutas[i]);
}

// Percorrendo com for-each (mais limpo quando não precisa do índice)
for (String fruta : frutas) {
    System.out.println(fruta);
}`}
      />

      <h2>3. Arrays Multidimensionais</h2>
      <CodeBlock
        language="java"
        code={`// Array 2D (matriz)
int[][] matriz = new int[3][4]; // 3 linhas, 4 colunas

// Inicialização direta
int[][] tabela = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Acesso: [linha][coluna]
System.out.println(tabela[0][0]); // 1
System.out.println(tabela[1][2]); // 6
System.out.println(tabela[2][1]); // 8

// Percorrendo matriz com for aninhado
for (int i = 0; i < tabela.length; i++) {
    for (int j = 0; j < tabela[i].length; j++) {
        System.out.printf("%3d", tabela[i][j]);
    }
    System.out.println();
}

// Arrays "irregulares" (jagged arrays — linhas com tamanhos diferentes)
int[][] irregular = new int[3][];
irregular[0] = new int[]{1};
irregular[1] = new int[]{2, 3};
irregular[2] = new int[]{4, 5, 6};`}
      />

      <h2>4. Classe java.util.Arrays</h2>
      <CodeBlock
        language="java"
        code={`import java.util.Arrays;

int[] nums = {5, 2, 8, 1, 9, 3};

// Ordenar (modifica o array original)
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // [1, 2, 3, 5, 8, 9]

// Busca binária (array deve estar ordenado!)
int pos = Arrays.binarySearch(nums, 5); // índice do elemento 5
System.out.println(pos); // 3

// Preencher com um valor
int[] zeros = new int[5];
Arrays.fill(zeros, 7);
System.out.println(Arrays.toString(zeros)); // [7, 7, 7, 7, 7]

// Copiar
int[] original = {1, 2, 3, 4, 5};
int[] copia = Arrays.copyOf(original, 3);         // [1, 2, 3] — tamanho novo
int[] trecho = Arrays.copyOfRange(original, 1, 4); // [2, 3, 4] — início, fim (exclusivo)

// Comparar
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(Arrays.equals(a, b)); // true

// Converter para String
System.out.println(Arrays.toString(original));    // [1, 2, 3, 4, 5]
int[][] mat = {{1,2},{3,4}};
System.out.println(Arrays.deepToString(mat));     // [[1, 2], [3, 4]]`}
      />

      <AlertBox type="info" title="Array vs ArrayList">
        Arrays têm <strong>tamanho fixo</strong> e são mais eficientes em memória.
        <code>ArrayList</code> é <strong>dinâmico</strong> e mais fácil de usar (adicionar/remover elementos).
        Prefira <code>ArrayList</code> quando o tamanho varia; use arrays para dados de tamanho conhecido
        ou operações de baixo nível.
      </AlertBox>

      <ParamTable
        comando="java.util.Arrays"
        descricaoHelp="Métodos estáticos da classe Arrays para manipulação de arrays em Java."
        params={[
          { flag: "Arrays.sort(arr)", descricao: "Ordena o array in-place em ordem crescente. Para objetos, usa compareTo(). Para ordem decrescente, use sort com Comparator.", exemplo: "Arrays.sort(nums);" },
          { flag: "Arrays.binarySearch(arr, val)", descricao: "Busca binária em array ORDENADO. Retorna o índice se encontrado, valor negativo se não.", exemplo: "Arrays.binarySearch(nums, 5);" },
          { flag: "Arrays.fill(arr, val)", descricao: "Preenche todos os elementos com o valor especificado.", exemplo: "Arrays.fill(arr, 0);" },
          { flag: "Arrays.copyOf(arr, len)", descricao: "Cria uma cópia com o tamanho especificado. Se maior, preenche com 0/null.", exemplo: "Arrays.copyOf(arr, 3);" },
          { flag: "Arrays.copyOfRange(arr, from, to)", descricao: "Copia um trecho do array de from (inclusivo) até to (exclusivo).", exemplo: "Arrays.copyOfRange(arr, 1, 4);" },
          { flag: "Arrays.equals(a, b)", descricao: "Compara dois arrays elemento a elemento. Retorna true se iguais.", exemplo: "Arrays.equals(a, b);" },
          { flag: "Arrays.toString(arr)", descricao: "Converte array 1D para String legível, ex: [1, 2, 3].", exemplo: "Arrays.toString(nums);" },
          { flag: "Arrays.deepToString(arr)", descricao: "Converte array multidimensional para String, ex: [[1, 2], [3, 4]].", exemplo: "Arrays.deepToString(mat);" },
          { flag: "Arrays.asList(arr)", descricao: "Converte array em List de tamanho fixo. Útil para inicializar listas.", exemplo: "Arrays.asList(1, 2, 3);" },
          { flag: "Arrays.stream(arr)", descricao: "Cria um Stream a partir do array, permitindo operações funcionais.", exemplo: "Arrays.stream(nums).sum();" },
        ]}
      />
    </PageContainer>
  );
}
