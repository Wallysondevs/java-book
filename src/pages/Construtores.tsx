import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Construtores() {
  return (
    <PageContainer title="Construtores" subtitle="Inicialização garantida — sem construtor, sem objeto." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Sem construtor, você cria objetos pela metade. Imagine uma <code>ContaBancaria</code> nascendo com <code>saldo = 0</code>, <code>titular = null</code> e <code>cpf = null</code> — e só depois alguém lembrar de preencher. Em algum lugar do código, alguém vai esquecer, e seu sistema vai estourar um <code>NullPointerException</code> em produção. O <strong>construtor</strong> é a forma de Java garantir: "esse objeto não existe sem os dados essenciais".
        </p><h2>O construtor padrão (que você nem viu)</h2><p>
          Se você não declarar nenhum construtor, o compilador gera um para você — sem parâmetros, sem corpo. Por isso <code>new Pessoa()</code> funciona mesmo quando você nunca escreveu um construtor.
        </p><CodeBlock title="Sem construtor declarado" code={`public class Pessoa {
    String nome;
    int idade;
}

// Em outro lugar:
Pessoa p = new Pessoa(); // funciona — construtor padrão invisível`} /><AlertBox type="warning" title="Cuidado">
          Assim que você declara <strong>qualquer</strong> construtor, o construtor padrão <em>desaparece</em>. Se você quiser continuar usando <code>new Pessoa()</code>, vai precisar declarar um construtor sem parâmetros explicitamente.
        </AlertBox><h2>Declarando seu construtor</h2><p>
          Construtor é um "método" especial: tem o mesmo nome da classe e <strong>não tem tipo de retorno</strong> (nem <code>void</code>). É chamado automaticamente quando você usa <code>new</code>.
        </p><CodeBlock title="Pessoa.java" code={`public class Pessoa {
    String nome;
    int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

// Uso:
Pessoa ana = new Pessoa("Ana", 30);`} /><h2>Sobrecarga de construtores</h2><p>
          Você pode declarar vários construtores com listas de parâmetros diferentes. Quem chama escolhe a versão mais conveniente.
        </p><CodeBlock title="Sobrecarga" code={`public class Pessoa {
    String nome;
    int idade;

    public Pessoa() {
        this.nome = "Anônimo";
        this.idade = 0;
    }

    public Pessoa(String nome) {
        this.nome = nome;
        this.idade = 0;
    }

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}`} /><h2>this(...) — chamando outro construtor</h2><p>
          Repetir lógica entre construtores é receita de bug. Use <code>this(...)</code> para delegar para outra versão. Tem que ser a <strong>primeira</strong> instrução do construtor.
        </p><CodeBlock title="Encadeamento com this()" code={`public class Pessoa {
    String nome;
    int idade;

    public Pessoa() {
        this("Anônimo", 0);
    }

    public Pessoa(String nome) {
        this(nome, 0);
    }

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}`} /><h2>super(...) — chamando o construtor da pai</h2><p>
          Quando uma classe estende outra, o construtor da filha precisa garantir que a parte herdada também seja inicializada. Por padrão, Java insere uma chamada <code>super()</code> implícita no início do construtor da filha. Se a pai não tem construtor sem parâmetros, você é obrigado a chamar <code>super(...)</code> explicitamente.
        </p><CodeBlock title="super em ação" code={`public class Animal {
    String especie;

    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Cachorro extends Animal {
    String raca;

    public Cachorro(String raca) {
        super("Canis familiaris"); // obrigatório aqui
        this.raca = raca;
    }
}`} /><h2>Ordem de inicialização</h2><p>
          Quando você faz <code>new MinhaClasse(...)</code>, Java executa, nessa ordem:
        </p><ol>
          <li>
            <strong>Valores default dos campos</strong> — <code>0</code> para numéricos, <code>false</code> para boolean, <code>null</code> para referências.
          </li><li>
            <strong>Inicializadores de campo e blocos de instância</strong> — na ordem em que aparecem no código.
          </li><li>
            <strong>Corpo do construtor</strong> — depois do <code>super(...)</code>.
          </li>
        </ol><CodeBlock title="OrdemInit.java" code={`public class OrdemInit {
    int x = 10;          // (2) inicializador de campo

    {
        System.out.println("bloco: x = " + x); // (2) bloco de instância
    }

    public OrdemInit() {
        System.out.println("construtor: x = " + x); // (3)
        x = 99;
    }

    public static void main(String[] args) {
        new OrdemInit();
    }
}`} /><h2>Construtor privado: singleton e factory</h2><p>
          Se você marca o construtor como <code>private</code>, ninguém de fora pode usar <code>new</code>. Isso destrava dois padrões clássicos:
        </p><h3>Singleton — uma única instância no programa todo</h3><CodeBlock title="Configuracao.java" code={`public class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    private Configuracao() { }

    public static Configuracao get() {
        return INSTANCIA;
    }
}

// Uso:
Configuracao c = Configuracao.get();`} /><h3>Factory method — método estático que cria instâncias</h3><CodeBlock title="Cor.java" code={`public class Cor {
    int r, g, b;

    private Cor(int r, int g, int b) {
        this.r = r; this.g = g; this.b = b;
    }

    public static Cor rgb(int r, int g, int b) {
        return new Cor(r, g, b);
    }

    public static Cor preto() {
        return new Cor(0, 0, 0);
    }
}

Cor c = Cor.rgb(200, 100, 50);
Cor preto = Cor.preto();`} /><h2>Construtor não é método</h2><p>
          Cuidado com a confusão: construtor parece método, mas não é. Diferenças importantes:
        </p><ul>
          <li>
            Construtor <strong>não tem tipo de retorno</strong> — nem <code>void</code>.
          </li><li>Construtor tem o mesmo nome da classe; método pode ter qualquer nome.</li><li>
            Construtor é chamado automaticamente por <code>new</code>; método é chamado explicitamente.
          </li><li>Construtor não é herdado. Cada classe declara os seus.</li>
        </ul><AlertBox type="tip" title="Pegadinha de prova">
          Se você escreveu <code>public void Pessoa() </code> com <code>void</code>, isso é um <strong>método</strong> chamado <code>Pessoa</code>, não um construtor. O compilador aceita, e o construtor padrão continua sendo gerado. Bug silencioso.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Produto</code> com três construtores: um sem parâmetros (nome "Sem nome", preço 0), um só com nome, e um completo (nome e preço). Use <code>this(...)</code> para evitar repetição.
          </li><li>
            Implemente um Singleton <code>ContadorGlobal</code> com método <code>incrementar()</code> e <code>valor()</code>. Garanta que duas chamadas a <code>ContadorGlobal.get()</code> devolvem a mesma instância.
          </li><li>
            Crie a classe <code>Animal</code> com construtor que recebe <code>especie</code>, e <code>Gato extends Animal</code>. No construtor de <code>Gato</code>, force a chamada de <code>super("Felis catus")</code>. Tente remover essa linha — qual erro o compilador dá?
          </li>
        </ol>
      </PageContainer>
  );
}
