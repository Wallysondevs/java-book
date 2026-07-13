import{j as e}from"./index-BpXci30S.js";import{P as a,A as i}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function r(){return e.jsxs(a,{title:"Relacionamentos JPA",subtitle:"@OneToMany, @ManyToOne, @ManyToMany — mapear FKs e tabelas join.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Banco real é cheio de FK. Pedido tem cliente, pedido tem itens, item tem produto, produto tem categorias. Mapear isso errado é a fonte número 1 de bugs de performance e comportamento estranho em apps Spring. Aqui você aprende a fazer certo desde a primeira entidade."}),e.jsx("h2",{children:"Os quatro tipos"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"@OneToOne:"})," raro. Quase sempre é melhor herança ou Embedded."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"@ManyToOne:"})," o mais comum. FK na própria tabela."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"@OneToMany:"}),' o "lado inverso". Coleção de filhos.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"@ManyToMany:"})," tabela intermediária (join table)."]})]}),e.jsx("h2",{children:"@ManyToOne: o dono do relacionamento"}),e.jsxs("p",{children:["Pedido pertence a Cliente. A tabela ",e.jsx("code",{children:"pedidos"})," tem coluna ",e.jsx("code",{children:"cliente_id"}),". Quem tem a FK é o ",e.jsx("strong",{children:"dono"}),":"]}),e.jsx(o,{title:"ManyToOne",code:`@Entity
public class Pedido {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    private LocalDateTime criadoEm;
}`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"@JoinColumn"})," customiza o nome da FK. Sem ele, Hibernate gera",e.jsx("code",{children:"cliente_id"})," automaticamente (depende do naming strategy)."]}),e.jsxs(i,{type:"warning",title:"Mude o padrão de fetch",children:["Por padrão, ",e.jsx("code",{children:"@ManyToOne"})," e ",e.jsx("code",{children:"@OneToOne"})," são ",e.jsx("strong",{children:"EAGER"}),". Isso quase sempre é ruim — buscar Pedido carrega Cliente sempre, mesmo que você não use. Coloque ",e.jsx("code",{children:"fetch = FetchType.LAZY"})," sempre."]}),e.jsx("h2",{children:"@OneToMany: o lado inverso"}),e.jsxs("p",{children:["Cliente tem N pedidos. Não há coluna nova na tabela cliente — a FK continua em",e.jsx("code",{children:"pedidos"}),". O lado inverso usa ",e.jsx("code",{children:"mappedBy"})," apontando o campo do dono:"]}),e.jsx(o,{title:"OneToMany bidirecional",code:`@Entity
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
}`}),e.jsxs(i,{type:"tip",title:"Bidirecional vs unidirecional",children:["Bidirecional (mappedBy nos dois lados) só vale se você realmente navega ",e.jsx("code",{children:"cliente.getPedidos()"}),". Se só navega ",e.jsx("code",{children:"pedido.getCliente()"}),", deixe unidirecional. Menos código, menos bug."]}),e.jsx("h2",{children:"@ManyToMany: com tabela intermediária"}),e.jsx("p",{children:"Produto tem várias categorias, categoria tem vários produtos:"}),e.jsx(o,{title:"ManyToMany",code:`@Entity
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
}`}),e.jsx(i,{type:"note",title:"Use Set, não List, em ManyToMany",children:"List em ManyToMany dá comportamento estranho em UPDATE (o Hibernate apaga e re-insere a tabela join inteira). Set evita duplicatas e é mais eficiente."}),e.jsx("h2",{children:"Atenção máxima: pegadinha N+1"}),e.jsx("p",{children:"Você busca 100 pedidos e itera para mostrar o cliente:"}),e.jsx(o,{title:"O pesadelo",code:`List<Pedido> pedidos = repo.findAll(); // 1 query: SELECT * FROM pedidos
for (Pedido p : pedidos) {
    System.out.println(p.getCliente().getNome()); // +1 query CADA iteração
}
// Total: 1 + 100 = 101 queries. Banco morto.`}),e.jsxs("p",{children:["Solução: ",e.jsx("strong",{children:"JOIN FETCH"})," em JPQL ou ",e.jsx("code",{children:"@EntityGraph"})," no Spring Data:"]}),e.jsx(o,{title:"Resolvendo N+1",code:`// JPQL com JOIN FETCH
@Query("SELECT p FROM Pedido p JOIN FETCH p.cliente")
List<Pedido> buscarComCliente();

// Ou com EntityGraph (Spring Data)
@EntityGraph(attributePaths = {"cliente", "itens"})
@Override
List<Pedido> findAll();`}),e.jsx("h2",{children:"Cascade: efeitos em cascata"}),e.jsx("p",{children:"Quando você salva/deleta o pai, o que acontece com os filhos? Você decide:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PERSIST:"})," salva pai → salva filhos novos junto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MERGE:"})," idem para merge."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"REMOVE:"})," deleta pai → deleta filhos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ALL:"})," tudo. Use só se filhos pertencem 100% ao pai."]})]}),e.jsx(o,{title:"Cascade com critério",code:`@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
private List<ItemPedido> itens = new ArrayList<>();

// Agora: salvar Pedido salva itens; remover item da lista deleta do banco.`}),e.jsx(i,{type:"danger",title:"Cascade ALL em ManyToMany? NUNCA.",children:"Imagine deletar um Produto e isso apagar Categoria, que apaga outros Produtos… Cascade ALL faz sentido só em composição forte (Pedido → Itens). Em ManyToMany, nunca."}),e.jsx("h2",{children:"orphanRemoval"}),e.jsxs("p",{children:["Diferente de ",e.jsx("code",{children:"CascadeType.REMOVE"}),': removeu o filho da coleção em memória? Ele é deletado do banco. Útil pra coleções "filhos" que não devem existir órfãos:']}),e.jsx(o,{title:"orphanRemoval em ação",code:`pedido.getItens().remove(item);
// commit da transação → DELETE FROM itens WHERE id = ?`}),e.jsx("h2",{children:"Equals e hashCode em entidades"}),e.jsx("p",{children:"Importantíssimo: NUNCA use todos os campos. Use só o ID (e cuidado quando ID é nulo, antes de persistir). Ou use uma chave de negócio estável."}),e.jsx(o,{title:"equals/hashCode seguro",code:`@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Pedido p)) return false;
    return id != null && id.equals(p.id);
}

@Override
public int hashCode() {
    return getClass().hashCode(); // constante; evita problemas com lazy proxies
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Modele ",e.jsx("code",{children:"Autor"})," e ",e.jsx("code",{children:"Livro"})," com ",e.jsx("code",{children:"@ManyToOne"})," de Livro para Autor (LAZY). Crie um repositório, salve 1 autor com 3 livros e busque tudo."]}),e.jsxs("li",{children:["Cause um N+1 propositalmente: faça ",e.jsx("code",{children:"findAll()"})," dos livros e itere imprimindo",e.jsx("code",{children:"livro.getAutor().getNome()"}),". Conte queries no log. Resolva com",e.jsx("code",{children:"JOIN FETCH"}),"."]}),e.jsxs("li",{children:["Adicione ",e.jsx("code",{children:"@OneToMany"})," em Autor com ",e.jsx("code",{children:"cascade = ALL"})," e",e.jsx("code",{children:"orphanRemoval = true"}),". Remova um livro da lista do autor e confirme o DELETE."]})]})]})}export{r as default};
