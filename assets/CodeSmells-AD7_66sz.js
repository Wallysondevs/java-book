import{j as e}from"./index-BpXci30S.js";import{P as r,A as a}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(r,{title:"Code Smells em Java",subtitle:"Sinais de alerta no código — refatorar antes que vire dívida técnica.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Code smell é igual cheiro de comida estragada: não te mata na hora, mas avisa que tem algo errado e que pode piorar. O termo é de Kent Beck, popularizado pelo Martin Fowler no ",e.jsx("em",{children:"Refactoring"}),". Aprender a farejar smells é o que diferencia quem refatora cedo de quem só vai mexer quando o prédio está pegando fogo."]}),e.jsx("h2",{children:"1. Long Method"}),e.jsx("p",{children:"Função com 80 linhas, 5 níveis de indentação, fazendo cinco coisas. Refatore extraindo sub-métodos. Cada nome de método vira documentação."}),e.jsx(o,{title:"Sintoma",code:`void processarFolhaDePagamento(List<Funcionario> funcs) {
    // 30 linhas pra calcular bônus
    // 25 linhas pra descontar imposto
    // 20 linhas pra gravar histórico
    // 15 linhas pra enviar e-mail
}`}),e.jsx(o,{title:"Refatorado",code:`void processarFolhaDePagamento(List<Funcionario> funcs) {
    funcs.forEach(f -> {
        var bonus = calcularBonus(f);
        var liquido = descontarImpostos(f, bonus);
        gravarHistorico(f, liquido);
        notificar(f, liquido);
    });
}`}),e.jsx("h2",{children:"2. Large Class"}),e.jsx("p",{children:"Classe de 1.500 linhas é Single Responsibility ferida. Quase sempre tem ali várias classes escondidas. Procure por agrupamentos de métodos que mexem nos mesmos campos — eles formam uma classe nova."}),e.jsx("h2",{children:"3. Duplicate Code"}),e.jsx("p",{children:"Trecho repetido em dois lugares: extraia método. Em três lugares ou mais com pequenas variações: pense em Strategy ou Template Method."}),e.jsx(o,{code:`// Antes — dois métodos, mesma estrutura
double precoComDescontoVip(double valor)    { return valor * 0.9; }
double precoComDescontoBlack(double valor)  { return valor * 0.5; }

// Melhor
double precoComDesconto(double valor, double fator) { return valor * fator; }`}),e.jsx("h2",{children:"4. Long Parameter List"}),e.jsxs("p",{children:["Método com 6+ parâmetros vira convite a erros (e a passar argumentos na ordem errada). Agrupe num ",e.jsx("code",{children:"record"})," ou aplique Builder."]}),e.jsx(o,{code:`// Ruim
void cadastrar(String nome, String email, String cpf, String tel,
               LocalDate nasc, String cep, String numero, String complemento) {}

// Melhor
record Endereco(String cep, String numero, String complemento) {}
record DadosCadastro(String nome, String email, String cpf, String tel,
                     LocalDate nasc, Endereco endereco) {}

void cadastrar(DadosCadastro d) {}`}),e.jsx("h2",{children:"5. Feature Envy"}),e.jsxs("p",{children:["Método que mexe muito mais nos dados de outra classe do que na própria. Sinal: várias chamadas ",e.jsx("code",{children:"outro.getX()"}),", ",e.jsx("code",{children:"outro.getY()"}),". Mude o método pra onde os dados moram."]}),e.jsx(o,{code:`// Ruim — em ServicoFatura
double total(Pedido p) {
    return p.getItens().stream()
        .mapToDouble(i -> i.getPreco() * i.getQuantidade()).sum();
}

// Melhor — método dentro de Pedido
class Pedido {
    double total() {
        return itens.stream().mapToDouble(Item::subtotal).sum();
    }
}`}),e.jsx("h2",{children:"6. Data Class anêmica"}),e.jsx("p",{children:"Classe com 20 getters, 20 setters e zero comportamento. Você tá programando procedural com fantasia de objeto. Coloque o comportamento (validações, cálculos, regras) dentro da própria classe."}),e.jsxs(a,{type:"note",title:"Records ≠ anêmicos",children:["Records são feitos pra serem dados, sim, mas você pode (e deve) adicionar métodos de comportamento neles. Anemia é não ter ",e.jsx("em",{children:"nenhum"})," comportamento, não usar dados."]}),e.jsx("h2",{children:"7. Switch/if-else por tipo"}),e.jsxs("p",{children:["Quando o mesmo ",e.jsx("code",{children:"switch (tipo)"})," aparece em vários lugares, polimorfismo é a cura. Outra opção limpa: ",e.jsx("code",{children:"Map<Tipo, Strategy>"}),"."]}),e.jsx(o,{title:"Ruim",code:`double frete(String tipo, double peso) {
    switch (tipo) {
        case "PAC":     return peso * 1.5;
        case "SEDEX":   return peso * 3.0;
        case "EXPRESS": return peso * 5.0;
        default: throw new IllegalArgumentException();
    }
}`}),e.jsx(o,{title:"Bom — strategy + map",code:`interface CalculoFrete { double calcular(double peso); }

Map<String, CalculoFrete> tabela = Map.of(
    "PAC",     peso -> peso * 1.5,
    "SEDEX",   peso -> peso * 3.0,
    "EXPRESS", peso -> peso * 5.0
);

double frete(String tipo, double peso) {
    return tabela.getOrDefault(tipo, p -> { throw new IllegalArgumentException(); })
                 .calcular(peso);
}`}),e.jsx("h2",{children:"8. Primitive Obsession"}),e.jsxs("p",{children:["Usar ",e.jsx("code",{children:"String"})," pra CPF, CEP, e-mail, ID; usar ",e.jsx("code",{children:"double"})," pra dinheiro. Você perde validação, perde tipo, perde comportamento. Crie Value Objects."]}),e.jsx(o,{code:`// Ruim
void enviarBoleto(String cpf, double valor) {}

// Bom
public record Cpf(String valor) {
    public Cpf {
        if (!valor.matches("\\\\d{11}")) throw new IllegalArgumentException();
    }
}
public record Dinheiro(BigDecimal valor, String moeda) {}

void enviarBoleto(Cpf cpf, Dinheiro valor) {}`}),e.jsx("h2",{children:"9. God Class"}),e.jsxs("p",{children:["A famosa ",e.jsx("code",{children:"Util"}),", ",e.jsx("code",{children:"Manager"}),", ",e.jsx("code",{children:"Helper"}),' que faz tudo: manda e-mail, valida CPF, calcula imposto, formata data. Quebre por contexto, não por "tudo que sobrou". Cada conjunto de responsabilidade em sua classe nomeada.']}),e.jsx("h2",{children:"10. Comentários demais"}),e.jsxs("p",{children:["Comentário em cada linha geralmente é tentativa de compensar nomes ruins ou função muito longa. Renomeie variável, extraia método — e o comentário some sozinho. Mantenha comentário só pra justificar ",e.jsx("em",{children:"decisão"}),", não pra narrar o código."]}),e.jsx(o,{code:`// Ruim
int d; // dias até o vencimento
if (d < 0) { /* já venceu */ avisar(); }

// Bom
int diasAteVencimento = ...;
if (diasAteVencimento < 0) avisar();`}),e.jsx(a,{type:"tip",title:"Ferramentas que farejam por você",children:"SonarQube, SonarLint, IntelliJ IDEA Inspections, Error Prone (Google) e SpotBugs detectam boa parte desses smells automaticamente. Configure no CI."}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Rode SonarLint na sua IDE em um projeto seu. Anote os 3 smells mais frequentes e refatore um deles ponta a ponta."}),e.jsxs("li",{children:["Encontre um ",e.jsx("code",{children:"switch"})," de tipo no seu código. Refatore pra Strategy ou ",e.jsx("code",{children:"Map<String, Function>"}),". Adicione um caso novo sem tocar no método original."]}),e.jsxs("li",{children:["Pegue uma classe sua que usa ",e.jsx("code",{children:"String"})," pra algo do domínio (CPF, CEP, telefone). Crie um ",e.jsx("code",{children:"record"})," Value Object com validação no construtor compacto. Veja quantos bugs latentes você fechou."]})]})]})}export{n as default};
