import{j as e}from"./index-BpXci30S.js";import{P as a,A as s}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"Anotações customizadas",subtitle:"Crie suas próprias @Anotacao e processe em runtime ou compilação.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Você já usou ",e.jsx("code",{children:"@Override"}),", ",e.jsx("code",{children:"@Test"}),", ",e.jsx("code",{children:"@Entity"}),",",e.jsx("code",{children:"@Autowired"}),". Mas alguma vez parou pra pensar como o JUnit ",e.jsx("em",{children:"sabe"})," que aquele método é um teste? Resposta: anotação + reflection. Quando você cria uma anotação própria, está dando um superpoder ao seu código — uma forma de marcar elementos pra ferramentas, frameworks ou validações próprias agirem sobre eles."]}),e.jsxs("h2",{children:["Anatomia: ",e.jsx("code",{children:"@interface"})]}),e.jsxs("p",{children:["Anotação se declara com ",e.jsx("code",{children:"@interface"})," (com arroba!). É diferente de",e.jsx("code",{children:"interface"})," normal, embora a sintaxe pareça parecida."]}),e.jsx(o,{title:"Sua primeira anotação",code:`public @interface Apelido {
    String value();              // membro obrigatório
    String descricao() default ""; // com default vira opcional
}

// Uso:
@Apelido(value = "Beto", descricao = "fundador")
public class Pessoa { }`}),e.jsxs("p",{children:["Membros de anotação são declarados como métodos sem corpo. Tipos permitidos: primitivos,",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"Class"}),", enums, outras anotações e arrays desses."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"@Target"}),": onde pode ser usada"]}),e.jsx(o,{title:"Restringindo o alvo",code:`import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD})
public @interface Cacheavel { }`}),e.jsx("p",{children:"Os principais valores:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"TYPE"})," — classe, interface, enum, record"]}),e.jsxs("li",{children:[e.jsx("code",{children:"METHOD"})," — métodos"]}),e.jsxs("li",{children:[e.jsx("code",{children:"FIELD"})," — atributos"]}),e.jsxs("li",{children:[e.jsx("code",{children:"PARAMETER"})," — parâmetros de método"]}),e.jsxs("li",{children:[e.jsx("code",{children:"CONSTRUCTOR"}),", ",e.jsx("code",{children:"LOCAL_VARIABLE"}),", ",e.jsx("code",{children:"ANNOTATION_TYPE"}),", ",e.jsx("code",{children:"PACKAGE"}),", ",e.jsx("code",{children:"TYPE_USE"}),", ",e.jsx("code",{children:"MODULE"})]})]}),e.jsxs("h2",{children:[e.jsx("code",{children:"@Retention"}),": até quando ela vive"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"SOURCE"})," — só o compilador vê. Some no ",e.jsx("code",{children:".class"}),". Exemplo: ",e.jsx("code",{children:"@Override"}),",",e.jsx("code",{children:"@SuppressWarnings"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CLASS"})," — fica no bytecode mas a JVM ignora em runtime. É o default. Útil pra ferramentas que leem ",e.jsx("code",{children:".class"})," direto."]}),e.jsxs("li",{children:[e.jsx("code",{children:"RUNTIME"})," — visível por reflection. ",e.jsx("strong",{children:"Esse é o que você quer"})," se for ler em runtime. Exemplo: ",e.jsx("code",{children:"@Test"}),", ",e.jsx("code",{children:"@Autowired"}),"."]})]}),e.jsx(o,{title:"Anotação completa",code:`import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test {
    long timeoutMs() default 5000;
}`}),e.jsx("h2",{children:"Marker annotation (sem campos)"}),e.jsxs("p",{children:["Anotação sem nenhum membro serve só pra marcar. ",e.jsx("code",{children:"@Override"})," é o exemplo clássico."]}),e.jsx(o,{code:`@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NaoSerializar { }

@NaoSerializar
public class Sessao { }`}),e.jsxs("h2",{children:["O atalho do ",e.jsx("code",{children:"value"})]}),e.jsxs("p",{children:["Se a anotação tem só um membro chamado ",e.jsx("code",{children:"value"}),", você omite o nome no uso."]}),e.jsx(o,{code:`public @interface Autor { String value(); }

@Autor("Maria")           // equivalente a @Autor(value = "Maria")
public class Modulo { }`}),e.jsx("h2",{children:"Lendo em runtime"}),e.jsx(o,{title:"Reflection + anotação",code:`import java.lang.reflect.*;

public class Runner {
    public static void main(String[] args) throws Exception {
        for (Method m : MeusTestes.class.getDeclaredMethods()) {
            Test t = m.getAnnotation(Test.class);
            if (t == null) continue;
            System.out.println("Rodando " + m.getName() + " (timeout=" + t.timeoutMs() + ")");
            m.invoke(MeusTestes.class.getDeclaredConstructor().newInstance());
        }
    }
}`}),e.jsx(s,{type:"warning",title:"Sem RUNTIME, sem leitura",children:e.jsxs("p",{children:["Se esquecer ",e.jsx("code",{children:"@Retention(RUNTIME)"}),", ",e.jsx("code",{children:"getAnnotation"})," retorna",e.jsx("code",{children:"null"})," sempre. É o erro mais comum em quem está começando."]})}),e.jsx("h2",{children:"Meta-anotações úteis"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"@Repeatable"}),' — permite usar a mesma anotação várias vezes no mesmo elemento (Java 8+). Exige uma "container annotation".']}),e.jsxs("li",{children:[e.jsx("code",{children:"@Inherited"})," — subclasses herdam a anotação aplicada a uma classe pai. Só funciona em ",e.jsx("code",{children:"@Target(TYPE)"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@Documented"})," — faz a anotação aparecer no Javadoc."]})]}),e.jsx(o,{title:"@Repeatable na prática",code:`@Repeatable(Tags.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface Tag { String value(); }

@Retention(RetentionPolicy.RUNTIME)
public @interface Tags { Tag[] value(); }

@Tag("rapido") @Tag("integracao")
public class TesteX { }

// Leitura:
Tag[] tags = TesteX.class.getAnnotationsByType(Tag.class);`}),e.jsx("h2",{children:"Processamento em compilação (APT)"}),e.jsxs("p",{children:["Algumas anotações geram código durante a compilação — é assim que Lombok cria getters/setters, MapStruct gera mappers, Dagger monta grafo de DI. Você implementa",e.jsx("code",{children:"javax.annotation.processing.AbstractProcessor"}),", declara em",e.jsx("code",{children:"META-INF/services/javax.annotation.processing.Processor"})," e o ",e.jsx("code",{children:"javac"})," chama durante a build."]}),e.jsx(o,{title:"Esqueleto de um processor",code:`@SupportedAnnotationTypes("com.exemplo.GerarBuilder")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public class BuilderProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment env) {
        for (Element e : env.getElementsAnnotatedWith(GerarBuilder.class)) {
            // gera arquivo .java novo via processingEnv.getFiler()
        }
        return true;
    }
}`}),e.jsx(s,{type:"tip",title:"Runtime vs compile-time",children:e.jsx("p",{children:"Runtime processing é flexível mas custa CPU em produção. Compile-time gera código uma vez e some na build, deixando o runtime limpo. Frameworks modernos (Micronaut, Quarkus) preferem processadores pra ter startup rápido e funcionar em GraalVM Native Image."})}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie ",e.jsx("code",{children:'@JsonField(name = "...")'})," (RUNTIME, FIELD) e um método",e.jsx("code",{children:"toJson(Object o)"})," que use reflection pra montar um JSON respeitando o nome customizado dos campos."]}),e.jsxs("li",{children:["Faça ",e.jsx("code",{children:"@Validar"})," com ",e.jsx("code",{children:"min"})," e ",e.jsx("code",{children:"max"})," em campos",e.jsx("code",{children:"int"}),". Escreva ",e.jsx("code",{children:"Validador.validar(Object o)"})," que jogue",e.jsx("code",{children:"IllegalArgumentException"})," se o valor estiver fora."]}),e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"@Repeatable"})," ",e.jsx("code",{children:'@Role("admin")'})," e leia todas as roles de uma classe imprimindo numa linha separada por vírgula."]})]})]})}export{c as default};
