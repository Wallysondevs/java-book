import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Variaveis() {
  return (
    <PageContainer title="Variáveis e Constantes" subtitle="Declaração, escopo, final e a inferência com var." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Variáveis são onde seu programa guarda estado. Se você declarar tudo no lugar errado, com o tipo errado ou com nomes confusos, o código vira um labirinto onde você perde horas para entender de onde vem cada valor. Dominar declaração, escopo e a palavra <code>final</code> é o atalho para escrever código que outras pessoas (e o você do futuro) conseguem ler.
        </p><h2>Declaração tradicional</h2><p>
          A forma clássica de declarar uma variável em Java exige tipo e nome. A atribuição inicial é opcional, mas você só pode usar a variável depois de atribuir algum valor.
        </p><CodeBlock title="Declarando variáveis" code={`public class Exemplo {
    public static void main(String[] args) {
        int idade = 30;
        String nome = "Ana";
        double saldo;
        saldo = 1500.75;

        System.out.println(nome + ", " + idade + " anos, R$ " + saldo);
    }
}`} /><AlertBox type="note" title="Java é estaticamente tipado">
          Uma vez declarada como <code>int</code>, a variável só guarda<code>int</code> até morrer. Tentar atribuir um <code>String</code>depois quebra a compilação. Isso é um recurso, não um problema — o compilador te avisa de erros antes do programa rodar.
        </AlertBox><h2>final: a "constante" do Java</h2><p>
          Uma variável marcada com <code>final</code> só pode ser atribuída uma vez. Se você tentar mudar depois, o compilador reclama. Use<code>final</code> sempre que o valor não deveria mudar — isso documenta intenção e previne bugs.
        </p><CodeBlock title="final em variável local" code={`public class Pedido {
    public static void main(String[] args) {
        final double TAXA_ENTREGA = 9.90;
        double subtotal = 50.00;
        double total = subtotal + TAXA_ENTREGA;

        // TAXA_ENTREGA = 12.00; // erro de compilação

        System.out.println("Total: R$ " + total);
    }
}`} /><h3>final em campo de instância vs static final</h3><p>
          Quando o <code>final</code> está num campo de classe, há duas variações importantes:
        </p><ul>
          <li>
            <strong>final</strong> sem static: o valor é fixado por instância. Cada objeto criado pode ter um valor diferente, mas dentro daquele objeto ele nunca muda.
          </li><li>
            <strong>static final</strong>: é a constante de classe que existe uma vez só, compartilhada por tudo. É o equivalente Java a uma constante global.
          </li>
        </ul><CodeBlock title="Constantes de instância e de classe" code={`public class Circulo {
    public static final double PI = 3.14159265358979;
    private final double raio;

    public Circulo(double raio) {
        this.raio = raio;
    }

    public double area() {
        return PI * raio * raio;
    }
}`} /><AlertBox type="tip" title="final não congela objetos">
          <code>
            {"final List<String> lista = new ArrayList<>();"}
          </code>impede você de reatribuir <code>lista</code>, mas você ainda pode chamar<code>lista.add(...)</code>. <code>final</code> congela a referência, não o conteúdo.
        </AlertBox><h2>Escopo: onde a variável vive</h2><p>
          Escopo é o pedaço do código onde uma variável existe. Em Java o escopo é delimitado por chaves <code>{"{}"}</code>. Existem três níveis básicos:
        </p><ul>
          <li>
            <strong>Bloco</strong> — variável declarada dentro de um <code>if</code>,<code>for</code> ou bloco solto. Morre quando a chave fecha.
          </li><li>
            <strong>Método</strong> — declarada dentro do método. Existe enquanto o método está executando. Também chamada de variável local.
          </li><li>
            <strong>Classe</strong> — declarada fora de qualquer método (campo). Existe enquanto o objeto existe (instância) ou enquanto a classe está carregada (static).
          </li>
        </ul><CodeBlock title="Escopos em camadas" code={`public class Escopo {
    private int campoDeInstancia = 10;        // escopo de classe

    public void mostrar() {
        int local = 5;                         // escopo de método

        if (local > 0) {
            int dentroDoIf = 99;               // escopo de bloco
            System.out.println(dentroDoIf);
        }

        // System.out.println(dentroDoIf);     // não compila

        System.out.println(local + campoDeInstancia);
    }
}`} /><h2>var: inferência de tipo (Java 10+)</h2><p>
          Desde Java 10 você pode usar <code>var</code> em variáveis locais para deixar o compilador deduzir o tipo a partir do valor inicial. Menos repetição, mesmo nível de segurança.
        </p><CodeBlock title="var na prática" code={`import java.util.ArrayList;
import java.util.List;

public class Inferencia {
    public static void main(String[] args) {
        var nome = "Carlos";              // String
        var idade = 25;                   // int
        var preco = 19.90;                // double
        var nomes = new ArrayList<String>(); // ArrayList<String>

        nomes.add("Ana");
        nomes.add("Bia");

        System.out.println(nome + " - " + idade + " - " + preco);
        System.out.println(nomes);
    }
}`} /><h3>Onde var NÃO pode aparecer</h3><ul>
          <li>Em campos de classe (só local).</li><li>Em parâmetros de método.</li><li>Em retorno de método.</li><li>
            Em variável sem inicialização: <code>var x;</code> não compila.
          </li><li>
            Inicializando com <code>null</code>: o compilador não tem como inferir.
          </li>
        </ul><AlertBox type="warning" title="var NÃO é tipagem dinâmica">
          Diferente de Python ou JavaScript, o tipo é decidido em tempo de compilação e fica fixo. <code>var x = 10;</code> é exatamente<code>int x = 10;</code>. Tentar fazer <code>x = "texto";</code> depois quebra a build.
        </AlertBox><h2>Convenções de nomes</h2><p>
          O ecossistema Java segue convenções rígidas. Seguir é importante porque ferramentas, IDEs e revisores de código esperam esse padrão.
        </p><ul>
          <li>
            <strong>camelCase</strong> para variáveis e métodos:<code>nomeCompleto</code>, <code>calcularTotal</code>.
          </li><li>
            <strong>UPPER_SNAKE_CASE</strong> para constantes (<code>static final</code>):<code>TAXA_ENTREGA</code>, <code>MAX_TENTATIVAS</code>.
          </li><li>
            <strong>PascalCase</strong> para classes: <code>ClienteController</code>.
          </li><li>Nada de acentos, espaços ou hifens em identificadores.</li><li>
            Não comece com número. Cifrão <code>$</code> e underscore <code>_</code> são permitidos, mas evite.
          </li>
        </ul><h2>Shadowing: o nome que esconde outro</h2><p>
          Acontece quando uma variável de escopo interno tem o mesmo nome de uma de escopo externo. A interna "ofusca" a externa enquanto está viva.
        </p><CodeBlock title="Shadowing entre campo e parâmetro" code={`public class Pessoa {
    private String nome;

    public Pessoa(String nome) {
        // o parâmetro "nome" sombreia o campo "nome"
        this.nome = nome;
    }

    public void apresentar() {
        String nome = "Convidado"; // sombreia o campo
        System.out.println(nome);          // imprime Convidado
        System.out.println(this.nome);     // imprime o do campo
    }
}`} /><AlertBox type="tip" title="Quando shadowing é útil">
          O caso clássico é o construtor: o parâmetro tem o mesmo nome do campo para deixar a API clara, e você usa <code>this.campo = parametro</code>para distinguir. Fora isso, evite — fonte comum de bugs.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Configuracoes</code> com três constantes<code>static final</code>: <code>VERSAO</code> (String),<code>MAX_USUARIOS</code> (int) e <code>PI</code> (double). Imprima todas no <code>main</code>.
          </li><li>
            Reescreva o trecho abaixo usando <code>var</code> onde for possível e explique em comentário por que algumas declarações ficaram inalteradas:<br /><code>String s = "abc"; int n = 3; double d = 1.5;</code>
          </li><li>
            Escreva um método <code>void</code> que declare uma variável<code>contador</code> dentro de um <code>if</code> e tente usá-la depois do bloco. Observe o erro do compilador, depois mova a declaração para fora e veja o programa compilar.
          </li>
        </ol>
      </PageContainer>
  );
}
