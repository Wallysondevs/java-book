import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(a,{title:"Reflection",subtitle:"Inspecionar e manipular classes em runtime — base de frameworks como Spring.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Imagine que você está escrevendo um framework de injeção de dependências. Você não sabe quais classes o usuário vai criar, mas mesmo assim precisa instanciá-las, encontrar campos anotados com",e.jsx("code",{children:"@Inject"})," e preenchê-los. Como? Sem ",e.jsx("em",{children:"reflection"})," seria impossível."]}),e.jsx("p",{children:"Reflection é a capacidade do Java olhar pra si mesmo em runtime: descobrir métodos, campos, construtores, anotações e até invocar coisas sem conhecer os tipos em tempo de compilação. Spring, Hibernate, Jackson, JUnit — todos respiram reflection."}),e.jsxs("h2",{children:["O ponto de partida: ",e.jsx("code",{children:"Class<?>"})]}),e.jsxs("p",{children:["Tudo começa com um objeto ",e.jsx("code",{children:"Class<?>"}),". Há três jeitos de obter:"]}),e.jsx(s,{title:"Três formas de pegar o Class",code:`Class<String> c1 = String.class;              // literal de classe
Class<?> c2 = "ola".getClass();               // a partir da instância
Class<?> c3 = Class.forName("java.util.ArrayList"); // pelo nome (lança ClassNotFoundException)

System.out.println(c1.getName());        // java.lang.String
System.out.println(c3.getSimpleName());  // ArrayList`}),e.jsx("h2",{children:"Inspecionar: Constructor, Method, Field"}),e.jsxs("p",{children:["Cada classe tem coleções de membros. ",e.jsx("code",{children:"getDeclaredXxx()"})," traz tudo (inclusive private), enquanto ",e.jsx("code",{children:"getXxx()"})," traz só os públicos (incluindo herdados)."]}),e.jsx(s,{title:"Listando a estrutura",code:`import java.lang.reflect.*;

public class Pessoa {
    private String nome;
    public int idade;
    public Pessoa() {}
    public Pessoa(String nome) { this.nome = nome; }
    public String saudacao() { return "Oi, " + nome; }
    private void segredo() { System.out.println("shhh"); }

    public static void main(String[] args) {
        Class<?> c = Pessoa.class;

        for (Constructor<?> ct : c.getDeclaredConstructors())
            System.out.println("CT: " + ct);
        for (Field f : c.getDeclaredFields())
            System.out.println("FIELD: " + f.getName() + " : " + f.getType().getSimpleName());
        for (Method m : c.getDeclaredMethods())
            System.out.println("METHOD: " + m.getName());
    }
}`}),e.jsx("h2",{children:"Criar instância dinamicamente"}),e.jsx(s,{title:"newInstance moderno",code:`Class<?> clazz = Class.forName("Pessoa");
Constructor<?> ctor = clazz.getDeclaredConstructor(String.class);
Object p = ctor.newInstance("Ana");
System.out.println(p); // Pessoa@... (toString padrão)`}),e.jsx(o,{type:"warning",title:"newInstance() do Class está deprecated",children:e.jsxs("p",{children:["Desde Java 9, ",e.jsx("code",{children:"clazz.newInstance()"})," está deprecated. Use sempre",e.jsx("code",{children:"clazz.getDeclaredConstructor().newInstance()"})," — assim você decide qual construtor chamar e as exceções ficam claras."]})}),e.jsx("h2",{children:"Invocar método em runtime"}),e.jsx(s,{title:"method.invoke",code:`Method m = clazz.getDeclaredMethod("saudacao");
String r = (String) m.invoke(p);  // primeiro arg é a instância (null se for static)
System.out.println(r);            // Oi, Ana`}),e.jsxs("h2",{children:[e.jsx("code",{children:"setAccessible(true)"})," — burlando o ",e.jsx("code",{children:"private"})]}),e.jsx("p",{children:"Reflection consegue ler/escrever campos privados e chamar métodos privados, contanto que você peça permissão. É o que serializadores fazem pra reconstruir um objeto sem chamar setters."}),e.jsx(s,{title:"Mexendo no privado",code:`Field nome = clazz.getDeclaredField("nome");
nome.setAccessible(true);
nome.set(p, "Bruno");
System.out.println(nome.get(p)); // Bruno

Method seg = clazz.getDeclaredMethod("segredo");
seg.setAccessible(true);
seg.invoke(p); // shhh`}),e.jsx(o,{type:"danger",title:"JPMS bloqueia desde Java 9",children:e.jsxs("p",{children:["O sistema de módulos pode ",e.jsx("strong",{children:"fechar"})," pacotes. Se um módulo não fizer",e.jsx("code",{children:"opens com.exemplo to seu.modulo"}),", o ",e.jsx("code",{children:"setAccessible"})," lança",e.jsx("code",{children:"InaccessibleObjectException"}),". É por isso que você vê ",e.jsx("code",{children:"--add-opens"}),"em scripts de start de muitos serviços antigos."]})}),e.jsx("h2",{children:"O custo: reflection é lenta"}),e.jsxs("p",{children:["Uma chamada via ",e.jsx("code",{children:"method.invoke"})," é tipicamente ",e.jsx("strong",{children:"uma ordem de magnitude"}),"mais lenta que a chamada direta. A JIT consegue otimizar bastante hoje, mas nunca iguala. Por isso frameworks fazem reflection ",e.jsx("em",{children:"uma vez"})," no startup e cacheiam tudo."]}),e.jsx(s,{title:"Padrão: cachear o Method",code:`// Errado: pega o Method dentro do loop
for (var x : lista) {
    Method m = x.getClass().getMethod("processar"); // caro
    m.invoke(x);
}

// Certo: pega uma vez, reusa
Method m = MinhaClasse.class.getMethod("processar");
for (var x : lista) {
    m.invoke(x); // ainda paga overhead, mas bem menor
}`}),e.jsx("h2",{children:"Quando usar reflection"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Frameworks de DI (Spring, Guice, CDI)"}),e.jsx("li",{children:"Serializadores genéricos (Jackson, Gson)"}),e.jsxs("li",{children:["ORMs (Hibernate mapeia ",e.jsx("code",{children:"@Entity"})," em colunas)"]}),e.jsxs("li",{children:["Testes (JUnit descobre métodos ",e.jsx("code",{children:"@Test"}),")"]}),e.jsx("li",{children:"Plugins / scripting"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Não use"}),' reflection pra "burlar" encapsulamento no código de aplicação. Se você precisa do private, normalmente o design tá pedindo refatoração.']}),e.jsx("h2",{children:"Alternativa moderna: MethodHandle e VarHandle"}),e.jsxs("p",{children:["Desde Java 7 (e turbinado em Java 9 com VarHandle), existe uma API de invocação dinâmica que é",e.jsx("strong",{children:"quase tão rápida quanto chamada direta"}),", porque a JVM consegue inline."]}),e.jsx(s,{title:"MethodHandle — versão rápida do invoke",code:`import java.lang.invoke.*;

MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType tipo = MethodType.methodType(String.class); // retorna String, sem args
MethodHandle mh = lookup.findVirtual(Pessoa.class, "saudacao", tipo);

String r = (String) mh.invoke(p);
System.out.println(r);`}),e.jsx(o,{type:"tip",title:"VarHandle pra campos",children:e.jsxs("p",{children:[e.jsx("code",{children:"VarHandle"})," faz o mesmo pra ",e.jsx("em",{children:"campos"})," e ainda dá acesso a operações atômicas (compareAndSet, getVolatile etc.) sem precisar de ",e.jsx("code",{children:"java.util.concurrent.atomic"}),". Se você está construindo algo de altíssima performance, prefira sobre reflection clássica."]})}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma classe ",e.jsx("code",{children:"Produto"})," com 3 campos privados. Escreva um método",e.jsx("code",{children:"toMap(Object o)"})," que use reflection pra retornar um",e.jsx("code",{children:"Map<String, Object>"})," com todos os campos e seus valores."]}),e.jsxs("li",{children:['Implemente um mini "JUnit": dado o nome de uma classe, descubra métodos sem argumentos cujo nome comece com ',e.jsx("code",{children:"test"})," e invoque cada um, contando sucessos e falhas."]}),e.jsxs("li",{children:["Compare a performance: rode 1 milhão de chamadas a ",e.jsx("code",{children:"saudacao()"})," de três jeitos — direto, ",e.jsx("code",{children:"Method.invoke"})," e ",e.jsx("code",{children:"MethodHandle.invoke"}),". Anote os tempos."]})]})]})}export{n as default};
