import{j as e}from"./index-BpXci30S.js";import{P as i,A as s}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(i,{title:"Serialization",subtitle:"Object → bytes — quando usar Java serial, JSON, Protobuf, Avro.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Toda hora você precisa transformar um objeto em algo que possa ser ",e.jsx("em",{children:"guardado"})," ou",e.jsx("em",{children:"transportado"}),": salvar sessão em disco, mandar pra fila Kafka, enviar pra um endpoint REST, cachear em Redis. Esse processo é serialização. A escolha do formato afeta performance, compatibilidade e segurança da sua app — não é detalhe."]}),e.jsx("h2",{children:"Java Serialization (built-in)"}),e.jsxs("p",{children:["O JDK tem desde sempre o mecanismo via ",e.jsx("code",{children:"java.io.Serializable"}),". É uma",e.jsx("em",{children:"marker interface"})," (vazia): basta a classe implementar e os",e.jsx("code",{children:"ObjectOutputStream"})," / ",e.jsx("code",{children:"ObjectInputStream"})," fazem o resto."]}),e.jsx(a,{title:"Salvando e lendo de arquivo",code:`import java.io.*;

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
}`}),e.jsxs("h3",{children:[e.jsx("code",{children:"serialVersionUID"}),": o versionador"]}),e.jsxs("p",{children:["Se você não declarar, o compilador gera um automaticamente baseado na estrutura. Aí qualquer mudança (adicionar campo, renomear) muda o UID e quebra a leitura de dados antigos com",e.jsx("code",{children:"InvalidClassException"}),". Sempre declare manualmente."]}),e.jsxs("h3",{children:[e.jsx("code",{children:"transient"}),": campos que não viajam"]}),e.jsx(a,{code:`public class Sessao implements Serializable {
    String usuario;
    transient String senha;       // não vai pro arquivo
    transient Connection conexao; // óbvio, não dá pra serializar socket
}`}),e.jsxs("h3",{children:["Customizar com ",e.jsx("code",{children:"readObject"})," / ",e.jsx("code",{children:"writeObject"})]}),e.jsx(a,{title:"Hooks privados que a JVM chama por reflection",code:`private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();
    out.writeUTF(criptografar(senha));
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    senha = descriptografar(in.readUTF());
}`}),e.jsx(s,{type:"danger",title:"Java Serialization é uma fonte histórica de CVEs",children:e.jsxs("p",{children:["Bibliotecas como Apache Commons Collections já permitiram ",e.jsx("strong",{children:"RCE"})," via",e.jsx("em",{children:"gadget chains"})," em ",e.jsx("code",{children:"readObject"}),". Spring4Shell, Log4Shell e cia derivam dessa família de problemas. ",e.jsx("strong",{children:"Nunca"})," desserialize bytes vindos de fonte não confiável. Desde Java 9 existe ",e.jsx("code",{children:"ObjectInputFilter"})," (JEP 290) e a partir do Java 17 o filtro pode ser configurado via JEP 415 com fábricas — use!"]})}),e.jsx(a,{title:"Filtro mínimo (JEP 290)",code:`var in = new ObjectInputStream(input);
in.setObjectInputFilter(info -> {
    Class<?> c = info.serialClass();
    if (c == null) return ObjectInputFilter.Status.ALLOWED;
    String n = c.getName();
    return n.startsWith("com.minha.app.") ? ObjectInputFilter.Status.ALLOWED
                                          : ObjectInputFilter.Status.REJECTED;
});`}),e.jsx("h2",{children:"Por que evitar Java Serialization hoje"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Insegura"})," por design (gadgets em readObject)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Frágil"})," entre versões da classe."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acoplada"})," ao Java — outra linguagem não lê."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lenta"})," e gera bytes maiores que alternativas binárias modernas."]}),e.jsxs("li",{children:["O JDK está em ",e.jsx("strong",{children:"processo gradual de remoção"})," (JEP 154 / discussões de Project Amber)."]})]}),e.jsx("h2",{children:"Alternativas modernas — escolha pelo cenário"}),e.jsx("h3",{children:"JSON com Jackson"}),e.jsx("p",{children:"Padrão da indústria pra APIs REST. Legível, interop com qualquer linguagem, schema flexível. Custo: maior em bytes que binários, parsing mais lento."}),e.jsx(a,{code:`ObjectMapper m = new ObjectMapper();
String json = m.writeValueAsString(new Pessoa("Ana", 30));
Pessoa p = m.readValue(json, Pessoa.class);`}),e.jsx("h3",{children:"Protobuf (Google Protocol Buffers)"}),e.jsxs("p",{children:["Binário compacto, esquema obrigatório em arquivo ",e.jsx("code",{children:".proto"}),", geração de código. Excelente pra microsserviços (gRPC), mensageria de alto volume e contratos versionados (campos novos não quebram clientes antigos se você seguir as regras de evolução)."]}),e.jsx(a,{title:"pessoa.proto",code:`syntax = "proto3";
message Pessoa {
  string nome = 1;
  int32 idade = 2;
}`}),e.jsx("h3",{children:"Avro"}),e.jsxs("p",{children:["Schema embutido no arquivo, ótimo pra ",e.jsx("em",{children:"data lakes"}),", Kafka + Schema Registry, big data (Spark, Hadoop). Mais usado em pipelines analíticos do que comunicação síncrona."]}),e.jsx("h3",{children:"Cache local em disco"}),e.jsx("p",{children:"Antes era comum usar Java Serialization. Hoje, prefira:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Jackson Smile"})," — JSON binário, mesma API do Jackson."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CBOR"})," — padrão IETF, similar ao Smile."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cap'n Proto / FlatBuffers"})," — zero-copy, leitura instantânea sem parse."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MessagePack"})," — popular em Ruby/Python, suporte Java razoável."]})]}),e.jsx("h2",{children:"Quadro comparativo rápido"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Java Serial"}),": legado, evite."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JSON"}),": APIs públicas, configs, debug fácil."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Protobuf"}),": gRPC, contratos estáveis entre serviços."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Avro"}),": streaming/batch analítico, Kafka."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Smile/CBOR"}),": cache, persistência local rápida."]})]}),e.jsx(s,{type:"tip",title:"Records ajudam muito",children:e.jsx("p",{children:"Records (Java 16+) são imutáveis e têm forma canônica conhecida. Combinam super bem com Jackson 2.12+ e bibliotecas que respeitam o construtor canônico — chega de boilerplate getter/setter pra serialização."})}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Salve um objeto ",e.jsx("code",{children:"Pedido"})," com Java Serialization e Jackson. Compare o tamanho em bytes do arquivo gerado."]}),e.jsxs("li",{children:["Adicione um novo campo ",e.jsx("code",{children:"desconto"})," na classe e tente ler um arquivo serializado antes da mudança. Veja a ",e.jsx("code",{children:"InvalidClassException"})," sem",e.jsx("code",{children:"serialVersionUID"})," e como ela some quando você define um."]}),e.jsxs("li",{children:["Configure um ",e.jsx("code",{children:"ObjectInputFilter"})," que aceite só classes do pacote",e.jsx("code",{children:"com.minha.app"}),". Tente ler um arquivo malicioso com uma classe fora desse pacote e confirme que falha."]})]})]})}export{t as default};
