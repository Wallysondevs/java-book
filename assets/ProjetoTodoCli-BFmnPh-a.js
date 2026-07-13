import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Projeto: To-Do CLI",subtitle:"Aplicar o que aprendeu construindo um gerenciador de tarefas no terminal.",difficulty:"intermediario",timeToRead:"30 min",children:[e.jsx("h2",{children:"Por que esse projeto?"}),e.jsxs("p",{children:['To-do list é o "hello world" de aplicações reais: você toca em parsing de argumentos, persistência em arquivo, serialização JSON, datas e um pouquinho de UX no terminal. Quando estiver pronto, você roda ',e.jsx("code",{children:'todo add "comprar pão"'})," no seu shell de verdade — ou seja, vira ferramenta, não exercício."]}),e.jsx("h2",{children:"Especificação"}),e.jsx("p",{children:"O CLI vai aceitar os comandos abaixo:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'todo add "comprar pão"'})," — cria tarefa nova"]}),e.jsxs("li",{children:[e.jsx("code",{children:"todo list"})," — lista tudo (feitas e pendentes)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"todo done 1"})," — marca a tarefa de id 1 como feita"]}),e.jsxs("li",{children:[e.jsx("code",{children:"todo remove 1"})," — remove a tarefa"]}),e.jsxs("li",{children:[e.jsx("code",{children:"todo clear"})," — apaga tudo"]})]}),e.jsxs("p",{children:["Estado vai num único arquivo JSON em ",e.jsx("code",{children:"~/.todo.json"}),". Sem banco, sem servidor — portátil e simples de inspecionar com qualquer editor."]}),e.jsx("h2",{children:"Stack escolhida"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Java 21"})," (records, var, switch novo)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Picocli"})," pra parsing de argumentos (mais elegante que mexer em ",e.jsx("code",{children:"args[0]"})," na mão)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Jackson"})," pra ler/gravar JSON"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maven"})," pra empacotar tudo num jar executável"]})]}),e.jsx("h2",{children:"1. pom.xml"}),e.jsx(a,{title:"pom.xml",code:`<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>dev.voce</groupId>
  <artifactId>todo-cli</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>info.picocli</groupId>
      <artifactId>picocli</artifactId>
      <version>4.7.6</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.17.2</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.datatype</groupId>
      <artifactId>jackson-datatype-jsr310</artifactId>
      <version>2.17.2</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.5.3</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals><goal>shade</goal></goals>
            <configuration>
              <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <mainClass>dev.voce.todo.Todo</mainClass>
                </transformer>
              </transformers>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>`}),e.jsx("h2",{children:"2. O record Tarefa"}),e.jsxs("p",{children:["Records (Java 16+) são perfeitos pra DTOs: imutáveis, com ",e.jsx("code",{children:"equals"}),",",e.jsx("code",{children:"hashCode"})," e ",e.jsx("code",{children:"toString"})," grátis."]}),e.jsx(a,{title:"Tarefa.java",code:`package dev.voce.todo;

import java.time.LocalDateTime;

public record Tarefa(int id, String desc, boolean feita, LocalDateTime criadaEm) {
    public Tarefa marcarFeita() {
        return new Tarefa(id, desc, true, criadaEm);
    }
}`}),e.jsx("h2",{children:"3. Repositório com leitura/escrita"}),e.jsx(a,{title:"TaskRepository.java",code:`package dev.voce.todo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

public class TaskRepository {
    private static final Path FILE = Paths.get(System.getProperty("user.home"), ".todo.json");
    private static final ObjectMapper MAPPER = new ObjectMapper().registerModule(new JavaTimeModule());

    public List<Tarefa> carregar() throws IOException {
        if (!Files.exists(FILE)) return new ArrayList<>();
        var json = Files.readString(FILE);
        if (json.isBlank()) return new ArrayList<>();
        return new ArrayList<>(Arrays.asList(MAPPER.readValue(json, Tarefa[].class)));
    }

    public void salvar(List<Tarefa> tarefas) throws IOException {
        var json = MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(tarefas);
        Files.writeString(FILE, json, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }
}`}),e.jsx("h2",{children:"4. Comandos com Picocli"}),e.jsx(a,{title:"Todo.java",code:`package dev.voce.todo;

import picocli.CommandLine;
import picocli.CommandLine.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Callable;

@Command(name = "todo", mixinStandardHelpOptions = true,
         subcommands = {Todo.Add.class, Todo.List_.class, Todo.Done.class, Todo.Remove.class, Todo.Clear.class})
public class Todo {
    static final TaskRepository REPO = new TaskRepository();

    public static void main(String[] args) {
        System.exit(new CommandLine(new Todo()).execute(args));
    }

    @Command(name = "add") static class Add implements Callable<Integer> {
        @Parameters String desc;
        public Integer call() throws Exception {
            var lista = REPO.carregar();
            int id = lista.stream().mapToInt(Tarefa::id).max().orElse(0) + 1;
            lista.add(new Tarefa(id, desc, false, LocalDateTime.now()));
            REPO.salvar(lista);
            System.out.println("✓ adicionada #" + id);
            return 0;
        }
    }

    @Command(name = "list") static class List_ implements Callable<Integer> {
        public Integer call() throws Exception {
            for (var t : REPO.carregar()) {
                System.out.printf("[%s] %d  %s%n", t.feita() ? "x" : " ", t.id(), t.desc());
            }
            return 0;
        }
    }

    @Command(name = "done") static class Done implements Callable<Integer> {
        @Parameters int id;
        public Integer call() throws Exception {
            var lista = REPO.carregar();
            var nova = lista.stream().map(t -> t.id() == id ? t.marcarFeita() : t).toList();
            REPO.salvar(new java.util.ArrayList<>(nova));
            return 0;
        }
    }

    @Command(name = "remove") static class Remove implements Callable<Integer> {
        @Parameters int id;
        public Integer call() throws Exception {
            var lista = REPO.carregar();
            lista.removeIf(t -> t.id() == id);
            REPO.salvar(lista);
            return 0;
        }
    }

    @Command(name = "clear") static class Clear implements Callable<Integer> {
        public Integer call() throws Exception { REPO.salvar(List.of()); return 0; }
    }
}`}),e.jsx("h2",{children:"5. Empacotando e usando"}),e.jsx(a,{code:`# build
mvn -q package

# alias no ~/.bashrc ou ~/.zshrc
alias todo='java -jar /caminho/todo-cli-1.0.0.jar'

# uso
todo add "comprar pão"
todo add "estudar streams"
todo list
todo done 1
todo remove 2`}),e.jsx(o,{type:"tip",title:"Dica de produtividade",children:"Mantenha o JSON num diretório sincronizado (Dropbox, iCloud, git privado) e suas tarefas aparecem automaticamente em todas as máquinas onde o jar estiver instalado."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Adicione um campo ",e.jsx("code",{children:"prioridade"})," (enum ",e.jsx("code",{children:"BAIXA"}),", ",e.jsx("code",{children:"MEDIA"}),",",e.jsx("code",{children:"ALTA"}),") no record ",e.jsx("code",{children:"Tarefa"})," e mostre um marcador colorido no",e.jsx("code",{children:"list"})," usando códigos ANSI (",e.jsx("code",{children:"\\u001B[31m"})," pra vermelho)."]}),e.jsxs("li",{children:["Acrescente ",e.jsx("code",{children:"--due 2025-12-31"})," ao comando ",e.jsx("code",{children:"add"})," e implemente",e.jsx("code",{children:"todo overdue"})," que mostra só as tarefas vencidas."]}),e.jsxs("li",{children:["Crie um subcomando ",e.jsx("code",{children:"todo export --to csv"})," que gera um arquivo CSV pronto pra abrir no LibreOffice."]})]})]})}export{n as default};
