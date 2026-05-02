import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JDBC() {
  return (
    <PageContainer title="JDBC: conectar a banco SQL" subtitle="API padrão Java para qualquer banco relacional — Postgres, MySQL, SQLite." difficulty="intermediario" timeToRead="25 min">
        <h2>Por que você precisa disso</h2><p>
          Aplicação real grava dados em algum lugar. Frameworks como Hibernate, JPA, jOOQ, Spring Data — todos eles usam JDBC por baixo. Entender JDBC cru é entender o motor; depois você pode escolher abstrações com consciência. E pra scripts pequenos, JDBC puro continua sendo a ferramenta mais direta.
        </p><h2>Adicionando o driver</h2><p>
          JDBC é só uma <strong>API</strong>. Pra falar com um banco específico você precisa do <em>driver</em> daquele banco como dependência. Cada banco tem o seu:
        </p><CodeBlock title="pom.xml — alguns drivers comuns" code={`<!-- PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.3</version>
</dependency>

<!-- MySQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.4.0</version>
</dependency>

<!-- SQLite (ótimo pra aprender, é só um arquivo .db) -->
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.46.0.0</version>
</dependency>`} /><AlertBox type="tip" title="Comece com SQLite">
          Pra praticar JDBC sem instalar nada, use SQLite. A URL <code>jdbc:sqlite:teste.db</code> cria um banco num arquivo e pronto.
        </AlertBox><h2>Abrindo conexão</h2><p>
          <code>DriverManager.getConnection</code> recebe a URL JDBC e (quando precisa) usuário e senha. A URL identifica o driver e o destino.
        </p><CodeBlock title="Conectando" code={`import java.sql.Connection;
import java.sql.DriverManager;

public class Conexao {
    public static void main(String[] args) throws Exception {
        // SQLite — banco num arquivo local
        String url = "jdbc:sqlite:teste.db";

        try (Connection conn = DriverManager.getConnection(url)) {
            System.out.println("Conectou: " + conn.getMetaData().getDatabaseProductName());
        }
    }
}

// Postgres seria algo como:
// jdbc:postgresql://localhost:5432/meubanco
// DriverManager.getConnection(url, "usuario", "senha");`} /><h2>Statement vs PreparedStatement</h2><p>
          <code>Statement</code> executa SQL puro. <code>PreparedStatement</code> usa SQL com <code>?</code> como placeholder e você seta os valores depois. <strong>Sempre prefira PreparedStatement.</strong> Dois motivos:
        </p><ul>
          <li>
            <strong>SQL injection:</strong> concatenar string em SQL é receita pra desastre. <code>PreparedStatement</code> escapa pra você.
          </li><li>
            <strong>Performance:</strong> o banco prepara o plano uma vez e reaproveita pra cada execução com valores diferentes.
          </li>
        </ul><AlertBox type="danger" title="Nunca, NUNCA faça isso">
          <code>{`"SELECT * FROM users WHERE nome='" + nome + "'"`}</code> — se <code>nome</code> vem de input do usuário, você acabou de criar um buraco de segurança. Use <code>?</code>.
        </AlertBox><h2>SELECT: executeQuery e ResultSet</h2><p>
          <code>executeQuery</code> retorna um <code>ResultSet</code> — um cursor que você avança com <code>next()</code> linha por linha.
        </p><CodeBlock title="Lendo dados" code={`import java.sql.*;

public class Listar {
    public static void main(String[] args) throws SQLException {
        String url = "jdbc:sqlite:teste.db";
        String sql = "SELECT id, nome, email FROM usuarios WHERE ativo = ?";

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setBoolean(1, true);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    String email = rs.getString("email");
                    System.out.printf("%d | %s <%s>%n", id, nome, email);
                }
            }
        }
    }
}`} /><h2>INSERT/UPDATE/DELETE: executeUpdate</h2><p>
          Retorna <code>int</code> com a quantidade de linhas afetadas.
        </p><CodeBlock title="Inserindo dados" code={`String sql = "INSERT INTO usuarios (nome, email, ativo) VALUES (?, ?, ?)";

try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, "Ana Silva");
    ps.setString(2, "ana@exemplo.com");
    ps.setBoolean(3, true);

    int linhas = ps.executeUpdate();
    System.out.println(linhas + " linha(s) inserida(s)");
}`} /><h2>Try-with-resources: fechar tudo</h2><p>
          Conexão, statement e ResultSet seguram recursos do sistema operacional e do banco. <strong>Sempre</strong> use <code>try-with-resources</code> — o Java fecha tudo na ordem correta automaticamente, mesmo se der exceção.
        </p><h2>Transações</h2><p>
          Por padrão, JDBC roda em "autocommit": cada comando é uma transação. Pra agrupar várias operações em uma única transação atômica:
        </p><CodeBlock title="Transferência bancária" code={`try (Connection conn = DriverManager.getConnection(url)) {
    conn.setAutoCommit(false);

    try (PreparedStatement debito = conn.prepareStatement(
             "UPDATE contas SET saldo = saldo - ? WHERE id = ?");
         PreparedStatement credito = conn.prepareStatement(
             "UPDATE contas SET saldo = saldo + ? WHERE id = ?")) {

        debito.setBigDecimal(1, new java.math.BigDecimal("100.00"));
        debito.setInt(2, 1);
        debito.executeUpdate();

        credito.setBigDecimal(1, new java.math.BigDecimal("100.00"));
        credito.setInt(2, 2);
        credito.executeUpdate();

        conn.commit();
    } catch (Exception e) {
        conn.rollback();
        throw e;
    }
}`} /><AlertBox type="warning" title="Dinheiro = BigDecimal">
          Nunca use <code>double</code> pra valores monetários — arredondamento binário é sua ruína. Use <code>BigDecimal</code> e a coluna do banco como <code>NUMERIC</code>/<code>DECIMAL</code>.
        </AlertBox><h2>Connection pool: HikariCP</h2><p>
          Abrir conexão com banco custa caro (handshake TCP, autenticação, SSL...). Em aplicações que recebem muitas requisições, você não abre uma conexão nova a cada operação — usa um <em>pool</em> que mantém várias conexões prontas e empresta/devolve. <strong>HikariCP</strong> é o pool padrão do mundo Java (vem dentro do Spring Boot).
        </p><CodeBlock title="HikariCP — só pra conhecer" code={`HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/meubanco");
config.setUsername("user");
config.setPassword("senha");
config.setMaximumPoolSize(10);

try (HikariDataSource ds = new HikariDataSource(config);
     Connection conn = ds.getConnection()) {
    // usar conn normalmente
}`} /><h2>O fluxo mental do JDBC</h2><ol>
          <li>Garanta que o driver está no classpath (dependência Maven/Gradle).</li><li>
            Abra a <code>Connection</code> com <code>DriverManager.getConnection</code>.
          </li><li>
            Crie um <code>PreparedStatement</code> com seu SQL e <code>?</code>.
          </li><li>
            Sete os parâmetros (<code>setString</code>, <code>setInt</code>, ...).
          </li><li>
            Execute (<code>executeQuery</code> ou <code>executeUpdate</code>).
          </li><li>
            Itere o <code>ResultSet</code> se for SELECT.
          </li><li>Feche tudo (try-with-resources faz por você).</li>
        </ol><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um banco SQLite (<code>jdbc:sqlite:livros.db</code>), uma tabela <code>livros(id, titulo, autor, ano)</code> e um programa que insere 5 livros e depois lista todos.
          </li><li>
            Adicione um método <code>buscarPorAutor(String autor)</code> que usa <code>PreparedStatement</code>. Teste passando um nome com aspas simples (ex.: <code>O'Brien</code>) pra ver que não quebra.
          </li><li>
            Implemente uma transação que move um livro de uma "estante" pra outra (duas tabelas, dois UPDATEs). Force uma exceção no meio e verifique que o <code>rollback</code> mantém o estado consistente.
          </li>
        </ol>
      </PageContainer>
  );
}
