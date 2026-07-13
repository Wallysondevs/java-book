import{j as e}from"./index-BpXci30S.js";import{P as i,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(i,{title:"SOLID em Java",subtitle:"Os 5 princípios que evitam código que ninguém quer manter.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:['Você já abriu uma classe de 2.000 linhas que faz dez coisas e ninguém ousa mexer? Esse cheiro de "se eu mudar aqui, quebra três telas" é exatamente o que SOLID combate. São cinco princípios criados pelo Robert C. Martin que orientam ',e.jsx("em",{children:"onde colocar a responsabilidade"})," no seu código orientado a objetos."]}),e.jsx("p",{children:"Pense como uma cozinha profissional: o churrasqueiro não lava prato, o lavador de prato não corta cebola, e cada um sabe trocar o seu colega sem o restaurante parar. SOLID é isso aplicado a classes."}),e.jsx("h2",{children:"S — Single Responsibility Principle"}),e.jsxs("p",{children:["Uma classe deve ter ",e.jsx("strong",{children:"um único motivo para mudar"}),". Se a regra de cálculo de imposto muda, só a classe de imposto deveria ser tocada. Se o formato do relatório muda, só a classe de relatório."]}),e.jsx(a,{title:"Ruim — uma classe, três motivos para mudar",code:`class Funcionario {
    String nome;
    double salario;

    double calcularImposto() { /* regra fiscal muda */ }
    void salvarNoBanco() { /* schema muda */ }
    String gerarRelatorioPdf() { /* layout muda */ }
}`}),e.jsx(a,{title:"Melhor — cada motivo na sua classe",code:`record Funcionario(String nome, double salario) {}

class CalculadoraImposto {
    double calcular(Funcionario f) { return f.salario() * 0.275; }
}

class FuncionarioRepository {
    void salvar(Funcionario f) { /* JDBC/JPA */ }
}

class FuncionarioRelatorioPdf {
    byte[] gerar(Funcionario f) { /* iText */ return new byte[0]; }
}`}),e.jsx("h2",{children:"O — Open/Closed Principle"}),e.jsxs("p",{children:["Suas classes devem ser ",e.jsx("strong",{children:"abertas para extensão"})," e ",e.jsx("strong",{children:"fechadas para modificação"}),". Adicionar um novo comportamento não deveria exigir abrir uma classe estável e mexer num ",e.jsx("code",{children:"switch"})," gigante. A ferramenta clássica é o padrão Strategy."]}),e.jsx(a,{title:"Ruim — toda forma de pagamento nova mexe aqui",code:`class Pagamento {
    void processar(String tipo, double valor) {
        if (tipo.equals("PIX")) { /* ... */ }
        else if (tipo.equals("CARTAO")) { /* ... */ }
        else if (tipo.equals("BOLETO")) { /* ... */ }
        // amanhã: cripto? abre de novo, testa de novo.
    }
}`}),e.jsx(a,{title:"Aberto a novas formas, fechado pra mudança",code:`interface FormaPagamento {
    void cobrar(double valor);
}

class Pix implements FormaPagamento {
    public void cobrar(double v) { System.out.println("PIX " + v); }
}
class Cartao implements FormaPagamento {
    public void cobrar(double v) { System.out.println("Cartão " + v); }
}

class Caixa {
    void receber(FormaPagamento fp, double valor) { fp.cobrar(valor); }
}`}),e.jsx("h2",{children:"L — Liskov Substitution Principle"}),e.jsxs("p",{children:["Onde se espera um ",e.jsx("code",{children:"Pai"}),", qualquer ",e.jsx("code",{children:"Filho"})," deve servir ",e.jsx("strong",{children:"sem surpresas"}),". O exemplo clássico é Quadrado herdar de Retângulo: ao chamar ",e.jsx("code",{children:"setLargura(5)"}),", o quadrado também muda a altura, e código que confiava na semântica do retângulo quebra."]}),e.jsx(a,{title:"Quebra de Liskov",code:`class Retangulo {
    protected int largura, altura;
    public void setLargura(int l) { this.largura = l; }
    public void setAltura(int a)  { this.altura = a; }
    public int area() { return largura * altura; }
}

class Quadrado extends Retangulo {
    @Override public void setLargura(int l) { this.largura = l; this.altura = l; }
    @Override public void setAltura(int a)  { this.largura = a; this.altura = a; }
}

// Cliente espera comportamento de Retangulo:
Retangulo r = new Quadrado();
r.setLargura(5);
r.setAltura(4);
System.out.println(r.area()); // esperava 20, recebe 16 — surpresa!`}),e.jsxs(o,{type:"tip",title:"Solução",children:["Quadrado e Retângulo não são especialização um do outro. Modele como duas classes que implementam uma interface ",e.jsx("code",{children:"FormaGeometrica"})," com método ",e.jsx("code",{children:"area()"}),"."]}),e.jsx("h2",{children:"I — Interface Segregation Principle"}),e.jsxs("p",{children:["Várias interfaces pequenas e coesas batem uma interface gigante. Se sua classe é forçada a implementar métodos que não usa (com ",e.jsx("code",{children:"throw new UnsupportedOperationException"}),"), você feriu ISP."]}),e.jsx(a,{title:"Ruim — interface que faz tudo",code:`interface MultifuncionalImprimivelScaneavelFaxavel {
    void imprimir(Documento d);
    void escanear();
    void enviarFax(String numero);
}

class ImpressoraSimples implements MultifuncionalImprimivelScaneavelFaxavel {
    public void imprimir(Documento d) { /* ok */ }
    public void escanear()       { throw new UnsupportedOperationException(); }
    public void enviarFax(String n) { throw new UnsupportedOperationException(); }
}`}),e.jsx(a,{title:"Segregada",code:`interface Imprimivel { void imprimir(Documento d); }
interface Scaneavel  { void escanear(); }
interface Faxavel    { void enviarFax(String numero); }

class ImpressoraSimples implements Imprimivel { /* só o que faz sentido */ }
class Multifuncional   implements Imprimivel, Scaneavel, Faxavel { /* tudo */ }`}),e.jsx("h2",{children:"D — Dependency Inversion Principle"}),e.jsxs("p",{children:["Módulos de alto nível não devem depender de módulos de baixo nível — ",e.jsx("strong",{children:"ambos dependem de abstrações"}),". Em vez de a sua classe instanciar uma implementação concreta, ela recebe a interface. É a base do ",e.jsx("em",{children:"Dependency Injection"})," que o Spring/CDI/Guice automatizam."]}),e.jsx(a,{title:"Acoplado à implementação",code:`class ServicoPedido {
    private final MySqlPedidoRepository repo = new MySqlPedidoRepository();
    void salvar(Pedido p) { repo.salvar(p); }
}`}),e.jsx(a,{title:"Dependendo de abstração",code:`interface PedidoRepository { void salvar(Pedido p); }

class MySqlPedidoRepository  implements PedidoRepository { /* ... */ }
class MongoPedidoRepository  implements PedidoRepository { /* ... */ }
class FakePedidoRepository   implements PedidoRepository { /* pra teste */ }

class ServicoPedido {
    private final PedidoRepository repo;
    ServicoPedido(PedidoRepository repo) { this.repo = repo; } // injeção
    void salvar(Pedido p) { repo.salvar(p); }
}`}),e.jsx(o,{type:"info",title:"DI != DIP",children:"DIP é o princípio. DI (Dependency Injection) é uma técnica para implementá-lo. Spring, Quarkus e Micronaut só fazem o trabalho mecânico de juntar as peças que você desenhou seguindo DIP."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Pegue uma classe sua que tenha pelo menos um ",e.jsx("code",{children:"switch"})," de tipo. Refatore para Strategy seguindo OCP. Adicione um caso novo sem mexer em código antigo."]}),e.jsxs("li",{children:["Escreva ",e.jsx("code",{children:"Pagavel"}),", ",e.jsx("code",{children:"Demitivel"})," e ",e.jsx("code",{children:"Promovivel"})," como interfaces separadas. Crie ",e.jsx("code",{children:"Estagiario"})," que só implementa ",e.jsx("code",{children:"Pagavel"})," e ",e.jsx("code",{children:"Demitivel"}),", e ",e.jsx("code",{children:"Gerente"})," que implementa as três. Aplique ISP."]}),e.jsxs("li",{children:["Reescreva uma classe que faz ",e.jsx("code",{children:"new XRepository()"})," internamente para receber a interface no construtor. Crie um ",e.jsx("code",{children:"FakeRepository"})," e teste sem banco."]})]})]})}export{t as default};
