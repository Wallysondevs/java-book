import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Classes() {
  return (
    <PageContainer title="Classes & Objetos" subtitle="O alicerce da orientação a objetos — definir tipos próprios." difficulty="iniciante" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine modelar um sistema de banco usando só <code>int</code>, <code>String</code> e arrays. Você teria três arrays paralelos para nome, saldo e CPF, e qualquer descuido misturaria o saldo do João com o CPF da Maria. <strong>Classes</strong> resolvem isso: elas deixam você criar um tipo novo (<em>Conta</em>, <em>Cliente</em>, <em>Pedido</em>) que junta dados e comportamento num pacote só. É a forma como Java organiza praticamente tudo — desde <code>String</code> até frameworks inteiros.
        </p><h2>A analogia da planta da casa</h2><p>
          Uma <strong>classe</strong> é a planta arquitetônica: descreve o que a coisa tem (paredes, portas) e o que ela faz (abrir porta, acender luz). Um <strong>objeto</strong> é a casa construída a partir dessa planta. Você desenha a planta uma vez, e constrói quantas casas quiser — cada uma com suas próprias paredes, mas todas seguindo o mesmo molde.
        </p><h2>Definindo sua primeira classe</h2><p>
          Uma classe tem dois ingredientes principais: <strong>campos</strong> (o estado, os dados que ela guarda) e <strong>métodos</strong> (o comportamento, o que ela sabe fazer).
        </p><CodeBlock title="Pessoa.java" code={`public class Pessoa {
    String nome;
    int idade;

    void apresentar() {
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}`} /><p>
          Aqui <code>nome</code> e <code>idade</code> são campos. <code>apresentar()</code> é um método. Sozinha, essa classe não faz nada — você precisa criar um objeto a partir dela.
        </p><h2>Criando objetos com new</h2><p>
          A palavra-chave <code>new</code> aloca memória para uma nova instância e devolve uma referência para ela. Você guarda essa referência numa variável.
        </p><CodeBlock title="Main.java" code={`public class Main {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa();
        p1.nome = "Ana";
        p1.idade = 30;
        p1.apresentar();

        Pessoa p2 = new Pessoa();
        p2.nome = "Bruno";
        p2.idade = 25;
        p2.apresentar();
    }
}`} /><p>
          Cada <code>new Pessoa()</code> cria um objeto independente. Mexer em <code>p1.nome</code> não afeta <code>p2.nome</code>. São casas diferentes, construídas pela mesma planta.
        </p><h2>O this referenciando a instância atual</h2><p>
          Dentro de um método de instância, <code>this</code> aponta para o objeto que está executando o método. É útil quando o nome de um parâmetro colide com o nome de um campo:
        </p><CodeBlock title="Carro.java" code={`public class Carro {
    String modelo;
    int ano;

    void configurar(String modelo, int ano) {
        this.modelo = modelo;
        this.ano = ano;
    }
}`} /><p>
          Sem o <code>this</code>, <code>modelo = modelo</code> só atribuiria o parâmetro a ele mesmo (e o campo continuaria <code>null</code>). O <code>this.modelo</code> deixa claro: "o campo desta instância recebe o valor do parâmetro".
        </p><AlertBox type="tip" title="Você não precisa do this o tempo todo">
          Quando não há ambiguidade, pode escrever só <code>modelo</code> dentro do método. O compilador entende que é o campo. Mas usar <code>this</code> sempre também é válido e deixa o código mais explícito.
        </AlertBox><h2>Uma classe pública por arquivo</h2><p>
          Regra do compilador Java: cada arquivo <code>.java</code> pode ter <strong>
            no máximo uma classe declarada como <code>public</code>
          </strong>, e o nome do arquivo precisa bater com o nome dessa classe. Se sua classe <code>public</code> chama <code>Pessoa</code>, o arquivo precisa se chamar <code>Pessoa.java</code>. Você pode ter outras classes auxiliares no mesmo arquivo, desde que não sejam <code>public</code>.
        </p><CodeBlock title="Pessoa.java (com classe auxiliar)" code={`public class Pessoa {
    String nome;
}

class Endereco {
    String rua;
    String cidade;
}`} /><h2>Igualdade vs identidade</h2><p>
          Esse é o pega-ratão clássico de quem vem de Python ou JavaScript. Em Java, o operador <code>==</code> aplicado a objetos compara <strong>referências</strong> — ou seja, pergunta "são literalmente o mesmo objeto na memória?". Já <code>.equals()</code> compara <strong>conteúdo</strong> — "esses dois objetos têm os mesmos dados?".
        </p><CodeBlock title="IgualdadeVsIdentidade.java" code={`public class IgualdadeVsIdentidade {
    public static void main(String[] args) {
        String a = new String("oi");
        String b = new String("oi");

        System.out.println(a == b);        // false — referências diferentes
        System.out.println(a.equals(b));   // true  — mesmo conteúdo

        String c = a;
        System.out.println(a == c);        // true  — mesma referência
    }
}`} /><AlertBox type="warning" title="Erro de iniciante">
          Comparar Strings com <code>==</code> funciona <em>às vezes</em> por causa de uma otimização chamada <em>string pool</em>, mas é frágil. <strong>
            Sempre use <code>.equals()</code>
          </strong> para comparar conteúdo de objetos.
        </AlertBox><h2>Métodos retornam coisas (ou não)</h2><p>
          Quando um método tem algo a devolver, declare o tipo de retorno antes do nome. Se ele só executa uma ação, use <code>void</code>.
        </p><CodeBlock title="Calculadora.java" code={`public class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }

    void imprimirSoma(int a, int b) {
        System.out.println(a + b);
    }
}`} /><h2>Referências, não cópias</h2><p>
          Quando você atribui um objeto a outra variável (<code>Pessoa p2 = p1;</code>), você copia a <strong>referência</strong>, não o objeto. As duas variáveis apontam para a mesma casa. Mexer numa, mexe na outra. Isso vai aparecer muito no seu código — e em bugs sutis.
        </p><CodeBlock title="Referencia.java" code={`Pessoa p1 = new Pessoa();
p1.nome = "Ana";

Pessoa p2 = p1;
p2.nome = "Beatriz";

System.out.println(p1.nome); // Beatriz`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>Livro</code> com campos <code>titulo</code>, <code>autor</code> e <code>paginas</code>, e um método <code>resumo()</code> que imprime tudo formatado. Instancie 3 livros e chame o método em cada.
          </li><li>
            Adicione um método <code>configurar(String titulo, String autor, int paginas)</code> em <code>Livro</code> usando <code>this</code> para resolver a ambiguidade. Use-o em vez de atribuir campo por campo.
          </li><li>
            Crie duas <code>String</code> com o mesmo conteúdo (uma com <code>new String("a")</code> e outra também). Compare com <code>==</code> e com <code>.equals()</code>. Em seguida atribua uma à outra e compare de novo. Explique o resultado para você mesmo, em voz alta — isso fixa.
          </li>
        </ol>
      </PageContainer>
  );
}
