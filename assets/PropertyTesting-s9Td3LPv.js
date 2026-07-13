import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(s,{title:"Property-Based Testing com jqwik",subtitle:"Em vez de testar exemplos, teste propriedades — gerador descobre casos extremos.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Teste tradicional (example-based) é assim: você escolhe 3 inputs e verifica 3 outputs. Funciona, mas você só testa o que ",e.jsx("em",{children:"imaginou"}),". E os bugs sempre estão no caso que você ",e.jsx("strong",{children:"não"})," imaginou: string vazia, número negativo, lista com 1 elemento, Unicode esquisito, ",e.jsx("code",{children:"Integer.MIN_VALUE"}),"."]}),e.jsxs("p",{children:["Property-based testing inverte: você descreve uma ",e.jsx("strong",{children:"propriedade que deve valer para qualquer input"}),", e a lib gera centenas de valores aleatórios tentando quebrar. Quando quebra, ela ainda ",e.jsx("em",{children:"encolhe"})," (shrinking) o input até o menor caso falho — você não recebe uma string de 5000 caracteres pra debugar, recebe a mínima que reproduz."]}),e.jsx(o,{type:"info",title:"Analogia",children:'Example-based: você testa 3 sabores de sorvete. Property-based: você afirma "todo sorvete derrete acima de 0°C" e a lib testa 500 sabores diferentes — incluindo um sabor exótico que você nunca pensaria.'}),e.jsx("h2",{children:"Setup"}),e.jsx(r,{title:"pom.xml",code:`<dependency>
  <groupId>net.jqwik</groupId>
  <artifactId>jqwik</artifactId>
  <version>1.9.1</version>
  <scope>test</scope>
</dependency>`}),e.jsxs("p",{children:["jqwik integra com JUnit 5 Platform — roda lado a lado com seus ",e.jsx("code",{children:"@Test"})," normais."]}),e.jsx("h2",{children:"Primeira propriedade"}),e.jsx(r,{title:"ReverseProperties.java",code:`import net.jqwik.api.*;
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
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@Property"})," substitui ",e.jsx("code",{children:"@Test"}),". ",e.jsx("code",{children:"@ForAll"})," em cada parâmetro pede ao jqwik que gere valores. Por padrão, jqwik gera ",e.jsx("strong",{children:"1000 casos"})," (configurável). Se algum quebrar, o teste falha — e mostra o caso mínimo."]}),e.jsx("h2",{children:"Invariantes que você deve afirmar"}),e.jsx("p",{children:"A arte está em descobrir propriedades verdadeiras. Algumas pistas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Inversa"}),": ",e.jsx("code",{children:"parse(format(x)) == x"}),", ",e.jsx("code",{children:"decode(encode(x)) == x"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Idempotência"}),": ",e.jsx("code",{children:"sort(sort(lista)) == sort(lista)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Conservação"}),": ordenar não muda tamanho; ",e.jsx("code",{children:"filter"})," não aumenta tamanho."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comparação com implementação simples"}),": sua ",e.jsx("code",{children:"quickSort"})," deve dar o mesmo resultado de ",e.jsx("code",{children:"Collections.sort"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Domínio matemático"}),": soma de positivos > 0; valor absoluto sempre ≥ 0."]})]}),e.jsx(r,{title:"Exemplo: ordenação",code:`@Property
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
}`}),e.jsx("h2",{children:"Shrinking: o superpoder"}),e.jsxs("p",{children:["Suponha que sua função quebra com a lista ",e.jsx("code",{children:"[42, -7, 0, 999, -1000, 5, ...]"})," (50 elementos). Inútil pra debugar. jqwik vai automaticamente encolher: tira elementos, reduz valores, até achar o menor input que ainda quebra. Você recebe algo como:"]}),e.jsx(r,{code:`org.opentest4j.AssertionFailedError:
    Property [ordenarProduzListaCrescente] falhou
    Sample (after shrinking): lista=[0, -1]`}),e.jsx("p",{children:"Aí você olha pro código e percebe: ah, esqueci de tratar negativos. Bug achado em segundos."}),e.jsx("h2",{children:"Limitando o domínio dos geradores"}),e.jsx(r,{code:`@Property
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
}`}),e.jsxs("h2",{children:["Geradores customizados (",e.jsx("code",{children:"@Provide"}),")"]}),e.jsx("p",{children:"Para tipos do seu domínio, você ensina o jqwik a gerar:"}),e.jsx(r,{code:`record Usuario(String email, int idade) {}

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
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@Provide"})," marca um método que devolve ",e.jsx("code",{children:"Arbitrary"}),". O ",e.jsx("code",{children:'@ForAll("usuarios")'})," aponta pro nome do método. ",e.jsx("code",{children:"Combinators.combine"})," é o equivalente do ",e.jsx("code",{children:"zip"})," de outras libs."]}),e.jsxs(o,{type:"note",title:"Property testing complementa, não substitui",children:["Você ainda quer testes de exemplo (",e.jsx("code",{children:"@Test"}),") para regras de negócio específicas e regressão de bugs encontrados. Property testing brilha em código algorítmico, parsers, serialização, transformações. Use os dois."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Escreva uma propriedade afirmando que ",e.jsx("code",{children:"List<Integer>"})," ordenado pela sua função produz a mesma coisa que ",e.jsx("code",{children:"Collections.sort"}),". Force um bug (ex: troque ",e.jsx("code",{children:">"})," por ",e.jsx("code",{children:">="}),") e veja o shrinking em ação."]}),e.jsxs("li",{children:["Implemente um ",e.jsx("code",{children:"@Provide"})," que gera datas válidas (",e.jsx("code",{children:"LocalDate"})," entre 1900 e 2100) e teste que sua função ",e.jsx("code",{children:"idadeEm(LocalDate nascimento, LocalDate hoje)"})," nunca devolve negativo quando ",e.jsx("code",{children:"hoje >= nascimento"}),"."]}),e.jsxs("li",{children:["Teste a propriedade ",e.jsx("code",{children:"parse(format(x)) == x"})," para sua serialização JSON de um record simples."]})]})]})}export{n as default};
