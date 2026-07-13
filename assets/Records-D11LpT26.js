import{j as e}from"./index-BpXci30S.js";import{P as s,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(s,{title:"Records (Java 14+)",subtitle:"Adeus boilerplate de POJOs — record gera getters, equals, hashCode, toString.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Quantas vezes você já escreveu uma classe só pra carregar dados — tipo um",e.jsx("code",{children:"Ponto(x, y)"})," ou um ",e.jsx("code",{children:"Usuario(nome, email)"})," — e teve que digitar (ou pedir pra IDE gerar) construtor, getters, ",e.jsx("code",{children:"equals"}),",",e.jsx("code",{children:"hashCode"})," e ",e.jsx("code",{children:"toString"}),"? Trinta linhas pra modelar duas propriedades. Cansativo, repetitivo, fácil de errar."]}),e.jsx("p",{children:"Records resolvem isso. Você declara o que importa (os campos), e o compilador gera todo o resto. Pense num record como um formulário pré-impresso: você só preenche os campos, a estrutura já vem pronta."}),e.jsx("h2",{children:"Sintaxe"}),e.jsx(o,{title:"Antes vs depois",code:`// Antes: classe tradicional (~30 linhas)
public final class Ponto {
    private final int x;
    private final int y;
    public Ponto(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    // ... equals, hashCode, toString manuais
}

// Depois: record (1 linha!)
public record Ponto(int x, int y) {}`}),e.jsxs("p",{children:["A linha ",e.jsx("code",{children:"public record Ponto(int x, int y) "})," entrega tudo o que a versão grande tinha. E mais: vem com semântica de igualdade por valor de graça."]}),e.jsx("h2",{children:"O que o compilador gera por você"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Construtor canônico"}),": ",e.jsx("code",{children:"new Ponto(3, 4)"})," funciona."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acessores"}),": ",e.jsx("code",{children:"ponto.x()"})," e ",e.jsx("code",{children:"ponto.y()"})," (atenção: sem ",e.jsx("code",{children:"get"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"equals e hashCode"}),": dois records com os mesmos componentes são iguais."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"toString"}),": imprime ",e.jsx("code",{children:"Ponto[x=3, y=4]"})," automaticamente."]}),e.jsxs("li",{children:["A classe é ",e.jsx("code",{children:"final"})," implicitamente — ninguém estende."]}),e.jsxs("li",{children:["Os componentes são ",e.jsx("code",{children:"private final"})," — record é imutável por design."]})]}),e.jsx(o,{title:"Usando o record",code:`Ponto a = new Ponto(3, 4);
Ponto b = new Ponto(3, 4);

System.out.println(a);          // Ponto[x=3, y=4]
System.out.println(a.x());      // 3
System.out.println(a.equals(b));// true
System.out.println(a.hashCode() == b.hashCode()); // true`}),e.jsxs(r,{type:"info",title:"Imutabilidade não é negociável",children:["Você não consegue mudar o ",e.jsx("code",{children:"x"})," de um ",e.jsx("code",{children:"Ponto"}),' depois de criado. Pra "alterar", você cria um novo: ',e.jsx("code",{children:"new Ponto(a.x() + 1, a.y())"}),". Isso evita uma categoria inteira de bugs (mutação compartilhada)."]}),e.jsx("h2",{children:"Construtor compacto: validação sem repetição"}),e.jsxs("p",{children:["E se você quiser validar os parâmetros antes de criar o objeto? Records têm uma forma especial de construtor — o ",e.jsx("strong",{children:"compacto"})," — que roda antes da atribuição automática. Você não escreve a lista de parâmetros nem as atribuições."]}),e.jsx(o,{title:"Validação no construtor compacto",code:`public record Idade(int anos) {
    public Idade {
        if (anos < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa");
        }
        if (anos > 150) {
            throw new IllegalArgumentException("Idade improvável");
        }
        // Não precisa do this.anos = anos; o compilador faz por você
    }
}

// new Idade(-5)  →  IllegalArgumentException`}),e.jsxs("p",{children:["Você também pode normalizar valores aqui (ex: ",e.jsx("code",{children:"nome = nome.trim()"}),") antes deles serem atribuídos aos campos."]}),e.jsx("h2",{children:"Records implementam, mas não estendem"}),e.jsxs("p",{children:["Records já estendem ",e.jsx("code",{children:"java.lang.Record"})," internamente, então não dá pra herdar de outra classe. Mas eles podem implementar quantas interfaces quiser:"]}),e.jsx(o,{title:"Record implementando interface",code:`public interface Identificavel {
    String id();
}

public record Produto(String id, String nome, double preco)
        implements Identificavel {
    // O acessor id() já implementa o método da interface!
}`}),e.jsxs("p",{children:["Repare na sacada: o método ",e.jsx("code",{children:"id()"})," exigido pela interface é satisfeito automaticamente pelo acessor gerado. Zero código extra."]}),e.jsx("h2",{children:"Métodos extras e estáticos"}),e.jsx("p",{children:"Você pode adicionar métodos comuns ou estáticos no corpo do record — só não pode adicionar campos de instância (eles têm que vir da assinatura do record)."}),e.jsx(o,{title:"Métodos auxiliares",code:`public record Ponto(int x, int y) {
    public double distanciaDaOrigem() {
        return Math.sqrt(x * x + y * y);
    }

    public static Ponto origem() {
        return new Ponto(0, 0);
    }
}

// Ponto.origem().distanciaDaOrigem()  →  0.0`}),e.jsx("h2",{children:"Quando usar record vs classe tradicional"}),e.jsxs("p",{children:["Use ",e.jsx("strong",{children:"record"})," quando o objeto é essencialmente um agregado de dados imutável: DTOs de API, eventos, coordenadas, valores monetários, chaves compostas para mapas."]}),e.jsxs("p",{children:["Use ",e.jsx("strong",{children:"classe tradicional"})," quando você precisa de mutabilidade, herança, ou a identidade do objeto importa mais que seus valores (dois usuários diferentes com o mesmo nome NÃO são iguais — use classe)."]}),e.jsx("h2",{children:"Pattern matching com records (Java 21)"}),e.jsxs("p",{children:["Records combinam lindamente com pattern matching no ",e.jsx("code",{children:"switch"}),": você consegue desestruturar os componentes diretamente no ",e.jsx("code",{children:"case"}),"."]}),e.jsx(o,{title:"Desestruturação em switch",code:`sealed interface Forma permits Circulo, Retangulo {}
record Circulo(double raio) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}

public static double area(Forma f) {
    return switch (f) {
        case Circulo(double r)            -> Math.PI * r * r;
        case Retangulo(double l, double a) -> l * a;
    };
}`}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"f.raio()"})," ou ",e.jsx("code",{children:"f.largura()"}),", você puxa direto os componentes pra variáveis locais. Código limpo e expressivo."]}),e.jsxs(r,{type:"warning",title:"Records são valor, não identidade",children:["Se você usa um ",e.jsx("code",{children:"HashMap"})," com record como chave, lembre que dois records iguais (mesmos componentes) viram a MESMA chave. Isso geralmente é o que você quer — mas não use record pra coisas que precisam de identidade única (use uma classe com UUID, por exemplo)."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um record ",e.jsx("code",{children:"Email(String endereco)"})," com construtor compacto que valida se o endereço contém ",e.jsx("code",{children:"@"}),". Crie alguns emails válidos e tente criar um inválido."]}),e.jsxs("li",{children:["Modele um ",e.jsx("code",{children:"Livro(String titulo, String autor, int paginas)"}),". Adicione um método ",e.jsx("code",{children:"resumo()"})," que retorne uma ",e.jsx("code",{children:"String"}),"formatada. Compare dois livros iguais com ",e.jsx("code",{children:"equals"}),"."]}),e.jsxs("li",{children:["Crie um sealed interface ",e.jsx("code",{children:"Pagamento"})," e dois records que o implementam:",e.jsx("code",{children:"Dinheiro(double valor)"})," e ",e.jsx("code",{children:"Cartao(double valor, String bandeira)"}),". Escreva uma função que recebe ",e.jsx("code",{children:"Pagamento"})," e usa pattern matching pra imprimir uma mensagem diferente em cada caso."]})]})]})}export{d as default};
