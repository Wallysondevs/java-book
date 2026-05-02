import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoBancoSimples() {
  return (
    <PageContainer title="Projeto: Sistema bancário OOP" subtitle="Praticar herança, polimorfismo e exceções num cenário familiar." difficulty="intermediario" timeToRead="30 min">
        <h2>Por que esse projeto?</h2><p>
          Banco é o cenário clássico pra exercitar OOP porque tem hierarquia natural (tipos de conta), regras diferentes por tipo (saque livre x rendimento), erros previsíveis (saldo insuficiente) e estado mutável que precisa de cuidado. É um terreno fértil pra abstrações.
        </p><h2>O que vamos modelar</h2><ul>
          <li>
            Classe abstrata <code>Conta</code> com <code>depositar</code>, <code>sacar</code> (abstrato), <code>transferir</code> e <code>extrato</code>
          </li><li>
            <code>ContaCorrente</code> — saque livre
          </li><li>
            <code>ContaPoupanca</code> — método extra <code>renderJuros</code>
          </li><li>
            <code>CartaoCredito</code> como hierarquia <strong>sealed</strong> (Java 17+): <code>Basico</code>, <code>Premium</code>, <code>Black</code>
          </li><li>
            <code>SaldoInsuficienteException</code> custom
          </li><li>
            <code>OperacaoBancariaService</code> orquestrando tudo
          </li>
        </ul><h2>1. Exceção customizada</h2><CodeBlock title="SaldoInsuficienteException.java" code={`package dev.voce.banco;

import java.math.BigDecimal;

public class SaldoInsuficienteException extends RuntimeException {
    public SaldoInsuficienteException(BigDecimal saldo, BigDecimal pedido) {
        super("Saldo " + saldo + " insuficiente pra sacar " + pedido);
    }
}`} /><h2>2. Movimentação como record</h2><CodeBlock title="Movimentacao.java" code={`package dev.voce.banco;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public enum TipoOp { DEPOSITO, SAQUE, TRANSFERENCIA, JUROS }

public record Movimentacao(LocalDateTime quando, BigDecimal valor, TipoOp tipo) {}`} /><h2>3. Classe abstrata Conta</h2><CodeBlock title="Conta.java" code={`package dev.voce.banco;

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
}`} /><h2>4. Implementações concretas</h2><CodeBlock title="ContaCorrente.java" code={`package dev.voce.banco;

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
}`} /><CodeBlock title="ContaPoupanca.java" code={`package dev.voce.banco;

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
}`} /><h2>5. Cartões com sealed (Java 17+)</h2><p>
          <code>sealed</code> diz: "essas são as únicas variações permitidas". Combina lindamente com switch exaustivo.
        </p><CodeBlock title="CartaoCredito.java" code={`package dev.voce.banco;

import java.math.BigDecimal;

public sealed interface CartaoCredito permits Basico, Premium, Black {
    BigDecimal limite();
}

public final class Basico  implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("1000");  } }
public final class Premium implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("10000"); } }
public final class Black   implements CartaoCredito { public BigDecimal limite() { return new BigDecimal("50000"); } }`} /><CodeBlock title="Switch exaustivo" code={`String descrever(CartaoCredito c) {
    return switch (c) {
        case Basico  b -> "Cartão básico, limite " + b.limite();
        case Premium p -> "Cartão premium, limite " + p.limite();
        case Black   k -> "Cartão BLACK, limite " + k.limite();
    };
}`} /><h2>6. Service orquestrador</h2><CodeBlock title="OperacaoBancariaService.java" code={`package dev.voce.banco;

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
}`} /><h2>7. Cenário concreto no main</h2><CodeBlock title="Main.java" code={`package dev.voce.banco;

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
}`} /><AlertBox type="warning" title="BigDecimal, sempre">
          Nunca use <code>double</code> pra dinheiro. <code>0.1 + 0.2</code> não dá <code>0.3</code> em ponto flutuante. <code>BigDecimal</code> é verboso, mas é o único caminho seguro.
        </AlertBox><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie uma <code>ContaInvestimento</code> com método <code>aplicar(BigDecimal valor, int meses)</code>que calcula juros compostos.
          </li><li>
            Adicione validação no <code>depositar</code> que rejeita valores negativos lançando<code>IllegalArgumentException</code>.
          </li><li>
            Use o <code>switch</code> sealed pra implementar <code>BigDecimal anuidade(CartaoCredito c)</code>retornando 0, 240 e 1200 conforme o tipo.
          </li>
        </ol>
      </PageContainer>
  );
}
