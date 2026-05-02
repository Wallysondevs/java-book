import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EffectiveJava() {
  return (
    <PageContainer title="Effective Java: itens essenciais" subtitle="10 práticas do livro do Joshua Bloch que mudam seu código pra sempre." difficulty="avancado" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          O <em>Effective Java</em>, do Joshua Bloch (arquiteto da plataforma Java na Sun e Google), é a bíblia das microdecisões: aquelas escolhas pequenas que separam código amador de código profissional. Aqui vão 10 itens que você vai usar toda semana.
        </p><h2>
          Item 1 — Prefira <em>static factory methods</em> a construtores
        </h2><p>
          Construtores têm nome obrigatório (o da classe). Factory methods têm nome livre, podem retornar subtipo, podem cachear, podem retornar <code>null</code>/Optional. Veja <code>List.of</code>, <code>Optional.of</code>, <code>Files.newBufferedReader</code>.
        </p><CodeBlock code={`public final class Cor {
    private final int r, g, b;
    private Cor(int r, int g, int b) { this.r = r; this.g = g; this.b = b; }

    public static Cor rgb(int r, int g, int b) { return new Cor(r, g, b); }
    public static Cor hex(String hex)          { /* parse */ return new Cor(0,0,0); }
    public static Cor preto()                  { return PRETO; } // cacheada

    private static final Cor PRETO = new Cor(0, 0, 0);
}`} /><h2>Item 2 — Builder quando há muitos parâmetros</h2><p>
          Quatro ou mais parâmetros (especialmente opcionais) viram um pesadelo de telescoping constructors. Builder dá legibilidade nominal e permite imutabilidade.
        </p><CodeBlock code={`public final class Pizza {
    private final String massa;
    private final List<String> ingredientes;
    private final boolean borda;

    private Pizza(Builder b) {
        this.massa = b.massa;
        this.ingredientes = List.copyOf(b.ingredientes);
        this.borda = b.borda;
    }
    public static class Builder {
        private String massa = "tradicional";
        private List<String> ingredientes = new ArrayList<>();
        private boolean borda = false;
        public Builder massa(String m) { this.massa = m; return this; }
        public Builder ingrediente(String i) { ingredientes.add(i); return this; }
        public Builder bordaRecheada()  { this.borda = true; return this; }
        public Pizza build() { return new Pizza(this); }
    }
}

Pizza p = new Pizza.Builder()
    .massa("fina")
    .ingrediente("queijo")
    .ingrediente("calabresa")
    .bordaRecheada()
    .build();`} /><h2>
          Item 3 — Singleton com <code>enum</code>
        </h2><p>
          A forma mais segura de singleton em Java. Imune a reflexão, serialização e clonagem — coisas que quebram o padrão clássico com construtor privado.
        </p><CodeBlock code={`public enum Configuracao {
    INSTANCIA;

    private final Properties props = carregar();
    public String get(String chave) { return props.getProperty(chave); }
    private Properties carregar() { /* ler arquivo */ return new Properties(); }
}

// Uso:
String url = Configuracao.INSTANCIA.get("db.url");`} /><h2>Item 4 — Não crie objetos desnecessários</h2><p>
          Cada <code>new String("oi")</code> é um desperdício. Cada autoboxing dentro de loop é um vilão silencioso de performance. Reuse imutáveis e cuidado com <code>Long</code>/<code>Integer</code> em soma.
        </p><CodeBlock code={`// Catastrófico — Long causa autoboxing a cada soma (~6× mais lento)
Long soma = 0L;
for (long i = 0; i < 1_000_000; i++) soma += i;

// Bom — primitivo
long soma = 0L;
for (long i = 0; i < 1_000_000; i++) soma += i;`} /><h2>Item 5 — Prefira composição a herança</h2><p>
          Herança quebra encapsulamento: a subclasse fica refém da implementação da superclasse. Composição (ter um, em vez de ser um) é mais flexível e segura.
        </p><CodeBlock code={`// Composição — InstrumentadoSet "tem um" Set, não "é um"
public class InstrumentadoSet<E> {
    private final Set<E> delegate;
    private int adds = 0;
    public InstrumentadoSet(Set<E> delegate) { this.delegate = delegate; }
    public boolean add(E e) { adds++; return delegate.add(e); }
    public int adds() { return adds; }
}`} /><h2>Item 6 — Programe pra interface, não pra implementação</h2><p>
          Declare variáveis, parâmetros e retornos pelo tipo da interface. Trocar <code>ArrayList</code> por <code>LinkedList</code> vira mudança de uma linha.
        </p><CodeBlock code={`// Ruim
ArrayList<String> nomes = new ArrayList<>();

// Bom
List<String> nomes = new ArrayList<>();`} /><h2>Item 7 — Use generics, evite raw types</h2><p>
          <code>List</code> sem <code>
            {"<T>"}
          </code> existe só por compatibilidade com Java 1.4. Você perde checagem em tempo de compilação e ganha <code>ClassCastException</code> em runtime.
        </p><CodeBlock code={`// Ruim — compila, explode em runtime
List nomes = new ArrayList();
nomes.add(42);
String s = (String) nomes.get(0); // ClassCastException

// Bom
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
String s = nomes.get(0); // checado em compilação`} /><h2>Item 8 — Prefira coleções a arrays</h2><p>
          Arrays são covariantes (<code>Object[] a = new String[3]</code> compila) e reificados (carregam tipo em runtime). Misturar arrays e generics é dor. Use <code>
            {"List<T>"}
          </code>.
        </p><CodeBlock code={`// Compila, falha em runtime — ArrayStoreException
Object[] arr = new String[3];
arr[0] = 42;

// Lista — falha em compilação, perfeito
List<String> lista = new ArrayList<>();
// lista.add(42); // não compila`} /><h2>Item 9 — Minimize escopo de variáveis locais</h2><p>
          Declare a variável <strong>onde ela é usada</strong>, não 40 linhas antes. Reduz chance de reuso indevido e facilita extrair métodos.
        </p><CodeBlock code={`// Ruim
int total;
String nome;
// ... 30 linhas ...
total = calcular();
nome = ler();

// Bom
int total = calcular();
String nome = ler();`} /><h2>
          Item 10 — <code>Optional</code> em retorno quando ausência é válida
        </h2><p>
          Documenta no tipo que pode não haver resultado. Não use em campos nem em parâmetros — é só pra retorno de método.
        </p><CodeBlock code={`Optional<Usuario> buscarPorEmail(String email) {
    return repo.findByEmail(email); // pode não existir
}

// Cliente é forçado a tratar
buscarPorEmail("ana@x.com")
    .map(Usuario::nome)
    .ifPresentOrElse(System.out::println, () -> System.out.println("não achado"));`} /><h2>Item bônus — Imutabilidade por padrão</h2><p>
          Toda classe que você escrever deveria nascer imutável. Mude pra mutável só quando houver razão real. Records (Java 16+) deixam isso quase de graça.
        </p><CodeBlock code={`public record Dinheiro(BigDecimal valor, String moeda) {
    public Dinheiro somar(Dinheiro outro) {
        if (!moeda.equals(outro.moeda)) throw new IllegalArgumentException();
        return new Dinheiro(valor.add(outro.valor), moeda);
    }
}`} /><AlertBox type="tip" title="Vai além">
          O livro tem 90 itens. Os outros 80 também valem ouro — leia uns 5 por semana, aplique, e em 4 meses seu Java vira outro.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>Pegue uma classe sua com construtor de 5+ parâmetros. Reescreva com Builder.</li><li>
            Procure num projeto seu loops com <code>Long</code>/<code>Integer</code> sendo somados. Troque pra primitivo, meça com <code>System.nanoTime()</code> antes/depois.
          </li><li>
            Encontre um método que retorna <code>null</code> quando não acha. Refatore pra <code>
              {"Optional<T>"}
            </code> e ajuste os clientes.
          </li>
        </ol>
      </PageContainer>
  );
}
