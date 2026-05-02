import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpringSecurity() {
  return (
    <PageContainer title="Spring Security: autenticação básica" subtitle="Proteção declarativa — login form, JWT, OAuth2 sem código boilerplate." difficulty="avancado" timeToRead="25 min">
        <h2>POR QUE você precisa disso</h2><p>
          Sua API está pronta. Funcionando lindamente. E qualquer pessoa na internet pode chamar <code>DELETE /api/usuarios/1</code>. Spring Security fecha o portão: autenticação (quem é você?) e autorização (você pode fazer isso?). Configura por código declarativo, sem espalhar <code>if (usuario != null)</code> pelos controllers.
        </p><h2>O ponto de partida</h2><CodeBlock title="pom.xml" code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>`} /><p>
          Só adicionar essa dependência já <strong>tranca todas</strong> as rotas com Basic Auth. O Spring gera uma senha aleatória, exibe no log do startup, usuário é <code>user</code>. Tente bater em qualquer endpoint sem credenciais e leva 401.
        </p><CodeBlock title="Log inicial" code="Using generated security password: 2c8e5f12-3b7a-4e91-ab12-9d4f5e6a7b8c" /><h2>SecurityFilterChain</h2><p>
          A partir do Spring Security 6 (Boot 3+), você configura segurança via bean <code>SecurityFilterChain</code>. Nada de classe que estende <code>WebSecurityConfigurerAdapter</code> (deprecated).
        </p><CodeBlock title="SecurityConfig.java" code={`@Configuration
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
}`} /><p>Resumo das regras de matching:</p><ul>
          <li>
            <code>permitAll()</code> — qualquer um (autenticado ou não).
          </li><li>
            <code>authenticated()</code> — precisa estar logado.
          </li><li>
            <code>hasRole("ADMIN")</code> — precisa ter role <code>ROLE_ADMIN</code>.
          </li><li>
            <code>hasAuthority("LER_PEDIDOS")</code> — autoridade granular.
          </li><li>
            <code>denyAll()</code> — ninguém.
          </li>
        </ul><h2>UserDetailsService: usuários do banco</h2><p>
          Para autenticar contra sua tabela de usuários, implemente <code>UserDetailsService</code>:
        </p><CodeBlock code={`@Service
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
}`} /><p>
          Spring acha esse bean automaticamente e usa para autenticar. Como você definiu o <code>BCryptPasswordEncoder</code>, ele compara as senhas com BCrypt na hora do login.
        </p><h2>Cadastrando usuário com hash</h2><CodeBlock code={`@Service
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
}`} /><AlertBox type="danger" title="Nunca, nunca">
          Não armazene senha em texto puro. Não use MD5/SHA1. BCrypt (ou Argon2) é o padrão da indústria — adaptativo, com sal embutido, lento de propósito.
        </AlertBox><h2>CSRF</h2><p>
          Por padrão, Spring Security ativa proteção CSRF. Para formulários HTML clássicos, é o que você quer (impede ataques cross-site). Para APIs REST stateless (token JWT), você desliga:
        </p><CodeBlock code={`http
    .csrf(csrf -> csrf.disable())     // só pra API stateless
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(...);`} /><h2>JWT em poucas linhas</h2><p>
          Para APIs REST modernas, JWT (JSON Web Token) é o esquema mais comum. O cliente faz login uma vez, recebe um token assinado, envia em <code>Authorization: Bearer ...</code> nas próximas requisições. O servidor valida assinatura e expiração — sem sessão.
        </p><CodeBlock title="Esqueleto do filtro" code={`public class JwtAuthenticationFilter extends OncePerRequestFilter {

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
}`} /><CodeBlock title="Plugando o filtro" code={`@Bean
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
}`} /><AlertBox type="tip" title="Bibliotecas">
          Para gerar/validar JWT, use <code>jjwt</code> (io.jsonwebtoken) ou <code>nimbus-jose-jwt</code>. Não escreva criptografia na mão.
        </AlertBox><h2>OAuth2 Resource Server</h2><p>
          Quando o token vem de um provedor externo (Keycloak, Auth0, Cognito), você não precisa nem implementar o filtro JWT. Use o starter <code>spring-boot-starter-oauth2-resource-server</code>:
        </p><CodeBlock title="application.properties" code="spring.security.oauth2.resourceserver.jwt.issuer-uri=https://meu-keycloak/realms/app" /><CodeBlock title="SecurityConfig" code={`http
    .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
    .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));`} /><p>
          O Spring busca a chave pública do <code>issuer-uri</code> automaticamente, valida assinatura e expiração de cada token recebido. Você só consome.
        </p><h2>Acessando o usuário logado</h2><CodeBlock code={`@GetMapping("/me")
public String quemSouEu(Authentication auth) {
    return "Logado como: " + auth.getName();
}

// ou via injeção
@GetMapping("/perfil")
public Usuario perfil(@AuthenticationPrincipal UserDetails user) {
    return service.buscarPorEmail(user.getUsername());
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Adicione Spring Security num projeto existente. Configure: <code>/login</code> e <code>/cadastro</code> públicos, todo o resto exigindo autenticação. Cadastre um usuário com senha hashed em BCrypt.
          </li><li>
            Crie um <code>UserDetailsService</code> que busca usuários do banco. Teste fazendo login com Basic Auth (<code>curl -u email:senha</code>) num endpoint protegido.
          </li><li>
            Configure uma rota <code>/admin/**</code> que só usuários com role <code>ADMIN</code> podem acessar. Crie dois usuários (um USER, um ADMIN) e teste.
          </li>
        </ol>
      </PageContainer>
  );
}
