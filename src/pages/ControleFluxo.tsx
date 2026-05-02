import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ControleFluxo() {
  return (
    <PageContainer title="Controle de Fluxo: if, switch, ternário" subtitle="Decisões em código — incluindo switch expressions modernos." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Programa sem decisão é só uma receita linear. No mundo real você precisa reagir: se o usuário tem saldo, deixa comprar; se não, mostra um aviso. Controle de fluxo é o que transforma uma sequência burra de instruções em algo que <em>pensa</em>. Em Java você tem três ferramentas principais: <code>if</code>, <code>switch</code> e o operador ternário.
        </p><h2>if / else if / else</h2><p>
          O <code>if</code> avalia uma expressão booleana. Se for <code>true</code>, executa o bloco. Senão, pula. Você encadeia condições com <code>else if</code> e fecha com um <code>else</code> opcional pra cobrir o resto.
        </p><CodeBlock title="Classificando uma nota" code={`public class Nota {
    public static void main(String[] args) {
        int nota = 78;

        if (nota >= 90) {
            System.out.println("A");
        } else if (nota >= 75) {
            System.out.println("B");
        } else if (nota >= 60) {
            System.out.println("C");
        } else {
            System.out.println("Reprovado");
        }
    }
}`} /><AlertBox type="tip" title="Chaves sempre, mesmo com 1 linha">
          Java permite omitir as chaves quando o corpo do <code>if</code> tem só uma instrução. Não faça isso. Custa zero escrever <code>{"{ }"}</code> e evita bugs sutis quando alguém adiciona uma segunda linha depois.
        </AlertBox><h2>switch tradicional (cuidado com fall-through)</h2><p>
          O <code>switch</code> clássico compara uma variável com vários valores. Cada caso precisa de <code>break</code>, senão a execução <em>vaza</em> pro próximo caso. Esse comportamento se chama <strong>fall-through</strong> e é fonte clássica de bug.
        </p><CodeBlock title="switch antigo — note os break" code={`int dia = 3;
switch (dia) {
    case 1:
        System.out.println("Segunda");
        break;
    case 2:
        System.out.println("Terça");
        break;
    case 3:
        System.out.println("Quarta");
        break;
    default:
        System.out.println("Outro dia");
}`} /><h2>switch expression (Java 14+)</h2><p>
          Desde Java 14 o <code>switch</code> pode ser uma <strong>expressão</strong> — devolve um valor. A sintaxe nova usa <code>{"->"}</code> em vez de <code>:</code>, não tem fall-through, e aceita múltiplos labels separados por vírgula.
        </p><CodeBlock title="switch expression moderno" code={`int dia = 3;
String nome = switch (dia) {
    case 1, 2, 3, 4, 5 -> "dia útil";
    case 6, 7 -> "fim de semana";
    default -> "inválido";
};
System.out.println(nome);`} /><AlertBox type="success" title="Use sempre que puder">
          O switch expression é mais seguro (compilador exige cobrir todos os casos quando vira expressão), mais conciso e mais legível. Só caia no estilo antigo se mantiver código legado.
        </AlertBox><h2>yield: switch com bloco</h2><p>
          Se um caso precisa de mais de uma linha, abra um bloco <code>{"{ }"}</code> e use <code>yield</code> pra devolver o valor:
        </p><CodeBlock title="yield em switch" code={`int codigo = 2;
String mensagem = switch (codigo) {
    case 1 -> "OK";
    case 2 -> {
        String prefixo = "ERRO: ";
        yield prefixo + "código 2";
    }
    default -> "desconhecido";
};
System.out.println(mensagem);`} /><h2>Operador ternário</h2><p>
          Pra decisões curtas que devolvem valor, use <code>condicao ? valorSeTrue : valorSeFalse</code>. É o atalho do <code>if/else</code>.
        </p><CodeBlock title="Ternário" code={`int idade = 18;
String status = (idade >= 18) ? "maior" : "menor";
System.out.println(status);`} /><AlertBox type="warning" title="Não abuse">
          Ternário aninhado vira ilegível rápido. Se precisar de mais de um nível, volte pro <code>if/else</code> ou <code>switch</code>.
        </AlertBox><h2>Pattern matching no switch (Java 21)</h2><p>
          Desde Java 21 o <code>switch</code> aceita padrões de tipo: você verifica o tipo e já recebe a variável tipada no mesmo passo. Tem página dedicada sobre isso, mas a ideia é:
        </p><CodeBlock title="Spoiler: pattern matching" code={`Object valor = 42;
String descricao = switch (valor) {
    case Integer i -> "número inteiro: " + i;
    case String s -> "texto de " + s.length() + " chars";
    case null -> "nulo";
    default -> "outro tipo";
};
System.out.println(descricao);`} /><h2>Evite if aninhado profundo</h2><p>
          Quando você empilha 4 ou 5 <code>if</code> dentro de <code>if</code>, o código fica ilegível. Duas técnicas resolvem isso: <strong>early return</strong> (sai cedo dos casos inválidos) e <strong>guard clauses</strong> (validações no topo do método).
        </p><CodeBlock title="Antes — aninhado" code={`String validar(String email) {
    if (email != null) {
        if (!email.isEmpty()) {
            if (email.contains("@")) {
                return "ok";
            } else {
                return "sem arroba";
            }
        } else {
            return "vazio";
        }
    } else {
        return "nulo";
    }
}`} /><CodeBlock title="Depois — guard clauses" code={`String validar(String email) {
    if (email == null) return "nulo";
    if (email.isEmpty()) return "vazio";
    if (!email.contains("@")) return "sem arroba";
    return "ok";
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um programa que recebe um <code>int mes</code> (1 a 12) e imprime a estação do ano. Faça duas versões: uma com <code>if/else if</code> e outra com <code>switch</code> expression usando múltiplos labels.
          </li><li>
            Crie um método <code>classificarIMC(double imc)</code> que devolve <code>"abaixo"</code>, <code>"normal"</code>, <code>"sobrepeso"</code> ou <code>"obeso"</code>. Use guard clauses em vez de if aninhado.
          </li><li>
            Reescreva esse <code>if</code> usando ternário: <code>if (n % 2 == 0) tipo = "par"; else tipo = "ímpar";</code>
          </li>
        </ol>
      </PageContainer>
  );
}
