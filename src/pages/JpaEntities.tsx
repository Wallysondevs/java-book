import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JpaEntities() {
  return (
    <PageContainer title="Entidades JPA" subtitle="@Entity, @Id, @Column — mapear sua classe Java em tabela do banco." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Toda regra de negócio gira em torno de dados persistidos. Se você não dominar como uma classe vira uma tabela (e vice-versa), vai ficar refém de configurações mágicas e debug no escuro. Aqui você aprende as anotações essenciais para ter <strong>controle total</strong>do mapeamento.
        </p><h2>@Entity: a classe entra no jogo</h2><p>
          Marca uma classe como persistível. O JPA usa o nome da classe como nome da tabela por padrão (<code>Usuario</code> → tabela <code>Usuario</code>). Quase sempre você quer customizar com <code>@Table</code>:
        </p><CodeBlock title="Entidade básica" code={`import jakarta.persistence.*;

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
}`} /><AlertBox type="warning" title="Regras inegociáveis da entidade">
          <ul>
            <li>
              Precisa ter construtor sem argumentos (pode ser <code>protected</code>).
            </li><li>
              Não pode ser <code>final</code> (Hibernate cria proxies em runtime).
            </li><li>
              Métodos e campos também não podem ser <code>final</code>.
            </li><li>
              Precisa ter um <code>@Id</code>.
            </li>
          </ul>
        </AlertBox><h2>@Id e @GeneratedValue</h2><p>
          O <code>@Id</code> marca a chave primária. <code>@GeneratedValue</code> diz quem gera o valor:
        </p><ul>
          <li>
            <strong>IDENTITY:</strong> banco gera (auto-increment Postgres/MySQL). Mais comum.
          </li><li>
            <strong>SEQUENCE:</strong> usa SEQUENCE (Postgres, Oracle). Permite batch insert melhor.
          </li><li>
            <strong>UUID:</strong> a partir do JPA 3.1, gera UUID automaticamente.
          </li><li>
            <strong>AUTO:</strong> Hibernate decide. Evite — seja explícito.
          </li>
        </ul><CodeBlock title="Estratégias de ID" code={`@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// SEQUENCE com nome customizado
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "users_id_seq", allocationSize = 50)
private Long id;

// UUID (JPA 3.1+, Hibernate 6+)
@Id @GeneratedValue
private UUID id;`} /><h2>@Column: ajustar a coluna</h2><p>
          Sem <code>@Column</code>, o JPA usa o nome do campo (camelCase costuma virar snake_case ou ficar igual, depende do <em>naming strategy</em>). Para controle fino:
        </p><CodeBlock title="@Column na prática" code={`@Column(name = "nome_completo", nullable = false, length = 120)
private String nome;

@Column(unique = true, nullable = false, length = 150)
private String email;

@Column(name = "preco_unitario", precision = 10, scale = 2)
private BigDecimal preco;

@Column(updatable = false) // nunca dispara UPDATE
private LocalDateTime criadoEm;`} /><h2>Enums: SEMPRE EnumType.STRING</h2><p>
          Por padrão, JPA salva enum como <code>int</code> (ordinal). Isso é uma armadilha: reordenar o enum quebra dados antigos. Salve como string:
        </p><CodeBlock title="Enum mapeado direito" code={`public enum Status { ATIVO, INATIVO, BLOQUEADO }

@Enumerated(EnumType.STRING)
@Column(length = 20)
private Status status;`} /><h2>Datas: use os tipos modernos</h2><p>
          <code>@Temporal</code> é coisa antiga, para <code>java.util.Date</code> e<code>Calendar</code>. Desde JPA 2.2, basta usar tipos do <code>java.time</code> (LocalDate, LocalDateTime, Instant) <strong>sem nenhuma anotação</strong>:
        </p><CodeBlock title="Datas modernas" code={`private LocalDate nascimento;        // DATE
private LocalDateTime criadoEm;       // TIMESTAMP
private OffsetDateTime atualizadoEm;  // TIMESTAMP WITH TIME ZONE
private Instant ultimoLogin;          // TIMESTAMP UTC

// Legado, evitar:
@Temporal(TemporalType.DATE)
private java.util.Date dataAntiga;`} /><h2>@Transient: campos que NÃO vão pro banco</h2><p>Calculados em memória, derivados, caches:</p><CodeBlock title="@Transient" code={`@Column(name = "preco")
private BigDecimal preco;

@Column(name = "quantidade")
private int quantidade;

@Transient
public BigDecimal getTotal() {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}`} /><h2>@Embeddable e @Embedded: Value Objects</h2><p>
          Quer agrupar campos relacionados sem criar uma tabela separada? Use embedded. Os campos ficam na mesma tabela da entidade dona.
        </p><CodeBlock title="Endereço como Value Object" code={`@Embeddable
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
}`} /><AlertBox type="tip" title="Quando usar Embeddable?">
          Quando o conceito faz sentido só dentro do dono. Endereço sem cliente = nada. Se faria sentido sozinho (com identidade própria), vira <code>@Entity</code>.
        </AlertBox><h2>Auditoria automática (bônus Spring)</h2><p>
          Spring Data JPA dá de graça com <code>@EnableJpaAuditing</code>:
        </p><CodeBlock title="Campos de auditoria" code={`@EntityListeners(AuditingEntityListener.class)
@Entity
public class Pedido {
    @Id @GeneratedValue private Long id;

    @CreatedDate
    @Column(updatable = false)
    private Instant criadoEm;

    @LastModifiedDate
    private Instant atualizadoEm;
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Modele uma entidade <code>Produto</code> com: id (IDENTITY), nome (NOT NULL, 100 chars), preço (BigDecimal precision 10 scale 2), categoria (enum STRING), criadoEm (LocalDateTime não atualizável).
          </li><li>
            Crie <code>@Embeddable Dimensoes</code> (altura, largura, profundidade em cm) e adicione como <code>@Embedded</code> em <code>Produto</code>.
          </li><li>
            Adicione um campo <code>@Transient</code> <code>volumeCm3</code> calculado em<code>getVolumeCm3()</code>. Verifique nos logs SQL que ele NÃO aparece nos INSERTs.
          </li>
        </ol>
      </PageContainer>
  );
}
