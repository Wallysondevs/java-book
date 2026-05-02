import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JpaQueries() {
  return (
    <PageContainer title="Queries em JPA" subtitle="JPQL, Criteria, native — escolha pelo problema." difficulty="avancado" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          <code>findById</code> resolve 30% dos casos. Os outros 70% precisam de filtros, joins, agregações, ordenações. JPA oferece três caminhos: <strong>JPQL</strong> (texto orientado a objetos), <strong>Criteria</strong> (programática, type-safe) e <strong>native query</strong>(SQL puro). Escolher errado deixa o código verboso, lento ou frágil.
        </p><h2>JPQL: SQL "para objetos"</h2><p>
          Parece SQL mas refere <strong>classes e campos</strong>, não tabelas e colunas. Maiúsculas e minúsculas importam para nomes de classes/campos:
        </p><CodeBlock title="JPQL básico" code={`// Note: 'Usuario' é a classe, não a tabela. 'email' é o campo.
String jpql = "SELECT u FROM Usuario u WHERE u.email = ?1";

Usuario u = em.createQuery(jpql, Usuario.class)
              .setParameter(1, "ana@email.com")
              .getSingleResult();`} /><h2>Parâmetros: posicionais vs nomeados</h2><CodeBlock title="Dois estilos" code={`// Posicional (?1, ?2 — começa em 1, NÃO em 0)
em.createQuery("SELECT u FROM Usuario u WHERE u.idade > ?1 AND u.cidade = ?2", Usuario.class)
  .setParameter(1, 18)
  .setParameter(2, "Recife")
  .getResultList();

// Nomeado (:idade, :cidade — preferido, mais legível)
em.createQuery("SELECT u FROM Usuario u WHERE u.idade > :idade AND u.cidade = :cidade", Usuario.class)
  .setParameter("idade", 18)
  .setParameter("cidade", "Recife")
  .getResultList();`} /><AlertBox type="danger" title="NUNCA concatene strings na query">
          <code>{`"WHERE email = '" + email + "'"`}</code> é SQL injection. Sempre use<code>setParameter</code>.
        </AlertBox><h2>Os três métodos de execução</h2><ul>
          <li>
            <strong>getResultList():</strong> retorna <code>
              {"List<T>"}
            </code>. Vazio se nada bate.
          </li><li>
            <strong>getSingleResult():</strong>{" retorna 1 resultado. Lança exceção se 0 ou >1."}
          </li><li>
            <strong>getResultStream():</strong> retorna <code>
              {"Stream<T>"}
            </code>. Útil para datasets grandes (combine com cursor).
          </li>
        </ul><CodeBlock title="Quando usar cada um" code={`// Lista (até 0 itens, sem exceção)
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
  .forEach(this::processar);`} /><h2>JOIN FETCH: a arma contra N+1</h2><CodeBlock title="Carregando tudo numa query só" code={`String jpql = """
    SELECT DISTINCT p FROM Pedido p
    JOIN FETCH p.cliente
    JOIN FETCH p.itens i
    JOIN FETCH i.produto
    WHERE p.status = :status
""";

List<Pedido> pedidos = em.createQuery(jpql, Pedido.class)
                         .setParameter("status", Status.ABERTO)
                         .getResultList();`} /><p>
          O <code>DISTINCT</code> no JPQL evita duplicação por causa do JOIN cartesiano em coleções.
        </p><h2>@NamedQuery: query na entidade</h2><p>Útil para reuso e validação na inicialização:</p><CodeBlock title="NamedQuery" code={`@Entity
@NamedQuery(
    name = "Usuario.porEmail",
    query = "SELECT u FROM Usuario u WHERE u.email = :email"
)
public class Usuario { /* ... */ }

// Uso:
Usuario u = em.createNamedQuery("Usuario.porEmail", Usuario.class)
              .setParameter("email", "ana@email.com")
              .getSingleResult();`} /><h2>Native Query: SQL puro</h2><p>
          Quando JPQL não dá conta (window functions, CTEs complexos, hints específicos do banco):
        </p><CodeBlock title="Native query" code={`// Retornando entidade (mapping direto)
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
}`} /><AlertBox type="warning" title="Trade-off de native">
          Você perde portabilidade entre bancos e o cache de queries do JPA fica menos eficiente. Use só quando JPQL não resolve.
        </AlertBox><h2>Criteria API: type-safe e programática</h2><p>
          Type-safe (erros em compilação), boa para queries dinâmicas (montadas com base em filtros opcionais). Em troca: <strong>verbose</strong>.
        </p><CodeBlock title="Criteria básica" code={`CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Usuario> cq = cb.createQuery(Usuario.class);
Root<Usuario> u = cq.from(Usuario.class);

cq.select(u).where(
    cb.and(
        cb.greaterThan(u.get("idade"), 18),
        cb.equal(u.get("cidade"), "Recife")
    )
);

List<Usuario> resultado = em.createQuery(cq).getResultList();`} /><p>
          Para ficar realmente type-safe, gera-se um metamodel (<code>Usuario_</code>) com o JPA Modelgen. Daí <code>u.get(Usuario_.idade)</code> em vez de string.
        </p><h2>Spring Data: Specifications</h2><p>
          Wrapper amigável da Criteria. Permite combinar filtros com <code>and</code>/<code>or</code>:
        </p><CodeBlock title="Specifications" code={`public class UsuarioSpecs {
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
);`} /><h2>Quando usar cada um?</h2><ul>
          <li>
            <strong>JPQL (com @Query do Spring Data):</strong> 80% dos casos. Queries fixas e legíveis.
          </li><li>
            <strong>Criteria/Specifications:</strong> filtros dinâmicos, telas de busca avançada.
          </li><li>
            <strong>Native query:</strong> recursos do banco que JPQL não tem, performance crítica.
          </li><li>
            <strong>Spring Data por nome do método</strong> (<code>findByEmailAndAtivoTrue</code>): pequenos casos. Vira monstro com muitos filtros.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Escreva uma JPQL que retorne os 5 produtos mais caros da categoria "Eletrônicos", ordenados decrescente. Use parâmetro nomeado para a categoria.
          </li><li>
            Crie um <code>@NamedQuery</code> em <code>Pedido</code> chamado <code>Pedido.abertosDoCliente</code>que retorna pedidos com status ABERTO de um cliente (parâmetro <code>:clienteId</code>).
          </li><li>
            Implemente uma busca de usuários com filtros opcionais (cidade, idade mínima, ativo) usando <code>Specification</code>. Combine só os que vierem preenchidos.
          </li>
        </ol>
      </PageContainer>
  );
}
