import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IO() {
  return (
    <PageContainer
      title="Entrada e Saída (I/O)"
      subtitle="Leitura e escrita de arquivos com java.io e java.nio.file — BufferedReader, Files, Paths e mais."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Java oferece duas APIs principais para I/O: a clássica <strong>java.io</strong> (streams de bytes
        e caracteres) e a moderna <strong>java.nio.file</strong> (Files, Paths — mais concisa e poderosa).
        Prefira a API NIO para código novo.
      </p>

      <h2>1. Escrevendo Arquivos</h2>
      <CodeBlock
        language="java"
        code={`import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

// Forma moderna (Java 7+) — mais simples!
Path arquivo = Path.of("dados.txt");

// Escrever uma lista de linhas
List<String> linhas = List.of("Linha 1", "Linha 2", "Linha 3");
Files.write(arquivo, linhas, StandardCharsets.UTF_8);

// Escrever uma String
Files.writeString(arquivo, "Conteúdo do arquivo", StandardCharsets.UTF_8); // Java 11+

// Append (adicionar ao final)
Files.writeString(arquivo, "\nNova linha", StandardCharsets.UTF_8,
    StandardOpenOption.APPEND, StandardOpenOption.CREATE);

// BufferedWriter (java.io) — para escrita de grandes volumes
try (BufferedWriter writer = new BufferedWriter(new FileWriter("saida.txt"))) {
    writer.write("Linha 1");
    writer.newLine();
    writer.write("Linha 2");
    writer.flush(); // garante que tudo foi escrito
} // fecha automaticamente (try-with-resources)`}
      />

      <h2>2. Lendo Arquivos</h2>
      <CodeBlock
        language="java"
        code={`// Ler todas as linhas de uma vez (para arquivos pequenos)
Path arquivo = Path.of("dados.txt");
List<String> linhas = Files.readAllLines(arquivo, StandardCharsets.UTF_8);
linhas.forEach(System.out::println);

// Ler como String (Java 11+)
String conteudo = Files.readString(arquivo);

// Ler como Stream de linhas (lazy — bom para arquivos grandes)
try (Stream<String> stream = Files.lines(arquivo)) {
    stream.filter(l -> !l.isBlank())
          .map(String::trim)
          .forEach(System.out::println);
}

// BufferedReader — linha por linha
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(new FileInputStream("dados.txt"), StandardCharsets.UTF_8))) {
    String linha;
    while ((linha = reader.readLine()) != null) {
        System.out.println(linha);
    }
}

// Ler arquivo de recursos (dentro do JAR)
InputStream is = MinhaClasse.class.getResourceAsStream("/config.properties");
BufferedReader reader = new BufferedReader(new InputStreamReader(is));`}
      />

      <h2>3. Operações em Arquivos e Diretórios</h2>
      <CodeBlock
        language="java"
        code={`import java.nio.file.*;

Path dir = Path.of("meu-diretorio");
Path arquivo = dir.resolve("arquivo.txt");

// Criar
Files.createDirectory(dir);           // cria diretório (falha se existir)
Files.createDirectories(dir);         // cria toda a hierarquia
Files.createFile(arquivo);            // cria arquivo vazio

// Verificar
Files.exists(arquivo);                // true/false
Files.isDirectory(dir);               // true/false
Files.isRegularFile(arquivo);         // true/false
Files.isReadable(arquivo);            // true/false

// Metadados
long tamanho = Files.size(arquivo);   // em bytes
Files.getLastModifiedTime(arquivo);   // FileTime

// Copiar e mover
Path destino = Path.of("copia.txt");
Files.copy(arquivo, destino, StandardCopyOption.REPLACE_EXISTING);
Files.move(arquivo, destino, StandardCopyOption.REPLACE_EXISTING);

// Deletar
Files.delete(arquivo);               // lança exceção se não existir
Files.deleteIfExists(arquivo);       // não lança se não existir

// Listar diretório
try (var stream = Files.list(dir)) {
    stream.forEach(p -> System.out.println(p.getFileName()));
}

// Pesquisar recursivamente
try (var stream = Files.walk(dir)) {
    stream.filter(p -> p.toString().endsWith(".java"))
          .forEach(System.out::println);
}`}
      />

      <AlertBox type="info" title="Encoding e UTF-8">
        Sempre especifique o charset! Use <code>StandardCharsets.UTF_8</code> para compatibilidade
        garantida. O encoding padrão do sistema varia entre Windows, Linux e macOS,
        causando problemas com acentos e caracteres especiais.
      </AlertBox>

      <h2>4. Properties e Configuração</h2>
      <CodeBlock
        language="java"
        code={`import java.util.Properties;

// Lendo arquivo .properties
Properties props = new Properties();
try (var is = new FileInputStream("config.properties")) {
    props.load(is);
}
String host = props.getProperty("db.host", "localhost"); // com padrão
String porta = props.getProperty("db.port");

// Escrevendo
props.setProperty("app.version", "1.0.0");
try (var out = new FileOutputStream("config.properties")) {
    props.store(out, "Configurações da aplicação");
}

// Arquivo config.properties:
// db.host=localhost
// db.port=5432
// app.version=1.0.0`}
      />
    </PageContainer>
  );
}
