import{j as e}from"./index-BpXci30S.js";import{P as i,A as o}from"./AlertBox-CmRzTA0W.js";import{C as a}from"./CodeBlock-CuSzYSd8.js";function l(){return e.jsxs(i,{title:"Projeto: Sistema bancário OOP",subtitle:"Praticar herança, polimorfismo e exceções num cenário familiar.",difficulty:"intermediario",timeToRead:"30 min",children:[e.jsx("h2",{children:"Por que esse projeto?"}),e.jsx("p",{children:"Banco é o cenário clássico pra exercitar OOP porque tem hierarquia natural (tipos de conta), regras diferentes por tipo (saque livre x rendimento), erros previsíveis (saldo insuficiente) e estado mutável que precisa de cuidado. É um terreno fértil pra abstrações."}),e.jsx("h2",{children:"O que vamos modelar"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Classe abstrata ",e.jsx("code",{children:"Conta"})," com ",e.jsx("code",{children:"depositar"}),", ",e.jsx("code",{children:"sacar"})," (abstrato), ",e.jsx("code",{children:"transferir"})," e ",e.jsx("code",{children:"extrato"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"ContaCorrente"})," — saque livre"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ContaPoupanca"})," — método extra ",e.jsx("code",{children:"renderJuros"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"CartaoCredito"})," como hierarquia ",e.jsx("strong",{children:"sealed"})," (Java 17+): ",e.jsx("code",{children:"Basico"}),", ",e.jsx("code",{children:"Premium"}),", ",e.jsx("code",{children:"Black"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"SaldoInsuficienteException"})," custom"]}),e.jsxs("li",{children:[e.jsx("code",{children:"OperacaoBancariaService"})," orquestrando tudo"]})]}),e.jsx("h2",{children:"1. Exceção customizada"}),e.jsx(a,{title:"SaldoInsuficienteException.java",code:`package dev.voce.banco;

import java.math.BigDecimal;

public class SaldoInsuficienteException extends RuntimeException {
    public SaldoInsuficienteException(BigDecimal saldo, BigDecimal pedido) {
        super("Saldo " + saldo + " insuficiente pra sacar " + pedido);
    }
}`}),e.jsx("h2",{children:"2. Movimentação como record"}),e.jsx(a,{title:"Movimentacao.java",code:`package dev.voce.banco;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public enum TipoOp { DEPOSITO, SAQUE, TRANSFERENCIA, JUROS }

public record Movimentacao(LocalDateTime quando, BigDecimal valor, TipoOp tipo) {}`}),e.jsx("h2",{children:"3. Classe abstrata Conta"}),e.jsx(a,{title:"Conta.java",code:`package dev.voce.banco;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public abstract class Conta {
    protected final String titular;
    protected BigDecimal saldo = BigDecimal.ZERO;
    protected final List<Movimentacao> historico = new ArrayList<>();

    protected Conta(String titular) { this.titular = titular; }

    public void depositar(BigDecimal valor) {
        saldo = saldo.add(valor);
        historico.add(new Movimentacao(LocalDateTime.now(), valor, TipoOp.DEPOSITO));
    }

    public abstract void sacar(BigDecimal valor);

    public void transferir(BigDecimal valor, Conta destino) {
        sacar(valor);
        destino.depositar(valor);
        historico.add(new Movimentacao(LocalDateTime.now(), valor, TipoOp.TRANSFERENCIA));
    }

    public void extrato() {
        System.out.println("=== Extrato de " + titular + " ===");
        historico.forEach(m -> System.out.printf("%s  %-15s  R$ %s%n", m.quando(), m.tipo(), m.valor()));
        System.out.println("Saldo atual: R$ " + saldo);
    }

    public BigDecimal saldo() { return saldo; }
}`}),e.jsx("h2",{children:"4. Implementações concretas"}),e.jsx(a,{title:"ContaCorrente.java",code:`package dev.voce.banco;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ContaCorrente extends Conta {
    public ContaCorrente(String titular) { super(titular); }

    @Override
    public void sacar(BigDecimal valor) {
        if (saldo.compareTo(valor) < 0) throw new SaldoInsuficienteException(saldo, valor);
        saldo = saldo.subtract(valor);
        historico.add(new Movimentacao(LocalDateTime.now(), valor, TipoOp.SAQUE));
    }
}`}),e.jsx(a,{title:"ContaPoupanca.java",code:`package dev.voce.banco;

import java.math.*;
import java.time.LocalDateTime;

public class ContaPoupanca extends Conta {
    private static final BigDecimal TAXA = new BigDecimal("0.005"); // 0.5% ao mês

    public ContaPoupanca(String titular) { super(titular); }

    @Override
    public void sacar(BigDecimal valor) {
        if (saldo.compareTo(valor) < 0) throw new SaldoInsuficienteException(saldo, valor);
        saldo = saldo.subtract(valor);
        historico.add(new Movimentacao(LocalDateTime.now(), valor, TipoOp.SAQUE));
    }

    public void renderJuros() {
        var juros = saldo.multiply(TAXA).setScale(2, RoundingMode.HALF_UP);
        saldo = saldo.add(juros);
        historico.add(new Movimentacao(LocalDateTime.now(), juros, TipoOp.JUROS));
    }
}`}),e.jsx("h2",{children:"5. Cartões com sealed (Java 17+)"}),e.jsxs("p",{children:[e.jsx("code",{children:"sealed"}),' diz: "essas são as únicas variações permitidas". Combina lindamente com switch exaustivo.']}),e.jsx(a,{title:"CartaoCredito.java",code:`package dev.voce.banco;

import java.math.BigDecimal;

public sealed interface CartaoCredito permits Basico, Premium, Black {
    BigDecimal limite();
}

public final class Basico  implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("1000");  } }
public final class Premium implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("10000"); } }
public final class Black   implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("50000"); } }`}),e.jsx(a,{title:"Switch exaustivo",code:`String descrever(CartaoCredito c) {
    return switch (c) {
        case Basico  b -> "Cartão básico, limite " + b.limite();
        case Premium p -> "Cartão premium, limite " + p.limite();
        case Black   k -> "Cartão BLACK, limite " + k.limite();
    };
}`}),e.jsx("h2",{children:"6. Service orquestrador"}),e.jsx(a,{title:"OperacaoBancariaService.java",code:`package dev.voce.banco;

import java.math.BigDecimal;

public class OperacaoBancariaService {
    public void transferenciaSegura(Conta de, Conta para, BigDecimal valor) {
        try {
            de.transferir(valor, para);
            System.out.println("✓ transferência ok");
        } catch (SaldoInsuficienteException e) {
            System.err.println("✗ " + e.getMessage());
        }
    }
}`}),e.jsx("h2",{children:"7. Cenário concreto no main"}),e.jsx(a,{title:"Main.java",code:`package dev.voce.banco;

import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        var maria = new ContaCorrente("Maria");
        var joao  = new ContaPoupanca("João");

        maria.depositar(new BigDecimal("500"));
        joao.depositar(new BigDecimal("1000"));

        var ops = new OperacaoBancariaService();
        ops.transferenciaSegura(maria, joao, new BigDecimal("200"));
        ops.transferenciaSegura(maria, joao, new BigDecimal("9999")); // vai falhar

        joao.renderJuros();
        joao.extrato();

        CartaoCredito c = new Premium();
        System.out.println(new Object() {
            String d(CartaoCredito x) {
                return switch (x) {
                    case Basico b  -> "BASIC  " + b.limite();
                    case Premium p -> "PREM   " + p.limite();
                    case Black k   -> "BLACK  " + k.limite();
                };
            }
        }.d(c));
    }
}`}),e.jsxs(o,{type:"warning",title:"BigDecimal, sempre",children:["Nunca use ",e.jsx("code",{children:"double"})," pra dinheiro. ",e.jsx("code",{children:"0.1 + 0.2"})," não dá ",e.jsx("code",{children:"0.3"})," em ponto flutuante. ",e.jsx("code",{children:"BigDecimal"})," é verboso, mas é o único caminho seguro."]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie uma ",e.jsx("code",{children:"ContaInvestimento"})," com método ",e.jsx("code",{children:"aplicar(BigDecimal valor, int meses)"}),"que calcula juros compostos."]}),e.jsxs("li",{children:["Adicione validação no ",e.jsx("code",{children:"depositar"})," que rejeita valores negativos lançando",e.jsx("code",{children:"IllegalArgumentException"}),"."]}),e.jsxs("li",{children:["Use o ",e.jsx("code",{children:"switch"})," sealed pra implementar ",e.jsx("code",{children:"BigDecimal anuidade(CartaoCredito c)"}),"retornando 0, 240 e 1200 conforme o tipo."]})]})]})}export{l as default};
