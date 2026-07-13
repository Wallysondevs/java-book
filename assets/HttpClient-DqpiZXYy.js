import{j as e}from"./index-BpXci30S.js";import{P as r,A as o}from"./AlertBox-CmRzTA0W.js";import{C as t}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"HttpClient (Java 11+)",subtitle:"Cliente HTTP nativo da JDK — esqueça Apache HttpClient na maioria dos casos.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Quase todo programa moderno conversa com APIs: consumir endpoint REST, baixar arquivo, enviar webhook, autenticar via OAuth. Antes do Java 11, a única opção decente era a lib externa Apache HttpClient. Hoje, a JDK traz um cliente moderno, com suporte a HTTP/2, async com ",e.jsx("code",{children:"CompletableFuture"}),", e API fluente. Você não precisa de dependência nenhuma."]}),e.jsx("h2",{children:"O cliente"}),e.jsxs("p",{children:["Crie ",e.jsx("strong",{children:"um"})," ",e.jsx("code",{children:"HttpClient"})," na sua aplicação e reutilize. Ele já gerencia pool de conexões, mantém keep-alive e suporta HTTP/2 transparentemente quando o servidor aceita."]}),e.jsx(t,{title:"Criando o cliente",code:`import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.time.Duration;

HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .followRedirects(Redirect.NORMAL)
        .build();

// Versão preguiça-mas-ok:
HttpClient padrao = HttpClient.newHttpClient();`}),e.jsx("h2",{children:"GET síncrono"}),e.jsxs("p",{children:["Monta-se um ",e.jsx("code",{children:"HttpRequest"})," com builder fluente e chama-se ",e.jsx("code",{children:"send"}),". O ",e.jsx("code",{children:"BodyHandler"})," diz como interpretar a resposta (string, bytes, arquivo, stream)."]}),e.jsx(t,{title:"GET retornando String",code:`import java.net.URI;
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
System.out.println("Body:   " + resp.body());`}),e.jsx("h2",{children:"BodyHandlers: o que fazer com a resposta"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ofString()"})," — texto (UTF-8 por padrão)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ofByteArray()"})," — bytes crus."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ofFile(Path)"})," — joga direto pra disco (ótimo pra downloads grandes)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ofInputStream()"})," — você consome em streaming."]}),e.jsxs("li",{children:[e.jsx("code",{children:"discarding()"})," — ignora o body (só liga pro status)."]})]}),e.jsx(t,{title:"Baixando um arquivo",code:`import java.nio.file.Path;

HttpRequest req = HttpRequest.newBuilder(URI.create("https://exemplo.com/foto.jpg")).build();
HttpResponse<Path> resp = client.send(req, BodyHandlers.ofFile(Path.of("foto.jpg")));
System.out.println("Salvo em: " + resp.body());`}),e.jsx("h2",{children:"POST com JSON"}),e.jsxs("p",{children:["Pra enviar corpo, use ",e.jsx("code",{children:"BodyPublishers.ofString"})," (ou ",e.jsx("code",{children:"ofByteArray"}),", ",e.jsx("code",{children:"ofFile"}),", etc). Combine com Jackson pra serializar objetos."]}),e.jsx(t,{title:"POST JSON",code:`import java.net.http.HttpRequest.BodyPublishers;

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
}`}),e.jsxs(o,{type:"tip",title:"Text blocks são lindos pra JSON",children:["Desde Java 15, use ",e.jsx("code",{children:'"""'})," pra escrever JSON multi-linha sem ficar escapando aspas duplas."]}),e.jsx("h2",{children:"Async com CompletableFuture"}),e.jsxs("p",{children:["Em vez de bloquear a thread, você pode disparar a chamada e receber um ",e.jsx("code",{children:"CompletableFuture"}),". Ideal pra processar várias requisições em paralelo."]}),e.jsx(t,{title:"Várias requisições em paralelo",code:`import java.util.List;
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

futuros.forEach(f -> System.out.println(f.join().statusCode()));`}),e.jsx("h2",{children:"Tratando status code"}),e.jsxs("p",{children:["O HttpClient ",e.jsx("strong",{children:"não"})," joga exceção pra status 4xx ou 5xx — só pra erros de rede. Você precisa checar o ",e.jsx("code",{children:"statusCode()"}),' manualmente. Isso é bom: você decide se 404 é erro ou se é "vazio esperado".']}),e.jsx(t,{title:"Padrão de tratamento",code:`int code = resp.statusCode();

if (code >= 200 && code < 300) {
    return resp.body();
} else if (code == 404) {
    return null;
} else if (code >= 500) {
    throw new RuntimeException("Servidor com problema: " + code);
} else {
    throw new RuntimeException("Erro " + code + ": " + resp.body());
}`}),e.jsx("h2",{children:"Combinando com Jackson"}),e.jsx("p",{children:"O fluxo padrão pra consumir uma API REST: serializar o request com Jackson, mandar via HttpClient, desserializar a resposta."}),e.jsx(t,{title:"Cliente típico de API",code:`record Usuario(int id, String login, String name) {}

ObjectMapper mapper = new ObjectMapper();
HttpRequest req = HttpRequest.newBuilder(
        URI.create("https://api.github.com/users/torvalds")).build();

HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());
Usuario u = mapper.readValue(resp.body(), Usuario.class);

System.out.println(u.name());`}),e.jsx("h2",{children:"HTTP/2, redirect, timeouts"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"HTTP/2:"})," ligado por padrão. Cai pra HTTP/1.1 se o servidor não suportar. Sem configuração."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Redirects:"})," ",e.jsx("code",{children:"followRedirects(Redirect.NORMAL)"})," segue 301/302 (não segue HTTPS→HTTP). Use ",e.jsx("code",{children:"ALWAYS"})," pra seguir tudo, ",e.jsx("code",{children:"NEVER"})," pra não seguir."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Timeouts:"})," ",e.jsx("code",{children:"connectTimeout"})," no client (pra fazer a conexão TCP); ",e.jsx("code",{children:"timeout"})," no request (pra resposta inteira). Lança ",e.jsx("code",{children:"HttpTimeoutException"})," ao estourar."]})]}),e.jsx(o,{type:"info",title:"Quando ainda usar lib externa?",children:"Cenários muito específicos: WebSockets sofisticados, multipart complexo, autenticação NTLM. Pra REST normal, o HttpClient da JDK resolve."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Faça um GET na API pública ",e.jsx("code",{children:"https://api.github.com/users/SEU_LOGIN"}),", imprima nome, número de repositórios públicos e seguidores. Use Jackson pra desserializar."]}),e.jsxs("li",{children:["Receba uma lista de 5 URLs e baixe todas em paralelo com ",e.jsx("code",{children:"sendAsync"}),". Imprima quanto tempo total levou e quanto teria levado serial (somatório individual)."]}),e.jsxs("li",{children:["Crie um cliente que faz POST com JSON pra ",e.jsx("code",{children:"https://httpbin.org/post"}),", lê a resposta, e extrai o campo ",e.jsx("code",{children:"json"})," de volta com ",e.jsx("code",{children:"JsonNode"})," do Jackson."]})]})]})}export{n as default};
