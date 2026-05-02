import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Builder() {
  return (
    <PageContainer title="Builder" subtitle="Construir objetos complexos passo a passo — adeus construtores com 12 parâmetros." difficulty="intermediario" timeToRead="18 min">
        <h2>POR QUE você precisa disso</h2><p>Já viu (ou escreveu) algo assim?</p><CodeBlock title="O horror" code={`Pizza p = new Pizza("grande", "mussarela", true, false, true,
                    "borda recheada", "catupiry", false, 2, "calabresa");`} /><p>
          Boa sorte lembrando o que cada <code>true/false</code> significa daqui a 6 meses. E se metade dos campos for opcional, você acaba criando 8 construtores sobrecarregados (o "telescoping constructor anti-pattern"):
        </p><CodeBlock code={`public Pizza(String tamanho) { ... }
public Pizza(String tamanho, String massa) { ... }
public Pizza(String tamanho, String massa, boolean borda) { ... }
public Pizza(String tamanho, String massa, boolean borda, boolean queijoExtra) { ... }
// ... mais 6 variacoes`} /><p>
          O <strong>Builder</strong> resolve isso: monta o objeto chamando métodos nomeados, encadeados, e só no <code>build()</code> entrega o objeto final (geralmente imutável).
        </p><h2>Estrutura clássica</h2><ol>
          <li>
            Classe alvo (ex: <code>Pizza</code>) com construtor <em>privado</em>.
          </li><li>
            Inner static class <code>Builder</code> com os mesmos campos, mas mutáveis.
          </li><li>
            Métodos <code>com*</code> / <code>with*</code> que setam o campo e retornam <code>this</code>.
          </li><li>
            Método <code>build()</code> que valida e instancia o objeto final.
          </li>
        </ol><h2>Exemplo completo: Pizza</h2><CodeBlock title="Pizza.java" code={`public class Pizza {
    private final String tamanho;
    private final String massa;
    private final String sabor;
    private final boolean bordaRecheada;
    private final String recheioBorda;
    private final boolean queijoExtra;

    private Pizza(Builder b) {
        this.tamanho       = b.tamanho;
        this.massa         = b.massa;
        this.sabor         = b.sabor;
        this.bordaRecheada = b.bordaRecheada;
        this.recheioBorda  = b.recheioBorda;
        this.queijoExtra   = b.queijoExtra;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String tamanho = "media";   // defaults
        private String massa = "tradicional";
        private String sabor;
        private boolean bordaRecheada = false;
        private String recheioBorda;
        private boolean queijoExtra = false;

        public Builder tamanho(String t)        { this.tamanho = t; return this; }
        public Builder massa(String m)          { this.massa = m; return this; }
        public Builder sabor(String s)          { this.sabor = s; return this; }
        public Builder bordaRecheada(String r)  {
            this.bordaRecheada = true; this.recheioBorda = r; return this;
        }
        public Builder queijoExtra()            { this.queijoExtra = true; return this; }

        public Pizza build() {
            if (sabor == null) throw new IllegalStateException("sabor e obrigatorio");
            return new Pizza(this);
        }
    }
}`} /><h3>Uso</h3><CodeBlock code={`Pizza p = Pizza.builder()
    .tamanho("grande")
    .sabor("calabresa")
    .bordaRecheada("catupiry")
    .queijoExtra()
    .build();`} /><p>Compare com a versão original. Legibilidade subiu absurdamente.</p><AlertBox type="tip" title="Validação no build()">
          <code>build()</code> é o único ponto de saída. Coloque ali toda validação cruzada (ex: "se bordaRecheada == true, recheioBorda não pode ser null"). Falhe rápido, falhe alto.
        </AlertBox><h2>Combinando com record (Java 16+)</h2><p>
          <code>record</code> dá imutabilidade de graça. Você pode ter um Builder que constrói um record:
        </p><CodeBlock code={`public record Pizza(String tamanho, String massa, String sabor,
                    boolean bordaRecheada, String recheioBorda, boolean queijoExtra) {

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String tamanho = "media";
        private String sabor;
        // ... resto igual

        public Pizza build() {
            if (sabor == null) throw new IllegalStateException("sabor obrigatorio");
            return new Pizza(tamanho, "tradicional", sabor, false, null, false);
        }
    }
}`} /><h2>Lombok @Builder (o atalho que todo mundo usa)</h2><p>Em projetos com Lombok, você troca toda a inner class por uma anotação:</p><CodeBlock code={`import lombok.Builder;
import lombok.Value;

@Value          // imutavel + getters
@Builder        // gera builder completo
public class Pizza {
    String tamanho;
    String sabor;
    boolean bordaRecheada;
    String recheioBorda;
    boolean queijoExtra;
}

// uso identico
Pizza p = Pizza.builder()
    .tamanho("grande")
    .sabor("calabresa")
    .build();`} /><AlertBox type="warning" title="Cuidado com Lombok">
          Time precisa do plugin instalado na IDE. Em projetos open-source ou times sem consenso, talvez prefira escrever o Builder à mão.
        </AlertBox><h2>Quando Builder é exagero</h2><ul>
          <li>Record com 3 campos obrigatórios — use o construtor canônico mesmo.</li><li>Classe interna usada em 1 lugar — overkill.</li><li>DTO simples de request HTTP — Jackson preenche pra você.</li>
        </ul><p>
          Regra de bolso: <strong>Builder começa a valer a pena com 4-5 parâmetros, ou quando metade é opcional</strong>.
        </p><h2>Builders famosos da JDK</h2><CodeBlock title="StringBuilder — o Builder mais usado do mundo" code={`String s = new StringBuilder()
    .append("Ola, ")
    .append(nome)
    .append("! Voce tem ")
    .append(idade)
    .append(" anos.")
    .toString();`} /><CodeBlock title="HttpRequest.newBuilder() — Java 11+" code={`HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.exemplo.com/dados"))
    .header("Accept", "application/json")
    .timeout(Duration.ofSeconds(10))
    .GET()
    .build();`} /><CodeBlock title="Stream.Builder — coletando elementos passo a passo" code={`Stream<String> s = Stream.<String>builder()
    .add("a").add("b").add("c")
    .build();`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Implemente um <code>UsuarioBuilder</code> com campos <code>nome</code>,<code> email</code>, <code>idade</code>, <code>endereco</code>,<code> telefone</code>. Faça <code>nome</code> e <code>email</code>obrigatórios — valide no <code>build()</code>.
          </li><li>
            Refaça a Pizza usando <code>record</code> + Builder. Compare com a versão classe normal.
          </li><li>
            Brinque com <code>HttpRequest.newBuilder()</code> e <code>HttpClient</code>: faça um GET pra <a href="https://httpbin.org/get">https://httpbin.org/get</a> e imprima o body. Note como o Builder torna a chamada legível.
          </li>
        </ol>
      </PageContainer>
  );
}
