import{j as e}from"./index-BpXci30S.js";import{P as a,A as o}from"./AlertBox-CmRzTA0W.js";import{C as s}from"./CodeBlock-CuSzYSd8.js";function t(){return e.jsxs(a,{title:"CI/CD com GitHub Actions",subtitle:"Pipeline de teste e deploy automático em YAML.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["CI/CD é o porteiro do seu repositório. Toda vez que alguém abre PR, ele compila, roda testes, valida estilo e — se tudo passar — empacota e até publica. Sem isso, basta um colega esquecer de rodar testes pra quebrar a ",e.jsx("code",{children:"main"}),"e arrastar o time inteiro pra debug coletivo."]}),e.jsxs("p",{children:["GitHub Actions é a opção mais natural pra projetos Java hoje: integrado ao repo, com ",e.jsx("em",{children:"runners"})," grátis pra projetos públicos e tier generoso pra privados. Aqui você monta um pipeline real do zero, do checkout ao deploy via Docker."]}),e.jsx("h2",{children:"1. Anatomia mínima: ci.yml"}),e.jsxs("p",{children:["Tudo mora em ",e.jsx("code",{children:".github/workflows/"}),". Cada arquivo YAML é um",e.jsx("em",{children:" workflow"})," independente. O exemplo abaixo testa em todo PR e push pra",e.jsx("code",{children:" main"}),"."]}),e.jsx(s,{title:".github/workflows/ci.yml",code:`name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do código
        uses: actions/checkout@v4

      - name: Configurar Java 21 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven

      - name: Rodar testes
        run: ./mvnw -B test`}),e.jsx("p",{children:"Quatro coisas importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"actions/checkout@v4"})," baixa o código no runner."]}),e.jsxs("li",{children:[e.jsx("code",{children:"actions/setup-java@v4"})," instala o JDK desejado.",e.jsx("em",{children:" distribution: temurin"})," é a build oficial open-source mantida pela Adoptium."]}),e.jsxs("li",{children:[e.jsx("code",{children:"cache: maven"})," reaproveita o ",e.jsx("code",{children:"~/.m2/repository"})," entre execuções. Sem isso, cada build baixa o mundo de novo (3-5 minutos a mais)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"./mvnw"})," usa o Maven Wrapper. Por isso ele ",e.jsx("strong",{children:"tem"})," que estar versionado."]})]}),e.jsx("h2",{children:"2. Matrix: testar em várias versões do Java"}),e.jsxs("p",{children:["Sua biblioteca precisa rodar em Java 17 e 21? Use ",e.jsx("em",{children:"matrix strategy"})," e o GitHub roda jobs em paralelo, um por versão."]}),e.jsx(s,{title:"Matrix de versões",code:`jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        java: [ '17', '21' ]
    name: Testes (Java \${{ matrix.java }})

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: \${{ matrix.java }}
          cache: maven
      - run: ./mvnw -B test`}),e.jsxs("p",{children:[e.jsx("code",{children:"fail-fast: false"})," impede que uma falha em Java 17 cancele a corrida em Java 21 — você quer ver os dois resultados."]}),e.jsx("h2",{children:"3. Equivalente Gradle"}),e.jsxs("p",{children:["Para Gradle, troque ",e.jsx("code",{children:"cache: maven"})," por ",e.jsx("code",{children:"cache: gradle"})," e chame o wrapper com ",e.jsx("code",{children:"./gradlew"}),":"]}),e.jsx(s,{title:"Steps com Gradle",code:`      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: gradle

      - name: Tornar gradlew executável
        run: chmod +x ./gradlew

      - name: Build e testes
        run: ./gradlew --no-daemon build`}),e.jsxs("p",{children:[e.jsx("code",{children:"--no-daemon"})," evita que o Gradle deixe daemons órfãos no runner — cada execução do CI é descartável."]}),e.jsx("h2",{children:"4. Pipeline em estágios: test → build → deploy"}),e.jsxs("p",{children:["Quando o projeto cresce, separar em ",e.jsx("em",{children:"jobs"})," diferentes deixa claro o que falhou e permite paralelismo. Use ",e.jsx("code",{children:"needs:"})," pra encadear."]}),e.jsx(s,{title:"Jobs encadeados",code:`jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: maven }
      - run: ./mvnw -B test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: maven }
      - run: ./mvnw -B -DskipTests package
      - uses: actions/upload-artifact@v4
        with:
          name: app-jar
          path: target/*.jar

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: app-jar
      - run: echo "publica em algum lugar"`}),e.jsx("p",{children:"Pontos a notar:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"upload-artifact"})," guarda arquivos entre jobs (e fica disponível pra download na UI do GitHub)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"if: github.ref == 'refs/heads/main'"})," garante que deploy só roda em push pra main, não em PR."]}),e.jsxs("li",{children:[e.jsx("code",{children:"environment: production"})," ativa proteção: você pode exigir",e.jsx("strong",{children:" approval manual"})," de alguém antes de o job rodar."]})]}),e.jsx("h2",{children:"5. Publicando imagem Docker no GHCR"}),e.jsxs("p",{children:["GitHub Container Registry (",e.jsx("code",{children:"ghcr.io"}),") vem incluso. Você não precisa criar conta nem token — usa o ",e.jsx("code",{children:"GITHUB_TOKEN"})," que já existe no job."]}),e.jsx(s,{title:"Job de build e push de imagem",code:`  docker:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Login no GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build e push
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:latest
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}`}),e.jsxs("p",{children:["Cada commit ganha imagem com a SHA, e ",e.jsx("code",{children:"latest"})," aponta sempre pra última. Pra Docker Hub, troque o registry e use ",e.jsx("code",{children:"secrets.DOCKER_USERNAME"}),"e ",e.jsx("code",{children:"secrets.DOCKER_PASSWORD"})," que você cadastra em",e.jsx("em",{children:" Settings → Secrets and variables → Actions"}),"."]}),e.jsxs(o,{type:"warning",title:"Permissions explícitas",children:[e.jsx("code",{children:"GITHUB_TOKEN"})," tem permissões mínimas por padrão. Pra publicar pacote, declare ",e.jsx("code",{children:"permissions: packages: write"})," no job — senão você recebe um ",e.jsx("em",{children:"403 Forbidden"})," meio enigmático."]}),e.jsx("h2",{children:"6. Secrets: o que NÃO colocar no YAML"}),e.jsxs("p",{children:["Tudo que é credencial vai em ",e.jsx("em",{children:"Settings → Secrets"})," e é injetado como",e.jsx("code",{children:"secrets.NOME"}),". O YAML em si é público (no caso de repo aberto), mas valores de secrets são mascarados nos logs."]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"secrets.GITHUB_TOKEN"})," — gerado automaticamente, escopo no repo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"secrets.DOCKER_PASSWORD"}),", ",e.jsx("code",{children:"secrets.AWS_ACCESS_KEY_ID"}),", etc."]}),e.jsxs("li",{children:["Para múltiplos ambientes, use ",e.jsx("em",{children:"Environment Secrets"})," (homolog vs prod)."]})]}),e.jsx("h2",{children:"7. Approval manual para produção"}),e.jsxs("p",{children:["Em ",e.jsx("em",{children:"Settings → Environments → New environment → production"})," habilite",e.jsx("em",{children:" Required reviewers"}),". O job que declarar ",e.jsx("code",{children:"environment: production"}),'fica pendurado esperando alguém clicar em "Approve" antes de rodar. Vital pra deploys sensíveis.']}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Em um projeto Java seu, crie ",e.jsx("code",{children:".github/workflows/ci.yml"})," com o exemplo básico. Faça um push e veja a aba ",e.jsx("em",{children:"Actions"})," rodar. Quebre um teste de propósito e veja o PR ser bloqueado."]}),e.jsxs("li",{children:["Adicione ",e.jsx("em",{children:"matrix strategy"})," testando Java 17 e 21 em paralelo. Confirme que ambas aparecem como checks separados no PR."]}),e.jsxs("li",{children:["Crie um Dockerfile simples no projeto e adicione job que publica imagem no",e.jsx("code",{children:" ghcr.io"})," a cada push em ",e.jsx("code",{children:"main"}),". Verifique a imagem aparecendo na aba ",e.jsx("em",{children:"Packages"})," do repositório."]})]})]})}export{t as default};
