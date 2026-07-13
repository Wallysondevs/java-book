import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Adapter",subtitle:"Encaixar uma interface incompatível em outra — adaptador de tomada para código.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Você comprou um carregador americano e a tomada brasileira tem três pinos diferentes. Solução: adaptador. Não muda o carregador, não muda a tomada — coloca algo no meio que ",e.jsx("em",{children:"traduz"}),"."]}),e.jsx("p",{children:"Em código, a mesma situação acontece o tempo todo:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Sua aplicação espera uma interface ",e.jsx("code",{children:"PagamentoGateway"}),"."]}),e.jsxs("li",{children:["A biblioteca/legado que você precisa usar expõe ",e.jsx("code",{children:"GatewayAntigo"})," com nomes e parâmetros completamente diferentes."]}),e.jsx("li",{children:"Você não pode (ou não quer) mexer em nenhum dos dois lados."})]}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Adapter"})," implementa a interface esperada e, por dentro, traduz para a outra."]}),e.jsx("h2",{children:"Estrutura"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Target"}),": interface que seu código espera (",e.jsx("code",{children:"PagamentoGateway"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Adaptee"}),": classe que você tem mas tem assinatura incompatível (",e.jsx("code",{children:"GatewayAntigo"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Adapter"}),": implementa ",e.jsx("code",{children:"Target"})," e ",e.jsx("em",{children:"delega"})," para o ",e.jsx("code",{children:"Adaptee"}),"."]})]}),e.jsx("h2",{children:"Exemplo: gateway de pagamento"}),e.jsx(a,{title:"Target — o que sua aplicação espera",code:`public interface PagamentoGateway {
    boolean cobrar(String cartao, double valor);
}`}),e.jsx(a,{title:"Adaptee — biblioteca legada que voce precisa usar",code:`public class GatewayAntigo {
    // API estranha, em outra linguagem de dominio
    public int processarTransacao(long numeroCartao, int centavos, String moeda) {
        // ... codigo legado
        return 0; // 0 = sucesso, qualquer outro = erro
    }
}`}),e.jsx(a,{title:"Adapter — traduz Target -> Adaptee",code:`public class GatewayAntigoAdapter implements PagamentoGateway {
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
gateway.cobrar("4111-1111-1111-1111", 199.90);`}),e.jsxs("p",{children:["O resto da aplicação só vê ",e.jsx("code",{children:"PagamentoGateway"}),". Quando vier o",e.jsx("code",{children:" GatewayNovo"}),", você troca o adapter — sem tocar no resto."]}),e.jsx("h2",{children:"Object Adapter vs Class Adapter"}),e.jsx("h3",{children:"Object Adapter (composição) — preferido"}),e.jsxs("p",{children:["O adapter ",e.jsx("em",{children:"contém"})," uma instância do adaptee. Foi o exemplo acima."]}),e.jsx("h3",{children:"Class Adapter (herança) — só por curiosidade"}),e.jsxs("p",{children:["O adapter ",e.jsx("em",{children:"estende"})," o adaptee e implementa o target. Limitado: Java só permite herança simples e você fica preso à hierarquia do adaptee."]}),e.jsx(a,{code:`public class GatewayAntigoAdapter
        extends GatewayAntigo            // herda do adaptee
        implements PagamentoGateway {    // implementa o target

    public boolean cobrar(String cartao, double valor) {
        return processarTransacao(/*...*/) == 0;
    }
}`}),e.jsx(o,{type:"tip",title:"Quando usar qual",children:"99% das vezes use Object Adapter. Composição vence herança aqui também: mais flexível, não vaza métodos do adaptee, e funciona se o adaptee for final."}),e.jsx("h2",{children:"Exemplos na JDK"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Arrays.asList(array)"})," — adapta um array para a interface",e.jsx("code",{children:" List"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Collections.list(enumeration)"})," — adapta um",e.jsx("code",{children:" Enumeration"})," antigo (Java 1.0) para ",e.jsx("code",{children:"ArrayList"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"InputStreamReader"})," — adapta um ",e.jsx("code",{children:"InputStream"})," (bytes) para ",e.jsx("code",{children:"Reader"})," (chars). Decorator e Adapter aqui se misturam."]})]}),e.jsx(a,{title:"Arrays.asList — adapter clássico",code:`String[] array = {"a", "b", "c"};
List<String> lista = Arrays.asList(array);   // mesmo conteudo, outra interface

for (String s : lista) System.out.println(s);`}),e.jsx("h2",{children:"Adapter vs Facade vs Decorator"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Adapter"}),": traduz ",e.jsx("em",{children:"uma"})," interface em ",e.jsx("em",{children:"outra"}),". Foco em compatibilidade."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Facade"}),": simplifica ",e.jsx("em",{children:"um subsistema complexo"})," com uma interface única. Foco em conveniência."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Decorator"}),": ",e.jsx("em",{children:"mantém"})," a mesma interface mas adiciona comportamento. Foco em extensão."]})]}),e.jsx(a,{title:"Cheatsheet visual",code:`Adapter:   Cliente -> [Adapter] -> AdapteeIncompativel
Facade:    Cliente -> [Facade] -> {SubsystemA, SubsystemB, SubsystemC}
Decorator: Cliente -> [Decorator(Decorator(Componente))] -> Componente`}),e.jsx("h2",{children:"Caso real: trocando bibliotecas"}),e.jsxs("p",{children:["Sua app usa Jackson para JSON. Aparece um requisito pra trocar por Gson em alguns casos. Em vez de espalhar ",e.jsx("code",{children:"ObjectMapper"})," e ",e.jsx("code",{children:"Gson"})," pelo código, defina:"]}),e.jsx(a,{code:`public interface JsonMapper {
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
}`}),e.jsxs("p",{children:["Agora seu código depende de ",e.jsx("code",{children:"JsonMapper"}),", não de Jackson nem de Gson. Trocar lib = trocar uma linha de configuração."]}),e.jsxs(o,{type:"note",title:"Quando NÃO usar Adapter",children:["Se você controla os dois lados (sua interface e a classe), simplesmente alinhe a interface direto. Adapter é remédio para quando ",e.jsx("em",{children:"não"})," dá pra mexer em um dos lados."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie ",e.jsx("code",{children:"EnvioEmail"})," com método ",e.jsx("code",{children:"enviar(destino, assunto, corpo)"}),"e adapte uma classe legada ",e.jsx("code",{children:"SmtpClient"})," com método",e.jsx("code",{children:" send(SmtpMessage)"}),"."]}),e.jsxs("li",{children:["Pegue ",e.jsx("code",{children:"Iterator"})," e ",e.jsx("code",{children:"Enumeration"})," — escreva um adapter",e.jsx("code",{children:" EnumerationToIteratorAdapter"}),". Compare com o que a JDK já oferece (",e.jsx("code",{children:"Collections.list"}),")."]}),e.jsxs("li",{children:["Refaça o exemplo Jackson/Gson trocando o adapter de implementação no",e.jsx("code",{children:" main"})," por um e por outro. Note como o resto do código não muda."]})]})]})}export{n as default};
