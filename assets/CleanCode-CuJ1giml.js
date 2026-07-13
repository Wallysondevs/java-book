import{j as e}from"./index-BpXci30S.js";import{P as i,A as r}from"./AlertBox-CmRzTA0W.js";import{C as o}from"./CodeBlock-CuSzYSd8.js";function d(){return e.jsxs(i,{title:"Clean Code em Java",subtitle:"Nomes, funções, comentários — código pra humanos primeiro.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"POR QUE você precisa disso"}),e.jsxs("p",{children:["Código é lido ",e.jsx("strong",{children:"10 vezes mais"})," do que escrito. O compilador aceita qualquer ",e.jsx("code",{children:"m1()"}),", ",e.jsx("code",{children:"x"}),", ",e.jsx("code",{children:"tmp"}),"; mas você daqui a 6 meses — ou o colega de squad — vai te xingar. Clean Code é a disciplina de escrever pensando no próximo humano."]}),e.jsx("p",{children:'Analogia: receita de bolo. "Misture 200g" é claro. "Use o pó" é enigma.'}),e.jsx("h2",{children:"1. Nomes intencionais"}),e.jsxs("p",{children:["O nome deve dizer ",e.jsx("em",{children:"o que faz"})," e ",e.jsx("em",{children:"por que existe"}),". Se você precisa comentar um nome, ele está errado."]}),e.jsx(o,{title:"Ruim → bom",code:`// Ruim
double calc(double s) { return s * 0.275; }

// Bom
double calcularImpostoSobreSalario(double salarioBruto) {
    return salarioBruto * ALIQUOTA_IRPF_FAIXA_4;
}`}),e.jsx("h2",{children:"2. Funções pequenas, um nível de abstração"}),e.jsxs("p",{children:["Regra prática: se passou de ",e.jsx("strong",{children:"15 linhas"}),", soa o alarme. Cada função faz ",e.jsx("strong",{children:"uma coisa"}),', e tudo dentro dela está no mesmo nível mental. Não misture "abrir conexão JDBC" com "calcular preço final com desconto".']}),e.jsx(o,{title:"Misturando níveis",code:`void processarPedido(Pedido p) {
    Connection c = DriverManager.getConnection(URL); // baixo nível (infra)
    double total = 0;
    for (Item i : p.getItens()) total += i.preco() * i.quantidade(); // médio (regra)
    if (p.cliente().vip()) total *= 0.9;                              // regra
    PreparedStatement st = c.prepareStatement("INSERT ...");          // baixo nível
    // ...
}`}),e.jsx(o,{title:"Cada nível na sua função",code:`void processarPedido(Pedido p) {
    double total = calcularTotal(p);
    persistir(p, total);
}

double calcularTotal(Pedido p) {
    double soma = somarItens(p.getItens());
    return p.cliente().vip() ? soma * 0.9 : soma;
}`}),e.jsx("h2",{children:"3. Máximo 3 parâmetros"}),e.jsxs("p",{children:["Quatro parâmetros já é cheiro; cinco é dor. Agrupe num ",e.jsx("code",{children:"record"})," ou Builder."]}),e.jsx(o,{code:`// Ruim
void criarUsuario(String nome, String email, String cpf, LocalDate nascimento, boolean ativo) {}

// Melhor
record DadosUsuario(String nome, String email, String cpf, LocalDate nascimento, boolean ativo) {}
void criarUsuario(DadosUsuario dados) {}`}),e.jsx("h2",{children:"4. Evite booleanos como parâmetro"}),e.jsxs("p",{children:[e.jsx("code",{children:"enviar(true)"})," não significa nada na hora de ler. Quase sempre o booleano esconde duas funções diferentes."]}),e.jsx(o,{code:`// Ruim
void enviarRelatorio(Relatorio r, boolean porEmail) {
    if (porEmail) enviarEmail(r); else imprimir(r);
}

// Bom: dois métodos com nome
void enviarRelatorioPorEmail(Relatorio r) { /* ... */ }
void imprimirRelatorio(Relatorio r)       { /* ... */ }`}),e.jsx("h2",{children:"5. Comentários explicam PORQUÊ, não O QUE"}),e.jsxs("p",{children:["O ",e.jsx("em",{children:"o quê"})," o código já mostra. Comentário bom é o que justifica uma decisão não óbvia."]}),e.jsx(o,{code:`// Ruim — comenta o óbvio
i++; // incrementa i

// Bom — explica decisão de negócio
// Banco Central exige arredondar pra cima em juros (Resolução 4.595/2017).
valor = valor.setScale(2, RoundingMode.UP);`}),e.jsxs("h2",{children:["6. ",e.jsx("code",{children:"final"})," em tudo que não muda"]}),e.jsxs("p",{children:["Quanto mais coisas ",e.jsx("code",{children:"final"}),", menos lugares pra bug se esconder. Use ",e.jsx("code",{children:"final"}),' em campos, parâmetros e variáveis locais sempre que puder. Mostra intenção: "isso aqui não muda".']}),e.jsx(o,{code:`final BigDecimal aliquota = new BigDecimal("0.275");
// final em parâmetro também:
double calcular(final BigDecimal salario) {
    return salario.multiply(aliquota).doubleValue();
}`}),e.jsx("h2",{children:"7. Early return / guard clauses"}),e.jsxs("p",{children:["Aninhar ",e.jsx("code",{children:"if"})," dentro de ",e.jsx("code",{children:"if"})," vira piramide. Trate o caso ruim cedo e saia."]}),e.jsx(o,{title:"Aninhamento horrível",code:`String descrever(Pedido p) {
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
}`}),e.jsx(o,{title:"Guard clauses",code:`String descrever(Pedido p) {
    if (p == null || p.cliente() == null) return "Inválido";
    return p.cliente().vip() ? "VIP" : "Comum";
}`}),e.jsx("h2",{children:"8. Lei de Demeter — não fale com estranhos"}),e.jsxs("p",{children:["Evite ",e.jsx("code",{children:"a.getB().getC().fazAlgo()"}),". Você está acoplando seu código à estrutura interna de três classes. Peça pro objeto ",e.jsx("em",{children:"fazer"}),", não pra ele te entregar partes."]}),e.jsx(o,{code:`// Ruim — você sabe demais sobre a estrutura
pedido.getCliente().getEndereco().getCidade().toUpperCase();

// Bom — pergunte ao objeto
pedido.cidadeDoCliente();`}),e.jsxs(r,{type:"warning",title:"Quando o trem é de carga, é OK",children:["APIs fluentes (",e.jsx("code",{children:"Stream"}),", Builders) parecem violar Demeter, mas todas as chamadas retornam o mesmo tipo conceitual. A lei vale entre objetos de domínio diferentes."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsx("li",{children:'Pegue uma função sua com mais de 30 linhas. Quebre em sub-métodos privados, cada um com nome que conta uma frase. Veja se a função "principal" virou um índice legível.'}),e.jsx("li",{children:"Encontre um método com booleano de comportamento. Divida em dois métodos com nomes claros e remova o parâmetro."}),e.jsxs("li",{children:["Caça a Demeter: procure no seu projeto algum ",e.jsx("code",{children:".get().get().get()"}),". Substitua por um método de domínio no objeto raiz."]})]})]})}export{d as default};
