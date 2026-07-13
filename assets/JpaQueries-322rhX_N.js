import{j as e}from"./index-BpXci30S.js";import{P as i,A as s}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(i,{title:"Queries em JPA",subtitle:"JPQL, Criteria, native — escolha pelo problema.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:[e.jsx("code",{children:"findById"})," resolve 30% dos casos. Os outros 70% precisam de filtros, joins, agregações, ordenações. JPA oferece três caminhos: ",e.jsx("strong",{children:"JPQL"})," (texto orientado a objetos), ",e.jsx("strong",{children:"Criteria"})," (programática, type-safe) e ",e.jsx("strong",{children:"native query"}),"(SQL puro). Escolher errado deixa o código verboso, lento ou frágil."]}),e.jsx("h2",{children:'JPQL: SQL "para objetos"'}),e.jsxs("p",{children:["Parece SQL mas refere ",e.jsx("strong",{children:"classes e campos"}),", não tabelas e colunas. Maiúsculas e minúsculas importam para nomes de classes/campos:"]}),e.jsx(a,{title:"JPQL básico",code:`// Note: 'Usuario' é a classe, não a tabela. 'email' é o campo.
String jpql = "SELECT u FROM Usuario u WHERE u.email = ?1";

Usuario u = em.createQuery(jpql, Usuario.class)
              .setParameter(1, "ana@email.com")
              .getSingleResult();`}),e.jsx("h2",{children:"Parâmetros: posicionais vs nomeados"}),e.jsx(a,{title:"Dois estilos",code:`// Posicional (?1, ?2 — começa em 1, NÃO em 0)
em.createQuery("SELECT u FROM Usuario u WHERE u.idade > ?1 AND u.cidade = ?2", Usuario.class)
  .setParameter(1, 18)
  .setParameter(2, "Recife")
  .getResultList();

// Nomeado (:idade, :cidade — preferido, mais legível)
em.createQuery("SELECT u FROM Usuario u WHERE u.idade > :idade AND u.cidade = :cidade", Usuario.class)
  .setParameter("idade", 18)
  .setParameter("cidade", "Recife")
  .getResultList();`}),e.jsxs(s,{type:"danger",title:"NUNCA concatene strings na query",children:[e.jsx("code",{children:`"WHERE email = '" + email + "'"`})," é SQL injection. Sempre use",e.jsx("code",{children:"setParameter"}),"."]}),e.jsx("h2",{children:"Os três métodos de execução"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"getResultList():"})," retorna ",e.jsx("code",{children:"List<T>"}),". Vazio se nada bate."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"getSingleResult():"})," retorna 1 resultado. Lança exceção se 0 ou >1."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"getResultStream():"})," retorna ",e.jsx("code",{children:"Stream<T>"}),". Útil para datasets grandes (combine com cursor)."]})]}),e.jsx(a,{title:"Quando usar cada um",code:`// Lista (até 0 itens, sem exceção)
List<Pedido> pedidos = em.createQuery("FROM Pedido p WHERE p.status = :s", Pedido.class)
                         .setParameter("s", Status.PENDENTE)
                         .getResultList();

// Único (use Optional helper se possível)
try {
    Usuario u = em.createQuery("FROM Usuario u WHERE u.email = :e", Usuario.class)
                  .setParameter("e", email)
                  .getSingleResult();
} catch (NoResultException e) {
    // não achou
}

// Stream (lazy — fechar a transação consome)
em.createQuery("FROM Log l WHERE l.dia = :d", Log.class)
  .setParameter("d", LocalDate.now())
  .getResultStream()
  .forEach(this::processar);`}),e.jsx("h2",{children:"JOIN FETCH: a arma contra N+1"}),e.jsx(a,{title:"Carregando tudo numa query só",code:`String jpql = """
    SELECT DISTINCT p FROM Pedido p
    JOIN FETCH p.cliente
    JOIN FETCH p.itens i
    JOIN FETCH i.produto
    WHERE p.status = :status
""";

List<Pedido> pedidos = em.createQuery(jpql, Pedido.class)
                         .setParameter("status", Status.ABERTO)
                         .getResultList();`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"DISTINCT"})," no JPQL evita duplicação por causa do JOIN cartesiano em coleções."]}),e.jsx("h2",{children:"@NamedQuery: query na entidade"}),e.jsx("p",{children:"Útil para reuso e validação na inicialização:"}),e.jsx(a,{title:"NamedQuery",code:`@Entity
@NamedQuery(
    name = "Usuario.porEmail",
    query = "SELECT u FROM Usuario u WHERE u.email = :email"
)
public class Usuario { /* ... */ }

// Uso:
Usuario u = em.createNamedQuery("Usuario.porEmail", Usuario.class)
              .setParameter("email", "ana@email.com")
              .getSingleResult();`}),e.jsx("h2",{children:"Native Query: SQL puro"}),e.jsx("p",{children:"Quando JPQL não dá conta (window functions, CTEs complexos, hints específicos do banco):"}),e.jsx(a,{title:"Native query",code:`// Retornando entidade (mapping direto)
List<Usuario> ativos = em.createNativeQuery(
    "SELECT * FROM usuarios WHERE created_at > NOW() - INTERVAL '30 days'",
    Usuario.class
).getResultList();

// Retornando colunas avulsas
List<Object[]> rows = em.createNativeQuery(
    "SELECT cidade, COUNT(*) FROM usuarios GROUP BY cidade"
).getResultList();
for (Object[] r : rows) {
    String cidade = (String) r[0];
    Long total = ((Number) r[1]).longValue();
}`}),e.jsx(s,{type:"warning",title:"Trade-off de native",children:"Você perde portabilidade entre bancos e o cache de queries do JPA fica menos eficiente. Use só quando JPQL não resolve."}),e.jsx("h2",{children:"Criteria API: type-safe e programática"}),e.jsxs("p",{children:["Type-safe (erros em compilação), boa para queries dinâmicas (montadas com base em filtros opcionais). Em troca: ",e.jsx("strong",{children:"verbose"}),"."]}),e.jsx(a,{title:"Criteria básica",code:`CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Usuario> cq = cb.createQuery(Usuario.class);
Root<Usuario> u = cq.from(Usuario.class);

cq.select(u).where(
    cb.and(
        cb.greaterThan(u.get("idade"), 18),
        cb.equal(u.get("cidade"), "Recife")
    )
);

List<Usuario> resultado = em.createQuery(cq).getResultList();`}),e.jsxs("p",{children:["Para ficar realmente type-safe, gera-se um metamodel (",e.jsx("code",{children:"Usuario_"}),") com o JPA Modelgen. Daí ",e.jsx("code",{children:"u.get(Usuario_.idade)"})," em vez de string."]}),e.jsx("h2",{children:"Spring Data: Specifications"}),e.jsxs("p",{children:["Wrapper amigável da Criteria. Permite combinar filtros com ",e.jsx("code",{children:"and"}),"/",e.jsx("code",{children:"or"}),":"]}),e.jsx(a,{title:"Specifications",code:`public class UsuarioSpecs {
    public static Specification<Usuario> maiorDeIdade() {
        return (root, q, cb) -> cb.greaterThan(root.get("idade"), 18);
    }
    public static Specification<Usuario> daCidade(String cidade) {
        return (root, q, cb) -> cb.equal(root.get("cidade"), cidade);
    }
}

// Uso:
List<Usuario> r = repo.findAll(
    where(maiorDeIdade()).and(daCidade("Recife"))
);`}),e.jsx("h2",{children:"Quando usar cada um?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"JPQL (com @Query do Spring Data):"})," 80% dos casos. Queries fixas e legíveis."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criteria/Specifications:"})," filtros dinâmicos, telas de busca avançada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Native query:"})," recursos do banco que JPQL não tem, performance crítica."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Spring Data por nome do método"})," (",e.jsx("code",{children:"findByEmailAndAtivoTrue"}),"): pequenos casos. Vira monstro com muitos filtros."]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:'Escreva uma JPQL que retorne os 5 produtos mais caros da categoria "Eletrônicos", ordenados decrescente. Use parâmetro nomeado para a categoria.'}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"@NamedQuery"})," em ",e.jsx("code",{children:"Pedido"})," chamado ",e.jsx("code",{children:"Pedido.abertosDoCliente"}),"que retorna pedidos com status ABERTO de um cliente (parâmetro ",e.jsx("code",{children:":clienteId"}),")."]}),e.jsxs("li",{children:["Implemente uma busca de usuários com filtros opcionais (cidade, idade mínima, ativo) usando ",e.jsx("code",{children:"Specification"}),". Combine só os que vierem preenchidos."]})]})]})}export{c as default};
