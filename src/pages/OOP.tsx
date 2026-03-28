import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OOP() {
  return (
    <PageContainer
      title="Orientação a Objetos"
      subtitle="Classes, objetos, construtores, encapsulamento, getters/setters e Records no Java moderno."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <p>
        Java é uma linguagem fundamentalmente orientada a objetos (OOP). Os quatro pilares da OOP são:
        <strong> Encapsulamento</strong>, <strong>Herança</strong>, <strong>Polimorfismo</strong> e
        <strong> Abstração</strong>. Neste módulo focamos nos conceitos de classes e encapsulamento.
      </p>

      <h2>1. Classes e Objetos</h2>
      <CodeBlock
        language="java"
        code={`// Classe = molde/blueprint
public class ContaBancaria {

    // Atributos (campos/fields) — estado do objeto
    private String titular;
    private String numeroConta;
    private double saldo;
    private boolean ativa;

    // Construtor padrão
    public ContaBancaria() {
        this.ativa = true;
        this.saldo = 0.0;
    }

    // Construtor com parâmetros
    public ContaBancaria(String titular, String numeroConta) {
        this.titular = titular;
        this.numeroConta = numeroConta;
        this.saldo = 0.0;
        this.ativa = true;
    }

    // Construtor completo
    public ContaBancaria(String titular, String numeroConta, double saldoInicial) {
        this(titular, numeroConta);    // chama o construtor anterior (this())
        this.saldo = saldoInicial;
    }

    // Métodos (comportamento)
    public void depositar(double valor) {
        if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        saldo += valor;
    }

    public void sacar(double valor) {
        if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        if (valor > saldo) throw new IllegalStateException("Saldo insuficiente");
        saldo -= valor;
    }

    // Getters e Setters
    public String getTitular() { return titular; }
    public void setTitular(String titular) { this.titular = titular; }
    public double getSaldo() { return saldo; }
    public boolean isAtiva() { return ativa; }

    // toString() — representação textual do objeto
    @Override
    public String toString() {
        return String.format("Conta[%s, titular=%s, saldo=R$%.2f]",
            numeroConta, titular, saldo);
    }
}

// Criando e usando objetos
ContaBancaria conta = new ContaBancaria("Ana", "001-1", 1000.0);
conta.depositar(500.0);
conta.sacar(200.0);
System.out.println(conta); // Conta[001-1, titular=Ana, saldo=R$1300,00]`}
      />

      <h2>2. Encapsulamento</h2>
      <CodeBlock
        language="java"
        code={`// Modificadores de acesso
public class Produto {
    public    String nome;        // acessível de qualquer lugar
    protected double custo;       // acessível no pacote e subclasses
    double precoBase;             // package-private (padrão, sem modificador)
    private   double margem;      // apenas dentro desta classe

    // Encapsulamento: mantém invariantes do negócio
    private double preco;

    public double getPreco() { return preco; }

    public void setPreco(double preco) {
        if (preco < 0) throw new IllegalArgumentException("Preço não pode ser negativo");
        this.preco = preco;
    }

    // Método que depende do estado interno
    public double calcularPrecoComDesconto(double percentual) {
        if (percentual < 0 || percentual > 100) throw new IllegalArgumentException("Desconto inválido");
        return preco * (1 - percentual / 100);
    }
}`}
      />

      <h2>3. Records (Java 16+)</h2>
      <CodeBlock
        language="java"
        code={`// Record: classe imutável gerada automaticamente
// Gera: construtor, getters, equals, hashCode, toString
record Ponto(double x, double y) {
    // Construtor compacto para validação
    Ponto {
        if (Double.isNaN(x) || Double.isNaN(y)) {
            throw new IllegalArgumentException("Coordenadas inválidas");
        }
    }

    // Métodos personalizados permitidos
    public double distanciaOrigem() {
        return Math.sqrt(x * x + y * y);
    }

    public Ponto mover(double dx, double dy) {
        return new Ponto(x + dx, y + dy);
    }
}

Ponto p = new Ponto(3.0, 4.0);
System.out.println(p.x());               // 3.0 (getter automático)
System.out.println(p.distanciaOrigem()); // 5.0
System.out.println(p);                   // Ponto[x=3.0, y=4.0]

record Pessoa(String nome, int idade) {}

Pessoa p1 = new Pessoa("Ana", 30);
Pessoa p2 = new Pessoa("Ana", 30);
System.out.println(p1.equals(p2)); // true (equals automático)`}
      />

      <h2>4. Atributos e Métodos Estáticos</h2>
      <CodeBlock
        language="java"
        code={`public class Contador {
    private static int total = 0;   // compartilhado entre TODAS as instâncias
    private int id;

    public Contador() {
        total++;         // incrementa o contador global
        this.id = total; // id único para esta instância
    }

    public static int getTotal() { return total; }  // método estático
    public int getId() { return id; }

    // Constantes estáticas
    public static final double TAXA_BASE = 0.05;
}

Contador c1 = new Contador(); // total = 1
Contador c2 = new Contador(); // total = 2
Contador c3 = new Contador(); // total = 3
System.out.println(Contador.getTotal()); // 3 (chamado na CLASSE, não objeto)
System.out.println(c1.getId()); // 1
System.out.println(c2.getId()); // 2`}
      />

      <AlertBox type="success" title="Boas Práticas OOP">
        <ul className="list-none ml-0 mb-0">
          <li>• Sempre declare atributos como <code>private</code></li>
          <li>• Exponha apenas o necessário via <code>public</code> getters/setters</li>
          <li>• Valide dados nos setters e construtores</li>
          <li>• Prefira <code>record</code> para DTOs e classes imutáveis simples</li>
          <li>• Sobrescreva <code>toString()</code>, <code>equals()</code> e <code>hashCode()</code> quando necessário</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
