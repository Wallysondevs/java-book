import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CodeSmells() {
  return (
    <PageContainer title="Code Smells em Java" subtitle="Sinais de alerta no código — refatorar antes que vire dívida técnica." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Code smell é igual cheiro de comida estragada: não te mata na hora, mas avisa que tem algo errado e que pode piorar. O termo é de Kent Beck, popularizado pelo Martin Fowler no <em>Refactoring</em>. Aprender a farejar smells é o que diferencia quem refatora cedo de quem só vai mexer quando o prédio está pegando fogo.
        </p><h2>1. Long Method</h2><p>
          Função com 80 linhas, 5 níveis de indentação, fazendo cinco coisas. Refatore extraindo sub-métodos. Cada nome de método vira documentação.
        </p><CodeBlock title="Sintoma" code={`void processarFolhaDePagamento(List<Funcionario> funcs) {
    // 30 linhas pra calcular bônus
    // 25 linhas pra descontar imposto
    // 20 linhas pra gravar histórico
    // 15 linhas pra enviar e-mail
}`} /><CodeBlock title="Refatorado" code={`void processarFolhaDePagamento(List<Funcionario> funcs) {
    funcs.forEach(f -> {
        var bonus = calcularBonus(f);
        var liquido = descontarImpostos(f, bonus);
        gravarHistorico(f, liquido);
        notificar(f, liquido);
    });
}`} /><h2>2. Large Class</h2><p>
          Classe de 1.500 linhas é Single Responsibility ferida. Quase sempre tem ali várias classes escondidas. Procure por agrupamentos de métodos que mexem nos mesmos campos — eles formam uma classe nova.
        </p><h2>3. Duplicate Code</h2><p>
          Trecho repetido em dois lugares: extraia método. Em três lugares ou mais com pequenas variações: pense em Strategy ou Template Method.
        </p><CodeBlock code={`// Antes — dois métodos, mesma estrutura
double precoComDescontoVip(double valor)    { return valor * 0.9; }
double precoComDescontoBlack(double valor)  { return valor * 0.5; }

// Melhor
double precoComDesconto(double valor, double fator) { return valor * fator; }`} /><h2>4. Long Parameter List</h2><p>
          Método com 6+ parâmetros vira convite a erros (e a passar argumentos na ordem errada). Agrupe num <code>record</code> ou aplique Builder.
        </p><CodeBlock code={`// Ruim
void cadastrar(String nome, String email, String cpf, String tel,
               LocalDate nasc, String cep, String numero, String complemento) {}

// Melhor
record Endereco(String cep, String numero, String complemento) {}
record DadosCadastro(String nome, String email, String cpf, String tel,
                     LocalDate nasc, Endereco endereco) {}

void cadastrar(DadosCadastro d) {}`} /><h2>5. Feature Envy</h2><p>
          Método que mexe muito mais nos dados de outra classe do que na própria. Sinal: várias chamadas <code>outro.getX()</code>, <code>outro.getY()</code>. Mude o método pra onde os dados moram.
        </p><CodeBlock code={`// Ruim — em ServicoFatura
double total(Pedido p) {
    return p.getItens().stream()
        .mapToDouble(i -> i.getPreco() * i.getQuantidade()).sum();
}

// Melhor — método dentro de Pedido
class Pedido {
    double total() {
        return itens.stream().mapToDouble(Item::subtotal).sum();
    }
}`} /><h2>6. Data Class anêmica</h2><p>
          Classe com 20 getters, 20 setters e zero comportamento. Você tá programando procedural com fantasia de objeto. Coloque o comportamento (validações, cálculos, regras) dentro da própria classe.
        </p><AlertBox type="note" title="Records ≠ anêmicos">
          Records são feitos pra serem dados, sim, mas você pode (e deve) adicionar métodos de comportamento neles. Anemia é não ter <em>nenhum</em> comportamento, não usar dados.
        </AlertBox><h2>7. Switch/if-else por tipo</h2><p>
          Quando o mesmo <code>switch (tipo)</code> aparece em vários lugares, polimorfismo é a cura. Outra opção limpa: <code>
            {"Map<Tipo, Strategy>"}
          </code>.
        </p><CodeBlock title="Ruim" code={`double frete(String tipo, double peso) {
    switch (tipo) {
        case "PAC":     return peso * 1.5;
        case "SEDEX":   return peso * 3.0;
        case "EXPRESS": return peso * 5.0;
        default: throw new IllegalArgumentException();
    }
}`} /><CodeBlock title="Bom — strategy + map" code={`interface CalculoFrete { double calcular(double peso); }

Map<String, CalculoFrete> tabela = Map.of(
    "PAC",     peso -> peso * 1.5,
    "SEDEX",   peso -> peso * 3.0,
    "EXPRESS", peso -> peso * 5.0
);

double frete(String tipo, double peso) {
    return tabela.getOrDefault(tipo, p -> { throw new IllegalArgumentException(); })
                 .calcular(peso);
}`} /><h2>8. Primitive Obsession</h2><p>
          Usar <code>String</code> pra CPF, CEP, e-mail, ID; usar <code>double</code> pra dinheiro. Você perde validação, perde tipo, perde comportamento. Crie Value Objects.
        </p><CodeBlock code={`// Ruim
void enviarBoleto(String cpf, double valor) {}

// Bom
public record Cpf(String valor) {
    public Cpf {
        if (!valor.matches("\\\\d{11}")) throw new IllegalArgumentException();
    }
}
public record Dinheiro(BigDecimal valor, String moeda) {}

void enviarBoleto(Cpf cpf, Dinheiro valor) {}`} /><h2>9. God Class</h2><p>
          A famosa <code>Util</code>, <code>Manager</code>, <code>Helper</code> que faz tudo: manda e-mail, valida CPF, calcula imposto, formata data. Quebre por contexto, não por "tudo que sobrou". Cada conjunto de responsabilidade em sua classe nomeada.
        </p><h2>10. Comentários demais</h2><p>
          Comentário em cada linha geralmente é tentativa de compensar nomes ruins ou função muito longa. Renomeie variável, extraia método — e o comentário some sozinho. Mantenha comentário só pra justificar <em>decisão</em>, não pra narrar o código.
        </p><CodeBlock code={`// Ruim
int d; // dias até o vencimento
if (d < 0) { /* já venceu */ avisar(); }

// Bom
int diasAteVencimento = ...;
if (diasAteVencimento < 0) avisar();`} /><AlertBox type="tip" title="Ferramentas que farejam por você">
          SonarQube, SonarLint, IntelliJ IDEA Inspections, Error Prone (Google) e SpotBugs detectam boa parte desses smells automaticamente. Configure no CI.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Rode SonarLint na sua IDE em um projeto seu. Anote os 3 smells mais frequentes e refatore um deles ponta a ponta.
          </li><li>
            Encontre um <code>switch</code> de tipo no seu código. Refatore pra Strategy ou <code>
              {"Map<String, Function>"}
            </code>. Adicione um caso novo sem tocar no método original.
          </li><li>
            Pegue uma classe sua que usa <code>String</code> pra algo do domínio (CPF, CEP, telefone). Crie um <code>record</code> Value Object com validação no construtor compacto. Veja quantos bugs latentes você fechou.
          </li>
        </ol>
      </PageContainer>
  );
}
