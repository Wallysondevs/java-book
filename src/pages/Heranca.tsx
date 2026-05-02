import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Heranca() {
  return (
    <PageContainer title="Herança" subtitle="extends — reutilizar e especializar comportamento." difficulty="iniciante" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Você modelou <code>Cachorro</code>, <code>Gato</code> e <code>Papagaio</code>. Cada classe tem <code>nome</code>, <code>idade</code>, e métodos <code>comer()</code> e <code>dormir()</code>. Repetir o mesmo código três vezes é o caminho rápido para o inferno: você corrige um bug em <code>Cachorro</code> e esquece de propagar para o resto. <strong>Herança</strong> resolve: você cria <code>Animal</code> com tudo o que é comum, e <code>Cachorro extends Animal</code> herda tudo de graça.
        </p><h2>A analogia das receitas de família</h2><p>
          Sua avó tem a receita-base de bolo. Sua mãe pega essa receita e adiciona chocolate. Você pega a da sua mãe e troca farinha por farinha de amêndoas. Cada geração <em>herda</em> o que veio antes e <em>especializa</em>. Em Java é igual: a subclasse recebe tudo da superclasse e adiciona ou modifica o que quiser.
        </p><h2>Sintaxe básica: extends</h2><CodeBlock title="Animal e Cachorro" code={`public class Animal {
    String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public void comer() {
        System.out.println(nome + " está comendo.");
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    public void latir() {
        System.out.println(nome + " disse: au au!");
    }
}

// Uso:
Cachorro rex = new Cachorro("Rex");
rex.comer();   // herdado de Animal
rex.latir();   // próprio de Cachorro`} /><h2>Object é pai de TUDO</h2><p>
          Toda classe em Java herda implicitamente de <code>java.lang.Object</code>. Mesmo quando você escreve <code>public class Pessoa </code> sem <code>extends</code> nenhum, é como se tivesse escrito <code>public class Pessoa extends Object </code>. Por isso todo objeto tem métodos como <code>toString()</code>, <code>equals()</code>, <code>hashCode()</code> e <code>getClass()</code> — vêm de <code>Object</code>.
        </p><CodeBlock title="Métodos herdados de Object" code={`public class Pessoa { }

public class Main {
    public static void main(String[] args) {
        Pessoa p = new Pessoa();
        System.out.println(p.toString());  // Pessoa@1540e19d
        System.out.println(p.getClass());  // class Pessoa
    }
}`} /><h2>@Override: sobrescrevendo métodos</h2><p>
          Quando a versão herdada não serve, você reescreve na subclasse. Marcar com <code>@Override</code> não é obrigatório, mas é fortemente recomendado: o compilador verifica se você realmente está sobrescrevendo algo. Se errar o nome ou os parâmetros, ele reclama.
        </p><CodeBlock title="Sobrescrevendo toString" code={`public class Pessoa {
    String nome;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Pessoa(nome=" + nome + ")";
    }
}

System.out.println(new Pessoa("Ana")); // Pessoa(nome=Ana)`} /><AlertBox type="tip" title="Use @Override sempre">
          Sem a anotação, um pequeno typo (<code>tostring</code> em vez de <code>toString</code>) cria um método novo em vez de sobrescrever. Bug silencioso e chato. Com <code>@Override</code>, o compilador grita.
        </AlertBox><h2>super.metodo() — chamando a versão da pai</h2><p>
          Às vezes você quer estender o comportamento sem jogar fora o que a superclasse já fazia. Use <code>super.nomeDoMetodo(...)</code>:
        </p><CodeBlock title="super em método" code={`public class Animal {
    public void apresentar() {
        System.out.println("Sou um animal.");
    }
}

public class Cachorro extends Animal {
    @Override
    public void apresentar() {
        super.apresentar();
        System.out.println("Mais especificamente, um cachorro.");
    }
}

// Saída:
// Sou um animal.
// Mais especificamente, um cachorro.`} /><h2>final na classe: ninguém herda</h2><p>
          Marcar uma classe com <code>final</code> proíbe que ela seja estendida. Útil para classes de utilidade ou para garantir invariantes que herança poderia quebrar. O exemplo mais famoso é <code>java.lang.String</code> — é <code>final</code> justamente para que ninguém crie uma "String maliciosa" alterando o comportamento esperado.
        </p><CodeBlock title="Classe final" code={`public final class Token {
    private final String valor;

    public Token(String valor) {
        this.valor = valor;
    }
}

// Tentar herdar dá erro de compilação:
// public class TokenEspecial extends Token { }  // ERRO`} /><p>
          Você também pode usar <code>final</code> só no método (não na classe inteira) para impedir que aquele método específico seja sobrescrito.
        </p><h2>Composição vs herança: o debate eterno</h2><p>
          A regra prática: pergunte se a relação é "<strong>é-um</strong>" ou "<strong>tem-um</strong>". Se um <code>Cachorro</code> "é um" <code>Animal</code>, herança faz sentido. Se um <code>Carro</code> "tem um" <code>Motor</code>, use composição (campo do tipo <code>Motor</code> dentro de <code>Carro</code>).
        </p><CodeBlock title="Composição" code={`public class Motor {
    public void ligar() {
        System.out.println("Motor ligado.");
    }
}

public class Carro {
    private Motor motor = new Motor(); // Carro TEM um Motor

    public void dirigir() {
        motor.ligar();
        System.out.println("Indo embora.");
    }
}`} /><AlertBox type="warning" title="Prefira composição">
          Há uma máxima famosa de OOP: "favoreça composição sobre herança". Herança acopla fortemente — qualquer mudança na pai pode quebrar todas as filhas. Composição é mais flexível: você troca o <code>Motor</code> sem mexer em <code>Carro</code>. Use herança quando há de fato uma relação "é-um" e você precisa de polimorfismo.
        </AlertBox><h2>Java só tem herança simples (de classes)</h2><p>
          Uma classe Java só pode estender <strong>uma</strong> outra classe. Nada de <code>class Filho extends Pai1, Pai2</code>. Isso evita o famoso "diamond problem" do C++ (qual versão herdar quando duas pais têm o mesmo método?).
        </p><p>
          A boa notícia: você pode <code>implements</code> várias <strong>interfaces</strong> ao mesmo tempo. Interfaces resolvem o caso "preciso garantir que essa classe sabe nadar e voar" sem o problema de ambiguidade de implementação. Mais sobre isso na página de Interfaces.
        </p><CodeBlock title="Limites da herança" code={`public class Pessoa { }
public class Funcionario { }

// public class Gerente extends Pessoa, Funcionario { }  // ERRO

// Mas isto é OK:
public class Pato extends Animal implements Nadador, Voador { }`} /><h2>Construtor não é herdado</h2><p>
          Lembre-se de uma coisa importante: construtores <strong>não</strong> são herdados. Cada classe declara os próprios. Se a pai exige parâmetros no construtor, a filha precisa chamar <code>super(...)</code> com os argumentos corretos.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie a hierarquia <code>Veiculo</code> → <code>Carro</code> e <code>Veiculo</code> → <code>Moto</code>. <code>Veiculo</code> tem campos comuns (<code>marca</code>, <code>ano</code>) e método <code>descrever()</code>. Sobrescreva <code>descrever()</code> em cada filha usando <code>@Override</code> e <code>super.descrever()</code>.
          </li><li>
            Sobrescreva <code>toString()</code> numa classe sua (qualquer uma) e veja a diferença ao passar um objeto para <code>System.out.println</code>.
          </li><li>
            Modele um <code>Computador</code> usando composição: ele <em>tem um</em> <code>Processador</code>, <em>tem uma</em> <code>MemoriaRAM</code>, <em>tem um</em> <code>Armazenamento</code>. Implemente um método <code>ligar()</code> em <code>Computador</code> que chama métodos das partes. Reflita: faria sentido <code>Computador extends Processador</code>? Não, né?
          </li>
        </ol>
      </PageContainer>
  );
}
