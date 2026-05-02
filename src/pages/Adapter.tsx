import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Adapter() {
  return (
    <PageContainer title="Adapter" subtitle="Encaixar uma interface incompatível em outra — adaptador de tomada para código." difficulty="intermediario" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você comprou um carregador americano e a tomada brasileira tem três pinos diferentes. Solução: adaptador. Não muda o carregador, não muda a tomada — coloca algo no meio que <em>traduz</em>.
        </p><p>Em código, a mesma situação acontece o tempo todo:</p><ul>
          <li>
            Sua aplicação espera uma interface <code>PagamentoGateway</code>.
          </li><li>
            A biblioteca/legado que você precisa usar expõe <code>GatewayAntigo</code> com nomes e parâmetros completamente diferentes.
          </li><li>Você não pode (ou não quer) mexer em nenhum dos dois lados.</li>
        </ul><p>
          O <strong>Adapter</strong> implementa a interface esperada e, por dentro, traduz para a outra.
        </p><h2>Estrutura</h2><ul>
          <li>
            <strong>Target</strong>: interface que seu código espera (<code>PagamentoGateway</code>).
          </li><li>
            <strong>Adaptee</strong>: classe que você tem mas tem assinatura incompatível (<code>GatewayAntigo</code>).
          </li><li>
            <strong>Adapter</strong>: implementa <code>Target</code> e <em>delega</em> para o <code>Adaptee</code>.
          </li>
        </ul><h2>Exemplo: gateway de pagamento</h2><CodeBlock title="Target — o que sua aplicação espera" code={`public interface PagamentoGateway {
    boolean cobrar(String cartao, double valor);
}`} /><CodeBlock title="Adaptee — biblioteca legada que voce precisa usar" code={`public class GatewayAntigo {
    // API estranha, em outra linguagem de dominio
    public int processarTransacao(long numeroCartao, int centavos, String moeda) {
        // ... codigo legado
        return 0; // 0 = sucesso, qualquer outro = erro
    }
}`} /><CodeBlock title="Adapter — traduz Target -> Adaptee" code={`public class GatewayAntigoAdapter implements PagamentoGateway {
    private final GatewayAntigo legado;

    public GatewayAntigoAdapter(GatewayAntigo legado) {
        this.legado = legado;
    }

    @Override
    public boolean cobrar(String cartao, double valor) {
        long numero = Long.parseLong(cartao.replaceAll("\\\\D", ""));
        int centavos = (int) Math.round(valor * 100);
        int resultado = legado.processarTransacao(numero, centavos, "BRL");
        return resultado == 0;
    }
}

// uso
PagamentoGateway gateway = new GatewayAntigoAdapter(new GatewayAntigo());
gateway.cobrar("4111-1111-1111-1111", 199.90);`} /><p>
          O resto da aplicação só vê <code>PagamentoGateway</code>. Quando vier o<code> GatewayNovo</code>, você troca o adapter — sem tocar no resto.
        </p><h2>Object Adapter vs Class Adapter</h2><h3>Object Adapter (composição) — preferido</h3><p>
          O adapter <em>contém</em> uma instância do adaptee. Foi o exemplo acima.
        </p><h3>Class Adapter (herança) — só por curiosidade</h3><p>
          O adapter <em>estende</em> o adaptee e implementa o target. Limitado: Java só permite herança simples e você fica preso à hierarquia do adaptee.
        </p><CodeBlock code={`public class GatewayAntigoAdapter
        extends GatewayAntigo            // herda do adaptee
        implements PagamentoGateway {    // implementa o target

    public boolean cobrar(String cartao, double valor) {
        return processarTransacao(/*...*/) == 0;
    }
}`} /><AlertBox type="tip" title="Quando usar qual">
          99% das vezes use Object Adapter. Composição vence herança aqui também: mais flexível, não vaza métodos do adaptee, e funciona se o adaptee for final.
        </AlertBox><h2>Exemplos na JDK</h2><ul>
          <li>
            <code>Arrays.asList(array)</code> — adapta um array para a interface<code> List</code>.
          </li><li>
            <code>Collections.list(enumeration)</code> — adapta um<code> Enumeration</code> antigo (Java 1.0) para <code>ArrayList</code>.
          </li><li>
            <code>InputStreamReader</code> — adapta um <code>InputStream</code> (bytes) para <code>Reader</code> (chars). Decorator e Adapter aqui se misturam.
          </li>
        </ul><CodeBlock title="Arrays.asList — adapter clássico" code={`String[] array = {"a", "b", "c"};
List<String> lista = Arrays.asList(array);   // mesmo conteudo, outra interface

for (String s : lista) System.out.println(s);`} /><h2>Adapter vs Facade vs Decorator</h2><ul>
          <li>
            <strong>Adapter</strong>: traduz <em>uma</em> interface em <em>outra</em>. Foco em compatibilidade.
          </li><li>
            <strong>Facade</strong>: simplifica <em>um subsistema complexo</em> com uma interface única. Foco em conveniência.
          </li><li>
            <strong>Decorator</strong>: <em>mantém</em> a mesma interface mas adiciona comportamento. Foco em extensão.
          </li>
        </ul><CodeBlock title="Cheatsheet visual" code={`Adapter:   Cliente -> [Adapter] -> AdapteeIncompativel
Facade:    Cliente -> [Facade] -> {SubsystemA, SubsystemB, SubsystemC}
Decorator: Cliente -> [Decorator(Decorator(Componente))] -> Componente`} /><h2>Caso real: trocando bibliotecas</h2><p>
          Sua app usa Jackson para JSON. Aparece um requisito pra trocar por Gson em alguns casos. Em vez de espalhar <code>ObjectMapper</code> e <code>Gson</code> pelo código, defina:
        </p><CodeBlock code={`public interface JsonMapper {
    String toJson(Object o);
    <T> T fromJson(String json, Class<T> tipo);
}

public class JacksonAdapter implements JsonMapper {
    private final ObjectMapper m = new ObjectMapper();
    public String toJson(Object o) { try { return m.writeValueAsString(o); } catch (Exception e) { throw new RuntimeException(e); } }
    public <T> T fromJson(String json, Class<T> tipo) { try { return m.readValue(json, tipo); } catch (Exception e) { throw new RuntimeException(e); } }
}

public class GsonAdapter implements JsonMapper {
    private final Gson g = new Gson();
    public String toJson(Object o) { return g.toJson(o); }
    public <T> T fromJson(String json, Class<T> tipo) { return g.fromJson(json, tipo); }
}`} /><p>
          Agora seu código depende de <code>JsonMapper</code>, não de Jackson nem de Gson. Trocar lib = trocar uma linha de configuração.
        </p><AlertBox type="note" title="Quando NÃO usar Adapter">
          Se você controla os dois lados (sua interface e a classe), simplesmente alinhe a interface direto. Adapter é remédio para quando <em>não</em> dá pra mexer em um dos lados.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie <code>EnvioEmail</code> com método <code>enviar(destino, assunto, corpo)</code>e adapte uma classe legada <code>SmtpClient</code> com método<code> send(SmtpMessage)</code>.
          </li><li>
            Pegue <code>Iterator</code> e <code>Enumeration</code> — escreva um adapter<code> EnumerationToIteratorAdapter</code>. Compare com o que a JDK já oferece (<code>Collections.list</code>).
          </li><li>
            Refaça o exemplo Jackson/Gson trocando o adapter de implementação no<code> main</code> por um e por outro. Note como o resto do código não muda.
          </li>
        </ol>
      </PageContainer>
  );
}
