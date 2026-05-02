import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JSONPage() {
  return (
    <PageContainer title="JSON com Jackson" subtitle="Lib mais usada do ecossistema — serializar e desserializar POJOs e records." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          JSON é o formato universal pra trocar dados entre serviços, salvar configuração, gravar dump rápido. Java não tem suporte nativo (até hoje não tem!), então você precisa de uma lib. <strong>Jackson</strong> é a escolha padrão da indústria — vem por baixo do Spring Boot, Quarkus, e praticamente qualquer framework REST.
        </p><h2>Adicionando Jackson</h2><CodeBlock title="Maven" code={`<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.2</version>
</dependency>`} /><CodeBlock title="Gradle" code="implementation 'com.fasterxml.jackson.core:jackson-databind:2.17.2'" /><h2>ObjectMapper: o motor</h2><p>
          O <code>ObjectMapper</code> é a classe central. Crie uma vez e reutilize — ela é thread-safe depois de configurada. Em apps grandes, injete como singleton.
        </p><CodeBlock title="Serializar objeto → JSON" code={`import com.fasterxml.jackson.databind.ObjectMapper;

record Usuario(int id, String nome, String email) {}

public class Serializar {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        Usuario u = new Usuario(1, "Ana", "ana@exemplo.com");
        String json = mapper.writeValueAsString(u);

        System.out.println(json);
        // {"id":1,"nome":"Ana","email":"ana@exemplo.com"}
    }
}`} /><h2>Desserializar JSON → objeto</h2><CodeBlock title="readValue" code={`String json = "{\\"id\\":42,\\"nome\\":\\"Bruno\\",\\"email\\":\\"b@x.com\\"}";

Usuario u = mapper.readValue(json, Usuario.class);
System.out.println(u.nome()); // Bruno`} /><h2>Records vs classes tradicionais</h2><p>
          Desde Jackson 2.12, <strong>records funcionam direto</strong> sem configuração — Jackson detecta os componentes pelo nome. Pra classes tradicionais, você precisa de:
        </p><ul>
          <li>
            Construtor padrão (sem argumentos), <strong>ou</strong> construtor anotado com <code>@JsonCreator</code>.
          </li><li>Getters/setters públicos (Jackson usa eles pra ler e escrever campos).</li>
        </ul><CodeBlock title="Classe tradicional" code={`public class Produto {
    private String nome;
    private double preco;

    public Produto() {} // necessário

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }
}

// Funciona igual:
Produto p = mapper.readValue(json, Produto.class);`} /><AlertBox type="tip" title="Use records sempre que puder">Records eliminam boilerplate, são imutáveis por padrão, e o Jackson adora.</AlertBox><h2>Coleções e tipos genéricos</h2><p>
          Pra desserializar uma <code>
            {"List<Usuario>"}
          </code> você precisa de <code>TypeReference</code> — Java apaga genéricos em runtime, então Jackson não consegue adivinhar.
        </p><CodeBlock title="Lista de objetos" code={`import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;

String jsonArr = "[{\\"id\\":1,\\"nome\\":\\"A\\"},{\\"id\\":2,\\"nome\\":\\"B\\"}]";

List<Usuario> lista = mapper.readValue(jsonArr, new TypeReference<List<Usuario>>() {});
lista.forEach(System.out::println);`} /><h2>Anotações úteis</h2><ul>
          <li>
            <code>@JsonProperty("nome_no_json")</code> — mapeia campo Java pra chave JSON com nome diferente.
          </li><li>
            <code>@JsonIgnore</code> — campo Java que não deve aparecer no JSON (ex.: senha).
          </li><li>
            <code>@JsonInclude(Include.NON_NULL)</code> — omitir campos nulos do JSON gerado.
          </li><li>
            <code>@JsonFormat(pattern = "yyyy-MM-dd")</code> — formatar datas.
          </li>
        </ul><CodeBlock title="Mapeamento custom" code={`import com.fasterxml.jackson.annotation.*;

public record Conta(
    @JsonProperty("user_id") int userId,
    String nome,
    @JsonIgnore String senha
) {}

Conta c = new Conta(1, "Ana", "segredo");
System.out.println(mapper.writeValueAsString(c));
// {"user_id":1,"nome":"Ana"}     <- senha sumiu`} /><h2>JsonNode: parsing dinâmico</h2><p>
          Quando você não tem (ou não quer criar) uma classe pro JSON,<code>JsonNode</code> deixa você navegar pela árvore como se fosse um objeto JS.
        </p><CodeBlock title="Navegando JSON desconhecido" code={`import com.fasterxml.jackson.databind.JsonNode;

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

System.out.println(nome + " | " + ativo + " | " + primeiraTag);`} /><AlertBox type="info" title="path vs get">
          <code>path("x")</code> retorna um nó "missing" se a chave não existir (não quebra). <code>get("x")</code> retorna <code>null</code>. Em navegação encadeada, <code>path</code> é mais seguro.
        </AlertBox><h2>Lendo e escrevendo arquivos</h2><CodeBlock title="Arquivo direto" code={`import java.io.File;

// Escrever JSON em arquivo
mapper.writeValue(new File("usuarios.json"), List.of(
    new Usuario(1, "Ana", "ana@x.com"),
    new Usuario(2, "Bia", "bia@x.com")
));

// Ler JSON de arquivo
List<Usuario> users = mapper.readValue(
    new File("usuarios.json"),
    new TypeReference<List<Usuario>>() {}
);`} /><h2>Pretty printing</h2><CodeBlock title="JSON formatado" code={`String bonito = mapper.writerWithDefaultPrettyPrinter()
                      .writeValueAsString(usuario);
System.out.println(bonito);
/*
{
  "id" : 1,
  "nome" : "Ana",
  "email" : "ana@exemplo.com"
}
*/`} /><h2>Alternativas</h2><ul>
          <li>
            <strong>Gson</strong> (Google): mais simples, menos features. Boa escolha pra projetos pequenos.
          </li><li>
            <strong>JSON-B</strong>: padrão Jakarta EE. Implementação de referência é Yasson. Pouco usado fora do mundo enterprise.
          </li>
        </ul><p>Em 99% dos casos, Jackson é a escolha certa.</p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um record <code>Livro(String titulo, String autor, int ano)</code>, serialize uma lista de 3 livros pra arquivo <code>livros.json</code>, depois leia de volta e imprima.
          </li><li>
            Receba este JSON e use <code>JsonNode</code> pra extrair o nome do primeiro item: <code>{"{\"itens\":[{\"nome\":\"x\"},{\"nome\":\"y\"}]}"}</code>.
          </li><li>
            Crie uma classe <code>Pedido</code> com campos <code>numero</code>, <code>cliente</code> e <code>cupomDesconto</code>. Use <code>@JsonInclude(NON_NULL)</code> pra que o JSON não inclua <code>cupomDesconto</code> quando ele for null.
          </li>
        </ol>
      </PageContainer>
  );
}
