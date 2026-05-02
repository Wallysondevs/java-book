import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TryWithResources() {
  return (
    <PageContainer title="try-with-resources" subtitle="Java 7+ fecha recursos automaticamente — adeus finally manual." difficulty="intermediario" timeToRead="12 min">
        <h2>Por que você precisa disso</h2><p>
          Antes do Java 7, fechar arquivos, conexões e sockets era um inferno: você tinha que abrir no <code>try</code>, fechar no <code>finally</code> e ainda tratar exceptions do próprio<code>close()</code>. Resultado: bug e vazamento de recurso eram a regra. O <strong>try-with-resources</strong> resolveu isso — declara o recurso entre parênteses no try e Java fecha sozinho no fim.
        </p><h2>Antes vs depois</h2><CodeBlock title="Jeito antigo (chato e bugável)" code={`BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("dados.txt"));
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close();
        } catch (IOException e) {
            // e agora? exception dentro de exception...
        }
    }
}`} /><CodeBlock title="Jeito moderno (Java 7+)" code={`try (var br = new BufferedReader(new FileReader("dados.txt"))) {
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
}`} /><p>
          Mais curto, mais correto e impossível esquecer de fechar. O <code>br</code> é fechado automaticamente quando o bloco termina, com sucesso ou exception.
        </p><h2>A regra: precisa implementar AutoCloseable</h2><p>
          Qualquer classe que implemente <code>java.lang.AutoCloseable</code> (ou <code>java.io.Closeable</code>, que é mais antiga) pode entrar no try-with-resources. As principais classes da JDK que mexem com I/O já implementam: streams, readers, writers, sockets, <code>Connection</code>, <code>Statement</code>, <code>ResultSet</code>...
        </p><h2>Múltiplos recursos no mesmo try</h2><p>
          Separe com <code>;</code>. Eles são fechados na <strong>ordem inversa</strong> da declaração — o último aberto é o primeiro a fechar (faz sentido: dependências saem primeiro).
        </p><CodeBlock title="Vários recursos" code={`try (
    var entrada = new BufferedReader(new FileReader("entrada.txt"));
    var saida   = new BufferedWriter(new FileWriter("saida.txt"))
) {
    String linha;
    while ((linha = entrada.readLine()) != null) {
        saida.write(linha.toUpperCase());
        saida.newLine();
    }
} catch (IOException e) {
    System.err.println("Erro: " + e.getMessage());
}
// fecha saida primeiro, depois entrada — ordem inversa`} /><h2>Combina com catch e finally</h2><p>
          Você pode adicionar <code>catch</code> e <code>finally</code> normalmente. O fechamento acontece <em>antes</em> dos catches, então no catch o recurso já está fechado.
        </p><CodeBlock title="try-with-resources + catch + finally" code={`try (var conn = DriverManager.getConnection(url)) {
    // usa a conexão
} catch (SQLException e) {
    log.error("Banco fora?", e);
} finally {
    System.out.println("encerrando bloco");
}`} /><h2>Suprimidas exceptions: e.getSuppressed()</h2><p>
          E se o seu código lançar uma exception <em>e</em> o <code>close()</code> também lançar? Antes a segunda escondia a primeira (péssimo pra debug). Agora a do código vence e a do close fica anexada como <strong>suprimida</strong> — você acessa via <code>e.getSuppressed()</code>.
        </p><CodeBlock title="Inspecionando suprimidas" code={`try (var r = new RecursoQueFalhaNoClose()) {
    r.processar(); // joga RuntimeException
} catch (Exception e) {
    System.err.println("Principal: " + e.getMessage());
    for (Throwable supp : e.getSuppressed()) {
        System.err.println("Suprimida: " + supp.getMessage());
    }
}`} /><AlertBox type="info" title="Imutabilidade desde Java 9">
          Antes do Java 9 você precisava declarar a variável dentro do try. Hoje pode usar uma variável <code>final</code> (ou efetivamente final) declarada antes: <code>try (br) {"{ ... }"}</code>. Útil quando o recurso é construído em outro lugar.
        </AlertBox><h2>Criando o seu próprio AutoCloseable</h2><p>
          Qualquer classe sua que precise liberar algo (cache, conexão custom, lock) pode implementar <code>AutoCloseable</code>. Aí ela entra no try-with-resources como qualquer outra.
        </p><CodeBlock title="Recurso customizado" code={`public class Cronometro implements AutoCloseable {
    private final long inicio = System.nanoTime();
    private final String nome;

    public Cronometro(String nome) {
        this.nome = nome;
        System.out.println(">>> iniciando " + nome);
    }

    @Override
    public void close() {
        long ms = (System.nanoTime() - inicio) / 1_000_000;
        System.out.println("<<< " + nome + " levou " + ms + " ms");
    }
}

class Demo {
    public static void main(String[] args) throws InterruptedException {
        try (var c = new Cronometro("processamento")) {
            Thread.sleep(150);
        }
        // ao sair do bloco, close() é chamado automaticamente
    }
}`} /><AlertBox type="tip" title="close() não deveria lançar">
          Idealmente seu <code>close()</code> não lança exception. Se precisar, prefira <code>RuntimeException</code> ou estenda <code>AutoCloseable</code> (que permite <code>throws Exception</code>) — mas saiba que isso obriga quem usar a tratar.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Reescreva um trecho que lê um arquivo linha a linha usando try-with-resources com <code>BufferedReader</code>. Imprima cada linha numerada.
          </li><li>
            Crie a classe <code>Sessao implements AutoCloseable</code> que imprime "abriu sessão" no construtor e "fechou sessão" no <code>close()</code>. Use ela num try-with-resources e observe a ordem de execução.
          </li><li>
            Crie dois recursos no mesmo try (pode ser duas instâncias do <code>Cronometro</code> com nomes diferentes) e confirme no terminal que o fechamento acontece na ordem inversa da declaração.
          </li>
        </ol>
      </PageContainer>
  );
}
