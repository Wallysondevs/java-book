import{j as o}from"./index-BpXci30S.js";import{P as r,A as i}from"./AlertBox-CmRzTA0W.js";import{C as e}from"./CodeBlock-CuSzYSd8.js";function s(){return o.jsxs(r,{title:"Projeto: API REST de Livros",subtitle:"Spring Boot + JPA + H2 — CRUD funcional em ~150 linhas.",difficulty:"intermediario",timeToRead:"35 min",children:[o.jsx("h2",{children:"Por que esse projeto?"}),o.jsx("p",{children:'90% das vagas backend Java pedem "Spring Boot + JPA + REST". Construir um CRUD do zero com banco, validação, paginação e tratamento de erro te dá o vocabulário básico pra encarar qualquer microserviço corporativo.'}),o.jsx("h2",{children:"Especificação"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"GET /livros"})," — lista paginada"]}),o.jsxs("li",{children:[o.jsxs("code",{children:["GET /livros/","{id}"]})," — detalhe (404 se não existir)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"POST /livros"})," — cria (com validação)"]}),o.jsxs("li",{children:[o.jsxs("code",{children:["PUT /livros/","{id}"]})," — atualiza"]}),o.jsxs("li",{children:[o.jsxs("code",{children:["DELETE /livros/","{id}"]})," — remove"]})]}),o.jsxs("p",{children:["Campos do livro: ",o.jsx("code",{children:"titulo"}),", ",o.jsx("code",{children:"autor"}),", ",o.jsx("code",{children:"ano"}),", ",o.jsx("code",{children:"isbn"}),"."]}),o.jsx("h2",{children:"1. pom.xml"}),o.jsx(e,{title:"pom.xml (resumo)",code:`<parent>
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
</dependencies>`}),o.jsx("h2",{children:"2. application.yml"}),o.jsx(e,{title:"src/main/resources/application.yml",code:`spring:
  datasource:
    url: jdbc:h2:mem:livros
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  h2:
    console:
      enabled: true   # http://localhost:8080/h2-console`}),o.jsx("h2",{children:"3. Entidade Livro"}),o.jsx(e,{title:"Livro.java",code:`package dev.voce.livros;

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
}`}),o.jsx("h2",{children:"4. Repository"}),o.jsx("p",{children:"Spring Data gera a implementação no boot. Você só declara a interface — sem SQL no começo."}),o.jsx(e,{title:"LivroRepository.java",code:`package dev.voce.livros;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Long> {}`}),o.jsx("h2",{children:"5. Service (regras de negócio)"}),o.jsx(e,{title:"LivroService.java",code:`package dev.voce.livros;

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
}`}),o.jsx("h2",{children:"6. Controller"}),o.jsx(e,{title:"LivroController.java",code:`package dev.voce.livros;

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
}`}),o.jsx("h2",{children:"7. Tratamento de erro centralizado"}),o.jsx(e,{title:"ApiExceptionHandler.java",code:`package dev.voce.livros;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(LivroNaoEncontrado.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(LivroNaoEncontrado e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
    }
}`}),o.jsx("h2",{children:"8. Testando com curl"}),o.jsx(e,{code:`# subir
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
curl -X DELETE http://localhost:8080/livros/1`}),o.jsxs(i,{type:"tip",title:"Console H2",children:["Acesse ",o.jsx("code",{children:"http://localhost:8080/h2-console"}),", conecte em",o.jsx("code",{children:"jdbc:h2:mem:livros"})," e veja os dados em tempo real. Ótimo pra aprender."]}),o.jsx("h2",{children:"🎯 Mãos à massa"}),o.jsxs("ol",{children:[o.jsxs("li",{children:["Adicione um endpoint ",o.jsx("code",{children:"GET /livros/buscar?titulo=java"})," usando",o.jsx("code",{children:"findByTituloContainingIgnoreCase"}),"."]}),o.jsxs("li",{children:["Substitua o H2 por PostgreSQL via Docker (",o.jsx("code",{children:"postgres:16"}),") e ajuste o",o.jsx("code",{children:"application.yml"}),". Garanta que tudo continua funcionando."]}),o.jsxs("li",{children:["Escreva 3 testes com ",o.jsx("code",{children:"@SpringBootTest"})," + ",o.jsx("code",{children:"MockMvc"})," cobrindo POST inválido, GET inexistente e DELETE feliz."]})]})]})}export{s as default};
