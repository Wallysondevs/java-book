import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CleanCode() {
  return (
    <PageContainer title="Clean Code em Java" subtitle="Nomes, funções, comentários — código pra humanos primeiro." difficulty="intermediario" timeToRead="20 min">
        <h2>POR QUE você precisa disso</h2><p>
          Código é lido <strong>10 vezes mais</strong> do que escrito. O compilador aceita qualquer <code>m1()</code>, <code>x</code>, <code>tmp</code>; mas você daqui a 6 meses — ou o colega de squad — vai te xingar. Clean Code é a disciplina de escrever pensando no próximo humano.
        </p><p>Analogia: receita de bolo. "Misture 200g" é claro. "Use o pó" é enigma.</p><h2>1. Nomes intencionais</h2><p>
          O nome deve dizer <em>o que faz</em> e <em>por que existe</em>. Se você precisa comentar um nome, ele está errado.
        </p><CodeBlock title="Ruim → bom" code={`// Ruim
double calc(double s) { return s * 0.275; }

// Bom
double calcularImpostoSobreSalario(double salarioBruto) {
    return salarioBruto * ALIQUOTA_IRPF_FAIXA_4;
}`} /><h2>2. Funções pequenas, um nível de abstração</h2><p>
          Regra prática: se passou de <strong>15 linhas</strong>, soa o alarme. Cada função faz <strong>uma coisa</strong>, e tudo dentro dela está no mesmo nível mental. Não misture "abrir conexão JDBC" com "calcular preço final com desconto".
        </p><CodeBlock title="Misturando níveis" code={`void processarPedido(Pedido p) {
    Connection c = DriverManager.getConnection(URL); // baixo nível (infra)
    double total = 0;
    for (Item i : p.getItens()) total += i.preco() * i.quantidade(); // médio (regra)
    if (p.cliente().vip()) total *= 0.9;                              // regra
    PreparedStatement st = c.prepareStatement("INSERT ...");          // baixo nível
    // ...
}`} /><CodeBlock title="Cada nível na sua função" code={`void processarPedido(Pedido p) {
    double total = calcularTotal(p);
    persistir(p, total);
}

double calcularTotal(Pedido p) {
    double soma = somarItens(p.getItens());
    return p.cliente().vip() ? soma * 0.9 : soma;
}`} /><h2>3. Máximo 3 parâmetros</h2><p>
          Quatro parâmetros já é cheiro; cinco é dor. Agrupe num <code>record</code> ou Builder.
        </p><CodeBlock code={`// Ruim
void criarUsuario(String nome, String email, String cpf, LocalDate nascimento, boolean ativo) {}

// Melhor
record DadosUsuario(String nome, String email, String cpf, LocalDate nascimento, boolean ativo) {}
void criarUsuario(DadosUsuario dados) {}`} /><h2>4. Evite booleanos como parâmetro</h2><p>
          <code>enviar(true)</code> não significa nada na hora de ler. Quase sempre o booleano esconde duas funções diferentes.
        </p><CodeBlock code={`// Ruim
void enviarRelatorio(Relatorio r, boolean porEmail) {
    if (porEmail) enviarEmail(r); else imprimir(r);
}

// Bom: dois métodos com nome
void enviarRelatorioPorEmail(Relatorio r) { /* ... */ }
void imprimirRelatorio(Relatorio r)       { /* ... */ }`} /><h2>5. Comentários explicam PORQUÊ, não O QUE</h2><p>
          O <em>o quê</em> o código já mostra. Comentário bom é o que justifica uma decisão não óbvia.
        </p><CodeBlock code={`// Ruim — comenta o óbvio
i++; // incrementa i

// Bom — explica decisão de negócio
// Banco Central exige arredondar pra cima em juros (Resolução 4.595/2017).
valor = valor.setScale(2, RoundingMode.UP);`} /><h2>
          6. <code>final</code> em tudo que não muda
        </h2><p>
          Quanto mais coisas <code>final</code>, menos lugares pra bug se esconder. Use <code>final</code> em campos, parâmetros e variáveis locais sempre que puder. Mostra intenção: "isso aqui não muda".
        </p><CodeBlock code={`final BigDecimal aliquota = new BigDecimal("0.275");
// final em parâmetro também:
double calcular(final BigDecimal salario) {
    return salario.multiply(aliquota).doubleValue();
}`} /><h2>7. Early return / guard clauses</h2><p>
          Aninhar <code>if</code> dentro de <code>if</code> vira piramide. Trate o caso ruim cedo e saia.
        </p><CodeBlock title="Aninhamento horrível" code={`String descrever(Pedido p) {
    if (p != null) {
        if (p.cliente() != null) {
            if (p.cliente().vip()) {
                return "VIP";
            } else {
                return "Comum";
            }
        }
    }
    return "Inválido";
}`} /><CodeBlock title="Guard clauses" code={`String descrever(Pedido p) {
    if (p == null || p.cliente() == null) return "Inválido";
    return p.cliente().vip() ? "VIP" : "Comum";
}`} /><h2>8. Lei de Demeter — não fale com estranhos</h2><p>
          Evite <code>a.getB().getC().fazAlgo()</code>. Você está acoplando seu código à estrutura interna de três classes. Peça pro objeto <em>fazer</em>, não pra ele te entregar partes.
        </p><CodeBlock code={`// Ruim — você sabe demais sobre a estrutura
pedido.getCliente().getEndereco().getCidade().toUpperCase();

// Bom — pergunte ao objeto
pedido.cidadeDoCliente();`} /><AlertBox type="warning" title="Quando o trem é de carga, é OK">
          APIs fluentes (<code>Stream</code>, Builders) parecem violar Demeter, mas todas as chamadas retornam o mesmo tipo conceitual. A lei vale entre objetos de domínio diferentes.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Pegue uma função sua com mais de 30 linhas. Quebre em sub-métodos privados, cada um com nome que conta uma frase. Veja se a função "principal" virou um índice legível.
          </li><li>
            Encontre um método com booleano de comportamento. Divida em dois métodos com nomes claros e remova o parâmetro.
          </li><li>
            Caça a Demeter: procure no seu projeto algum <code>.get().get().get()</code>. Substitua por um método de domínio no objeto raiz.
          </li>
        </ol>
      </PageContainer>
  );
}
