import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HttpClient() {
  return (
    <PageContainer title="HttpClient (Java 11+)" subtitle="Cliente HTTP nativo da JDK — esqueça Apache HttpClient na maioria dos casos." difficulty="intermediario" timeToRead="20 min">
        <h2>Por que você precisa disso</h2><p>
          Quase todo programa moderno conversa com APIs: consumir endpoint REST, baixar arquivo, enviar webhook, autenticar via OAuth. Antes do Java 11, a única opção decente era a lib externa Apache HttpClient. Hoje, a JDK traz um cliente moderno, com suporte a HTTP/2, async com <code>CompletableFuture</code>, e API fluente. Você não precisa de dependência nenhuma.
        </p><h2>O cliente</h2><p>
          Crie <strong>um</strong> <code>HttpClient</code> na sua aplicação e reutilize. Ele já gerencia pool de conexões, mantém keep-alive e suporta HTTP/2 transparentemente quando o servidor aceita.
        </p><CodeBlock title="Criando o cliente" code={`import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.time.Duration;

HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .followRedirects(Redirect.NORMAL)
        .build();

// Versão preguiça-mas-ok:
HttpClient padrao = HttpClient.newHttpClient();`} /><h2>GET síncrono</h2><p>
          Monta-se um <code>HttpRequest</code> com builder fluente e chama-se <code>send</code>. O <code>BodyHandler</code> diz como interpretar a resposta (string, bytes, arquivo, stream).
        </p><CodeBlock title="GET retornando String" code={`import java.net.URI;
import java.net.http.*;
import java.net.http.HttpResponse.BodyHandlers;

HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("https://api.github.com/users/torvalds"))
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(15))
        .GET()
        .build();

HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());

System.out.println("Status: " + resp.statusCode());
System.out.println("Body:   " + resp.body());`} /><h2>BodyHandlers: o que fazer com a resposta</h2><ul>
          <li>
            <code>ofString()</code> — texto (UTF-8 por padrão).
          </li><li>
            <code>ofByteArray()</code> — bytes crus.
          </li><li>
            <code>ofFile(Path)</code> — joga direto pra disco (ótimo pra downloads grandes).
          </li><li>
            <code>ofInputStream()</code> — você consome em streaming.
          </li><li>
            <code>discarding()</code> — ignora o body (só liga pro status).
          </li>
        </ul><CodeBlock title="Baixando um arquivo" code={`import java.nio.file.Path;

HttpRequest req = HttpRequest.newBuilder(URI.create("https://exemplo.com/foto.jpg")).build();
HttpResponse<Path> resp = client.send(req, BodyHandlers.ofFile(Path.of("foto.jpg")));
System.out.println("Salvo em: " + resp.body());`} /><h2>POST com JSON</h2><p>
          Pra enviar corpo, use <code>BodyPublishers.ofString</code> (ou <code>ofByteArray</code>, <code>ofFile</code>, etc). Combine com Jackson pra serializar objetos.
        </p><CodeBlock title="POST JSON" code={`import java.net.http.HttpRequest.BodyPublishers;

String json = """
    {"nome": "Ana", "email": "ana@exemplo.com"}
    """;

HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("https://api.exemplo.com/usuarios"))
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + token)
        .POST(BodyPublishers.ofString(json))
        .build();

HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());

if (resp.statusCode() == 201) {
    System.out.println("Criado!");
} else {
    System.err.println("Falhou: " + resp.statusCode() + " - " + resp.body());
}`} /><AlertBox type="tip" title="Text blocks são lindos pra JSON">
          Desde Java 15, use <code>"""</code> pra escrever JSON multi-linha sem ficar escapando aspas duplas.
        </AlertBox><h2>Async com CompletableFuture</h2><p>
          Em vez de bloquear a thread, você pode disparar a chamada e receber um <code>CompletableFuture</code>. Ideal pra processar várias requisições em paralelo.
        </p><CodeBlock title="Várias requisições em paralelo" code={`import java.util.List;
import java.util.concurrent.CompletableFuture;

List<String> urls = List.of(
    "https://api.exemplo.com/a",
    "https://api.exemplo.com/b",
    "https://api.exemplo.com/c"
);

List<CompletableFuture<HttpResponse<String>>> futuros = urls.stream()
    .map(u -> HttpRequest.newBuilder(URI.create(u)).build())
    .map(req -> client.sendAsync(req, BodyHandlers.ofString()))
    .toList();

// Espera todos
CompletableFuture.allOf(futuros.toArray(new CompletableFuture[0])).join();

futuros.forEach(f -> System.out.println(f.join().statusCode()));`} /><h2>Tratando status code</h2><p>
          O HttpClient <strong>não</strong> joga exceção pra status 4xx ou 5xx — só pra erros de rede. Você precisa checar o <code>statusCode()</code> manualmente. Isso é bom: você decide se 404 é erro ou se é "vazio esperado".
        </p><CodeBlock title="Padrão de tratamento" code={`int code = resp.statusCode();

if (code >= 200 && code < 300) {
    return resp.body();
} else if (code == 404) {
    return null;
} else if (code >= 500) {
    throw new RuntimeException("Servidor com problema: " + code);
} else {
    throw new RuntimeException("Erro " + code + ": " + resp.body());
}`} /><h2>Combinando com Jackson</h2><p>
          O fluxo padrão pra consumir uma API REST: serializar o request com Jackson, mandar via HttpClient, desserializar a resposta.
        </p><CodeBlock title="Cliente típico de API" code={`record Usuario(int id, String login, String name) {}

ObjectMapper mapper = new ObjectMapper();
HttpRequest req = HttpRequest.newBuilder(
        URI.create("https://api.github.com/users/torvalds")).build();

HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());
Usuario u = mapper.readValue(resp.body(), Usuario.class);

System.out.println(u.name());`} /><h2>HTTP/2, redirect, timeouts</h2><ul>
          <li>
            <strong>HTTP/2:</strong> ligado por padrão. Cai pra HTTP/1.1 se o servidor não suportar. Sem configuração.
          </li><li>
            <strong>Redirects:</strong> <code>followRedirects(Redirect.NORMAL)</code> segue 301/302 (não segue HTTPS→HTTP). Use <code>ALWAYS</code> pra seguir tudo, <code>NEVER</code> pra não seguir.
          </li><li>
            <strong>Timeouts:</strong> <code>connectTimeout</code> no client (pra fazer a conexão TCP); <code>timeout</code> no request (pra resposta inteira). Lança <code>HttpTimeoutException</code> ao estourar.
          </li>
        </ul><AlertBox type="info" title="Quando ainda usar lib externa?">
          Cenários muito específicos: WebSockets sofisticados, multipart complexo, autenticação NTLM. Pra REST normal, o HttpClient da JDK resolve.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Faça um GET na API pública <code>https://api.github.com/users/SEU_LOGIN</code>, imprima nome, número de repositórios públicos e seguidores. Use Jackson pra desserializar.
          </li><li>
            Receba uma lista de 5 URLs e baixe todas em paralelo com <code>sendAsync</code>. Imprima quanto tempo total levou e quanto teria levado serial (somatório individual).
          </li><li>
            Crie um cliente que faz POST com JSON pra <code>https://httpbin.org/post</code>, lê a resposta, e extrai o campo <code>json</code> de volta com <code>JsonNode</code> do Jackson.
          </li>
        </ol>
      </PageContainer>
  );
}
