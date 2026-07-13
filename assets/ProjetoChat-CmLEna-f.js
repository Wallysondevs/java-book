import{j as e}from"./index-BpXci30S.js";import{P as t,A as a}from"./AlertBox-CmRzTA0W.js";import{C as r}from"./CodeBlock-CuSzYSd8.js";function n(){return e.jsxs(t,{title:"Projeto: Chat com Threads",subtitle:"Servidor TCP multi-cliente — coloque concorrência em prática.",difficulty:"avancado",timeToRead:"35 min",children:[e.jsx("h2",{children:"Por que esse projeto?"}),e.jsxs("p",{children:['Construir um chat te força a lidar com sockets, IO bloqueante, múltiplas threads, estado compartilhado e desconexões inesperadas — exatamente as coisas que travam quem nunca saiu do "Hello World" de concorrência. E em Java 21 ficou divertido: ',e.jsx("strong",{children:"Virtual Threads"})," deixam o código simples como single-thread, mas escalável pra milhares de conexões."]}),e.jsx("h2",{children:"Arquitetura"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Servidor abre ",e.jsx("code",{children:"ServerSocket(porta)"})," e fica em loop chamando ",e.jsx("code",{children:"accept()"})]}),e.jsxs("li",{children:["Cada conexão entra numa ",e.jsx("strong",{children:"Virtual Thread"})," (",e.jsx("code",{children:"Thread.startVirtualThread"}),")"]}),e.jsxs("li",{children:["Lista de saídas (",e.jsx("code",{children:"PrintWriter"}),") é compartilhada usando ",e.jsx("code",{children:"CopyOnWriteArrayList"})]}),e.jsxs("li",{children:["Protocolo simples em texto: ",e.jsx("code",{children:"/join nome"})," identifica o cliente; resto é mensagem comum"]})]}),e.jsx("h2",{children:"1. Servidor"}),e.jsx(r,{title:"ChatServer.java",code:`package dev.voce.chat;

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
}`}),e.jsxs(a,{type:"info",title:"Virtual Threads em 1 frase",children:["São threads gerenciadas pela JVM, custo de KB cada (não MB), perfeitas pra IO bloqueante.",e.jsx("code",{children:"Thread.startVirtualThread(() -> ...)"})," e pronto. Disponível desde Java 21."]}),e.jsx("h2",{children:"2. Cliente"}),e.jsx(r,{title:"ChatClient.java",code:`package dev.voce.chat;

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
}`}),e.jsx("h2",{children:"3. Testando"}),e.jsx(r,{code:`# terminal 1
java dev.voce.chat.ChatServer

# terminal 2
java dev.voce.chat.ChatClient
/join maria
oi pessoal

# terminal 3 (em paralelo)
java dev.voce.chat.ChatClient
/join joao
salve maria!`}),e.jsxs("h2",{children:["Por que ",e.jsx("code",{children:"CopyOnWriteArrayList"}),"?"]}),e.jsxs("p",{children:["Um ",e.jsx("code",{children:"ArrayList"})," normal quebraria quando uma thread itera (broadcast) e outra adiciona (nova conexão). Você poderia usar ",e.jsx("code",{children:"synchronized"})," em volta, mas a cópia-na-escrita é mais simples: leituras nunca travam, escritas duplicam o array. Perfeito quando há muito mais broadcast do que conexão nova."]}),e.jsx("h2",{children:"Tratando desconexões"}),e.jsxs("p",{children:["Quando um cliente cai, ",e.jsx("code",{children:"readLine()"})," lança ",e.jsx("code",{children:"IOException"})," ou retorna",e.jsx("code",{children:"null"}),". O bloco ",e.jsx("code",{children:"finally"})," garante que avisamos os outros e deixamos o socket fechar (try-with-resources). Sem isso, a lista ",e.jsx("code",{children:"saidas"})," cresce com zumbis e o broadcast começa a estourar."]}),e.jsxs(a,{type:"warning",title:"Cuidado com escrita concorrente no PrintWriter",children:["Se duas threads chamarem ",e.jsx("code",{children:"out.println"})," no mesmo writer, as linhas podem se misturar. Como cada cliente tem o seu próprio writer e só a thread atendente escreve nele, está ok. Quando um broadcast envia pra todos, cada chamada ",e.jsx("code",{children:"println"})," é atômica internamente — então também ok."]}),e.jsx("h2",{children:"Melhorias propostas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Salas (rooms):"})," ",e.jsx("code",{children:"/join sala1 nome"})," e broadcast só pra mesma sala"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Histórico:"})," persistir últimas N mensagens em arquivo, enviar pro cliente que entra"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Protocolo JSON:"})," trocar texto puro por ",e.jsx("code",{children:'{"tipo":"msg","autor":"x","texto":"y"}'})," usando Jackson"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comandos extras:"})," ",e.jsx("code",{children:"/who"}),", ",e.jsx("code",{children:"/whisper"}),", ",e.jsx("code",{children:"/quit"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TLS:"})," trocar ",e.jsx("code",{children:"ServerSocket"})," por ",e.jsx("code",{children:"SSLServerSocket"})," pra criptografar"]})]}),e.jsx("h2",{children:"🎯 Mãos à massa"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"/who"})," que devolve só pro cliente que pediu a lista de nomes conectados. Dica: troque ",e.jsx("code",{children:"CopyOnWriteArrayList<PrintWriter>"})," por",e.jsx("code",{children:"ConcurrentHashMap<String, PrintWriter>"}),"."]}),e.jsxs("li",{children:["Persista as últimas 50 mensagens num arquivo ",e.jsx("code",{children:"chat.log"})," e envie pro cliente quando ele faz ",e.jsx("code",{children:"/join"}),"."]}),e.jsxs("li",{children:["Faça um teste de carga: abra 1000 clientes simultâneos com Virtual Threads e meça uso de memória. Compare com ",e.jsx("code",{children:"Executors.newCachedThreadPool"}),"."]})]})]})}export{n as default};
