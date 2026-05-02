import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PatternMatching() {
  return (
    <PageContainer title="Pattern Matching e switch expressions" subtitle="Switch deixou de ser cláusula imperativa — virou expressão poderosa (Java 21)." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          O Java passou décadas com um <code>switch</code> herdado do C: cheio de<code>break</code>, fall-through traiçoeiro, sem retornar valor. E pra checar tipo a gente fazia <code>instanceof</code> + cast feio. Tudo isso melhorou drasticamente nas versões recentes — e em Java 21 ficou pronto pra produção.
        </p><h2>Pattern matching para instanceof (Java 16+)</h2><p>Antes você fazia o ritual chato:</p><CodeBlock title="Velho jeito" code={`if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}`} /><p>
          Agora declara a variável dentro do <code>instanceof</code> e usa direto:
        </p><CodeBlock title="Novo jeito" code={`if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}

// Funciona até com negação:
if (!(obj instanceof String s)) return;
System.out.println(s.length()); // s está disponível aqui`} /><AlertBox type="tip" title="Escopo é esperto">
          O compilador sabe onde a variável é seguramente do tipo testado e onde não é. Você não precisa declarar nada. É chamado <em>flow scoping</em>.
        </AlertBox><h2>switch como expressão (Java 14+)</h2><p>
          O <code>switch</code> agora pode <strong>retornar valor</strong> com a sintaxe de seta (<code>{"->"}</code>), sem fall-through e sem <code>break</code>:
        </p><CodeBlock code={`enum Dia { SEG, TER, QUA, QUI, SEX, SAB, DOM }

String tipo = switch (dia) {
    case SEG, TER, QUA, QUI, SEX -> "útil";
    case SAB, DOM -> "fim de semana";
};`} /><p>
          Precisa de bloco com várias linhas? Use chaves e <code>yield</code> pra "retornar":
        </p><CodeBlock code={`int valor = switch (codigo) {
    case "A" -> 1;
    case "B" -> 2;
    default -> {
        log.warn("código desconhecido: {}", codigo);
        yield -1;
    }
};`} /><h2>Type patterns no switch (Java 21)</h2><p>
          Combine switch expression + pattern matching e tchau cadeia de<code>if/instanceof</code>:
        </p><CodeBlock title="Despachando por tipo" code={`String descricao = switch (obj) {
    case Integer i -> "inteiro: " + i;
    case Long l    -> "long: " + l;
    case String s  -> "string de " + s.length() + " chars";
    case null      -> "veio nulo!";
    default        -> "outro tipo: " + obj.getClass().getSimpleName();
};`} /><AlertBox type="info" title="case null">
          Antes do Java 21, passar <code>null</code> num switch dava NullPointerException. Agora você pode tratar como case próprio — opcional, mas seguro.
        </AlertBox><h2>Record patterns (Java 21)</h2><p>
          Se você tem um <code>record</code>, dá pra desestruturar dentro do case. Cabe o cérebro inteiro num exemplo:
        </p><CodeBlock code={`record Ponto(int x, int y) {}
record Circulo(Ponto centro, double raio) {}
record Retangulo(Ponto inicio, Ponto fim) {}

sealed interface Forma permits Circulo, Retangulo {}

double area(Forma f) {
    return switch (f) {
        case Circulo(Ponto c, double r)        -> Math.PI * r * r;
        case Retangulo(Ponto a, Ponto b)       ->
            Math.abs((b.x() - a.x()) * (b.y() - a.y()));
    };
}`} /><p>
          Repare: o compilador sabe que <code>Forma</code> é <code>sealed</code> com só duas implementações. Não precisa <code>default</code> — <strong>exaustividade</strong>garantida.
        </p><h2>Record patterns aninhados</h2><CodeBlock code={`// Desempacota Circulo e o Ponto interno de uma vez
String descricao = switch (forma) {
    case Circulo(Ponto(int cx, int cy), double r) ->
        "círculo em (" + cx + "," + cy + ") raio " + r;
    case Retangulo(Ponto(int x1, int y1), Ponto(int x2, int y2)) ->
        "retângulo de (" + x1 + "," + y1 + ") até (" + x2 + "," + y2 + ")";
};`} /><h2>Guarded patterns: case com condição extra</h2><p>
          A palavra-chave <code>when</code> adiciona condição ao case:
        </p><CodeBlock code={`String classificar(Object obj) {
    return switch (obj) {
        case Integer i when i < 0   -> "negativo";
        case Integer i when i == 0  -> "zero";
        case Integer i              -> "positivo: " + i;
        case String s when s.isBlank() -> "string vazia";
        case String s               -> "string: " + s;
        case null, default          -> "outro";
    };
}`} /><AlertBox type="warning" title="Ordem importa">
          Os <code>when</code> são checados de cima pra baixo. Coloque os casos mais específicos antes dos genéricos.
        </AlertBox><h2>Exaustividade com sealed</h2><p>
          Quando o tipo do switch é <code>sealed</code>, o compilador <strong>exige</strong>que você cubra todas as variantes — ou usa <code>default</code>. Se amanhã alguém adicionar uma nova subclasse, o compilador grita em todos os switches afetados. Isso é ouro pra refactor seguro.
        </p><CodeBlock code={`sealed interface Pagamento permits Pix, Cartao, Boleto {}
record Pix(String chave) implements Pagamento {}
record Cartao(String numero, int parcelas) implements Pagamento {}
record Boleto(String linhaDigitavel) implements Pagamento {}

double taxa(Pagamento p) {
    return switch (p) {
        case Pix x        -> 0.0;
        case Cartao c     -> c.parcelas() > 1 ? 2.99 : 0.99;
        case Boleto b     -> 1.50;
    }; // sem default — compilador feliz
}`} /><h2>switch tradicional ainda funciona</h2><p>
          A sintaxe antiga (com <code>:</code>, <code>break</code>, fall-through) continua válida pra compatibilidade. Mas pra código novo: prefira sempre a forma com<code>{"->"}</code>. É mais segura e mais expressiva.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Refatore um trecho seu com <code>if/else if</code> de <code>instanceof</code>+ cast pra usar pattern matching.
          </li><li>
            Crie uma <code>sealed interface Notificacao</code> com records<code>Email</code>, <code>SMS</code> e <code>Push</code>. Escreva uma função<code>enviar(Notificacao n)</code> usando switch expression — sem default.
          </li><li>
            Faça uma função <code>tipoNumero(Object o)</code> que classifique entre "inteiro positivo", "inteiro negativo", "decimal", "outro" usando guards (<code>when</code>).
          </li>
        </ol>
      </PageContainer>
  );
}
