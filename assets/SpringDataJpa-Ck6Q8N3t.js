import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(r,{title:"Spring Data JPA",subtitle:"Repository pattern automático — escreva interface, ganhe CRUD.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["JDBC puro é verboso: abrir conexão, preparar statement, mapear ResultSet, fechar tudo, tratar exceção. Hibernate (JPA) elimina muito boilerplate, mas ainda exige escrever DAOs. Spring Data JPA vai além: você declara uma ",e.jsx("strong",{children:"interface"})," que estende ",e.jsx("code",{children:"JpaRepository"})," e o framework gera a implementação em runtime. CRUD, paginação, ordenação, queries por nome de método — tudo de graça."]}),e.jsx("h2",{children:"Setup"}),e.jsx(o,{title:"pom.xml — dependências",code:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- escolha um driver -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
<!-- ou PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>`}),e.jsx(o,{title:"application.properties — H2 em memória",code:`spring.datasource.url=jdbc:h2:mem:appdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true`}),e.jsx(o,{title:"application.properties — Postgres",code:`spring.datasource.url=jdbc:postgresql://localhost:5432/appdb
spring.datasource.username=app
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`}),e.jsxs(a,{type:"warning",title:"ddl-auto em produção",children:["Use ",e.jsx("code",{children:"validate"})," ou ",e.jsx("code",{children:"none"})," em produção. ",e.jsx("code",{children:"update"})," e ",e.jsx("code",{children:"create"})," alteram o schema e podem causar surpresas. O recomendado é versionar com Flyway ou Liquibase."]}),e.jsx("h2",{children:"Entidade"}),e.jsx(o,{title:"Usuario.java",code:`package com.exemplo.usuario;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    private boolean ativo = true;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // getters, setters, construtor vazio
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@Entity"})," marca a classe como persistente. ",e.jsx("code",{children:"@Id"})," + ",e.jsx("code",{children:"@GeneratedValue"})," dizem que o ID é gerado pelo banco (auto-increment). ",e.jsx("code",{children:"@Column"})," só é necessário quando você quer customizar (nome diferente, NOT NULL, tamanho). JPA exige construtor sem argumentos."]}),e.jsx("h2",{children:"Repository — a mágica"}),e.jsx(o,{title:"UsuarioRepository.java",code:`package com.exemplo.usuario;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}`}),e.jsxs("p",{children:["Só isso. Você ganhou: ",e.jsx("code",{children:"save()"}),", ",e.jsx("code",{children:"findById()"}),", ",e.jsx("code",{children:"findAll()"}),", ",e.jsx("code",{children:"deleteById()"}),", ",e.jsx("code",{children:"count()"}),", ",e.jsx("code",{children:"existsById()"}),", paginação, ordenação. Spring cria a implementação dinamicamente."]}),e.jsx(o,{title:"Usando no service",code:`@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public Usuario criar(Usuario u) { return repo.save(u); }

    public Usuario buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário " + id));
    }

    public List<Usuario> listar() { return repo.findAll(); }
}`}),e.jsx("h2",{children:"Métodos derivados de nome"}),e.jsxs("p",{children:["Spring Data lê o nome do método e gera a query. ",e.jsx("code",{children:"findBy"}),", ",e.jsx("code",{children:"countBy"}),", ",e.jsx("code",{children:"existsBy"}),", ",e.jsx("code",{children:"deleteBy"})," + nome de campo + operador."]}),e.jsx(o,{code:`public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByNomeContainingIgnoreCase(String trecho);

    List<Usuario> findByAtivoTrue();

    List<Usuario> findByNomeAndAtivo(String nome, boolean ativo);

    long countByDataCriacaoAfter(LocalDateTime data);

    boolean existsByEmail(String email);

    List<Usuario> findTop10ByOrderByDataCriacaoDesc();
}`}),e.jsxs("p",{children:["Operadores comuns: ",e.jsx("code",{children:"And"}),", ",e.jsx("code",{children:"Or"}),", ",e.jsx("code",{children:"Between"}),", ",e.jsx("code",{children:"LessThan"}),", ",e.jsx("code",{children:"GreaterThan"}),", ",e.jsx("code",{children:"Like"}),", ",e.jsx("code",{children:"Containing"}),", ",e.jsx("code",{children:"StartingWith"}),", ",e.jsx("code",{children:"IgnoreCase"}),", ",e.jsx("code",{children:"OrderBy...Desc"}),", ",e.jsx("code",{children:"Top10"}),"."]}),e.jsx("h2",{children:"@Query: quando o nome não dá conta"}),e.jsx(o,{title:"JPQL (sintaxe parecida com SQL, mas sobre entidades)",code:`public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE u.ativo = true AND u.idade >= :idade")
    List<Usuario> adultosAtivos(@Param("idade") int idade);

    @Query("SELECT u FROM Usuario u JOIN u.pedidos p GROUP BY u HAVING COUNT(p) > :min")
    List<Usuario> comMaisDePedidos(@Param("min") long min);
}`}),e.jsx(o,{title:"SQL nativo",code:`@Query(value = "SELECT * FROM usuarios WHERE LOWER(email) LIKE %:dominio",
       nativeQuery = true)
List<Usuario> doDominio(@Param("dominio") String dominio);`}),e.jsx("h2",{children:"Paginação e ordenação"}),e.jsx(o,{code:`// no repository — herda de JpaRepository
Page<Usuario> findByAtivo(boolean ativo, Pageable pageable);

// no service ou controller
Pageable p = PageRequest.of(0, 20, Sort.by("nome").ascending());
Page<Usuario> pagina = repo.findByAtivo(true, p);

pagina.getContent();      // List<Usuario> da página
pagina.getTotalElements(); // total geral
pagina.getTotalPages();
pagina.hasNext();`}),e.jsx(o,{title:"Controller — paginação automática via query string",code:`// GET /api/usuarios?page=0&size=20&sort=nome,asc
@GetMapping
public Page<Usuario> listar(Pageable pageable) {
    return repo.findAll(pageable);
}`}),e.jsx("h2",{children:"UPDATE/DELETE com @Modifying"}),e.jsxs("p",{children:["Para queries que ",e.jsx("strong",{children:"alteram"})," dados (não SELECT), use ",e.jsx("code",{children:"@Modifying"})," e geralmente ",e.jsx("code",{children:"@Transactional"}),"."]}),e.jsx(o,{code:`@Modifying
@Transactional
@Query("UPDATE Usuario u SET u.ativo = false WHERE u.dataCriacao < :limite")
int desativarAntigos(@Param("limite") LocalDateTime limite);`}),e.jsx("h2",{children:"@Transactional"}),e.jsxs("p",{children:["Por padrão, métodos de repository já rodam em transação curta (cada chamada). Quando você chama ",e.jsx("strong",{children:"vários"})," repositories em um service e quer atomicidade, anote o método do service:"]}),e.jsx(o,{code:`@Service
public class TransferenciaService {

    @Transactional
    public void transferir(Long origem, Long destino, BigDecimal valor) {
        Conta a = contaRepo.findById(origem).orElseThrow();
        Conta b = contaRepo.findById(destino).orElseThrow();
        a.debitar(valor);
        b.creditar(valor);
        // se algo lançar exceção aqui, ambas as alterações são revertidas
    }
}`}),e.jsxs(a,{type:"note",title:"Rollback automático",children:[e.jsx("code",{children:"@Transactional"})," faz rollback em ",e.jsx("code",{children:"RuntimeException"})," e ",e.jsx("code",{children:"Error"}),", mas ",e.jsx("strong",{children:"não"})," em checked exceptions. Se quiser rollback em todas, use ",e.jsx("code",{children:"@Transactional(rollbackFor = Exception.class)"}),"."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie a entidade ",e.jsx("code",{children:"Produto"})," (id, nome, preco, estoque). Faça um ",e.jsx("code",{children:"ProdutoRepository"})," com método derivado ",e.jsx("code",{children:"findByPrecoLessThanEqual(BigDecimal valor)"})," e ",e.jsx("code",{children:"findByEstoqueGreaterThan(int min)"}),"."]}),e.jsxs("li",{children:["Escreva uma ",e.jsx("code",{children:"@Query"})," JPQL que retorne os 5 produtos mais caros. Exponha em ",e.jsx("code",{children:"GET /api/produtos/top5"}),"."]}),e.jsxs("li",{children:["Implemente um endpoint paginado ",e.jsx("code",{children:"GET /api/produtos?page=0&size=10&sort=preco,desc"})," recebendo ",e.jsx("code",{children:"Pageable"}),"."]})]})]})}export{t as default};
