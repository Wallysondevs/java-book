import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Enums() {
  return (
    <PageContainer title="Enums" subtitle="Conjunto fechado de constantes — mais poderoso do que parece." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Você está modelando os status de um pedido: <em>aguardando</em>,<em>pago</em>, <em>enviado</em>, <em>entregue</em>, <em>cancelado</em>. A tentação inicial é usar <code>String</code> ou <code>int</code>:<code>status = "PAGO"</code>, <code>status = 2</code>. Quase sempre, é uma decisão ruim. Strings deixam você passar <code>"pgo"</code> com erro de digitação e o compilador nem pisca. Inteiros deixam você passar<code>42</code> sem que isso signifique nada.
        </p><p>
          Enum resolve esses dois problemas e ainda traz superpoderes. É um tipo que diz "eu só posso ser uma destas N opções, e o compilador vai te ajudar a garantir isso". Pense num botão de seletor de marcha do carro: P, R, N, D. Não tem como deslizar pra "L7" — fisicamente impossível. Enum é isso no código.
        </p><h2>Sintaxe básica</h2><CodeBlock title="Enum simples" code={`public enum StatusPedido {
    AGUARDANDO,
    PAGO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}

// Em outro lugar:
StatusPedido s = StatusPedido.PAGO;
if (s == StatusPedido.ENTREGUE) {
    System.out.println("Pedido finalizado!");
}`} /><p>
          Cada constante (<code>AGUARDANDO</code>, <code>PAGO</code>...) é uma<strong>instância única</strong> do tipo <code>StatusPedido</code>. Não dá pra criar uma sexta — se tentar atribuir <code>StatusPedido.QUALQUER_OUTRO</code>, o compilador reclama imediatamente.
        </p><h2>Enums são classes de verdade</h2><p>
          Aqui mora a maior surpresa de quem vem de outras linguagens: enum em Java NÃO é só uma lista de inteiros nomeados. É uma classe completa. Você pode adicionar campos, construtores e métodos. Cada constante carrega seus próprios dados.
        </p><CodeBlock title="Enum com estado e comportamento" code={`public enum Planeta {
    MERCURIO(3.303e+23, 2.4397e6),
    TERRA   (5.976e+24, 6.37814e6),
    JUPITER (1.9e+27,   7.1492e7);

    private final double massa;
    private final double raio;

    // Construtor é IMPLICITAMENTE private — chamado uma vez por constante
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
    }

    public double gravidadeSuperficie() {
        final double G = 6.67300E-11;
        return G * massa / (raio * raio);
    }
}

// Planeta.TERRA.gravidadeSuperficie()  →  ~9.8`} /><AlertBox type="info" title="Por trás das cortinas">
          Quando você escreve <code>TERRA(5.976e+24, 6.37814e6)</code>, o Java executa o construtor uma vez na carga da classe e guarda essa instância pronta. As três constantes do enum acima são, literalmente, três objetos diferentes da classe<code>Planeta</code>.
        </AlertBox><h2>Métodos prontos: values(), valueOf(), ordinal()</h2><p>Todo enum ganha de graça alguns métodos super úteis:</p><ul>
          <li>
            <code>values()</code>: retorna um array com TODAS as constantes, na ordem declarada.
          </li><li>
            <code>valueOf("NOME")</code>: faz o caminho inverso — recebe a String e devolve a constante. Útil pra ler de banco/JSON.
          </li><li>
            <code>name()</code>: retorna o nome da constante como String.
          </li><li>
            <code>ordinal()</code>: retorna a posição (0-based) na declaração.
          </li>
        </ul><CodeBlock title="Métodos automáticos" code={`for (StatusPedido s : StatusPedido.values()) {
    System.out.println(s.ordinal() + " - " + s.name());
}
// 0 - AGUARDANDO
// 1 - PAGO
// 2 - ENVIADO
// ...

StatusPedido p = StatusPedido.valueOf("PAGO");  // funciona
StatusPedido x = StatusPedido.valueOf("PGO");   // IllegalArgumentException`} /><AlertBox type="warning" title="Cuidado com ordinal()">
          Nunca use <code>ordinal()</code> pra persistir em banco ou enviar pra API. Se alguém reordenar as constantes (ou inserir uma no meio), todos os números mudam e seus dados antigos ficam errados. Prefira <code>name()</code>, que é textual e estável.
        </AlertBox><h2>Enum em switch</h2><p>
          Em <code>switch</code>, você usa o nome da constante <strong>sem o prefixo</strong>do enum. O compilador já sabe o tipo. Fica limpo e legível:
        </p><CodeBlock title="Switch idiomático" code={`String mensagem = switch (status) {
    case AGUARDANDO -> "Estamos esperando o pagamento.";
    case PAGO       -> "Vamos preparar seu pedido.";
    case ENVIADO    -> "Já está a caminho!";
    case ENTREGUE   -> "Aproveite!";
    case CANCELADO  -> "Pedido cancelado.";
};`} /><p>
          Bônus: no switch expression do Java 21, se você cobrir TODAS as constantes do enum, não precisa de <code>default</code>. E se um dia adicionarem uma constante nova, o compilador acusa e te leva direto onde precisa atualizar.
        </p><h2>Enum implementando interface</h2><p>
          Como enum é uma classe, ele pode implementar interfaces normalmente. Isso é útil quando você quer tratar várias constantes (de enums diferentes ou não) sob um mesmo contrato.
        </p><CodeBlock title="Enum + interface" code={`public interface Descritivel {
    String descricao();
}

public enum Prioridade implements Descritivel {
    BAIXA, MEDIA, ALTA;

    @Override
    public String descricao() {
        return "Prioridade " + name().toLowerCase();
    }
}`} /><h2>Método abstract por constante</h2><p>
          E se cada constante precisar de um comportamento diferente? Você pode declarar um método <code>abstract</code> no enum e implementar dentro de cada constante, usando blocos. Cada constante vira praticamente uma subclasse anônima.
        </p><CodeBlock title="Comportamento por constante" code={`public enum Operacao {
    SOMA {
        @Override public int aplicar(int a, int b) { return a + b; }
    },
    SUBTRACAO {
        @Override public int aplicar(int a, int b) { return a - b; }
    },
    MULTIPLICACAO {
        @Override public int aplicar(int a, int b) { return a * b; }
    };

    public abstract int aplicar(int a, int b);
}

// Operacao.SOMA.aplicar(2, 3)          →  5
// Operacao.MULTIPLICACAO.aplicar(2, 3) →  6`} /><p>
          Esse padrão é elegante porque elimina aquele <code>switch</code> repetido em várias funções: o comportamento mora junto da constante.
        </p><h2>EnumSet e EnumMap: performance grátis</h2><p>
          O JDK tem duas coleções especializadas pra enums e elas são absurdamente eficientes (internamente usam bitmaps/arrays, não tabelas hash). Sempre que você for guardar conjuntos ou mapas com chave de enum, prefira essas:
        </p><CodeBlock title="EnumSet e EnumMap" code={`import java.util.EnumSet;
import java.util.EnumMap;

EnumSet<StatusPedido> finais =
    EnumSet.of(StatusPedido.ENTREGUE, StatusPedido.CANCELADO);

if (finais.contains(pedido.status())) {
    System.out.println("Pedido já encerrado.");
}

EnumMap<StatusPedido, String> rotulos = new EnumMap<>(StatusPedido.class);
rotulos.put(StatusPedido.PAGO,     "Verde");
rotulos.put(StatusPedido.ENVIADO,  "Azul");
rotulos.put(StatusPedido.ENTREGUE, "Cinza");`} /><AlertBox type="success" title="Por que tão rápido?">
          Como o conjunto de constantes do enum é fixo e conhecido em compilação,<code>EnumSet</code> guarda a presença de cada uma como um bit num<code>long</code> (até 64 valores). Operações como união, interseção e contains viram operações de CPU instantâneas.
        </AlertBox><h2>Por que enum é melhor que constantes int</h2><p>
          Antigamente, código Java estava cheio de <code>public static final int</code>:
        </p><ul>
          <li>
            <strong>Sem segurança de tipo</strong>: qualquer <code>int</code> passa, mesmo um valor inválido como 999.
          </li><li>
            <strong>Sem nome em logs</strong>: você imprime <code>2</code> e ninguém sabe o que é.
          </li><li>
            <strong>Sem agrupamento</strong>: nada impede misturar constantes de "tipos" diferentes.
          </li><li>
            <strong>Sem comportamento</strong>: int não tem método.
          </li>
        </ul><p>
          Enum corrige tudo isso de uma vez. Se você se pegar criando um grupo de constantes relacionadas, pare e pergunte: "isso não deveria ser um enum?" Quase sempre a resposta é sim.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um enum <code>DiaSemana</code> com os sete dias e um método<code>boolean ehFimDeSemana()</code>. Itere com <code>values()</code>imprimindo apenas os dias úteis.
          </li><li>
            Modele um enum <code>Moeda</code> com constantes <code>REAL</code>,<code>DOLAR</code>, <code>EURO</code>, cada uma com símbolo (R$, US$, €) e um método <code>formatar(double valor)</code> que retorna a string formatada.
          </li><li>
            Crie o enum <code>Operacao</code> do exemplo (com método abstract por constante) e adicione <code>DIVISAO</code>. Use um <code>
              {"EnumMap<Operacao, String>"}
            </code>mapeando cada operação ao seu símbolo (<code>"+"</code>, <code>"-"</code>...).
          </li>
        </ol>
      </PageContainer>
  );
}
