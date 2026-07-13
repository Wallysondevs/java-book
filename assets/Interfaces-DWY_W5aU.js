import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(r,{title:"Interfaces",subtitle:"Contrato puro — desde Java 8 com default methods, ficou poderosa.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:['Imagine que você está escrevendo uma função que ordena uma lista. Você não quer saber se os itens são pessoas, produtos ou planetas — quer apenas saber que eles sabem se comparar entre si. Em vez de pedir "me dê uma classe específica", você pede "me dê qualquer coisa que implemente ',e.jsx("code",{children:"Comparable"}),'". Isso é uma interface: um contrato. "Se você assina esse contrato, prometo que sei te tratar."']}),e.jsx("p",{children:"Pense numa tomada elétrica: ela não liga pra qual aparelho você plugou (geladeira, carregador, micro-ondas). Só importa que o plugue tem o formato certo. Interface é o formato do plugue. A classe que implementa é o aparelho."}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsx(a,{title:"Definindo e implementando uma interface",code:`public interface Veiculo {
    void acelerar();
    void frear();
    int velocidadeMaxima();
}

public class Carro implements Veiculo {
    @Override
    public void acelerar() {
        System.out.println("Vrum!");
    }

    @Override
    public void frear() {
        System.out.println("Iiii!");
    }

    @Override
    public int velocidadeMaxima() {
        return 220;
    }
}`}),e.jsxs("p",{children:["Você usa ",e.jsx("code",{children:"interface"})," no lugar de ",e.jsx("code",{children:"class"}),", lista os métodos SEM corpo (só assinatura, terminando em ",e.jsx("code",{children:";"}),"), e quem quiser cumprir o contrato usa ",e.jsx("code",{children:"implements NomeDaInterface"}),"."]}),e.jsx("h2",{children:"Múltipla herança de tipo"}),e.jsxs("p",{children:['Java não deixa uma classe estender duas classes (pra evitar o famoso "diamante da morte"). Mas uma classe pode implementar ',e.jsx("strong",{children:"quantas interfaces quiser"}),":"]}),e.jsx(a,{title:"Várias interfaces de uma vez",code:`public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

public class Pato implements Voador, Nadador {
    @Override public void voar()  { System.out.println("Voando baixo..."); }
    @Override public void nadar() { System.out.println("Nadando tranquilo."); }
}`}),e.jsxs(o,{type:"tip",title:"Pense em interfaces como adjetivos",children:["Classes costumam ser substantivos (",e.jsx("code",{children:"Pato"}),", ",e.jsx("code",{children:"Carro"}),"). Interfaces costumam ser adjetivos ou capacidades (",e.jsx("code",{children:"Voador"}),",",e.jsx("code",{children:"Comparable"}),", ",e.jsx("code",{children:"Iterable"}),", ",e.jsx("code",{children:"Runnable"}),"). Um objeto pode ter várias capacidades ao mesmo tempo."]}),e.jsx("h2",{children:"Regras invisíveis: o que o Java assume pra você"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Todo método declarado numa interface é ",e.jsx("code",{children:"public"})," automaticamente — você não precisa escrever a palavra."]}),e.jsxs("li",{children:["Todo campo numa interface é ",e.jsx("code",{children:"public static final"})," implicitamente. Ou seja: constantes públicas."]}),e.jsx("li",{children:"Você não pode ter campos de instância (estado por objeto). Interface não guarda estado, só comportamento."})]}),e.jsx(a,{title:"Constantes implícitas",code:`public interface Config {
    int TIMEOUT = 5000;          // public static final
    String VERSAO = "1.0.0";     // public static final
}

// Uso: System.out.println(Config.TIMEOUT);`}),e.jsx("h2",{children:"Default methods (Java 8+)"}),e.jsxs("p",{children:["Antes do Java 8, adicionar um método novo numa interface quebrava todas as classes que já a implementavam. Pra resolver isso, a galera do Java introduziu",e.jsx("strong",{children:"default methods"}),": métodos com implementação dentro da própria interface. Se a classe não sobrescrever, herda a implementação default."]}),e.jsx(a,{title:"Default method",code:`public interface Saudacao {
    String nome();

    // Implementação default — opcional sobrescrever
    default String ola() {
        return "Olá, " + nome() + "!";
    }
}

public class Pessoa implements Saudacao {
    private final String nome;
    public Pessoa(String nome) { this.nome = nome; }

    @Override
    public String nome() { return nome; }
}

// new Pessoa("Maria").ola()  →  "Olá, Maria!"`}),e.jsx("h2",{children:"Static methods em interface"}),e.jsxs("p",{children:["Também desde o Java 8, você pode colocar métodos ",e.jsx("code",{children:"static"})," numa interface — normalmente utilitários relacionados ao contrato. Eles são chamados pelo nome da interface, não por instâncias."]}),e.jsx(a,{title:"Static method",code:`public interface Calculadora {
    int calcular(int a, int b);

    static Calculadora soma() {
        return (a, b) -> a + b;
    }
}

// Calculadora.soma().calcular(2, 3)  →  5`}),e.jsx("h2",{children:"Private methods em interface (Java 9+)"}),e.jsxs("p",{children:["Quando você tem vários default methods que compartilham um pedaço de lógica, seria feio repetir esse pedaço. Java 9 trouxe métodos ",e.jsx("code",{children:"private"})," em interface justamente pra isso: extrair lógica interna sem expô-la."]}),e.jsx(a,{title:"Private helper",code:`public interface Logger {
    default void info(String msg)  { log("INFO",  msg); }
    default void warn(String msg)  { log("WARN",  msg); }
    default void error(String msg) { log("ERROR", msg); }

    private void log(String nivel, String msg) {
        System.out.println("[" + nivel + "] " + msg);
    }
}`}),e.jsx("h2",{children:"Functional interfaces — a base dos lambdas"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"functional interface"})," é uma interface com exatamente ",e.jsx("em",{children:"um"}),"método abstrato. O Java permite escrever a implementação dela como uma expressão lambda, super compacta. ",e.jsx("code",{children:"Runnable"}),", ",e.jsx("code",{children:"Comparator"}),", ",e.jsx("code",{children:"Function"}),"são exemplos famosos."]}),e.jsx(a,{title:"Functional interface + lambda",code:`@FunctionalInterface
public interface Transformador {
    String aplicar(String entrada);
}

public class Demo {
    public static void main(String[] args) {
        Transformador maiusculas = s -> s.toUpperCase();
        Transformador exclamar   = s -> s + "!";

        System.out.println(maiusculas.aplicar("oi"));   // "OI"
        System.out.println(exclamar.aplicar("eba"));    // "eba!"
    }
}`}),e.jsx(o,{type:"info",title:"A anotação @FunctionalInterface",children:"É opcional, mas recomendada: ela faz o compilador verificar que sua interface realmente tem só um método abstrato. Se alguém adicionar um segundo, vira erro de compilação na hora — e não bug misterioso depois."}),e.jsx("h2",{children:"Interface vs classe abstrata"}),e.jsx("p",{children:"Pergunta clássica de entrevista. Diferenças práticas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Múltipla:"})," uma classe pode implementar várias interfaces, mas só estender UMA classe abstrata."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Estado:"})," classe abstrata tem campos de instância normais; interface não tem (só constantes)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Construtor:"})," classe abstrata pode ter; interface, não."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quando usar interface:"})," definir uma capacidade compartilhada por classes não relacionadas (",e.jsx("code",{children:"Comparable"}),", ",e.jsx("code",{children:"AutoCloseable"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quando usar abstract:"})," compartilhar código + estado entre classes que SÃO uma especialização da base."]})]}),e.jsx("p",{children:"Na dúvida, comece com interface. Migre pra classe abstrata só quando precisar carregar estado ou muito código comum."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie a interface ",e.jsx("code",{children:"Tocavel"})," com método ",e.jsx("code",{children:"tocar()"}),". Implemente",e.jsx("code",{children:"Violao"})," e ",e.jsx("code",{children:"Bateria"}),". Crie um ",e.jsx("code",{children:"List<Tocavel>"}),"com instâncias dos dois e itere chamando ",e.jsx("code",{children:"tocar()"})," em cada um."]}),e.jsxs("li",{children:["Faça uma interface ",e.jsx("code",{children:"Calculadora"})," com método ",e.jsx("code",{children:"operar(int a, int b)"}),"e default methods ",e.jsx("code",{children:"dobrar(int n)"})," (chama ",e.jsx("code",{children:"operar(n, n)"}),") e",e.jsx("code",{children:"zerar(int n)"}),'. Implemente "Soma" e "Multiplicacao" como lambdas.']}),e.jsxs("li",{children:["Crie duas interfaces, ",e.jsx("code",{children:"A"})," e ",e.jsx("code",{children:"B"}),", ambas com um default method de mesmo nome ",e.jsx("code",{children:"metodo()"}),". Faça uma classe que implemente as duas. O compilador vai exigir que você sobrescreva. Veja o erro, corrija e entenda por que aconteceu."]})]})]})}export{t as default};
