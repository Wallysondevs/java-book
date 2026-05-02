import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JpaRelationships() {
  return (
    <PageContainer title="Relacionamentos JPA" subtitle="@OneToMany, @ManyToOne, @ManyToMany — mapear FKs e tabelas join." difficulty="avancado" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Banco real é cheio de FK. Pedido tem cliente, pedido tem itens, item tem produto, produto tem categorias. Mapear isso errado é a fonte número 1 de bugs de performance e comportamento estranho em apps Spring. Aqui você aprende a fazer certo desde a primeira entidade.
        </p><h2>Os quatro tipos</h2><ul>
          <li>
            <strong>@OneToOne:</strong> raro. Quase sempre é melhor herança ou Embedded.
          </li><li>
            <strong>@ManyToOne:</strong> o mais comum. FK na própria tabela.
          </li><li>
            <strong>@OneToMany:</strong> o "lado inverso". Coleção de filhos.
          </li><li>
            <strong>@ManyToMany:</strong> tabela intermediária (join table).
          </li>
        </ul><h2>@ManyToOne: o dono do relacionamento</h2><p>
          Pedido pertence a Cliente. A tabela <code>pedidos</code> tem coluna <code>cliente_id</code>. Quem tem a FK é o <strong>dono</strong>:
        </p><CodeBlock title="ManyToOne" code={`@Entity
public class Pedido {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    private LocalDateTime criadoEm;
}`} /><p>
          O <code>@JoinColumn</code> customiza o nome da FK. Sem ele, Hibernate gera<code>cliente_id</code> automaticamente (depende do naming strategy).
        </p><AlertBox type="warning" title="Mude o padrão de fetch">
          Por padrão, <code>@ManyToOne</code> e <code>@OneToOne</code> são <strong>EAGER</strong>. Isso quase sempre é ruim — buscar Pedido carrega Cliente sempre, mesmo que você não use. Coloque <code>fetch = FetchType.LAZY</code> sempre.
        </AlertBox><h2>@OneToMany: o lado inverso</h2><p>
          Cliente tem N pedidos. Não há coluna nova na tabela cliente — a FK continua em<code>pedidos</code>. O lado inverso usa <code>mappedBy</code> apontando o campo do dono:
        </p><CodeBlock title="OneToMany bidirecional" code={`@Entity
public class Cliente {
    @Id @GeneratedValue private Long id;
    private String nome;

    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private List<Pedido> pedidos = new ArrayList<>();

    // método helper para manter os dois lados sincronizados
    public void adicionarPedido(Pedido p) {
        pedidos.add(p);
        p.setCliente(this);
    }
}`} /><AlertBox type="tip" title="Bidirecional vs unidirecional">
          Bidirecional (mappedBy nos dois lados) só vale se você realmente navega <code>cliente.getPedidos()</code>. Se só navega <code>pedido.getCliente()</code>, deixe unidirecional. Menos código, menos bug.
        </AlertBox><h2>@ManyToMany: com tabela intermediária</h2><p>Produto tem várias categorias, categoria tem vários produtos:</p><CodeBlock title="ManyToMany" code={`@Entity
public class Produto {
    @Id @GeneratedValue private Long id;
    private String nome;

    @ManyToMany
    @JoinTable(
        name = "produto_categoria",
        joinColumns = @JoinColumn(name = "produto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<Categoria> categorias = new HashSet<>();
}

@Entity
public class Categoria {
    @Id @GeneratedValue private Long id;
    private String nome;

    @ManyToMany(mappedBy = "categorias")
    private Set<Produto> produtos = new HashSet<>();
}`} /><AlertBox type="note" title="Use Set, não List, em ManyToMany">
          List em ManyToMany dá comportamento estranho em UPDATE (o Hibernate apaga e re-insere a tabela join inteira). Set evita duplicatas e é mais eficiente.
        </AlertBox><h2>Atenção máxima: pegadinha N+1</h2><p>Você busca 100 pedidos e itera para mostrar o cliente:</p><CodeBlock title="O pesadelo" code={`List<Pedido> pedidos = repo.findAll(); // 1 query: SELECT * FROM pedidos
for (Pedido p : pedidos) {
    System.out.println(p.getCliente().getNome()); // +1 query CADA iteração
}
// Total: 1 + 100 = 101 queries. Banco morto.`} /><p>
          Solução: <strong>JOIN FETCH</strong> em JPQL ou <code>@EntityGraph</code> no Spring Data:
        </p><CodeBlock title="Resolvendo N+1" code={`// JPQL com JOIN FETCH
@Query("SELECT p FROM Pedido p JOIN FETCH p.cliente")
List<Pedido> buscarComCliente();

// Ou com EntityGraph (Spring Data)
@EntityGraph(attributePaths = {"cliente", "itens"})
@Override
List<Pedido> findAll();`} /><h2>Cascade: efeitos em cascata</h2><p>Quando você salva/deleta o pai, o que acontece com os filhos? Você decide:</p><ul>
          <li>
            <strong>PERSIST:</strong> salva pai → salva filhos novos junto.
          </li><li>
            <strong>MERGE:</strong> idem para merge.
          </li><li>
            <strong>REMOVE:</strong> deleta pai → deleta filhos.
          </li><li>
            <strong>ALL:</strong> tudo. Use só se filhos pertencem 100% ao pai.
          </li>
        </ul><CodeBlock title="Cascade com critério" code={`@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
private List<ItemPedido> itens = new ArrayList<>();

// Agora: salvar Pedido salva itens; remover item da lista deleta do banco.`} /><AlertBox type="danger" title="Cascade ALL em ManyToMany? NUNCA.">
          Imagine deletar um Produto e isso apagar Categoria, que apaga outros Produtos… Cascade ALL faz sentido só em composição forte (Pedido → Itens). Em ManyToMany, nunca.
        </AlertBox><h2>orphanRemoval</h2><p>
          Diferente de <code>CascadeType.REMOVE</code>: removeu o filho da coleção em memória? Ele é deletado do banco. Útil pra coleções "filhos" que não devem existir órfãos:
        </p><CodeBlock title="orphanRemoval em ação" code={`pedido.getItens().remove(item);
// commit da transação → DELETE FROM itens WHERE id = ?`} /><h2>Equals e hashCode em entidades</h2><p>
          Importantíssimo: NUNCA use todos os campos. Use só o ID (e cuidado quando ID é nulo, antes de persistir). Ou use uma chave de negócio estável.
        </p><CodeBlock title="equals/hashCode seguro" code={`@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Pedido p)) return false;
    return id != null && id.equals(p.id);
}

@Override
public int hashCode() {
    return getClass().hashCode(); // constante; evita problemas com lazy proxies
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Modele <code>Autor</code> e <code>Livro</code> com <code>@ManyToOne</code> de Livro para Autor (LAZY). Crie um repositório, salve 1 autor com 3 livros e busque tudo.
          </li><li>
            Cause um N+1 propositalmente: faça <code>findAll()</code> dos livros e itere imprimindo<code>livro.getAutor().getNome()</code>. Conte queries no log. Resolva com<code>JOIN FETCH</code>.
          </li><li>
            Adicione <code>@OneToMany</code> em Autor com <code>cascade = ALL</code> e<code>orphanRemoval = true</code>. Remova um livro da lista do autor e confirme o DELETE.
          </li>
        </ol>
      </PageContainer>
  );
}
