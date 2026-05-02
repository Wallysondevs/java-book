import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TiposPrimitivos() {
  return (
    <PageContainer title="Tipos Primitivos" subtitle="byte, short, int, long, float, double, char, boolean — tamanhos e armadilhas." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Em Java, todo valor numérico ocupa um espaço fixo na memória. Se você escolher o tipo errado, dois problemas aparecem: ou o valor estoura silenciosamente (overflow) e seu programa entrega um resultado absurdo, ou você desperdiça memória multiplicada por milhões de objetos. Conhecer os 8 tipos primitivos é a base para escrever código que não trava no meio da madrugada.
        </p><h2>Os 8 tipos primitivos</h2><p>
          Java tem exatamente 8 tipos primitivos. Eles são escritos em letra minúscula (diferente de classes como <code>String</code> ou <code>Integer</code>) e guardam o valor diretamente, não uma referência. A versão base aqui é o Java 21 LTS, mas esses tipos estão estáveis desde a versão 1.0.
        </p><h3>Inteiros</h3><ul>
          <li>
            <strong>byte</strong> — 8 bits, faixa de -128 a 127.
          </li><li>
            <strong>short</strong> — 16 bits, faixa de -32.768 a 32.767.
          </li><li>
            <strong>int</strong> — 32 bits, faixa de aproximadamente -2,1 bilhões a 2,1 bilhões. É o padrão para a maioria dos casos.
          </li><li>
            <strong>long</strong> — 64 bits, faixa absurdamente grande (cerca de 9 quintilhões positivos ou negativos).
          </li>
        </ul><h3>Ponto flutuante</h3><ul>
          <li>
            <strong>float</strong> — 32 bits, ~7 dígitos de precisão decimal.
          </li><li>
            <strong>double</strong> — 64 bits, ~15 dígitos de precisão. É o padrão para decimais.
          </li>
        </ul><h3>Outros dois</h3><ul>
          <li>
            <strong>char</strong> — 16 bits, guarda um único caractere Unicode (UTF-16).
          </li><li>
            <strong>boolean</strong> — só pode ser <code>true</code> ou <code>false</code>. O tamanho não é especificado pela JVM.
          </li>
        </ul><CodeBlock title="Declarando cada tipo" code={`public class Primitivos {
    public static void main(String[] args) {
        byte idade = 30;
        short ano = 2025;
        int populacao = 215_000_000;
        long distanciaSol = 149_600_000_000L;

        float pi = 3.14f;
        double precisao = 3.141592653589793;

        char letra = 'A';
        boolean ativo = true;

        System.out.println(idade + " - " + populacao + " - " + distanciaSol);
        System.out.println(pi + " vs " + precisao);
        System.out.println(letra + " - " + ativo);
    }
}`} /><h2>Literais: jeitos de escrever números</h2><p>
          O compilador precisa de pistas para entender o que você quer. Sem o sufixo certo, ele assume <code>int</code> para inteiros e <code>double</code> para decimais.
        </p><ul>
          <li>
            <code>1L</code> — sufixo L marca um <code>long</code>. Use maiúsculo (l minúsculo parece o número 1).
          </li><li>
            <code>1.5f</code> — sufixo f marca um <code>float</code>. Sem o f, vira double.
          </li><li>
            <code>0b1010</code> — literal binário (vale 10 em decimal).
          </li><li>
            <code>0x1A</code> — literal hexadecimal (vale 26).
          </li><li>
            <code>077</code> — literal octal, começa com zero. Cuidado, raramente é o que você quer.
          </li>
        </ul><CodeBlock title="Literais em ação" code={`long grande = 9_999_999_999L;
float taxa = 0.05f;
int permissoes = 0b111_101_001;
int corVermelha = 0xFF0000;

System.out.println(grande);
System.out.println(taxa);
System.out.println(permissoes);
System.out.println(corVermelha);`} /><AlertBox type="tip" title="Underscore em números (Java 7+)">
          <p>
            Desde o Java 7 você pode colocar <code>_</code> entre dígitos só para deixar números grandes legíveis. O compilador ignora completamente os underscores — funciona como o ponto/vírgula que você usa no dia a dia (R$ 1.000.000), só que Java escolheu <code>_</code> porque ponto e vírgula já têm outros usos.
          </p><p>
            <strong>Vale para qualquer base:</strong>
          </p><ul>
            <li>
              <code>215_000_000</code> — decimal
            </li><li>
              <code>0b1010_0001_0011</code> — binário, agrupado em nibbles
            </li><li>
              <code>0xFF_EC_DE_5E</code> — hexadecimal, agrupado em bytes
            </li><li>
              <code>3.141_592_653</code> — decimais também
            </li>
          </ul><p>
            <strong>Onde NÃO pode aparecer:</strong>
          </p><ul>
            <li>
              No começo: <code>_100</code> ❌ (vira nome de variável)
            </li><li>
              No fim: <code>100_</code> ❌
            </li><li>
              Colado no ponto decimal: <code>3._14</code> ou <code>3_.14</code> ❌
            </li><li>
              Colado no sufixo: <code>100_L</code> ❌ (precisa ser <code>100L</code> ou <code>1_000L</code>)
            </li>
          </ul>
        </AlertBox><AlertBox type="note" title="Por que aquele L no final do long?">
          <p>
            Todo número inteiro que você escreve em Java é tratado como<code>int</code> por padrão (32 bits, vai até ~2,1 bilhões). Se o valor passar disso, o compilador reclama:
          </p><ul>
            <li>
              <code>long x = 149_600_000_000;</code> ❌ "integer number too large"
            </li><li>
              <code>long x = 149_600_000_000L;</code> ✅ o <code>L</code> diz "trate este literal como long"
            </li>
          </ul><p>
            Sempre escreva o <code>L</code> em maiúsculo. O <code>l</code>minúsculo se confunde com o número 1 e já causou bugs sérios em código legado.
          </p>
        </AlertBox><h2>Promoção automática de tipos</h2><p>
          Quando você mistura tipos numéricos diferentes numa operação, Java promove o "menor" para o "maior" automaticamente. A escala vai assim:
        </p><p>
          <code>byte → short → int → long → float → double</code>
        </p><p>
          Repare que <code>float</code> vem depois de <code>long</code> mesmo tendo menos bits — é porque float consegue representar valores muito maiores (com perda de precisão).
        </p><CodeBlock title="Promoção em ação" code={`int a = 10;
long b = 20L;
long resultado = a + b;

int x = 5;
double y = 2.0;
double divisao = x / y;

System.out.println(resultado);
System.out.println(divisao);`} /><AlertBox type="warning" title="A volta (downcast) não é automática">
          Ir do maior para o menor exige cast explícito e pode perder dados:<code>int n = (int) 3.99;</code> resulta em <code>3</code>, sem arredondar. Você assume o risco quando escreve o cast.
        </AlertBox><AlertBox type="danger" title="Pegadinha clássica: overflow silencioso em multiplicação de int">
          <p>
            A conta inteira é feita no tipo dos <em>operandos</em>, não no tipo do destino. Se todos forem <code>int</code>, ela estoura silenciosamente ANTES de virar <code>long</code>:
          </p><CodeBlock title="O bug e a correção" code={`// ❌ Estoura int e vira número negativo aleatório
long msPorAno = 1000 * 60 * 60 * 24 * 365;

// ✅ O L em pelo menos UM operando força a conta inteira em long
long msPorAno = 1000L * 60 * 60 * 24 * 365;

System.out.println(msPorAno); // 31_536_000_000`} /><p>
            Toda vez que você multiplicar números grandes que cabem em<code>long</code>, mas cujos fatores são <code>int</code>, marque o primeiro com <code>L</code>. Esse bug é responsável por contadores de tempo malucos em produção.
          </p>
        </AlertBox><h2>int vs Integer: primitivo vs wrapper</h2><p>
          Para cada primitivo numérico existe uma classe "wrapper" que o embrulha como objeto: <code>int → Integer</code>, <code>long → Long</code>,<code>double → Double</code>, e por aí vai. Wrappers são necessários quando você precisa de um tipo de objeto — por exemplo, dentro de uma<code>List</code> ou de um <code>Map</code>.
        </p><CodeBlock title="Boxing e unboxing" code={`int primitivo = 42;
Integer objeto = primitivo;       // autoboxing
int devolta = objeto;             // unboxing

Integer pode = null;              // wrappers aceitam null
// int naoPode = null;            // não compila

System.out.println(objeto + 1);   // 43`} /><AlertBox type="warning" title="Cuidado com NullPointerException">
          Quando você faz unboxing de um wrapper que vale <code>null</code>, a JVM joga <code>NullPointerException</code>. Sempre verifique antes ou prefira primitivos quando a ausência de valor não fizer sentido.
        </AlertBox><h2>BigDecimal: dinheiro nunca em double</h2><p>
          Aqui mora uma das pegadinhas mais cruéis. Computadores guardam decimais em base 2, e muitos números que você considera "redondos" em base 10 não têm representação exata. Resultado:
        </p><CodeBlock title="Por que double não serve para dinheiro" code={`double a = 0.1;
double b = 0.2;
System.out.println(a + b);
// imprime 0.30000000000000004`} /><p>
          Para valores monetários, financeiros ou qualquer cálculo que exija precisão decimal exata, use <code>BigDecimal</code>:
        </p><CodeBlock title="Dinheiro do jeito certo" code={`import java.math.BigDecimal;

public class Dinheiro {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("19.99");
        BigDecimal qtd = new BigDecimal("3");
        BigDecimal total = preco.multiply(qtd);
        System.out.println(total); // 59.97 exato
    }
}`} /><AlertBox type="tip" title="Sempre passe String para BigDecimal">
          Use <code>new BigDecimal("0.1")</code> em vez de<code>new BigDecimal(0.1)</code>. O segundo recebe um double impreciso e propaga o erro.
        </AlertBox><h2>char é um número de 16 bits</h2><p>
          Apesar de representar um caractere, <code>char</code> é internamente um número inteiro sem sinal de 16 bits que aponta para uma posição na tabela Unicode (especificamente UTF-16). Isso significa que você pode fazer aritmética com chars:
        </p><CodeBlock title="char é número disfarçado" code={`char letra = 'A';
int codigo = letra;
System.out.println(codigo);     // 65

char proxima = (char) (letra + 1);
System.out.println(proxima);    // B

char acento = 'á';
System.out.println((int) acento); // 225`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um programa que declare um <code>int</code> com o valor máximo possível (<code>Integer.MAX_VALUE</code>), some 1 e imprima o resultado. Observe o overflow. Depois faça a mesma coisa usando <code>long</code>e veja a diferença.
          </li><li>
            Calcule <code>0.1 + 0.2 + 0.3</code> usando <code>double</code> e depois usando <code>BigDecimal</code>. Imprima os dois resultados lado a lado.
          </li><li>
            Escreva um trecho que receba um <code>char</code> de letra minúscula e devolva o equivalente em maiúscula somando ou subtraindo o valor numérico certo (dica: <code>'a' - 'A' = 32</code>).
          </li>
        </ol>
      </PageContainer>
  );
}
