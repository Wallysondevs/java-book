import{j as r}from"./index-BpXci30S.js";import{P as a,A as i}from"./AlertBox-CmRzTA0W.js";import{C as e}from"./CodeBlock-CuSzYSd8.js";function t(){return r.jsxs(a,{title:"Arrays",subtitle:"Tamanho fixo, indexados em zero — e como passar pra ArrayList quando precisar crescer.",difficulty:"iniciante",timeToRead:"15 min",children:[r.jsx("h2",{children:"Por que você precisa disso"}),r.jsxs("p",{children:["Array é o jeito mais primitivo (e mais rápido) de guardar uma coleção de valores em Java. Pense numa fileira de gavetas numeradas a partir do zero: cada uma guarda um valor do mesmo tipo. Você usa array quando o tamanho não muda e performance importa. Quando precisar crescer, troca por ",r.jsx("code",{children:"ArrayList"}),"."]}),r.jsx("h2",{children:"Declaração e inicialização"}),r.jsxs("p",{children:["Array tem tamanho fixo definido na criação. Em Java, prefira a forma ",r.jsx("code",{children:"tipo[] nome"})," (colchetes do lado do tipo)."]}),r.jsx(e,{title:"Várias formas de criar",code:`public class CriarArray {
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
}`}),r.jsxs(i,{type:"note",title:"Valores default",children:["Array recém-criado vem preenchido com zero (numéricos), ",r.jsx("code",{children:"false"})," (boolean) ou ",r.jsx("code",{children:"null"})," (objetos). Não fica com lixo de memória como em C."]}),r.jsx("h2",{children:".length é propriedade, não método"}),r.jsxs("p",{children:["Esse é um detalhe que pega quem vem de outras linguagens. No array é ",r.jsx("code",{children:"arr.length"})," (sem parênteses). Em ",r.jsx("code",{children:"String"})," e em coleções é método: ",r.jsx("code",{children:"s.length()"}),", ",r.jsx("code",{children:"list.size()"}),"."]}),r.jsx(e,{title:"length",code:`int[] nums = {1, 2, 3, 4, 5};
System.out.println(nums.length);  // 5  — sem ()`}),r.jsx("h2",{children:"Índice começa em zero — e cuidado com o limite"}),r.jsxs("p",{children:["O primeiro elemento é ",r.jsx("code",{children:"arr[0]"}),", o último é ",r.jsx("code",{children:"arr[arr.length - 1]"}),". Acessar fora dos limites lança ",r.jsx("code",{children:"ArrayIndexOutOfBoundsException"}),"."]}),r.jsx(e,{code:`int[] nums = {10, 20, 30};
System.out.println(nums[0]);   // 10
System.out.println(nums[2]);   // 30
// System.out.println(nums[3]); // ArrayIndexOutOfBoundsException`}),r.jsx("h2",{children:"Arrays multidimensionais"}),r.jsxs("p",{children:["Java na verdade não tem array 2D — tem array de arrays. Isso permite linhas com tamanhos diferentes (",r.jsx("em",{children:"jagged arrays"}),")."]}),r.jsx(e,{title:"Matriz 3x3",code:`int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}`}),r.jsx("h2",{children:"Imprimir array: use Arrays.toString"}),r.jsxs("p",{children:["Se você fizer ",r.jsx("code",{children:"System.out.println(arr)"})," direto, vai sair algo tipo ",r.jsx("code",{children:"[I@1540e19d"})," (referência). Pra ver o conteúdo, use ",r.jsx("code",{children:"java.util.Arrays.toString"}),":"]}),r.jsx(e,{code:`import java.util.Arrays;

int[] nums = {3, 1, 4, 1, 5, 9, 2, 6};
System.out.println(Arrays.toString(nums));
// [3, 1, 4, 1, 5, 9, 2, 6]

int[][] m = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(m));
// [[1, 2], [3, 4]]`}),r.jsx("h2",{children:"Utilitários da classe Arrays"}),r.jsxs("p",{children:["A classe ",r.jsx("code",{children:"java.util.Arrays"})," tem muito helper útil:"]}),r.jsx(e,{title:"sort, fill, copyOf, equals",code:`import java.util.Arrays;

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
System.out.println(Arrays.equals(a, b));    // true (conteúdo igual)`}),r.jsxs(i,{type:"warning",title:"== compara referência, não conteúdo",children:["Esse erro é frequente. Pra comparar dois arrays elemento por elemento, sempre use ",r.jsx("code",{children:"Arrays.equals"})," (ou ",r.jsx("code",{children:"Arrays.deepEquals"})," pra multidimensional)."]}),r.jsx("h2",{children:"Iterando: for clássico vs for-each"}),r.jsx(e,{title:"Quando usar cada um",code:`int[] nums = {10, 20, 30, 40};

// for clássico — preciso do índice
for (int i = 0; i < nums.length; i++) {
    System.out.println(i + ": " + nums[i]);
}

// for-each — só leitura
for (int n : nums) {
    System.out.println(n);
}`}),r.jsxs("p",{children:["Lembre: ",r.jsx("code",{children:"for-each"})," não dá pra ",r.jsx("em",{children:"modificar"})," o array com ",r.jsx("code",{children:"n = 99"})," (você só altera a variável local). Use ",r.jsx("code",{children:"for"})," clássico se precisa atribuir."]}),r.jsx("h2",{children:"Array vs List — quando trocar"}),r.jsxs("ul",{children:[r.jsxs("li",{children:[r.jsx("strong",{children:"Array:"})," tamanho fixo, performance bruta, primitivos sem boxing (",r.jsx("code",{children:"int[]"})," é mais leve que ",r.jsx("code",{children:"List<Integer>"}),")."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"List (ArrayList):"})," cresce sozinho, tem ",r.jsx("code",{children:"add"}),", ",r.jsx("code",{children:"remove"}),", integração com Stream e Collections. Para 99% dos casos do dia a dia, prefira List."]})]}),r.jsx(e,{title:"De array pra ArrayList",code:`import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

String[] arr = {"a", "b", "c"};
List<String> lista = new ArrayList<>(Arrays.asList(arr));
lista.add("d");
System.out.println(lista);  // [a, b, c, d]`}),r.jsx("h2",{children:"System.arraycopy: cópia rápida"}),r.jsxs("p",{children:["Pra cópias grandes, ",r.jsx("code",{children:"System.arraycopy"})," é mais rápido que loop manual — usa instrução nativa por baixo. Assinatura: ",r.jsx("code",{children:"arraycopy(origem, posOrig, destino, posDest, tamanho)"}),"."]}),r.jsx(e,{code:`int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[5];
System.arraycopy(origem, 1, destino, 0, 3);
System.out.println(java.util.Arrays.toString(destino));
// [2, 3, 4, 0, 0]`}),r.jsx("h2",{children:"🎯 Mãos à massa"}),r.jsxs("ol",{children:[r.jsxs("li",{children:["Crie um ",r.jsx("code",{children:"int[]"})," com 10 números aleatórios (use ",r.jsx("code",{children:"Math.random()"})," × 100), ordene com ",r.jsx("code",{children:"Arrays.sort"})," e imprima com ",r.jsx("code",{children:"Arrays.toString"}),"."]}),r.jsxs("li",{children:["Escreva um método ",r.jsx("code",{children:"boolean contem(int[] arr, int valor)"})," que devolve ",r.jsx("code",{children:"true"})," se o valor está no array. Faça com ",r.jsx("code",{children:"for-each"}),"."]}),r.jsxs("li",{children:["Crie uma matriz ",r.jsx("code",{children:"int[][]"})," 4x4 e preencha com a tabuada (linha × coluna). Imprima formatado com ",r.jsx("code",{children:"Arrays.deepToString"})," e depois com loop aninhado em colunas alinhadas."]})]})]})}export{t as default};
