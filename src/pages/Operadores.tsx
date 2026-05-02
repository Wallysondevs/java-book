import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer title="Operadores" subtitle="Aritméticos, lógicos, bit a bit e a divisão integer que pega gente desprevenida." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Operadores são os verbos da linguagem. Você usa eles em praticamente toda linha de código — somar, comparar, decidir. Java tem algumas armadilhas clássicas (divisão entre inteiros, precedência) que fazem iniciante ficar horas debugando coisa boba. Esta página é o guia rápido para evitar essas pegadinhas.
        </p><h2>Aritméticos</h2><p>
          Os básicos são <code>+</code>, <code>-</code>, <code>*</code>,<code>/</code> e <code>%</code> (resto da divisão). Funcionam como você espera, com uma exceção importante na divisão.
        </p><CodeBlock title="Operações aritméticas" code={`public class Aritmetica {
    public static void main(String[] args) {
        int soma = 10 + 3;
        int sub = 10 - 3;
        int mult = 10 * 3;
        int div = 10 / 3;
        int resto = 10 % 3;

        System.out.println(soma);   // 13
        System.out.println(sub);    // 7
        System.out.println(mult);   // 30
        System.out.println(div);    // 3
        System.out.println(resto);  // 1
    }
}`} /><h3>A divisão integer que pega todo mundo</h3><p>
          Quando os dois operandos da divisão são inteiros, o resultado também é inteiro — a parte fracionária some sem aviso. Para obter o decimal, pelo menos um dos lados precisa ser <code>double</code> ou <code>float</code>.
        </p><CodeBlock title="A diferença entre 5/2 e 5/2.0" code={`int a = 5 / 2;            // 2  (truncado)
double b = 5 / 2;         // 2.0 (já truncou antes de virar double)
double c = 5 / 2.0;       // 2.5
double d = 5.0 / 2;       // 2.5
double e = (double) 5 / 2; // 2.5

System.out.println(a + " " + b + " " + c + " " + d + " " + e);`} /><AlertBox type="warning" title="Cast antes ou depois?">
          <code>(double) (5 / 2)</code> dá <code>2.0</code> porque a divisão acontece primeiro como <code>int</code>. Já <code>(double) 5 / 2</code>dá <code>2.5</code> porque o cast acontece antes da divisão. A ordem importa.
        </AlertBox><h2>Atribuição e atribuição composta</h2><p>
          Além do <code>=</code> simples, Java tem versões compactas que combinam operação e atribuição: <code>+=</code>, <code>-=</code>, <code>*=</code>,<code>/=</code>, <code>%=</code> e os bit a bit (<code>&=</code>,<code>|=</code>, <code>^=</code>, <code>
            {"<<="}
          </code>,<code>{">>="}</code>).
        </p><CodeBlock title="Atribuição composta" code={`int x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // 12
x *= 2;   // 24
x /= 4;   // 6
x %= 4;   // 2

System.out.println(x); // 2`} /><AlertBox type="tip" title="Cast implícito grátis">
          Atribuição composta faz cast automático: <code>byte b = 10; b += 1000;</code>compila (mesmo sendo <code>b = (byte)(b + 1000)</code>) enquanto<code>b = b + 1000;</code> não compila. Útil, mas pode esconder overflow.
        </AlertBox><h2>Incremento e decremento</h2><p>
          <code>++</code> aumenta em 1, <code>--</code> diminui em 1. A posição (antes ou depois da variável) muda quando o valor "novo" entra na expressão.
        </p><CodeBlock title="Prefixo vs postfixo" code={`int a = 5;
int b = ++a; // pré: incrementa primeiro, usa depois → a=6, b=6
System.out.println(a + " " + b);

int c = 5;
int d = c++; // pós: usa primeiro, incrementa depois → c=6, d=5
System.out.println(c + " " + d);`} /><AlertBox type="note" title="Em loops, dá no mesmo">
          Em <code>
            {"for (int i = 0; i < 10; i++)"}
          </code> ou<code>
            {"for (int i = 0; i < 10; ++i)"}
          </code> o resultado é igual, porque o valor da expressão não está sendo usado. Use o que ler melhor.
        </AlertBox><h2>Comparação</h2><p>
          Devolvem sempre um <code>boolean</code>: <code>==</code>, <code>!=</code>,<code>
            {"<"}
          </code>, <code>{">"}</code>, <code>
            {"<="}
          </code>,<code>{">="}</code>.
        </p><CodeBlock title="Comparações" code={`int idade = 18;
System.out.println(idade == 18); // true
System.out.println(idade != 21); // true
System.out.println(idade >= 18); // true
System.out.println(idade < 16);  // false`} /><AlertBox type="danger" title="Não use == para comparar Strings">
          Para tipos primitivos, <code>==</code> compara o valor. Para objetos (incluindo <code>String</code>), <code>==</code> compara se é o mesmo endereço de memória. Sempre use <code>.equals()</code> em objetos. Mais detalhes na página de Strings.
        </AlertBox><h2>Lógicos com short-circuit</h2><p>
          <code>&&</code> (E) e <code>||</code> (OU) avaliam da esquerda para a direita e param assim que o resultado já está decidido. Esse comportamento, chamado <em>short-circuit</em>, é o que permite escrever:
        </p><CodeBlock title="Short-circuit salvando vidas" code={`String texto = null;

if (texto != null && texto.length() > 0) {
    System.out.println("não vazio");
}

// Se você usasse & em vez de &&, a JVM tentaria
// avaliar texto.length() mesmo com texto == null
// e jogaria NullPointerException.`} /><p>
          Os operadores <code>&</code> e <code>|</code> sem duplicar também existem como lógicos: avaliam os dois lados sempre. Use só quando você quer garantir efeitos colaterais (raro). Para a maioria dos casos,<code>&&</code> e <code>||</code> são a escolha certa.
        </p><p>
          O <code>!</code> nega um booleano: <code>!true == false</code>.
        </p><h2>Bit a bit (bitwise)</h2><p>
          Operam nos bits individuais de inteiros. Úteis em manipulação de flags, protocolos binários e otimizações de baixo nível.
        </p><ul>
          <li>
            <code>&</code> — AND bit a bit.
          </li><li>
            <code>|</code> — OR bit a bit.
          </li><li>
            <code>^</code> — XOR bit a bit.
          </li><li>
            <code>~</code> — NOT bit a bit (inverte todos os bits).
          </li><li>
            <code>
              {"<<"}
            </code> — shift à esquerda (multiplica por 2).
          </li><li>
            <code>{">>"}</code> — shift à direita preservando o sinal.
          </li><li>
            <code>{">>>"}</code> — shift à direita preenchendo com zero.
          </li>
        </ul><CodeBlock title="Bit a bit em ação" code={`int a = 0b1100; // 12
int b = 0b1010; // 10

System.out.println(a & b);  // 0b1000 = 8
System.out.println(a | b);  // 0b1110 = 14
System.out.println(a ^ b);  // 0b0110 = 6
System.out.println(a << 2); // 0b110000 = 48
System.out.println(a >> 1); // 0b110 = 6`} /><h2>Operador ternário</h2><p>
          É um <code>if/else</code> compactado em uma expressão:<code>condicao ? valorSeVerdadeiro : valorSeFalso</code>.
        </p><CodeBlock title="Ternário substituindo if curto" code={`int idade = 17;
String status = (idade >= 18) ? "maior" : "menor";
System.out.println(status);`} /><AlertBox type="tip" title="Quando usar ternário">
          Para escolhas simples entre dois valores. Se a expressão começar a ficar comprida ou aninhar outros ternários, prefira um <code>if/else</code>normal — a legibilidade vence sempre.
        </AlertBox><h2>Precedência: quando os parênteses te salvam</h2><p>
          Java tem regras detalhadas de precedência (ordem em que os operadores são aplicados). Em vez de decorar a tabela inteira, lembre destes princípios:
        </p><ol>
          <li>
            Multiplicação e divisão antes de soma e subtração: <code>2 + 3 * 4 == 14</code>.
          </li><li>
            Comparações antes dos lógicos: <code>
              {"a > 0 && b < 10"}
            </code>.
          </li><li>
            <code>&&</code> tem precedência maior que <code>||</code>.
          </li><li>Atribuição é a operação de menor precedência.</li>
        </ol><CodeBlock title="Sem parênteses pode te enganar" code={`int resultado = 2 + 3 * 4;          // 14
int comParens = (2 + 3) * 4;        // 20

boolean ok = 5 > 3 && 2 < 4 || false; // true
boolean idem = ((5 > 3) && (2 < 4)) || false;`} /><AlertBox type="tip" title="Regra de ouro">
          Se você precisa pensar mais que 2 segundos para entender a ordem, coloque parênteses. Eles não custam nada e tornam a intenção óbvia para quem lê depois.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um programa que leia (ou tenha hardcoded) dois inteiros<code>a</code> e <code>b</code> e imprima a divisão como inteiro, como decimal e o resto. Use cast para evitar a armadilha da divisão integer.
          </li><li>
            Implemente uma verificação que aceite uma <code>String</code> e só imprima seu tamanho se ela não for <code>null</code> nem vazia. Use short-circuit para evitar <code>NullPointerException</code>.
          </li><li>
            Usando operadores bit a bit, escreva uma função que verifique se um número inteiro é par sem usar <code>%</code> (dica:<code>n & 1</code>).
          </li>
        </ol>
      </PageContainer>
  );
}
