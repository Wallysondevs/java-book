import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Serialization() {
  return (
    <PageContainer title="Serialization" subtitle="Object → bytes — quando usar Java serial, JSON, Protobuf, Avro." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Toda hora você precisa transformar um objeto em algo que possa ser <em>guardado</em> ou<em>transportado</em>: salvar sessão em disco, mandar pra fila Kafka, enviar pra um endpoint REST, cachear em Redis. Esse processo é serialização. A escolha do formato afeta performance, compatibilidade e segurança da sua app — não é detalhe.
        </p><h2>Java Serialization (built-in)</h2><p>
          O JDK tem desde sempre o mecanismo via <code>java.io.Serializable</code>. É uma<em>marker interface</em> (vazia): basta a classe implementar e os<code>ObjectOutputStream</code> / <code>ObjectInputStream</code> fazem o resto.
        </p><CodeBlock title="Salvando e lendo de arquivo" code={`import java.io.*;

public class Pessoa implements Serializable {
    private static final long serialVersionUID = 1L;
    String nome;
    int idade;
    Pessoa(String n, int i) { nome = n; idade = i; }
}

public class Demo {
    public static void main(String[] args) throws Exception {
        try (var out = new ObjectOutputStream(new FileOutputStream("p.ser"))) {
            out.writeObject(new Pessoa("Ana", 30));
        }
        try (var in = new ObjectInputStream(new FileInputStream("p.ser"))) {
            Pessoa p = (Pessoa) in.readObject();
            System.out.println(p.nome);
        }
    }
}`} /><h3>
          <code>serialVersionUID</code>: o versionador
        </h3><p>
          Se você não declarar, o compilador gera um automaticamente baseado na estrutura. Aí qualquer mudança (adicionar campo, renomear) muda o UID e quebra a leitura de dados antigos com<code>InvalidClassException</code>. Sempre declare manualmente.
        </p><h3>
          <code>transient</code>: campos que não viajam
        </h3><CodeBlock code={`public class Sessao implements Serializable {
    String usuario;
    transient String senha;       // não vai pro arquivo
    transient Connection conexao; // óbvio, não dá pra serializar socket
}`} /><h3>
          Customizar com <code>readObject</code> / <code>writeObject</code>
        </h3><CodeBlock title="Hooks privados que a JVM chama por reflection" code={`private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();
    out.writeUTF(criptografar(senha));
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    senha = descriptografar(in.readUTF());
}`} /><AlertBox type="danger" title="Java Serialization é uma fonte histórica de CVEs">
          <p>
            Bibliotecas como Apache Commons Collections já permitiram <strong>RCE</strong> via<em>gadget chains</em> em <code>readObject</code>. Spring4Shell, Log4Shell e cia derivam dessa família de problemas. <strong>Nunca</strong> desserialize bytes vindos de fonte não confiável. Desde Java 9 existe <code>ObjectInputFilter</code> (JEP 290) e a partir do Java 17 o filtro pode ser configurado via JEP 415 com fábricas — use!
          </p>
        </AlertBox><CodeBlock title="Filtro mínimo (JEP 290)" code={`var in = new ObjectInputStream(input);
in.setObjectInputFilter(info -> {
    Class<?> c = info.serialClass();
    if (c == null) return ObjectInputFilter.Status.ALLOWED;
    String n = c.getName();
    return n.startsWith("com.minha.app.") ? ObjectInputFilter.Status.ALLOWED
                                          : ObjectInputFilter.Status.REJECTED;
});`} /><h2>Por que evitar Java Serialization hoje</h2><ul>
          <li>
            <strong>Insegura</strong> por design (gadgets em readObject).
          </li><li>
            <strong>Frágil</strong> entre versões da classe.
          </li><li>
            <strong>Acoplada</strong> ao Java — outra linguagem não lê.
          </li><li>
            <strong>Lenta</strong> e gera bytes maiores que alternativas binárias modernas.
          </li><li>
            O JDK está em <strong>processo gradual de remoção</strong> (JEP 154 / discussões de Project Amber).
          </li>
        </ul><h2>Alternativas modernas — escolha pelo cenário</h2><h3>JSON com Jackson</h3><p>
          Padrão da indústria pra APIs REST. Legível, interop com qualquer linguagem, schema flexível. Custo: maior em bytes que binários, parsing mais lento.
        </p><CodeBlock code={`ObjectMapper m = new ObjectMapper();
String json = m.writeValueAsString(new Pessoa("Ana", 30));
Pessoa p = m.readValue(json, Pessoa.class);`} /><h3>Protobuf (Google Protocol Buffers)</h3><p>
          Binário compacto, esquema obrigatório em arquivo <code>.proto</code>, geração de código. Excelente pra microsserviços (gRPC), mensageria de alto volume e contratos versionados (campos novos não quebram clientes antigos se você seguir as regras de evolução).
        </p><CodeBlock title="pessoa.proto" code={`syntax = "proto3";
message Pessoa {
  string nome = 1;
  int32 idade = 2;
}`} /><h3>Avro</h3><p>
          Schema embutido no arquivo, ótimo pra <em>data lakes</em>, Kafka + Schema Registry, big data (Spark, Hadoop). Mais usado em pipelines analíticos do que comunicação síncrona.
        </p><h3>Cache local em disco</h3><p>Antes era comum usar Java Serialization. Hoje, prefira:</p><ul>
          <li>
            <strong>Jackson Smile</strong> — JSON binário, mesma API do Jackson.
          </li><li>
            <strong>CBOR</strong> — padrão IETF, similar ao Smile.
          </li><li>
            <strong>Cap'n Proto / FlatBuffers</strong> — zero-copy, leitura instantânea sem parse.
          </li><li>
            <strong>MessagePack</strong> — popular em Ruby/Python, suporte Java razoável.
          </li>
        </ul><h2>Quadro comparativo rápido</h2><ul>
          <li>
            <strong>Java Serial</strong>: legado, evite.
          </li><li>
            <strong>JSON</strong>: APIs públicas, configs, debug fácil.
          </li><li>
            <strong>Protobuf</strong>: gRPC, contratos estáveis entre serviços.
          </li><li>
            <strong>Avro</strong>: streaming/batch analítico, Kafka.
          </li><li>
            <strong>Smile/CBOR</strong>: cache, persistência local rápida.
          </li>
        </ul><AlertBox type="tip" title="Records ajudam muito">
          <p>
            Records (Java 16+) são imutáveis e têm forma canônica conhecida. Combinam super bem com Jackson 2.12+ e bibliotecas que respeitam o construtor canônico — chega de boilerplate getter/setter pra serialização.
          </p>
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Salve um objeto <code>Pedido</code> com Java Serialization e Jackson. Compare o tamanho em bytes do arquivo gerado.
          </li><li>
            Adicione um novo campo <code>desconto</code> na classe e tente ler um arquivo serializado antes da mudança. Veja a <code>InvalidClassException</code> sem<code>serialVersionUID</code> e como ela some quando você define um.
          </li><li>
            Configure um <code>ObjectInputFilter</code> que aceite só classes do pacote<code>com.minha.app</code>. Tente ler um arquivo malicioso com uma classe fora desse pacote e confirme que falha.
          </li>
        </ol>
      </PageContainer>
  );
}
