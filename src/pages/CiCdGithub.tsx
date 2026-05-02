import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CiCdGithub() {
  return (
    <PageContainer title="CI/CD com GitHub Actions" subtitle="Pipeline de teste e deploy automático em YAML." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          CI/CD é o porteiro do seu repositório. Toda vez que alguém abre PR, ele compila, roda testes, valida estilo e — se tudo passar — empacota e até publica. Sem isso, basta um colega esquecer de rodar testes pra quebrar a <code>main</code>e arrastar o time inteiro pra debug coletivo.
        </p><p>
          GitHub Actions é a opção mais natural pra projetos Java hoje: integrado ao repo, com <em>runners</em> grátis pra projetos públicos e tier generoso pra privados. Aqui você monta um pipeline real do zero, do checkout ao deploy via Docker.
        </p><h2>1. Anatomia mínima: ci.yml</h2><p>
          Tudo mora em <code>.github/workflows/</code>. Cada arquivo YAML é um<em> workflow</em> independente. O exemplo abaixo testa em todo PR e push pra<code> main</code>.
        </p><CodeBlock title=".github/workflows/ci.yml" code={`name: CI

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
        run: ./mvnw -B test`} /><p>Quatro coisas importantes:</p><ul>
          <li>
            <code>actions/checkout@v4</code> baixa o código no runner.
          </li><li>
            <code>actions/setup-java@v4</code> instala o JDK desejado.<em> distribution: temurin</em> é a build oficial open-source mantida pela Adoptium.
          </li><li>
            <code>cache: maven</code> reaproveita o <code>~/.m2/repository</code> entre execuções. Sem isso, cada build baixa o mundo de novo (3-5 minutos a mais).
          </li><li>
            <code>./mvnw</code> usa o Maven Wrapper. Por isso ele <strong>tem</strong> que estar versionado.
          </li>
        </ul><h2>2. Matrix: testar em várias versões do Java</h2><p>
          Sua biblioteca precisa rodar em Java 17 e 21? Use <em>matrix strategy</em> e o GitHub roda jobs em paralelo, um por versão.
        </p><CodeBlock title="Matrix de versões" code={`jobs:
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
      - run: ./mvnw -B test`} /><p>
          <code>fail-fast: false</code> impede que uma falha em Java 17 cancele a corrida em Java 21 — você quer ver os dois resultados.
        </p><h2>3. Equivalente Gradle</h2><p>
          Para Gradle, troque <code>cache: maven</code> por <code>cache: gradle</code> e chame o wrapper com <code>./gradlew</code>:
        </p><CodeBlock title="Steps com Gradle" code={`      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: gradle

      - name: Tornar gradlew executável
        run: chmod +x ./gradlew

      - name: Build e testes
        run: ./gradlew --no-daemon build`} /><p>
          <code>--no-daemon</code> evita que o Gradle deixe daemons órfãos no runner — cada execução do CI é descartável.
        </p><h2>4. Pipeline em estágios: test → build → deploy</h2><p>
          Quando o projeto cresce, separar em <em>jobs</em> diferentes deixa claro o que falhou e permite paralelismo. Use <code>needs:</code> pra encadear.
        </p><CodeBlock title="Jobs encadeados" code={`jobs:
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
      - run: echo "publica em algum lugar"`} /><p>Pontos a notar:</p><ul>
          <li>
            <code>upload-artifact</code> guarda arquivos entre jobs (e fica disponível pra download na UI do GitHub).
          </li><li>
            <code>if: github.ref == 'refs/heads/main'</code> garante que deploy só roda em push pra main, não em PR.
          </li><li>
            <code>environment: production</code> ativa proteção: você pode exigir<strong> approval manual</strong> de alguém antes de o job rodar.
          </li>
        </ul><h2>5. Publicando imagem Docker no GHCR</h2><p>
          GitHub Container Registry (<code>ghcr.io</code>) vem incluso. Você não precisa criar conta nem token — usa o <code>GITHUB_TOKEN</code> que já existe no job.
        </p><CodeBlock title="Job de build e push de imagem" code={`  docker:
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
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}`} /><p>
          Cada commit ganha imagem com a SHA, e <code>latest</code> aponta sempre pra última. Pra Docker Hub, troque o registry e use <code>secrets.DOCKER_USERNAME</code>e <code>secrets.DOCKER_PASSWORD</code> que você cadastra em<em> Settings → Secrets and variables → Actions</em>.
        </p><AlertBox type="warning" title="Permissions explícitas">
          <code>GITHUB_TOKEN</code> tem permissões mínimas por padrão. Pra publicar pacote, declare <code>permissions: packages: write</code> no job — senão você recebe um <em>403 Forbidden</em> meio enigmático.
        </AlertBox><h2>6. Secrets: o que NÃO colocar no YAML</h2><p>
          Tudo que é credencial vai em <em>Settings → Secrets</em> e é injetado como<code>secrets.NOME</code>. O YAML em si é público (no caso de repo aberto), mas valores de secrets são mascarados nos logs.
        </p><ul>
          <li>
            <code>secrets.GITHUB_TOKEN</code> — gerado automaticamente, escopo no repo.
          </li><li>
            <code>secrets.DOCKER_PASSWORD</code>, <code>secrets.AWS_ACCESS_KEY_ID</code>, etc.
          </li><li>
            Para múltiplos ambientes, use <em>Environment Secrets</em> (homolog vs prod).
          </li>
        </ul><h2>7. Approval manual para produção</h2><p>
          Em <em>Settings → Environments → New environment → production</em> habilite<em> Required reviewers</em>. O job que declarar <code>environment: production</code>fica pendurado esperando alguém clicar em "Approve" antes de rodar. Vital pra deploys sensíveis.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Em um projeto Java seu, crie <code>.github/workflows/ci.yml</code> com o exemplo básico. Faça um push e veja a aba <em>Actions</em> rodar. Quebre um teste de propósito e veja o PR ser bloqueado.
          </li><li>
            Adicione <em>matrix strategy</em> testando Java 17 e 21 em paralelo. Confirme que ambas aparecem como checks separados no PR.
          </li><li>
            Crie um Dockerfile simples no projeto e adicione job que publica imagem no<code> ghcr.io</code> a cada push em <code>main</code>. Verifique a imagem aparecendo na aba <em>Packages</em> do repositório.
          </li>
        </ol>
      </PageContainer>
  );
}
