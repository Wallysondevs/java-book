import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Lacos() {
  return (
    <PageContainer
      title="Laços de Repetição"
      subtitle="Domine for, while, do-while e for-each — com break, continue e loops rotulados."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Laços (loops) permitem executar um bloco de código repetidamente enquanto uma condição for
        verdadeira. Java oferece quatro estruturas de repetição, cada uma com seu caso de uso ideal.
      </p>

      <h2>1. for — Contador Clássico</h2>
      <CodeBlock
        language="java"
        code={`// Sintaxe: for (inicialização; condição; atualização)
for (int i = 0; i < 5; i++) {
    System.out.println("i = " + i);
}
// 0, 1, 2, 3, 4

// Contagem regressiva
for (int i = 10; i >= 1; i--) {
    System.out.print(i + " ");
}
// 10 9 8 7 6 5 4 3 2 1

// Múltiplas variáveis
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.printf("i=%d, j=%d%n", i, j);
}

// for infinito (use com break)
for (;;) {
    // lógica
    break;
}`}
      />

      <h2>2. while — Enquanto a Condição for Verdadeira</h2>
      <CodeBlock
        language="java"
        code={`// Use quando não sabe quantas iterações serão necessárias
int n = 1;
while (n <= 10) {
    System.out.print(n + " ");
    n++;
}
// 1 2 3 4 5 6 7 8 9 10

// Exemplo: leitura até entrada válida
Scanner sc = new Scanner(System.in);
int numero = -1;
while (numero < 0) {
    System.out.print("Digite um número positivo: ");
    numero = sc.nextInt();
}
System.out.println("Você digitou: " + numero);`}
      />

      <h2>3. do-while — Executa Pelo Menos Uma Vez</h2>
      <CodeBlock
        language="java"
        code={`// O bloco executa ANTES de verificar a condição
int tentativas = 0;
String senha;
Scanner sc = new Scanner(System.in);

do {
    System.out.print("Digite a senha: ");
    senha = sc.nextLine();
    tentativas++;
} while (!senha.equals("java123") && tentativas < 3);

if (senha.equals("java123")) {
    System.out.println("Acesso liberado!");
} else {
    System.out.println("Bloqueado após " + tentativas + " tentativas.");
}`}
      />

      <h2>4. for-each — Iteração em Coleções e Arrays</h2>
      <CodeBlock
        language="java"
        code={`// Sintaxe: for (tipo elemento : coleção)
int[] numeros = {1, 2, 3, 4, 5};
for (int num : numeros) {
    System.out.print(num + " ");
}

String[] frutas = {"maçã", "banana", "laranja"};
for (String fruta : frutas) {
    System.out.println(fruta.toUpperCase());
}

List<String> nomes = List.of("Ana", "Bruno", "Carlos");
for (String nome : nomes) {
    System.out.println("Olá, " + nome + "!");
}

// LIMITAÇÃO: não dá acesso ao índice, não pode modificar a coleção diretamente
// Para isso, use for clássico ou Iterator`}
      />

      <h2>5. break e continue</h2>
      <CodeBlock
        language="java"
        code={`// break — sai do loop imediatamente
for (int i = 0; i < 10; i++) {
    if (i == 5) break;
    System.out.print(i + " ");
}
// 0 1 2 3 4

// continue — pula para a próxima iteração
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue; // pula pares
    System.out.print(i + " ");
}
// 1 3 5 7 9

// Labels — break/continue em loops aninhados
externo:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break externo; // sai do loop externo
        System.out.printf("(%d,%d) ", i, j);
    }
}
// (0,0) (0,1) (0,2) (1,0)`}
      />

      <AlertBox type="info" title="Qual loop usar?">
        <ul className="list-none ml-0">
          <li>• <strong>for</strong>: quando sabe o número de iterações (índice fixo)</li>
          <li>• <strong>while</strong>: quando a condição depende de algo externo</li>
          <li>• <strong>do-while</strong>: quando deve executar pelo menos uma vez</li>
          <li>• <strong>for-each</strong>: para percorrer arrays e coleções sem índice</li>
        </ul>
      </AlertBox>

      <h2>6. Streams como Alternativa Funcional</h2>
      <CodeBlock
        language="java"
        code={`// Java 8+ — alternativa funcional aos loops tradicionais
List<Integer> numeros = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Equivalente a: for-each + if
numeros.stream()
       .filter(n -> n % 2 == 0)  // pares
       .forEach(System.out::println); // 2 4 6 8 10

// Soma de todos os elementos
int soma = numeros.stream()
                  .mapToInt(Integer::intValue)
                  .sum();  // 55`}
      />
    </PageContainer>
  );
}
