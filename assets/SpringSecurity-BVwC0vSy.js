import{j as e}from"./index-BpXci30S.js";import{P as t,A as i}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(t,{title:"Spring Security: autenticação básica",subtitle:"Proteção declarativa — login form, JWT, OAuth2 sem código boilerplate.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Sua API está pronta. Funcionando lindamente. E qualquer pessoa na internet pode chamar ",e.jsx("code",{children:"DELETE /api/usuarios/1"}),". Spring Security fecha o portão: autenticação (quem é você?) e autorização (você pode fazer isso?). Configura por código declarativo, sem espalhar ",e.jsx("code",{children:"if (usuario != null)"})," pelos controllers."]}),e.jsx("h2",{children:"O ponto de partida"}),e.jsx(r,{title:"pom.xml",code:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>`}),e.jsxs("p",{children:["Só adicionar essa dependência já ",e.jsx("strong",{children:"tranca todas"})," as rotas com Basic Auth. O Spring gera uma senha aleatória, exibe no log do startup, usuário é ",e.jsx("code",{children:"user"}),". Tente bater em qualquer endpoint sem credenciais e leva 401."]}),e.jsx(r,{title:"Log inicial",code:"Using generated security password: 2c8e5f12-3b7a-4e91-ab12-9d4f5e6a7b8c"}),e.jsx("h2",{children:"SecurityFilterChain"}),e.jsxs("p",{children:["A partir do Spring Security 6 (Boot 3+), você configura segurança via bean ",e.jsx("code",{children:"SecurityFilterChain"}),". Nada de classe que estende ",e.jsx("code",{children:"WebSecurityConfigurerAdapter"})," (deprecated)."]}),e.jsx(r,{title:"SecurityConfig.java",code:`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/cadastro", "/css/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            )
            .logout(logout -> logout.logoutSuccessUrl("/"));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`}),e.jsx("p",{children:"Resumo das regras de matching:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"permitAll()"})," — qualquer um (autenticado ou não)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"authenticated()"})," — precisa estar logado."]}),e.jsxs("li",{children:[e.jsx("code",{children:'hasRole("ADMIN")'})," — precisa ter role ",e.jsx("code",{children:"ROLE_ADMIN"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:'hasAuthority("LER_PEDIDOS")'})," — autoridade granular."]}),e.jsxs("li",{children:[e.jsx("code",{children:"denyAll()"})," — ninguém."]})]}),e.jsx("h2",{children:"UserDetailsService: usuários do banco"}),e.jsxs("p",{children:["Para autenticar contra sua tabela de usuários, implemente ",e.jsx("code",{children:"UserDetailsService"}),":"]}),e.jsx(r,{code:`@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public UsuarioDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        Usuario u = repo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(email));

        return User.builder()
            .username(u.getEmail())
            .password(u.getSenhaHash())             // já está em BCrypt
            .roles(u.getRole())                     // ex.: "USER" ou "ADMIN"
            .disabled(!u.isAtivo())
            .build();
    }
}`}),e.jsxs("p",{children:["Spring acha esse bean automaticamente e usa para autenticar. Como você definiu o ",e.jsx("code",{children:"BCryptPasswordEncoder"}),", ele compara as senhas com BCrypt na hora do login."]}),e.jsx("h2",{children:"Cadastrando usuário com hash"}),e.jsx(r,{code:`@Service
public class CadastroService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public CadastroService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public Usuario cadastrar(String email, String senhaPura) {
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setSenhaHash(encoder.encode(senhaPura));   // NUNCA salve senha pura
        u.setRole("USER");
        return repo.save(u);
    }
}`}),e.jsx(i,{type:"danger",title:"Nunca, nunca",children:"Não armazene senha em texto puro. Não use MD5/SHA1. BCrypt (ou Argon2) é o padrão da indústria — adaptativo, com sal embutido, lento de propósito."}),e.jsx("h2",{children:"CSRF"}),e.jsx("p",{children:"Por padrão, Spring Security ativa proteção CSRF. Para formulários HTML clássicos, é o que você quer (impede ataques cross-site). Para APIs REST stateless (token JWT), você desliga:"}),e.jsx(r,{code:`http
    .csrf(csrf -> csrf.disable())     // só pra API stateless
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(...);`}),e.jsx("h2",{children:"JWT em poucas linhas"}),e.jsxs("p",{children:["Para APIs REST modernas, JWT (JSON Web Token) é o esquema mais comum. O cliente faz login uma vez, recebe um token assinado, envia em ",e.jsx("code",{children:"Authorization: Bearer ..."})," nas próximas requisições. O servidor valida assinatura e expiração — sem sessão."]}),e.jsx(r,{title:"Esqueleto do filtro",code:`public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwt;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwt.validar(token);
                String email = claims.getSubject();
                List<SimpleGrantedAuthority> roles = List.of(
                    new SimpleGrantedAuthority("ROLE_" + claims.get("role"))
                );
                var auth = new UsernamePasswordAuthenticationToken(email, null, roles);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException ignored) {}
        }
        chain.doFilter(req, res);
    }
}`}),e.jsx(r,{title:"Plugando o filtro",code:`@Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}`}),e.jsxs(i,{type:"tip",title:"Bibliotecas",children:["Para gerar/validar JWT, use ",e.jsx("code",{children:"jjwt"})," (io.jsonwebtoken) ou ",e.jsx("code",{children:"nimbus-jose-jwt"}),". Não escreva criptografia na mão."]}),e.jsx("h2",{children:"OAuth2 Resource Server"}),e.jsxs("p",{children:["Quando o token vem de um provedor externo (Keycloak, Auth0, Cognito), você não precisa nem implementar o filtro JWT. Use o starter ",e.jsx("code",{children:"spring-boot-starter-oauth2-resource-server"}),":"]}),e.jsx(r,{title:"application.properties",code:"spring.security.oauth2.resourceserver.jwt.issuer-uri=https://meu-keycloak/realms/app"}),e.jsx(r,{title:"SecurityConfig",code:`http
    .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
    .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));`}),e.jsxs("p",{children:["O Spring busca a chave pública do ",e.jsx("code",{children:"issuer-uri"})," automaticamente, valida assinatura e expiração de cada token recebido. Você só consome."]}),e.jsx("h2",{children:"Acessando o usuário logado"}),e.jsx(r,{code:`@GetMapping("/me")
public String quemSouEu(Authentication auth) {
    return "Logado como: " + auth.getName();
}

// ou via injeção
@GetMapping("/perfil")
public Usuario perfil(@AuthenticationPrincipal UserDetails user) {
    return service.buscarPorEmail(user.getUsername());
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Adicione Spring Security num projeto existente. Configure: ",e.jsx("code",{children:"/login"})," e ",e.jsx("code",{children:"/cadastro"})," públicos, todo o resto exigindo autenticação. Cadastre um usuário com senha hashed em BCrypt."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"UserDetailsService"})," que busca usuários do banco. Teste fazendo login com Basic Auth (",e.jsx("code",{children:"curl -u email:senha"}),") num endpoint protegido."]}),e.jsxs("li",{children:["Configure uma rota ",e.jsx("code",{children:"/admin/**"})," que só usuários com role ",e.jsx("code",{children:"ADMIN"})," podem acessar. Crie dois usuários (um USER, um ADMIN) e teste."]})]})]})}export{n as default};
