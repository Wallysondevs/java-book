import{j as e}from"./index-BpXci30S.js";import{P as s,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function c(){return e.jsxs(s,{title:"Encapsulamento",subtitle:"private, public, protected, package-private — esconda o que não deve aparecer.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Por que você precisa disso"}),e.jsxs("p",{children:["Imagine que você expõe o campo ",e.jsx("code",{children:"saldo"})," da sua ",e.jsx("code",{children:"ContaBancaria"})," como público. Aí, em qualquer canto do código, alguém escreve ",e.jsx("code",{children:"conta.saldo = -1000000"}),". Pronto: você nunca vai saber quem fez, nem por quê, nem como impedir. ",e.jsx("strong",{children:"Encapsulamento"})," é a prática de esconder o que é interno e expor só o que faz sentido — assim, mudanças internas não quebram quem usa sua classe, e regras de negócio ficam protegidas."]}),e.jsx("h2",{children:"A analogia do micro-ondas"}),e.jsx("p",{children:"Você usa o micro-ondas com botões e display. Não abre a tampa traseira pra mexer no magnetron. A interface pública é simples; a complexidade interna é privada. Bem feito, o fabricante pode trocar todo o circuito interno e você continua apertando os mesmos botões."}),e.jsx("h2",{children:"Os 4 modificadores de acesso"}),e.jsx("p",{children:"Java tem quatro níveis de visibilidade. Do mais restritivo para o mais aberto:"}),e.jsx("h3",{children:"private — só dentro da própria classe"}),e.jsx("p",{children:"Ninguém de fora vê nem mexe. Use para campos e métodos auxiliares que são detalhe de implementação."}),e.jsx("h3",{children:"package-private — sem modificador, só dentro do mesmo pacote"}),e.jsxs("p",{children:["Quando você não escreve nenhum modificador, é esse o padrão. Visível para classes do mesmo ",e.jsx("code",{children:"package"}),", invisível para o resto."]}),e.jsx("h3",{children:"protected — pacote + subclasses"}),e.jsx("p",{children:'Acessível dentro do mesmo pacote e também por classes filhas (mesmo em outros pacotes). Útil para expor "ganchos" para quem herda da sua classe.'}),e.jsx("h3",{children:"public — qualquer um, em qualquer lugar"}),e.jsx("p",{children:"Sem restrição. Use só quando faz parte da API que você pretende expor."}),e.jsx("h2",{children:"Tabela de visibilidade"}),e.jsx("p",{children:"Quem enxerga o quê:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"private"}),": própria classe ✅ — pacote ❌ — subclasse ❌ — mundo ❌"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"package-private"}),": própria classe ✅ — pacote ✅ — subclasse fora do pacote ❌ — mundo ❌"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"protected"}),": própria classe ✅ — pacote ✅ — subclasse ✅ — mundo ❌"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"public"}),": própria classe ✅ — pacote ✅ — subclasse ✅ — mundo ✅"]})]}),e.jsx("h2",{children:"Por que campos são quase sempre private"}),e.jsxs("p",{children:["A regra de bolso: ",e.jsx("strong",{children:"campos privados, métodos públicos"})," (quando precisar expor). Assim você controla como o estado é lido e modificado. Os métodos que fornecem esse acesso são chamados de ",e.jsx("strong",{children:"getters"})," (lêem) e ",e.jsx("strong",{children:"setters"})," (escrevem)."]}),e.jsx(a,{title:"ContaBancaria.java",code:`public class ContaBancaria {
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
}`}),e.jsxs("p",{children:["Note: não tem ",e.jsx("code",{children:"setSaldo"}),". O saldo só muda via ",e.jsx("code",{children:"depositar"})," (ou um ",e.jsx("code",{children:"sacar"}),' que você implemente). Isso é encapsulamento útil: a regra "saldo nunca diminui sem motivo" fica garantida pela classe.']}),e.jsx("h2",{children:"Validação no setter"}),e.jsx("p",{children:"Quando você precisa permitir alteração mas com regras, o setter é o lugar certo:"}),e.jsx(a,{title:"Pessoa.java",code:`public class Pessoa {
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
}`}),e.jsxs("p",{children:["Se algum dia você quiser permitir só idades pares, ou logar toda mudança, basta editar ",e.jsx("code",{children:"setIdade"}),". Quem usa a classe nem precisa saber."]}),e.jsx("h2",{children:"Geração automática na IDE"}),e.jsxs("p",{children:["Ninguém digita getter/setter à mão depois do segundo dia de Java. No IntelliJ: ",e.jsx("code",{children:"Alt+Insert"}),' → "Getter and Setter". No Eclipse: botão direito → "Source" → "Generate Getters and Setters". No VS Code: extensão "Java Extension Pack" oferece atalhos similares. Use sem culpa.']}),e.jsxs(o,{type:"tip",title:"Convenção de nomes",children:["Para campo ",e.jsx("code",{children:"nome"}),", getter é ",e.jsx("code",{children:"getNome()"})," e setter é ",e.jsx("code",{children:"setNome(String)"}),". Para ",e.jsx("code",{children:"boolean ativo"}),", o getter normalmente chama ",e.jsx("code",{children:"isAtivo()"}),". Frameworks (Spring, Jackson) dependem dessa convenção — fugir dela quebra mágica."]}),e.jsx("h2",{children:"Records: getters de graça (desde Java 14)"}),e.jsxs("p",{children:["Quando sua classe é só um pacote de dados imutáveis, escrever getter pra cada campo cansa. Records resolvem: você declara os campos, e o compilador gera construtor, getters (com nome igual ao campo), ",e.jsx("code",{children:"equals"}),", ",e.jsx("code",{children:"hashCode"})," e ",e.jsx("code",{children:"toString"}),"."]}),e.jsx(a,{title:"Ponto.java — record",code:`public record Ponto(int x, int y) { }

// Uso:
Ponto p = new Ponto(3, 4);
System.out.println(p.x()); // 3 — getter chamado x(), não getX()
System.out.println(p.y()); // 4
System.out.println(p);     // Ponto[x=3, y=4]`}),e.jsxs("p",{children:["Records são ",e.jsx("strong",{children:"imutáveis"}),": não tem setter, os campos são ",e.jsx("code",{children:"final"})," automaticamente. Use quando seus dados não precisam mudar depois de criados — DTOs, value objects, retornos de API, etc."]}),e.jsx(o,{type:"info",title:"Quando NÃO usar record",children:"Se sua classe tem comportamento complexo, herança, ou precisa mudar de estado, use classe normal. Record é para dados, não para entidades de domínio com regras pesadas."}),e.jsx("h2",{children:"protected na vida real"}),e.jsxs("p",{children:["Você vai usar ",e.jsx("code",{children:"protected"})," menos do que imagina. É comum em frameworks que oferecem classes-base para você estender. No seu código de aplicação, prefira ",e.jsx("code",{children:"private"})," e exponha só o estritamente necessário."]}),e.jsx(a,{title:"Uso típico de protected",code:`public abstract class TarefaAgendada {
    protected void log(String msg) {
        System.out.println("[" + System.currentTimeMillis() + "] " + msg);
    }

    public abstract void executar();
}

public class BackupDiario extends TarefaAgendada {
    public void executar() {
        log("Iniciando backup..."); // pode chamar porque é protected
    }
}`}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Refatore ",e.jsx("code",{children:"ContaBancaria"}),": torne ",e.jsx("code",{children:"saldo"})," e ",e.jsx("code",{children:"titular"})," privados, exponha ",e.jsx("code",{children:"getSaldo"})," e ",e.jsx("code",{children:"getTitular"}),", e adicione o método ",e.jsx("code",{children:"sacar(double valor)"})," que só permite saque se ",e.jsx("code",{children:"valor > 0"})," e ",e.jsx("code",{children:"valor <= saldo"}),"."]}),e.jsxs("li",{children:["Crie um ",e.jsx("code",{children:"record Endereco(String rua, String cidade, String cep)"}),". Instancie um e tente alterar ",e.jsx("code",{children:"rua"})," depois — observe o erro de compilação."]}),e.jsxs("li",{children:["Faça uma classe ",e.jsx("code",{children:"Senha"})," com campo ",e.jsx("code",{children:"private String valor"})," e setter que recusa valores com menos de 8 caracteres, lançando ",e.jsx("code",{children:"IllegalArgumentException"}),". Teste com uma senha curta e uma longa."]})]})]})}export{c as default};
