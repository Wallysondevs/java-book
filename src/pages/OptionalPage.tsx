import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OptionalPage() {
  return (
    <PageContainer title="Optional" subtitle="Adeus NullPointerException — encapsule pode-não-ter-valor explicitamente." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          <code>NullPointerException</code> é apelidada de "o erro de bilhão de dólares" — o próprio criador do <code>null</code>, Tony Hoare, pediu desculpas em público por tê-lo inventado. <code>Optional</code>, que chegou no Java 8, ataca o problema na raiz: em vez de devolver <code>null</code> e torcer pra quem chamou lembrar de checar, você devolve um objeto que <strong>obriga</strong> o consumidor a tratar a ausência.
        </p><CodeBlock title="O que Optional resolve" code={`// Antes: facil esquecer da checagem
public Usuario buscar(String email) {
    // pode retornar null
}
Usuario u = buscar("ana@x.com");
System.out.println(u.getNome()); // BOOM se for null

// Depois: o tipo grita "pode nao existir"
public Optional<Usuario> buscar(String email) { ... }
buscar("ana@x.com").ifPresent(u -> System.out.println(u.getNome()));`} /><h2>Criando um Optional</h2><CodeBlock code={`import java.util.Optional;

// Quando voce TEM CERTEZA que o valor nao e null:
Optional<String> a = Optional.of("Java");

// Quando o valor PODE ser null:
Optional<String> b = Optional.ofNullable(possivelmenteNulo);

// Vazio explicito:
Optional<String> c = Optional.empty();

// CUIDADO: of(null) lanca NullPointerException na hora.`} /><h2>Consumindo: do pior ao melhor</h2><p>Existem várias formas de extrair o valor. A ordem da pior para a melhor:</p><CodeBlock title="get() — quase nunca use" code={`Optional<String> nome = buscarNome();
String n = nome.get(); // NoSuchElementException se vazio

// Use so quando voce ja garantiu antes que tem valor.
// Codigo melhor: use orElse, ifPresent ou map.`} /><CodeBlock title="isPresent / isEmpty (Java 11+)" code={`if (nome.isPresent()) {
    System.out.println(nome.get());
}
if (nome.isEmpty()) {
    System.out.println("Sem nome");
}

// Funciona, mas e o estilo "if-de-null disfarcado" — prefira ifPresent.`} /><CodeBlock title="ifPresent / ifPresentOrElse (Java 9+)" code={`nome.ifPresent(n -> System.out.println("Olá " + n));

nome.ifPresentOrElse(
    n -> System.out.println("Olá " + n),
    () -> System.out.println("Visitante anonimo")
);`} /><h2>Transformando com map e flatMap</h2><p>
          Você pode encadear operações sem se preocupar com null entre elas. Se em algum ponto da cadeia o valor é vazio, o restante simplesmente não roda.
        </p><CodeBlock title="map: transforma o valor (se houver)" code={`Optional<String> nome = Optional.of("ana");
Optional<Integer> tamanho = nome.map(String::length);
// Optional[3]

Optional<String> vazio = Optional.empty();
Optional<Integer> nada = vazio.map(String::length);
// Optional.empty (sem NPE)`} /><CodeBlock title="flatMap: quando a função já devolve Optional" code={`record Usuario(String nome, Optional<String> apelido) {}

Optional<Usuario> u = Optional.of(new Usuario("Ana", Optional.of("Aninha")));

// Sem flatMap viraria Optional<Optional<String>> — feio
Optional<String> apelido = u.flatMap(Usuario::apelido);
// Optional[Aninha]`} /><CodeBlock title="filter: condicional embutido" code={`Optional<Integer> idade = Optional.of(22);

Optional<Integer> adulto = idade.filter(i -> i >= 18);
// Optional[22]

Optional<Integer> crianca = Optional.of(10).filter(i -> i >= 18);
// Optional.empty`} /><h2>Valor padrão: orElse, orElseGet, orElseThrow</h2><CodeBlock title="As três variantes" code={`String nome1 = buscarNome().orElse("Anonimo");
// Sempre AVALIA "Anonimo", mesmo se houver valor.

String nome2 = buscarNome().orElseGet(() -> calcularPadrao());
// Preguicoso: so chama o supplier se for vazio.

String nome3 = buscarNome().orElseThrow(); // NoSuchElementException
String nome4 = buscarNome().orElseThrow(
    () -> new IllegalStateException("usuario sem nome")
);`} /><AlertBox type="tip" title="orElse vs orElseGet">
          Use <code>orElse</code> com valores baratos (constantes, literais). Use <code>orElseGet</code> quando o padrão exigir cálculo, criação de objeto ou chamada de método — assim você não paga o custo se o valor existir.
        </AlertBox><h2>Como usar (e como NÃO usar)</h2><AlertBox type="success" title="Use Optional como tipo de RETORNO">
          Quando seu método pode legitimamente não ter resposta (busca em repositório, configuração opcional, cache miss), devolva <code>Optional</code>. Quem consumir é forçado a pensar no caso vazio.
        </AlertBox><AlertBox type="danger" title="NÃO use Optional como…">
          <ul>
            <li>
              <strong>Campo de classe</strong> — Optional não é serializável e ocupa espaço extra. Para campos opcionais, deixe o tipo nullable e documente.
            </li><li>
              <strong>Parâmetro de método</strong> — quem chama precisa embrulhar tudo em Optional, e ainda assim pode passar <code>null</code>. Em vez disso, faça sobrecarga de método ou aceite o tipo direto.
            </li><li>
              <strong>Em coleções</strong> — <code>
                List{"<Optional<String>>"}
              </code> é quase sempre sintoma de design errado. Filtre os ausentes antes.
            </li>
          </ul>
        </AlertBox><h2>Combinando com Stream</h2><p>
          Stream e Optional foram pensados pra trabalhar juntos. Métodos como <code>findFirst</code> e <code>findAny</code> já devolvem <code>Optional</code>.
        </p><CodeBlock title="Pipeline natural" code={`import java.util.List;

record Produto(String nome, double preco) {}

List<Produto> catalogo = List.of(
    new Produto("Notebook", 4500),
    new Produto("Mouse", 80),
    new Produto("Teclado", 200)
);

String maisCaro = catalogo.stream()
    .filter(p -> p.preco() > 100)
    .max((a, b) -> Double.compare(a.preco(), b.preco()))
    .map(Produto::nome)
    .orElse("nenhum encontrado");

System.out.println(maisCaro); // Notebook`} /><CodeBlock title="Optional.stream() — Java 9+" code={`// Achata uma lista de Optionals filtrando os vazios
List<Optional<String>> brutos = List.of(
    Optional.of("a"), Optional.empty(), Optional.of("c")
);

List<String> limpos = brutos.stream()
    .flatMap(Optional::stream)
    .toList();
// [a, c]`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um método <code>
              Optional{"<Integer>"} parseSeguro(String s)
            </code> que devolve <code>Optional.empty()</code> se a string não for um número. Use-o numa lista de strings e some os números válidos.
          </li><li>
            Modele um <code>
              {"record Cliente(String nome, Optional<String> cpf)"}
            </code>. Crie uma lista, e use <code>flatMap</code> + <code>Optional::stream</code> para gerar uma lista só com os CPFs informados.
          </li><li>
            Reescreva esse trecho usando Optional sem <code>if</code>: <code>String r = obj == null ? "vazio" : obj.toUpperCase();</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
