import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function s(){return e.jsxs(r,{title:"Decorator",subtitle:"Adicionar comportamento sem modificar a classe — wrapping em camadas.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsx("p",{children:"Imagine modelar bebidas de uma cafeteria via herança:"}),e.jsx(o,{code:`Cafe
CafeComLeite
CafeComLeiteComChantilly
CafeComLeiteComChantillyComCanela
CafeComCanela
CafeSemAcucar
CafeSemAcucarComLeite
CafeSemAcucarComLeiteComCanela
// ... 32 classes pra cobrir todas as combinacoes`}),e.jsxs("p",{children:["Esse é o ",e.jsx("strong",{children:"problema da explosão combinatória de subclasses"}),". Cada novo modificador (sabor, ingrediente, opção) duplica a árvore."]}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Decorator"})," resolve ",e.jsx("em",{children:"compondo em runtime"}),': você tem uma bebida base e a "envolve" em decorators que adicionam comportamento.']}),e.jsx(o,{code:`Bebida b = new ComCanela(new ComLeite(new CafePuro()));
b.descricao();    // "Cafe puro + leite + canela"
b.preco();        // soma os precos`}),e.jsx("h2",{children:"Estrutura"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Componente"}),": interface comum (ex: ",e.jsx("code",{children:"Bebida"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ConcreteComponent"}),": implementação básica (ex: ",e.jsx("code",{children:"CafePuro"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Decorator"}),": classe abstrata que ",e.jsx("em",{children:"contém"})," outro ",e.jsx("code",{children:"Bebida"})," e implementa a mesma interface, delegando."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ConcreteDecorator"}),": cada acréscimo (",e.jsx("code",{children:"ComLeite"}),", ",e.jsx("code",{children:"ComCanela"}),")."]})]}),e.jsx("h2",{children:"Exemplo completo: bebidas"}),e.jsx(o,{title:"Bebida.java + base",code:`public interface Bebida {
    String descricao();
    double preco();
}

public class CafePuro implements Bebida {
    public String descricao() { return "cafe"; }
    public double preco() { return 5.0; }
}

public class ChaPreto implements Bebida {
    public String descricao() { return "cha preto"; }
    public double preco() { return 4.0; }
}`}),e.jsx(o,{title:"Decorator base + concretos",code:`public abstract class BebidaDecorator implements Bebida {
    protected final Bebida base;
    protected BebidaDecorator(Bebida b) { this.base = b; }
}

public class ComLeite extends BebidaDecorator {
    public ComLeite(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + leite"; }
    public double preco()     { return base.preco() + 2.0; }
}

public class ComCanela extends BebidaDecorator {
    public ComCanela(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + canela"; }
    public double preco()     { return base.preco() + 1.0; }
}

public class ComChantilly extends BebidaDecorator {
    public ComChantilly(Bebida b) { super(b); }
    public String descricao() { return base.descricao() + " + chantilly"; }
    public double preco()     { return base.preco() + 3.5; }
}`}),e.jsx(o,{title:"Uso",code:`Bebida pedido1 = new ComCanela(new ComLeite(new CafePuro()));
System.out.println(pedido1.descricao());   // cafe + leite + canela
System.out.println(pedido1.preco());       // 8.0

Bebida pedido2 = new ComChantilly(new ComChantilly(new ChaPreto()));
System.out.println(pedido2.descricao());   // cha preto + chantilly + chantilly
System.out.println(pedido2.preco());       // 11.0`}),e.jsxs("p",{children:["Note: ",e.jsx("em",{children:"nenhuma nova classe"})," precisou ser criada para combinar coisas. Combinação acontece em runtime."]}),e.jsx("h2",{children:"O exemplo gigante da JDK: java.io"}),e.jsx("p",{children:"Toda a hierarquia de streams é Decorator. Você empilha capacidades:"}),e.jsx(o,{code:`BufferedReader br = new BufferedReader(           // adiciona buffer
    new InputStreamReader(                       // bytes -> chars
        new FileInputStream("dados.txt")));      // bytes do arquivo

String linha = br.readLine();`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"FileInputStream"})," — fonte concreta de bytes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"InputStreamReader"})," — decorator que converte bytes em chars."]}),e.jsxs("li",{children:[e.jsx("code",{children:"BufferedReader"})," — decorator que adiciona buffer + ",e.jsx("code",{children:"readLine()"}),"."]})]}),e.jsxs("p",{children:["Se você quer comprimir a saída? Adiciona um ",e.jsx("code",{children:"GZIPOutputStream"})," em cima. Quer criptografar? ",e.jsx("code",{children:"CipherOutputStream"}),". Encadeia."]}),e.jsx(a,{type:"warning",title:"Cuidado com profundidade",children:"5 decorators aninhados ficam ilegíveis — e ninguém vai conseguir lembrar a ordem certa. Se ficar muito fundo, considere uma fábrica que monte a pilha pra você, ou repense o desenho."}),e.jsx("h2",{children:"Versão funcional: Function.andThen"}),e.jsxs("p",{children:['Pra "decoradores" simples (transformações de dados sem estado), você não precisa de classes. ',e.jsx("code",{children:"Function"})," tem ",e.jsx("code",{children:"andThen"})," e ",e.jsx("code",{children:"compose"}),":"]}),e.jsx(o,{code:`import java.util.function.Function;

Function<String, String> trim    = String::trim;
Function<String, String> upper   = String::toUpperCase;
Function<String, String> envolve = s -> "[" + s + "]";

Function<String, String> pipeline = trim.andThen(upper).andThen(envolve);

System.out.println(pipeline.apply("  ola  "));   // [OLA]`}),e.jsxs("p",{children:["Cada ",e.jsx("code",{children:"andThen"})," é um decorator funcional. Java 8+ tornou isso o jeito idiomático para transformação de dados; classes Decorator ficam para casos com estado ou interface rica."]}),e.jsx("h2",{children:"Decorator vs Herança"}),e.jsxs("p",{children:["Por que não ",e.jsx("code",{children:"class CafeComLeite extends Cafe"}),"? Porque herança é decidida em compile time. Composição (Decorator) é decidida em runtime — você pode envolver na ordem que quiser, quantas vezes quiser, condicional ao input do usuário."]}),e.jsxs(a,{type:"tip",title:"Decorator vs Proxy",children:["Ambos envolvem outro objeto. Diferença de intenção:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Decorator"})," adiciona comportamento."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Proxy"})," controla acesso (lazy load, cache, segurança, RMI)."]})]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Adicione ",e.jsx("code",{children:"SemAcucar"})," e ",e.jsx("code",{children:"ComMel"})," ao exemplo da bebida. Quantas classes novas? Compare com herança que precisaria de novas combinações."]}),e.jsxs("li",{children:["Implemente um ",e.jsx("code",{children:"TextoFormatador"})," com decorators",e.jsx("code",{children:" Negrito"}),", ",e.jsx("code",{children:"Italico"}),", ",e.jsx("code",{children:"Sublinhado"}),". Cada um envolve com tags HTML (",e.jsx("code",{children:"<b>...</b>"}),", etc)."]}),e.jsxs("li",{children:["Refaça o exercício 2 usando ",e.jsx("code",{children:"Function.andThen"}),". Compare. Em qual situação você prefere classe Decorator e em qual prefere função?"]})]})]})}export{s as default};
