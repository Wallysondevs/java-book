import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(r,{title:"Hibernate & JPA: ORM em Java",subtitle:"Mapeamento Objeto-Relacional — adeus SQL boilerplate.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine ter que escrever ",e.jsx("code",{children:"INSERT INTO usuarios (nome, email) VALUES (?, ?)"})," toda vez que salvar um objeto, e depois um ",e.jsx("code",{children:"SELECT"})," com 12 colunas pra reconstruir a classe na mão. Multiplique por 30 entidades. Você acabou de inventar 80% do trabalho chato de back-end. ORM (Object-Relational Mapping) resolve isso: você mexe com objetos Java, a biblioteca cuida do SQL."]}),e.jsx("h2",{children:"JPA vs Hibernate: quem é quem?"}),e.jsxs("p",{children:[e.jsx("strong",{children:"JPA"})," (Jakarta Persistence API, antes ",e.jsx("em",{children:"javax.persistence"}),", agora",e.jsx("code",{children:"jakarta.persistence"})," desde Jakarta EE 9 / Spring Boot 3) é a ",e.jsx("strong",{children:"especificação"}),": um conjunto de interfaces e anotações padronizadas. Não roda nada sozinha."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Hibernate"})," é a ",e.jsx("strong",{children:"implementação"})," mais popular dessa especificação (existem outras: EclipseLink, OpenJPA). Quando você adiciona ",e.jsx("code",{children:"spring-boot-starter-data-jpa"}),", o Hibernate vem junto por padrão."]}),e.jsx(a,{type:"tip",title:"Analogia",children:"JPA é como a especificação USB: define o formato do plug. Hibernate é o cabo USB que você compra. Você programa contra a especificação, troca a marca do cabo se quiser."}),e.jsx("h2",{children:"O que é ORM na prática"}),e.jsx("p",{children:"O mapeamento traduz uma tabela em classe e vice-versa:"}),e.jsx(s,{title:"Tabela vira classe",code:`-- SQL
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
}`}),e.jsx("h2",{children:"Vantagens reais"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Menos SQL boilerplate:"})," CRUDs viram uma linha (",e.jsx("code",{children:"repo.save(user)"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Banco-agnóstico:"})," trocar Postgres por MySQL muda só o dialect na config."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cache:"})," primeiro nível por sessão (automático), segundo nível opcional (Ehcache, Caffeine)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lazy loading:"})," carrega ",e.jsx("code",{children:"pedido.itens"})," só quando você acessa."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dirty checking:"})," mudou o objeto dentro da transação? Ele dá UPDATE sozinho no commit."]})]}),e.jsx("h2",{children:"Desvantagens (sim, existem)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Curva de aprendizado:"})," session, persistence context, flush, detached… não é trivial."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Queries complexas sofrem:"})," relatórios com 5 joins e window function ficam melhores em SQL puro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pegadinha N+1:"})," carregar 100 pedidos e iterar acessando ",e.jsx("code",{children:"p.cliente"}),"dispara 101 queries se você não usar ",e.jsx("code",{children:"JOIN FETCH"}),". Vai te morder."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Magia demais:"})," coisas acontecem fora do seu controle. Difícil debugar sem entender o ciclo de vida."]})]}),e.jsxs(a,{type:"warning",title:"N+1 em uma frase",children:["Toda vez que ver loop iterando sobre uma lista lazy, suspeite. Ative",e.jsx("code",{children:"spring.jpa.show-sql=true"})," e conte as queries no log."]}),e.jsx("h2",{children:"EntityManager: o coração"}),e.jsxs("p",{children:["É a API de baixo nível do JPA. Você raramente vai usar direto se estiver no Spring Data (que abstrai com ",e.jsx("code",{children:"JpaRepository"}),"), mas vale conhecer:"]}),e.jsx(s,{title:"EntityManager direto",code:`@PersistenceContext
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
}`}),e.jsx("h2",{children:"Configuração: persistence.xml ou Spring"}),e.jsxs("p",{children:["Em projetos Jakarta EE puros, você descreve a unidade de persistência em",e.jsx("code",{children:"META-INF/persistence.xml"}),". Em Spring Boot, esquece esse arquivo: tudo vai no",e.jsx("code",{children:"application.properties"}),":"]}),e.jsx(s,{title:"application.properties",code:`spring.datasource.url=jdbc:postgresql://localhost:5432/loja
spring.datasource.username=postgres
spring.datasource.password=secret

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`}),e.jsxs(a,{type:"danger",title:"ddl-auto=update em produção? NÃO.",children:["Use ",e.jsx("code",{children:"validate"})," em prod e gerencie schema com Flyway ou Liquibase. Deixar o Hibernate criar/alterar tabelas em produção é receita pra perder dados."]}),e.jsx("h2",{children:"Alternativas modernas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"jOOQ:"})," se você ama SQL e quer type-safety nele. Gera classes a partir do schema, você escreve queries fluentes que parecem SQL."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MyBatis:"})," meio-termo. Você escreve SQL em XML/anotação, ele faz o mapping para objetos. Ótimo pra legado e queries complexas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Spring Data JDBC:"}),' ORM mais simples, sem lazy loading nem cache. Para quem acha JPA "demais".']})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um Spring Boot novo com ",e.jsx("code",{children:"spring-boot-starter-data-jpa"})," + H2. Mapeie uma entidade ",e.jsx("code",{children:"Produto"})," (id, nome, preco). Crie um ",e.jsx("code",{children:"JpaRepository"})," e salve 3 produtos no ",e.jsx("code",{children:"CommandLineRunner"}),"."]}),e.jsxs("li",{children:["Ative ",e.jsx("code",{children:"spring.jpa.show-sql=true"})," e observe o SQL gerado para cada operação (save, findAll, deleteById). Compare com o SQL que você escreveria à mão."]}),e.jsxs("li",{children:["Pesquise a diferença entre ",e.jsx("code",{children:"em.persist()"}),", ",e.jsx("code",{children:"em.merge()"})," e",e.jsx("code",{children:"em.find()"}),". Quando cada um é usado? Escreva 3 frases explicando."]})]})]})}export{c as default};
