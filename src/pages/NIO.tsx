import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NIO() {
  return (
    <PageContainer title="NIO.2: Path & Files" subtitle="API moderna para sistema de arquivos — esqueça java.io.File." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Quase todo programa do mundo real lê ou escreve arquivos: ler um CSV, salvar um log, gerar um PDF, copiar uploads. A API antiga (<code>java.io.File</code>) é da era do Java 1.0, dá <code>boolean</code> no lugar de exceções e quebra em casos com permissões, links simbólicos e caminhos com acentos. A NIO.2 (desde Java 7) resolve tudo isso e ainda dá streams pra você processar diretórios inteiros.
        </p><AlertBox type="tip" title="Regra prática">
          Se você está digitando <code>new File(...)</code>, pare. Use <code>Path.of(...)</code> e <code>Files.*</code> em vez disso. Sempre.
        </AlertBox><h2>Path: o caminho lógico</h2><p>
          Um <code>Path</code> é só uma representação de caminho — não acessa o disco enquanto você não pedir. Pense nele como uma "string esperta", com métodos pra navegar entre pastas.
        </p><CodeBlock title="Criando um Path" code={`import java.nio.file.Path;
import java.nio.file.Paths;

public class Caminhos {
    public static void main(String[] args) {
        Path p1 = Path.of("dados", "vendas.csv");      // jeito moderno
        Path p2 = Paths.get("/home/ana/projetos");     // mesma coisa, mais antigo
        Path p3 = Path.of("C:\\\\Users\\\\Ana\\\\teste.txt"); // Windows ok

        System.out.println(p1);                  // dados/vendas.csv
        System.out.println(p1.getFileName());    // vendas.csv
        System.out.println(p1.getParent());      // dados
        System.out.println(p1.toAbsolutePath()); // /home/ana/.../dados/vendas.csv
    }
}`} /><h3>resolve, resolveSibling e relativize</h3><p>Esses três são as ferramentas que você mais vai usar pra montar caminhos:</p><ul>
          <li>
            <code>resolve("x")</code> — entra na pasta. <code>/a/b</code> .resolve("c") = <code>/a/b/c</code>.
          </li><li>
            <code>resolveSibling("x")</code> — troca o último pedaço por outro irmão. <code>/a/b/x.txt</code>.resolveSibling("y.txt") = <code>/a/b/y.txt</code>. Ótimo pra renomear ou pôr arquivo companheiro.
          </li><li>
            <code>relativize</code> — calcula caminho relativo entre dois. <code>/a</code>.relativize(<code>/a/b/c</code>) = <code>b/c</code>.
          </li>
        </ul><CodeBlock title="Manipulando Paths" code={`Path base = Path.of("/var/log");
Path arquivo = base.resolve("app.log");           // /var/log/app.log
Path backup  = arquivo.resolveSibling("app.log.bak"); // /var/log/app.log.bak

Path raiz = Path.of("/var");
System.out.println(raiz.relativize(arquivo)); // log/app.log

Path bagunca = Path.of("/var/./log/../log/app.log");
System.out.println(bagunca.normalize()); // /var/log/app.log`} /><h2>Files: utilitários estáticos pra tudo</h2><p>
          A classe <code>Files</code> tem dezenas de métodos estáticos que recebem um <code>Path</code> e fazem operações no disco de verdade. Tudo lança <code>IOException</code> em caso de erro — não retorna <code>false</code> silencioso como o velho <code>File</code>.
        </p><CodeBlock title="Operações comuns" code={`import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class Operacoes {
    public static void main(String[] args) throws IOException {
        Path pasta = Path.of("dados");
        Path arquivo = pasta.resolve("notas.txt");

        Files.createDirectories(pasta);  // cria recursivo, não falha se já existe
        Files.writeString(arquivo, "Olá!\\n");

        System.out.println(Files.exists(arquivo));   // true
        System.out.println(Files.size(arquivo));     // 5

        Path copia = pasta.resolve("notas.bak");
        Files.copy(arquivo, copia);
        Files.move(copia, pasta.resolve("notas-old.txt"));
        Files.delete(pasta.resolve("notas-old.txt"));
    }
}`} /><AlertBox type="warning" title="Cuidado com createDirectory vs createDirectories">
          <code>createDirectory</code> falha se a pasta-pai não existir. <code>createDirectories</code> cria toda a árvore. Em 95% dos casos você quer <code>createDirectories</code>.
        </AlertBox><h2>Listando o conteúdo de uma pasta</h2><p>
          <code>Files.list(path)</code> devolve um <code>
            {"Stream<Path>"}
          </code> com os arquivos diretos da pasta (não entra em subpastas). Use <code>try-with-resources</code> sempre — o stream segura um descritor de arquivo aberto.
        </p><CodeBlock title="Listar arquivos .java" code={`import java.nio.file.*;
import java.util.stream.Stream;

try (Stream<Path> stream = Files.list(Path.of("src"))) {
    stream.filter(p -> p.toString().endsWith(".java"))
          .forEach(System.out::println);
}`} /><h2>Andando recursivamente: Files.walk e Files.find</h2><p>
          Pra varrer uma árvore inteira, use <code>Files.walk</code>. Ele entra em subpastas até a profundidade que você pedir (padrão: <code>Integer.MAX_VALUE</code>, ou seja, tudo).
        </p><CodeBlock title="Procurando arquivos grandes" code={`try (Stream<Path> stream = Files.walk(Path.of("."))) {
    stream.filter(Files::isRegularFile)
          .filter(p -> {
              try { return Files.size(p) > 1_000_000; }
              catch (Exception e) { return false; }
          })
          .forEach(System.out::println);
}`} /><p>
          <code>Files.find</code> faz a mesma coisa mas o filtro é um <code>
            {"BiPredicate<Path, BasicFileAttributes>"}
          </code>, então você evita o try/catch interno:
        </p><CodeBlock title="Files.find" code={`try (Stream<Path> stream = Files.find(
        Path.of("."), Integer.MAX_VALUE,
        (path, attrs) -> attrs.isRegularFile() && attrs.size() > 1_000_000)) {
    stream.forEach(System.out::println);
}`} /><h2>Detalhes de plataforma</h2><p>
          Separador de caminho varia (Linux/macOS usam <code>/</code>, Windows usa <code>\\</code>). Você raramente precisa se preocupar — a NIO já cuida — mas se precisar do separador atual:
        </p><CodeBlock title="Separador do SO" code={`import java.nio.file.FileSystems;
String sep = FileSystems.getDefault().getSeparator();
System.out.println(sep); // "/" no Linux, "\\\\" no Windows`} /><h2>Por que esquecer java.io.File de vez</h2><ul>
          <li>
            <code>File.delete()</code> retorna <code>boolean</code> — você não sabe <em>por que</em> falhou. <code>Files.delete()</code> joga exceção descritiva.
          </li><li>
            <code>File</code> não entende links simbólicos direito.
          </li><li>
            Sem suporte a streams, sem <code>BasicFileAttributes</code>, sem watchers (<code>WatchService</code>).
          </li><li>Misturar as duas APIs é confuso. Use só NIO.2 e ponto.</li>
        </ul><AlertBox type="info" title="Interop quando precisar">
          Se uma lib velha exige <code>java.io.File</code>, converta na hora: <code>path.toFile()</code>. Mas mantenha seu código em <code>Path</code>.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um programa que recebe uma pasta como argumento e imprime quantos arquivos <code>.txt</code> existem nela (sem entrar em subpastas). Use <code>Files.list</code>.
          </li><li>
            Escreva um "find" simples: dado uma pasta e uma extensão, liste todos os arquivos da árvore com aquela extensão. Use <code>Files.walk</code> e <code>Files.isRegularFile</code>.
          </li><li>
            Faça um backup automático: receba um caminho de arquivo e crie uma cópia ao lado dele com sufixo <code>.bak</code>. Use <code>resolveSibling</code> e <code>Files.copy</code> com <code>StandardCopyOption.REPLACE_EXISTING</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
