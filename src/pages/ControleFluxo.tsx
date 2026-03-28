import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ControleFluxo() {
  return (
    <PageContainer
      title="Controle de Fluxo"
      subtitle="if/else, switch expressions, Pattern Matching e todas as estruturas de decisão do Java moderno."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Controle de fluxo determina a ordem de execução das instruções. Java oferece estruturas
        de decisão clássicas e, a partir do Java 14+, novas formas expressivas de switch.
      </p>

      <h2>1. if / else if / else</h2>
      <CodeBlock
        language="java"
        code={`int nota = 78;

if (nota >= 90) {
    System.out.println("Aprovado com A");
} else if (nota >= 80) {
    System.out.println("Aprovado com B");
} else if (nota >= 70) {
    System.out.println("Aprovado com C");
} else if (nota >= 60) {
    System.out.println("Aprovado com D");
} else {
    System.out.println("Reprovado");
}
// Saída: "Aprovado com C"

// Sem chaves (apenas para blocos de 1 linha — use chaves mesmo assim)
if (nota >= 60) System.out.println("OK");`}
      />

      <h2>2. switch Clássico</h2>
      <CodeBlock
        language="java"
        code={`int dia = 3;
String nomeDia;

switch (dia) {
    case 1:
        nomeDia = "Segunda";
        break;       // break evita o "fall-through"
    case 2:
        nomeDia = "Terça";
        break;
    case 3:
        nomeDia = "Quarta";
        break;
    case 4:
        nomeDia = "Quinta";
        break;
    case 5:
        nomeDia = "Sexta";
        break;
    case 6:
    case 7:          // fall-through intencional
        nomeDia = "Fim de semana";
        break;
    default:
        nomeDia = "Inválido";
}`}
      />

      <h2>3. switch Expression (Java 14+)</h2>
      <CodeBlock
        language="java"
        code={`// switch como expressão — muito mais limpo!
int dia = 3;
String nomeDia = switch (dia) {
    case 1 -> "Segunda";
    case 2 -> "Terça";
    case 3 -> "Quarta";
    case 4 -> "Quinta";
    case 5 -> "Sexta";
    case 6, 7 -> "Fim de semana";  // múltiplos casos em uma linha!
    default -> "Inválido";
};
System.out.println(nomeDia); // "Quarta"

// Com String
String estacao = "Verão";
int mesesQuentes = switch (estacao) {
    case "Verão"  -> 3;
    case "Outono" -> 0;
    case "Inverno" -> 0;
    case "Primavera" -> 1;
    default -> throw new IllegalArgumentException("Estação inválida: " + estacao);
};

// Com bloco e yield (para expressões mais complexas)
int mes = 4;
int dias = switch (mes) {
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11 -> 30;
    case 2 -> {
        int ano = 2024;
        yield (ano % 4 == 0 && (ano % 100 != 0 || ano % 400 == 0)) ? 29 : 28;
    }
    default -> throw new IllegalArgumentException("Mês inválido");
};`}
      />

      <h2>4. Pattern Matching no switch (Java 21)</h2>
      <CodeBlock
        language="java"
        code={`// switch com tipos (Java 21 — sem preview!)
Object obj = 42;

String resultado = switch (obj) {
    case Integer i when i > 0 -> "Inteiro positivo: " + i;
    case Integer i             -> "Inteiro não-positivo: " + i;
    case String s              -> "String: " + s;
    case Double d              -> "Double: " + d;
    case null                  -> "null";
    default                    -> "Outro tipo";
};
System.out.println(resultado); // "Inteiro positivo: 42"

// Também funciona com sealed classes e records!
sealed interface Forma permits Circulo, Retangulo {}
record Circulo(double raio) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}

Forma forma = new Circulo(5.0);
double area = switch (forma) {
    case Circulo c     -> Math.PI * c.raio() * c.raio();
    case Retangulo r   -> r.largura() * r.altura();
};`}
      />

      <AlertBox type="info" title="Quando usar switch vs if/else?">
        Use <strong>switch</strong> quando testar uma variável contra múltiplos valores discretos (int, String, enum).
        Use <strong>if/else</strong> para condições complexas com ranges, múltiplos operadores lógicos,
        ou quando as condições não são mutuamente exclusivas sobre uma mesma variável.
      </AlertBox>

      <h2>5. Operador Ternário como Decisão</h2>
      <CodeBlock
        language="java"
        code={`// Para atribuições simples, o ternário é mais conciso que if/else
boolean adulto = idade >= 18;
String mensagem = adulto ? "Bem-vindo!" : "Acesso negado";

// Equivalente ao if/else:
String mensagem2;
if (adulto) {
    mensagem2 = "Bem-vindo!";
} else {
    mensagem2 = "Acesso negado";
}`}
      />
    </PageContainer>
  );
}
