import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PropertyTesting() {
  return (
    <PageContainer title="Property-Based Testing com jqwik" subtitle="Em vez de testar exemplos, teste propriedades — gerador descobre casos extremos." difficulty="avancado" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Teste tradicional (example-based) é assim: você escolhe 3 inputs e verifica 3 outputs. Funciona, mas você só testa o que <em>imaginou</em>. E os bugs sempre estão no caso que você <strong>não</strong> imaginou: string vazia, número negativo, lista com 1 elemento, Unicode esquisito, <code>Integer.MIN_VALUE</code>.
        </p><p>
          Property-based testing inverte: você descreve uma <strong>propriedade que deve valer para qualquer input</strong>, e a lib gera centenas de valores aleatórios tentando quebrar. Quando quebra, ela ainda <em>encolhe</em> (shrinking) o input até o menor caso falho — você não recebe uma string de 5000 caracteres pra debugar, recebe a mínima que reproduz.
        </p><AlertBox type="info" title="Analogia">
          Example-based: você testa 3 sabores de sorvete. Property-based: você afirma "todo sorvete derrete acima de 0°C" e a lib testa 500 sabores diferentes — incluindo um sabor exótico que você nunca pensaria.
        </AlertBox><h2>Setup</h2><CodeBlock title="pom.xml" code={`<dependency>
  <groupId>net.jqwik</groupId>
  <artifactId>jqwik</artifactId>
  <version>1.9.1</version>
  <scope>test</scope>
</dependency>`} /><p>
          jqwik integra com JUnit 5 Platform — roda lado a lado com seus <code>@Test</code> normais.
        </p><h2>Primeira propriedade</h2><CodeBlock title="ReverseProperties.java" code={`import net.jqwik.api.*;
import java.util.*;

class ReverseProperties {

    @Property
    boolean reverterDuasVezesVoltaOriginal(@ForAll List<Integer> lista) {
        List<Integer> dupla = reverse(reverse(lista));
        return dupla.equals(lista);
    }

    static <T> List<T> reverse(List<T> in) {
        List<T> out = new ArrayList<>(in);
        Collections.reverse(out);
        return out;
    }
}`} /><p>
          <code>@Property</code> substitui <code>@Test</code>. <code>@ForAll</code> em cada parâmetro pede ao jqwik que gere valores. Por padrão, jqwik gera <strong>1000 casos</strong> (configurável). Se algum quebrar, o teste falha — e mostra o caso mínimo.
        </p><h2>Invariantes que você deve afirmar</h2><p>A arte está em descobrir propriedades verdadeiras. Algumas pistas:</p><ul>
          <li>
            <strong>Inversa</strong>: <code>parse(format(x)) == x</code>, <code>decode(encode(x)) == x</code>.
          </li><li>
            <strong>Idempotência</strong>: <code>sort(sort(lista)) == sort(lista)</code>.
          </li><li>
            <strong>Conservação</strong>: ordenar não muda tamanho; <code>filter</code> não aumenta tamanho.
          </li><li>
            <strong>Comparação com implementação simples</strong>: sua <code>quickSort</code> deve dar o mesmo resultado de <code>Collections.sort</code>.
          </li><li>
            <strong>Domínio matemático</strong>{": soma de positivos > 0; valor absoluto sempre ≥ 0."}
          </li>
        </ul><CodeBlock title="Exemplo: ordenação" code={`@Property
boolean ordenarPreservaTamanho(@ForAll List<Integer> in) {
    return ordenar(in).size() == in.size();
}

@Property
boolean ordenarProduzListaCrescente(@ForAll List<Integer> in) {
    List<Integer> out = ordenar(in);
    for (int i = 1; i < out.size(); i++) {
        if (out.get(i - 1) > out.get(i)) return false;
    }
    return true;
}`} /><h2>Shrinking: o superpoder</h2><p>
          Suponha que sua função quebra com a lista <code>[42, -7, 0, 999, -1000, 5, ...]</code> (50 elementos). Inútil pra debugar. jqwik vai automaticamente encolher: tira elementos, reduz valores, até achar o menor input que ainda quebra. Você recebe algo como:
        </p><CodeBlock code={`org.opentest4j.AssertionFailedError:
    Property [ordenarProduzListaCrescente] falhou
    Sample (after shrinking): lista=[0, -1]`} /><p>
          Aí você olha pro código e percebe: ah, esqueci de tratar negativos. Bug achado em segundos.
        </p><h2>Limitando o domínio dos geradores</h2><CodeBlock code={`@Property
boolean valorAbsolutoNuncaNegativo(@ForAll @IntRange(min = -1000, max = 1000) int x) {
    return Math.abs(x) >= 0; // cuidado: Math.abs(Integer.MIN_VALUE) é negativo!
}

@Property
boolean stringNaoVaziaTemTamanhoMaiorQueZero(
        @ForAll @StringLength(min = 1, max = 50) String s) {
    return s.length() >= 1;
}

@Property
boolean somaListaPositivosNaoNegativa(
        @ForAll List<@IntRange(min = 0, max = 100) Integer> nums) {
    return nums.stream().mapToInt(Integer::intValue).sum() >= 0;
}`} /><h2>
          Geradores customizados (<code>@Provide</code>)
        </h2><p>Para tipos do seu domínio, você ensina o jqwik a gerar:</p><CodeBlock code={`record Usuario(String email, int idade) {}

@Property
boolean emailSempreContemArroba(@ForAll("usuarios") Usuario u) {
    return u.email().contains("@");
}

@Provide
Arbitrary<Usuario> usuarios() {
    Arbitrary<String> emails = Arbitraries.strings()
        .alpha().ofMinLength(3).ofMaxLength(10)
        .map(s -> s + "@teste.com");
    Arbitrary<Integer> idades = Arbitraries.integers().between(0, 120);

    return Combinators.combine(emails, idades).as(Usuario::new);
}`} /><p>
          <code>@Provide</code> marca um método que devolve <code>Arbitrary</code>. O <code>@ForAll("usuarios")</code> aponta pro nome do método. <code>Combinators.combine</code> é o equivalente do <code>zip</code> de outras libs.
        </p><AlertBox type="note" title="Property testing complementa, não substitui">
          Você ainda quer testes de exemplo (<code>@Test</code>) para regras de negócio específicas e regressão de bugs encontrados. Property testing brilha em código algorítmico, parsers, serialização, transformações. Use os dois.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva uma propriedade afirmando que <code>
              {"List<Integer>"}
            </code> ordenado pela sua função produz a mesma coisa que <code>Collections.sort</code>. Force um bug (ex: troque <code>{">"}</code> por <code>{">="}</code>) e veja o shrinking em ação.
          </li><li>
            Implemente um <code>@Provide</code> que gera datas válidas (<code>LocalDate</code> entre 1900 e 2100) e teste que sua função <code>idadeEm(LocalDate nascimento, LocalDate hoje)</code> nunca devolve negativo quando <code>{"hoje >= nascimento"}</code>.
          </li><li>
            Teste a propriedade <code>parse(format(x)) == x</code> para sua serialização JSON de um record simples.
          </li>
        </ol>
      </PageContainer>
  );
}
