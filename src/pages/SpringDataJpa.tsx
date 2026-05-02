import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringDataJpa() {
  return (
    <PageContainer title="Spring Data JPA" subtitle="Repository pattern automático — escreva interface, ganhe CRUD." difficulty="intermediario" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          JDBC puro é verboso: abrir conexão, preparar statement, mapear ResultSet, fechar tudo, tratar exceção. Hibernate (JPA) elimina muito boilerplate, mas ainda exige escrever DAOs. Spring Data JPA vai além: você declara uma <strong>interface</strong> que estende <code>JpaRepository</code> e o framework gera a implementação em runtime. CRUD, paginação, ordenação, queries por nome de método — tudo de graça.
        </p><h2>Setup</h2><CodeBlock title="pom.xml — dependências" code={`<dependency>
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
</dependency>`} /><CodeBlock title="application.properties — H2 em memória" code={`spring.datasource.url=jdbc:h2:mem:appdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true`} /><CodeBlock title="application.properties — Postgres" code={`spring.datasource.url=jdbc:postgresql://localhost:5432/appdb
spring.datasource.username=app
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`} /><AlertBox type="warning" title="ddl-auto em produção">
          Use <code>validate</code> ou <code>none</code> em produção. <code>update</code> e <code>create</code> alteram o schema e podem causar surpresas. O recomendado é versionar com Flyway ou Liquibase.
        </AlertBox><h2>Entidade</h2><CodeBlock title="Usuario.java" code={`package com.exemplo.usuario;

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
}`} /><p>
          <code>@Entity</code> marca a classe como persistente. <code>@Id</code> + <code>@GeneratedValue</code> dizem que o ID é gerado pelo banco (auto-increment). <code>@Column</code> só é necessário quando você quer customizar (nome diferente, NOT NULL, tamanho). JPA exige construtor sem argumentos.
        </p><h2>Repository — a mágica</h2><CodeBlock title="UsuarioRepository.java" code={`package com.exemplo.usuario;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}`} /><p>
          Só isso. Você ganhou: <code>save()</code>, <code>findById()</code>, <code>findAll()</code>, <code>deleteById()</code>, <code>count()</code>, <code>existsById()</code>, paginação, ordenação. Spring cria a implementação dinamicamente.
        </p><CodeBlock title="Usando no service" code={`@Service
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
}`} /><h2>Métodos derivados de nome</h2><p>
          Spring Data lê o nome do método e gera a query. <code>findBy</code>, <code>countBy</code>, <code>existsBy</code>, <code>deleteBy</code> + nome de campo + operador.
        </p><CodeBlock code={`public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByNomeContainingIgnoreCase(String trecho);

    List<Usuario> findByAtivoTrue();

    List<Usuario> findByNomeAndAtivo(String nome, boolean ativo);

    long countByDataCriacaoAfter(LocalDateTime data);

    boolean existsByEmail(String email);

    List<Usuario> findTop10ByOrderByDataCriacaoDesc();
}`} /><p>
          Operadores comuns: <code>And</code>, <code>Or</code>, <code>Between</code>, <code>LessThan</code>, <code>GreaterThan</code>, <code>Like</code>, <code>Containing</code>, <code>StartingWith</code>, <code>IgnoreCase</code>, <code>OrderBy...Desc</code>, <code>Top10</code>.
        </p><h2>@Query: quando o nome não dá conta</h2><CodeBlock title="JPQL (sintaxe parecida com SQL, mas sobre entidades)" code={`public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE u.ativo = true AND u.idade >= :idade")
    List<Usuario> adultosAtivos(@Param("idade") int idade);

    @Query("SELECT u FROM Usuario u JOIN u.pedidos p GROUP BY u HAVING COUNT(p) > :min")
    List<Usuario> comMaisDePedidos(@Param("min") long min);
}`} /><CodeBlock title="SQL nativo" code={`@Query(value = "SELECT * FROM usuarios WHERE LOWER(email) LIKE %:dominio",
       nativeQuery = true)
List<Usuario> doDominio(@Param("dominio") String dominio);`} /><h2>Paginação e ordenação</h2><CodeBlock code={`// no repository — herda de JpaRepository
Page<Usuario> findByAtivo(boolean ativo, Pageable pageable);

// no service ou controller
Pageable p = PageRequest.of(0, 20, Sort.by("nome").ascending());
Page<Usuario> pagina = repo.findByAtivo(true, p);

pagina.getContent();      // List<Usuario> da página
pagina.getTotalElements(); // total geral
pagina.getTotalPages();
pagina.hasNext();`} /><CodeBlock title="Controller — paginação automática via query string" code={`// GET /api/usuarios?page=0&size=20&sort=nome,asc
@GetMapping
public Page<Usuario> listar(Pageable pageable) {
    return repo.findAll(pageable);
}`} /><h2>UPDATE/DELETE com @Modifying</h2><p>
          Para queries que <strong>alteram</strong> dados (não SELECT), use <code>@Modifying</code> e geralmente <code>@Transactional</code>.
        </p><CodeBlock code={`@Modifying
@Transactional
@Query("UPDATE Usuario u SET u.ativo = false WHERE u.dataCriacao < :limite")
int desativarAntigos(@Param("limite") LocalDateTime limite);`} /><h2>@Transactional</h2><p>
          Por padrão, métodos de repository já rodam em transação curta (cada chamada). Quando você chama <strong>vários</strong> repositories em um service e quer atomicidade, anote o método do service:
        </p><CodeBlock code={`@Service
public class TransferenciaService {

    @Transactional
    public void transferir(Long origem, Long destino, BigDecimal valor) {
        Conta a = contaRepo.findById(origem).orElseThrow();
        Conta b = contaRepo.findById(destino).orElseThrow();
        a.debitar(valor);
        b.creditar(valor);
        // se algo lançar exceção aqui, ambas as alterações são revertidas
    }
}`} /><AlertBox type="note" title="Rollback automático">
          <code>@Transactional</code> faz rollback em <code>RuntimeException</code> e <code>Error</code>, mas <strong>não</strong> em checked exceptions. Se quiser rollback em todas, use <code>@Transactional(rollbackFor = Exception.class)</code>.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie a entidade <code>Produto</code> (id, nome, preco, estoque). Faça um <code>ProdutoRepository</code> com método derivado <code>findByPrecoLessThanEqual(BigDecimal valor)</code> e <code>findByEstoqueGreaterThan(int min)</code>.
          </li><li>
            Escreva uma <code>@Query</code> JPQL que retorne os 5 produtos mais caros. Exponha em <code>GET /api/produtos/top5</code>.
          </li><li>
            Implemente um endpoint paginado <code>GET /api/produtos?page=0&size=10&sort=preco,desc</code> recebendo <code>Pageable</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
