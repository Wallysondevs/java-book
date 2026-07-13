import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Polimorfismo",subtitle:"Mesma chamada, comportamentos diferentes — o coração da OOP.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine um código de checkout que precisa lidar com 5 formas de pagamento. Sem polimorfismo, você escreve um ",e.jsx("code",{children:"switch"}),' gigante: "se for cartão faz isso, se for boleto faz aquilo, se for Pix...". Toda forma nova de pagamento exige editar esse ',e.jsx("code",{children:"switch"}),". Com polimorfismo, você define um tipo ",e.jsx("code",{children:"FormaPagamento"})," com método ",e.jsx("code",{children:"cobrar()"}),", e cada implementação cuida de si mesma. Adicionar um Pagamento Cripto vira escrever uma classe nova — sem tocar no checkout."]}),e.jsx("h2",{children:"A analogia do controle remoto"}),e.jsxs("p",{children:['O botão "play" do controle remoto funciona com TV, com aparelho de som, com Blu-ray. A ',e.jsx("em",{children:"chamada"})," é a mesma; o ",e.jsx("em",{children:"comportamento"}),' depende de quem está recebendo. Polimorfismo (do grego "muitas formas") é exatamente isso: uma única interface que se manifesta de jeitos diferentes.']}),e.jsx("h2",{children:"Polimorfismo de subtipo"}),e.jsxs("p",{children:["A forma mais comum: uma variável declarada como ",e.jsx("code",{children:"Animal"})," pode segurar uma instância de ",e.jsx("code",{children:"Cachorro"}),", ",e.jsx("code",{children:"Gato"})," ou qualquer subclasse. Quando você chama um método nessa variável, Java executa a versão correta da subclasse — e não a da superclasse."]}),e.jsx(o,{title:"Polimorfismo em ação",code:`public class Animal {
    public void emitirSom() {
        System.out.println("Algum som genérico.");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animais = { new Cachorro(), new Gato(), new Animal() };
        for (Animal a : animais) {
            a.emitirSom();
        }
    }
}
// Saída:
// Au au!
// Miau!
// Algum som genérico.`}),e.jsxs("p",{children:["Olha que poderoso: o ",e.jsx("code",{children:"for"})," só conhece ",e.jsx("code",{children:"Animal"}),", mas cada elemento responde do seu jeito. Adicionar um ",e.jsx("code",{children:"Vaca extends Animal"})," com ",e.jsx("code",{children:'"Muu!"'})," não exige mudar o loop."]}),e.jsx("h2",{children:"Upcast: implícito e seguro"}),e.jsxs("p",{children:["Atribuir uma referência de subclasse a uma variável de superclasse é o ",e.jsx("strong",{children:"upcast"}),". Java faz isso automaticamente porque é seguro — todo ",e.jsx("code",{children:"Cachorro"}),' "é um" ',e.jsx("code",{children:"Animal"}),"."]}),e.jsx(o,{title:"Upcast",code:`Cachorro rex = new Cachorro();
Animal a = rex;          // upcast implícito, sem cast
a.emitirSom();           // Au au! — virtual dispatch escolhe a versão certa`}),e.jsx("h2",{children:"Downcast: explícito e arriscado"}),e.jsxs("p",{children:["O contrário — pegar uma referência de ",e.jsx("code",{children:"Animal"})," e tratar como ",e.jsx("code",{children:"Cachorro"})," — exige cast explícito, e dispara ",e.jsx("code",{children:"ClassCastException"})," em runtime se o objeto não for daquele tipo."]}),e.jsx(o,{title:"Downcast",code:`Animal a = new Cachorro();
Cachorro c = (Cachorro) a;   // OK, é mesmo um Cachorro
c.latir();

Animal outro = new Gato();
Cachorro errado = (Cachorro) outro;   // ClassCastException em runtime!`}),e.jsx("h2",{children:"instanceof: verificando antes do cast"}),e.jsx("p",{children:"Para evitar a explosão, você verifica antes:"}),e.jsx(o,{title:"instanceof tradicional",code:`Animal a = obterAnimal();

if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.latir();
}`}),e.jsx("h2",{children:"Pattern matching para instanceof (desde Java 16)"}),e.jsxs("p",{children:["Desde o Java 16 você não precisa mais do cast explícito depois do ",e.jsx("code",{children:"instanceof"}),". Declare a variável direto na verificação:"]}),e.jsx(o,{title:"Pattern matching",code:`Animal a = obterAnimal();

if (a instanceof Cachorro c) {
    c.latir(); // c já é Cachorro, sem cast manual
}

// Funciona com else / negação também:
if (!(a instanceof Cachorro c)) {
    return;
}
c.latir(); // c continua disponível aqui`}),e.jsxs(a,{type:"tip",title:"Use sempre que puder",children:["Pattern matching reduz boilerplate e evita o risco de você editar o tipo no ",e.jsx("code",{children:"instanceof"})," e esquecer de atualizar o cast. Java 21 ainda traz pattern matching para ",e.jsx("code",{children:"switch"}),", levando isso muito mais longe — abordamos numa página específica."]}),e.jsx("h2",{children:"Virtual dispatch: a mágica por trás"}),e.jsxs("p",{children:["Quando você chama ",e.jsx("code",{children:"a.emitirSom()"})," e ",e.jsx("code",{children:"a"})," é declarada como ",e.jsx("code",{children:"Animal"}),", como Java sabe rodar a versão de ",e.jsx("code",{children:"Cachorro"}),"? Resposta: ",e.jsx("strong",{children:"late binding"})," (também chamado de ",e.jsx("em",{children:"virtual dispatch"}),"). Em tempo de execução, a JVM olha qual é o tipo real do objeto e despacha para o método correto."]}),e.jsxs("p",{children:["Em Java, ",e.jsx("strong",{children:"todo método de instância é virtual por padrão"}),". Não tem ",e.jsx("code",{children:"virtual"})," keyword como em C++ — já vem ligado. As exceções são:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Métodos ",e.jsx("code",{children:"static"})," — pertencem à classe, não à instância. Não são polimórficos."]}),e.jsxs("li",{children:["Métodos ",e.jsx("code",{children:"final"}),' — não podem ser sobrescritos, então não há "versão alternativa" pra escolher.']}),e.jsxs("li",{children:["Métodos ",e.jsx("code",{children:"private"})," — não são visíveis às subclasses, então também não participam."]})]}),e.jsx(o,{title:"static não é polimórfico",code:`public class Pai {
    public static void m() { System.out.println("Pai"); }
}

public class Filho extends Pai {
    public static void m() { System.out.println("Filho"); }
}

Pai p = new Filho();
p.m();          // imprime "Pai" — static usa o tipo declarado, não o real
Filho.m();      // imprime "Filho"`}),e.jsx("h2",{children:"Overloading vs overriding"}),e.jsxs("p",{children:['Os dois envolvem "vários métodos com mesmo nome", mas são fundamentalmente diferentes. ',e.jsx("strong",{children:"Não confunda"}),":"]}),e.jsx("h3",{children:"Overloading (sobrecarga) — polimorfismo de compilação"}),e.jsxs("p",{children:["Vários métodos na ",e.jsx("strong",{children:"mesma classe"}),", com o mesmo nome mas ",e.jsx("strong",{children:"listas de parâmetros diferentes"}),". O compilador escolhe qual chamar com base nos tipos dos argumentos. É decidido em tempo de compilação."]}),e.jsx(o,{title:"Overloading",code:`public class Calc {
    public int somar(int a, int b) { return a + b; }
    public double somar(double a, double b) { return a + b; }
    public int somar(int a, int b, int c) { return a + b + c; }
}

Calc c = new Calc();
c.somar(1, 2);          // chama versão (int, int)
c.somar(1.5, 2.5);      // chama versão (double, double)
c.somar(1, 2, 3);       // chama versão de 3 args`}),e.jsx("h3",{children:"Overriding (sobrescrita) — polimorfismo de runtime"}),e.jsxs("p",{children:["Subclasse ",e.jsx("strong",{children:"redefine"})," um método herdado da superclasse, com ",e.jsx("strong",{children:"mesma assinatura"}),". A escolha de qual versão executar é feita em runtime, baseada no tipo real do objeto."]}),e.jsx(o,{title:"Overriding",code:`public class Animal {
    public void emitirSom() { System.out.println("som"); }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() { System.out.println("Au au"); }
}

Animal a = new Cachorro();
a.emitirSom(); // Au au — escolhido em runtime`}),e.jsxs(a,{type:"warning",title:"Resumo da diferença",children:[e.jsx("strong",{children:"Overloading"}),": mesmo nome, parâmetros diferentes, mesma classe, decidido em compilação. ",e.jsx("strong",{children:"Overriding"}),": mesma assinatura, classes diferentes (pai/filha), decidido em runtime. Overloading é estática, overriding é dinâmica."]}),e.jsx("h2",{children:"Interfaces: polimorfismo mais flexível"}),e.jsxs("p",{children:["Herança de classe é poderosa mas restritiva — você só estende uma classe. Já ",e.jsx("strong",{children:"interfaces"}),' deixam você dizer "essa classe se compromete a saber fazer X" sem amarrar a hierarquia. E uma classe pode implementar várias interfaces.']}),e.jsx(o,{title:"Interfaces como base de polimorfismo",code:`public interface FormaPagamento {
    void cobrar(double valor);
}

public class Cartao implements FormaPagamento {
    @Override
    public void cobrar(double valor) {
        System.out.println("Debitando " + valor + " no cartão.");
    }
}

public class Pix implements FormaPagamento {
    @Override
    public void cobrar(double valor) {
        System.out.println("Pix de " + valor + " enviado.");
    }
}

public class Checkout {
    public void finalizar(FormaPagamento fp, double valor) {
        fp.cobrar(valor); // não importa qual implementação — funciona
    }
}`}),e.jsx("p",{children:"Esse padrão é a base de praticamente todo framework moderno. Spring, JDBC, coleções do Java — tudo trabalha contra interfaces, não contra classes concretas. Você consegue trocar implementações sem mexer no código que consome."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Modele ",e.jsx("code",{children:"Forma"})," (área genérica = 0) com filhas ",e.jsx("code",{children:"Circulo"}),", ",e.jsx("code",{children:"Quadrado"})," e ",e.jsx("code",{children:"Triangulo"}),", cada uma com sua fórmula de ",e.jsx("code",{children:"area()"}),". Crie um array ",e.jsx("code",{children:"Forma[]"}),", popule com 5 formas variadas, e some todas as áreas num único loop."]}),e.jsxs("li",{children:["Crie um método que recebe ",e.jsx("code",{children:"Object obj"})," e usa pattern matching com ",e.jsx("code",{children:"instanceof"})," para imprimir mensagens diferentes se for ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"Integer"})," ou outro tipo. Teste com 3 valores variados."]}),e.jsxs("li",{children:["Defina ",e.jsx("code",{children:"interface Notificador"})," com método ",e.jsx("code",{children:"notificar(String msg)"}),". Implemente ",e.jsx("code",{children:"EmailNotificador"})," e ",e.jsx("code",{children:"SmsNotificador"}),". Crie uma classe ",e.jsx("code",{children:"SistemaAlertas"})," com lista de ",e.jsx("code",{children:"Notificador"})," e método ",e.jsx("code",{children:"disparar(String msg)"})," que chama todos. Adicione um terceiro notificador (Slack, Telegram, o que quiser) — note que ",e.jsx("code",{children:"SistemaAlertas"})," não muda."]})]})]})}export{n as default};
