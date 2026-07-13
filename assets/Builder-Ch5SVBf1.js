import{j as e}from"./index-BpXci30S.js";import{P as o,A as i}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(o,{title:"Builder",subtitle:"Construir objetos complexos passo a passo — adeus construtores com 12 parâmetros.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsx("p",{children:"Já viu (ou escreveu) algo assim?"}),e.jsx(a,{title:"O horror",code:`Pizza p = new Pizza("grande", "mussarela", true, false, true,
                    "borda recheada", "catupiry", false, 2, "calabresa");`}),e.jsxs("p",{children:["Boa sorte lembrando o que cada ",e.jsx("code",{children:"true/false"}),' significa daqui a 6 meses. E se metade dos campos for opcional, você acaba criando 8 construtores sobrecarregados (o "telescoping constructor anti-pattern"):']}),e.jsx(a,{code:`public Pizza(String tamanho) { ... }
public Pizza(String tamanho, String massa) { ... }
public Pizza(String tamanho, String massa, boolean borda) { ... }
public Pizza(String tamanho, String massa, boolean borda, boolean queijoExtra) { ... }
// ... mais 6 variacoes`}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Builder"})," resolve isso: monta o objeto chamando métodos nomeados, encadeados, e só no ",e.jsx("code",{children:"build()"})," entrega o objeto final (geralmente imutável)."]}),e.jsx("h2",{children:"Estrutura clássica"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Classe alvo (ex: ",e.jsx("code",{children:"Pizza"}),") com construtor ",e.jsx("em",{children:"privado"}),"."]}),e.jsxs("li",{children:["Inner static class ",e.jsx("code",{children:"Builder"})," com os mesmos campos, mas mutáveis."]}),e.jsxs("li",{children:["Métodos ",e.jsx("code",{children:"com*"})," / ",e.jsx("code",{children:"with*"})," que setam o campo e retornam ",e.jsx("code",{children:"this"}),"."]}),e.jsxs("li",{children:["Método ",e.jsx("code",{children:"build()"})," que valida e instancia o objeto final."]})]}),e.jsx("h2",{children:"Exemplo completo: Pizza"}),e.jsx(a,{title:"Pizza.java",code:`public class Pizza {
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
}`}),e.jsx("h3",{children:"Uso"}),e.jsx(a,{code:`Pizza p = Pizza.builder()
    .tamanho("grande")
    .sabor("calabresa")
    .bordaRecheada("catupiry")
    .queijoExtra()
    .build();`}),e.jsx("p",{children:"Compare com a versão original. Legibilidade subiu absurdamente."}),e.jsxs(i,{type:"tip",title:"Validação no build()",children:[e.jsx("code",{children:"build()"}),' é o único ponto de saída. Coloque ali toda validação cruzada (ex: "se bordaRecheada == true, recheioBorda não pode ser null"). Falhe rápido, falhe alto.']}),e.jsx("h2",{children:"Combinando com record (Java 16+)"}),e.jsxs("p",{children:[e.jsx("code",{children:"record"})," dá imutabilidade de graça. Você pode ter um Builder que constrói um record:"]}),e.jsx(a,{code:`public record Pizza(String tamanho, String massa, String sabor,
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
}`}),e.jsx("h2",{children:"Lombok @Builder (o atalho que todo mundo usa)"}),e.jsx("p",{children:"Em projetos com Lombok, você troca toda a inner class por uma anotação:"}),e.jsx(a,{code:`import lombok.Builder;
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
    .build();`}),e.jsx(i,{type:"warning",title:"Cuidado com Lombok",children:"Time precisa do plugin instalado na IDE. Em projetos open-source ou times sem consenso, talvez prefira escrever o Builder à mão."}),e.jsx("h2",{children:"Quando Builder é exagero"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Record com 3 campos obrigatórios — use o construtor canônico mesmo."}),e.jsx("li",{children:"Classe interna usada em 1 lugar — overkill."}),e.jsx("li",{children:"DTO simples de request HTTP — Jackson preenche pra você."})]}),e.jsxs("p",{children:["Regra de bolso: ",e.jsx("strong",{children:"Builder começa a valer a pena com 4-5 parâmetros, ou quando metade é opcional"}),"."]}),e.jsx("h2",{children:"Builders famosos da JDK"}),e.jsx(a,{title:"StringBuilder — o Builder mais usado do mundo",code:`String s = new StringBuilder()
    .append("Ola, ")
    .append(nome)
    .append("! Voce tem ")
    .append(idade)
    .append(" anos.")
    .toString();`}),e.jsx(a,{title:"HttpRequest.newBuilder() — Java 11+",code:`HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.exemplo.com/dados"))
    .header("Accept", "application/json")
    .timeout(Duration.ofSeconds(10))
    .GET()
    .build();`}),e.jsx(a,{title:"Stream.Builder — coletando elementos passo a passo",code:`Stream<String> s = Stream.<String>builder()
    .add("a").add("b").add("c")
    .build();`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Implemente um ",e.jsx("code",{children:"UsuarioBuilder"})," com campos ",e.jsx("code",{children:"nome"}),",",e.jsx("code",{children:" email"}),", ",e.jsx("code",{children:"idade"}),", ",e.jsx("code",{children:"endereco"}),",",e.jsx("code",{children:" telefone"}),". Faça ",e.jsx("code",{children:"nome"})," e ",e.jsx("code",{children:"email"}),"obrigatórios — valide no ",e.jsx("code",{children:"build()"}),"."]}),e.jsxs("li",{children:["Refaça a Pizza usando ",e.jsx("code",{children:"record"})," + Builder. Compare com a versão classe normal."]}),e.jsxs("li",{children:["Brinque com ",e.jsx("code",{children:"HttpRequest.newBuilder()"})," e ",e.jsx("code",{children:"HttpClient"}),": faça um GET pra ",e.jsx("a",{href:"https://httpbin.org/get",children:"https://httpbin.org/get"})," e imprima o body. Note como o Builder torna a chamada legível."]})]})]})}export{d as default};
