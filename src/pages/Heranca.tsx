import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Heranca() {
  return (
    <PageContainer
      title="Herança e Polimorfismo"
      subtitle="extends, super, @Override, classes final e o poderoso polimorfismo em tempo de execução."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        Herança permite que uma classe derive de outra, herdando seus atributos e métodos.
        Java suporta herança simples (uma classe só pode estender uma outra). O polimorfismo
        permite que um objeto seja tratado como uma instância de seu tipo pai.
      </p>

      <h2>1. extends — Criando Hierarquias</h2>
      <CodeBlock
        language="java"
        code={`// Classe pai (superclasse)
public class Animal {
    protected String nome;
    protected int idade;

    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public void emitirSom() {
        System.out.println(nome + " emite um som");
    }

    public void dormir() {
        System.out.println(nome + " está dormindo... Zzz");
    }

    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}

// Classe filha (subclasse) — herda de Animal
public class Cachorro extends Animal {
    private String raca;

    public Cachorro(String nome, int idade, String raca) {
        super(nome, idade);   // chama o construtor da classe pai (OBRIGATÓRIO!)
        this.raca = raca;
    }

    @Override                  // sobrescreve o método da classe pai
    public void emitirSom() {
        System.out.println(nome + " faz: Au Au!");
    }

    // Método próprio da subclasse
    public void buscarBola() {
        System.out.println(nome + " está buscando a bola!");
    }
}

public class Gato extends Animal {
    public Gato(String nome, int idade) {
        super(nome, idade);
    }

    @Override
    public void emitirSom() {
        System.out.println(nome + " faz: Miau!");
    }
}`}
      />

      <h2>2. Polimorfismo</h2>
      <CodeBlock
        language="java"
        code={`// Polimorfismo: referência do tipo pai aponta para objeto filho
Animal a1 = new Cachorro("Rex", 3, "Golden");
Animal a2 = new Gato("Mia", 2);
Animal a3 = new Animal("Animal", 1);

// O método chamado depende do TIPO REAL do objeto (não da referência)
a1.emitirSom(); // "Rex faz: Au Au!"
a2.emitirSom(); // "Mia faz: Miau!"
a3.emitirSom(); // "Animal emite um som"

// Muito útil com coleções!
List<Animal> animais = new ArrayList<>();
animais.add(new Cachorro("Rex", 3, "Golden"));
animais.add(new Gato("Mia", 2));
animais.add(new Cachorro("Bolt", 1, "Husky"));

for (Animal animal : animais) {
    animal.emitirSom(); // cada um emite o som correto!
}

// Casting: Animal → Cachorro
Animal a = new Cachorro("Rex", 3, "Poodle");
if (a instanceof Cachorro cachorro) {  // Pattern Matching (Java 16+)
    cachorro.buscarBola(); // acessa método da subclasse
}`}
      />

      <h2>3. Palavra-chave super</h2>
      <CodeBlock
        language="java"
        code={`public class ContaCorrente extends ContaBancaria {
    private double limiteChequeEspecial;

    public ContaCorrente(String titular, String numero, double limite) {
        super(titular, numero);   // OBRIGATÓRIO: chama construtor da superclasse
        this.limiteChequeEspecial = limite;
    }

    @Override
    public void sacar(double valor) {
        double saldoDisponivel = getSaldo() + limiteChequeEspecial;
        if (valor > saldoDisponivel) {
            throw new IllegalStateException("Limite de crédito excedido");
        }
        super.sacar(Math.min(valor, getSaldo())); // chama método da superclasse
        // lógica adicional para cheque especial...
    }

    @Override
    public String toString() {
        return super.toString() + " [CC, limite=R$" + limiteChequeEspecial + "]";
    }
}`}
      />

      <h2>4. Classes e Métodos final</h2>
      <CodeBlock
        language="java"
        code={`// final class — não pode ser estendida
public final class String { }  // java.lang.String é final!
public final class Math { }    // java.lang.Math também!

// Tentar herdar de classe final é ERRO de compilação:
// class MinhaString extends String { } // ERRO!

// final method — não pode ser sobrescrito
public class Forma {
    public final double calcularArea() {
        // implementação imutável
        return 0;
    }
}`}
      />

      <AlertBox type="warning" title="Composição vs Herança">
        Prefira <strong>composição</strong> sobre herança quando possível!
        Herança cria acoplamento forte. Uma regra prática: use herança apenas para relacionamentos
        verdadeiros de "é um" (um Cachorro <em>é um</em> Animal). Para "tem um", use composição
        (um Carro <em>tem um</em> Motor).
      </AlertBox>
    </PageContainer>
  );
}
