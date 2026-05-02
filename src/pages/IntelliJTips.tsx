import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IntelliJTips() {
  return (
    <PageContainer title="IntelliJ IDEA: 20 atalhos que mudam tudo" subtitle="Quem domina o teclado entrega mais com menos cansaço." difficulty="iniciante" timeToRead="15 min">
        <h2>POR QUE você precisa disso</h2><p>
          Pense no IntelliJ como o cockpit de um avião: dá pra pilotar com o mouse, mas nenhum piloto profissional faz isso. Cada vez que sua mão sai do teclado pra clicar num menu, você quebra o fluxo de pensamento. Aprender atalhos não é firula — é diferença entre escrever 200 e 600 linhas úteis num dia.
        </p><p>
          Esta página foca nos atalhos que <strong>realmente</strong> mudam o jogo. Vou listar usando o padrão Windows/Linux. No macOS, geralmente <code>Ctrl</code> vira<code>Cmd</code> e <code>Alt</code> vira <code>Option</code>.
        </p><h2>1. Navegação: chegar onde você quer em segundos</h2><h3>Search Everywhere — Shift duas vezes</h3><p>
          Aperta <code>Shift</code> rápido duas vezes. Aparece uma caixa que procura classe, arquivo, símbolo, ação, configuração — tudo no mesmo lugar. Se você só decorar UM atalho da vida, decore esse.
        </p><h3>Ir pra classe — Ctrl+N</h3><p>
          Sabe o nome da classe? <code>Ctrl+N</code>, digita parte do nome (até CamelCase funciona: <code>UsRp</code> acha <code>UserRepository</code>) e Enter.
        </p><h3>Ir pra arquivo — Ctrl+Shift+N</h3><p>
          Mesma ideia, mas pra qualquer arquivo (YAML, properties, SQL). Útil pra abrir<code>application.yml</code> sem caçar na árvore.
        </p><h3>Action — Ctrl+Shift+A</h3><p>
          Esqueceu o atalho de algo? <code>Ctrl+Shift+A</code> e digita o nome da ação. Ex.: digita <em>"reformat code"</em> e ele já mostra o atalho associado.
        </p><h3>Ir pra declaração / implementação</h3><ul>
          <li>
            <code>Ctrl+B</code> — pula pra declaração do método ou classe.
          </li><li>
            <code>Ctrl+Alt+B</code> — pula pra implementação (útil em interfaces).
          </li>
        </ul><h2>2. Edição: escrever menos, dizer mais</h2><h3>Quick fix — Alt+Enter</h3><p>
          O atalho mais democrático do IntelliJ. Cursor numa linha com aviso amarelo ou erro vermelho? <code>Alt+Enter</code> oferece soluções: importar classe, criar variável, transformar <em>for</em> em <em>stream</em>, etc.
        </p><h3>Autocomplete — Ctrl+Espaço</h3><p>
          Sugere campos, métodos e variáveis no escopo. Aperte duas vezes pra mostrar opções de fora do import atual também.
        </p><h3>Smart complete — Ctrl+Shift+Espaço</h3><p>
          Mais inteligente: filtra só sugestões compatíveis com o tipo esperado. Se o método espera um <code>
            {"List<String>"}
          </code>, só vai te oferecer coisas que produzem isso.
        </p><h3>Expandir seleção — Ctrl+W</h3><p>
          Cresce a seleção de forma semântica: palavra → expressão → linha → bloco.<code>Ctrl+Shift+W</code> faz o caminho contrário.
        </p><h3>Refactor: Rename — Shift+F6</h3><p>
          Renomeia classe, método, variável atualizando <strong>todas</strong> as referências do projeto. Inclui strings e comentários se você marcar.
        </p><h3>Extract method — Ctrl+Alt+M</h3><p>
          Selecione algumas linhas, aperte e o IntelliJ cria um método com os parâmetros certos. Refactoring em segundos.
        </p><h3>Extract variable — Ctrl+Alt+V</h3><p>
          Pega aquela expressão monstra e transforma em variável nomeada. Código fica legível na hora.
        </p><h3>Comentar / descomentar — Ctrl+/</h3><p>
          Comenta linha (ou bloco selecionado) com <code>//</code>. Para bloco<code>/* */</code> use <code>Ctrl+Shift+/</code>.
        </p><h3>Duplicar linha — Ctrl+D</h3><p>Duplicar é frequentemente mais rápido que copiar+colar.</p><h2>3. Live Templates: digite 4 letras, ganhe 10 linhas</h2><p>
          Live Templates são abreviações que viram código quando você aperta <code>Tab</code>. IntelliJ vem com várias prontas:
        </p><ul>
          <li>
            <code>psvm</code> + Tab → cria <code>public static void main(String[] args)</code>
          </li><li>
            <code>sout</code> + Tab → cria <code>System.out.println()</code>
          </li><li>
            <code>fori</code> + Tab → cria for tradicional com índice
          </li><li>
            <code>iter</code> + Tab → for-each na variável que você acabou de criar
          </li>
        </ul><CodeBlock title="Demonstração: digite psvm e aperte Tab" code={`public class Demo {
    public static void main(String[] args) {
        // sout + Tab vira a linha abaixo
        System.out.println("oi");

        // fori + Tab gera:
        for (int i = 0; i < args.length; i++) {

        }
    }
}`} /><p>
          Você cria as suas em <strong>Settings → Editor → Live Templates</strong>. Vale muito ouro: salve seus padrões de log, try-with-resources, builder, etc.
        </p><h2>4. File and Code Templates</h2><p>
          Quando você cria uma classe nova, o cabeçalho (package, comentário JavaDoc, autor, ano) vem do <strong>File and Code Templates</strong>. Edite em<em> Settings → Editor → File and Code Templates</em> pra padronizar todo arquivo novo do seu time.
        </p><h2>5. Database tool window</h2><p>
          Não precisa de DBeaver pra olhar o banco. <em>View → Tool Windows → Database</em>, adiciona uma conexão (Postgres, MySQL, H2…) e você ganha:
        </p><ul>
          <li>Editor SQL com autocomplete dos nomes de tabela.</li><li>Visualização de schema.</li><li>Refactor: renomeia coluna no banco e ajusta JPA Entity correspondente.</li>
        </ul><h2>6. HTTP Client: adeus Postman (em muitos casos)</h2><p>
          IntelliJ tem cliente HTTP nativo baseado em arquivos <code>.http</code>. Versionado no Git, fácil de compartilhar.
        </p><CodeBlock title="requests.http" code={`### Cria usuário
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "nome": "Maria",
  "idade": 30
}

### Busca por id (usa resposta anterior)
GET http://localhost:8080/api/users/1
Authorization: Bearer {{token}}`} /><p>
          Variáveis ficam em <code>http-client.env.json</code> — uma pra dev, outra pra homologação. Bem mais reproduzível que coleção do Postman compartilhada por link.
        </p><AlertBox type="tip" title="Dica de ouro">
          Em <em>Help → Productivity Guide</em> o IntelliJ mostra estatísticas dos seus próprios atalhos: quais você usa, quais ignora, e o tempo economizado. Ótimo pra descobrir hábitos a melhorar.
        </AlertBox><AlertBox type="warning" title="Cuidado com o Power Save Mode">
          Se de repente o autocomplete sumiu, o sublinhado de erro também e nada de Inspections funciona, abre <em>File → Power Save Mode</em>. Provavelmente está ligado e desabilita análise em background pra economizar bateria.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Abra um projeto Java seu. Use só atalhos de teclado por 30 minutos. Cada vez que precisar do mouse, anote o quê. Ao final, procure o atalho dessas ações em<code>Ctrl+Shift+A</code>.
          </li><li>
            Crie um Live Template chamado <code>logd</code> que expanda pra<code>log.debug("...")</code> com cursor dentro das aspas. Teste em uma classe sua.
          </li><li>
            Crie um arquivo <code>requests.http</code> no projeto e teste pelo menos dois endpoints (um GET e um POST). Configure variável de ambiente pra<code>baseUrl</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
