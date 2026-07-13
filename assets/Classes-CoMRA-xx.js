import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(s,{title:"Classes & Objetos",subtitle:"O alicerce da orientação a objetos — definir tipos próprios.",difficulty:"iniciante",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine modelar um sistema de banco usando só ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"String"})," e arrays. Você teria três arrays paralelos para nome, saldo e CPF, e qualquer descuido misturaria o saldo do João com o CPF da Maria. ",e.jsx("strong",{children:"Classes"})," resolvem isso: elas deixam você criar um tipo novo (",e.jsx("em",{children:"Conta"}),", ",e.jsx("em",{children:"Cliente"}),", ",e.jsx("em",{children:"Pedido"}),") que junta dados e comportamento num pacote só. É a forma como Java organiza praticamente tudo — desde ",e.jsx("code",{children:"String"})," até frameworks inteiros."]}),e.jsx("h2",{children:"A analogia da planta da casa"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"classe"})," é a planta arquitetônica: descreve o que a coisa tem (paredes, portas) e o que ela faz (abrir porta, acender luz). Um ",e.jsx("strong",{children:"objeto"})," é a casa construída a partir dessa planta. Você desenha a planta uma vez, e constrói quantas casas quiser — cada uma com suas próprias paredes, mas todas seguindo o mesmo molde."]}),e.jsx("h2",{children:"Definindo sua primeira classe"}),e.jsxs("p",{children:["Uma classe tem dois ingredientes principais: ",e.jsx("strong",{children:"campos"})," (o estado, os dados que ela guarda) e ",e.jsx("strong",{children:"métodos"})," (o comportamento, o que ela sabe fazer)."]}),e.jsx(a,{title:"Pessoa.java",code:`public class Pessoa {
    String nome;
    int idade;

    void apresentar() {
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}`}),e.jsxs("p",{children:["Aqui ",e.jsx("code",{children:"nome"})," e ",e.jsx("code",{children:"idade"})," são campos. ",e.jsx("code",{children:"apresentar()"})," é um método. Sozinha, essa classe não faz nada — você precisa criar um objeto a partir dela."]}),e.jsx("h2",{children:"Criando objetos com new"}),e.jsxs("p",{children:["A palavra-chave ",e.jsx("code",{children:"new"})," aloca memória para uma nova instância e devolve uma referência para ela. Você guarda essa referência numa variável."]}),e.jsx(a,{title:"Main.java",code:`public class Main {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa();
        p1.nome = "Ana";
        p1.idade = 30;
        p1.apresentar();

        Pessoa p2 = new Pessoa();
        p2.nome = "Bruno";
        p2.idade = 25;
        p2.apresentar();
    }
}`}),e.jsxs("p",{children:["Cada ",e.jsx("code",{children:"new Pessoa()"})," cria um objeto independente. Mexer em ",e.jsx("code",{children:"p1.nome"})," não afeta ",e.jsx("code",{children:"p2.nome"}),". São casas diferentes, construídas pela mesma planta."]}),e.jsx("h2",{children:"O this referenciando a instância atual"}),e.jsxs("p",{children:["Dentro de um método de instância, ",e.jsx("code",{children:"this"})," aponta para o objeto que está executando o método. É útil quando o nome de um parâmetro colide com o nome de um campo:"]}),e.jsx(a,{title:"Carro.java",code:`public class Carro {
    String modelo;
    int ano;

    void configurar(String modelo, int ano) {
        this.modelo = modelo;
        this.ano = ano;
    }
}`}),e.jsxs("p",{children:["Sem o ",e.jsx("code",{children:"this"}),", ",e.jsx("code",{children:"modelo = modelo"})," só atribuiria o parâmetro a ele mesmo (e o campo continuaria ",e.jsx("code",{children:"null"}),"). O ",e.jsx("code",{children:"this.modelo"}),' deixa claro: "o campo desta instância recebe o valor do parâmetro".']}),e.jsxs(o,{type:"tip",title:"Você não precisa do this o tempo todo",children:["Quando não há ambiguidade, pode escrever só ",e.jsx("code",{children:"modelo"})," dentro do método. O compilador entende que é o campo. Mas usar ",e.jsx("code",{children:"this"})," sempre também é válido e deixa o código mais explícito."]}),e.jsx("h2",{children:"Uma classe pública por arquivo"}),e.jsxs("p",{children:["Regra do compilador Java: cada arquivo ",e.jsx("code",{children:".java"})," pode ter ",e.jsxs("strong",{children:["no máximo uma classe declarada como ",e.jsx("code",{children:"public"})]}),", e o nome do arquivo precisa bater com o nome dessa classe. Se sua classe ",e.jsx("code",{children:"public"})," chama ",e.jsx("code",{children:"Pessoa"}),", o arquivo precisa se chamar ",e.jsx("code",{children:"Pessoa.java"}),". Você pode ter outras classes auxiliares no mesmo arquivo, desde que não sejam ",e.jsx("code",{children:"public"}),"."]}),e.jsx(a,{title:"Pessoa.java (com classe auxiliar)",code:`public class Pessoa {
    String nome;
}

class Endereco {
    String rua;
    String cidade;
}`}),e.jsx("h2",{children:"Igualdade vs identidade"}),e.jsxs("p",{children:["Esse é o pega-ratão clássico de quem vem de Python ou JavaScript. Em Java, o operador ",e.jsx("code",{children:"=="})," aplicado a objetos compara ",e.jsx("strong",{children:"referências"}),' — ou seja, pergunta "são literalmente o mesmo objeto na memória?". Já ',e.jsx("code",{children:".equals()"})," compara ",e.jsx("strong",{children:"conteúdo"}),' — "esses dois objetos têm os mesmos dados?".']}),e.jsx(a,{title:"IgualdadeVsIdentidade.java",code:`public class IgualdadeVsIdentidade {
    public static void main(String[] args) {
        String a = new String("oi");
        String b = new String("oi");

        System.out.println(a == b);        // false — referências diferentes
        System.out.println(a.equals(b));   // true  — mesmo conteúdo

        String c = a;
        System.out.println(a == c);        // true  — mesma referência
    }
}`}),e.jsxs(o,{type:"warning",title:"Erro de iniciante",children:["Comparar Strings com ",e.jsx("code",{children:"=="})," funciona ",e.jsx("em",{children:"às vezes"})," por causa de uma otimização chamada ",e.jsx("em",{children:"string pool"}),", mas é frágil. ",e.jsxs("strong",{children:["Sempre use ",e.jsx("code",{children:".equals()"})]})," para comparar conteúdo de objetos."]}),e.jsx("h2",{children:"Métodos retornam coisas (ou não)"}),e.jsxs("p",{children:["Quando um método tem algo a devolver, declare o tipo de retorno antes do nome. Se ele só executa uma ação, use ",e.jsx("code",{children:"void"}),"."]}),e.jsx(a,{title:"Calculadora.java",code:`public class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }

    void imprimirSoma(int a, int b) {
        System.out.println(a + b);
    }
}`}),e.jsx("h2",{children:"Referências, não cópias"}),e.jsxs("p",{children:["Quando você atribui um objeto a outra variável (",e.jsx("code",{children:"Pessoa p2 = p1;"}),"), você copia a ",e.jsx("strong",{children:"referência"}),", não o objeto. As duas variáveis apontam para a mesma casa. Mexer numa, mexe na outra. Isso vai aparecer muito no seu código — e em bugs sutis."]}),e.jsx(a,{title:"Referencia.java",code:`Pessoa p1 = new Pessoa();
p1.nome = "Ana";

Pessoa p2 = p1;
p2.nome = "Beatriz";

System.out.println(p1.nome); // Beatriz`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Livro"})," com campos ",e.jsx("code",{children:"titulo"}),", ",e.jsx("code",{children:"autor"})," e ",e.jsx("code",{children:"paginas"}),", e um método ",e.jsx("code",{children:"resumo()"})," que imprime tudo formatado. Instancie 3 livros e chame o método em cada."]}),e.jsxs("li",{children:["Adicione um método ",e.jsx("code",{children:"configurar(String titulo, String autor, int paginas)"})," em ",e.jsx("code",{children:"Livro"})," usando ",e.jsx("code",{children:"this"})," para resolver a ambiguidade. Use-o em vez de atribuir campo por campo."]}),e.jsxs("li",{children:["Crie duas ",e.jsx("code",{children:"String"})," com o mesmo conteúdo (uma com ",e.jsx("code",{children:'new String("a")'})," e outra também). Compare com ",e.jsx("code",{children:"=="})," e com ",e.jsx("code",{children:".equals()"}),". Em seguida atribua uma à outra e compare de novo. Explique o resultado para você mesmo, em voz alta — isso fixa."]})]})]})}export{n as default};
