import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Effective Java: itens essenciais",subtitle:"10 práticas do livro do Joshua Bloch que mudam seu código pra sempre.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["O ",e.jsx("em",{children:"Effective Java"}),", do Joshua Bloch (arquiteto da plataforma Java na Sun e Google), é a bíblia das microdecisões: aquelas escolhas pequenas que separam código amador de código profissional. Aqui vão 10 itens que você vai usar toda semana."]}),e.jsxs("h2",{children:["Item 1 — Prefira ",e.jsx("em",{children:"static factory methods"})," a construtores"]}),e.jsxs("p",{children:["Construtores têm nome obrigatório (o da classe). Factory methods têm nome livre, podem retornar subtipo, podem cachear, podem retornar ",e.jsx("code",{children:"null"}),"/Optional. Veja ",e.jsx("code",{children:"List.of"}),", ",e.jsx("code",{children:"Optional.of"}),", ",e.jsx("code",{children:"Files.newBufferedReader"}),"."]}),e.jsx(i,{code:`public final class Cor {
    private final int r, g, b;
    private Cor(int r, int g, int b) { this.r = r; this.g = g; this.b = b; }

    public static Cor rgb(int r, int g, int b) { return new Cor(r, g, b); }
    public static Cor hex(String hex)          { /* parse */ return new Cor(0,0,0); }
    public static Cor preto()                  { return PRETO; } // cacheada

    private static final Cor PRETO = new Cor(0, 0, 0);
}`}),e.jsx("h2",{children:"Item 2 — Builder quando há muitos parâmetros"}),e.jsx("p",{children:"Quatro ou mais parâmetros (especialmente opcionais) viram um pesadelo de telescoping constructors. Builder dá legibilidade nominal e permite imutabilidade."}),e.jsx(i,{code:`public final class Pizza {
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
    .build();`}),e.jsxs("h2",{children:["Item 3 — Singleton com ",e.jsx("code",{children:"enum"})]}),e.jsx("p",{children:"A forma mais segura de singleton em Java. Imune a reflexão, serialização e clonagem — coisas que quebram o padrão clássico com construtor privado."}),e.jsx(i,{code:`public enum Configuracao {
    INSTANCIA;

    private final Properties props = carregar();
    public String get(String chave) { return props.getProperty(chave); }
    private Properties carregar() { /* ler arquivo */ return new Properties(); }
}

// Uso:
String url = Configuracao.INSTANCIA.get("db.url");`}),e.jsx("h2",{children:"Item 4 — Não crie objetos desnecessários"}),e.jsxs("p",{children:["Cada ",e.jsx("code",{children:'new String("oi")'})," é um desperdício. Cada autoboxing dentro de loop é um vilão silencioso de performance. Reuse imutáveis e cuidado com ",e.jsx("code",{children:"Long"}),"/",e.jsx("code",{children:"Integer"})," em soma."]}),e.jsx(i,{code:`// Catastrófico — Long causa autoboxing a cada soma (~6× mais lento)
Long soma = 0L;
for (long i = 0; i < 1_000_000; i++) soma += i;

// Bom — primitivo
long soma = 0L;
for (long i = 0; i < 1_000_000; i++) soma += i;`}),e.jsx("h2",{children:"Item 5 — Prefira composição a herança"}),e.jsx("p",{children:"Herança quebra encapsulamento: a subclasse fica refém da implementação da superclasse. Composição (ter um, em vez de ser um) é mais flexível e segura."}),e.jsx(i,{code:`// Composição — InstrumentadoSet "tem um" Set, não "é um"
public class InstrumentadoSet<E> {
    private final Set<E> delegate;
    private int adds = 0;
    public InstrumentadoSet(Set<E> delegate) { this.delegate = delegate; }
    public boolean add(E e) { adds++; return delegate.add(e); }
    public int adds() { return adds; }
}`}),e.jsx("h2",{children:"Item 6 — Programe pra interface, não pra implementação"}),e.jsxs("p",{children:["Declare variáveis, parâmetros e retornos pelo tipo da interface. Trocar ",e.jsx("code",{children:"ArrayList"})," por ",e.jsx("code",{children:"LinkedList"})," vira mudança de uma linha."]}),e.jsx(i,{code:`// Ruim
ArrayList<String> nomes = new ArrayList<>();

// Bom
List<String> nomes = new ArrayList<>();`}),e.jsx("h2",{children:"Item 7 — Use generics, evite raw types"}),e.jsxs("p",{children:[e.jsx("code",{children:"List"})," sem ",e.jsx("code",{children:"<T>"})," existe só por compatibilidade com Java 1.4. Você perde checagem em tempo de compilação e ganha ",e.jsx("code",{children:"ClassCastException"})," em runtime."]}),e.jsx(i,{code:`// Ruim — compila, explode em runtime
List nomes = new ArrayList();
nomes.add(42);
String s = (String) nomes.get(0); // ClassCastException

// Bom
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
String s = nomes.get(0); // checado em compilação`}),e.jsx("h2",{children:"Item 8 — Prefira coleções a arrays"}),e.jsxs("p",{children:["Arrays são covariantes (",e.jsx("code",{children:"Object[] a = new String[3]"})," compila) e reificados (carregam tipo em runtime). Misturar arrays e generics é dor. Use ",e.jsx("code",{children:"List<T>"}),"."]}),e.jsx(i,{code:`// Compila, falha em runtime — ArrayStoreException
Object[] arr = new String[3];
arr[0] = 42;

// Lista — falha em compilação, perfeito
List<String> lista = new ArrayList<>();
// lista.add(42); // não compila`}),e.jsx("h2",{children:"Item 9 — Minimize escopo de variáveis locais"}),e.jsxs("p",{children:["Declare a variável ",e.jsx("strong",{children:"onde ela é usada"}),", não 40 linhas antes. Reduz chance de reuso indevido e facilita extrair métodos."]}),e.jsx(i,{code:`// Ruim
int total;
String nome;
// ... 30 linhas ...
total = calcular();
nome = ler();

// Bom
int total = calcular();
String nome = ler();`}),e.jsxs("h2",{children:["Item 10 — ",e.jsx("code",{children:"Optional"})," em retorno quando ausência é válida"]}),e.jsx("p",{children:"Documenta no tipo que pode não haver resultado. Não use em campos nem em parâmetros — é só pra retorno de método."}),e.jsx(i,{code:`Optional<Usuario> buscarPorEmail(String email) {
    return repo.findByEmail(email); // pode não existir
}

// Cliente é forçado a tratar
buscarPorEmail("ana@x.com")
    .map(Usuario::nome)
    .ifPresentOrElse(System.out::println, () -> System.out.println("não achado"));`}),e.jsx("h2",{children:"Item bônus — Imutabilidade por padrão"}),e.jsx("p",{children:"Toda classe que você escrever deveria nascer imutável. Mude pra mutável só quando houver razão real. Records (Java 16+) deixam isso quase de graça."}),e.jsx(i,{code:`public record Dinheiro(BigDecimal valor, String moeda) {
    public Dinheiro somar(Dinheiro outro) {
        if (!moeda.equals(outro.moeda)) throw new IllegalArgumentException();
        return new Dinheiro(valor.add(outro.valor), moeda);
    }
}`}),e.jsx(a,{type:"tip",title:"Vai além",children:"O livro tem 90 itens. Os outros 80 também valem ouro — leia uns 5 por semana, aplique, e em 4 meses seu Java vira outro."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Pegue uma classe sua com construtor de 5+ parâmetros. Reescreva com Builder."}),e.jsxs("li",{children:["Procure num projeto seu loops com ",e.jsx("code",{children:"Long"}),"/",e.jsx("code",{children:"Integer"})," sendo somados. Troque pra primitivo, meça com ",e.jsx("code",{children:"System.nanoTime()"})," antes/depois."]}),e.jsxs("li",{children:["Encontre um método que retorna ",e.jsx("code",{children:"null"})," quando não acha. Refatore pra ",e.jsx("code",{children:"Optional<T>"})," e ajuste os clientes."]})]})]})}export{n as default};
