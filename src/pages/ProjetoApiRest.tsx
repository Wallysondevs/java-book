import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoApiRest() {
  return (
    <PageContainer title="Projeto: API REST de Livros" subtitle="Spring Boot + JPA + H2 — CRUD funcional em ~150 linhas." difficulty="intermediario" timeToRead="35 min">
        <h2>Por que esse projeto?</h2><p>
          90% das vagas backend Java pedem "Spring Boot + JPA + REST". Construir um CRUD do zero com banco, validação, paginação e tratamento de erro te dá o vocabulário básico pra encarar qualquer microserviço corporativo.
        </p><h2>Especificação</h2><ul>
          <li>
            <code>GET /livros</code> — lista paginada
          </li><li>
            <code>GET /livros/{"{id}"}</code> — detalhe (404 se não existir)
          </li><li>
            <code>POST /livros</code> — cria (com validação)
          </li><li>
            <code>PUT /livros/{"{id}"}</code> — atualiza
          </li><li>
            <code>DELETE /livros/{"{id}"}</code> — remove
          </li>
        </ul><p>
          Campos do livro: <code>titulo</code>, <code>autor</code>, <code>ano</code>, <code>isbn</code>.
        </p><h2>1. pom.xml</h2><CodeBlock title="pom.xml (resumo)" code={`<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.3.4</version>
</parent>

<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
  <dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope></dependency>
</dependencies>`} /><h2>2. application.yml</h2><CodeBlock title="src/main/resources/application.yml" code={`spring:
  datasource:
    url: jdbc:h2:mem:livros
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  h2:
    console:
      enabled: true   # http://localhost:8080/h2-console`} /><h2>3. Entidade Livro</h2><CodeBlock title="Livro.java" code={`package dev.voce.livros;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Livro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String titulo;
    @NotBlank private String autor;
    @Min(0)   private int ano;
    @NotBlank private String isbn;

    protected Livro() {}
    public Livro(String titulo, String autor, int ano, String isbn) {
        this.titulo = titulo; this.autor = autor; this.ano = ano; this.isbn = isbn;
    }
    // getters/setters omitidos por brevidade
    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String t) { this.titulo = t; }
    public String getAutor() { return autor; }
    public void setAutor(String a) { this.autor = a; }
    public int getAno() { return ano; }
    public void setAno(int a) { this.ano = a; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String i) { this.isbn = i; }
}`} /><h2>4. Repository</h2><p>
          Spring Data gera a implementação no boot. Você só declara a interface — sem SQL no começo.
        </p><CodeBlock title="LivroRepository.java" code={`package dev.voce.livros;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Long> {}`} /><h2>5. Service (regras de negócio)</h2><CodeBlock title="LivroService.java" code={`package dev.voce.livros;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class LivroService {
    private final LivroRepository repo;
    public LivroService(LivroRepository repo) { this.repo = repo; }

    public Page<Livro> listar(Pageable p) { return repo.findAll(p); }

    public Livro buscar(Long id) {
        return repo.findById(id).orElseThrow(() -> new LivroNaoEncontrado(id));
    }

    public Livro criar(Livro l) { return repo.save(l); }

    public Livro atualizar(Long id, Livro novo) {
        var atual = buscar(id);
        atual.setTitulo(novo.getTitulo());
        atual.setAutor(novo.getAutor());
        atual.setAno(novo.getAno());
        atual.setIsbn(novo.getIsbn());
        return repo.save(atual);
    }

    public void remover(Long id) {
        if (!repo.existsById(id)) throw new LivroNaoEncontrado(id);
        repo.deleteById(id);
    }
}

class LivroNaoEncontrado extends RuntimeException {
    LivroNaoEncontrado(Long id) { super("Livro " + id + " não encontrado"); }
}`} /><h2>6. Controller</h2><CodeBlock title="LivroController.java" code={`package dev.voce.livros;

import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/livros")
public class LivroController {
    private final LivroService service;
    public LivroController(LivroService service) { this.service = service; }

    @GetMapping public Page<Livro> listar(Pageable p) { return service.listar(p); }
    @GetMapping("/{id}") public Livro buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping public Livro criar(@Valid @RequestBody Livro l) { return service.criar(l); }
    @PutMapping("/{id}") public Livro atualizar(@PathVariable Long id, @Valid @RequestBody Livro l) { return service.atualizar(id, l); }
    @DeleteMapping("/{id}") public void remover(@PathVariable Long id) { service.remover(id); }
}`} /><h2>7. Tratamento de erro centralizado</h2><CodeBlock title="ApiExceptionHandler.java" code={`package dev.voce.livros;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(LivroNaoEncontrado.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(LivroNaoEncontrado e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
    }
}`} /><h2>8. Testando com curl</h2><CodeBlock code={`# subir
mvn spring-boot:run

# criar
curl -X POST http://localhost:8080/livros \\
  -H 'Content-Type: application/json' \\
  -d '{"titulo":"Java Eficaz","autor":"Bloch","ano":2018,"isbn":"978-..."}'

# listar (paginado)
curl 'http://localhost:8080/livros?page=0&size=5'

# atualizar
curl -X PUT http://localhost:8080/livros/1 \\
  -H 'Content-Type: application/json' \\
  -d '{"titulo":"Effective Java","autor":"Bloch","ano":2018,"isbn":"978-..."}'

# remover
curl -X DELETE http://localhost:8080/livros/1`} /><AlertBox type="tip" title="Console H2">
          Acesse <code>http://localhost:8080/h2-console</code>, conecte em<code>jdbc:h2:mem:livros</code> e veja os dados em tempo real. Ótimo pra aprender.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Adicione um endpoint <code>GET /livros/buscar?titulo=java</code> usando<code>findByTituloContainingIgnoreCase</code>.
          </li><li>
            Substitua o H2 por PostgreSQL via Docker (<code>postgres:16</code>) e ajuste o<code>application.yml</code>. Garanta que tudo continua funcionando.
          </li><li>
            Escreva 3 testes com <code>@SpringBootTest</code> + <code>MockMvc</code> cobrindo POST inválido, GET inexistente e DELETE feliz.
          </li>
        </ol>
      </PageContainer>
  );
}
