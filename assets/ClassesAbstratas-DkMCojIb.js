import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(r,{title:"Classes Abstratas",subtitle:"Modelo parcialmente implementado — não dá pra instanciar diretamente.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine que você está modelando formas geométricas: círculo, quadrado, triângulo. Toda forma tem cor, posição e sabe calcular sua área — mas a fórmula da área é diferente em cada uma. Você quer obrigar quem criar uma nova forma a implementar",e.jsx("code",{children:"area()"}),", mas ainda assim aproveitar o código comum (cor, posição, métodos utilitários). Esse é o cenário perfeito pra uma ",e.jsx("strong",{children:"classe abstrata"}),"."]}),e.jsx("p",{children:'Pense numa classe abstrata como uma planta arquitetônica incompleta: ela define a estrutura geral, deixa alguns cômodos em branco e diz "quem for construir uma casa a partir de mim precisa decidir como serão esses cômodos". Você não consegue morar na planta — só nas casas concretas feitas a partir dela.'}),e.jsxs("h2",{children:["A palavra-chave ",e.jsx("code",{children:"abstract"})]}),e.jsxs("p",{children:["Você marca uma classe com ",e.jsx("code",{children:"abstract"}),' pra dizer ao compilador: "essa classe não pode ser instanciada com ',e.jsx("code",{children:"new"}),'; ela só serve como base". Dentro dela, métodos também podem ser ',e.jsx("code",{children:"abstract"})," — declarados sem corpo, deixando a implementação pras subclasses."]}),e.jsx(o,{title:"Forma.java — base abstrata",code:`public abstract class Forma {
    private String cor;

    public Forma(String cor) {
        this.cor = cor;
    }

    public String getCor() {
        return cor;
    }

    // Método concreto: já tem comportamento pronto
    public void descrever() {
        System.out.println("Sou uma forma " + cor + " com area " + area());
    }

    // Método abstrato: subclasse OBRIGADA a implementar
    public abstract double area();
}`}),e.jsx(a,{type:"info",title:"Resumo das regras",children:e.jsxs("ul",{children:[e.jsxs("li",{children:["Classe ",e.jsx("code",{children:"abstract"})," pode ter campos, construtores, métodos concretos e abstratos."]}),e.jsxs("li",{children:["Não dá pra fazer ",e.jsx("code",{children:'new Forma("azul")'})," — o compilador reclama."]}),e.jsxs("li",{children:["Se uma classe tem ao menos um método abstrato, ela ",e.jsx("strong",{children:"precisa"})," ser declarada abstract."]}),e.jsx("li",{children:"Subclasse concreta é obrigada a implementar TODOS os métodos abstratos herdados."})]})}),e.jsx("h2",{children:"Implementando a subclasse concreta"}),e.jsx(o,{title:"Circulo.java",code:`public class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }

    @Override
    public double area() {
        return Math.PI * raio * raio;
    }
}

// Em outro lugar:
// Forma f = new Circulo("vermelho", 2.0);
// f.descrever();  // usa código herdado + chama area() do Circulo`}),e.jsxs("p",{children:["Repare na elegância: ",e.jsx("code",{children:"descrever()"})," é definido uma vez na classe abstrata, mas internamente chama ",e.jsx("code",{children:"area()"})," — que cada subclasse implementa do seu jeito. Polimorfismo em ação."]}),e.jsx("h2",{children:"Quando preferir abstract sobre interface"}),e.jsx("p",{children:"Interfaces são contratos puros (em geral). Classes abstratas brilham quando você precisa de duas coisas que interface não dá tão bem:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Estado compartilhado"}),": campos com dados que toda subclasse vai usar (a cor da forma, o nome do animal, o ID da entidade)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Construtor com lógica"}),": validar parâmetros, inicializar recursos, registrar em algum lugar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Código comum não trivial"}),": vários métodos concretos que reusam estado interno."]})]}),e.jsx("p",{children:"Regra prática: se você se pega copiando o mesmo método em várias classes que implementam a mesma interface, talvez seja hora de virar uma classe abstrata (ou usar default methods, que veremos em Interfaces)."}),e.jsx("h2",{children:"Template Method: o padrão clássico"}),e.jsxs("p",{children:["Um dos usos mais bonitos: a classe abstrata define o ",e.jsx("strong",{children:"esqueleto"})," de um algoritmo num método ",e.jsx("code",{children:"final"}),", e deixa partes específicas como abstratas pras subclasses preencherem. Como um molde de bolo: a forma é fixa, o recheio você escolhe."]}),e.jsx(o,{title:"Template Method em ação",code:`public abstract class Relatorio {
    // Método final: define a ORDEM e ninguém pode mudar
    public final void gerar() {
        abrirArquivo();
        escreverCabecalho();
        escreverConteudo();   // varia por subclasse
        escreverRodape();
        fecharArquivo();
    }

    private void abrirArquivo()   { System.out.println("[abrindo]"); }
    private void fecharArquivo()  { System.out.println("[fechando]"); }
    protected void escreverCabecalho() { System.out.println("=== Relatório ==="); }
    protected void escreverRodape()    { System.out.println("--- fim ---"); }

    // Subclasse decide o miolo
    protected abstract void escreverConteudo();
}

public class RelatorioVendas extends Relatorio {
    @Override
    protected void escreverConteudo() {
        System.out.println("Vendas do mês: R$ 42.000,00");
    }
}`}),e.jsxs(a,{type:"tip",title:"Por que o método principal é final?",children:["Porque a graça do padrão é GARANTIR a ordem das etapas. Se a subclasse pudesse sobrescrever ",e.jsx("code",{children:"gerar()"}),", ela poderia esquecer de fechar o arquivo, ou chamar tudo fora de ordem. ",e.jsx("code",{children:"final"})," tranca a sequência."]}),e.jsx("h2",{children:"Exemplo real: AbstractList do JDK"}),e.jsxs("p",{children:["A classe ",e.jsx("code",{children:"java.util.AbstractList"})," é um caso de uso clássico que você já usa indiretamente. Ela implementa quase todos os métodos da interface ",e.jsx("code",{children:"List"}),"(",e.jsx("code",{children:"contains"}),", ",e.jsx("code",{children:"indexOf"}),", ",e.jsx("code",{children:"iterator"}),", ",e.jsx("code",{children:"equals"}),", ",e.jsx("code",{children:"hashCode"}),"...) e deixa só dois métodos abstratos:",e.jsx("code",{children:"get(int)"})," e ",e.jsx("code",{children:"size()"}),"."]}),e.jsxs("p",{children:["Quem quer criar uma ",e.jsx("code",{children:"List"})," custom estende ",e.jsx("code",{children:"AbstractList"}),", implementa os dois métodos e ganha tudo o resto de graça. É exatamente assim que muitas listas internas do JDK são feitas. Esse é o poder de uma boa classe abstrata: levantar 90% do trabalho pra você."]}),e.jsx(a,{type:"warning",title:"Cuidado com herança profunda",children:"Hierarquias de classes abstratas com 4, 5 níveis viram um pesadelo de manutenção. Prefira composição (objeto que contém outro objeto) sempre que possível. Use abstract de forma rasa e direta."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe abstrata ",e.jsx("code",{children:"Animal"})," com campo ",e.jsx("code",{children:"nome"}),", construtor, método concreto ",e.jsx("code",{children:"apresentar()"}),' (imprime "Sou o ',"{nome}"," e faço ","{som()}",'") e método abstrato ',e.jsx("code",{children:"som()"}),". Implemente ",e.jsx("code",{children:"Cachorro"})," e ",e.jsx("code",{children:"Gato"}),"."]}),e.jsxs("li",{children:["Use template method: crie ",e.jsx("code",{children:"BebidaQuente"})," abstrata com método final",e.jsx("code",{children:"preparar()"})," que chama ",e.jsx("code",{children:"ferverAgua()"})," (concreto), ",e.jsx("code",{children:"adicionarIngrediente()"})," (abstrato) e ",e.jsx("code",{children:"servir()"})," (concreto). Implemente ",e.jsx("code",{children:"Cafe"})," e ",e.jsx("code",{children:"Cha"}),"."]}),e.jsxs("li",{children:["Tente fazer ",e.jsx("code",{children:'new Animal("teste")'}),". Veja a mensagem do compilador. Depois tente NÃO implementar ",e.jsx("code",{children:"som()"})," em ",e.jsx("code",{children:"Cachorro"}),". Veja o que acontece. Ler o erro do compilador é parte do aprendizado."]})]})]})}export{t as default};
