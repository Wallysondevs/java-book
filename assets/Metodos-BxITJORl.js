import{j as e}from"./index-BpXci30S.js";import{P as a,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(a,{title:"Métodos",subtitle:"Modular código com parâmetros, retorno, sobrecarga e varargs.",difficulty:"iniciante",timeToRead:"18 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Método é uma receita: você dá um nome, lista os ingredientes (parâmetros) e descreve o que sai no final (retorno). Sem método, todo programa vira um ",e.jsx("code",{children:"main"})," gigante, impossível de testar e de reaproveitar. Cada vez que você se pega copiando 5 linhas pra outro lugar, é sinal de que ali deveria ter um método."]}),e.jsx("p",{children:"Em Java, todo método mora dentro de uma classe — não existe função solta como em Python ou JavaScript."}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsx("p",{children:"Anatomia de um método:"}),e.jsx(o,{title:"Estrutura",code:`// modificadores | tipo de retorno | nome | (parâmetros) { corpo }
public static int somar(int a, int b) {
    return a + b;
}`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"public"}),": visibilidade (quem pode chamar)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"static"}),": pertence à classe, não à instância (já vamos detalhar)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"int"}),": tipo do valor que devolve."]}),e.jsxs("li",{children:[e.jsx("code",{children:"somar"}),": nome — convenção camelCase, verbo de preferência."]}),e.jsxs("li",{children:[e.jsx("code",{children:"(int a, int b)"}),": parâmetros (tipo + nome)."]})]}),e.jsx(o,{title:"Programa completo",code:`public class Calc {
    public static int somar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int r = somar(3, 4);
        System.out.println(r);  // 7
    }
}`}),e.jsx("h2",{children:"void: método sem retorno"}),e.jsxs("p",{children:["Quando o método só faz alguma coisa e não devolve valor, o tipo de retorno é ",e.jsx("code",{children:"void"}),". Você pode usar ",e.jsx("code",{children:"return;"})," sem valor pra sair antes."]}),e.jsx(o,{code:`public static void cumprimentar(String nome) {
    if (nome == null) return;  // sai cedo
    System.out.println("Olá, " + nome + "!");
}`}),e.jsx("h2",{children:"return: sair com um valor"}),e.jsxs("p",{children:["Em métodos que não são ",e.jsx("code",{children:"void"}),", todo caminho de execução precisa devolver um valor — senão, erro de compilação."]}),e.jsx(o,{code:`public static String classificar(int idade) {
    if (idade < 12) return "criança";
    if (idade < 18) return "adolescente";
    return "adulto";
}`}),e.jsx("h2",{children:"Sobrecarga (overloading)"}),e.jsxs("p",{children:["Você pode ter ",e.jsx("strong",{children:"vários métodos com o mesmo nome"})," desde que a lista de parâmetros seja diferente (quantidade ou tipos). O compilador escolhe qual chamar baseado nos argumentos. ",e.jsx("strong",{children:"Apenas o tipo de retorno não conta"})," pra diferenciar."]}),e.jsx(o,{title:"Sobrecarga de imprimir",code:`public class Imprimir {
    public static void mostrar(int x) {
        System.out.println("inteiro: " + x);
    }

    public static void mostrar(double x) {
        System.out.println("decimal: " + x);
    }

    public static void mostrar(String x) {
        System.out.println("texto: " + x);
    }

    public static void main(String[] args) {
        mostrar(10);       // inteiro: 10
        mostrar(3.14);     // decimal: 3.14
        mostrar("oi");     // texto: oi
    }
}`}),e.jsxs(r,{type:"tip",title:"Quando vale a pena sobrecarregar",children:["Use sobrecarga quando os métodos fazem ",e.jsx("em",{children:"conceitualmente a mesma coisa"})," com tipos diferentes. Se a lógica diverge muito, dê nomes distintos — fica mais claro."]}),e.jsx("h2",{children:"Varargs: número variável de argumentos"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"Tipo... nome"})," pra aceitar zero ou mais argumentos do mesmo tipo. Por dentro é um array. Só pode haver um varargs e ele tem que ser o último parâmetro."]}),e.jsx(o,{code:`public static int somarTodos(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}

public static void main(String[] args) {
    System.out.println(somarTodos());           // 0
    System.out.println(somarTodos(1, 2, 3));    // 6
    System.out.println(somarTodos(10, 20));     // 30

    int[] arr = {1, 2, 3, 4};
    System.out.println(somarTodos(arr));        // 10 — pode passar array
}`}),e.jsx("h2",{children:"Passagem por valor (com pegadinha de referência)"}),e.jsxs("p",{children:["Java passa parâmetros ",e.jsx("strong",{children:"sempre por valor"}),". Pra primitivos, o método recebe uma cópia — alterar dentro não muda fora."]}),e.jsx(o,{title:"Primitivo: cópia",code:`public static void dobrar(int x) {
    x = x * 2;
}

public static void main(String[] args) {
    int n = 5;
    dobrar(n);
    System.out.println(n);  // ainda 5
}`}),e.jsxs("p",{children:['Pra objetos, a "cópia" é da ',e.jsx("strong",{children:"referência"}),", não do objeto em si. Então o método pode ",e.jsx("em",{children:"modificar o estado"})," do objeto apontado, mas não pode trocar a referência externa."]}),e.jsx(o,{title:"Objeto: estado pode mudar",code:`import java.util.ArrayList;
import java.util.List;

public static void adicionar(List<String> lista, String item) {
    lista.add(item);   // modifica o objeto original
}

public static void trocar(List<String> lista) {
    lista = new ArrayList<>();  // só altera a referência LOCAL
    lista.add("novo");
}

public static void main(String[] args) {
    List<String> nomes = new ArrayList<>();
    adicionar(nomes, "Ana");
    System.out.println(nomes);  // [Ana]

    trocar(nomes);
    System.out.println(nomes);  // [Ana] — não mudou!
}`}),e.jsxs(r,{type:"note",title:"Resumindo",children:["Java é sempre ",e.jsx("em",{children:"pass-by-value"}),'. O que confunde é que o "valor" de uma variável de objeto é a referência (endereço). Você modifica o objeto, mas não troca quem a variável externa aponta.']}),e.jsx("h2",{children:"static vs instância"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Método static"})," pertence à classe. Você chama com ",e.jsx("code",{children:"NomeDaClasse.metodo(...)"}),", sem precisar criar objeto. Use pra utilitários puros (recebe entrada, devolve saída, sem estado)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Método de instância"})," precisa de um objeto criado com ",e.jsx("code",{children:"new"}),". Acessa os campos daquele objeto (",e.jsx("code",{children:"this.algo"}),"). Use quando o comportamento depende do estado do objeto."]}),e.jsx(o,{code:`public class Contador {
    private int valor = 0;

    public void incrementar() {       // de instância — mexe em this.valor
        this.valor++;
    }

    public int getValor() {
        return this.valor;
    }

    public static int dobro(int x) {  // static — não depende de instância
        return x * 2;
    }

    public static void main(String[] args) {
        Contador c = new Contador();
        c.incrementar();
        c.incrementar();
        System.out.println(c.getValor());      // 2

        System.out.println(Contador.dobro(5)); // 10 — sem criar objeto
    }
}`}),e.jsx("h2",{children:"Métodos privados (encapsulamento)"}),e.jsxs("p",{children:["Marque com ",e.jsx("code",{children:"private"})," tudo que é detalhe interno. Quem usa sua classe só vê o que é ",e.jsx("code",{children:"public"}),". Isso te dá liberdade pra mudar a implementação sem quebrar quem depende de você."]}),e.jsx(o,{code:`public class Senha {
    public boolean valida(String s) {
        return temTamanhoMinimo(s) && temNumero(s);
    }

    private boolean temTamanhoMinimo(String s) {
        return s != null && s.length() >= 8;
    }

    private boolean temNumero(String s) {
        return s.matches(".*\\\\d.*");
    }
}`}),e.jsx("h2",{children:"Recursão: o método que chama a si mesmo"}),e.jsx("p",{children:"Recursão é quando um método chama a si próprio com um problema menor, até chegar num caso base que devolve direto. O exemplo clássico é fatorial:"}),e.jsx(o,{title:"Fatorial recursivo",code:`public class Fatorial {
    public static long fat(int n) {
        if (n <= 1) return 1;       // caso base
        return n * fat(n - 1);      // passo recursivo
    }

    public static void main(String[] args) {
        System.out.println(fat(5));   // 120
        System.out.println(fat(10));  // 3628800
    }
}`}),e.jsxs(r,{type:"warning",title:"Cuidado com a pilha",children:["Toda chamada recursiva ocupa um quadro na pilha. Recursão profunda demais estoura ",e.jsx("code",{children:"StackOverflowError"}),". Pra cálculos grandes (Fibonacci de 100, por exemplo), prefira versão iterativa ou memoização."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um método ",e.jsx("code",{children:"static int max(int a, int b)"})," que devolve o maior. Sobrecarregue pra também aceitar ",e.jsx("code",{children:"(int a, int b, int c)"}),"."]}),e.jsxs("li",{children:["Escreva ",e.jsx("code",{children:"static double media(double... valores)"})," usando varargs. Trate o caso de array vazio devolvendo ",e.jsx("code",{children:"0"}),"."]}),e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"static int fibonacci(int n)"})," em duas versões: recursiva e iterativa. Compare o tempo (use ",e.jsx("code",{children:"System.nanoTime()"}),") pra ",e.jsx("code",{children:"n = 35"}),"."]})]})]})}export{n as default};
