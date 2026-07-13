import{j as e}from"./index-BpXci30S.js";import{P as i,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(i,{title:"Variáveis e Constantes",subtitle:"Declaração, escopo, final e a inferência com var.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Variáveis são onde seu programa guarda estado. Se você declarar tudo no lugar errado, com o tipo errado ou com nomes confusos, o código vira um labirinto onde você perde horas para entender de onde vem cada valor. Dominar declaração, escopo e a palavra ",e.jsx("code",{children:"final"})," é o atalho para escrever código que outras pessoas (e o você do futuro) conseguem ler."]}),e.jsx("h2",{children:"Declaração tradicional"}),e.jsx("p",{children:"A forma clássica de declarar uma variável em Java exige tipo e nome. A atribuição inicial é opcional, mas você só pode usar a variável depois de atribuir algum valor."}),e.jsx(o,{title:"Declarando variáveis",code:`public class Exemplo {
    public static void main(String[] args) {
        int idade = 30;
        String nome = "Ana";
        double saldo;
        saldo = 1500.75;

        System.out.println(nome + ", " + idade + " anos, R$ " + saldo);
    }
}`}),e.jsxs(a,{type:"note",title:"Java é estaticamente tipado",children:["Uma vez declarada como ",e.jsx("code",{children:"int"}),", a variável só guarda",e.jsx("code",{children:"int"})," até morrer. Tentar atribuir um ",e.jsx("code",{children:"String"}),"depois quebra a compilação. Isso é um recurso, não um problema — o compilador te avisa de erros antes do programa rodar."]}),e.jsx("h2",{children:'final: a "constante" do Java'}),e.jsxs("p",{children:["Uma variável marcada com ",e.jsx("code",{children:"final"})," só pode ser atribuída uma vez. Se você tentar mudar depois, o compilador reclama. Use",e.jsx("code",{children:"final"})," sempre que o valor não deveria mudar — isso documenta intenção e previne bugs."]}),e.jsx(o,{title:"final em variável local",code:`public class Pedido {
    public static void main(String[] args) {
        final double TAXA_ENTREGA = 9.90;
        double subtotal = 50.00;
        double total = subtotal + TAXA_ENTREGA;

        // TAXA_ENTREGA = 12.00; // erro de compilação

        System.out.println("Total: R$ " + total);
    }
}`}),e.jsx("h3",{children:"final em campo de instância vs static final"}),e.jsxs("p",{children:["Quando o ",e.jsx("code",{children:"final"})," está num campo de classe, há duas variações importantes:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"final"})," sem static: o valor é fixado por instância. Cada objeto criado pode ter um valor diferente, mas dentro daquele objeto ele nunca muda."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"static final"}),": é a constante de classe que existe uma vez só, compartilhada por tudo. É o equivalente Java a uma constante global."]})]}),e.jsx(o,{title:"Constantes de instância e de classe",code:`public class Circulo {
    public static final double PI = 3.14159265358979;
    private final double raio;

    public Circulo(double raio) {
        this.raio = raio;
    }

    public double area() {
        return PI * raio * raio;
    }
}`}),e.jsxs(a,{type:"tip",title:"final não congela objetos",children:[e.jsx("code",{children:"final List<String> lista = new ArrayList<>();"}),"impede você de reatribuir ",e.jsx("code",{children:"lista"}),", mas você ainda pode chamar",e.jsx("code",{children:"lista.add(...)"}),". ",e.jsx("code",{children:"final"})," congela a referência, não o conteúdo."]}),e.jsx("h2",{children:"Escopo: onde a variável vive"}),e.jsxs("p",{children:["Escopo é o pedaço do código onde uma variável existe. Em Java o escopo é delimitado por chaves ",e.jsx("code",{children:"{}"}),". Existem três níveis básicos:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Bloco"})," — variável declarada dentro de um ",e.jsx("code",{children:"if"}),",",e.jsx("code",{children:"for"})," ou bloco solto. Morre quando a chave fecha."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Método"})," — declarada dentro do método. Existe enquanto o método está executando. Também chamada de variável local."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Classe"})," — declarada fora de qualquer método (campo). Existe enquanto o objeto existe (instância) ou enquanto a classe está carregada (static)."]})]}),e.jsx(o,{title:"Escopos em camadas",code:`public class Escopo {
    private int campoDeInstancia = 10;        // escopo de classe

    public void mostrar() {
        int local = 5;                         // escopo de método

        if (local > 0) {
            int dentroDoIf = 99;               // escopo de bloco
            System.out.println(dentroDoIf);
        }

        // System.out.println(dentroDoIf);     // não compila

        System.out.println(local + campoDeInstancia);
    }
}`}),e.jsx("h2",{children:"var: inferência de tipo (Java 10+)"}),e.jsxs("p",{children:["Desde Java 10 você pode usar ",e.jsx("code",{children:"var"})," em variáveis locais para deixar o compilador deduzir o tipo a partir do valor inicial. Menos repetição, mesmo nível de segurança."]}),e.jsx(o,{title:"var na prática",code:`import java.util.ArrayList;
import java.util.List;

public class Inferencia {
    public static void main(String[] args) {
        var nome = "Carlos";              // String
        var idade = 25;                   // int
        var preco = 19.90;                // double
        var nomes = new ArrayList<String>(); // ArrayList<String>

        nomes.add("Ana");
        nomes.add("Bia");

        System.out.println(nome + " - " + idade + " - " + preco);
        System.out.println(nomes);
    }
}`}),e.jsx("h3",{children:"Onde var NÃO pode aparecer"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Em campos de classe (só local)."}),e.jsx("li",{children:"Em parâmetros de método."}),e.jsx("li",{children:"Em retorno de método."}),e.jsxs("li",{children:["Em variável sem inicialização: ",e.jsx("code",{children:"var x;"})," não compila."]}),e.jsxs("li",{children:["Inicializando com ",e.jsx("code",{children:"null"}),": o compilador não tem como inferir."]})]}),e.jsxs(a,{type:"warning",title:"var NÃO é tipagem dinâmica",children:["Diferente de Python ou JavaScript, o tipo é decidido em tempo de compilação e fica fixo. ",e.jsx("code",{children:"var x = 10;"})," é exatamente",e.jsx("code",{children:"int x = 10;"}),". Tentar fazer ",e.jsx("code",{children:'x = "texto";'})," depois quebra a build."]}),e.jsx("h2",{children:"Convenções de nomes"}),e.jsx("p",{children:"O ecossistema Java segue convenções rígidas. Seguir é importante porque ferramentas, IDEs e revisores de código esperam esse padrão."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"camelCase"})," para variáveis e métodos:",e.jsx("code",{children:"nomeCompleto"}),", ",e.jsx("code",{children:"calcularTotal"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"UPPER_SNAKE_CASE"})," para constantes (",e.jsx("code",{children:"static final"}),"):",e.jsx("code",{children:"TAXA_ENTREGA"}),", ",e.jsx("code",{children:"MAX_TENTATIVAS"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PascalCase"})," para classes: ",e.jsx("code",{children:"ClienteController"}),"."]}),e.jsx("li",{children:"Nada de acentos, espaços ou hifens em identificadores."}),e.jsxs("li",{children:["Não comece com número. Cifrão ",e.jsx("code",{children:"$"})," e underscore ",e.jsx("code",{children:"_"})," são permitidos, mas evite."]})]}),e.jsx("h2",{children:"Shadowing: o nome que esconde outro"}),e.jsx("p",{children:'Acontece quando uma variável de escopo interno tem o mesmo nome de uma de escopo externo. A interna "ofusca" a externa enquanto está viva.'}),e.jsx(o,{title:"Shadowing entre campo e parâmetro",code:`public class Pessoa {
    private String nome;

    public Pessoa(String nome) {
        // o parâmetro "nome" sombreia o campo "nome"
        this.nome = nome;
    }

    public void apresentar() {
        String nome = "Convidado"; // sombreia o campo
        System.out.println(nome);          // imprime Convidado
        System.out.println(this.nome);     // imprime o do campo
    }
}`}),e.jsxs(a,{type:"tip",title:"Quando shadowing é útil",children:["O caso clássico é o construtor: o parâmetro tem o mesmo nome do campo para deixar a API clara, e você usa ",e.jsx("code",{children:"this.campo = parametro"}),"para distinguir. Fora isso, evite — fonte comum de bugs."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Configuracoes"})," com três constantes",e.jsx("code",{children:"static final"}),": ",e.jsx("code",{children:"VERSAO"})," (String),",e.jsx("code",{children:"MAX_USUARIOS"})," (int) e ",e.jsx("code",{children:"PI"})," (double). Imprima todas no ",e.jsx("code",{children:"main"}),"."]}),e.jsxs("li",{children:["Reescreva o trecho abaixo usando ",e.jsx("code",{children:"var"})," onde for possível e explique em comentário por que algumas declarações ficaram inalteradas:",e.jsx("br",{}),e.jsx("code",{children:'String s = "abc"; int n = 3; double d = 1.5;'})]}),e.jsxs("li",{children:["Escreva um método ",e.jsx("code",{children:"void"})," que declare uma variável",e.jsx("code",{children:"contador"})," dentro de um ",e.jsx("code",{children:"if"})," e tente usá-la depois do bloco. Observe o erro do compilador, depois mova a declaração para fora e veja o programa compilar."]})]})]})}export{d as default};
