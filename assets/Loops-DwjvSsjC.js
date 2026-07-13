import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(a,{title:"Loops",subtitle:"for, while, do-while e for-each — quando usar cada um.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Computador é bom em uma coisa: repetir tarefa milhões de vezes sem reclamar. Loop é como você pede pra ele fazer isso. Quase todo programa real tem loop em algum lugar — processar uma lista de pedidos, ler linhas de um arquivo, esperar até o usuário digitar algo válido. Java oferece quatro formas, e cada uma tem o momento certo de aparecer."}),e.jsx("h2",{children:"for clássico — quando você sabe o número de iterações"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"for"})," tradicional tem três partes separadas por ",e.jsx("code",{children:";"}),": inicialização, condição e atualização. Use quando você precisa de um índice ou sabe exatamente quantas vezes vai rodar."]}),e.jsx(o,{title:"for de 0 a 9",code:`public class Contador {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("i = " + i);
        }
    }
}`}),e.jsx("h2",{children:"while — quando a condição depende de algo dinâmico"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"while"})," quando você não sabe de antemão quantas voltas vai dar. Ele testa a condição ",e.jsx("em",{children:"antes"})," de cada iteração; se já começa falsa, o corpo nem roda."]}),e.jsx(o,{title:"Lendo até encontrar zero",code:`import java.util.Scanner;

public class AteZero {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        while (n != 0) {
            System.out.println("recebi: " + n);
            n = sc.nextInt();
        }
        System.out.println("terminei");
    }
}`}),e.jsx("h2",{children:"do-while — pelo menos uma vez"}),e.jsxs("p",{children:["Igual ao ",e.jsx("code",{children:"while"}),", mas testa a condição ",e.jsx("strong",{children:"depois"})," do corpo. Garante no mínimo uma execução. Útil pra menus e validação de entrada."]}),e.jsx(o,{title:"Menu que roda pelo menos uma vez",code:`import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int opcao;
do {
    System.out.println("1) Listar  2) Adicionar  0) Sair");
    opcao = sc.nextInt();
    System.out.println("Você escolheu: " + opcao);
} while (opcao != 0);`}),e.jsx("h2",{children:"for-each — leitura simples sem se preocupar com índice"}),e.jsxs("p",{children:["Quando você só quer percorrer todos os elementos de um array ou coleção sem precisar do índice, o ",e.jsx("code",{children:"for-each"})," (também chamado ",e.jsx("em",{children:"enhanced for"}),") é o caminho. É mais curto e elimina a chance de errar o índice."]}),e.jsx(o,{title:"for-each em array",code:`String[] frutas = {"maçã", "banana", "uva"};
for (String fruta : frutas) {
    System.out.println(fruta);
}`}),e.jsxs(r,{type:"tip",title:"Quando NÃO usar for-each",children:["Se você precisa do índice (ex.: comparar elemento atual com o anterior) ou modificar a coleção durante a iteração, volte pro ",e.jsx("code",{children:"for"})," clássico ou use um ",e.jsx("code",{children:"Iterator"})," explicitamente."]}),e.jsx("h2",{children:"break e continue"}),e.jsxs("p",{children:[e.jsx("code",{children:"break"})," sai do loop imediatamente. ",e.jsx("code",{children:"continue"})," pula direto pra próxima iteração, ignorando o resto do corpo."]}),e.jsx(o,{title:"Achar primeiro número par e parar",code:`int[] nums = {1, 3, 7, 8, 11, 14};
for (int n : nums) {
    if (n % 2 != 0) continue;  // pula ímpares
    System.out.println("primeiro par: " + n);
    break;
}`}),e.jsx("h3",{children:"Labels — quebrar loops aninhados"}),e.jsxs("p",{children:["Em loops aninhados, ",e.jsx("code",{children:"break"})," só sai do mais interno. Se quiser sair de tudo, use um ",e.jsx("strong",{children:"label"}),":"]}),e.jsx(o,{title:"break com label",code:`externo:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j > 6) {
            System.out.println("achou em " + i + "," + j);
            break externo;
        }
    }
}`}),e.jsxs(r,{type:"warning",title:"Use label com moderação",children:["Labels deixam o fluxo difícil de seguir. Considere extrair os loops pra um método e usar ",e.jsx("code",{children:"return"})," em vez de ",e.jsx("code",{children:"break externo"})," — costuma ficar mais limpo."]}),e.jsx("h2",{children:"Stream API: a alternativa funcional"}),e.jsxs("p",{children:["Pra ",e.jsx("em",{children:"transformar"})," coleções (filtrar, mapear, somar), em vez de loop manual, prefira a Stream API. Deixa o código declarativo: você diz ",e.jsx("em",{children:"o quê"})," quer, não ",e.jsx("em",{children:"como"})," iterar."]}),e.jsx(o,{title:"Spoiler: Stream",code:`import java.util.List;

List<Integer> nums = List.of(1, 2, 3, 4, 5);
int somaPares = nums.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();
System.out.println(somaPares);  // 6`}),e.jsx("p",{children:"Tem uma página inteira sobre Stream mais à frente. Por agora, só saiba que existe."}),e.jsx("h2",{children:"Cuidado: ConcurrentModificationException"}),e.jsxs("p",{children:["Se você tenta modificar uma coleção (adicionar/remover) enquanto a percorre com ",e.jsx("code",{children:"for-each"}),", Java lança ",e.jsx("code",{children:"ConcurrentModificationException"}),". É bug clássico de iniciante."]}),e.jsx(o,{title:"Errado — vai estourar",code:`import java.util.ArrayList;
import java.util.List;

List<Integer> lista = new ArrayList<>(List.of(1, 2, 3, 4));
for (Integer n : lista) {
    if (n == 2) lista.remove(n);  // BOOM
}`}),e.jsx(o,{title:"Certo — use Iterator.remove() ou removeIf",code:`lista.removeIf(n -> n == 2);
// ou:
// Iterator<Integer> it = lista.iterator();
// while (it.hasNext()) {
//     if (it.next() == 2) it.remove();
// }`}),e.jsx("h2",{children:"Resumo rápido — qual loop escolher"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"for clássico:"})," sei quantas iterações ou preciso do índice."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"while:"})," condição dinâmica, posso rodar zero vezes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"do-while:"})," tenho que rodar pelo menos uma vez."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"for-each:"})," só ler todos os elementos, sem índice."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Stream:"})," transformação funcional (filter/map/reduce)."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um ",e.jsx("code",{children:"for"})," que imprime a tabuada do 7 (de 7×1 até 7×10)."]}),e.jsxs("li",{children:["Crie um programa que pede números pro usuário até ele digitar um negativo, e imprime a soma de todos os positivos. Use ",e.jsx("code",{children:"while"}),"."]}),e.jsxs("li",{children:["Dado ",e.jsxs("code",{children:["int[] notas = ","{","5, 7, 9, 3, 8","}"]}),", use ",e.jsx("code",{children:"for-each"})," pra calcular a média. Depois reescreva usando Stream (",e.jsx("code",{children:"IntStream.of(notas).average()"}),")."]})]})]})}export{t as default};
