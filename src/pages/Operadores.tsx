import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer
      title="Operadores e Expressões"
      subtitle="Aprenda todos os operadores do Java: aritméticos, relacionais, lógicos, bitwise e o operador ternário."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Operadores são símbolos que realizam operações sobre valores (operandos). Java possui uma rica
        variedade de operadores organizados em categorias por tipo de operação.
      </p>

      <h2>1. Operadores Aritméticos</h2>
      <CodeBlock
        language="java"
        code={`int a = 10, b = 3;

System.out.println(a + b);   // 13 — adição
System.out.println(a - b);   // 7  — subtração
System.out.println(a * b);   // 30 — multiplicação
System.out.println(a / b);   // 3  — divisão INTEIRA (trunca!)
System.out.println(a % b);   // 1  — módulo (resto da divisão)

// Divisão decimal: pelo menos um operando deve ser double
System.out.println(10.0 / 3);   // 3.3333...
System.out.println((double) a / b); // 3.3333...

// Incremento e decremento
int x = 5;
x++;   // x = 6 (pós-incremento)
x--;   // x = 5 (pós-decremento)
++x;   // x = 6 (pré-incremento)
--x;   // x = 5 (pré-decremento)

// Diferença pré vs pós
int i = 5;
int j = i++;  // j = 5, i = 6 (pós: usa DEPOIS de atribuir)
int k = ++i;  // k = 7, i = 7 (pré: incrementa ANTES de atribuir)`}
      />

      <h2>2. Operadores Relacionais (Comparação)</h2>
      <CodeBlock
        language="java"
        code={`int a = 5, b = 10;

System.out.println(a == b);  // false — igual a
System.out.println(a != b);  // true  — diferente de
System.out.println(a < b);   // true  — menor que
System.out.println(a > b);   // false — maior que
System.out.println(a <= 5);  // true  — menor ou igual
System.out.println(b >= 10); // true  — maior ou igual

// Para objetos: use equals(), NÃO ==
String s1 = new String("Java");
String s2 = new String("Java");
System.out.println(s1 == s2);      // false (referências diferentes!)
System.out.println(s1.equals(s2)); // true  (conteúdo igual)

// instanceof — verifica tipo (com pattern matching desde Java 16)
Object obj = "texto";
if (obj instanceof String str) {
    System.out.println(str.toUpperCase()); // "TEXTO"
}`}
      />

      <h2>3. Operadores Lógicos</h2>
      <CodeBlock
        language="java"
        code={`boolean a = true, b = false;

// Operadores de curto-circuito (preferidos)
System.out.println(a && b);  // false — AND lógico (&&: avalia b só se a for true)
System.out.println(a || b);  // true  — OR  lógico (||: avalia b só se a for false)
System.out.println(!a);      // false — NOT lógico

// Operadores sem curto-circuito (avaliam ambos os lados sempre)
System.out.println(a & b);   // false — AND bitwise/lógico
System.out.println(a | b);   // true  — OR  bitwise/lógico
System.out.println(a ^ b);   // true  — XOR (verdadeiro se os dois forem diferentes)

// Exemplo prático de curto-circuito
String nome = null;
// Seguro — se nome for null, não chama .isEmpty()
if (nome != null && !nome.isEmpty()) {
    System.out.println("Nome válido: " + nome);
}`}
      />

      <h2>4. Operadores de Atribuição</h2>
      <CodeBlock
        language="java"
        code={`int x = 10;

x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 4;   // x = x % 4  → 2
x &= 3;   // x = x & 3  (AND bitwise)
x |= 4;   // x = x | 4  (OR bitwise)
x ^= 2;   // x = x ^ 2  (XOR bitwise)
x <<= 1;  // x = x << 1 (shift esquerda — multiplica por 2)
x >>= 1;  // x = x >> 1 (shift direita  — divide por 2)`}
      />

      <h2>5. Operador Ternário</h2>
      <CodeBlock
        language="java"
        code={`// condição ? valorSeVerdadeiro : valorSeFalso
int a = 10, b = 20;
int maior = (a > b) ? a : b;  // 20

String status = (maior >= 18) ? "adulto" : "menor";

// Aninhado (use com moderação — prejudica leitura)
int nota = 75;
String conceito = nota >= 90 ? "A" :
                  nota >= 80 ? "B" :
                  nota >= 70 ? "C" :
                  nota >= 60 ? "D" : "F";
System.out.println(conceito); // "C"`}
      />

      <h2>6. Operadores Bitwise</h2>
      <CodeBlock
        language="java"
        code={`int a = 0b1010;  // 10 em binário
int b = 0b1100;  // 12 em binário

System.out.println(a & b);   // 0b1000 = 8  (AND bit a bit)
System.out.println(a | b);   // 0b1110 = 14 (OR bit a bit)
System.out.println(a ^ b);   // 0b0110 = 6  (XOR bit a bit)
System.out.println(~a);      // -11          (NOT bit a bit)

// Shift
System.out.println(1 << 3);  // 8   (1 × 2³)
System.out.println(16 >> 2); // 4   (16 ÷ 2²)
System.out.println(-8 >>> 1); // unsigned shift right`}
      />

      <AlertBox type="info" title="Precedência de Operadores">
        Ordem de precedência (maior para menor): <code>++ --</code> (pré) → <code>* / %</code> →
        <code>+ -</code> → <code>{'<< >>'}</code> → <code>{'< <= > >='}</code> → <code>== !=</code> →
        <code>&amp;</code> → <code>^</code> → <code>|</code> → <code>&amp;&amp;</code> → <code>||</code> →
        <code>?:</code> → <code>=</code>. Use parênteses para tornar a intenção clara!
      </AlertBox>
    </PageContainer>
  );
}
