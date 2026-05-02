import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoChat() {
  return (
    <PageContainer title="Projeto: Chat com Threads" subtitle="Servidor TCP multi-cliente — coloque concorrência em prática." difficulty="avancado" timeToRead="35 min">
        <h2>Por que esse projeto?</h2><p>
          Construir um chat te força a lidar com sockets, IO bloqueante, múltiplas threads, estado compartilhado e desconexões inesperadas — exatamente as coisas que travam quem nunca saiu do "Hello World" de concorrência. E em Java 21 ficou divertido: <strong>Virtual Threads</strong> deixam o código simples como single-thread, mas escalável pra milhares de conexões.
        </p><h2>Arquitetura</h2><ul>
          <li>
            Servidor abre <code>ServerSocket(porta)</code> e fica em loop chamando <code>accept()</code>
          </li><li>
            Cada conexão entra numa <strong>Virtual Thread</strong> (<code>Thread.startVirtualThread</code>)
          </li><li>
            Lista de saídas (<code>PrintWriter</code>) é compartilhada usando <code>CopyOnWriteArrayList</code>
          </li><li>
            Protocolo simples em texto: <code>/join nome</code> identifica o cliente; resto é mensagem comum
          </li>
        </ul><h2>1. Servidor</h2><CodeBlock title="ChatServer.java" code={`package dev.voce.chat;

import java.io.*;
import java.net.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class ChatServer {
    private static final int PORTA = 9999;
    private static final CopyOnWriteArrayList<PrintWriter> saidas = new CopyOnWriteArrayList<>();

    public static void main(String[] args) throws IOException {
        try (var server = new ServerSocket(PORTA)) {
            System.out.println("Chat ouvindo em " + PORTA);

            Runtime.getRuntime().addShutdownHook(new Thread(() ->
                System.out.println("Encerrando, " + saidas.size() + " conexões abertas")));

            while (true) {
                var socket = server.accept();
                Thread.startVirtualThread(() -> atender(socket));
            }
        }
    }

    private static void atender(Socket socket) {
        String nome = "anon";
        try (socket;
             var in  = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             var out = new PrintWriter(socket.getOutputStream(), true)) {

            saidas.add(out);
            out.println("bem-vindo! use /join <nome>");

            String linha;
            while ((linha = in.readLine()) != null) {
                if (linha.startsWith("/join ")) {
                    nome = linha.substring(6).trim();
                    broadcast("* " + nome + " entrou", null);
                } else {
                    broadcast(nome + ": " + linha, out);
                }
            }
        } catch (IOException e) {
            System.err.println("conexão caiu: " + e.getMessage());
        } finally {
            broadcast("* " + nome + " saiu", null);
        }
    }

    private static void broadcast(String msg, PrintWriter exceto) {
        for (var w : saidas) {
            if (w != exceto) w.println(msg);
        }
    }
}`} /><AlertBox type="info" title="Virtual Threads em 1 frase">
          São threads gerenciadas pela JVM, custo de KB cada (não MB), perfeitas pra IO bloqueante.<code>{"Thread.startVirtualThread(() -> ...)"}</code> e pronto. Disponível desde Java 21.
        </AlertBox><h2>2. Cliente</h2><CodeBlock title="ChatClient.java" code={`package dev.voce.chat;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class ChatClient {
    public static void main(String[] args) throws IOException {
        var host = args.length > 0 ? args[0] : "localhost";
        try (var socket = new Socket(host, 9999);
             var in  = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             var out = new PrintWriter(socket.getOutputStream(), true);
             var teclado = new Scanner(System.in)) {

            // thread leitora: imprime tudo que chega do servidor
            Thread.startVirtualThread(() -> {
                try {
                    String linha;
                    while ((linha = in.readLine()) != null) {
                        System.out.println(linha);
                    }
                } catch (IOException ignored) {}
            });

            // thread principal: lê do teclado e envia
            while (teclado.hasNextLine()) {
                out.println(teclado.nextLine());
            }
        }
    }
}`} /><h2>3. Testando</h2><CodeBlock code={`# terminal 1
java dev.voce.chat.ChatServer

# terminal 2
java dev.voce.chat.ChatClient
/join maria
oi pessoal

# terminal 3 (em paralelo)
java dev.voce.chat.ChatClient
/join joao
salve maria!`} /><h2>
          Por que <code>CopyOnWriteArrayList</code>?
        </h2><p>
          Um <code>ArrayList</code> normal quebraria quando uma thread itera (broadcast) e outra adiciona (nova conexão). Você poderia usar <code>synchronized</code> em volta, mas a cópia-na-escrita é mais simples: leituras nunca travam, escritas duplicam o array. Perfeito quando há muito mais broadcast do que conexão nova.
        </p><h2>Tratando desconexões</h2><p>
          Quando um cliente cai, <code>readLine()</code> lança <code>IOException</code> ou retorna<code>null</code>. O bloco <code>finally</code> garante que avisamos os outros e deixamos o socket fechar (try-with-resources). Sem isso, a lista <code>saidas</code> cresce com zumbis e o broadcast começa a estourar.
        </p><AlertBox type="warning" title="Cuidado com escrita concorrente no PrintWriter">
          Se duas threads chamarem <code>out.println</code> no mesmo writer, as linhas podem se misturar. Como cada cliente tem o seu próprio writer e só a thread atendente escreve nele, está ok. Quando um broadcast envia pra todos, cada chamada <code>println</code> é atômica internamente — então também ok.
        </AlertBox><h2>Melhorias propostas</h2><ul>
          <li>
            <strong>Salas (rooms):</strong> <code>/join sala1 nome</code> e broadcast só pra mesma sala
          </li><li>
            <strong>Histórico:</strong> persistir últimas N mensagens em arquivo, enviar pro cliente que entra
          </li><li>
            <strong>Protocolo JSON:</strong> trocar texto puro por <code>{"{\"tipo\":\"msg\",\"autor\":\"x\",\"texto\":\"y\"}"}</code> usando Jackson
          </li><li>
            <strong>Comandos extras:</strong> <code>/who</code>, <code>/whisper</code>, <code>/quit</code>
          </li><li>
            <strong>TLS:</strong> trocar <code>ServerSocket</code> por <code>SSLServerSocket</code> pra criptografar
          </li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Implemente <code>/who</code> que devolve só pro cliente que pediu a lista de nomes conectados. Dica: troque <code>
              {"CopyOnWriteArrayList<PrintWriter>"}
            </code> por<code>
              {"ConcurrentHashMap<String, PrintWriter>"}
            </code>.
          </li><li>
            Persista as últimas 50 mensagens num arquivo <code>chat.log</code> e envie pro cliente quando ele faz <code>/join</code>.
          </li><li>
            Faça um teste de carga: abra 1000 clientes simultâneos com Virtual Threads e meça uso de memória. Compare com <code>Executors.newCachedThreadPool</code>.
          </li>
        </ol>
      </PageContainer>
  );
}
