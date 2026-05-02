import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Encapsulamento() {
  return (
    <PageContainer title="Encapsulamento" subtitle="private, public, protected, package-private — esconda o que não deve aparecer." difficulty="iniciante" timeToRead="15 min">
        <h2>Por que você precisa disso</h2><p>
          Imagine que você expõe o campo <code>saldo</code> da sua <code>ContaBancaria</code> como público. Aí, em qualquer canto do código, alguém escreve <code>conta.saldo = -1000000</code>. Pronto: você nunca vai saber quem fez, nem por quê, nem como impedir. <strong>Encapsulamento</strong> é a prática de esconder o que é interno e expor só o que faz sentido — assim, mudanças internas não quebram quem usa sua classe, e regras de negócio ficam protegidas.
        </p><h2>A analogia do micro-ondas</h2><p>
          Você usa o micro-ondas com botões e display. Não abre a tampa traseira pra mexer no magnetron. A interface pública é simples; a complexidade interna é privada. Bem feito, o fabricante pode trocar todo o circuito interno e você continua apertando os mesmos botões.
        </p><h2>Os 4 modificadores de acesso</h2><p>Java tem quatro níveis de visibilidade. Do mais restritivo para o mais aberto:</p><h3>private — só dentro da própria classe</h3><p>
          Ninguém de fora vê nem mexe. Use para campos e métodos auxiliares que são detalhe de implementação.
        </p><h3>package-private — sem modificador, só dentro do mesmo pacote</h3><p>
          Quando você não escreve nenhum modificador, é esse o padrão. Visível para classes do mesmo <code>package</code>, invisível para o resto.
        </p><h3>protected — pacote + subclasses</h3><p>
          Acessível dentro do mesmo pacote e também por classes filhas (mesmo em outros pacotes). Útil para expor "ganchos" para quem herda da sua classe.
        </p><h3>public — qualquer um, em qualquer lugar</h3><p>Sem restrição. Use só quando faz parte da API que você pretende expor.</p><h2>Tabela de visibilidade</h2><p>Quem enxerga o quê:</p><ul>
          <li>
            <strong>private</strong>: própria classe ✅ — pacote ❌ — subclasse ❌ — mundo ❌
          </li><li>
            <strong>package-private</strong>: própria classe ✅ — pacote ✅ — subclasse fora do pacote ❌ — mundo ❌
          </li><li>
            <strong>protected</strong>: própria classe ✅ — pacote ✅ — subclasse ✅ — mundo ❌
          </li><li>
            <strong>public</strong>: própria classe ✅ — pacote ✅ — subclasse ✅ — mundo ✅
          </li>
        </ul><h2>Por que campos são quase sempre private</h2><p>
          A regra de bolso: <strong>campos privados, métodos públicos</strong> (quando precisar expor). Assim você controla como o estado é lido e modificado. Os métodos que fornecem esse acesso são chamados de <strong>getters</strong> (lêem) e <strong>setters</strong> (escrevem).
        </p><CodeBlock title="ContaBancaria.java" code={`public class ContaBancaria {
    private double saldo;
    private String titular;

    public ContaBancaria(String titular) {
        this.titular = titular;
        this.saldo = 0;
    }

    public double getSaldo() {
        return saldo;
    }

    public String getTitular() {
        return titular;
    }

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
}`} /><p>
          Note: não tem <code>setSaldo</code>. O saldo só muda via <code>depositar</code> (ou um <code>sacar</code> que você implemente). Isso é encapsulamento útil: a regra "saldo nunca diminui sem motivo" fica garantida pela classe.
        </p><h2>Validação no setter</h2><p>
          Quando você precisa permitir alteração mas com regras, o setter é o lugar certo:
        </p><CodeBlock title="Pessoa.java" code={`public class Pessoa {
    private int idade;

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        this.idade = idade;
    }
}`} /><p>
          Se algum dia você quiser permitir só idades pares, ou logar toda mudança, basta editar <code>setIdade</code>. Quem usa a classe nem precisa saber.
        </p><h2>Geração automática na IDE</h2><p>
          Ninguém digita getter/setter à mão depois do segundo dia de Java. No IntelliJ: <code>Alt+Insert</code> → "Getter and Setter". No Eclipse: botão direito → "Source" → "Generate Getters and Setters". No VS Code: extensão "Java Extension Pack" oferece atalhos similares. Use sem culpa.
        </p><AlertBox type="tip" title="Convenção de nomes">
          Para campo <code>nome</code>, getter é <code>getNome()</code> e setter é <code>setNome(String)</code>. Para <code>boolean ativo</code>, o getter normalmente chama <code>isAtivo()</code>. Frameworks (Spring, Jackson) dependem dessa convenção — fugir dela quebra mágica.
        </AlertBox><h2>Records: getters de graça (desde Java 14)</h2><p>
          Quando sua classe é só um pacote de dados imutáveis, escrever getter pra cada campo cansa. Records resolvem: você declara os campos, e o compilador gera construtor, getters (com nome igual ao campo), <code>equals</code>, <code>hashCode</code> e <code>toString</code>.
        </p><CodeBlock title="Ponto.java — record" code={`public record Ponto(int x, int y) { }

// Uso:
Ponto p = new Ponto(3, 4);
System.out.println(p.x()); // 3 — getter chamado x(), não getX()
System.out.println(p.y()); // 4
System.out.println(p);     // Ponto[x=3, y=4]`} /><p>
          Records são <strong>imutáveis</strong>: não tem setter, os campos são <code>final</code> automaticamente. Use quando seus dados não precisam mudar depois de criados — DTOs, value objects, retornos de API, etc.
        </p><AlertBox type="info" title="Quando NÃO usar record">
          Se sua classe tem comportamento complexo, herança, ou precisa mudar de estado, use classe normal. Record é para dados, não para entidades de domínio com regras pesadas.
        </AlertBox><h2>protected na vida real</h2><p>
          Você vai usar <code>protected</code> menos do que imagina. É comum em frameworks que oferecem classes-base para você estender. No seu código de aplicação, prefira <code>private</code> e exponha só o estritamente necessário.
        </p><CodeBlock title="Uso típico de protected" code={`public abstract class TarefaAgendada {
    protected void log(String msg) {
        System.out.println("[" + System.currentTimeMillis() + "] " + msg);
    }

    public abstract void executar();
}

public class BackupDiario extends TarefaAgendada {
    public void executar() {
        log("Iniciando backup..."); // pode chamar porque é protected
    }
}`} /><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Refatore <code>ContaBancaria</code>: torne <code>saldo</code> e <code>titular</code> privados, exponha <code>getSaldo</code> e <code>getTitular</code>, e adicione o método <code>sacar(double valor)</code> que só permite saque se <code>{"valor > 0"}</code> e <code>
              {"valor <= saldo"}
            </code>.
          </li><li>
            Crie um <code>record Endereco(String rua, String cidade, String cep)</code>. Instancie um e tente alterar <code>rua</code> depois — observe o erro de compilação.
          </li><li>
            Faça uma classe <code>Senha</code> com campo <code>private String valor</code> e setter que recusa valores com menos de 8 caracteres, lançando <code>IllegalArgumentException</code>. Teste com uma senha curta e uma longa.
          </li>
        </ol>
      </PageContainer>
  );
}
