import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Polimorfismo() {
  return (
    <PageContainer title="Polimorfismo" subtitle="Mesma chamada, comportamentos diferentes — o coração da OOP." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine um código de checkout que precisa lidar com 5 formas de pagamento. Sem polimorfismo, você escreve um <code>switch</code> gigante: "se for cartão faz isso, se for boleto faz aquilo, se for Pix...". Toda forma nova de pagamento exige editar esse <code>switch</code>. Com polimorfismo, você define um tipo <code>FormaPagamento</code> com método <code>cobrar()</code>, e cada implementação cuida de si mesma. Adicionar um Pagamento Cripto vira escrever uma classe nova — sem tocar no checkout.
        </p><h2>A analogia do controle remoto</h2><p>
          O botão "play" do controle remoto funciona com TV, com aparelho de som, com Blu-ray. A <em>chamada</em> é a mesma; o <em>comportamento</em> depende de quem está recebendo. Polimorfismo (do grego "muitas formas") é exatamente isso: uma única interface que se manifesta de jeitos diferentes.
        </p><h2>Polimorfismo de subtipo</h2><p>
          A forma mais comum: uma variável declarada como <code>Animal</code> pode segurar uma instância de <code>Cachorro</code>, <code>Gato</code> ou qualquer subclasse. Quando você chama um método nessa variável, Java executa a versão correta da subclasse — e não a da superclasse.
        </p><CodeBlock title="Polimorfismo em ação" code={`public class Animal {
    public void emitirSom() {
        System.out.println("Algum som genérico.");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animais = { new Cachorro(), new Gato(), new Animal() };
        for (Animal a : animais) {
            a.emitirSom();
        }
    }
}
// Saída:
// Au au!
// Miau!
// Algum som genérico.`} /><p>
          Olha que poderoso: o <code>for</code> só conhece <code>Animal</code>, mas cada elemento responde do seu jeito. Adicionar um <code>Vaca extends Animal</code> com <code>"Muu!"</code> não exige mudar o loop.
        </p><h2>Upcast: implícito e seguro</h2><p>
          Atribuir uma referência de subclasse a uma variável de superclasse é o <strong>upcast</strong>. Java faz isso automaticamente porque é seguro — todo <code>Cachorro</code> "é um" <code>Animal</code>.
        </p><CodeBlock title="Upcast" code={`Cachorro rex = new Cachorro();
Animal a = rex;          // upcast implícito, sem cast
a.emitirSom();           // Au au! — virtual dispatch escolhe a versão certa`} /><h2>Downcast: explícito e arriscado</h2><p>
          O contrário — pegar uma referência de <code>Animal</code> e tratar como <code>Cachorro</code> — exige cast explícito, e dispara <code>ClassCastException</code> em runtime se o objeto não for daquele tipo.
        </p><CodeBlock title="Downcast" code={`Animal a = new Cachorro();
Cachorro c = (Cachorro) a;   // OK, é mesmo um Cachorro
c.latir();

Animal outro = new Gato();
Cachorro errado = (Cachorro) outro;   // ClassCastException em runtime!`} /><h2>instanceof: verificando antes do cast</h2><p>Para evitar a explosão, você verifica antes:</p><CodeBlock title="instanceof tradicional" code={`Animal a = obterAnimal();

if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.latir();
}`} /><h2>Pattern matching para instanceof (desde Java 16)</h2><p>
          Desde o Java 16 você não precisa mais do cast explícito depois do <code>instanceof</code>. Declare a variável direto na verificação:
        </p><CodeBlock title="Pattern matching" code={`Animal a = obterAnimal();

if (a instanceof Cachorro c) {
    c.latir(); // c já é Cachorro, sem cast manual
}

// Funciona com else / negação também:
if (!(a instanceof Cachorro c)) {
    return;
}
c.latir(); // c continua disponível aqui`} /><AlertBox type="tip" title="Use sempre que puder">
          Pattern matching reduz boilerplate e evita o risco de você editar o tipo no <code>instanceof</code> e esquecer de atualizar o cast. Java 21 ainda traz pattern matching para <code>switch</code>, levando isso muito mais longe — abordamos numa página específica.
        </AlertBox><h2>Virtual dispatch: a mágica por trás</h2><p>
          Quando você chama <code>a.emitirSom()</code> e <code>a</code> é declarada como <code>Animal</code>, como Java sabe rodar a versão de <code>Cachorro</code>? Resposta: <strong>late binding</strong> (também chamado de <em>virtual dispatch</em>). Em tempo de execução, a JVM olha qual é o tipo real do objeto e despacha para o método correto.
        </p><p>
          Em Java, <strong>todo método de instância é virtual por padrão</strong>. Não tem <code>virtual</code> keyword como em C++ — já vem ligado. As exceções são:
        </p><ul>
          <li>
            Métodos <code>static</code> — pertencem à classe, não à instância. Não são polimórficos.
          </li><li>
            Métodos <code>final</code> — não podem ser sobrescritos, então não há "versão alternativa" pra escolher.
          </li><li>
            Métodos <code>private</code> — não são visíveis às subclasses, então também não participam.
          </li>
        </ul><CodeBlock title="static não é polimórfico" code={`public class Pai {
    public static void m() { System.out.println("Pai"); }
}

public class Filho extends Pai {
    public static void m() { System.out.println("Filho"); }
}

Pai p = new Filho();
p.m();          // imprime "Pai" — static usa o tipo declarado, não o real
Filho.m();      // imprime "Filho"`} /><h2>Overloading vs overriding</h2><p>
          Os dois envolvem "vários métodos com mesmo nome", mas são fundamentalmente diferentes. <strong>Não confunda</strong>:
        </p><h3>Overloading (sobrecarga) — polimorfismo de compilação</h3><p>
          Vários métodos na <strong>mesma classe</strong>, com o mesmo nome mas <strong>listas de parâmetros diferentes</strong>. O compilador escolhe qual chamar com base nos tipos dos argumentos. É decidido em tempo de compilação.
        </p><CodeBlock title="Overloading" code={`public class Calc {
    public int somar(int a, int b) { return a + b; }
    public double somar(double a, double b) { return a + b; }
    public int somar(int a, int b, int c) { return a + b + c; }
}

Calc c = new Calc();
c.somar(1, 2);          // chama versão (int, int)
c.somar(1.5, 2.5);      // chama versão (double, double)
c.somar(1, 2, 3);       // chama versão de 3 args`} /><h3>Overriding (sobrescrita) — polimorfismo de runtime</h3><p>
          Subclasse <strong>redefine</strong> um método herdado da superclasse, com <strong>mesma assinatura</strong>. A escolha de qual versão executar é feita em runtime, baseada no tipo real do objeto.
        </p><CodeBlock title="Overriding" code={`public class Animal {
    public void emitirSom() { System.out.println("som"); }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() { System.out.println("Au au"); }
}

Animal a = new Cachorro();
a.emitirSom(); // Au au — escolhido em runtime`} /><AlertBox type="warning" title="Resumo da diferença">
          <strong>Overloading</strong>: mesmo nome, parâmetros diferentes, mesma classe, decidido em compilação. <strong>Overriding</strong>: mesma assinatura, classes diferentes (pai/filha), decidido em runtime. Overloading é estática, overriding é dinâmica.
        </AlertBox><h2>Interfaces: polimorfismo mais flexível</h2><p>
          Herança de classe é poderosa mas restritiva — você só estende uma classe. Já <strong>interfaces</strong> deixam você dizer "essa classe se compromete a saber fazer X" sem amarrar a hierarquia. E uma classe pode implementar várias interfaces.
        </p><CodeBlock title="Interfaces como base de polimorfismo" code={`public interface FormaPagamento {
    void cobrar(double valor);
}

public class Cartao implements FormaPagamento {
    @Override
    public void cobrar(double valor) {
        System.out.println("Debitando " + valor + " no cartão.");
    }
}

public class Pix implements FormaPagamento {
    @Override
    public void cobrar(double valor) {
        System.out.println("Pix de " + valor + " enviado.");
    }
}

public class Checkout {
    public void finalizar(FormaPagamento fp, double valor) {
        fp.cobrar(valor); // não importa qual implementação — funciona
    }
}`} /><p>
          Esse padrão é a base de praticamente todo framework moderno. Spring, JDBC, coleções do Java — tudo trabalha contra interfaces, não contra classes concretas. Você consegue trocar implementações sem mexer no código que consome.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Modele <code>Forma</code> (área genérica = 0) com filhas <code>Circulo</code>, <code>Quadrado</code> e <code>Triangulo</code>, cada uma com sua fórmula de <code>area()</code>. Crie um array <code>Forma[]</code>, popule com 5 formas variadas, e some todas as áreas num único loop.
          </li><li>
            Crie um método que recebe <code>Object obj</code> e usa pattern matching com <code>instanceof</code> para imprimir mensagens diferentes se for <code>String</code>, <code>Integer</code> ou outro tipo. Teste com 3 valores variados.
          </li><li>
            Defina <code>interface Notificador</code> com método <code>notificar(String msg)</code>. Implemente <code>EmailNotificador</code> e <code>SmsNotificador</code>. Crie uma classe <code>SistemaAlertas</code> com lista de <code>Notificador</code> e método <code>disparar(String msg)</code> que chama todos. Adicione um terceiro notificador (Slack, Telegram, o que quiser) — note que <code>SistemaAlertas</code> não muda.
          </li>
        </ol>
      </PageContainer>
  );
}
