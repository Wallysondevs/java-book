import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DesignPatternsIntro() {
  return (
    <PageContainer title="Padrões de Projeto: visão geral" subtitle="Por que existem, as 3 categorias do GoF e quando usar cada uma." difficulty="intermediario" timeToRead="12 min">
        <h2>POR QUE você precisa disso</h2><p>
          Imagine entrar num projeto novo e o tech lead falar: "aqui usamos um Strategy para o cálculo de frete e um Builder para montar o pedido". Se você não conhece esses nomes, perde 30 minutos lendo código pra entender o que ele descreveu em 10 segundos. <strong>Padrões de projeto são vocabulário compartilhado entre devs.</strong>
        </p><p>
          Eles também são <em>soluções recorrentes para problemas recorrentes</em> de design. Alguém já passou por isso, errou, refatorou, e descreveu uma forma que costuma funcionar bem. Você não precisa redescobrir.
        </p><h2>Origem: o livro Gang of Four</h2><p>
          Em 1994 quatro autores (Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides — a "Gang of Four" ou GoF) publicaram <em>Design Patterns: Elements of Reusable Object-Oriented Software</em>. O livro catalogou 23 padrões em três categorias. Quase 30 anos depois esses nomes ainda dominam as entrevistas técnicas.
        </p><h2>As 3 categorias</h2><h3>1. Criacionais — como construir objetos</h3><p>
          Resolvem o problema "como instanciar isso de forma flexível, sem espalhar<code>new</code> pelo código todo".
        </p><ul>
          <li>
            <strong>Singleton</strong>: garante uma única instância.
          </li><li>
            <strong>Factory Method</strong>: delega a criação para uma subclasse ou método.
          </li><li>
            <strong>Builder</strong>: monta um objeto passo a passo.
          </li><li>(Outros: Abstract Factory, Prototype.)</li>
        </ul><h3>2. Estruturais — como compor objetos</h3><p>
          Resolvem "como juntar classes e objetos pra formar estruturas maiores sem acoplamento brutal".
        </p><ul>
          <li>
            <strong>Adapter</strong>: encaixa uma interface incompatível em outra.
          </li><li>
            <strong>Decorator</strong>: adiciona comportamento sem mexer na classe.
          </li><li>(Outros: Facade, Proxy, Composite, Bridge, Flyweight.)</li>
        </ul><h3>3. Comportamentais — como objetos colaboram</h3><p>Resolvem "como dividir responsabilidade e fluxo de informação entre objetos".</p><ul>
          <li>
            <strong>Strategy</strong>: troca o algoritmo em runtime.
          </li><li>
            <strong>Observer</strong>: avisa muitos quando algo muda.
          </li><li>
            (Outros: Command, State, Template Method, Chain of Responsibility, Iterator, Mediator, Memento, Visitor, Interpreter.)
          </li>
        </ul><AlertBox type="warning" title="Padrão NÃO é receita">
          Se você decorar "Singleton = private constructor + getInstance" e sair colando em todo lugar, vai criar mais problema do que resolver. Padrão é uma <em>resposta para um problema</em>. Sem o problema, não há padrão.
        </AlertBox><h2>Quando você "precisa" de um padrão</h2><p>
          Geralmente <strong>quando o código fica difícil de mudar</strong>. Sintomas:
        </p><ul>
          <li>Pra adicionar um novo tipo de algo, você muda 7 arquivos.</li><li>
            Tem <code>if/else</code> ou <code>switch</code> gigante decidindo "qual classe usar" — provável Strategy ou Factory.
          </li><li>Construtor com 12 parâmetros — provável Builder.</li><li>
            Vários módulos consultando "o estado atual de X" e precisando saber quando muda — provável Observer.
          </li>
        </ul><h2>Cuidado: over-engineering</h2><p>
          Aplicar padrão preventivamente é o pecado mais comum de júnior empolgado. Se hoje seu sistema só envia e-mail, não crie <code>NotificadorFactory</code> +<code> NotificadorStrategy</code> "porque um dia pode ter SMS". Refatore quando o SMS chegar. <strong>YAGNI</strong> (You Aren't Gonna Need It) bate padrão GoF toda vez.
        </p><CodeBlock title="Sintoma de over-engineering" code={`// 200 linhas de Factory + Strategy + Builder...
NotificadorBuilder.builder()
  .comStrategy(EmailStrategy.getInstance())
  .comFactory(MensagemFactory.getInstance())
  .build()
  .enviar("ola");

// O que era pra ser:
emailService.enviar("ola");`} /><h2>Java moderno mudou o jogo</h2><p>
          Vários padrões clássicos viraram one-liners ou ficaram desnecessários com features novas:
        </p><ul>
          <li>
            <strong>Strategy</strong>: hoje é só uma <code>Function</code> ou <code>Runnable</code> passada como lambda.
          </li><li>
            <strong>Singleton</strong>: <code>enum</code> resolve em 3 linhas.
          </li><li>
            <strong>Builder</strong>: <code>record</code> com 3-5 campos não precisa.
          </li><li>
            <strong>Visitor</strong>: <code>sealed</code> + pattern matching de <code>switch</code> (Java 21) substitui com elegância.
          </li><li>
            <strong>Iterator</strong>: a JDK já faz tudo via <code>Iterable</code>.
          </li>
        </ul><h2>O que vem nas próximas páginas</h2><ul>
          <li>
            <strong>Singleton</strong> — instância única, e por que dói testar.
          </li><li>
            <strong>Factory Method</strong> — esconder o <code>new</code>.
          </li><li>
            <strong>Builder</strong> — adeus construtor com 12 parâmetros.
          </li><li>
            <strong>Observer</strong> — base de eventos e Reactive.
          </li><li>
            <strong>Strategy</strong> — algoritmo plugável.
          </li><li>
            <strong>Decorator</strong> — empilhar comportamento.
          </li><li>
            <strong>Adapter</strong> — encaixar interfaces incompatíveis.
          </li>
        </ul><AlertBox type="tip" title="Como estudar padrões">
          Não decore o diagrama UML. <strong>Decore o problema</strong> que cada padrão resolve. Se você reconhecer o problema no seu código, o padrão emerge naturalmente.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue um projeto seu e procure: tem algum <code>switch</code> gigante decidindo "qual coisa fazer baseado num tipo"? Anote — é candidato a Strategy ou Factory.
          </li><li>
            Liste 3 classes do <code>java.util</code> ou <code>java.io</code> e identifique que padrão GoF cada uma usa (dica: <code>Collections</code>, <code>BufferedReader</code>,<code> Iterator</code>).
          </li><li>
            Escreva em uma frase, com suas palavras, a diferença entre as 3 categorias do GoF. Se travou, releia esta página.
          </li>
        </ol>
      </PageContainer>
  );
}
