import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Genericos() {
  return (
    <PageContainer title="Tipos Genéricos" subtitle="Type-safety em containers — escreva código que aceita qualquer tipo com segurança." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine uma caixa de papelão. Você pode colocar qualquer coisa dentro: um livro, uma fruta, um sapato. Mas quando alguém vai retirar, precisa adivinhar o que tem ali. Antes do Java 5, era assim que coleções funcionavam: tudo virava <code>Object</code> e você fazia <em>cast</em> manual na esperança de ter guardado a coisa certa.
        </p><CodeBlock title="A dor antes dos genéricos (estilo Java 1.4)" code={`List nomes = new ArrayList();
nomes.add("Maria");
nomes.add(42); // compila! ninguém impede

String primeiro = (String) nomes.get(0); // OK
String segundo = (String) nomes.get(1);  // BOOM em runtime: ClassCastException`} /><p>
          Genéricos resolvem isso colocando uma <strong>etiqueta</strong> na caixa: "essa lista só aceita String". O compilador passa a vigiar você e barra erros antes mesmo do programa rodar.
        </p><h2>Sintaxe básica</h2><p>
          Você declara o tipo dentro de <code>
            {"<>"}
          </code> logo após o nome do tipo genérico. Os mais comuns são <code>List</code>, <code>Set</code> e <code>Map</code>.
        </p><CodeBlock title="Coleções tipadas" code={`import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        // nomes.add(42); // erro de compilacao!

        Map<String, Integer> idades = new HashMap<>();
        idades.put("Ana", 30);
        idades.put("Bruno", 25);

        for (String nome : nomes) {
            System.out.println(nome + " tem " + idades.get(nome) + " anos");
        }
    }
}`} /><AlertBox type="tip" title="Diamond operator (desde Java 7)">
          Repare no <code>
            new ArrayList{"<>"}()
          </code>. O <code>
            {"<>"}
          </code> vazio é chamado de <em>diamond operator</em>: o compilador deduz o tipo a partir da declaração à esquerda. Antes do Java 7 você tinha que escrever <code>
            new ArrayList{"<String>"}()
          </code> de novo.
        </AlertBox><h2>Criando sua própria classe genérica</h2><p>
          Você não precisa só consumir genéricos — pode criar os seus. A ideia é deixar um "espaço em branco" para o tipo, que é preenchido na hora de usar.
        </p><CodeBlock title="Uma Caixa<T> que guarda qualquer coisa com segurança" code={`public class Caixa<T> {
    private T conteudo;

    public void guardar(T item) {
        this.conteudo = item;
    }

    public T retirar() {
        return conteudo;
    }
}

class Demo {
    public static void main(String[] args) {
        Caixa<String> caixaDeTexto = new Caixa<>();
        caixaDeTexto.guardar("Olá!");
        String msg = caixaDeTexto.retirar(); // sem cast!

        Caixa<Integer> caixaDeNumero = new Caixa<>();
        caixaDeNumero.guardar(42);
        int n = caixaDeNumero.retirar();
    }
}`} /><h2>Métodos genéricos</h2><p>
          Um método pode ter seus próprios parâmetros de tipo, independentes da classe. A declaração vem antes do tipo de retorno.
        </p><CodeBlock title="Método que troca o primeiro com o último de qualquer lista" code={`import java.util.List;

public class Utils {
    public static <T> void trocarPontas(List<T> lista) {
        if (lista.size() < 2) return;
        T primeiro = lista.get(0);
        T ultimo = lista.get(lista.size() - 1);
        lista.set(0, ultimo);
        lista.set(lista.size() - 1, primeiro);
    }

    public static void main(String[] args) {
        var nomes = new java.util.ArrayList<>(java.util.List.of("Ana", "Bia", "Caio"));
        trocarPontas(nomes);
        System.out.println(nomes); // [Caio, Bia, Ana]
    }
}`} /><h2>Convenção de nomes</h2><p>Por convenção, use letras maiúsculas curtas para parâmetros de tipo:</p><ul>
          <li>
            <code>T</code> — Type (genérico geral)
          </li><li>
            <code>E</code> — Element (elemento de coleção)
          </li><li>
            <code>K</code>, <code>V</code> — Key e Value (em mapas)
          </li><li>
            <code>R</code> — Return (tipo de retorno em funções)
          </li><li>
            <code>N</code> — Number (numérico)
          </li>
        </ul><h2>Cuidado com primitivos</h2><AlertBox type="warning" title="Genéricos não aceitam int, double, boolean...">
          Você precisa usar as classes wrapper: <code>Integer</code>, <code>Double</code>, <code>Boolean</code>, <code>Character</code>. O Java faz <em>autoboxing</em> automático, mas tem um custo de performance e memória — em cenários hot path considere bibliotecas como Eclipse Collections ou as <code>IntStream</code> especializadas.
        </AlertBox><CodeBlock title="Wrappers em vez de primitivos" code={`List<Integer> numeros = new ArrayList<>();
numeros.add(10);   // autoboxing: int -> Integer
int x = numeros.get(0); // unboxing: Integer -> int

// List<int> numeros = ... // ERRO de compilacao`} /><h2>Os benefícios na prática</h2><ul>
          <li>
            <strong>Erros pegos em tempo de compilação</strong> — não em produção às 3 da manhã.
          </li><li>
            <strong>Sem cast manual</strong> — código mais limpo e legível.
          </li><li>
            <strong>Documentação embutida</strong> — quem lê <code>
              Map{"<String, Usuario>"}
            </code> sabe imediatamente o que esperar.
          </li><li>
            <strong>Refatoração segura</strong> — IDEs sabem exatamente o tipo de cada variável.
          </li>
        </ul><AlertBox type="info" title="Java 21 LTS">
          Tudo nesta página funciona desde Java 5 (genéricos) e Java 7 (diamond). Como usamos Java 21 LTS como base, dá ainda para combinar com <code>var</code> (Java 10+) para deixar a declaração mais enxuta: <code>
            var lista = new ArrayList{"<String>"}()
          </code>.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma classe <code>
              Par{"<A, B>"}
            </code> com dois campos genéricos <code>primeiro</code> e <code>segundo</code> e um método <code>inverter()</code> que retorna um <code>
              Par{"<B, A>"}
            </code>.
          </li><li>
            Escreva um método genérico <code>
              {"<T> T ultimo(List<T> lista)"}
            </code> que devolve o último elemento da lista (ou lança <code>NoSuchElementException</code> se vazia).
          </li><li>
            Crie um <code>
              Map{"<String, List<String>>"}
            </code> que guarda o nome de uma cidade como chave e a lista de bairros como valor. Adicione 2 cidades com 3 bairros cada e imprima.
          </li>
        </ol>
      </PageContainer>
  );
}
