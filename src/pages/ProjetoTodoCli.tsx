import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoTodoCli() {
  return (
    <PageContainer title="Projeto: To-Do CLI" subtitle="Aplicar o que aprendeu construindo um gerenciador de tarefas no terminal." difficulty="intermediario" timeToRead="30 min">
        <h2>Por que esse projeto?</h2><p>
          To-do list é o "hello world" de aplicações reais: você toca em parsing de argumentos, persistência em arquivo, serialização JSON, datas e um pouquinho de UX no terminal. Quando estiver pronto, você roda <code>todo add "comprar pão"</code> no seu shell de verdade — ou seja, vira ferramenta, não exercício.
        </p><h2>Especificação</h2><p>O CLI vai aceitar os comandos abaixo:</p><ul>
          <li>
            <code>todo add "comprar pão"</code> — cria tarefa nova
          </li><li>
            <code>todo list</code> — lista tudo (feitas e pendentes)
          </li><li>
            <code>todo done 1</code> — marca a tarefa de id 1 como feita
          </li><li>
            <code>todo remove 1</code> — remove a tarefa
          </li><li>
            <code>todo clear</code> — apaga tudo
          </li>
        </ul><p>
          Estado vai num único arquivo JSON em <code>~/.todo.json</code>. Sem banco, sem servidor — portátil e simples de inspecionar com qualquer editor.
        </p><h2>Stack escolhida</h2><ul>
          <li>
            <strong>Java 21</strong> (records, var, switch novo)
          </li><li>
            <strong>Picocli</strong> pra parsing de argumentos (mais elegante que mexer em <code>args[0]</code> na mão)
          </li><li>
            <strong>Jackson</strong> pra ler/gravar JSON
          </li><li>
            <strong>Maven</strong> pra empacotar tudo num jar executável
          </li>
        </ul><h2>1. pom.xml</h2><CodeBlock title="pom.xml" code={`<project xmlns="http://maven.apache.org/POM/4.0.0">
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
</project>`} /><h2>2. O record Tarefa</h2><p>
          Records (Java 16+) são perfeitos pra DTOs: imutáveis, com <code>equals</code>,<code>hashCode</code> e <code>toString</code> grátis.
        </p><CodeBlock title="Tarefa.java" code={`package dev.voce.todo;

import java.time.LocalDateTime;

public record Tarefa(int id, String desc, boolean feita, LocalDateTime criadaEm) {
    public Tarefa marcarFeita() {
        return new Tarefa(id, desc, true, criadaEm);
    }
}`} /><h2>3. Repositório com leitura/escrita</h2><CodeBlock title="TaskRepository.java" code={`package dev.voce.todo;

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
}`} /><h2>4. Comandos com Picocli</h2><CodeBlock title="Todo.java" code={`package dev.voce.todo;

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
}`} /><h2>5. Empacotando e usando</h2><CodeBlock code={`# build
mvn -q package

# alias no ~/.bashrc ou ~/.zshrc
alias todo='java -jar /caminho/todo-cli-1.0.0.jar'

# uso
todo add "comprar pão"
todo add "estudar streams"
todo list
todo done 1
todo remove 2`} /><AlertBox type="tip" title="Dica de produtividade">
          Mantenha o JSON num diretório sincronizado (Dropbox, iCloud, git privado) e suas tarefas aparecem automaticamente em todas as máquinas onde o jar estiver instalado.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Adicione um campo <code>prioridade</code> (enum <code>BAIXA</code>, <code>MEDIA</code>,<code>ALTA</code>) no record <code>Tarefa</code> e mostre um marcador colorido no<code>list</code> usando códigos ANSI (<code>\u001B[31m</code> pra vermelho).
          </li><li>
            Acrescente <code>--due 2025-12-31</code> ao comando <code>add</code> e implemente<code>todo overdue</code> que mostra só as tarefas vencidas.
          </li><li>
            Crie um subcomando <code>todo export --to csv</code> que gera um arquivo CSV pronto pra abrir no LibreOffice.
          </li>
        </ol>
      </PageContainer>
  );
}
