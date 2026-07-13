import{j as e}from"./index-BpXci30S.js";import{P as n,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function s(){return e.jsxs(n,{title:"JDBC: conectar a banco SQL",subtitle:"API padrão Java para qualquer banco relacional — Postgres, MySQL, SQLite.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsx("p",{children:"Aplicação real grava dados em algum lugar. Frameworks como Hibernate, JPA, jOOQ, Spring Data — todos eles usam JDBC por baixo. Entender JDBC cru é entender o motor; depois você pode escolher abstrações com consciência. E pra scripts pequenos, JDBC puro continua sendo a ferramenta mais direta."}),e.jsx("h2",{children:"Adicionando o driver"}),e.jsxs("p",{children:["JDBC é só uma ",e.jsx("strong",{children:"API"}),". Pra falar com um banco específico você precisa do ",e.jsx("em",{children:"driver"})," daquele banco como dependência. Cada banco tem o seu:"]}),e.jsx(o,{title:"pom.xml — alguns drivers comuns",code:`<!-- PostgreSQL -->
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
</dependency>`}),e.jsxs(r,{type:"tip",title:"Comece com SQLite",children:["Pra praticar JDBC sem instalar nada, use SQLite. A URL ",e.jsx("code",{children:"jdbc:sqlite:teste.db"})," cria um banco num arquivo e pronto."]}),e.jsx("h2",{children:"Abrindo conexão"}),e.jsxs("p",{children:[e.jsx("code",{children:"DriverManager.getConnection"})," recebe a URL JDBC e (quando precisa) usuário e senha. A URL identifica o driver e o destino."]}),e.jsx(o,{title:"Conectando",code:`import java.sql.Connection;
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
// DriverManager.getConnection(url, "usuario", "senha");`}),e.jsx("h2",{children:"Statement vs PreparedStatement"}),e.jsxs("p",{children:[e.jsx("code",{children:"Statement"})," executa SQL puro. ",e.jsx("code",{children:"PreparedStatement"})," usa SQL com ",e.jsx("code",{children:"?"})," como placeholder e você seta os valores depois. ",e.jsx("strong",{children:"Sempre prefira PreparedStatement."})," Dois motivos:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"SQL injection:"})," concatenar string em SQL é receita pra desastre. ",e.jsx("code",{children:"PreparedStatement"})," escapa pra você."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Performance:"})," o banco prepara o plano uma vez e reaproveita pra cada execução com valores diferentes."]})]}),e.jsxs(r,{type:"danger",title:"Nunca, NUNCA faça isso",children:[e.jsx("code",{children:`"SELECT * FROM users WHERE nome='" + nome + "'"`})," — se ",e.jsx("code",{children:"nome"})," vem de input do usuário, você acabou de criar um buraco de segurança. Use ",e.jsx("code",{children:"?"}),"."]}),e.jsx("h2",{children:"SELECT: executeQuery e ResultSet"}),e.jsxs("p",{children:[e.jsx("code",{children:"executeQuery"})," retorna um ",e.jsx("code",{children:"ResultSet"})," — um cursor que você avança com ",e.jsx("code",{children:"next()"})," linha por linha."]}),e.jsx(o,{title:"Lendo dados",code:`import java.sql.*;

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
}`}),e.jsx("h2",{children:"INSERT/UPDATE/DELETE: executeUpdate"}),e.jsxs("p",{children:["Retorna ",e.jsx("code",{children:"int"})," com a quantidade de linhas afetadas."]}),e.jsx(o,{title:"Inserindo dados",code:`String sql = "INSERT INTO usuarios (nome, email, ativo) VALUES (?, ?, ?)";

try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, "Ana Silva");
    ps.setString(2, "ana@exemplo.com");
    ps.setBoolean(3, true);

    int linhas = ps.executeUpdate();
    System.out.println(linhas + " linha(s) inserida(s)");
}`}),e.jsx("h2",{children:"Try-with-resources: fechar tudo"}),e.jsxs("p",{children:["Conexão, statement e ResultSet seguram recursos do sistema operacional e do banco. ",e.jsx("strong",{children:"Sempre"})," use ",e.jsx("code",{children:"try-with-resources"})," — o Java fecha tudo na ordem correta automaticamente, mesmo se der exceção."]}),e.jsx("h2",{children:"Transações"}),e.jsx("p",{children:'Por padrão, JDBC roda em "autocommit": cada comando é uma transação. Pra agrupar várias operações em uma única transação atômica:'}),e.jsx(o,{title:"Transferência bancária",code:`try (Connection conn = DriverManager.getConnection(url)) {
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
}`}),e.jsxs(r,{type:"warning",title:"Dinheiro = BigDecimal",children:["Nunca use ",e.jsx("code",{children:"double"})," pra valores monetários — arredondamento binário é sua ruína. Use ",e.jsx("code",{children:"BigDecimal"})," e a coluna do banco como ",e.jsx("code",{children:"NUMERIC"}),"/",e.jsx("code",{children:"DECIMAL"}),"."]}),e.jsx("h2",{children:"Connection pool: HikariCP"}),e.jsxs("p",{children:["Abrir conexão com banco custa caro (handshake TCP, autenticação, SSL...). Em aplicações que recebem muitas requisições, você não abre uma conexão nova a cada operação — usa um ",e.jsx("em",{children:"pool"})," que mantém várias conexões prontas e empresta/devolve. ",e.jsx("strong",{children:"HikariCP"})," é o pool padrão do mundo Java (vem dentro do Spring Boot)."]}),e.jsx(o,{title:"HikariCP — só pra conhecer",code:`HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/meubanco");
config.setUsername("user");
config.setPassword("senha");
config.setMaximumPoolSize(10);

try (HikariDataSource ds = new HikariDataSource(config);
     Connection conn = ds.getConnection()) {
    // usar conn normalmente
}`}),e.jsx("h2",{children:"O fluxo mental do JDBC"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Garanta que o driver está no classpath (dependência Maven/Gradle)."}),e.jsxs("li",{children:["Abra a ",e.jsx("code",{children:"Connection"})," com ",e.jsx("code",{children:"DriverManager.getConnection"}),"."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"PreparedStatement"})," com seu SQL e ",e.jsx("code",{children:"?"}),"."]}),e.jsxs("li",{children:["Sete os parâmetros (",e.jsx("code",{children:"setString"}),", ",e.jsx("code",{children:"setInt"}),", ...)."]}),e.jsxs("li",{children:["Execute (",e.jsx("code",{children:"executeQuery"})," ou ",e.jsx("code",{children:"executeUpdate"}),")."]}),e.jsxs("li",{children:["Itere o ",e.jsx("code",{children:"ResultSet"})," se for SELECT."]}),e.jsx("li",{children:"Feche tudo (try-with-resources faz por você)."})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um banco SQLite (",e.jsx("code",{children:"jdbc:sqlite:livros.db"}),"), uma tabela ",e.jsx("code",{children:"livros(id, titulo, autor, ano)"})," e um programa que insere 5 livros e depois lista todos."]}),e.jsxs("li",{children:["Adicione um método ",e.jsx("code",{children:"buscarPorAutor(String autor)"})," que usa ",e.jsx("code",{children:"PreparedStatement"}),". Teste passando um nome com aspas simples (ex.: ",e.jsx("code",{children:"O'Brien"}),") pra ver que não quebra."]}),e.jsxs("li",{children:['Implemente uma transação que move um livro de uma "estante" pra outra (duas tabelas, dois UPDATEs). Force uma exceção no meio e verifique que o ',e.jsx("code",{children:"rollback"})," mantém o estado consistente."]})]})]})}export{s as default};
