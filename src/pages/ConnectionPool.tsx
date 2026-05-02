import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConnectionPool() {
  return (
    <PageContainer title="Connection Pool: HikariCP" subtitle="Reusar conexões = performance massiva — Spring Boot já usa por padrão." difficulty="intermediario" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Abrir conexão com banco é <strong>caro</strong>: TCP handshake, autenticação, configuração de sessão, possivelmente TLS. Pode levar 50-200ms por conexão. Numa API que recebe 1000 req/s, abrir e fechar conexão a cada request te mata. Connection pool resolve: você abre N conexões na partida, e as requests pegam emprestado.
        </p><AlertBox type="tip" title="Analogia">
          Pool é uma frota de Ubers já estacionados na esquina. Quando você precisa, pega o que está livre. Termina, devolve. Bem mais rápido que chamar um Uber novo do zero toda vez.
        </AlertBox><h2>HikariCP: o padrão de fato</h2><p>
          Desde Spring Boot 2.0, HikariCP é o pool padrão. É <strong>rápido</strong>, leve e bem mantido. Se você só adicionou <code>spring-boot-starter-data-jpa</code> ou<code>spring-boot-starter-jdbc</code>, ele já está rodando — você nem percebeu.
        </p><h2>Configuração no Spring Boot</h2><CodeBlock title="application.properties" code={`spring.datasource.url=jdbc:postgresql://db:5432/loja
spring.datasource.username=app
spring.datasource.password=secret

# HikariCP
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.pool-name=LojaPool`} /><h2>Configurações que você precisa entender</h2><ul>
          <li>
            <strong>maximumPoolSize</strong> (padrão 10): teto de conexões abertas. A regra de ouro é <code>cores * 2 + spindles</code>{", mas mediu > chutou. Mais alto que isso costuma piorar (contenção no banco)."}
          </li><li>
            <strong>minimumIdle</strong> (padrão = max): mínimo de conexões ociosas mantidas. Usar o mesmo valor de <code>maximumPoolSize</code> evita "warm-up" em rajadas.
          </li><li>
            <strong>connectionTimeout</strong> (padrão 30s): quanto a request espera por uma conexão. Se estourou, exceção. Em apps web, considere baixar pra 5-10s.
          </li><li>
            <strong>idleTimeout</strong> (padrão 10min): quanto tempo conexão ociosa é mantida antes de fechar.
          </li><li>
            <strong>maxLifetime</strong> (padrão 30min): tempo máximo de vida de uma conexão. Importante: deixe MENOR que o timeout do banco/firewall, ou vai cair em uso.
          </li><li>
            <strong>leakDetectionThreshold</strong> (padrão 0 = off): se uma conexão fica "emprestada" mais que X ms, loga stack trace. Essencial em dev.
          </li>
        </ul><AlertBox type="warning" title="A pegadinha clássica do maxLifetime">
          Se o Postgres está atrás de um proxy/firewall que mata conexões ociosas a cada 30 minutos, configure <code>maxLifetime</code> pra 25 minutos. Senão, requests pegam conexões mortas e explodem com "broken pipe".
        </AlertBox><h2>Detectando vazamentos</h2><p>
          Esqueceu de fechar conexão? <code>leakDetectionThreshold</code> avisa:
        </p><CodeBlock title="Detecção de leak" code={`spring.datasource.hikari.leak-detection-threshold=10000
# Se uma conexão ficar emprestada > 10s, Hikari loga warning com stack trace.`} /><p>
          Em apps Spring com <code>@Transactional</code>, vazamento é raro. Em código JDBC manual, sempre use <strong>try-with-resources</strong>:
        </p><CodeBlock title="JDBC sem leak" code={`try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement("SELECT 1");
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        // ...
    }
} // tudo fecha automaticamente`} /><h2>Monitorando com Spring Actuator</h2><p>
          Adicione <code>spring-boot-starter-actuator</code> e exponha métricas:
        </p><CodeBlock title="Métricas Hikari" code={`management.endpoints.web.exposure.include=health,metrics
management.metrics.enable.hikaricp=true

# GET /actuator/metrics/hikaricp.connections.active
# GET /actuator/metrics/hikaricp.connections.idle
# GET /actuator/metrics/hikaricp.connections.pending
# GET /actuator/metrics/hikaricp.connections.usage`} /><p>
          Em produção, jogue isso no Prometheus + Grafana e monitore <em>connections.pending</em>: se passa de 0 com frequência, seu pool está pequeno.
        </p><h2>Hikari standalone (sem Spring)</h2><CodeBlock title="HikariDataSource puro" code={`HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:postgresql://localhost:5432/loja");
cfg.setUsername("app");
cfg.setPassword("secret");
cfg.setMaximumPoolSize(10);
cfg.setConnectionTimeout(5_000);
cfg.setLeakDetectionThreshold(10_000);

try (HikariDataSource ds = new HikariDataSource(cfg);
     Connection conn = ds.getConnection()) {
    // use conn
}`} /><h2>Alternativas (e por que ignorar)</h2><ul>
          <li>
            <strong>Apache DBCP2:</strong> antigo, mais lento, mais configurações. Sem motivo pra escolher hoje.
          </li><li>
            <strong>c3p0:</strong> ainda mais antigo. Pode evitar.
          </li><li>
            <strong>Tomcat JDBC Pool:</strong> sólido, mas Hikari ganha em performance e simplicidade.
          </li>
        </ul><h2>Erros comuns que você vai ver no log</h2><ul>
          <li>
            <code>HikariPool-1 - Connection is not available, request timed out</code>: pool esgotado. Ou aumenta <code>maximumPoolSize</code>, ou descobre porque conexões não voltam (queries lentas? leak?).
          </li><li>
            <code>This connection has been closed</code>: conexão morreu (firewall, restart do banco). Ajusta <code>maxLifetime</code> e habilita <code>connection-test-query</code> se o driver não suporta JDBC4 isValid.
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Num projeto Spring Boot, baixe <code>maximumPoolSize</code> para 2 e crie um endpoint que segura a conexão por 5 segundos (use <code>Thread.sleep</code> dentro de<code>@Transactional</code>). Dispare 5 requests simultâneas e veja o<code>connection-timeout</code> em ação.
          </li><li>
            Habilite <code>leakDetectionThreshold=2000</code> e propositalmente esqueça de fechar uma conexão obtida via <code>dataSource.getConnection()</code> manual. Observe o warning no log.
          </li><li>
            Adicione Actuator e consulte <code>/actuator/metrics/hikaricp.connections.active</code>enquanto roda um <em>load test</em> simples (use <code>ab</code> ou <code>wrk</code>). Ajuste o pool até estabilizar.
          </li>
        </ol>
      </PageContainer>
  );
}
