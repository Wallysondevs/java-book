import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SolidPrinciples() {
  return (
    <PageContainer title="SOLID em Java" subtitle="Os 5 princípios que evitam código que ninguém quer manter." difficulty="intermediario" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você já abriu uma classe de 2.000 linhas que faz dez coisas e ninguém ousa mexer? Esse cheiro de "se eu mudar aqui, quebra três telas" é exatamente o que SOLID combate. São cinco princípios criados pelo Robert C. Martin que orientam <em>onde colocar a responsabilidade</em> no seu código orientado a objetos.
        </p><p>
          Pense como uma cozinha profissional: o churrasqueiro não lava prato, o lavador de prato não corta cebola, e cada um sabe trocar o seu colega sem o restaurante parar. SOLID é isso aplicado a classes.
        </p><h2>S — Single Responsibility Principle</h2><p>
          Uma classe deve ter <strong>um único motivo para mudar</strong>. Se a regra de cálculo de imposto muda, só a classe de imposto deveria ser tocada. Se o formato do relatório muda, só a classe de relatório.
        </p><CodeBlock title="Ruim — uma classe, três motivos para mudar" code={`class Funcionario {
    String nome;
    double salario;

    double calcularImposto() { /* regra fiscal muda */ }
    void salvarNoBanco() { /* schema muda */ }
    String gerarRelatorioPdf() { /* layout muda */ }
}`} /><CodeBlock title="Melhor — cada motivo na sua classe" code={`record Funcionario(String nome, double salario) {}

class CalculadoraImposto {
    double calcular(Funcionario f) { return f.salario() * 0.275; }
}

class FuncionarioRepository {
    void salvar(Funcionario f) { /* JDBC/JPA */ }
}

class FuncionarioRelatorioPdf {
    byte[] gerar(Funcionario f) { /* iText */ return new byte[0]; }
}`} /><h2>O — Open/Closed Principle</h2><p>
          Suas classes devem ser <strong>abertas para extensão</strong> e <strong>fechadas para modificação</strong>. Adicionar um novo comportamento não deveria exigir abrir uma classe estável e mexer num <code>switch</code> gigante. A ferramenta clássica é o padrão Strategy.
        </p><CodeBlock title="Ruim — toda forma de pagamento nova mexe aqui" code={`class Pagamento {
    void processar(String tipo, double valor) {
        if (tipo.equals("PIX")) { /* ... */ }
        else if (tipo.equals("CARTAO")) { /* ... */ }
        else if (tipo.equals("BOLETO")) { /* ... */ }
        // amanhã: cripto? abre de novo, testa de novo.
    }
}`} /><CodeBlock title="Aberto a novas formas, fechado pra mudança" code={`interface FormaPagamento {
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
}`} /><h2>L — Liskov Substitution Principle</h2><p>
          Onde se espera um <code>Pai</code>, qualquer <code>Filho</code> deve servir <strong>sem surpresas</strong>. O exemplo clássico é Quadrado herdar de Retângulo: ao chamar <code>setLargura(5)</code>, o quadrado também muda a altura, e código que confiava na semântica do retângulo quebra.
        </p><CodeBlock title="Quebra de Liskov" code={`class Retangulo {
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
System.out.println(r.area()); // esperava 20, recebe 16 — surpresa!`} /><AlertBox type="tip" title="Solução">
          Quadrado e Retângulo não são especialização um do outro. Modele como duas classes que implementam uma interface <code>FormaGeometrica</code> com método <code>area()</code>.
        </AlertBox><h2>I — Interface Segregation Principle</h2><p>
          Várias interfaces pequenas e coesas batem uma interface gigante. Se sua classe é forçada a implementar métodos que não usa (com <code>throw new UnsupportedOperationException</code>), você feriu ISP.
        </p><CodeBlock title="Ruim — interface que faz tudo" code={`interface MultifuncionalImprimivelScaneavelFaxavel {
    void imprimir(Documento d);
    void escanear();
    void enviarFax(String numero);
}

class ImpressoraSimples implements MultifuncionalImprimivelScaneavelFaxavel {
    public void imprimir(Documento d) { /* ok */ }
    public void escanear()       { throw new UnsupportedOperationException(); }
    public void enviarFax(String n) { throw new UnsupportedOperationException(); }
}`} /><CodeBlock title="Segregada" code={`interface Imprimivel { void imprimir(Documento d); }
interface Scaneavel  { void escanear(); }
interface Faxavel    { void enviarFax(String numero); }

class ImpressoraSimples implements Imprimivel { /* só o que faz sentido */ }
class Multifuncional   implements Imprimivel, Scaneavel, Faxavel { /* tudo */ }`} /><h2>D — Dependency Inversion Principle</h2><p>
          Módulos de alto nível não devem depender de módulos de baixo nível — <strong>ambos dependem de abstrações</strong>. Em vez de a sua classe instanciar uma implementação concreta, ela recebe a interface. É a base do <em>Dependency Injection</em> que o Spring/CDI/Guice automatizam.
        </p><CodeBlock title="Acoplado à implementação" code={`class ServicoPedido {
    private final MySqlPedidoRepository repo = new MySqlPedidoRepository();
    void salvar(Pedido p) { repo.salvar(p); }
}`} /><CodeBlock title="Dependendo de abstração" code={`interface PedidoRepository { void salvar(Pedido p); }

class MySqlPedidoRepository  implements PedidoRepository { /* ... */ }
class MongoPedidoRepository  implements PedidoRepository { /* ... */ }
class FakePedidoRepository   implements PedidoRepository { /* pra teste */ }

class ServicoPedido {
    private final PedidoRepository repo;
    ServicoPedido(PedidoRepository repo) { this.repo = repo; } // injeção
    void salvar(Pedido p) { repo.salvar(p); }
}`} /><AlertBox type="info" title="DI != DIP">
          DIP é o princípio. DI (Dependency Injection) é uma técnica para implementá-lo. Spring, Quarkus e Micronaut só fazem o trabalho mecânico de juntar as peças que você desenhou seguindo DIP.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue uma classe sua que tenha pelo menos um <code>switch</code> de tipo. Refatore para Strategy seguindo OCP. Adicione um caso novo sem mexer em código antigo.
          </li><li>
            Escreva <code>Pagavel</code>, <code>Demitivel</code> e <code>Promovivel</code> como interfaces separadas. Crie <code>Estagiario</code> que só implementa <code>Pagavel</code> e <code>Demitivel</code>, e <code>Gerente</code> que implementa as três. Aplique ISP.
          </li><li>
            Reescreva uma classe que faz <code>new XRepository()</code> internamente para receber a interface no construtor. Crie um <code>FakeRepository</code> e teste sem banco.
          </li>
        </ol>
      </PageContainer>
  );
}
