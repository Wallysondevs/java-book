import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringMvc() {
  return (
    <PageContainer title="Spring MVC: REST controllers" subtitle="Construir APIs REST em minutos — anotações fazem 90% do trabalho." difficulty="intermediario" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          Toda aplicação moderna fala HTTP. Mobile, SPA, integrações B2B — todos consomem APIs REST. Spring MVC é o módulo do Spring que transforma classes Java comuns em endpoints HTTP, com serialização JSON automática, validação, tratamento de erros. Você escreve a regra de negócio; o framework cuida do resto.
        </p><h2>O controller mínimo</h2><CodeBlock title="HelloController.java" code={`package com.exemplo.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/ola")
    public String ola() {
        return "Olá, mundo!";
    }
}`} /><p>
          <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>. Cada método retorna o corpo da resposta direto (não uma view). Strings viram texto, objetos viram JSON via Jackson.
        </p><h2>Mapeando rotas e verbos</h2><p>
          <code>@RequestMapping("/api/usuarios")</code> na classe define o prefixo. Os atalhos por verbo deixam o código mais limpo:
        </p><CodeBlock code={`@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping            // GET /api/usuarios
    public List<Usuario> listar() { ... }

    @GetMapping("/{id}")   // GET /api/usuarios/42
    public Usuario buscar(@PathVariable Long id) { ... }

    @PostMapping           // POST /api/usuarios
    public Usuario criar(@RequestBody UsuarioInput dto) { ... }

    @PutMapping("/{id}")   // PUT /api/usuarios/42
    public Usuario atualizar(@PathVariable Long id, @RequestBody UsuarioInput dto) { ... }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) { ... }
}`} /><h2>Lendo dados da requisição</h2><ul>
          <li>
            <strong>
              <code>@PathVariable</code>
            </strong>: parte da URL — <code>/usuarios/42</code> vira <code>id=42</code>.
          </li><li>
            <strong>
              <code>@RequestParam</code>
            </strong>: query string — <code>?nome=joao&ativo=true</code>.
          </li><li>
            <strong>
              <code>@RequestBody</code>
            </strong>: corpo JSON deserializado em um objeto.
          </li><li>
            <strong>
              <code>@RequestHeader</code>
            </strong>: cabeçalho HTTP (ex.: <code>Authorization</code>).
          </li>
        </ul><CodeBlock title="Buscar com filtros opcionais" code={`@GetMapping
public List<Usuario> buscar(
        @RequestParam(required = false) String nome,
        @RequestParam(defaultValue = "true") boolean ativo,
        @RequestParam(defaultValue = "0") int pagina) {
    return service.buscar(nome, ativo, pagina);
}`} /><h2>DTOs com record (Java 16+)</h2><p>
          Records são perfeitos para DTOs: imutáveis, concisos, geram <code>equals/hashCode/toString</code> de graça.
        </p><CodeBlock code={`public record UsuarioInput(String nome, String email, int idade) {}

public record UsuarioResponse(Long id, String nome, String email) {}`} /><h2>ResponseEntity: controlando status e headers</h2><CodeBlock code={`@PostMapping
public ResponseEntity<UsuarioResponse> criar(@RequestBody UsuarioInput dto) {
    Usuario salvo = service.criar(dto);
    URI location = URI.create("/api/usuarios/" + salvo.getId());
    return ResponseEntity
            .created(location)             // 201 Created
            .body(toResponse(salvo));
}

@GetMapping("/{id}")
public ResponseEntity<UsuarioResponse> buscar(@PathVariable Long id) {
    return service.buscarOpcional(id)
            .map(u -> ResponseEntity.ok(toResponse(u)))
            .orElse(ResponseEntity.notFound().build());  // 404
}`} /><h2>Validação com Bean Validation</h2><p>
          Adicione <code>spring-boot-starter-validation</code>. Anote os campos do DTO e use <code>@Valid</code> no controller. Se a validação falhar, o Spring devolve 400 automaticamente.
        </p><CodeBlock title="DTO validado" code={`import jakarta.validation.constraints.*;

public record UsuarioInput(
    @NotBlank(message = "nome é obrigatório")
    @Size(max = 100)
    String nome,

    @NotBlank @Email
    String email,

    @Min(0) @Max(120)
    int idade
) {}`} /><CodeBlock title="Controller com @Valid" code={`@PostMapping
public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioInput dto) {
    // se chegar aqui, dto está válido
    return ResponseEntity.ok(service.criar(dto));
}`} /><h2>Tratamento global de erros</h2><p>
          Em vez de <code>try/catch</code> em cada controller, centralize com <code>@RestControllerAdvice</code>. O Spring chama o handler certo baseado na exceção.
        </p><CodeBlock title="GlobalExceptionHandler.java" code={`@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(EntityNotFoundException e) {
        return ResponseEntity.status(404)
                .body(new ErroResponse("NAO_ENCONTRADO", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
                .body(new ErroResponse("VALIDACAO", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> generico(Exception e) {
        return ResponseEntity.status(500)
                .body(new ErroResponse("ERRO_INTERNO", "Algo deu errado"));
    }
}

public record ErroResponse(String codigo, String mensagem) {}`} /><h2>CRUD completo</h2><CodeBlock title="UsuarioController.java" code={`@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioInput dto) {
        UsuarioResponse criado = service.criar(dto);
        return ResponseEntity
                .created(URI.create("/api/usuarios/" + criado.id()))
                .body(criado);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioInput dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}`} /><h2>Testando</h2><CodeBlock title="Terminal" code={`# listar
curl http://localhost:8080/api/usuarios

# criar
curl -X POST http://localhost:8080/api/usuarios \\
  -H "Content-Type: application/json" \\
  -d '{"nome":"Ana","email":"ana@ex.com","idade":30}'

# buscar
curl http://localhost:8080/api/usuarios/1

# atualizar
curl -X PUT http://localhost:8080/api/usuarios/1 \\
  -H "Content-Type: application/json" \\
  -d '{"nome":"Ana Silva","email":"ana@ex.com","idade":31}'

# deletar
curl -X DELETE http://localhost:8080/api/usuarios/1`} /><AlertBox type="tip" title="Postman / Insomnia / Bruno">
          Para testar APIs com vários endpoints, use uma ferramenta visual. Salva coleções, repete requisições, organiza variáveis. <em>curl</em> é ótimo pra debug rápido.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um <code>ProdutoController</code> com endpoints CRUD em <code>/api/produtos</code>. Use record DTO com validação: nome obrigatório, preço maior que zero.
          </li><li>
            Adicione um <code>@RestControllerAdvice</code> que retorne JSON padronizado <code>{"{codigo, mensagem}"}</code> para 404 e 400.
          </li><li>
            Adicione um endpoint <code>GET /api/produtos?categoria=eletronicos&preco_max=500</code> que aceite filtros opcionais via <code>@RequestParam</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
