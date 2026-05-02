import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GitJava() {
  return (
    <PageContainer title="Git para projetos Java" subtitle=".gitignore, .editorconfig, hooks — evite o classpath bagunçado." difficulty="iniciante" timeToRead="12 min">
        <h2>POR QUE você precisa disso</h2><p>
          Você já viu PR no GitHub com 800 arquivos, sendo 790 dentro de<code> target/</code>? Pois é. Projeto Java sem <code>.gitignore</code> bem feito vira lixão: bytecode, configs do IntelliJ, logs, builds quebrados — tudo commitado. O resultado é <em>diff</em> ilegível, conflitos absurdos e (pior) às vezes <strong>credenciais vazadas</strong>.
        </p><p>
          Esta página é o checklist mínimo pra qualquer repositório Java nascer organizado: o que ignorar, o que <em>tem que</em> commitar, padrões de commit, e como garantir que segredos nunca saiam da sua máquina.
        </p><h2>1. .gitignore essencial</h2><p>Cole isso na raiz do projeto e você já fica fora de 90% dos problemas:</p><CodeBlock title=".gitignore" code={`# Maven
target/

# Gradle
build/
.gradle/

# Bytecode
*.class

# IntelliJ
.idea/
*.iml
*.iws
*.ipr
out/

# Eclipse
.classpath
.project
.settings/
bin/

# VS Code
.vscode/

# Logs
*.log
logs/

# Sistema operacional
.DS_Store
Thumbs.db

# Variáveis de ambiente
.env
.env.local`} /><h3>O que NÃO ignorar</h3><ul>
          <li>
            <code>pom.xml</code>, <code>build.gradle</code>, <code>settings.gradle</code> — são a definição do projeto.
          </li><li>
            <strong>Maven Wrapper</strong>: <code>mvnw</code>, <code>mvnw.cmd</code> e a pasta <code>.mvn/</code>. Garante que qualquer dev rode com a mesma versão do Maven sem instalar nada.
          </li><li>
            <strong>Gradle Wrapper</strong>: <code>gradlew</code>, <code>gradlew.bat</code>e <code>gradle/wrapper/</code>. Idem.
          </li>
        </ul><AlertBox type="tip" title="Quer ignorar .idea/ mas guardar configs do time?">
          Em vez de versionar <code>.idea/</code> inteira, alguns times adicionam exceções: <code>!.idea/codeStyles/</code>, <code>!.idea/icon.png</code>,<code>!.idea/inspectionProfiles/</code>. Assim o estilo de código é igual pra todo mundo, mas configs pessoais (workspace.xml etc.) ficam fora.
        </AlertBox><h2>2. .editorconfig: encoding e indent consistentes</h2><p>
          Nada pior que abrir um arquivo e ver mistura de tab com espaço, ou um arquivo salvo em CP-1252 que vira gosma no Linux. <code>.editorconfig</code> é um formato neutro que IntelliJ, VS Code, Eclipse e até nano respeitam.
        </p><CodeBlock title=".editorconfig" code={`root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 4
insert_final_newline = true
trim_trailing_whitespace = true

[*.{yml,yaml,json}]
indent_size = 2

[Makefile]
indent_style = tab`} /><p>
          Commitado na raiz do repositório, ele se aplica automaticamente. Acabou debate de tabs vs espaços em PR.
        </p><h2>3. Branches: padrão simples que funciona</h2><ul>
          <li>
            <code>main</code> — sempre estável. Só recebe merge via PR.
          </li><li>
            <code>feature/nome-curto</code> — para novas funcionalidades.
          </li><li>
            <code>fix/descricao</code> — correções de bug.
          </li><li>
            <code>chore/atualizar-deps</code> — manutenção sem efeito de negócio.
          </li>
        </ul><p>
          Use <em>squash merge</em> pra que cada PR vire um único commit limpo no<code> main</code>. Histórico fica enxuto e fácil de bisseccionar.
        </p><h2>4. Conventional Commits</h2><p>
          Padrão simples para mensagens de commit que documenta intenção e ainda permite gerar changelog automático.
        </p><CodeBlock title="Exemplos de mensagens" code={`feat(auth): adiciona login com Google
fix(pagamento): corrige cálculo de juros em parcela única
refactor(repository): extrai paginação para método utilitário
chore(deps): atualiza spring-boot para 3.3.4
docs(readme): explica como rodar testes localmente
test(usuario): adiciona casos de borda para idade negativa

# breaking change vai com !
feat(api)!: muda formato de resposta de /users`} /><p>
          Os principais prefixos são <code>feat</code>, <code>fix</code>,<code>refactor</code>, <code>chore</code>, <code>docs</code>, <code>test</code>,<code>perf</code> e <code>build</code>. Adote isso e seu <em>git log</em> vira documentação viva.
        </p><h2>5. Pre-commit hooks: barreira automática</h2><p>
          Hook do Git é um script que roda antes (ou depois) de uma ação. O<code> pre-commit</code> roda antes do commit ser efetivado — se ele falha, nada vai pra história. Use pra:
        </p><ul>
          <li>Rodar formatador (Spotless, Google Java Format).</li><li>
            Detectar segredos vazando (Talisman, gitleaks, ferramenta <em>pre-commit</em>).
          </li><li>
            Rodar lint do <code>pom.xml</code> ou <code>build.gradle</code>.
          </li>
        </ul><CodeBlock title=".pre-commit-config.yaml (framework pre-commit)" code={`repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files`} /><p>
          Instala uma vez com <code>pre-commit install</code> e nunca mais o repo aceita commit "sujo". Existe equivalente node (Husky) e hooks artesanais em<code> .git/hooks/pre-commit</code> — o importante é ter algum.
        </p><h2>6. Nunca commite segredos</h2><p>
          Senha de banco, token de API, chave da AWS — tudo isso fica <strong>fora</strong>do repositório. Use <code>.env</code> local e variáveis de ambiente em produção.
        </p><CodeBlock title="application.yml usando placeholders" code={`spring:
  datasource:
    url: \${DB_URL}
    username: \${DB_USER}
    password: \${DB_PASSWORD}

api:
  stripe:
    key: \${STRIPE_KEY}`} /><CodeBlock title=".env.example (commitado, sem valores reais)" code={`DB_URL=jdbc:postgresql://localhost:5432/app
DB_USER=app
DB_PASSWORD=trocar
STRIPE_KEY=sk_test_xxxxx`} /><p>
          O arquivo <code>.env</code> de verdade fica no <code>.gitignore</code>. Em scripts shell, você pode usar <code>envsubst</code> pra renderizar templates com variáveis de ambiente sem expor nada no Git.
        </p><AlertBox type="danger" title="Vazou? Trocar é o ÚNICO remédio.">
          Se você commitou uma chave secreta e percebeu depois, <strong>não basta apagar o commit</strong>. Quem clonou ainda tem. <em>Revogue</em> a chave no provedor e gere uma nova. Histórico Git é praticamente eterno.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue um projeto Java seu sem <code>.gitignore</code> robusto. Aplique o modelo desta página, rode <code>git rm -r --cached target/ .idea/</code> e comite. Veja o tamanho do repositório no GitHub diminuir.
          </li><li>
            Adicione <code>.editorconfig</code> e abra o projeto em duas IDEs diferentes. Confirme que ambas respeitam o estilo definido.
          </li><li>
            Instale o <code>pre-commit</code> com a regra do <em>gitleaks</em>. Tente commitar um arquivo com uma string parecendo chave AWS (<code>AKIAIOSFODNN7EXAMPLE</code>) e veja o hook bloquear.
          </li>
        </ol>
      </PageContainer>
  );
}
