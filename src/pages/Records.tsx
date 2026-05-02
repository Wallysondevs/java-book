import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Records() {
  return (
    <PageContainer title="Records (Java 14+)" subtitle="Adeus boilerplate de POJOs — record gera getters, equals, hashCode, toString." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Quantas vezes você já escreveu uma classe só pra carregar dados — tipo um<code>Ponto(x, y)</code> ou um <code>Usuario(nome, email)</code> — e teve que digitar (ou pedir pra IDE gerar) construtor, getters, <code>equals</code>,<code>hashCode</code> e <code>toString</code>? Trinta linhas pra modelar duas propriedades. Cansativo, repetitivo, fácil de errar.
        </p><p>
          Records resolvem isso. Você declara o que importa (os campos), e o compilador gera todo o resto. Pense num record como um formulário pré-impresso: você só preenche os campos, a estrutura já vem pronta.
        </p><h2>Sintaxe</h2><CodeBlock title="Antes vs depois" code={`// Antes: classe tradicional (~30 linhas)
public final class Ponto {
    private final int x;
    private final int y;
    public Ponto(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    // ... equals, hashCode, toString manuais
}

// Depois: record (1 linha!)
public record Ponto(int x, int y) {}`} /><p>
          A linha <code>public record Ponto(int x, int y) </code> entrega tudo o que a versão grande tinha. E mais: vem com semântica de igualdade por valor de graça.
        </p><h2>O que o compilador gera por você</h2><ul>
          <li>
            <strong>Construtor canônico</strong>: <code>new Ponto(3, 4)</code> funciona.
          </li><li>
            <strong>Acessores</strong>: <code>ponto.x()</code> e <code>ponto.y()</code> (atenção: sem <code>get</code>).
          </li><li>
            <strong>equals e hashCode</strong>: dois records com os mesmos componentes são iguais.
          </li><li>
            <strong>toString</strong>: imprime <code>Ponto[x=3, y=4]</code> automaticamente.
          </li><li>
            A classe é <code>final</code> implicitamente — ninguém estende.
          </li><li>
            Os componentes são <code>private final</code> — record é imutável por design.
          </li>
        </ul><CodeBlock title="Usando o record" code={`Ponto a = new Ponto(3, 4);
Ponto b = new Ponto(3, 4);

System.out.println(a);          // Ponto[x=3, y=4]
System.out.println(a.x());      // 3
System.out.println(a.equals(b));// true
System.out.println(a.hashCode() == b.hashCode()); // true`} /><AlertBox type="info" title="Imutabilidade não é negociável">
          Você não consegue mudar o <code>x</code> de um <code>Ponto</code> depois de criado. Pra "alterar", você cria um novo: <code>new Ponto(a.x() + 1, a.y())</code>. Isso evita uma categoria inteira de bugs (mutação compartilhada).
        </AlertBox><h2>Construtor compacto: validação sem repetição</h2><p>
          E se você quiser validar os parâmetros antes de criar o objeto? Records têm uma forma especial de construtor — o <strong>compacto</strong> — que roda antes da atribuição automática. Você não escreve a lista de parâmetros nem as atribuições.
        </p><CodeBlock title="Validação no construtor compacto" code={`public record Idade(int anos) {
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

// new Idade(-5)  →  IllegalArgumentException`} /><p>
          Você também pode normalizar valores aqui (ex: <code>nome = nome.trim()</code>) antes deles serem atribuídos aos campos.
        </p><h2>Records implementam, mas não estendem</h2><p>
          Records já estendem <code>java.lang.Record</code> internamente, então não dá pra herdar de outra classe. Mas eles podem implementar quantas interfaces quiser:
        </p><CodeBlock title="Record implementando interface" code={`public interface Identificavel {
    String id();
}

public record Produto(String id, String nome, double preco)
        implements Identificavel {
    // O acessor id() já implementa o método da interface!
}`} /><p>
          Repare na sacada: o método <code>id()</code> exigido pela interface é satisfeito automaticamente pelo acessor gerado. Zero código extra.
        </p><h2>Métodos extras e estáticos</h2><p>
          Você pode adicionar métodos comuns ou estáticos no corpo do record — só não pode adicionar campos de instância (eles têm que vir da assinatura do record).
        </p><CodeBlock title="Métodos auxiliares" code={`public record Ponto(int x, int y) {
    public double distanciaDaOrigem() {
        return Math.sqrt(x * x + y * y);
    }

    public static Ponto origem() {
        return new Ponto(0, 0);
    }
}

// Ponto.origem().distanciaDaOrigem()  →  0.0`} /><h2>Quando usar record vs classe tradicional</h2><p>
          Use <strong>record</strong> quando o objeto é essencialmente um agregado de dados imutável: DTOs de API, eventos, coordenadas, valores monetários, chaves compostas para mapas.
        </p><p>
          Use <strong>classe tradicional</strong> quando você precisa de mutabilidade, herança, ou a identidade do objeto importa mais que seus valores (dois usuários diferentes com o mesmo nome NÃO são iguais — use classe).
        </p><h2>Pattern matching com records (Java 21)</h2><p>
          Records combinam lindamente com pattern matching no <code>switch</code>: você consegue desestruturar os componentes diretamente no <code>case</code>.
        </p><CodeBlock title="Desestruturação em switch" code={`sealed interface Forma permits Circulo, Retangulo {}
record Circulo(double raio) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}

public static double area(Forma f) {
    return switch (f) {
        case Circulo(double r)            -> Math.PI * r * r;
        case Retangulo(double l, double a) -> l * a;
    };
}`} /><p>
          Em vez de <code>f.raio()</code> ou <code>f.largura()</code>, você puxa direto os componentes pra variáveis locais. Código limpo e expressivo.
        </p><AlertBox type="warning" title="Records são valor, não identidade">
          Se você usa um <code>HashMap</code> com record como chave, lembre que dois records iguais (mesmos componentes) viram a MESMA chave. Isso geralmente é o que você quer — mas não use record pra coisas que precisam de identidade única (use uma classe com UUID, por exemplo).
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um record <code>Email(String endereco)</code> com construtor compacto que valida se o endereço contém <code>@</code>. Crie alguns emails válidos e tente criar um inválido.
          </li><li>
            Modele um <code>Livro(String titulo, String autor, int paginas)</code>. Adicione um método <code>resumo()</code> que retorne uma <code>String</code>formatada. Compare dois livros iguais com <code>equals</code>.
          </li><li>
            Crie um sealed interface <code>Pagamento</code> e dois records que o implementam:<code>Dinheiro(double valor)</code> e <code>Cartao(double valor, String bandeira)</code>. Escreva uma função que recebe <code>Pagamento</code> e usa pattern matching pra imprimir uma mensagem diferente em cada caso.
          </li>
        </ol>
      </PageContainer>
  );
}
