import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamTable } from "@/components/ui/ParamTable";

export default function Excecoes() {
  return (
    <PageContainer
      title="Exceções e Erros"
      subtitle="try/catch/finally, checked vs unchecked exceptions, try-with-resources e criando exceções personalizadas."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Exceções são eventos que interrompem o fluxo normal de um programa. Java usa um sistema robusto
        de exceções com hierarquia de classes para representar diferentes tipos de erros.
      </p>

      <h2>1. Hierarquia de Exceções</h2>
      <CodeBlock
        language="java"
        code={`// Throwable
// ├── Error                   (erros da JVM — não pegue!)
// │   ├── OutOfMemoryError
// │   └── StackOverflowError
// └── Exception
//     ├── RuntimeException    (Unchecked — compilador não exige try/catch)
//     │   ├── NullPointerException
//     │   ├── ArrayIndexOutOfBoundsException
//     │   ├── ClassCastException
//     │   ├── IllegalArgumentException
//     │   └── NumberFormatException
//     └── IOException         (Checked — compilador EXIGE tratamento)
//         ├── FileNotFoundException
//         └── ParseException`}
      />

      <h2>2. try / catch / finally</h2>
      <CodeBlock
        language="java"
        code={`public static int dividir(int a, int b) {
    try {
        return a / b;
    } catch (ArithmeticException e) {
        System.out.println("Erro: " + e.getMessage()); // "/ by zero"
        return 0;
    } finally {
        System.out.println("Sempre executa — mesmo com exceção ou return!");
    }
}

// Múltiplos catch
public static void lerArquivo(String caminho) {
    try {
        FileReader reader = new FileReader(caminho);
        // ...
    } catch (FileNotFoundException e) {
        System.out.println("Arquivo não encontrado: " + caminho);
    } catch (IOException e) {
        System.out.println("Erro de leitura: " + e.getMessage());
    } finally {
        System.out.println("Operação de leitura concluída");
    }
}

// Multi-catch (Java 7+) — para exceções com tratamento idêntico
try {
    // código perigoso
} catch (FileNotFoundException | SocketException e) {
    System.out.println("Erro de I/O: " + e.getMessage());
}`}
      />

      <h2>3. throws — Declarando Exceções</h2>
      <CodeBlock
        language="java"
        code={`// throws informa que o método pode lançar exceções checked
public void lerArquivo(String caminho) throws IOException {
    FileReader reader = new FileReader(caminho); // pode lançar FileNotFoundException
    // ...
}

// Quem chama DEVE tratar ou propagar
public void processar() throws IOException {
    lerArquivo("/dados/config.txt"); // propaga a exceção
}

// throw — lança uma exceção
public static double calcularRaiz(double n) {
    if (n < 0) {
        throw new IllegalArgumentException("Não é possível calcular raiz de negativo: " + n);
    }
    return Math.sqrt(n);
}`}
      />

      <h2>4. try-with-resources (Java 7+)</h2>
      <CodeBlock
        language="java"
        code={`// Recursos AutoCloseable são fechados automaticamente (sem finally manual!)
import java.io.*;

// Sem try-with-resources (verboso e propenso a erros)
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("arquivo.txt"));
    String linha = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try { reader.close(); } catch (IOException e) { e.printStackTrace(); }
    }
}

// COM try-with-resources (limpo e seguro!)
try (BufferedReader reader2 = new BufferedReader(new FileReader("arquivo.txt"))) {
    String linha = reader2.readLine();
    System.out.println(linha);
} catch (IOException e) {
    System.out.println("Erro: " + e.getMessage());
}
// reader2 é fechado automaticamente ao sair do bloco try

// Múltiplos recursos
try (
    var conn = dataSource.getConnection();
    var stmt = conn.createStatement()
) {
    var rs = stmt.executeQuery("SELECT * FROM usuarios");
    // ambos conn e stmt fechados automaticamente
}`}
      />

      <h2>5. Criando Exceções Personalizadas</h2>
      <CodeBlock
        language="java"
        code={`// Exceção checked (extends Exception)
public class SaldoInsuficienteException extends Exception {
    private final double saldoAtual;
    private final double valorSolicitado;

    public SaldoInsuficienteException(double saldoAtual, double valorSolicitado) {
        super(String.format("Saldo insuficiente: disponível R$%.2f, solicitado R$%.2f",
            saldoAtual, valorSolicitado));
        this.saldoAtual = saldoAtual;
        this.valorSolicitado = valorSolicitado;
    }

    public double getSaldoAtual() { return saldoAtual; }
    public double getValorSolicitado() { return valorSolicitado; }
}

// Exceção unchecked (extends RuntimeException)
public class UsuarioNaoEncontradoException extends RuntimeException {
    public UsuarioNaoEncontradoException(long id) {
        super("Usuário não encontrado com ID: " + id);
    }
}

// Usando
public void sacar(double valor) throws SaldoInsuficienteException {
    if (valor > saldo) {
        throw new SaldoInsuficienteException(saldo, valor);
    }
    saldo -= valor;
}`}
      />

      <ParamTable
        comando="Exceções Comuns do Java"
        descricaoHelp="As exceções mais frequentes no dia a dia — saiba o que cada uma significa."
        params={[
          { flag: "NullPointerException", descricao: "Tentativa de usar uma referência null. Verifique sempre antes de usar objetos.", exemplo: "String s = null; s.length();" },
          { flag: "ArrayIndexOutOfBoundsException", descricao: "Acesso a índice inválido de array (< 0 ou >= length).", exemplo: "int[] a = {1}; a[5];" },
          { flag: "ClassCastException", descricao: "Conversão inválida de tipo. Use instanceof antes de fazer cast.", exemplo: "(String) new Integer(1);" },
          { flag: "IllegalArgumentException", descricao: "Argumento inválido passado para um método. Lança-a para validar entradas.", exemplo: "throw new IllegalArgumentException(\"msg\");" },
          { flag: "IllegalStateException", descricao: "O objeto está em estado inválido para a operação.", exemplo: "lista.next() sem elemento;" },
          { flag: "NumberFormatException", descricao: "String não pode ser convertida para número.", exemplo: "Integer.parseInt(\"abc\");" },
          { flag: "StackOverflowError", descricao: "Recursão infinita esgotou a pilha de chamadas.", exemplo: "método que chama a si mesmo sem caso base" },
          { flag: "OutOfMemoryError", descricao: "Memória da JVM esgotada. Aumente heap com -Xmx ou corrija memory leak.", exemplo: "criar objetos infinitamente" },
          { flag: "IOException", descricao: "Erro de entrada/saída (checked). Deve ser tratada ou declarada com throws.", exemplo: "FileReader em arquivo inexistente" },
          { flag: "FileNotFoundException", descricao: "Arquivo especificado não existe (subclasse de IOException).", exemplo: "new FileReader(\"/caminho/errado\");" },
        ]}
      />
    </PageContainer>
  );
}
