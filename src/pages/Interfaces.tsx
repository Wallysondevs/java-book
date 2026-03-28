import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Interfaces() {
  return (
    <PageContainer
      title="Interfaces e Classes Abstratas"
      subtitle="Defina contratos com interface, use default methods, classes abstratas e entenda quando usar cada um."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Interfaces e classes abstratas são mecanismos de abstração do Java. Ambas definem um "contrato"
        que as classes implementadoras/subclasses devem cumprir, mas têm diferenças importantes.
      </p>

      <h2>1. Interfaces</h2>
      <CodeBlock
        language="java"
        code={`// Interface: contrato puro — define O QUÊ, não o COMO
public interface Pagavel {
    void pagar(double valor);   // método abstrato (implicitamente public abstract)
    boolean isPago();
}

public interface Cancelavel {
    void cancelar(String motivo);
}

// Uma classe pode implementar MÚLTIPLAS interfaces!
public class Pedido implements Pagavel, Cancelavel {
    private double total;
    private boolean pago = false;
    private String status = "ATIVO";

    public Pedido(double total) { this.total = total; }

    @Override
    public void pagar(double valor) {
        if (valor < total) throw new IllegalArgumentException("Valor insuficiente");
        this.pago = true;
        this.status = "PAGO";
        System.out.println("Pedido pago: R$" + valor);
    }

    @Override
    public boolean isPago() { return pago; }

    @Override
    public void cancelar(String motivo) {
        this.status = "CANCELADO";
        System.out.println("Cancelado: " + motivo);
    }
}`}
      />

      <h2>2. Default Methods (Java 8+)</h2>
      <CodeBlock
        language="java"
        code={`// Interface pode ter implementações padrão
public interface Formatavel {
    String formatarTexto(String texto); // abstrato (obrigatório implementar)

    // default method — já tem implementação
    default String formatarUpperCase(String texto) {
        return formatarTexto(texto).toUpperCase();
    }

    default String formatarComPrefixo(String prefixo, String texto) {
        return prefixo + formatarTexto(texto);
    }

    // static method — pertence à interface
    static boolean textoValido(String texto) {
        return texto != null && !texto.isBlank();
    }
}

// Implementando apenas o método abstrato
public class Negrito implements Formatavel {
    @Override
    public String formatarTexto(String texto) {
        return "**" + texto + "**";
    }
    // formatarUpperCase e formatarComPrefixo herdados automaticamente!
}

Negrito n = new Negrito();
System.out.println(n.formatarTexto("Java"));       // **Java**
System.out.println(n.formatarUpperCase("Java"));   // **JAVA**
System.out.println(Formatavel.textoValido("OK"));  // true`}
      />

      <h2>3. Classes Abstratas</h2>
      <CodeBlock
        language="java"
        code={`// Classe abstrata: não pode ser instanciada diretamente
// Pode ter atributos, métodos concretos E métodos abstratos
public abstract class Forma {
    protected String cor;
    protected double espessuraBorda;

    public Forma(String cor) {
        this.cor = cor;
    }

    // Método abstrato: subclasses DEVEM implementar
    public abstract double calcularArea();
    public abstract double calcularPerimetro();

    // Método concreto: herdado por todas as subclasses
    public void descrever() {
        System.out.printf("Forma %s: área=%.2f, perímetro=%.2f%n",
            cor, calcularArea(), calcularPerimetro());
    }
}

public class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * Math.PI * raio;
    }
}

public class Retangulo extends Forma {
    private double largura, altura;

    public Retangulo(String cor, double largura, double altura) {
        super(cor);
        this.largura = largura;
        this.altura = altura;
    }

    @Override public double calcularArea() { return largura * altura; }
    @Override public double calcularPerimetro() { return 2 * (largura + altura); }
}

// Uso polimórfico
List<Forma> formas = List.of(
    new Circulo("vermelho", 5),
    new Retangulo("azul", 4, 6)
);
formas.forEach(Forma::descrever);`}
      />

      <AlertBox type="info" title="Interface vs Classe Abstrata">
        <strong>Use Interface quando:</strong> definir um contrato comportamental que classes não relacionadas podem implementar (Serializable, Comparable, Runnable).
        <br /><br />
        <strong>Use Classe Abstrata quando:</strong> há código compartilhado entre subclasses e um relacionamento "é um" claro. Quando precisa de estado (atributos) compartilhado.
      </AlertBox>
    </PageContainer>
  );
}
