import{j as e}from"./index-BpXci30S.js";import{P as i,A as s}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function l(){return e.jsxs(i,{title:"NIO.2: Path & Files",subtitle:"API moderna para sistema de arquivos — esqueça java.io.File.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Quase todo programa do mundo real lê ou escreve arquivos: ler um CSV, salvar um log, gerar um PDF, copiar uploads. A API antiga (",e.jsx("code",{children:"java.io.File"}),") é da era do Java 1.0, dá ",e.jsx("code",{children:"boolean"})," no lugar de exceções e quebra em casos com permissões, links simbólicos e caminhos com acentos. A NIO.2 (desde Java 7) resolve tudo isso e ainda dá streams pra você processar diretórios inteiros."]}),e.jsxs(s,{type:"tip",title:"Regra prática",children:["Se você está digitando ",e.jsx("code",{children:"new File(...)"}),", pare. Use ",e.jsx("code",{children:"Path.of(...)"})," e ",e.jsx("code",{children:"Files.*"})," em vez disso. Sempre."]}),e.jsx("h2",{children:"Path: o caminho lógico"}),e.jsxs("p",{children:["Um ",e.jsx("code",{children:"Path"}),' é só uma representação de caminho — não acessa o disco enquanto você não pedir. Pense nele como uma "string esperta", com métodos pra navegar entre pastas.']}),e.jsx(a,{title:"Criando um Path",code:`import java.nio.file.Path;
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
}`}),e.jsx("h3",{children:"resolve, resolveSibling e relativize"}),e.jsx("p",{children:"Esses três são as ferramentas que você mais vai usar pra montar caminhos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'resolve("x")'})," — entra na pasta. ",e.jsx("code",{children:"/a/b"}),' .resolve("c") = ',e.jsx("code",{children:"/a/b/c"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:'resolveSibling("x")'})," — troca o último pedaço por outro irmão. ",e.jsx("code",{children:"/a/b/x.txt"}),'.resolveSibling("y.txt") = ',e.jsx("code",{children:"/a/b/y.txt"}),". Ótimo pra renomear ou pôr arquivo companheiro."]}),e.jsxs("li",{children:[e.jsx("code",{children:"relativize"})," — calcula caminho relativo entre dois. ",e.jsx("code",{children:"/a"}),".relativize(",e.jsx("code",{children:"/a/b/c"}),") = ",e.jsx("code",{children:"b/c"}),"."]})]}),e.jsx(a,{title:"Manipulando Paths",code:`Path base = Path.of("/var/log");
Path arquivo = base.resolve("app.log");           // /var/log/app.log
Path backup  = arquivo.resolveSibling("app.log.bak"); // /var/log/app.log.bak

Path raiz = Path.of("/var");
System.out.println(raiz.relativize(arquivo)); // log/app.log

Path bagunca = Path.of("/var/./log/../log/app.log");
System.out.println(bagunca.normalize()); // /var/log/app.log`}),e.jsx("h2",{children:"Files: utilitários estáticos pra tudo"}),e.jsxs("p",{children:["A classe ",e.jsx("code",{children:"Files"})," tem dezenas de métodos estáticos que recebem um ",e.jsx("code",{children:"Path"})," e fazem operações no disco de verdade. Tudo lança ",e.jsx("code",{children:"IOException"})," em caso de erro — não retorna ",e.jsx("code",{children:"false"})," silencioso como o velho ",e.jsx("code",{children:"File"}),"."]}),e.jsx(a,{title:"Operações comuns",code:`import java.nio.file.Files;
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
}`}),e.jsxs(s,{type:"warning",title:"Cuidado com createDirectory vs createDirectories",children:[e.jsx("code",{children:"createDirectory"})," falha se a pasta-pai não existir. ",e.jsx("code",{children:"createDirectories"})," cria toda a árvore. Em 95% dos casos você quer ",e.jsx("code",{children:"createDirectories"}),"."]}),e.jsx("h2",{children:"Listando o conteúdo de uma pasta"}),e.jsxs("p",{children:[e.jsx("code",{children:"Files.list(path)"})," devolve um ",e.jsx("code",{children:"Stream<Path>"})," com os arquivos diretos da pasta (não entra em subpastas). Use ",e.jsx("code",{children:"try-with-resources"})," sempre — o stream segura um descritor de arquivo aberto."]}),e.jsx(a,{title:"Listar arquivos .java",code:`import java.nio.file.*;
import java.util.stream.Stream;

try (Stream<Path> stream = Files.list(Path.of("src"))) {
    stream.filter(p -> p.toString().endsWith(".java"))
          .forEach(System.out::println);
}`}),e.jsx("h2",{children:"Andando recursivamente: Files.walk e Files.find"}),e.jsxs("p",{children:["Pra varrer uma árvore inteira, use ",e.jsx("code",{children:"Files.walk"}),". Ele entra em subpastas até a profundidade que você pedir (padrão: ",e.jsx("code",{children:"Integer.MAX_VALUE"}),", ou seja, tudo)."]}),e.jsx(a,{title:"Procurando arquivos grandes",code:`try (Stream<Path> stream = Files.walk(Path.of("."))) {
    stream.filter(Files::isRegularFile)
          .filter(p -> {
              try { return Files.size(p) > 1_000_000; }
              catch (Exception e) { return false; }
          })
          .forEach(System.out::println);
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"Files.find"})," faz a mesma coisa mas o filtro é um ",e.jsx("code",{children:"BiPredicate<Path, BasicFileAttributes>"}),", então você evita o try/catch interno:"]}),e.jsx(a,{title:"Files.find",code:`try (Stream<Path> stream = Files.find(
        Path.of("."), Integer.MAX_VALUE,
        (path, attrs) -> attrs.isRegularFile() && attrs.size() > 1_000_000)) {
    stream.forEach(System.out::println);
}`}),e.jsx("h2",{children:"Detalhes de plataforma"}),e.jsxs("p",{children:["Separador de caminho varia (Linux/macOS usam ",e.jsx("code",{children:"/"}),", Windows usa ",e.jsx("code",{children:"\\\\"}),"). Você raramente precisa se preocupar — a NIO já cuida — mas se precisar do separador atual:"]}),e.jsx(a,{title:"Separador do SO",code:`import java.nio.file.FileSystems;
String sep = FileSystems.getDefault().getSeparator();
System.out.println(sep); // "/" no Linux, "\\\\" no Windows`}),e.jsx("h2",{children:"Por que esquecer java.io.File de vez"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"File.delete()"})," retorna ",e.jsx("code",{children:"boolean"})," — você não sabe ",e.jsx("em",{children:"por que"})," falhou. ",e.jsx("code",{children:"Files.delete()"})," joga exceção descritiva."]}),e.jsxs("li",{children:[e.jsx("code",{children:"File"})," não entende links simbólicos direito."]}),e.jsxs("li",{children:["Sem suporte a streams, sem ",e.jsx("code",{children:"BasicFileAttributes"}),", sem watchers (",e.jsx("code",{children:"WatchService"}),")."]}),e.jsx("li",{children:"Misturar as duas APIs é confuso. Use só NIO.2 e ponto."})]}),e.jsxs(s,{type:"info",title:"Interop quando precisar",children:["Se uma lib velha exige ",e.jsx("code",{children:"java.io.File"}),", converta na hora: ",e.jsx("code",{children:"path.toFile()"}),". Mas mantenha seu código em ",e.jsx("code",{children:"Path"}),"."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um programa que recebe uma pasta como argumento e imprime quantos arquivos ",e.jsx("code",{children:".txt"})," existem nela (sem entrar em subpastas). Use ",e.jsx("code",{children:"Files.list"}),"."]}),e.jsxs("li",{children:['Escreva um "find" simples: dado uma pasta e uma extensão, liste todos os arquivos da árvore com aquela extensão. Use ',e.jsx("code",{children:"Files.walk"})," e ",e.jsx("code",{children:"Files.isRegularFile"}),"."]}),e.jsxs("li",{children:["Faça um backup automático: receba um caminho de arquivo e crie uma cópia ao lado dele com sufixo ",e.jsx("code",{children:".bak"}),". Use ",e.jsx("code",{children:"resolveSibling"})," e ",e.jsx("code",{children:"Files.copy"})," com ",e.jsx("code",{children:"StandardCopyOption.REPLACE_EXISTING"}),"."]})]})]})}export{l as default};
