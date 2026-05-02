import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Filosofia() {
  return (
    <PageContainer title="Filosofia: Write Once, Run Anywhere" subtitle="Por que Java compila pra bytecode em vez de código de máquina." difficulty="iniciante" timeToRead="10 min">
        <h2>POR QUE você precisa disso</h2><p>
          Antes de digitar a primeira linha de Java, vale entender o "espírito" da plataforma. Se você sabe POR QUE Java é do jeito que é, vai parar de brigar com a linguagem e começar a usá-la a favor. As decisões de design — bytecode, tipagem estática, garbage collector, retrocompatibilidade — não são gosto pessoal de uma equipe; são respostas a problemas reais. Vamos por partes.
        </p><h2>Write Once, Run Anywhere (WORA)</h2><p>
          Esse é o lema de marketing que pegou em 1995 e nunca mais saiu. A ideia é simples: você escreve seu programa <strong>uma vez</strong>, compila <strong>uma vez</strong> e o mesmo arquivo resultante roda em Windows, Linux, macOS, em servidores ARM, em mainframes — em qualquer lugar que tenha uma JVM instalada.
        </p><p>
          Pense numa analogia: imagina que você quer enviar um livro pra leitores em vários países que falam línguas diferentes. Você poderia traduzir o livro pra cada idioma (cansativo, e cada tradução fica diferente). Ou poderia escrever o livro numa <em>língua intermediária</em> e dar pra cada leitor um <em>tradutor universal</em> no bolso. Java escolheu a segunda opção. A "língua intermediária" é o <strong>bytecode</strong>. O tradutor universal é a <strong>JVM</strong>.
        </p><h2>Bytecode: a língua que a JVM entende</h2><p>
          Quando você compila <code>HelloMundo.java</code>, o compilador <code>javac</code> gera um arquivo <code>HelloMundo.class</code>. Esse arquivo NÃO é executável pelo seu sistema operacional. Ele contém <strong>bytecode</strong>: instruções pra uma CPU imaginária (a JVM). Quem traduz essas instruções pra CPU real do seu computador é a JVM, em tempo de execução.
        </p><CodeBlock title="Do código-fonte ao programa rodando" code={`# 1. Você escreve isso em HelloMundo.java
public class HelloMundo {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}

# 2. Compila para bytecode
$ javac HelloMundo.java
# resultado: HelloMundo.class (bytecode portátil)

# 3. Roda em qualquer SO que tenha JVM
$ java HelloMundo
Olá!`} /><p>
          O mesmo arquivo <code>HelloMundo.class</code> rodaria sem alteração no servidor Linux do trabalho, no Mac do colega, no Windows da sua mãe. <strong>Compila uma vez, roda em qualquer lugar.</strong>
        </p><h2>Comparando com C e com Python</h2><p>Pra entender a sacada, vamos comparar com dois extremos.</p><h3>C: compila direto pra arquitetura específica</h3><p>
          Em C, o compilador (gcc/clang) traduz seu código diretamente pra instruções da CPU real. O resultado é um binário rapidíssimo — mas que <strong>só roda naquela arquitetura</strong>. Compilou no seu Mac M1? Não vai rodar num servidor Intel sem recompilar. Compilou no Linux? Não roda no Windows.
        </p><p>
          Vantagem do C: velocidade máxima, controle total. Desvantagem: você gerencia memória na unha e precisa publicar um binário pra cada combinação SO+arquitetura.
        </p><h3>Python: interpreta linha por linha</h3><p>
          Em Python, não há compilação separada. O interpretador lê seu código <code>.py</code> e executa direto, na hora. É portátil (roda onde tiver Python instalado), mas é mais lento — e qualquer erro de digitação só aparece quando a linha for executada.
        </p><h3>Java: o meio do caminho que deu certo</h3><p>
          Java compila pra bytecode (cedo, no <code>javac</code>) e a JVM otimiza esse bytecode pra CPU real em tempo de execução, usando uma técnica chamada <strong>JIT (Just-In-Time compilation)</strong>. Resultado: roda em qualquer lugar E é rápido. Em programas longos, Java chega a competir com C em performance.
        </p><AlertBox type="info" title="JIT é o segredo da performance">
          O JIT observa quais partes do seu programa são executadas muitas vezes ("hot spots") e compila essas partes pra código de máquina nativo, otimizado, durante a execução. É por isso que aplicações Java de longa duração (servidores, bancos de dados) ficam cada vez mais rápidas conforme rodam.
        </AlertBox><h2>Garbage Collection: chega de vazamento de memória</h2><p>
          Em C/C++, você aloca memória manualmente e precisa liberar manualmente. Esquece de liberar? Vazamento. Libera duas vezes? Crash. Acessa depois de liberar? Falha de segurança.
        </p><p>
          Java tirou essa responsabilidade da sua mão. A JVM tem um <strong>Garbage Collector (GC)</strong> que monitora quais objetos ainda estão sendo usados e libera automaticamente os que não são mais referenciados. Você cria objetos com <code>new</code>; nunca precisa pensar em destruí-los.
        </p><CodeBlock title="Você cria, o GC limpa" code={`public class Memoria {
    public static void main(String[] args) {
        for (int i = 0; i < 1_000_000; i++) {
            String temp = "objeto " + i;
            // 'temp' some quando o loop avança;
            // o GC libera essa memória automaticamente.
        }
        System.out.println("Sem vazamentos. Sem free(). Sem dor.");
    }
}`} /><h2>Tipagem forte e estática</h2><p>
          Java é <strong>fortemente tipada</strong> (não converte tipos sem você mandar) e <strong>estaticamente tipada</strong> (cada variável tem um tipo definido em tempo de compilação). Isso quer dizer que muitos erros são pegos pelo compilador antes do programa rodar.
        </p><CodeBlock title="O compilador é seu primeiro QA" code={`int idade = 30;
idade = "trinta"; // ERRO de compilação:
// incompatible types: String cannot be converted to int

// Comparação com Python:
// idade = 30
// idade = "trinta"  # roda numa boa, quebra depois`} /><p>
          Pode parecer chato no começo ("eu só queria mudar o tipo da variável"), mas em projetos grandes essa rigidez é o que te salva. Erros viram avisos do compilador, não bugs em produção às 3 da manhã.
        </p><h2>Retrocompatibilidade obsessiva</h2><p>
          Esta talvez seja a característica mais radical do Java: código escrito em 1996 ainda compila e roda no Java 21 de 2023, quase sem alterações. <strong>Quase nenhuma linguagem mainstream leva isso tão a sério.</strong>
        </p><p>
          Por quê? Porque empresas têm sistemas críticos (bancos, telecom, governo) rodando há décadas. Quebrar compatibilidade significa milhões em retrabalho. A Oracle e o OpenJDK escolhem viver com decisões antigas estranhas (como a ordem de parâmetros de algumas APIs) em vez de quebrar o ecossistema.
        </p><AlertBox type="success" title="Na prática: você aprende uma vez, usa pra sempre">
          Conhecimento em Java envelhece muito bem. Um livro de Java 8 ainda é relevante em 2024. APIs novas são adicionadas, mas as antigas continuam funcionando. Compare com ecossistemas onde frameworks mudam tudo a cada 2 anos.
        </AlertBox><h2>O preço da filosofia</h2><p>
          Tudo isso tem custos. A JVM consome mais memória que um binário C equivalente. O startup é mais lento que Python pra scripts rápidos. A sintaxe é mais verbosa que Python ou JavaScript. Você sente isso no dia a dia.
        </p><p>
          Mas em troca: portabilidade real, performance excelente em aplicações longas, ferramentas profissionais maduras, milhões de bibliotecas, e a tranquilidade de saber que seu código vai continuar funcionando daqui a 10 anos.
        </p><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pesquise o que é "bytecode" e tente abrir um arquivo <code>.class</code> num editor de texto comum. Vai parecer lixo binário — porque é mesmo.
          </li><li>
            Liste 2 vantagens e 2 desvantagens do Java em comparação com Python ou JavaScript. Foque em coisas que VOCÊ valoriza num projeto.
          </li><li>
            Procure no Google "Java JIT compilation" e leia uma definição rápida. Tente explicar com suas palavras: por que ter JIT torna Java rápido <em>com o tempo</em>?
          </li>
        </ol>
      </PageContainer>
  );
}
