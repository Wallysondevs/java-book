import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Strings() {
  return (
    <PageContainer title="Strings & Formatação" subtitle="Imutabilidade, métodos essenciais, StringBuilder e os Text Blocks de Java 13+." difficulty="iniciante" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Texto é provavelmente o tipo de dado que você mais vai manipular: nomes, e-mails, JSON, logs, SQL. <code>String</code> em Java tem detalhes que derrubam programador iniciante todo dia — comparar com <code>==</code>, concatenar dentro de loop, e a confusão com mutabilidade. Dominar essa página resolve uns 30% dos bugs típicos do começo.
        </p><h2>Strings são imutáveis</h2><p>
          Toda <code>String</code> em Java é imutável: depois de criada, o conteúdo não muda. Métodos como <code>toUpperCase()</code> ou<code>replace()</code> não alteram a String original — eles devolvem uma nova com o resultado.
        </p><CodeBlock title="Imutabilidade na prática" code={`public class Imutavel {
    public static void main(String[] args) {
        String nome = "ana";
        nome.toUpperCase();
        System.out.println(nome); // ainda "ana"

        nome = nome.toUpperCase();
        System.out.println(nome); // agora "ANA"
    }
}`} /><AlertBox type="tip" title="Por que imutável é bom">
          Strings imutáveis são seguras para compartilhar entre threads, podem ser usadas como chave em <code>Map</code> sem medo de mudarem, e permitem otimizações como o pool de strings.
        </AlertBox><h2>O pool de strings</h2><p>
          Quando você escreve um literal como <code>"oi"</code>, a JVM guarda essa String num pool interno. Se outro lugar do código também usar<code>"oi"</code>, é o <em>mesmo objeto</em>. Já o <code>new String("oi")</code>força a criação de um novo objeto fora do pool.
        </p><CodeBlock title="Pool em ação" code={`String a = "java";
String b = "java";
String c = new String("java");

System.out.println(a == b);        // true  (mesmo objeto no pool)
System.out.println(a == c);        // false (objeto novo)
System.out.println(a.equals(c));   // true  (mesmo conteúdo)`} /><h2>Compare com .equals(), nunca com ==</h2><p>
          <code>==</code> em objetos compara <strong>identidade</strong> (mesmo endereço de memória), não conteúdo. Para Strings (e qualquer objeto) use <code>.equals()</code> para comparar conteúdo. Use<code>.equalsIgnoreCase()</code> se diferenças de maiúsculas/minúsculas não importarem.
        </p><CodeBlock title="Comparação correta" code={`String entrada = new String("admin");
String esperado = "admin";

if (entrada == esperado) {
    System.out.println("nunca cai aqui");
}

if (entrada.equals(esperado)) {
    System.out.println("acesso liberado");
}

if ("ADMIN".equalsIgnoreCase(entrada)) {
    System.out.println("também combina");
}`} /><AlertBox type="tip" title="Truque contra NullPointerException">
          Coloque o literal à esquerda: <code>"admin".equals(entrada)</code>funciona mesmo se <code>entrada</code> for <code>null</code>. O contrário, <code>entrada.equals("admin")</code>, explode.
        </AlertBox><h2>Métodos essenciais</h2><p>
          A classe <code>String</code> tem dezenas de métodos. Esses são os que você vai usar quase todo dia:
        </p><ul>
          <li>
            <code>length()</code> — quantidade de caracteres.
          </li><li>
            <code>charAt(int i)</code> — caractere na posição <code>i</code> (0-based).
          </li><li>
            <code>substring(int ini, int fim)</code> — pedaço da string, fim exclusivo.
          </li><li>
            <code>indexOf(String s)</code> — posição da primeira ocorrência (ou -1).
          </li><li>
            <code>contains(CharSequence s)</code> — true se contém o trecho.
          </li><li>
            <code>replace(CharSequence alvo, CharSequence novo)</code> — substitui todas as ocorrências.
          </li><li>
            <code>split(String regex)</code> — quebra em array por um separador.
          </li><li>
            <code>toLowerCase()</code> / <code>toUpperCase()</code> — caixa.
          </li><li>
            <code>trim()</code> — remove espaços, tabs e quebras nas pontas (ASCII).
          </li><li>
            <code>strip()</code> — como trim mas considera Unicode (Java 11+).
          </li><li>
            <code>isBlank()</code> — true se vazia ou só espaços (Java 11+).
          </li>
        </ul><CodeBlock title="Métodos em uso" code={`public class Metodos {
    public static void main(String[] args) {
        String s = "  Java é massa  ";

        System.out.println(s.length());           // 16
        System.out.println(s.strip());            // "Java é massa"
        System.out.println(s.strip().toUpperCase()); // "JAVA É MASSA"
        System.out.println(s.contains("massa"));  // true
        System.out.println(s.indexOf("é"));       // 7
        System.out.println(s.replace("massa", "top"));
        System.out.println(s.isBlank());          // false

        String csv = "ana,bia,carla";
        String[] partes = csv.split(",");
        for (String p : partes) {
            System.out.println(p);
        }
    }
}`} /><h2>Concatenação: + vs StringBuilder</h2><p>
          Concatenar Strings com <code>+</code> em código casual é tranquilo. O compilador transforma em <code>StringBuilder</code> nos bastidores. O problema aparece dentro de loops grandes, onde cada <code>+</code> pode criar objetos temporários.
        </p><CodeBlock title="Loop ruim com +" code={`String resultado = "";
for (int i = 0; i < 10000; i++) {
    resultado += i + ",";
}
// cria milhares de Strings intermediárias`} /><CodeBlock title="Loop bom com StringBuilder" code={`StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i).append(",");
}
String resultado = sb.toString();`} /><AlertBox type="note" title="Quando se preocupar">
          Para 3 ou 4 concatenações, <code>+</code> está ótimo e fica mais legível. Use <code>StringBuilder</code> quando estiver dentro de loop ou construindo texto em várias etapas.
        </AlertBox><h2>Formatação: String.format e printf</h2><p>
          Quando você precisa montar uma String com placeholders tipados (números com casas decimais, alinhamento, padding), <code>String.format</code> e<code>System.out.printf</code> são seus amigos. A sintaxe é parecida com C.
        </p><CodeBlock title="Placeholders comuns" code={`String nome = "Ana";
int idade = 30;
double saldo = 1234.5;

String linha = String.format("%s tem %d anos e R$ %.2f", nome, idade, saldo);
System.out.println(linha);
// "Ana tem 30 anos e R$ 1234,50"

System.out.printf("%-10s %5d%n", "produto", 42);
// "produto        42"`} /><ul>
          <li>
            <code>%s</code> — string.
          </li><li>
            <code>%d</code> — inteiro.
          </li><li>
            <code>%f</code> — decimal (use <code>%.2f</code> para 2 casas).
          </li><li>
            <code>%n</code> — quebra de linha portável.
          </li><li>
            <code>%-10s</code> — alinha à esquerda em 10 colunas.
          </li>
        </ul><h2>Text blocks (Java 13+)</h2><p>
          Strings multilinha ficaram fáceis com text blocks. Em vez de concatenar várias linhas com <code>\\n</code>, você usa três aspas duplas. Útil para HTML, JSON, SQL embutidos no código.
        </p><CodeBlock title="Text block versus o jeito antigo" code={`String velho = "{\\n" +
               "  \\"nome\\": \\"Ana\\",\\n" +
               "  \\"idade\\": 30\\n" +
               "}";

String novo = """
        {
          "nome": "Ana",
          "idade": 30
        }
        """;

System.out.println(novo);`} /><AlertBox type="note" title="Indentação inteligente">
          O compilador detecta o menor recuo comum em todas as linhas e remove para você. Aspas duplas dentro do bloco não precisam de escape.
        </AlertBox><h2>String.join: junte coleções</h2><p>
          Para o caminho inverso do <code>split</code>, use <code>String.join</code>. Ele aceita um separador e uma série de Strings (ou um <code>Iterable</code>).
        </p><CodeBlock title="String.join" code={`import java.util.List;

public class Join {
    public static void main(String[] args) {
        String csv = String.join(",", "ana", "bia", "carla");
        System.out.println(csv); // ana,bia,carla

        List<String> nomes = List.of("João", "Maria", "Pedro");
        System.out.println(String.join(" - ", nomes));
    }
}`} /><h2>Convertendo para char[]</h2><p>
          Quando você precisa percorrer caractere a caractere ou aplicar algoritmos que mexem em índices, <code>toCharArray()</code> entrega um array de <code>char</code>.
        </p><CodeBlock title="char[] para iteração" code={`String palavra = "java";
char[] letras = palavra.toCharArray();

for (char c : letras) {
    System.out.println(c);
}

// alternativa sem alocar array:
for (int i = 0; i < palavra.length(); i++) {
    System.out.println(palavra.charAt(i));
}`} /><AlertBox type="tip" title="char[] para senhas">
          <code>String</code> fica no pool e na memória até o GC limpar. Para senhas, o ideal é usar <code>char[]</code> e zerar manualmente depois de usar — minimiza o tempo em que o segredo fica na heap.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva um método que receba uma <code>String</code> e retorne<code>true</code> se ela é palíndromo (lê igual de trás para frente), ignorando caixa. Use <code>toLowerCase()</code>,<code>charAt()</code> e um loop.
          </li><li>
            Construa uma String CSV com 1000 números de 1 a 1000 separados por vírgula, primeiro usando <code>+=</code> em loop e depois usando<code>StringBuilder</code>. Compare o tempo com<code>System.currentTimeMillis()</code>.
          </li><li>
            Crie um text block com um JSON de exemplo (pelo menos 4 campos) e use <code>String.format</code> para preencher os valores dinamicamente. Imprima no console.
          </li>
        </ol>
      </PageContainer>
  );
}
