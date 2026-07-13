import{j as e}from"./index-BpXci30S.js";import{P as s,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(s,{title:"Construtores",subtitle:"Inicialização garantida — sem construtor, sem objeto.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Sem construtor, você cria objetos pela metade. Imagine uma ",e.jsx("code",{children:"ContaBancaria"})," nascendo com ",e.jsx("code",{children:"saldo = 0"}),", ",e.jsx("code",{children:"titular = null"})," e ",e.jsx("code",{children:"cpf = null"})," — e só depois alguém lembrar de preencher. Em algum lugar do código, alguém vai esquecer, e seu sistema vai estourar um ",e.jsx("code",{children:"NullPointerException"})," em produção. O ",e.jsx("strong",{children:"construtor"}),' é a forma de Java garantir: "esse objeto não existe sem os dados essenciais".']}),e.jsx("h2",{children:"O construtor padrão (que você nem viu)"}),e.jsxs("p",{children:["Se você não declarar nenhum construtor, o compilador gera um para você — sem parâmetros, sem corpo. Por isso ",e.jsx("code",{children:"new Pessoa()"})," funciona mesmo quando você nunca escreveu um construtor."]}),e.jsx(o,{title:"Sem construtor declarado",code:`public class Pessoa {
    String nome;
    int idade;
}

// Em outro lugar:
Pessoa p = new Pessoa(); // funciona — construtor padrão invisível`}),e.jsxs(r,{type:"warning",title:"Cuidado",children:["Assim que você declara ",e.jsx("strong",{children:"qualquer"})," construtor, o construtor padrão ",e.jsx("em",{children:"desaparece"}),". Se você quiser continuar usando ",e.jsx("code",{children:"new Pessoa()"}),", vai precisar declarar um construtor sem parâmetros explicitamente."]}),e.jsx("h2",{children:"Declarando seu construtor"}),e.jsxs("p",{children:['Construtor é um "método" especial: tem o mesmo nome da classe e ',e.jsx("strong",{children:"não tem tipo de retorno"})," (nem ",e.jsx("code",{children:"void"}),"). É chamado automaticamente quando você usa ",e.jsx("code",{children:"new"}),"."]}),e.jsx(o,{title:"Pessoa.java",code:`public class Pessoa {
    String nome;
    int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

// Uso:
Pessoa ana = new Pessoa("Ana", 30);`}),e.jsx("h2",{children:"Sobrecarga de construtores"}),e.jsx("p",{children:"Você pode declarar vários construtores com listas de parâmetros diferentes. Quem chama escolhe a versão mais conveniente."}),e.jsx(o,{title:"Sobrecarga",code:`public class Pessoa {
    String nome;
    int idade;

    public Pessoa() {
        this.nome = "Anônimo";
        this.idade = 0;
    }

    public Pessoa(String nome) {
        this.nome = nome;
        this.idade = 0;
    }

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}`}),e.jsx("h2",{children:"this(...) — chamando outro construtor"}),e.jsxs("p",{children:["Repetir lógica entre construtores é receita de bug. Use ",e.jsx("code",{children:"this(...)"})," para delegar para outra versão. Tem que ser a ",e.jsx("strong",{children:"primeira"})," instrução do construtor."]}),e.jsx(o,{title:"Encadeamento com this()",code:`public class Pessoa {
    String nome;
    int idade;

    public Pessoa() {
        this("Anônimo", 0);
    }

    public Pessoa(String nome) {
        this(nome, 0);
    }

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}`}),e.jsx("h2",{children:"super(...) — chamando o construtor da pai"}),e.jsxs("p",{children:["Quando uma classe estende outra, o construtor da filha precisa garantir que a parte herdada também seja inicializada. Por padrão, Java insere uma chamada ",e.jsx("code",{children:"super()"})," implícita no início do construtor da filha. Se a pai não tem construtor sem parâmetros, você é obrigado a chamar ",e.jsx("code",{children:"super(...)"})," explicitamente."]}),e.jsx(o,{title:"super em ação",code:`public class Animal {
    String especie;

    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Cachorro extends Animal {
    String raca;

    public Cachorro(String raca) {
        super("Canis familiaris"); // obrigatório aqui
        this.raca = raca;
    }
}`}),e.jsx("h2",{children:"Ordem de inicialização"}),e.jsxs("p",{children:["Quando você faz ",e.jsx("code",{children:"new MinhaClasse(...)"}),", Java executa, nessa ordem:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Valores default dos campos"})," — ",e.jsx("code",{children:"0"})," para numéricos, ",e.jsx("code",{children:"false"})," para boolean, ",e.jsx("code",{children:"null"})," para referências."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Inicializadores de campo e blocos de instância"})," — na ordem em que aparecem no código."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Corpo do construtor"})," — depois do ",e.jsx("code",{children:"super(...)"}),"."]})]}),e.jsx(o,{title:"OrdemInit.java",code:`public class OrdemInit {
    int x = 10;          // (2) inicializador de campo

    {
        System.out.println("bloco: x = " + x); // (2) bloco de instância
    }

    public OrdemInit() {
        System.out.println("construtor: x = " + x); // (3)
        x = 99;
    }

    public static void main(String[] args) {
        new OrdemInit();
    }
}`}),e.jsx("h2",{children:"Construtor privado: singleton e factory"}),e.jsxs("p",{children:["Se você marca o construtor como ",e.jsx("code",{children:"private"}),", ninguém de fora pode usar ",e.jsx("code",{children:"new"}),". Isso destrava dois padrões clássicos:"]}),e.jsx("h3",{children:"Singleton — uma única instância no programa todo"}),e.jsx(o,{title:"Configuracao.java",code:`public class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    private Configuracao() { }

    public static Configuracao get() {
        return INSTANCIA;
    }
}

// Uso:
Configuracao c = Configuracao.get();`}),e.jsx("h3",{children:"Factory method — método estático que cria instâncias"}),e.jsx(o,{title:"Cor.java",code:`public class Cor {
    int r, g, b;

    private Cor(int r, int g, int b) {
        this.r = r; this.g = g; this.b = b;
    }

    public static Cor rgb(int r, int g, int b) {
        return new Cor(r, g, b);
    }

    public static Cor preto() {
        return new Cor(0, 0, 0);
    }
}

Cor c = Cor.rgb(200, 100, 50);
Cor preto = Cor.preto();`}),e.jsx("h2",{children:"Construtor não é método"}),e.jsx("p",{children:"Cuidado com a confusão: construtor parece método, mas não é. Diferenças importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Construtor ",e.jsx("strong",{children:"não tem tipo de retorno"})," — nem ",e.jsx("code",{children:"void"}),"."]}),e.jsx("li",{children:"Construtor tem o mesmo nome da classe; método pode ter qualquer nome."}),e.jsxs("li",{children:["Construtor é chamado automaticamente por ",e.jsx("code",{children:"new"}),"; método é chamado explicitamente."]}),e.jsx("li",{children:"Construtor não é herdado. Cada classe declara os seus."})]}),e.jsxs(r,{type:"tip",title:"Pegadinha de prova",children:["Se você escreveu ",e.jsx("code",{children:"public void Pessoa() "})," com ",e.jsx("code",{children:"void"}),", isso é um ",e.jsx("strong",{children:"método"})," chamado ",e.jsx("code",{children:"Pessoa"}),", não um construtor. O compilador aceita, e o construtor padrão continua sendo gerado. Bug silencioso."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Produto"}),' com três construtores: um sem parâmetros (nome "Sem nome", preço 0), um só com nome, e um completo (nome e preço). Use ',e.jsx("code",{children:"this(...)"})," para evitar repetição."]}),e.jsxs("li",{children:["Implemente um Singleton ",e.jsx("code",{children:"ContadorGlobal"})," com método ",e.jsx("code",{children:"incrementar()"})," e ",e.jsx("code",{children:"valor()"}),". Garanta que duas chamadas a ",e.jsx("code",{children:"ContadorGlobal.get()"})," devolvem a mesma instância."]}),e.jsxs("li",{children:["Crie a classe ",e.jsx("code",{children:"Animal"})," com construtor que recebe ",e.jsx("code",{children:"especie"}),", e ",e.jsx("code",{children:"Gato extends Animal"}),". No construtor de ",e.jsx("code",{children:"Gato"}),", force a chamada de ",e.jsx("code",{children:'super("Felis catus")'}),". Tente remover essa linha — qual erro o compilador dá?"]})]})]})}export{c as default};
