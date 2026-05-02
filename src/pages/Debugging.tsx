import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Debugging() {
  return (
    <PageContainer title="Debugging avançado em Java" subtitle="Breakpoint condicional, watch, evaluate expression — debug é arte." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Sabe aquele bug que só acontece quando o cliente é maior de idade, na quinta produção, com timezone errado? Encher de <code>System.out.println</code> não vai achar. Debug profissional é como ser detetive: você precisa parar a cena no instante exato, olhar pra dentro de cada variável e até voltar no tempo. O debugger do IntelliJ (e da JVM em geral) tem ferramentas pra tudo isso — só que a maioria dos devs usa 5% delas.
        </p><p>
          Aqui você vai conhecer breakpoints condicionais, watchpoints, hot swap e até debug de processo Java rodando em outro servidor. Tudo o que separa quem caça bug em 2 minutos de quem fica 2 horas chutando.
        </p><h2>1. O breakpoint comum (e suas variações)</h2><p>
          Clicar na margem esquerda da linha cria o famoso ponto vermelho. Quando a execução passa ali, a JVM congela e te entrega o controle. Simples — mas o IntelliJ tem variantes muito mais úteis.
        </p><CodeBlock title="Cenário base" code={`public class Loja {
    public static void main(String[] args) {
        for (int i = 0; i < 1000; i++) {
            Usuario u = buscar(i);
            processar(u);
        }
    }
}`} /><h3>Conditional breakpoint</h3><p>
          Botão direito no breakpoint → digite uma expressão Java. Ele só suspende quando a expressão é <code>true</code>. Salva sua vida em loops grandes:
        </p><ul>
          <li>
            <code>i == 743</code> — para só na iteração problemática.
          </li><li>
            <code>usuario.idade {">"} 60 && usuario.cidade.equals("SP")</code>
          </li><li>
            <code>list.size() {">"} 100</code>
          </li>
        </ul><h3>Log breakpoint</h3><p>
          Marque <em>"Suspend"</em> como falso e ative <em>"Evaluate and log"</em>. O breakpoint <strong>não para</strong> — só imprime no console o que você pediu. É melhor que <code>println</code> porque:
        </p><ul>
          <li>Não polui o código (você não comita por engano).</li><li>
            Pode ser removido em massa: <em>Run → View Breakpoints → Remove all</em>.
          </li><li>Pode imprimir qualquer expressão, inclusive chamadas de método.</li>
        </ul><h3>Exception breakpoint</h3><p>
          Em <em>Run → View Breakpoints → + → Java Exception Breakpoint</em>. Escolhe a exceção (ex.: <code>NullPointerException</code>). A JVM <strong>para na linha exata</strong> que ela é lançada — antes mesmo do <code>catch</code>. Game changer pra NPEs misteriosas.
        </p><h3>Field watchpoint</h3><p>
          Coloque o breakpoint na linha de <em>declaração de um campo</em>. O ícone vira um olho. A JVM para sempre que aquele campo é <strong>lido</strong> ou<strong> escrito</strong> (você escolhe). Excelente pra descobrir "quem está modificando esse atributo às escondidas".
        </p><CodeBlock title="Watchpoint sobre o campo saldo" code={`public class Conta {
    private double saldo; // breakpoint aqui vira watchpoint

    public void depositar(double v) { this.saldo += v; }
    public void sacar(double v)     { this.saldo -= v; }
}`} /><h3>Method breakpoint</h3><p>
          Coloque o breakpoint na <em>linha de declaração</em> do método. Para na entrada e/ou saída. É caro (a JVM precisa instrumentar o método), então use com moderação — mas inestimável quando você não sabe quem chama um método.
        </p><h2>2. Andar pelo código</h2><ul>
          <li>
            <strong>Step Over (F8)</strong> — executa a linha inteira sem entrar em métodos.
          </li><li>
            <strong>Step Into (F7)</strong> — entra no método chamado.
          </li><li>
            <strong>Step Out (Shift+F8)</strong> — termina o método atual e volta pro chamador.
          </li><li>
            <strong>Force Step Into (Alt+Shift+F7)</strong> — entra mesmo em código da JDK que normalmente é pulado por filtro.
          </li><li>
            <strong>Run to Cursor (Alt+F9)</strong> — executa até o cursor sem precisar colocar breakpoint temporário.
          </li>
        </ul><h2>3. Drop Frame: a máquina do tempo</h2><p>
          Botão <em>Drop Frame</em> no painel de debug <strong>volta a execução pro início do método atual</strong>. Variáveis locais voltam ao estado de entrada. Você revive o método quantas vezes precisar.
        </p><AlertBox type="warning" title="Cuidado: side effects ficam">
          Drop Frame só desfaz o frame da pilha. Se o método já gravou em banco, mandou e-mail ou alterou um <code>static</code>, isso <strong>não</strong> volta. Use em métodos puros ou em ambientes sem efeito colateral.
        </AlertBox><h2>4. Evaluate Expression — Alt+F8</h2><p>
          Com a execução pausada, abre uma caixa onde você digita <strong>qualquer código Java</strong> usando o contexto atual. Pode chamar métodos, criar objetos, avaliar streams.
        </p><CodeBlock title="Exemplos no Evaluate" code={`// no meio do método, você pode rodar:
usuarios.stream().filter(u -> u.idade > 60).count()

// criar objeto novo só pra testar
new ConversorMoeda().converter(saldo, "USD")

// até reatribuir variáveis locais
this.saldo = 1_000_000`} /><p>
          Use pra <strong>testar hipóteses</strong> sem reiniciar a aplicação. É um REPL com acesso ao seu estado real.
        </p><h2>5. Hot Swap: edita o código sem reiniciar</h2><p>
          Modifique o corpo de um método com a JVM em modo debug e clique<em> Run → Reload Changed Classes</em>. A JVM substitui o bytecode em memória — sem precisar reiniciar a aplicação. Salvação em apps que demoram pra subir.
        </p><p>Limitações importantes do Hot Swap padrão:</p><ul>
          <li>
            Só funciona dentro do <strong>corpo</strong> de métodos existentes.
          </li><li>Não pode adicionar/remover método, campo ou classe.</li><li>Não pode mudar assinatura.</li>
        </ul><AlertBox type="tip" title="Quer mais? JRebel / DCEVM">
          Ferramentas como JRebel ou o agente DCEVM removem essas limitações e permitem adicionar campos, métodos e até classes em runtime. Custam licença, mas em monolitos grandes pagam fácil.
        </AlertBox><h2>6. Remote Debugging: depurar app em outro servidor</h2><p>
          Sua aplicação está rodando num container, em homologação, e o bug não acontece local. Solução: subir a JVM com porta de debug aberta e conectar o IntelliJ.
        </p><CodeBlock title="Subir a JVM com debug habilitado (Java 9+)" code={`java \\
  -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 \\
  -jar minha-app.jar`} /><ul>
          <li>
            <code>server=y</code> — a JVM escuta conexões.
          </li><li>
            <code>suspend=n</code> — não trava esperando o debugger conectar.
          </li><li>
            <code>address=*:5005</code> — escuta em todas as interfaces, porta 5005.
          </li>
        </ul><p>
          No IntelliJ: <em>Run → Edit Configurations → + → Remote JVM Debug</em>, host e porta certos, dê start. Coloque breakpoints e use a app no servidor — vai parar local. Bytecode no servidor precisa <strong>bater</strong> com o do projeto (mesmo commit, mesmo build).
        </p><AlertBox type="danger" title="Nunca exponha 5005 pra internet">
          Quem conectar nessa porta executa código arbitrário no servidor. Mantenha atrás de VPN, SSH tunnel ou bind em <code>127.0.0.1</code>.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie um loop de 1000 iterações que processa usuários. Coloque um conditional breakpoint que pare só quando <code>i % 100 == 0</code> e veja a diferença versus parar em todas as iterações.
          </li><li>
            Coloque um <em>exception breakpoint</em> em <code>NullPointerException</code> e rode um trecho que dispare a exceção dentro de uma cadeia de chamadas. Observe como o IntelliJ para na linha exata da causa, não no <code>catch</code>.
          </li><li>
            Rode uma aplicação Spring Boot local com a flag de remote debug (<code>-agentlib:jdwp=...</code>), conecte com o IntelliJ via Remote JVM Debug e coloque breakpoint num endpoint REST. Acesse pelo navegador e veja parar.
          </li>
        </ol>
      </PageContainer>
  );
}
