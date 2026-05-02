import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sealed() {
  return (
    <PageContainer title="Sealed Classes (Java 17+)" subtitle="Controle exatamente quem pode estender sua classe — fecha hierarquia." difficulty="avancado" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine que você modela formas de pagamento no seu sistema:<code>Dinheiro</code>, <code>Pix</code>, <code>Cartao</code>. Você quer ter certeza absoluta de que NÃO existe uma quarta opção surgindo do nada num pacote qualquer da aplicação. Quer que o compilador te avise se um dia alguém adicionar<code>Cripto</code> e você esquecer de tratar isso no seu <code>switch</code>.
        </p><p>
          Antes do Java 17, suas opções eram: deixar a classe pública e cruzar os dedos, ou marcar <code>final</code> e perder hierarquia. Sealed classes resolvem isso: você diz "essa classe pode ser estendida, mas APENAS por essas três aqui". É uma cerca: aberta pra quem você convidou, fechada pro resto.
        </p><h2>Sintaxe básica</h2><CodeBlock title="Hierarquia fechada" code={`public sealed class Pagamento
        permits Dinheiro, Pix, Cartao {
    private final double valor;
    public Pagamento(double valor) { this.valor = valor; }
    public double valor() { return valor; }
}

public final class Dinheiro extends Pagamento {
    public Dinheiro(double valor) { super(valor); }
}

public final class Pix extends Pagamento {
    private final String chave;
    public Pix(double valor, String chave) {
        super(valor);
        this.chave = chave;
    }
    public String chave() { return chave; }
}

public final class Cartao extends Pagamento {
    private final String bandeira;
    public Cartao(double valor, String bandeira) {
        super(valor);
        this.bandeira = bandeira;
    }
    public String bandeira() { return bandeira; }
}`} /><p>
          A classe <code>Pagamento</code> usa <code>sealed</code> e <code>permits</code>pra listar quem pode herdar dela. Qualquer outra classe que tentar<code>extends Pagamento</code> recebe erro de compilação. Acabou a brincadeira.
        </p><h2>A regra dos três modificadores</h2><p>
          Toda subclasse permitida em um sealed precisa escolher um destes três modificadores. O compilador não te deixa esquecer:
        </p><ul>
          <li>
            <strong>
              <code>final</code>
            </strong>: termina a hierarquia. Ninguém estende essa subclasse. É o caso mais comum.
          </li><li>
            <strong>
              <code>sealed</code>
            </strong>: continua a cerca — a subclasse também restringe seus filhos com seu próprio <code>permits</code>.
          </li><li>
            <strong>
              <code>non-sealed</code>
            </strong>: abre o portão. A subclasse pode ser estendida livremente por qualquer um. Use com critério.
          </li>
        </ul><CodeBlock title="Os três sabores" code={`public sealed class Forma permits Circulo, Poligono, Linha {}

public final class Circulo extends Forma {}                      // fim de hierarquia

public sealed class Poligono extends Forma                        // continua restringindo
        permits Triangulo, Quadrado {}

public non-sealed class Linha extends Forma {}                    // abre pra qualquer um

public final class Triangulo extends Poligono {}
public final class Quadrado extends Poligono {}`} /><AlertBox type="tip" title="Mesmo arquivo, ainda mais simples">
          Se as subclasses moram no MESMO arquivo .java do sealed pai, você pode até omitir a cláusula <code>permits</code> — o compilador deduz a lista. Mas escrever explícito é considerado melhor estilo, porque deixa óbvio quem participa.
        </AlertBox><h2>Sum types: o uso clássico</h2><p>
          Sealed classes são a forma do Java de expressar <strong>tipos algébricos somados</strong> (sum types) — comuns em linguagens como Kotlin, Rust, Scala. A ideia é: "esse valor é UM destes N casos possíveis, e nada mais".
        </p><p>Combinando com records, fica ainda melhor:</p><CodeBlock title="Sum type com records" code={`sealed interface Resultado<T> permits Sucesso, Falha {}

record Sucesso<T>(T valor)        implements Resultado<T> {}
record Falha<T>(String mensagem) implements Resultado<T> {}`} /><p>
          Agora qualquer função no seu sistema pode retornar <code>
            {"Resultado<Pedido>"}
          </code>e quem chama sabe que vai receber EXATAMENTE um <code>Sucesso</code> ou um<code>Falha</code>. Sem null, sem exceção surpresa, sem terceira opção.
        </p><h2>Combinando com pattern matching no switch</h2><p>
          Aqui mora a maior vantagem prática: quando você usa um sealed type num<code>switch</code> moderno (Java 21+), o compilador checa<strong>exaustividade</strong>. Se você esquecer de tratar um dos casos, ele recusa compilar. É refatoração assistida: adicionou um caso novo? O compilador te leva pelo time inteiro mostrando onde você precisa atualizar.
        </p><CodeBlock title="Switch exaustivo" code={`public static String descrever(Pagamento p) {
    return switch (p) {
        case Dinheiro d -> "Pagamento em dinheiro de R$ " + d.valor();
        case Pix x      -> "Pix de R$ " + x.valor() + " pra chave " + x.chave();
        case Cartao c   -> "Cartao " + c.bandeira() + " no valor de R$ " + c.valor();
        // Se você esquecer um caso, ERRO de compilação.
        // Não precisa de "default"!
    };
}`} /><AlertBox type="success" title="Sem default = melhor design">
          O <code>default</code> num switch costuma esconder bugs. Com sealed + switch exaustivo, você nunca tem o "e se aparecer um caso novo?" — porque o compilador não deixa esse caso passar despercebido. Refatoração segura.
        </AlertBox><h2>Por que isso importa pra APIs e bibliotecas</h2><p>
          Quando você publica uma biblioteca, classes públicas viram parte do contrato com seus usuários. Se uma classe é aberta pra herança, alguém vai herdar dela — e a partir desse momento você não pode mais mudá-la sem quebrar código alheio.
        </p><p>
          Sealed te dá controle: "essa hierarquia é minha, eu evoluo com segurança". Você pode adicionar uma nova subclasse permitida (compatível) ou refatorar livremente as existentes, sabendo que ninguém de fora estendeu o que não devia.
        </p><h2>Sealed vs enum</h2><p>
          À primeira vista parecem similares — os dois descrevem "um conjunto fechado". Mas tem diferenças importantes:
        </p><ul>
          <li>
            <strong>Enum</strong>: cada constante é uma <em>instância única</em> e fixa. Você não cria <code>Dia.SEGUNDA</code> em runtime — ela já existe.
          </li><li>
            <strong>Sealed</strong>: cada subclasse pode ter <em>vários objetos</em>, com dados diferentes. <code>new Pix(100, "x@y.com")</code> e <code>new Pix(50, "z@w.com")</code> são dois Pix distintos.
          </li><li>
            <strong>Enum</strong>: comportamento por constante, mas todos compartilham o mesmo "shape" (mesmos campos).
          </li><li>
            <strong>Sealed</strong>: cada subclasse tem seus próprios campos e construtor.
          </li>
        </ul><p>
          Regra prática: se cada caso é uma constante simples (estados de pedido, dias da semana), use enum. Se cada caso carrega dados próprios diferentes, use sealed.
        </p><AlertBox type="warning" title="Restrição importante de pacote/módulo">
          As subclasses listadas em <code>permits</code> precisam estar no MESMO módulo (se você usa o sistema de módulos), ou no mesmo pacote (se está sem módulos). Não dá pra "permitir" uma classe num jar externo.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma sealed interface <code>Notificacao</code> que permita os records<code>EmailMsg(String para, String assunto)</code>,<code>SmsMsg(String numero, String texto)</code> e<code>PushMsg(String dispositivo, String corpo)</code>. Escreva uma função<code>enviar</code> com switch exaustivo.
          </li><li>
            Modele uma árvore binária com <code>sealed interface Arvore permits No, Folha</code>, onde <code>No(int valor, Arvore esquerda, Arvore direita)</code> e<code>Folha</code> é vazia. Escreva uma função <code>somar(Arvore)</code> que percorre tudo.
          </li><li>
            Crie uma hierarquia: <code>sealed Animal permits Mamifero, Reptil</code>, onde <code>Mamifero</code> também é <code>sealed permits Cachorro, Gato</code>e <code>Reptil</code> é <code>non-sealed</code>. Crie um <code>Lagarto</code>que herda de Reptil sem precisar de permissão. Tente criar uma classe que herde de <code>Mamifero</code> sem estar no permits e veja o erro.
          </li>
        </ol>
      </PageContainer>
  );
}
