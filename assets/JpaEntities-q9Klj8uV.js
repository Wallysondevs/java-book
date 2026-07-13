import{j as e}from"./index-BpXci30S.js";import{P as r,A as i}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(r,{title:"Entidades JPA",subtitle:"@Entity, @Id, @Column — mapear sua classe Java em tabela do banco.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Toda regra de negócio gira em torno de dados persistidos. Se você não dominar como uma classe vira uma tabela (e vice-versa), vai ficar refém de configurações mágicas e debug no escuro. Aqui você aprende as anotações essenciais para ter ",e.jsx("strong",{children:"controle total"}),"do mapeamento."]}),e.jsx("h2",{children:"@Entity: a classe entra no jogo"}),e.jsxs("p",{children:["Marca uma classe como persistível. O JPA usa o nome da classe como nome da tabela por padrão (",e.jsx("code",{children:"Usuario"})," → tabela ",e.jsx("code",{children:"Usuario"}),"). Quase sempre você quer customizar com ",e.jsx("code",{children:"@Table"}),":"]}),e.jsx(a,{title:"Entidade básica",code:`import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    public Usuario() {} // construtor padrão obrigatório

    // getters e setters
}`}),e.jsx(i,{type:"warning",title:"Regras inegociáveis da entidade",children:e.jsxs("ul",{children:[e.jsxs("li",{children:["Precisa ter construtor sem argumentos (pode ser ",e.jsx("code",{children:"protected"}),")."]}),e.jsxs("li",{children:["Não pode ser ",e.jsx("code",{children:"final"})," (Hibernate cria proxies em runtime)."]}),e.jsxs("li",{children:["Métodos e campos também não podem ser ",e.jsx("code",{children:"final"}),"."]}),e.jsxs("li",{children:["Precisa ter um ",e.jsx("code",{children:"@Id"}),"."]})]})}),e.jsx("h2",{children:"@Id e @GeneratedValue"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"@Id"})," marca a chave primária. ",e.jsx("code",{children:"@GeneratedValue"})," diz quem gera o valor:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"IDENTITY:"})," banco gera (auto-increment Postgres/MySQL). Mais comum."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SEQUENCE:"})," usa SEQUENCE (Postgres, Oracle). Permite batch insert melhor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"UUID:"})," a partir do JPA 3.1, gera UUID automaticamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"AUTO:"})," Hibernate decide. Evite — seja explícito."]})]}),e.jsx(a,{title:"Estratégias de ID",code:`@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// SEQUENCE com nome customizado
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "users_id_seq", allocationSize = 50)
private Long id;

// UUID (JPA 3.1+, Hibernate 6+)
@Id @GeneratedValue
private UUID id;`}),e.jsx("h2",{children:"@Column: ajustar a coluna"}),e.jsxs("p",{children:["Sem ",e.jsx("code",{children:"@Column"}),", o JPA usa o nome do campo (camelCase costuma virar snake_case ou ficar igual, depende do ",e.jsx("em",{children:"naming strategy"}),"). Para controle fino:"]}),e.jsx(a,{title:"@Column na prática",code:`@Column(name = "nome_completo", nullable = false, length = 120)
private String nome;

@Column(unique = true, nullable = false, length = 150)
private String email;

@Column(name = "preco_unitario", precision = 10, scale = 2)
private BigDecimal preco;

@Column(updatable = false) // nunca dispara UPDATE
private LocalDateTime criadoEm;`}),e.jsx("h2",{children:"Enums: SEMPRE EnumType.STRING"}),e.jsxs("p",{children:["Por padrão, JPA salva enum como ",e.jsx("code",{children:"int"})," (ordinal). Isso é uma armadilha: reordenar o enum quebra dados antigos. Salve como string:"]}),e.jsx(a,{title:"Enum mapeado direito",code:`public enum Status { ATIVO, INATIVO, BLOQUEADO }

@Enumerated(EnumType.STRING)
@Column(length = 20)
private Status status;`}),e.jsx("h2",{children:"Datas: use os tipos modernos"}),e.jsxs("p",{children:[e.jsx("code",{children:"@Temporal"})," é coisa antiga, para ",e.jsx("code",{children:"java.util.Date"})," e",e.jsx("code",{children:"Calendar"}),". Desde JPA 2.2, basta usar tipos do ",e.jsx("code",{children:"java.time"})," (LocalDate, LocalDateTime, Instant) ",e.jsx("strong",{children:"sem nenhuma anotação"}),":"]}),e.jsx(a,{title:"Datas modernas",code:`private LocalDate nascimento;        // DATE
private LocalDateTime criadoEm;       // TIMESTAMP
private OffsetDateTime atualizadoEm;  // TIMESTAMP WITH TIME ZONE
private Instant ultimoLogin;          // TIMESTAMP UTC

// Legado, evitar:
@Temporal(TemporalType.DATE)
private java.util.Date dataAntiga;`}),e.jsx("h2",{children:"@Transient: campos que NÃO vão pro banco"}),e.jsx("p",{children:"Calculados em memória, derivados, caches:"}),e.jsx(a,{title:"@Transient",code:`@Column(name = "preco")
private BigDecimal preco;

@Column(name = "quantidade")
private int quantidade;

@Transient
public BigDecimal getTotal() {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}`}),e.jsx("h2",{children:"@Embeddable e @Embedded: Value Objects"}),e.jsx("p",{children:"Quer agrupar campos relacionados sem criar uma tabela separada? Use embedded. Os campos ficam na mesma tabela da entidade dona."}),e.jsx(a,{title:"Endereço como Value Object",code:`@Embeddable
public class Endereco {
    private String rua;
    private String cidade;
    private String cep;
    public Endereco() {}
    // getters, setters, equals, hashCode
}

@Entity
public class Cliente {
    @Id @GeneratedValue private Long id;
    private String nome;

    @Embedded
    private Endereco endereco;

    // se quiser dois endereços, precisa renomear colunas:
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "rua",    column = @Column(name = "cobranca_rua")),
        @AttributeOverride(name = "cidade", column = @Column(name = "cobranca_cidade")),
        @AttributeOverride(name = "cep",    column = @Column(name = "cobranca_cep"))
    })
    private Endereco enderecoCobranca;
}`}),e.jsxs(i,{type:"tip",title:"Quando usar Embeddable?",children:["Quando o conceito faz sentido só dentro do dono. Endereço sem cliente = nada. Se faria sentido sozinho (com identidade própria), vira ",e.jsx("code",{children:"@Entity"}),"."]}),e.jsx("h2",{children:"Auditoria automática (bônus Spring)"}),e.jsxs("p",{children:["Spring Data JPA dá de graça com ",e.jsx("code",{children:"@EnableJpaAuditing"}),":"]}),e.jsx(a,{title:"Campos de auditoria",code:`@EntityListeners(AuditingEntityListener.class)
@Entity
public class Pedido {
    @Id @GeneratedValue private Long id;

    @CreatedDate
    @Column(updatable = false)
    private Instant criadoEm;

    @LastModifiedDate
    private Instant atualizadoEm;
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Modele uma entidade ",e.jsx("code",{children:"Produto"})," com: id (IDENTITY), nome (NOT NULL, 100 chars), preço (BigDecimal precision 10 scale 2), categoria (enum STRING), criadoEm (LocalDateTime não atualizável)."]}),e.jsxs("li",{children:["Crie ",e.jsx("code",{children:"@Embeddable Dimensoes"})," (altura, largura, profundidade em cm) e adicione como ",e.jsx("code",{children:"@Embedded"})," em ",e.jsx("code",{children:"Produto"}),"."]}),e.jsxs("li",{children:["Adicione um campo ",e.jsx("code",{children:"@Transient"})," ",e.jsx("code",{children:"volumeCm3"})," calculado em",e.jsx("code",{children:"getVolumeCm3()"}),". Verifique nos logs SQL que ele NÃO aparece nos INSERTs."]})]})]})}export{t as default};
