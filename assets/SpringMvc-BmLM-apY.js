import{j as e}from"./index-BpXci30S.js";import{P as i,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(i,{title:"Spring MVC: REST controllers",subtitle:"Construir APIs REST em minutos — anotações fazem 90% do trabalho.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsx("p",{children:"Toda aplicação moderna fala HTTP. Mobile, SPA, integrações B2B — todos consomem APIs REST. Spring MVC é o módulo do Spring que transforma classes Java comuns em endpoints HTTP, com serialização JSON automática, validação, tratamento de erros. Você escreve a regra de negócio; o framework cuida do resto."}),e.jsx("h2",{children:"O controller mínimo"}),e.jsx(o,{title:"HelloController.java",code:`package com.exemplo.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/ola")
    public String ola() {
        return "Olá, mundo!";
    }
}`}),e.jsxs("p",{children:[e.jsx("code",{children:"@RestController"})," = ",e.jsx("code",{children:"@Controller"})," + ",e.jsx("code",{children:"@ResponseBody"}),". Cada método retorna o corpo da resposta direto (não uma view). Strings viram texto, objetos viram JSON via Jackson."]}),e.jsx("h2",{children:"Mapeando rotas e verbos"}),e.jsxs("p",{children:[e.jsx("code",{children:'@RequestMapping("/api/usuarios")'})," na classe define o prefixo. Os atalhos por verbo deixam o código mais limpo:"]}),e.jsx(o,{code:`@RestController
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
}`}),e.jsx("h2",{children:"Lendo dados da requisição"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@PathVariable"})}),": parte da URL — ",e.jsx("code",{children:"/usuarios/42"})," vira ",e.jsx("code",{children:"id=42"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@RequestParam"})}),": query string — ",e.jsx("code",{children:"?nome=joao&ativo=true"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@RequestBody"})}),": corpo JSON deserializado em um objeto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"@RequestHeader"})}),": cabeçalho HTTP (ex.: ",e.jsx("code",{children:"Authorization"}),")."]})]}),e.jsx(o,{title:"Buscar com filtros opcionais",code:`@GetMapping
public List<Usuario> buscar(
        @RequestParam(required = false) String nome,
        @RequestParam(defaultValue = "true") boolean ativo,
        @RequestParam(defaultValue = "0") int pagina) {
    return service.buscar(nome, ativo, pagina);
}`}),e.jsx("h2",{children:"DTOs com record (Java 16+)"}),e.jsxs("p",{children:["Records são perfeitos para DTOs: imutáveis, concisos, geram ",e.jsx("code",{children:"equals/hashCode/toString"})," de graça."]}),e.jsx(o,{code:`public record UsuarioInput(String nome, String email, int idade) {}

public record UsuarioResponse(Long id, String nome, String email) {}`}),e.jsx("h2",{children:"ResponseEntity: controlando status e headers"}),e.jsx(o,{code:`@PostMapping
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
}`}),e.jsx("h2",{children:"Validação com Bean Validation"}),e.jsxs("p",{children:["Adicione ",e.jsx("code",{children:"spring-boot-starter-validation"}),". Anote os campos do DTO e use ",e.jsx("code",{children:"@Valid"})," no controller. Se a validação falhar, o Spring devolve 400 automaticamente."]}),e.jsx(o,{title:"DTO validado",code:`import jakarta.validation.constraints.*;

public record UsuarioInput(
    @NotBlank(message = "nome é obrigatório")
    @Size(max = 100)
    String nome,

    @NotBlank @Email
    String email,

    @Min(0) @Max(120)
    int idade
) {}`}),e.jsx(o,{title:"Controller com @Valid",code:`@PostMapping
public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioInput dto) {
    // se chegar aqui, dto está válido
    return ResponseEntity.ok(service.criar(dto));
}`}),e.jsx("h2",{children:"Tratamento global de erros"}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"try/catch"})," em cada controller, centralize com ",e.jsx("code",{children:"@RestControllerAdvice"}),". O Spring chama o handler certo baseado na exceção."]}),e.jsx(o,{title:"GlobalExceptionHandler.java",code:`@RestControllerAdvice
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

public record ErroResponse(String codigo, String mensagem) {}`}),e.jsx("h2",{children:"CRUD completo"}),e.jsx(o,{title:"UsuarioController.java",code:`@RestController
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
}`}),e.jsx("h2",{children:"Testando"}),e.jsx(o,{title:"Terminal",code:`# listar
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
curl -X DELETE http://localhost:8080/api/usuarios/1`}),e.jsxs(r,{type:"tip",title:"Postman / Insomnia / Bruno",children:["Para testar APIs com vários endpoints, use uma ferramenta visual. Salva coleções, repete requisições, organiza variáveis. ",e.jsx("em",{children:"curl"})," é ótimo pra debug rápido."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"ProdutoController"})," com endpoints CRUD em ",e.jsx("code",{children:"/api/produtos"}),". Use record DTO com validação: nome obrigatório, preço maior que zero."]}),e.jsxs("li",{children:["Adicione um ",e.jsx("code",{children:"@RestControllerAdvice"})," que retorne JSON padronizado ",e.jsx("code",{children:"{codigo, mensagem}"})," para 404 e 400."]}),e.jsxs("li",{children:["Adicione um endpoint ",e.jsx("code",{children:"GET /api/produtos?categoria=eletronicos&preco_max=500"})," que aceite filtros opcionais via ",e.jsx("code",{children:"@RequestParam"}),"."]})]})]})}export{n as default};
