import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as i}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(a,{title:"Git para projetos Java",subtitle:".gitignore, .editorconfig, hooks — evite o classpath bagunçado.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Você já viu PR no GitHub com 800 arquivos, sendo 790 dentro de",e.jsx("code",{children:" target/"}),"? Pois é. Projeto Java sem ",e.jsx("code",{children:".gitignore"})," bem feito vira lixão: bytecode, configs do IntelliJ, logs, builds quebrados — tudo commitado. O resultado é ",e.jsx("em",{children:"diff"})," ilegível, conflitos absurdos e (pior) às vezes ",e.jsx("strong",{children:"credenciais vazadas"}),"."]}),e.jsxs("p",{children:["Esta página é o checklist mínimo pra qualquer repositório Java nascer organizado: o que ignorar, o que ",e.jsx("em",{children:"tem que"})," commitar, padrões de commit, e como garantir que segredos nunca saiam da sua máquina."]}),e.jsx("h2",{children:"1. .gitignore essencial"}),e.jsx("p",{children:"Cole isso na raiz do projeto e você já fica fora de 90% dos problemas:"}),e.jsx(i,{title:".gitignore",code:`# Maven
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
.env.local`}),e.jsx("h3",{children:"O que NÃO ignorar"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"pom.xml"}),", ",e.jsx("code",{children:"build.gradle"}),", ",e.jsx("code",{children:"settings.gradle"})," — são a definição do projeto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maven Wrapper"}),": ",e.jsx("code",{children:"mvnw"}),", ",e.jsx("code",{children:"mvnw.cmd"})," e a pasta ",e.jsx("code",{children:".mvn/"}),". Garante que qualquer dev rode com a mesma versão do Maven sem instalar nada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Gradle Wrapper"}),": ",e.jsx("code",{children:"gradlew"}),", ",e.jsx("code",{children:"gradlew.bat"}),"e ",e.jsx("code",{children:"gradle/wrapper/"}),". Idem."]})]}),e.jsxs(o,{type:"tip",title:"Quer ignorar .idea/ mas guardar configs do time?",children:["Em vez de versionar ",e.jsx("code",{children:".idea/"})," inteira, alguns times adicionam exceções: ",e.jsx("code",{children:"!.idea/codeStyles/"}),", ",e.jsx("code",{children:"!.idea/icon.png"}),",",e.jsx("code",{children:"!.idea/inspectionProfiles/"}),". Assim o estilo de código é igual pra todo mundo, mas configs pessoais (workspace.xml etc.) ficam fora."]}),e.jsx("h2",{children:"2. .editorconfig: encoding e indent consistentes"}),e.jsxs("p",{children:["Nada pior que abrir um arquivo e ver mistura de tab com espaço, ou um arquivo salvo em CP-1252 que vira gosma no Linux. ",e.jsx("code",{children:".editorconfig"})," é um formato neutro que IntelliJ, VS Code, Eclipse e até nano respeitam."]}),e.jsx(i,{title:".editorconfig",code:`root = true

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
indent_style = tab`}),e.jsx("p",{children:"Commitado na raiz do repositório, ele se aplica automaticamente. Acabou debate de tabs vs espaços em PR."}),e.jsx("h2",{children:"3. Branches: padrão simples que funciona"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"main"})," — sempre estável. Só recebe merge via PR."]}),e.jsxs("li",{children:[e.jsx("code",{children:"feature/nome-curto"})," — para novas funcionalidades."]}),e.jsxs("li",{children:[e.jsx("code",{children:"fix/descricao"})," — correções de bug."]}),e.jsxs("li",{children:[e.jsx("code",{children:"chore/atualizar-deps"})," — manutenção sem efeito de negócio."]})]}),e.jsxs("p",{children:["Use ",e.jsx("em",{children:"squash merge"})," pra que cada PR vire um único commit limpo no",e.jsx("code",{children:" main"}),". Histórico fica enxuto e fácil de bisseccionar."]}),e.jsx("h2",{children:"4. Conventional Commits"}),e.jsx("p",{children:"Padrão simples para mensagens de commit que documenta intenção e ainda permite gerar changelog automático."}),e.jsx(i,{title:"Exemplos de mensagens",code:`feat(auth): adiciona login com Google
fix(pagamento): corrige cálculo de juros em parcela única
refactor(repository): extrai paginação para método utilitário
chore(deps): atualiza spring-boot para 3.3.4
docs(readme): explica como rodar testes localmente
test(usuario): adiciona casos de borda para idade negativa

# breaking change vai com !
feat(api)!: muda formato de resposta de /users`}),e.jsxs("p",{children:["Os principais prefixos são ",e.jsx("code",{children:"feat"}),", ",e.jsx("code",{children:"fix"}),",",e.jsx("code",{children:"refactor"}),", ",e.jsx("code",{children:"chore"}),", ",e.jsx("code",{children:"docs"}),", ",e.jsx("code",{children:"test"}),",",e.jsx("code",{children:"perf"})," e ",e.jsx("code",{children:"build"}),". Adote isso e seu ",e.jsx("em",{children:"git log"})," vira documentação viva."]}),e.jsx("h2",{children:"5. Pre-commit hooks: barreira automática"}),e.jsxs("p",{children:["Hook do Git é um script que roda antes (ou depois) de uma ação. O",e.jsx("code",{children:" pre-commit"})," roda antes do commit ser efetivado — se ele falha, nada vai pra história. Use pra:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Rodar formatador (Spotless, Google Java Format)."}),e.jsxs("li",{children:["Detectar segredos vazando (Talisman, gitleaks, ferramenta ",e.jsx("em",{children:"pre-commit"}),")."]}),e.jsxs("li",{children:["Rodar lint do ",e.jsx("code",{children:"pom.xml"})," ou ",e.jsx("code",{children:"build.gradle"}),"."]})]}),e.jsx(i,{title:".pre-commit-config.yaml (framework pre-commit)",code:`repos:
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
      - id: check-added-large-files`}),e.jsxs("p",{children:["Instala uma vez com ",e.jsx("code",{children:"pre-commit install"}),' e nunca mais o repo aceita commit "sujo". Existe equivalente node (Husky) e hooks artesanais em',e.jsx("code",{children:" .git/hooks/pre-commit"})," — o importante é ter algum."]}),e.jsx("h2",{children:"6. Nunca commite segredos"}),e.jsxs("p",{children:["Senha de banco, token de API, chave da AWS — tudo isso fica ",e.jsx("strong",{children:"fora"}),"do repositório. Use ",e.jsx("code",{children:".env"})," local e variáveis de ambiente em produção."]}),e.jsx(i,{title:"application.yml usando placeholders",code:`spring:
  datasource:
    url: \${DB_URL}
    username: \${DB_USER}
    password: \${DB_PASSWORD}

api:
  stripe:
    key: \${STRIPE_KEY}`}),e.jsx(i,{title:".env.example (commitado, sem valores reais)",code:`DB_URL=jdbc:postgresql://localhost:5432/app
DB_USER=app
DB_PASSWORD=trocar
STRIPE_KEY=sk_test_xxxxx`}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:".env"})," de verdade fica no ",e.jsx("code",{children:".gitignore"}),". Em scripts shell, você pode usar ",e.jsx("code",{children:"envsubst"})," pra renderizar templates com variáveis de ambiente sem expor nada no Git."]}),e.jsxs(o,{type:"danger",title:"Vazou? Trocar é o ÚNICO remédio.",children:["Se você commitou uma chave secreta e percebeu depois, ",e.jsx("strong",{children:"não basta apagar o commit"}),". Quem clonou ainda tem. ",e.jsx("em",{children:"Revogue"})," a chave no provedor e gere uma nova. Histórico Git é praticamente eterno."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Pegue um projeto Java seu sem ",e.jsx("code",{children:".gitignore"})," robusto. Aplique o modelo desta página, rode ",e.jsx("code",{children:"git rm -r --cached target/ .idea/"})," e comite. Veja o tamanho do repositório no GitHub diminuir."]}),e.jsxs("li",{children:["Adicione ",e.jsx("code",{children:".editorconfig"})," e abra o projeto em duas IDEs diferentes. Confirme que ambas respeitam o estilo definido."]}),e.jsxs("li",{children:["Instale o ",e.jsx("code",{children:"pre-commit"})," com a regra do ",e.jsx("em",{children:"gitleaks"}),". Tente commitar um arquivo com uma string parecendo chave AWS (",e.jsx("code",{children:"AKIAIOSFODNN7EXAMPLE"}),") e veja o hook bloquear."]})]})]})}export{c as default};
