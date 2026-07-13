import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Ler & Escrever Arquivos",subtitle:"Texto, binário, stream — escolha a ferramenta certa pra cada tarefa.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Ler um arquivo de configuração, processar um CSV de 2 GB, salvar uma imagem que veio numa requisição HTTP — tudo isso é I/O de arquivo. Java tem várias formas de fazer cada uma dessas coisas, e a diferença importa: usar a errada pode estourar a memória ou ficar 100× mais lento."}),e.jsxs(a,{type:"tip",title:"Regra do tamanho",children:["Arquivo cabe na memória sem dó (até alguns MB)? Use os métodos ",e.jsx("code",{children:"Files.read*"})," de uma vez. Arquivo é grande ou desconhecido? Use ",e.jsx("code",{children:"Files.lines"})," ou ",e.jsx("code",{children:"InputStream"})," e processe em partes."]}),e.jsx("h2",{children:"Texto pequeno: Files.readString e writeString"}),e.jsx("p",{children:"Desde Java 11, ler ou escrever um arquivo texto inteiro vira uma linha:"}),e.jsx(r,{title:"Leitura/escrita simples",code:`import java.nio.file.*;
import java.io.IOException;

public class Texto {
    public static void main(String[] args) throws IOException {
        Path arq = Path.of("config.txt");

        Files.writeString(arq, "porta=8080\\nhost=localhost\\n");
        String conteudo = Files.readString(arq);

        System.out.println(conteudo);
    }
}`}),e.jsxs("p",{children:["Se você quer trabalhar linha a linha, mas o arquivo é pequeno, use ",e.jsx("code",{children:"readAllLines"}),":"]}),e.jsx(r,{title:"Linhas como List<String>",code:`import java.util.List;
List<String> linhas = Files.readAllLines(Path.of("nomes.txt"));
for (String linha : linhas) {
    System.out.println("> " + linha);
}

Files.write(Path.of("saida.txt"), List.of("um", "dois", "tres"));`}),e.jsx("h2",{children:"Texto grande: Files.lines (Stream)"}),e.jsxs("p",{children:["Quando o arquivo tem milhões de linhas, carregar tudo na memória é suicídio. ",e.jsx("code",{children:"Files.lines"})," devolve um ",e.jsx("code",{children:"Stream<String>"})," preguiçoso — você processa uma linha de cada vez sem carregar o arquivo inteiro."]}),e.jsx(r,{title:"Contando linhas com 'ERROR'",code:`import java.util.stream.Stream;

try (Stream<String> linhas = Files.lines(Path.of("app.log"))) {
    long erros = linhas.filter(l -> l.contains("ERROR")).count();
    System.out.println("Erros: " + erros);
}`}),e.jsxs(a,{type:"warning",title:"Sempre try-with-resources",children:[e.jsx("code",{children:"Files.lines"})," mantém o arquivo aberto até o stream ser fechado. Sem ",e.jsx("code",{children:"try-with-resources"}),', você vaza descritores e no Linux o seu programa vai quebrar com "Too many open files".']}),e.jsx("h2",{children:"BufferedReader: controle linha a linha clássico"}),e.jsxs("p",{children:["Se você precisa de mais controle (ex.: pular cabeçalho, parsear estado complexo), ",e.jsx("code",{children:"BufferedReader"})," é o jeito tradicional:"]}),e.jsx(r,{title:"BufferedReader e BufferedWriter",code:`import java.io.*;
import java.nio.file.*;

try (BufferedReader r = Files.newBufferedReader(Path.of("entrada.txt"));
     BufferedWriter w = Files.newBufferedWriter(Path.of("saida.txt"))) {
    String linha;
    while ((linha = r.readLine()) != null) {
        w.write(linha.toUpperCase());
        w.newLine();
    }
}`}),e.jsx("h2",{children:"Binário pequeno: readAllBytes e write(bytes)"}),e.jsxs("p",{children:["Pra ler uma imagem ou PDF inteiro pra um ",e.jsx("code",{children:"byte[]"}),":"]}),e.jsx(r,{title:"Binário simples",code:`byte[] bytes = Files.readAllBytes(Path.of("logo.png"));
System.out.println("Tamanho: " + bytes.length + " bytes");

Files.write(Path.of("copia.png"), bytes);`}),e.jsx("h2",{children:"Binário grande: InputStream e OutputStream"}),e.jsx("p",{children:"Pra arquivos grandes, leia em pedaços com um buffer. Esse padrão funciona pra qualquer tamanho:"}),e.jsx(r,{title:"Cópia em chunks",code:`import java.io.*;
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
Files.copy(Path.of("video.mp4"), Path.of("video-copia2.mp4"));`}),e.jsx("h2",{children:"Charset: UTF-8 por padrão (desde Java 18)"}),e.jsxs("p",{children:["Antes do Java 18, o charset padrão dependia do sistema operacional — ",e.jsx("code",{children:"Cp1252"})," no Windows pt-BR, ",e.jsx("code",{children:"UTF-8"}),' no Linux. Isso gerava bugs do tipo "acento sumiu". Desde Java 18 (JEP 400), o padrão é ',e.jsx("code",{children:"UTF-8"})," em todo lugar."]}),e.jsx(r,{title:"Charset explícito quando precisar",code:`import java.nio.charset.StandardCharsets;

// Forçando charset (útil se o arquivo veio de sistema legado em Latin-1):
String texto = Files.readString(Path.of("legado.txt"), StandardCharsets.ISO_8859_1);
Files.writeString(Path.of("saida.txt"), texto, StandardCharsets.UTF_8);`}),e.jsx(a,{type:"tip",title:"Sempre seja explícito em produção",children:"Mesmo que o padrão hoje seja UTF-8, deixar o charset explícito no código deixa claro pra próxima pessoa (ou pra você daqui 6 meses) qual a expectativa."}),e.jsx("h2",{children:"SequenceInputStream e ObjectInputStream (rapidão)"}),e.jsxs("p",{children:[e.jsx("code",{children:"SequenceInputStream"}),' "concatena" dois ou mais streams como se fossem um só — útil pra juntar arquivos sem carregar tudo na memória.']}),e.jsxs("p",{children:[e.jsx("code",{children:"ObjectInputStream"})," /",e.jsx("code",{children:"ObjectOutputStream"})," serializam objetos Java direto pro disco. Funciona, mas a serialização nativa é considerada legada e insegura — prefira JSON (Jackson) ou formatos binários portáveis (Protobuf) pra dados que precisam atravessar sistemas."]}),e.jsx(r,{title:"Concatenando arquivos",code:`import java.io.*;
import java.nio.file.*;

try (InputStream a = Files.newInputStream(Path.of("parte1.bin"));
     InputStream b = Files.newInputStream(Path.of("parte2.bin"));
     SequenceInputStream juntos = new SequenceInputStream(a, b);
     OutputStream out = Files.newOutputStream(Path.of("inteiro.bin"))) {
    juntos.transferTo(out);
}`}),e.jsx("h2",{children:"Resumo: qual usar quando"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Texto até alguns MB:"})," ",e.jsx("code",{children:"Files.readString"})," / ",e.jsx("code",{children:"writeString"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Texto grande, processo linha a linha:"})," ",e.jsx("code",{children:"Files.lines"})," com try-with-resources."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lógica complexa por linha:"})," ",e.jsx("code",{children:"BufferedReader"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Binário pequeno:"})," ",e.jsx("code",{children:"Files.readAllBytes"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Binário grande / streaming:"})," ",e.jsx("code",{children:"InputStream"}),"/",e.jsx("code",{children:"OutputStream"})," ou ",e.jsx("code",{children:"Files.copy"}),"."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Conte quantas linhas em um arquivo de log começam com ",e.jsx("code",{children:'"WARN"'})," usando ",e.jsx("code",{children:"Files.lines"}),". Teste com um arquivo grande pra ver que não estoura memória."]}),e.jsxs("li",{children:["Faça um programa que copia um arquivo binário de qualquer tamanho usando ",e.jsx("code",{children:"InputStream"}),"/",e.jsx("code",{children:"OutputStream"})," e um buffer de 8 KB. Compare com ",e.jsx("code",{children:"Files.copy"})," medindo o tempo."]}),e.jsxs("li",{children:["Crie um conversor: leia um arquivo em ",e.jsx("code",{children:"ISO_8859_1"})," e regrave em ",e.jsx("code",{children:"UTF-8"}),", mantendo os acentos corretos. Use ",e.jsx("code",{children:"Files.readString"})," + ",e.jsx("code",{children:"Files.writeString"})," com charsets explícitos."]})]})]})}export{n as default};
