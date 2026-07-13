import{j as e}from"./index-BpXci30S.js";import{P as i,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Exceções: visão geral",subtitle:"Hierarquia Throwable, checked vs unchecked, e quando usar cada uma.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Programa que não trata erro é programa que cai em produção às 3 da manhã. Em Java, erros viram ",e.jsx("strong",{children:"objetos"})," — você consegue capturá-los, decidir o que fazer e seguir a vida. Sem isso, qualquer leitura de arquivo, requisição HTTP ou divisão por zero derruba sua aplicação inteira."]}),e.jsx("h2",{children:"A hierarquia em uma imagem mental"}),e.jsxs("p",{children:["Tudo que pode ser lançado em Java herda de ",e.jsx("code",{children:"Throwable"}),". Abaixo dele a árvore se divide em duas famílias com personalidades muito diferentes:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Error"})," — coisa séria da JVM. Você ",e.jsx("em",{children:"não trata"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Exception"})," — problema da sua aplicação. Você trata."]})]}),e.jsxs("p",{children:["E dentro de ",e.jsx("code",{children:"Exception"})," existe um filho especial: ",e.jsx("code",{children:"RuntimeException"}),". Tudo que herda dele é ",e.jsx("em",{children:"unchecked"})," (o compilador não obriga a tratar). O resto é ",e.jsx("em",{children:"checked"})," (o compilador obriga)."]}),e.jsx(a,{title:"Hierarquia simplificada",code:`Throwable
├── Error                    // não trata: OutOfMemoryError, StackOverflowError
└── Exception                // CHECKED: IOException, SQLException, etc
    └── RuntimeException     // UNCHECKED: NullPointerException, IllegalArgumentException...`}),e.jsx("h2",{children:"Checked: o compilador te cobra"}),e.jsxs("p",{children:["Se um método pode lançar uma checked exception, você é ",e.jsx("strong",{children:"obrigado"})," a uma de duas coisas: tratar com ",e.jsx("code",{children:"try/catch"})," ou repassar declarando ",e.jsx("code",{children:"throws"})," na assinatura. O exemplo clássico é I/O:"]}),e.jsx(a,{title:"Checked: ou trata, ou declara",code:`import java.nio.file.*;
import java.io.IOException;

public class LeArquivo {
    // opção 1: declara throws e empurra para quem chamar
    public static String ler(String caminho) throws IOException {
        return Files.readString(Path.of(caminho));
    }

    public static void main(String[] args) {
        // opção 2: trata aqui mesmo
        try {
            String conteudo = ler("config.txt");
            System.out.println(conteudo);
        } catch (IOException e) {
            System.err.println("Falha ao ler: " + e.getMessage());
        }
    }
}`}),e.jsx("h2",{children:"Unchecked: o compilador te deixa em paz"}),e.jsxs("p",{children:["Subclasses de ",e.jsx("code",{children:"RuntimeException"})," não precisam ser declaradas nem capturadas. Elas normalmente representam ",e.jsx("em",{children:"bug do programador"}),": você passou ",e.jsx("code",{children:"null"})," onde não devia, índice fora do array, argumento inválido. A ideia é ",e.jsx("strong",{children:"corrigir o código"}),", não tapar com ",e.jsx("code",{children:"try/catch"}),"."]}),e.jsx(a,{title:"Unchecked: surge sem aviso prévio",code:`public class Demo {
    public static void main(String[] args) {
        String s = null;
        // NullPointerException: você está chamando método em null
        System.out.println(s.length());

        int[] nums = {1, 2, 3};
        // ArrayIndexOutOfBoundsException
        System.out.println(nums[10]);

        // IllegalArgumentException: lance você mesmo quando faz sentido
        validarIdade(-5);
    }

    static void validarIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("idade não pode ser negativa: " + idade);
        }
    }
}`}),e.jsxs(o,{type:"warning",title:"NullPointerException é a mais famosa",children:["Em Java moderno (14+), a mensagem do NPE diz exatamente ",e.jsx("em",{children:"qual"})," variável estava nula. Use isso a seu favor — leia a stack trace inteira antes de chutar."]}),e.jsx("h2",{children:"Error: nem encoste"}),e.jsxs("p",{children:[e.jsx("code",{children:"Error"})," sinaliza problema da JVM ou ambiente: memória esgotada, stack estourada, biblioteca nativa quebrada. Capturar isso é quase sempre errado — a aplicação já está em estado instável. Deixe ela morrer e investigue a causa."]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"OutOfMemoryError"})," — heap cheio. Aumente memória ou conserte vazamento."]}),e.jsxs("li",{children:[e.jsx("code",{children:"StackOverflowError"})," — recursão sem fim, geralmente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"NoClassDefFoundError"})," — classe sumiu do classpath em runtime."]})]}),e.jsx("h2",{children:"Criando sua própria exception"}),e.jsxs("p",{children:["Quando o domínio do seu sistema tem erros próprios (saldo insuficiente, pedido inválido, usuário não encontrado), crie classes específicas. Isso deixa o ",e.jsx("code",{children:"catch"})," mais expressivo e os logs mais úteis."]}),e.jsx(a,{title:"Exception customizada de domínio",code:`public class SaldoInsuficienteException extends RuntimeException {
    private final double saldoAtual;
    private final double tentativa;

    public SaldoInsuficienteException(double saldoAtual, double tentativa) {
        super("Saldo R$" + saldoAtual + " insuficiente para sacar R$" + tentativa);
        this.saldoAtual = saldoAtual;
        this.tentativa = tentativa;
    }

    public double getSaldoAtual() { return saldoAtual; }
    public double getTentativa() { return tentativa; }
}

class Conta {
    private double saldo = 100.0;

    public void sacar(double valor) {
        if (valor > saldo) {
            throw new SaldoInsuficienteException(saldo, valor);
        }
        saldo -= valor;
    }
}`}),e.jsxs(o,{type:"tip",title:"Checked ou unchecked para a sua exception?",children:["Se quem chama o método consegue se recuperar de forma razoável (tentar de novo, mostrar diálogo), considere checked. Se é erro de programação ou estado inválido, use unchecked (estenda ",e.jsx("code",{children:"RuntimeException"}),"). Hoje a comunidade tende a preferir unchecked para a maioria dos casos."]}),e.jsx("h2",{children:"Estilo: o que NÃO fazer"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Engolir"})," exception silenciosamente: ",e.jsxs("code",{children:["catch (Exception e) ","{}"]})," é crime. Loga, no mínimo."]}),e.jsxs("li",{children:["Capturar ",e.jsx("code",{children:"Exception"})," ou ",e.jsx("code",{children:"Throwable"}),' "para garantir" — só faz isso no ',e.jsx("em",{children:"topo"})," da aplicação (handler global), não no meio do código."]}),e.jsx("li",{children:"Usar exception como controle de fluxo (ex: parar um loop). É lento e ilegível."}),e.jsxs("li",{children:["Lançar mensagens vagas tipo ",e.jsx("code",{children:'"erro"'}),". Diga ",e.jsx("em",{children:"o quê"})," aconteceu e ",e.jsx("em",{children:"com quais valores"}),"."]})]}),e.jsx(a,{title:"Anti-padrão clássico — NÃO faça",code:`try {
    fazerCoisa();
} catch (Exception e) {
    // silêncio absoluto: você nunca vai saber que algo deu errado
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Idade"})," com método estático ",e.jsx("code",{children:"validar(int)"})," que lança ",e.jsx("code",{children:"IllegalArgumentException"})," se for menor que 0 ou maior que 150. Teste com três valores e mostre a mensagem da exception."]}),e.jsxs("li",{children:["Escreva um programa que tenta ler o arquivo ",e.jsx("code",{children:'"naoexiste.txt"'})," com ",e.jsx("code",{children:"Files.readString"}),". Trate ",e.jsx("code",{children:"IOException"})," mostrando uma mensagem amigável em vez da stack trace bruta."]}),e.jsxs("li",{children:["Crie a exception customizada ",e.jsx("code",{children:"EmailInvalidoException"})," (estendendo ",e.jsx("code",{children:"RuntimeException"}),") e um método ",e.jsx("code",{children:"cadastrar(String email)"})," que lança ela quando o email não tem ",e.jsx("code",{children:"@"}),". Capture e mostre o email problemático."]})]})]})}export{n as default};
