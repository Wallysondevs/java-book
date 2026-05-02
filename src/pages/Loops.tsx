import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Loops() {
  return (
    <PageContainer title="Loops" subtitle="for, while, do-while e for-each — quando usar cada um." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Computador é bom em uma coisa: repetir tarefa milhões de vezes sem reclamar. Loop é como você pede pra ele fazer isso. Quase todo programa real tem loop em algum lugar — processar uma lista de pedidos, ler linhas de um arquivo, esperar até o usuário digitar algo válido. Java oferece quatro formas, e cada uma tem o momento certo de aparecer.
        </p><h2>for clássico — quando você sabe o número de iterações</h2><p>
          O <code>for</code> tradicional tem três partes separadas por <code>;</code>: inicialização, condição e atualização. Use quando você precisa de um índice ou sabe exatamente quantas vezes vai rodar.
        </p><CodeBlock title="for de 0 a 9" code={`public class Contador {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("i = " + i);
        }
    }
}`} /><h2>while — quando a condição depende de algo dinâmico</h2><p>
          Use <code>while</code> quando você não sabe de antemão quantas voltas vai dar. Ele testa a condição <em>antes</em> de cada iteração; se já começa falsa, o corpo nem roda.
        </p><CodeBlock title="Lendo até encontrar zero" code={`import java.util.Scanner;

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
}`} /><h2>do-while — pelo menos uma vez</h2><p>
          Igual ao <code>while</code>, mas testa a condição <strong>depois</strong> do corpo. Garante no mínimo uma execução. Útil pra menus e validação de entrada.
        </p><CodeBlock title="Menu que roda pelo menos uma vez" code={`import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int opcao;
do {
    System.out.println("1) Listar  2) Adicionar  0) Sair");
    opcao = sc.nextInt();
    System.out.println("Você escolheu: " + opcao);
} while (opcao != 0);`} /><h2>for-each — leitura simples sem se preocupar com índice</h2><p>
          Quando você só quer percorrer todos os elementos de um array ou coleção sem precisar do índice, o <code>for-each</code> (também chamado <em>enhanced for</em>) é o caminho. É mais curto e elimina a chance de errar o índice.
        </p><CodeBlock title="for-each em array" code={`String[] frutas = {"maçã", "banana", "uva"};
for (String fruta : frutas) {
    System.out.println(fruta);
}`} /><AlertBox type="tip" title="Quando NÃO usar for-each">
          Se você precisa do índice (ex.: comparar elemento atual com o anterior) ou modificar a coleção durante a iteração, volte pro <code>for</code> clássico ou use um <code>Iterator</code> explicitamente.
        </AlertBox><h2>break e continue</h2><p>
          <code>break</code> sai do loop imediatamente. <code>continue</code> pula direto pra próxima iteração, ignorando o resto do corpo.
        </p><CodeBlock title="Achar primeiro número par e parar" code={`int[] nums = {1, 3, 7, 8, 11, 14};
for (int n : nums) {
    if (n % 2 != 0) continue;  // pula ímpares
    System.out.println("primeiro par: " + n);
    break;
}`} /><h3>Labels — quebrar loops aninhados</h3><p>
          Em loops aninhados, <code>break</code> só sai do mais interno. Se quiser sair de tudo, use um <strong>label</strong>:
        </p><CodeBlock title="break com label" code={`externo:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j > 6) {
            System.out.println("achou em " + i + "," + j);
            break externo;
        }
    }
}`} /><AlertBox type="warning" title="Use label com moderação">
          Labels deixam o fluxo difícil de seguir. Considere extrair os loops pra um método e usar <code>return</code> em vez de <code>break externo</code> — costuma ficar mais limpo.
        </AlertBox><h2>Stream API: a alternativa funcional</h2><p>
          Pra <em>transformar</em> coleções (filtrar, mapear, somar), em vez de loop manual, prefira a Stream API. Deixa o código declarativo: você diz <em>o quê</em> quer, não <em>como</em> iterar.
        </p><CodeBlock title="Spoiler: Stream" code={`import java.util.List;

List<Integer> nums = List.of(1, 2, 3, 4, 5);
int somaPares = nums.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();
System.out.println(somaPares);  // 6`} /><p>
          Tem uma página inteira sobre Stream mais à frente. Por agora, só saiba que existe.
        </p><h2>Cuidado: ConcurrentModificationException</h2><p>
          Se você tenta modificar uma coleção (adicionar/remover) enquanto a percorre com <code>for-each</code>, Java lança <code>ConcurrentModificationException</code>. É bug clássico de iniciante.
        </p><CodeBlock title="Errado — vai estourar" code={`import java.util.ArrayList;
import java.util.List;

List<Integer> lista = new ArrayList<>(List.of(1, 2, 3, 4));
for (Integer n : lista) {
    if (n == 2) lista.remove(n);  // BOOM
}`} /><CodeBlock title="Certo — use Iterator.remove() ou removeIf" code={`lista.removeIf(n -> n == 2);
// ou:
// Iterator<Integer> it = lista.iterator();
// while (it.hasNext()) {
//     if (it.next() == 2) it.remove();
// }`} /><h2>Resumo rápido — qual loop escolher</h2><ul>
          <li>
            <strong>for clássico:</strong> sei quantas iterações ou preciso do índice.
          </li><li>
            <strong>while:</strong> condição dinâmica, posso rodar zero vezes.
          </li><li>
            <strong>do-while:</strong> tenho que rodar pelo menos uma vez.
          </li><li>
            <strong>for-each:</strong> só ler todos os elementos, sem índice.
          </li><li>
            <strong>Stream:</strong> transformação funcional (filter/map/reduce).
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um <code>for</code> que imprime a tabuada do 7 (de 7×1 até 7×10).
          </li><li>
            Crie um programa que pede números pro usuário até ele digitar um negativo, e imprime a soma de todos os positivos. Use <code>while</code>.
          </li><li>
            Dado <code>int[] notas = {"{"}5, 7, 9, 3, 8{"}"}</code>, use <code>for-each</code> pra calcular a média. Depois reescreva usando Stream (<code>IntStream.of(notas).average()</code>).
          </li>
        </ol>
      </PageContainer>
  );
}
