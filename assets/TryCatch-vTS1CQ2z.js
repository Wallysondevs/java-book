import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"try / catch / finally",subtitle:"Capturar, tratar e garantir limpeza.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Toda operação que toca o mundo externo (arquivo, rede, banco) pode falhar. O bloco ",e.jsx("code",{children:"try/catch/finally"}),' é a ferramenta que transforma o pânico de "deu exception" em um plano: ',e.jsx("strong",{children:"tente"}),", ",e.jsx("strong",{children:"capture o problema"}),", e ",e.jsx("strong",{children:"limpe a bagunça"})," no final, dê certo ou não."]}),e.jsx("h2",{children:"A sintaxe básica"}),e.jsx(o,{title:"Forma canônica",code:`try {
    // código que pode lançar exception
} catch (TipoDaExcecao e) {
    // o que fazer quando der errado
} finally {
    // SEMPRE executa — ideal para liberar recursos
}`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"try"})," sozinho não vale: você precisa pelo menos de um ",e.jsx("code",{children:"catch"})," ou um ",e.jsx("code",{children:"finally"}),". Pode ter vários ",e.jsx("code",{children:"catch"})," e um único ",e.jsx("code",{children:"finally"}),"."]}),e.jsx("h2",{children:"Exemplo concreto"}),e.jsx(o,{title:"Dividir dois números pedidos pelo usuário",code:`import java.util.Scanner;

public class Divisao {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            System.out.print("Numerador: ");
            int a = Integer.parseInt(sc.nextLine());
            System.out.print("Denominador: ");
            int b = Integer.parseInt(sc.nextLine());
            System.out.println("Resultado: " + (a / b));
        } catch (NumberFormatException e) {
            System.err.println("Você precisa digitar números inteiros.");
        } catch (ArithmeticException e) {
            System.err.println("Não dá pra dividir por zero.");
        } finally {
            sc.close();
            System.out.println("Programa encerrado.");
        }
    }
}`}),e.jsx("h2",{children:"Ordem dos catches: do mais específico para o mais geral"}),e.jsxs("p",{children:["Se você capturar ",e.jsx("code",{children:"Exception"})," antes de ",e.jsx("code",{children:"IOException"}),", o segundo nunca é alcançado — e o compilador reclama. Pense numa peneira: as malhas finas vêm primeiro."]}),e.jsx(o,{title:"Ordem correta",code:`try {
    abrirArquivo();
} catch (FileNotFoundException e) {     // mais específico
    System.err.println("Arquivo não existe.");
} catch (IOException e) {                // mais genérico
    System.err.println("Erro de I/O: " + e.getMessage());
} catch (Exception e) {                  // último recurso
    System.err.println("Algo inesperado.");
}`}),e.jsx("h2",{children:"Multi-catch: dois (ou mais) tipos no mesmo bloco"}),e.jsxs("p",{children:["Quando você trataria duas exceptions exatamente do mesmo jeito, junte com ",e.jsx("code",{children:"|"})," (desde Java 7). Menos código duplicado."]}),e.jsx(o,{title:"Multi-catch",code:`try {
    processar();
} catch (IOException | SQLException e) {
    log.error("Falha externa", e);
    throw new RuntimeException("Não foi possível processar", e);
}`}),e.jsxs(r,{type:"note",title:"A variável e é implicitamente final no multi-catch",children:["Você não pode reatribuir ",e.jsx("code",{children:"e"})," dentro do bloco. Isso evita confusão sobre qual tipo ela tem."]}),e.jsx("h2",{children:"finally: o bloco que sempre roda"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"finally"})," executa ",e.jsx("strong",{children:"sempre"}),": se o try terminou normalmente, se caiu numa exception (capturada ou não), e até se houve ",e.jsx("code",{children:"return"})," dentro do try. É o lugar histórico para fechar conexões, arquivos e sockets."]}),e.jsx(o,{title:"finally roda mesmo com return",code:`public static String demo() {
    try {
        System.out.println("dentro do try");
        return "valor do try";
    } finally {
        System.out.println("finally rodou mesmo com o return!");
    }
}`}),e.jsxs(r,{type:"warning",title:"Não retorne de dentro do finally",children:["Se você fizer ",e.jsx("code",{children:"return"})," no finally, ele ",e.jsx("em",{children:"sobrescreve"})," o return do try e ainda engole exceptions. É uma das piores armadilhas da linguagem. Evite."]}),e.jsx("h2",{children:"Lançando manualmente: throw"}),e.jsxs("p",{children:[e.jsx("code",{children:"throw"})," dispara uma exception agora. Use quando o estado é inválido ou um invariante foi quebrado."]}),e.jsx(o,{title:"throw em ação",code:`public void transferir(double valor) {
    if (valor <= 0) {
        throw new IllegalArgumentException("valor deve ser positivo: " + valor);
    }
    // ...
}`}),e.jsx("h2",{children:"throws: declarando que o método pode falhar"}),e.jsxs("p",{children:["Se seu método lança uma ",e.jsx("em",{children:"checked exception"})," e você não trata, declare na assinatura. Quem chamar fica sabendo (e o compilador exige tratamento)."]}),e.jsx(o,{title:"throws na assinatura",code:`import java.io.*;

public class Leitor {
    // declara: quem chamar precisa lidar com IOException
    public String lerLinha(String caminho) throws IOException {
        try (var br = new BufferedReader(new FileReader(caminho))) {
            return br.readLine();
        }
    }
}`}),e.jsx("h2",{children:"Inspecionando a exception"}),e.jsx("p",{children:"Os métodos mais úteis de qualquer Throwable:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"getMessage()"})," — texto descritivo curto."]}),e.jsxs("li",{children:[e.jsx("code",{children:"printStackTrace()"})," — joga a stack inteira no erro padrão (use só pra debug rápido)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"getCause()"}),' — a exception original, quando a atual a "embrulhou".']}),e.jsxs("li",{children:[e.jsx("code",{children:"getStackTrace()"})," — array de ",e.jsx("code",{children:"StackTraceElement"})," programaticamente."]})]}),e.jsx("h2",{children:"Chained exceptions: empacotando a causa"}),e.jsxs("p",{children:["Frequentemente você captura uma exception de baixo nível e quer relançar como algo do seu domínio, ",e.jsx("strong",{children:"sem perder"})," a stack original. Passe a exception original como segundo argumento — ela vira a ",e.jsx("em",{children:"cause"}),"."]}),e.jsx(o,{title:"Encadeando causas",code:`public Usuario buscar(long id) {
    try {
        return repositorio.findById(id);
    } catch (SQLException e) {
        throw new RuntimeException("Falha ao buscar usuário " + id, e);
    }
}`}),e.jsx("p",{children:'Quando alguém imprimir essa exception, vai ver as duas: "RuntimeException... Caused by: SQLException..." — e o ponto exato onde o SQL quebrou.'}),e.jsx(r,{type:"tip",title:"Nunca perca a causa",children:"Se você relançar sem passar a exception original, a stack trace de baixo some — e debugar vira pesadelo."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva um método ",e.jsx("code",{children:"parseIntSeguro(String s)"})," que retorna 0 quando a string não é número (capturando ",e.jsx("code",{children:"NumberFormatException"}),") e o valor convertido caso contrário."]}),e.jsxs("li",{children:["Crie um programa que tenta abrir um arquivo, captura ",e.jsx("code",{children:"FileNotFoundException"})," e ",e.jsx("code",{children:"IOException"})," separadamente, e em ",e.jsx("code",{children:"finally"}),' imprime "fim". Verifique que o finally roda nos dois casos.']}),e.jsxs("li",{children:["Faça um método ",e.jsx("code",{children:"cadastrar"})," que lança ",e.jsx("code",{children:"SQLException"}),". Capture-a e relance como ",e.jsx("code",{children:"RuntimeException"}),' usando o construtor com causa. Imprima a exception resultante e veja o "Caused by" no terminal.']})]})]})}export{c as default};
