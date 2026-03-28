import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function TiposVariaveis() {
  return (
    <PageContainer
      title="Tipos e Variáveis"
      subtitle="Conheça todos os tipos primitivos do Java, Strings, autoboxing e inferência de tipos com var."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Java é uma linguagem <strong>fortemente tipada</strong>: toda variável tem um tipo definido em tempo
        de compilação. Os tipos se dividem em <strong>primitivos</strong> (armazenados na stack) e
        <strong>de referência</strong> (objetos, armazenados na heap).
      </p>

      <h2>1. Tipos Primitivos</h2>
      <CodeBlock
        language="java"
        title="Os 8 tipos primitivos do Java"
        code={`// ── Inteiros ──────────────────────────────────────────────────────
byte  b = 127;            // 1 byte:  -128 a 127
short s = 32_767;         // 2 bytes: -32.768 a 32.767
int   i = 2_147_483_647;  // 4 bytes: -2.1 bi a 2.1 bi (mais usado!)
long  l = 9_223_372_036_854_775_807L; // 8 bytes: sufixo L obrigatório

// ── Ponto flutuante ────────────────────────────────────────────────
float  f = 3.14f;    // 4 bytes: precisão ~7 dígitos (sufixo f)
double d = 3.141592653589793; // 8 bytes: precisão ~15 dígitos (padrão)

// ── Outros ────────────────────────────────────────────────────────
char c = 'A';         // 2 bytes: caractere Unicode (\u0041 = 'A')
boolean ativo = true; // true ou false (não é 0/1 como em C!)`}
      />

      <h2>2. Declaração e Inicialização</h2>
      <CodeBlock
        language="java"
        title="Declarando variáveis"
        code={`// Declaração simples
int idade;
double salario;

// Declaração com inicialização
int ano = 2024;
String nome = "Maria";

// Múltiplas variáveis do mesmo tipo (evite — prejudica leitura)
int x = 1, y = 2, z = 3;

// Constantes: final + SNAKE_CASE
final double PI = 3.14159265358979;
final int MAX_ALUNOS = 50;

// Inferência de tipo com var (Java 10+)
var lista = new ArrayList<String>();  // tipo inferido: ArrayList<String>
var texto = "Olá";                     // tipo inferido: String
var numero = 42;                       // tipo inferido: int
// var sem inicialização é ERRO:
// var x; // Erro de compilação!`}
      />

      <h2>3. Strings em Java</h2>
      <CodeBlock
        language="java"
        title="String — imutável, não é primitivo"
        code={`// String é uma classe, não primitivo
String s1 = "Java";                // literal — recomendado
String s2 = new String("Java");    // objeto — evite

// Comparação (IMPORTANTE!)
String a = "Java";
String b = "Java";
String c = new String("Java");

a == b        // true (literais — mesmo objeto no pool)
a == c        // false! (objetos diferentes)
a.equals(c)   // true  ← USE SEMPRE equals() para comparar Strings!

// Métodos mais usados de String
String texto = "  Olá, Mundo!  ";
texto.length()          // 15 — tamanho
texto.trim()            // "Olá, Mundo!" — remove espaços das bordas
texto.toLowerCase()     // "  olá, mundo!  "
texto.toUpperCase()     // "  OLÁ, MUNDO!  "
texto.contains("Mundo") // true
texto.replace("Mundo", "Java") // "  Olá, Java!  "
texto.charAt(2)         // 'l'
texto.substring(2, 6)   // "lá, "
texto.startsWith("  Olá") // true
texto.split(", ")       // ["  Olá", "Mundo!  "]
texto.strip()           // "Olá, Mundo!" — melhor que trim() (Java 11+)
texto.isBlank()         // false (Java 11+)
texto.repeat(2)         // "  Olá, Mundo!    Olá, Mundo!  " (Java 11+)

// String.format e printf
String msg = String.format("Nome: %s, Idade: %d, Nota: %.2f", "Ana", 20, 9.5);
// "Nome: Ana, Idade: 20, Nota: 9.50"

// Text blocks (Java 15+) — JSON, HTML, SQL multi-linha
String json = """
        {
            "nome": "Ana",
            "idade": 20
        }
        """;`}
      />

      <h2>4. Autoboxing e Unboxing</h2>
      <CodeBlock
        language="java"
        title="Primitivos ↔ Objetos"
        code={`// Cada primitivo tem uma classe Wrapper correspondente:
// int → Integer, double → Double, boolean → Boolean, etc.

// Autoboxing: primitivo → objeto (automático)
int valorPrimitivo = 42;
Integer valorObjeto = valorPrimitivo; // autoboxing automático

// Unboxing: objeto → primitivo (automático)
Integer obj = Integer.valueOf(100);
int prim = obj; // unboxing automático

// Uso comum: coleções só aceitam objetos
List<Integer> numeros = new ArrayList<>();
numeros.add(1);   // autoboxing: 1 → Integer.valueOf(1)
numeros.add(2);
int soma = numeros.get(0) + numeros.get(1); // unboxing

// Métodos úteis dos Wrappers
Integer.parseInt("42")         // String → int
Integer.toString(42)           // int → String
Integer.MAX_VALUE               // 2147483647
Integer.MIN_VALUE               // -2147483648
Integer.toBinaryString(10)     // "1010"
Double.parseDouble("3.14")     // String → double

// CUIDADO: null em unboxing gera NullPointerException!
Integer n = null;
int x = n; // NullPointerException!`}
      />

      <h2>5. Casting (Conversão de Tipos)</h2>
      <CodeBlock
        language="java"
        title="Casting implícito e explícito"
        code={`// Widening (implícito — sem perda de dados)
int i = 100;
long l = i;       // int → long (automático)
float f = i;      // int → float (automático)
double d = f;     // float → double (automático)

// Narrowing (explícito — pode haver perda de dados)
double pi = 3.14159;
int truncado = (int) pi;  // 3 — parte decimal descartada!

long grande = 1_000_000_000_000L;
int pequeno = (int) grande;  // pode perder dados!

// Conversão String ↔ número
int num = Integer.parseInt("42");     // "42" → 42
double d2 = Double.parseDouble("3.14"); // "3.14" → 3.14
String s = String.valueOf(42);        // 42 → "42"
String s2 = Integer.toString(42);     // 42 → "42"
String s3 = 42 + "";                  // concatenação — evite`}
      />

      <ParamTable
        comando="Tipos Primitivos do Java"
        descricaoHelp="Resumo dos 8 tipos primitivos: tamanho em memória, faixa de valores e quando usar cada um."
        params={[
          { flag: "byte", descricao: "1 byte. Faixa: -128 a 127. Use para economizar memória em arrays grandes ou leitura de arquivos binários.", exemplo: "byte b = 100;" },
          { flag: "short", descricao: "2 bytes. Faixa: -32.768 a 32.767. Raramente usado; prefira int.", exemplo: "short s = 1000;" },
          { flag: "int", descricao: "4 bytes. Faixa: ~-2.1 bilhões a 2.1 bilhões. Tipo inteiro padrão do Java — use para contadores, índices, quantidades.", exemplo: "int idade = 25;" },
          { flag: "long", descricao: "8 bytes. Para números inteiros muito grandes que extrapolam int. Sempre use sufixo L.", exemplo: "long pop = 8_000_000_000L;" },
          { flag: "float", descricao: "4 bytes. ~7 dígitos de precisão. Prefira double na maioria dos casos. Sufixo f obrigatório.", exemplo: "float f = 3.14f;" },
          { flag: "double", descricao: "8 bytes. ~15 dígitos de precisão. Tipo padrão para números decimais em Java.", exemplo: "double pi = 3.14159;" },
          { flag: "char", descricao: "2 bytes. Um único caractere Unicode (0 a 65535). Aspas simples.", exemplo: "char letra = 'A';" },
          { flag: "boolean", descricao: "Tamanho JVM-dependente. Apenas true ou false. Não converte de/para int como em C.", exemplo: "boolean ativo = true;" },
        ]}
      />
    </PageContainer>
  );
}
