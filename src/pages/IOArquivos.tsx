import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IOArquivos() {
  return (
    <PageContainer title="Ler & Escrever Arquivos" subtitle="Texto, binário, stream — escolha a ferramenta certa pra cada tarefa." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Ler um arquivo de configuração, processar um CSV de 2 GB, salvar uma imagem que veio numa requisição HTTP — tudo isso é I/O de arquivo. Java tem várias formas de fazer cada uma dessas coisas, e a diferença importa: usar a errada pode estourar a memória ou ficar 100× mais lento.
        </p><AlertBox type="tip" title="Regra do tamanho">
          Arquivo cabe na memória sem dó (até alguns MB)? Use os métodos <code>Files.read*</code> de uma vez. Arquivo é grande ou desconhecido? Use <code>Files.lines</code> ou <code>InputStream</code> e processe em partes.
        </AlertBox><h2>Texto pequeno: Files.readString e writeString</h2><p>Desde Java 11, ler ou escrever um arquivo texto inteiro vira uma linha:</p><CodeBlock title="Leitura/escrita simples" code={`import java.nio.file.*;
import java.io.IOException;

public class Texto {
    public static void main(String[] args) throws IOException {
        Path arq = Path.of("config.txt");

        Files.writeString(arq, "porta=8080\\nhost=localhost\\n");
        String conteudo = Files.readString(arq);

        System.out.println(conteudo);
    }
}`} /><p>
          Se você quer trabalhar linha a linha, mas o arquivo é pequeno, use <code>readAllLines</code>:
        </p><CodeBlock title="Linhas como List<String>" code={`import java.util.List;
List<String> linhas = Files.readAllLines(Path.of("nomes.txt"));
for (String linha : linhas) {
    System.out.println("> " + linha);
}

Files.write(Path.of("saida.txt"), List.of("um", "dois", "tres"));`} /><h2>Texto grande: Files.lines (Stream)</h2><p>
          Quando o arquivo tem milhões de linhas, carregar tudo na memória é suicídio. <code>Files.lines</code> devolve um <code>
            {"Stream<String>"}
          </code> preguiçoso — você processa uma linha de cada vez sem carregar o arquivo inteiro.
        </p><CodeBlock title="Contando linhas com 'ERROR'" code={`import java.util.stream.Stream;

try (Stream<String> linhas = Files.lines(Path.of("app.log"))) {
    long erros = linhas.filter(l -> l.contains("ERROR")).count();
    System.out.println("Erros: " + erros);
}`} /><AlertBox type="warning" title="Sempre try-with-resources">
          <code>Files.lines</code> mantém o arquivo aberto até o stream ser fechado. Sem <code>try-with-resources</code>, você vaza descritores e no Linux o seu programa vai quebrar com "Too many open files".
        </AlertBox><h2>BufferedReader: controle linha a linha clássico</h2><p>
          Se você precisa de mais controle (ex.: pular cabeçalho, parsear estado complexo), <code>BufferedReader</code> é o jeito tradicional:
        </p><CodeBlock title="BufferedReader e BufferedWriter" code={`import java.io.*;
import java.nio.file.*;

try (BufferedReader r = Files.newBufferedReader(Path.of("entrada.txt"));
     BufferedWriter w = Files.newBufferedWriter(Path.of("saida.txt"))) {
    String linha;
    while ((linha = r.readLine()) != null) {
        w.write(linha.toUpperCase());
        w.newLine();
    }
}`} /><h2>Binário pequeno: readAllBytes e write(bytes)</h2><p>
          Pra ler uma imagem ou PDF inteiro pra um <code>byte[]</code>:
        </p><CodeBlock title="Binário simples" code={`byte[] bytes = Files.readAllBytes(Path.of("logo.png"));
System.out.println("Tamanho: " + bytes.length + " bytes");

Files.write(Path.of("copia.png"), bytes);`} /><h2>Binário grande: InputStream e OutputStream</h2><p>
          Pra arquivos grandes, leia em pedaços com um buffer. Esse padrão funciona pra qualquer tamanho:
        </p><CodeBlock title="Cópia em chunks" code={`import java.io.*;
import java.nio.file.*;

try (InputStream in = Files.newInputStream(Path.of("video.mp4"));
     OutputStream out = Files.newOutputStream(Path.of("video-copia.mp4"))) {

    byte[] buffer = new byte[8192];
    int lidos;
    while ((lidos = in.read(buffer)) != -1) {
        out.write(buffer, 0, lidos);
    }
}

// Atalho moderno (faz exatamente isso por baixo):
Files.copy(Path.of("video.mp4"), Path.of("video-copia2.mp4"));`} /><h2>Charset: UTF-8 por padrão (desde Java 18)</h2><p>
          Antes do Java 18, o charset padrão dependia do sistema operacional — <code>Cp1252</code> no Windows pt-BR, <code>UTF-8</code> no Linux. Isso gerava bugs do tipo "acento sumiu". Desde Java 18 (JEP 400), o padrão é <code>UTF-8</code> em todo lugar.
        </p><CodeBlock title="Charset explícito quando precisar" code={`import java.nio.charset.StandardCharsets;

// Forçando charset (útil se o arquivo veio de sistema legado em Latin-1):
String texto = Files.readString(Path.of("legado.txt"), StandardCharsets.ISO_8859_1);
Files.writeString(Path.of("saida.txt"), texto, StandardCharsets.UTF_8);`} /><AlertBox type="tip" title="Sempre seja explícito em produção">
          Mesmo que o padrão hoje seja UTF-8, deixar o charset explícito no código deixa claro pra próxima pessoa (ou pra você daqui 6 meses) qual a expectativa.
        </AlertBox><h2>SequenceInputStream e ObjectInputStream (rapidão)</h2><p>
          <code>SequenceInputStream</code> "concatena" dois ou mais streams como se fossem um só — útil pra juntar arquivos sem carregar tudo na memória.
        </p><p>
          <code>ObjectInputStream</code> /<code>ObjectOutputStream</code> serializam objetos Java direto pro disco. Funciona, mas a serialização nativa é considerada legada e insegura — prefira JSON (Jackson) ou formatos binários portáveis (Protobuf) pra dados que precisam atravessar sistemas.
        </p><CodeBlock title="Concatenando arquivos" code={`import java.io.*;
import java.nio.file.*;

try (InputStream a = Files.newInputStream(Path.of("parte1.bin"));
     InputStream b = Files.newInputStream(Path.of("parte2.bin"));
     SequenceInputStream juntos = new SequenceInputStream(a, b);
     OutputStream out = Files.newOutputStream(Path.of("inteiro.bin"))) {
    juntos.transferTo(out);
}`} /><h2>Resumo: qual usar quando</h2><ul>
          <li>
            <strong>Texto até alguns MB:</strong> <code>Files.readString</code> / <code>writeString</code>.
          </li><li>
            <strong>Texto grande, processo linha a linha:</strong> <code>Files.lines</code> com try-with-resources.
          </li><li>
            <strong>Lógica complexa por linha:</strong> <code>BufferedReader</code>.
          </li><li>
            <strong>Binário pequeno:</strong> <code>Files.readAllBytes</code>.
          </li><li>
            <strong>Binário grande / streaming:</strong> <code>InputStream</code>/<code>OutputStream</code> ou <code>Files.copy</code>.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Conte quantas linhas em um arquivo de log começam com <code>"WARN"</code> usando <code>Files.lines</code>. Teste com um arquivo grande pra ver que não estoura memória.
          </li><li>
            Faça um programa que copia um arquivo binário de qualquer tamanho usando <code>InputStream</code>/<code>OutputStream</code> e um buffer de 8 KB. Compare com <code>Files.copy</code> medindo o tempo.
          </li><li>
            Crie um conversor: leia um arquivo em <code>ISO_8859_1</code> e regrave em <code>UTF-8</code>, mantendo os acentos corretos. Use <code>Files.readString</code> + <code>Files.writeString</code> com charsets explícitos.
          </li>
        </ol>
      </PageContainer>
  );
}
