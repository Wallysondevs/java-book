import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassesAbstratas() {
  return (
    <PageContainer title="Classes Abstratas" subtitle="Modelo parcialmente implementado — não dá pra instanciar diretamente." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine que você está modelando formas geométricas: círculo, quadrado, triângulo. Toda forma tem cor, posição e sabe calcular sua área — mas a fórmula da área é diferente em cada uma. Você quer obrigar quem criar uma nova forma a implementar<code>area()</code>, mas ainda assim aproveitar o código comum (cor, posição, métodos utilitários). Esse é o cenário perfeito pra uma <strong>classe abstrata</strong>.
        </p><p>
          Pense numa classe abstrata como uma planta arquitetônica incompleta: ela define a estrutura geral, deixa alguns cômodos em branco e diz "quem for construir uma casa a partir de mim precisa decidir como serão esses cômodos". Você não consegue morar na planta — só nas casas concretas feitas a partir dela.
        </p><h2>
          A palavra-chave <code>abstract</code>
        </h2><p>
          Você marca uma classe com <code>abstract</code> pra dizer ao compilador: "essa classe não pode ser instanciada com <code>new</code>; ela só serve como base". Dentro dela, métodos também podem ser <code>abstract</code> — declarados sem corpo, deixando a implementação pras subclasses.
        </p><CodeBlock title="Forma.java — base abstrata" code={`public abstract class Forma {
    private String cor;

    public Forma(String cor) {
        this.cor = cor;
    }

    public String getCor() {
        return cor;
    }

    // Método concreto: já tem comportamento pronto
    public void descrever() {
        System.out.println("Sou uma forma " + cor + " com area " + area());
    }

    // Método abstrato: subclasse OBRIGADA a implementar
    public abstract double area();
}`} /><AlertBox type="info" title="Resumo das regras">
          <ul>
            <li>
              Classe <code>abstract</code> pode ter campos, construtores, métodos concretos e abstratos.
            </li><li>
              Não dá pra fazer <code>new Forma("azul")</code> — o compilador reclama.
            </li><li>
              Se uma classe tem ao menos um método abstrato, ela <strong>precisa</strong> ser declarada abstract.
            </li><li>
              Subclasse concreta é obrigada a implementar TODOS os métodos abstratos herdados.
            </li>
          </ul>
        </AlertBox><h2>Implementando a subclasse concreta</h2><CodeBlock title="Circulo.java" code={`public class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }

    @Override
    public double area() {
        return Math.PI * raio * raio;
    }
}

// Em outro lugar:
// Forma f = new Circulo("vermelho", 2.0);
// f.descrever();  // usa código herdado + chama area() do Circulo`} /><p>
          Repare na elegância: <code>descrever()</code> é definido uma vez na classe abstrata, mas internamente chama <code>area()</code> — que cada subclasse implementa do seu jeito. Polimorfismo em ação.
        </p><h2>Quando preferir abstract sobre interface</h2><p>
          Interfaces são contratos puros (em geral). Classes abstratas brilham quando você precisa de duas coisas que interface não dá tão bem:
        </p><ul>
          <li>
            <strong>Estado compartilhado</strong>: campos com dados que toda subclasse vai usar (a cor da forma, o nome do animal, o ID da entidade).
          </li><li>
            <strong>Construtor com lógica</strong>: validar parâmetros, inicializar recursos, registrar em algum lugar.
          </li><li>
            <strong>Código comum não trivial</strong>: vários métodos concretos que reusam estado interno.
          </li>
        </ul><p>
          Regra prática: se você se pega copiando o mesmo método em várias classes que implementam a mesma interface, talvez seja hora de virar uma classe abstrata (ou usar default methods, que veremos em Interfaces).
        </p><h2>Template Method: o padrão clássico</h2><p>
          Um dos usos mais bonitos: a classe abstrata define o <strong>esqueleto</strong> de um algoritmo num método <code>final</code>, e deixa partes específicas como abstratas pras subclasses preencherem. Como um molde de bolo: a forma é fixa, o recheio você escolhe.
        </p><CodeBlock title="Template Method em ação" code={`public abstract class Relatorio {
    // Método final: define a ORDEM e ninguém pode mudar
    public final void gerar() {
        abrirArquivo();
        escreverCabecalho();
        escreverConteudo();   // varia por subclasse
        escreverRodape();
        fecharArquivo();
    }

    private void abrirArquivo()   { System.out.println("[abrindo]"); }
    private void fecharArquivo()  { System.out.println("[fechando]"); }
    protected void escreverCabecalho() { System.out.println("=== Relatório ==="); }
    protected void escreverRodape()    { System.out.println("--- fim ---"); }

    // Subclasse decide o miolo
    protected abstract void escreverConteudo();
}

public class RelatorioVendas extends Relatorio {
    @Override
    protected void escreverConteudo() {
        System.out.println("Vendas do mês: R$ 42.000,00");
    }
}`} /><AlertBox type="tip" title="Por que o método principal é final?">
          Porque a graça do padrão é GARANTIR a ordem das etapas. Se a subclasse pudesse sobrescrever <code>gerar()</code>, ela poderia esquecer de fechar o arquivo, ou chamar tudo fora de ordem. <code>final</code> tranca a sequência.
        </AlertBox><h2>Exemplo real: AbstractList do JDK</h2><p>
          A classe <code>java.util.AbstractList</code> é um caso de uso clássico que você já usa indiretamente. Ela implementa quase todos os métodos da interface <code>List</code>(<code>contains</code>, <code>indexOf</code>, <code>iterator</code>, <code>equals</code>, <code>hashCode</code>...) e deixa só dois métodos abstratos:<code>get(int)</code> e <code>size()</code>.
        </p><p>
          Quem quer criar uma <code>List</code> custom estende <code>AbstractList</code>, implementa os dois métodos e ganha tudo o resto de graça. É exatamente assim que muitas listas internas do JDK são feitas. Esse é o poder de uma boa classe abstrata: levantar 90% do trabalho pra você.
        </p><AlertBox type="warning" title="Cuidado com herança profunda">
          Hierarquias de classes abstratas com 4, 5 níveis viram um pesadelo de manutenção. Prefira composição (objeto que contém outro objeto) sempre que possível. Use abstract de forma rasa e direta.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe abstrata <code>Animal</code> com campo <code>nome</code>, construtor, método concreto <code>apresentar()</code> (imprime "Sou o {"{nome}"} e faço {"{som()}"}") e método abstrato <code>som()</code>. Implemente <code>Cachorro</code> e <code>Gato</code>.
          </li><li>
            Use template method: crie <code>BebidaQuente</code> abstrata com método final<code>preparar()</code> que chama <code>ferverAgua()</code> (concreto), <code>adicionarIngrediente()</code> (abstrato) e <code>servir()</code> (concreto). Implemente <code>Cafe</code> e <code>Cha</code>.
          </li><li>
            Tente fazer <code>new Animal("teste")</code>. Veja a mensagem do compilador. Depois tente NÃO implementar <code>som()</code> em <code>Cachorro</code>. Veja o que acontece. Ler o erro do compilador é parte do aprendizado.
          </li>
        </ol>
      </PageContainer>
  );
}
