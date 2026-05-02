import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HibernateIntro() {
  return (
    <PageContainer title="Hibernate & JPA: ORM em Java" subtitle="Mapeamento Objeto-Relacional — adeus SQL boilerplate." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine ter que escrever <code>INSERT INTO usuarios (nome, email) VALUES (?, ?)</code> toda vez que salvar um objeto, e depois um <code>SELECT</code> com 12 colunas pra reconstruir a classe na mão. Multiplique por 30 entidades. Você acabou de inventar 80% do trabalho chato de back-end. ORM (Object-Relational Mapping) resolve isso: você mexe com objetos Java, a biblioteca cuida do SQL.
        </p><h2>JPA vs Hibernate: quem é quem?</h2><p>
          <strong>JPA</strong> (Jakarta Persistence API, antes <em>javax.persistence</em>, agora<code>jakarta.persistence</code> desde Jakarta EE 9 / Spring Boot 3) é a <strong>especificação</strong>: um conjunto de interfaces e anotações padronizadas. Não roda nada sozinha.
        </p><p>
          <strong>Hibernate</strong> é a <strong>implementação</strong> mais popular dessa especificação (existem outras: EclipseLink, OpenJPA). Quando você adiciona <code>spring-boot-starter-data-jpa</code>, o Hibernate vem junto por padrão.
        </p><AlertBox type="tip" title="Analogia">
          JPA é como a especificação USB: define o formato do plug. Hibernate é o cabo USB que você compra. Você programa contra a especificação, troca a marca do cabo se quiser.
        </AlertBox><h2>O que é ORM na prática</h2><p>O mapeamento traduz uma tabela em classe e vice-versa:</p><CodeBlock title="Tabela vira classe" code={`-- SQL
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(150) UNIQUE
);

// Java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    // getters/setters/construtor padrão
}`} /><h2>Vantagens reais</h2><ul>
          <li>
            <strong>Menos SQL boilerplate:</strong> CRUDs viram uma linha (<code>repo.save(user)</code>).
          </li><li>
            <strong>Banco-agnóstico:</strong> trocar Postgres por MySQL muda só o dialect na config.
          </li><li>
            <strong>Cache:</strong> primeiro nível por sessão (automático), segundo nível opcional (Ehcache, Caffeine).
          </li><li>
            <strong>Lazy loading:</strong> carrega <code>pedido.itens</code> só quando você acessa.
          </li><li>
            <strong>Dirty checking:</strong> mudou o objeto dentro da transação? Ele dá UPDATE sozinho no commit.
          </li>
        </ul><h2>Desvantagens (sim, existem)</h2><ul>
          <li>
            <strong>Curva de aprendizado:</strong> session, persistence context, flush, detached… não é trivial.
          </li><li>
            <strong>Queries complexas sofrem:</strong> relatórios com 5 joins e window function ficam melhores em SQL puro.
          </li><li>
            <strong>Pegadinha N+1:</strong> carregar 100 pedidos e iterar acessando <code>p.cliente</code>dispara 101 queries se você não usar <code>JOIN FETCH</code>. Vai te morder.
          </li><li>
            <strong>Magia demais:</strong> coisas acontecem fora do seu controle. Difícil debugar sem entender o ciclo de vida.
          </li>
        </ul><AlertBox type="warning" title="N+1 em uma frase">
          Toda vez que ver loop iterando sobre uma lista lazy, suspeite. Ative<code>spring.jpa.show-sql=true</code> e conte as queries no log.
        </AlertBox><h2>EntityManager: o coração</h2><p>
          É a API de baixo nível do JPA. Você raramente vai usar direto se estiver no Spring Data (que abstrai com <code>JpaRepository</code>), mas vale conhecer:
        </p><CodeBlock title="EntityManager direto" code={`@PersistenceContext
private EntityManager em;

public Usuario buscar(Long id) {
    return em.find(Usuario.class, id);
}

@Transactional
public void salvar(Usuario u) {
    em.persist(u); // INSERT no flush
}

@Transactional
public void atualizar(Long id, String novoNome) {
    Usuario u = em.find(Usuario.class, id);
    u.setNome(novoNome); // dirty checking faz o UPDATE sozinho
}`} /><h2>Configuração: persistence.xml ou Spring</h2><p>
          Em projetos Jakarta EE puros, você descreve a unidade de persistência em<code>META-INF/persistence.xml</code>. Em Spring Boot, esquece esse arquivo: tudo vai no<code>application.properties</code>:
        </p><CodeBlock title="application.properties" code={`spring.datasource.url=jdbc:postgresql://localhost:5432/loja
spring.datasource.username=postgres
spring.datasource.password=secret

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`} /><AlertBox type="danger" title="ddl-auto=update em produção? NÃO.">
          Use <code>validate</code> em prod e gerencie schema com Flyway ou Liquibase. Deixar o Hibernate criar/alterar tabelas em produção é receita pra perder dados.
        </AlertBox><h2>Alternativas modernas</h2><ul>
          <li>
            <strong>jOOQ:</strong> se você ama SQL e quer type-safety nele. Gera classes a partir do schema, você escreve queries fluentes que parecem SQL.
          </li><li>
            <strong>MyBatis:</strong> meio-termo. Você escreve SQL em XML/anotação, ele faz o mapping para objetos. Ótimo pra legado e queries complexas.
          </li><li>
            <strong>Spring Data JDBC:</strong> ORM mais simples, sem lazy loading nem cache. Para quem acha JPA "demais".
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um Spring Boot novo com <code>spring-boot-starter-data-jpa</code> + H2. Mapeie uma entidade <code>Produto</code> (id, nome, preco). Crie um <code>JpaRepository</code> e salve 3 produtos no <code>CommandLineRunner</code>.
          </li><li>
            Ative <code>spring.jpa.show-sql=true</code> e observe o SQL gerado para cada operação (save, findAll, deleteById). Compare com o SQL que você escreveria à mão.
          </li><li>
            Pesquise a diferença entre <code>em.persist()</code>, <code>em.merge()</code> e<code>em.find()</code>. Quando cada um é usado? Escreva 3 frases explicando.
          </li>
        </ol>
      </PageContainer>
  );
}
