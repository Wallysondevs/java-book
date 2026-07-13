import{j as e}from"./index-BpXci30S.js";import{P as s,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(s,{title:"JSON com Jackson",subtitle:"Lib mais usada do ecossistema — serializar e desserializar POJOs e records.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["JSON é o formato universal pra trocar dados entre serviços, salvar configuração, gravar dump rápido. Java não tem suporte nativo (até hoje não tem!), então você precisa de uma lib. ",e.jsx("strong",{children:"Jackson"})," é a escolha padrão da indústria — vem por baixo do Spring Boot, Quarkus, e praticamente qualquer framework REST."]}),e.jsx("h2",{children:"Adicionando Jackson"}),e.jsx(o,{title:"Maven",code:`<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.2</version>
</dependency>`}),e.jsx(o,{title:"Gradle",code:"implementation 'com.fasterxml.jackson.core:jackson-databind:2.17.2'"}),e.jsx("h2",{children:"ObjectMapper: o motor"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"ObjectMapper"})," é a classe central. Crie uma vez e reutilize — ela é thread-safe depois de configurada. Em apps grandes, injete como singleton."]}),e.jsx(o,{title:"Serializar objeto → JSON",code:`import com.fasterxml.jackson.databind.ObjectMapper;

record Usuario(int id, String nome, String email) {}

public class Serializar {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        Usuario u = new Usuario(1, "Ana", "ana@exemplo.com");
        String json = mapper.writeValueAsString(u);

        System.out.println(json);
        // {"id":1,"nome":"Ana","email":"ana@exemplo.com"}
    }
}`}),e.jsx("h2",{children:"Desserializar JSON → objeto"}),e.jsx(o,{title:"readValue",code:`String json = "{\\"id\\":42,\\"nome\\":\\"Bruno\\",\\"email\\":\\"b@x.com\\"}";

Usuario u = mapper.readValue(json, Usuario.class);
System.out.println(u.nome()); // Bruno`}),e.jsx("h2",{children:"Records vs classes tradicionais"}),e.jsxs("p",{children:["Desde Jackson 2.12, ",e.jsx("strong",{children:"records funcionam direto"})," sem configuração — Jackson detecta os componentes pelo nome. Pra classes tradicionais, você precisa de:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Construtor padrão (sem argumentos), ",e.jsx("strong",{children:"ou"})," construtor anotado com ",e.jsx("code",{children:"@JsonCreator"}),"."]}),e.jsx("li",{children:"Getters/setters públicos (Jackson usa eles pra ler e escrever campos)."})]}),e.jsx(o,{title:"Classe tradicional",code:`public class Produto {
    private String nome;
    private double preco;

    public Produto() {} // necessário

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }
}

// Funciona igual:
Produto p = mapper.readValue(json, Produto.class);`}),e.jsx(r,{type:"tip",title:"Use records sempre que puder",children:"Records eliminam boilerplate, são imutáveis por padrão, e o Jackson adora."}),e.jsx("h2",{children:"Coleções e tipos genéricos"}),e.jsxs("p",{children:["Pra desserializar uma ",e.jsx("code",{children:"List<Usuario>"})," você precisa de ",e.jsx("code",{children:"TypeReference"})," — Java apaga genéricos em runtime, então Jackson não consegue adivinhar."]}),e.jsx(o,{title:"Lista de objetos",code:`import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;

String jsonArr = "[{\\"id\\":1,\\"nome\\":\\"A\\"},{\\"id\\":2,\\"nome\\":\\"B\\"}]";

List<Usuario> lista = mapper.readValue(jsonArr, new TypeReference<List<Usuario>>() {});
lista.forEach(System.out::println);`}),e.jsx("h2",{children:"Anotações úteis"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'@JsonProperty("nome_no_json")'})," — mapeia campo Java pra chave JSON com nome diferente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@JsonIgnore"})," — campo Java que não deve aparecer no JSON (ex.: senha)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@JsonInclude(Include.NON_NULL)"})," — omitir campos nulos do JSON gerado."]}),e.jsxs("li",{children:[e.jsx("code",{children:'@JsonFormat(pattern = "yyyy-MM-dd")'})," — formatar datas."]})]}),e.jsx(o,{title:"Mapeamento custom",code:`import com.fasterxml.jackson.annotation.*;

public record Conta(
    @JsonProperty("user_id") int userId,
    String nome,
    @JsonIgnore String senha
) {}

Conta c = new Conta(1, "Ana", "segredo");
System.out.println(mapper.writeValueAsString(c));
// {"user_id":1,"nome":"Ana"}     <- senha sumiu`}),e.jsx("h2",{children:"JsonNode: parsing dinâmico"}),e.jsxs("p",{children:["Quando você não tem (ou não quer criar) uma classe pro JSON,",e.jsx("code",{children:"JsonNode"})," deixa você navegar pela árvore como se fosse um objeto JS."]}),e.jsx(o,{title:"Navegando JSON desconhecido",code:`import com.fasterxml.jackson.databind.JsonNode;

String json = """
    {
      "usuario": { "nome": "Ana", "tags": ["admin", "ops"] },
      "ativo": true
    }
    """;

JsonNode raiz = mapper.readTree(json);
String nome = raiz.path("usuario").path("nome").asText();
boolean ativo = raiz.path("ativo").asBoolean();
String primeiraTag = raiz.path("usuario").path("tags").get(0).asText();

System.out.println(nome + " | " + ativo + " | " + primeiraTag);`}),e.jsxs(r,{type:"info",title:"path vs get",children:[e.jsx("code",{children:'path("x")'}),' retorna um nó "missing" se a chave não existir (não quebra). ',e.jsx("code",{children:'get("x")'})," retorna ",e.jsx("code",{children:"null"}),". Em navegação encadeada, ",e.jsx("code",{children:"path"})," é mais seguro."]}),e.jsx("h2",{children:"Lendo e escrevendo arquivos"}),e.jsx(o,{title:"Arquivo direto",code:`import java.io.File;

// Escrever JSON em arquivo
mapper.writeValue(new File("usuarios.json"), List.of(
    new Usuario(1, "Ana", "ana@x.com"),
    new Usuario(2, "Bia", "bia@x.com")
));

// Ler JSON de arquivo
List<Usuario> users = mapper.readValue(
    new File("usuarios.json"),
    new TypeReference<List<Usuario>>() {}
);`}),e.jsx("h2",{children:"Pretty printing"}),e.jsx(o,{title:"JSON formatado",code:`String bonito = mapper.writerWithDefaultPrettyPrinter()
                      .writeValueAsString(usuario);
System.out.println(bonito);
/*
{
  "id" : 1,
  "nome" : "Ana",
  "email" : "ana@exemplo.com"
}
*/`}),e.jsx("h2",{children:"Alternativas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Gson"})," (Google): mais simples, menos features. Boa escolha pra projetos pequenos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JSON-B"}),": padrão Jakarta EE. Implementação de referência é Yasson. Pouco usado fora do mundo enterprise."]})]}),e.jsx("p",{children:"Em 99% dos casos, Jackson é a escolha certa."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um record ",e.jsx("code",{children:"Livro(String titulo, String autor, int ano)"}),", serialize uma lista de 3 livros pra arquivo ",e.jsx("code",{children:"livros.json"}),", depois leia de volta e imprima."]}),e.jsxs("li",{children:["Receba este JSON e use ",e.jsx("code",{children:"JsonNode"})," pra extrair o nome do primeiro item: ",e.jsx("code",{children:'{"itens":[{"nome":"x"},{"nome":"y"}]}'}),"."]}),e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Pedido"})," com campos ",e.jsx("code",{children:"numero"}),", ",e.jsx("code",{children:"cliente"})," e ",e.jsx("code",{children:"cupomDesconto"}),". Use ",e.jsx("code",{children:"@JsonInclude(NON_NULL)"})," pra que o JSON não inclua ",e.jsx("code",{children:"cupomDesconto"})," quando ele for null."]})]})]})}export{t as default};
