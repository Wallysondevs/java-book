import{j as e}from"./index-BpXci30S.js";import{P as s,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(s,{title:"Herança",subtitle:"extends — reutilizar e especializar comportamento.",difficulty:"iniciante",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Você modelou ",e.jsx("code",{children:"Cachorro"}),", ",e.jsx("code",{children:"Gato"})," e ",e.jsx("code",{children:"Papagaio"}),". Cada classe tem ",e.jsx("code",{children:"nome"}),", ",e.jsx("code",{children:"idade"}),", e métodos ",e.jsx("code",{children:"comer()"})," e ",e.jsx("code",{children:"dormir()"}),". Repetir o mesmo código três vezes é o caminho rápido para o inferno: você corrige um bug em ",e.jsx("code",{children:"Cachorro"})," e esquece de propagar para o resto. ",e.jsx("strong",{children:"Herança"})," resolve: você cria ",e.jsx("code",{children:"Animal"})," com tudo o que é comum, e ",e.jsx("code",{children:"Cachorro extends Animal"})," herda tudo de graça."]}),e.jsx("h2",{children:"A analogia das receitas de família"}),e.jsxs("p",{children:["Sua avó tem a receita-base de bolo. Sua mãe pega essa receita e adiciona chocolate. Você pega a da sua mãe e troca farinha por farinha de amêndoas. Cada geração ",e.jsx("em",{children:"herda"})," o que veio antes e ",e.jsx("em",{children:"especializa"}),". Em Java é igual: a subclasse recebe tudo da superclasse e adiciona ou modifica o que quiser."]}),e.jsx("h2",{children:"Sintaxe básica: extends"}),e.jsx(o,{title:"Animal e Cachorro",code:`public class Animal {
    String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public void comer() {
        System.out.println(nome + " está comendo.");
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    public void latir() {
        System.out.println(nome + " disse: au au!");
    }
}

// Uso:
Cachorro rex = new Cachorro("Rex");
rex.comer();   // herdado de Animal
rex.latir();   // próprio de Cachorro`}),e.jsx("h2",{children:"Object é pai de TUDO"}),e.jsxs("p",{children:["Toda classe em Java herda implicitamente de ",e.jsx("code",{children:"java.lang.Object"}),". Mesmo quando você escreve ",e.jsx("code",{children:"public class Pessoa "})," sem ",e.jsx("code",{children:"extends"})," nenhum, é como se tivesse escrito ",e.jsx("code",{children:"public class Pessoa extends Object "}),". Por isso todo objeto tem métodos como ",e.jsx("code",{children:"toString()"}),", ",e.jsx("code",{children:"equals()"}),", ",e.jsx("code",{children:"hashCode()"})," e ",e.jsx("code",{children:"getClass()"})," — vêm de ",e.jsx("code",{children:"Object"}),"."]}),e.jsx(o,{title:"Métodos herdados de Object",code:`public class Pessoa { }

public class Main {
    public static void main(String[] args) {
        Pessoa p = new Pessoa();
        System.out.println(p.toString());  // Pessoa@1540e19d
        System.out.println(p.getClass());  // class Pessoa
    }
}`}),e.jsx("h2",{children:"@Override: sobrescrevendo métodos"}),e.jsxs("p",{children:["Quando a versão herdada não serve, você reescreve na subclasse. Marcar com ",e.jsx("code",{children:"@Override"})," não é obrigatório, mas é fortemente recomendado: o compilador verifica se você realmente está sobrescrevendo algo. Se errar o nome ou os parâmetros, ele reclama."]}),e.jsx(o,{title:"Sobrescrevendo toString",code:`public class Pessoa {
    String nome;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Pessoa(nome=" + nome + ")";
    }
}

System.out.println(new Pessoa("Ana")); // Pessoa(nome=Ana)`}),e.jsxs(a,{type:"tip",title:"Use @Override sempre",children:["Sem a anotação, um pequeno typo (",e.jsx("code",{children:"tostring"})," em vez de ",e.jsx("code",{children:"toString"}),") cria um método novo em vez de sobrescrever. Bug silencioso e chato. Com ",e.jsx("code",{children:"@Override"}),", o compilador grita."]}),e.jsx("h2",{children:"super.metodo() — chamando a versão da pai"}),e.jsxs("p",{children:["Às vezes você quer estender o comportamento sem jogar fora o que a superclasse já fazia. Use ",e.jsx("code",{children:"super.nomeDoMetodo(...)"}),":"]}),e.jsx(o,{title:"super em método",code:`public class Animal {
    public void apresentar() {
        System.out.println("Sou um animal.");
    }
}

public class Cachorro extends Animal {
    @Override
    public void apresentar() {
        super.apresentar();
        System.out.println("Mais especificamente, um cachorro.");
    }
}

// Saída:
// Sou um animal.
// Mais especificamente, um cachorro.`}),e.jsx("h2",{children:"final na classe: ninguém herda"}),e.jsxs("p",{children:["Marcar uma classe com ",e.jsx("code",{children:"final"})," proíbe que ela seja estendida. Útil para classes de utilidade ou para garantir invariantes que herança poderia quebrar. O exemplo mais famoso é ",e.jsx("code",{children:"java.lang.String"})," — é ",e.jsx("code",{children:"final"}),' justamente para que ninguém crie uma "String maliciosa" alterando o comportamento esperado.']}),e.jsx(o,{title:"Classe final",code:`public final class Token {
    private final String valor;

    public Token(String valor) {
        this.valor = valor;
    }
}

// Tentar herdar dá erro de compilação:
// public class TokenEspecial extends Token { }  // ERRO`}),e.jsxs("p",{children:["Você também pode usar ",e.jsx("code",{children:"final"})," só no método (não na classe inteira) para impedir que aquele método específico seja sobrescrito."]}),e.jsx("h2",{children:"Composição vs herança: o debate eterno"}),e.jsxs("p",{children:['A regra prática: pergunte se a relação é "',e.jsx("strong",{children:"é-um"}),'" ou "',e.jsx("strong",{children:"tem-um"}),'". Se um ',e.jsx("code",{children:"Cachorro"}),' "é um" ',e.jsx("code",{children:"Animal"}),", herança faz sentido. Se um ",e.jsx("code",{children:"Carro"}),' "tem um" ',e.jsx("code",{children:"Motor"}),", use composição (campo do tipo ",e.jsx("code",{children:"Motor"})," dentro de ",e.jsx("code",{children:"Carro"}),")."]}),e.jsx(o,{title:"Composição",code:`public class Motor {
    public void ligar() {
        System.out.println("Motor ligado.");
    }
}

public class Carro {
    private Motor motor = new Motor(); // Carro TEM um Motor

    public void dirigir() {
        motor.ligar();
        System.out.println("Indo embora.");
    }
}`}),e.jsxs(a,{type:"warning",title:"Prefira composição",children:['Há uma máxima famosa de OOP: "favoreça composição sobre herança". Herança acopla fortemente — qualquer mudança na pai pode quebrar todas as filhas. Composição é mais flexível: você troca o ',e.jsx("code",{children:"Motor"})," sem mexer em ",e.jsx("code",{children:"Carro"}),'. Use herança quando há de fato uma relação "é-um" e você precisa de polimorfismo.']}),e.jsx("h2",{children:"Java só tem herança simples (de classes)"}),e.jsxs("p",{children:["Uma classe Java só pode estender ",e.jsx("strong",{children:"uma"})," outra classe. Nada de ",e.jsx("code",{children:"class Filho extends Pai1, Pai2"}),'. Isso evita o famoso "diamond problem" do C++ (qual versão herdar quando duas pais têm o mesmo método?).']}),e.jsxs("p",{children:["A boa notícia: você pode ",e.jsx("code",{children:"implements"})," várias ",e.jsx("strong",{children:"interfaces"}),' ao mesmo tempo. Interfaces resolvem o caso "preciso garantir que essa classe sabe nadar e voar" sem o problema de ambiguidade de implementação. Mais sobre isso na página de Interfaces.']}),e.jsx(o,{title:"Limites da herança",code:`public class Pessoa { }
public class Funcionario { }

// public class Gerente extends Pessoa, Funcionario { }  // ERRO

// Mas isto é OK:
public class Pato extends Animal implements Nadador, Voador { }`}),e.jsx("h2",{children:"Construtor não é herdado"}),e.jsxs("p",{children:["Lembre-se de uma coisa importante: construtores ",e.jsx("strong",{children:"não"})," são herdados. Cada classe declara os próprios. Se a pai exige parâmetros no construtor, a filha precisa chamar ",e.jsx("code",{children:"super(...)"})," com os argumentos corretos."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie a hierarquia ",e.jsx("code",{children:"Veiculo"})," → ",e.jsx("code",{children:"Carro"})," e ",e.jsx("code",{children:"Veiculo"})," → ",e.jsx("code",{children:"Moto"}),". ",e.jsx("code",{children:"Veiculo"})," tem campos comuns (",e.jsx("code",{children:"marca"}),", ",e.jsx("code",{children:"ano"}),") e método ",e.jsx("code",{children:"descrever()"}),". Sobrescreva ",e.jsx("code",{children:"descrever()"})," em cada filha usando ",e.jsx("code",{children:"@Override"})," e ",e.jsx("code",{children:"super.descrever()"}),"."]}),e.jsxs("li",{children:["Sobrescreva ",e.jsx("code",{children:"toString()"})," numa classe sua (qualquer uma) e veja a diferença ao passar um objeto para ",e.jsx("code",{children:"System.out.println"}),"."]}),e.jsxs("li",{children:["Modele um ",e.jsx("code",{children:"Computador"})," usando composição: ele ",e.jsx("em",{children:"tem um"})," ",e.jsx("code",{children:"Processador"}),", ",e.jsx("em",{children:"tem uma"})," ",e.jsx("code",{children:"MemoriaRAM"}),", ",e.jsx("em",{children:"tem um"})," ",e.jsx("code",{children:"Armazenamento"}),". Implemente um método ",e.jsx("code",{children:"ligar()"})," em ",e.jsx("code",{children:"Computador"})," que chama métodos das partes. Reflita: faria sentido ",e.jsx("code",{children:"Computador extends Processador"}),"? Não, né?"]})]})]})}export{d as default};
