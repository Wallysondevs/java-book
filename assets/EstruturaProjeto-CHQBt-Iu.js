import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(s,{title:"Estrutura de um Projeto Java",subtitle:"Pacotes, src/main/java, target/ — o esqueleto padrão.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Um arquivo ",e.jsx("code",{children:"Hello.java"})," solto na raiz funciona pra aprender. Mas um projeto de verdade tem dezenas (ou milhares) de classes. Sem uma ",e.jsx("strong",{children:"estrutura"}),", vira bagunça: nomes colidindo, imports impossíveis, build quebrado."]}),e.jsxs("p",{children:["Java tem dois conceitos que organizam tudo: ",e.jsx("strong",{children:"pacotes"})," (namespaces no código) e o ",e.jsx("strong",{children:"layout padrão Maven"})," (organização de pastas no disco). Os dois andam juntos. Vamos entender ambos."]}),e.jsx("h2",{children:'Pacotes: o "endereço" da sua classe'}),e.jsxs("p",{children:["Um pacote é um agrupamento lógico de classes relacionadas. Pense como pasta no sistema de arquivos — só que no nível do código. Sem pacotes, duas classes chamadas",e.jsx("code",{children:" Cliente"})," não podem coexistir no projeto. Com pacotes, você pode ter",e.jsx("code",{children:" com.loja.vendas.Cliente"})," e ",e.jsx("code",{children:"com.loja.suporte.Cliente"})," sem briga."]}),e.jsx("h3",{children:"Convenção de nomes"}),e.jsxs("p",{children:["A convenção universal é usar ",e.jsx("strong",{children:"domínio reverso"})," da sua empresa/projeto:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Empresa ",e.jsx("em",{children:"acme.com.br"})," → pacote raiz ",e.jsx("code",{children:"br.com.acme"})]}),e.jsxs("li",{children:["Projeto pessoal no GitHub ",e.jsx("em",{children:"github.com/maria"})," → ",e.jsx("code",{children:"io.github.maria"})]}),e.jsxs("li",{children:["Dentro disso, divida por funcionalidade: ",e.jsx("code",{children:"br.com.acme.estoque.modelo"}),", ",e.jsx("code",{children:"br.com.acme.estoque.servico"})]})]}),e.jsx("p",{children:"Regras práticas:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Tudo minúsculo"}),e.jsx("li",{children:"Sem hífen, sem underscore (pacote válido = identificador Java válido)"}),e.jsxs("li",{children:["Começa com letra (se seu domínio começa com número, prefixe com algo como ",e.jsx("code",{children:"br.com._123empresa"}),")"]})]}),e.jsx("h3",{children:"Declarando o pacote"}),e.jsxs("p",{children:["Toda classe precisa declarar seu pacote na ",e.jsx("strong",{children:"primeira linha"})," do arquivo (descontando comentários):"]}),e.jsx(a,{title:"src/main/java/br/com/acme/estoque/modelo/Produto.java",code:`package br.com.acme.estoque.modelo;

public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }
}`}),e.jsxs(o,{type:"warning",title:"Pacote = pasta",children:["A regra é absoluta: o pacote ",e.jsx("code",{children:"br.com.acme.estoque.modelo"})," obriga o arquivo a estar na pasta ",e.jsx("code",{children:"br/com/acme/estoque/modelo/"}),". Se mover o arquivo sem atualizar o ",e.jsx("code",{children:"package"})," (ou vice-versa), o compilador reclama."]}),e.jsx("h2",{children:"Importando classes de outros pacotes"}),e.jsxs("p",{children:["Para usar uma classe que não está no mesmo pacote, você precisa ",e.jsx("strong",{children:"importar"}),":"]}),e.jsx(a,{title:"src/main/java/br/com/acme/estoque/servico/CalculadoraDePreco.java",code:`package br.com.acme.estoque.servico;

import br.com.acme.estoque.modelo.Produto;
import java.util.List;

public class CalculadoraDePreco {
    public double total(List<Produto> produtos) {
        double soma = 0;
        for (Produto p : produtos) {
            soma += p.getPreco();
        }
        return soma;
    }
}`}),e.jsx("p",{children:"Algumas regras úteis:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Classes do mesmo pacote ",e.jsx("strong",{children:"não precisam"})," de import"]}),e.jsxs("li",{children:["Classes do pacote ",e.jsx("code",{children:"java.lang"})," (como ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"System"}),", ",e.jsx("code",{children:"Integer"}),") são importadas ",e.jsx("strong",{children:"automaticamente"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"import java.util.*;"})," traz tudo de ",e.jsx("code",{children:"java.util"})," de uma vez (válido, mas a convenção é importar uma classe por linha pra ficar explícito)"]})]}),e.jsx("h2",{children:"O default package — NÃO use"}),e.jsxs("p",{children:["Se você criar um arquivo ",e.jsx("code",{children:".java"})," sem declarar ",e.jsx("code",{children:"package"}),", ele cai no chamado ",e.jsx("strong",{children:"default package"}),". Funciona pra exemplos de uma linha, mas tem problemas sérios:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Outras classes em pacotes nomeados ",e.jsx("strong",{children:"não conseguem importar"})," nada do default"]}),e.jsx("li",{children:"Maven, Gradle e a maioria das ferramentas reclamam"}),e.jsx("li",{children:"Frameworks como Spring nem enxergam suas classes"})]}),e.jsxs(o,{type:"danger",title:"Regra de ouro",children:["Toda classe de projeto real declara um ",e.jsx("code",{children:"package"}),". O default package é só pra script descartável."]}),e.jsx("h2",{children:"Maven Standard Directory Layout"}),e.jsxs("p",{children:["Quando o projeto cresce, organizar pastas vira problema. A comunidade adotou o",e.jsx("strong",{children:" Maven Standard Directory Layout"})," — um padrão que praticamente todo projeto Java moderno (Maven, Gradle, ou misto) segue."]}),e.jsx(a,{title:"Estrutura típica",code:`meu-projeto/
├── pom.xml                     (ou build.gradle)
├── src/
│   ├── main/
│   │   ├── java/               código fonte da aplicação
│   │   │   └── br/com/acme/...
│   │   └── resources/          arquivos não-Java (configs, SQL, imagens)
│   │       ├── application.properties
│   │       └── logback.xml
│   └── test/
│       ├── java/               código fonte dos testes
│       │   └── br/com/acme/...
│       └── resources/          recursos usados nos testes
└── target/                     gerado pelo build (NÃO commitar)
    ├── classes/                .class compilados
    ├── test-classes/
    └── meu-projeto-1.0.jar     o artefato final`}),e.jsxs("h3",{children:["Por que separar ",e.jsx("code",{children:"main"})," e ",e.jsx("code",{children:"test"}),"?"]}),e.jsxs("p",{children:["O código de teste tem dependências diferentes (JUnit, Mockito) e ",e.jsx("strong",{children:"não vai pro JAR final"}),". Manter em pastas separadas deixa essa fronteira óbvia tanto pra você quanto pra ferramenta de build."]}),e.jsx("h3",{children:"O que vai para o JAR?"}),e.jsxs("p",{children:["Quando você roda ",e.jsx("code",{children:"mvn package"})," (ou ",e.jsx("code",{children:"./gradlew build"}),"), o build empacota num ",e.jsx("code",{children:".jar"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Tudo que estava em ",e.jsx("code",{children:"src/main/java"}),", compilado pra ",e.jsx("code",{children:".class"})]}),e.jsxs("li",{children:["Tudo que estava em ",e.jsx("code",{children:"src/main/resources"}),", copiado como está"]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Não vai"})," para o JAR: nada de ",e.jsx("code",{children:"src/test"}),", nada de",e.jsx("code",{children:" target/"})," em si (ele é a saída, não a entrada), nada de arquivos do seu IDE (",e.jsx("code",{children:".idea"}),", ",e.jsx("code",{children:".vscode"}),")."]}),e.jsx("h2",{children:"Classpath: como o Java acha as classes"}),e.jsxs("p",{children:["Quando você roda ",e.jsx("code",{children:"java MinhaClasse"}),", a JVM precisa saber onde procurar os",e.jsx("code",{children:" .class"}),". Isso é o ",e.jsx("strong",{children:"classpath"}),". Por padrão, é o diretório atual. Para outras pastas ou JARs, use ",e.jsx("code",{children:"-cp"})," (ou ",e.jsx("code",{children:"-classpath"}),"):"]}),e.jsx(a,{title:"Compilando e rodando manualmente com classpath",code:`# Compila tudo a partir de src/main/java, saída em target/classes
javac -d target/classes \\
      src/main/java/br/com/acme/estoque/modelo/Produto.java \\
      src/main/java/br/com/acme/estoque/servico/CalculadoraDePreco.java

# Roda apontando o classpath para target/classes
java -cp target/classes br.com.acme.estoque.servico.Main`}),e.jsx("p",{children:"Repare em duas coisas importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Você passa o ",e.jsx("strong",{children:"nome totalmente qualificado"})," da classe (com pacote), não o caminho do arquivo"]}),e.jsxs("li",{children:["No ",e.jsx("code",{children:"-cp"}),", separe múltiplas entradas com ",e.jsx("code",{children:":"})," em Linux/macOS e ",e.jsx("code",{children:";"})," em Windows"]})]}),e.jsx(a,{title:"Múltiplas entradas no classpath",code:`# Linux/macOS
java -cp target/classes:libs/gson-2.10.jar br.com.acme.Main

# Windows
java -cp target/classes;libs/gson-2.10.jar br.com.acme.Main`}),e.jsxs(o,{type:"tip",title:"Na prática você quase nunca digita -cp na mão",children:["Maven, Gradle e as IDEs montam o classpath automaticamente lendo o ",e.jsx("code",{children:"pom.xml"}),"ou ",e.jsx("code",{children:"build.gradle"}),". Mas saber que ele existe te salva quando algo dá errado."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie a estrutura ",e.jsx("code",{children:"src/main/java/br/com/seunome/jogo/"})," com duas classes:",e.jsx("code",{children:" Personagem"})," (com nome e vida) e ",e.jsx("code",{children:"Main"})," que cria um personagem e imprime o nome. Compile com ",e.jsx("code",{children:"javac -d target/classes ..."})," e rode com",e.jsx("code",{children:" java -cp target/classes br.com.seunome.jogo.Main"}),"."]}),e.jsxs("li",{children:["Tente mover ",e.jsx("code",{children:"Personagem.java"})," para uma pasta diferente do que diz o",e.jsx("code",{children:" package"})," (por exemplo, jogue em ",e.jsx("code",{children:"src/main/java/"})," direto). Recompile e leia atentamente o erro do ",e.jsx("code",{children:"javac"}),". Volte o arquivo pro lugar certo."]}),e.jsxs("li",{children:["Crie uma terceira classe ",e.jsx("code",{children:"Inventario"})," num pacote diferente (",e.jsx("code",{children:"br.com.seunome.jogo.itens"}),"). Faça ",e.jsx("code",{children:"Personagem"})," usar",e.jsx("code",{children:" Inventario"})," — você vai precisar do ",e.jsx("code",{children:"import"}),". Confirme que tudo compila e que o programa roda."]})]})]})}export{d as default};
