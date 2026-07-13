import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"try-with-resources",subtitle:"Java 7+ fecha recursos automaticamente — adeus finally manual.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Antes do Java 7, fechar arquivos, conexões e sockets era um inferno: você tinha que abrir no ",e.jsx("code",{children:"try"}),", fechar no ",e.jsx("code",{children:"finally"})," e ainda tratar exceptions do próprio",e.jsx("code",{children:"close()"}),". Resultado: bug e vazamento de recurso eram a regra. O ",e.jsx("strong",{children:"try-with-resources"})," resolveu isso — declara o recurso entre parênteses no try e Java fecha sozinho no fim."]}),e.jsx("h2",{children:"Antes vs depois"}),e.jsx(r,{title:"Jeito antigo (chato e bugável)",code:`BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("dados.txt"));
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close();
        } catch (IOException e) {
            // e agora? exception dentro de exception...
        }
    }
}`}),e.jsx(r,{title:"Jeito moderno (Java 7+)",code:`try (var br = new BufferedReader(new FileReader("dados.txt"))) {
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
}`}),e.jsxs("p",{children:["Mais curto, mais correto e impossível esquecer de fechar. O ",e.jsx("code",{children:"br"})," é fechado automaticamente quando o bloco termina, com sucesso ou exception."]}),e.jsx("h2",{children:"A regra: precisa implementar AutoCloseable"}),e.jsxs("p",{children:["Qualquer classe que implemente ",e.jsx("code",{children:"java.lang.AutoCloseable"})," (ou ",e.jsx("code",{children:"java.io.Closeable"}),", que é mais antiga) pode entrar no try-with-resources. As principais classes da JDK que mexem com I/O já implementam: streams, readers, writers, sockets, ",e.jsx("code",{children:"Connection"}),", ",e.jsx("code",{children:"Statement"}),", ",e.jsx("code",{children:"ResultSet"}),"..."]}),e.jsx("h2",{children:"Múltiplos recursos no mesmo try"}),e.jsxs("p",{children:["Separe com ",e.jsx("code",{children:";"}),". Eles são fechados na ",e.jsx("strong",{children:"ordem inversa"})," da declaração — o último aberto é o primeiro a fechar (faz sentido: dependências saem primeiro)."]}),e.jsx(r,{title:"Vários recursos",code:`try (
    var entrada = new BufferedReader(new FileReader("entrada.txt"));
    var saida   = new BufferedWriter(new FileWriter("saida.txt"))
) {
    String linha;
    while ((linha = entrada.readLine()) != null) {
        saida.write(linha.toUpperCase());
        saida.newLine();
    }
} catch (IOException e) {
    System.err.println("Erro: " + e.getMessage());
}
// fecha saida primeiro, depois entrada — ordem inversa`}),e.jsx("h2",{children:"Combina com catch e finally"}),e.jsxs("p",{children:["Você pode adicionar ",e.jsx("code",{children:"catch"})," e ",e.jsx("code",{children:"finally"})," normalmente. O fechamento acontece ",e.jsx("em",{children:"antes"})," dos catches, então no catch o recurso já está fechado."]}),e.jsx(r,{title:"try-with-resources + catch + finally",code:`try (var conn = DriverManager.getConnection(url)) {
    // usa a conexão
} catch (SQLException e) {
    log.error("Banco fora?", e);
} finally {
    System.out.println("encerrando bloco");
}`}),e.jsx("h2",{children:"Suprimidas exceptions: e.getSuppressed()"}),e.jsxs("p",{children:["E se o seu código lançar uma exception ",e.jsx("em",{children:"e"})," o ",e.jsx("code",{children:"close()"})," também lançar? Antes a segunda escondia a primeira (péssimo pra debug). Agora a do código vence e a do close fica anexada como ",e.jsx("strong",{children:"suprimida"})," — você acessa via ",e.jsx("code",{children:"e.getSuppressed()"}),"."]}),e.jsx(r,{title:"Inspecionando suprimidas",code:`try (var r = new RecursoQueFalhaNoClose()) {
    r.processar(); // joga RuntimeException
} catch (Exception e) {
    System.err.println("Principal: " + e.getMessage());
    for (Throwable supp : e.getSuppressed()) {
        System.err.println("Suprimida: " + supp.getMessage());
    }
}`}),e.jsxs(o,{type:"info",title:"Imutabilidade desde Java 9",children:["Antes do Java 9 você precisava declarar a variável dentro do try. Hoje pode usar uma variável ",e.jsx("code",{children:"final"})," (ou efetivamente final) declarada antes: ",e.jsxs("code",{children:["try (br) ","{ ... }"]}),". Útil quando o recurso é construído em outro lugar."]}),e.jsx("h2",{children:"Criando o seu próprio AutoCloseable"}),e.jsxs("p",{children:["Qualquer classe sua que precise liberar algo (cache, conexão custom, lock) pode implementar ",e.jsx("code",{children:"AutoCloseable"}),". Aí ela entra no try-with-resources como qualquer outra."]}),e.jsx(r,{title:"Recurso customizado",code:`public class Cronometro implements AutoCloseable {
    private final long inicio = System.nanoTime();
    private final String nome;

    public Cronometro(String nome) {
        this.nome = nome;
        System.out.println(">>> iniciando " + nome);
    }

    @Override
    public void close() {
        long ms = (System.nanoTime() - inicio) / 1_000_000;
        System.out.println("<<< " + nome + " levou " + ms + " ms");
    }
}

class Demo {
    public static void main(String[] args) throws InterruptedException {
        try (var c = new Cronometro("processamento")) {
            Thread.sleep(150);
        }
        // ao sair do bloco, close() é chamado automaticamente
    }
}`}),e.jsxs(o,{type:"tip",title:"close() não deveria lançar",children:["Idealmente seu ",e.jsx("code",{children:"close()"})," não lança exception. Se precisar, prefira ",e.jsx("code",{children:"RuntimeException"})," ou estenda ",e.jsx("code",{children:"AutoCloseable"})," (que permite ",e.jsx("code",{children:"throws Exception"}),") — mas saiba que isso obriga quem usar a tratar."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Reescreva um trecho que lê um arquivo linha a linha usando try-with-resources com ",e.jsx("code",{children:"BufferedReader"}),". Imprima cada linha numerada."]}),e.jsxs("li",{children:["Crie a classe ",e.jsx("code",{children:"Sessao implements AutoCloseable"}),' que imprime "abriu sessão" no construtor e "fechou sessão" no ',e.jsx("code",{children:"close()"}),". Use ela num try-with-resources e observe a ordem de execução."]}),e.jsxs("li",{children:["Crie dois recursos no mesmo try (pode ser duas instâncias do ",e.jsx("code",{children:"Cronometro"})," com nomes diferentes) e confirme no terminal que o fechamento acontece na ordem inversa da declaração."]})]})]})}export{c as default};
