import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function I18n() {
  return (
    <PageContainer title="Internacionalização (i18n)" subtitle="Mensagens em vários idiomas, formatos de data/moeda — uma vez, com elegância." difficulty="intermediario" timeToRead="18 min">
        <h2>POR QUE você precisa disso</h2><p>
          Hoje sua app é "só pra Brasil". Amanhã o cliente fecha um contrato em Portugal, depois nos Estados Unidos. Se você espalhou <code>"R$ " + valor</code> e mensagens em PT por todo o código, vai sofrer pra reescrever. Internacionalização (i18n) é a prática de<strong>extrair tudo o que muda por idioma/região</strong> pra arquivos externos. Feita no início, custa quase nada. Feita depois, vira refactor gigante.
        </p><h2>
          <code>Locale</code>: identidade da região
        </h2><p>
          Um <code>Locale</code> combina idioma + país (e às vezes variante). Ele é o argumento que você passa pra praticamente toda API de formatação.
        </p><CodeBlock title="Criando Locales" code={`import java.util.Locale;

Locale ptBR = Locale.forLanguageTag("pt-BR");   // jeito moderno (Java 7+)
Locale us = Locale.US;                          // constantes prontas
Locale defaultLoc = Locale.getDefault();        // o do sistema operacional

System.out.println(ptBR.getDisplayName(Locale.ENGLISH)); // Portuguese (Brazil)`} /><AlertBox type="note" title="Construtor de Locale está deprecated em Java 19+">
          <p>
            O velho <code>new Locale("pt", "BR")</code> ainda compila mas foi marcado como deprecated. Use <code>Locale.of("pt", "BR")</code> ou <code>Locale.forLanguageTag("pt-BR")</code>.
          </p>
        </AlertBox><h2>
          <code>ResourceBundle</code>: mensagens externalizadas
        </h2><p>
          A ideia é simples: você cria arquivos <code>.properties</code> com chave=valor, um por idioma, e o Java escolhe o certo conforme o <code>Locale</code>.
        </p><CodeBlock title="messages.properties (default — fallback)" code={`saudacao=Hello, {0}!
boasVindas=Welcome
carrinho.total=Total: {0,number,currency}`} /><CodeBlock title="messages_pt_BR.properties" code={`saudacao=Olá, {0}!
boasVindas=Bem-vindo
carrinho.total=Total: {0,number,currency}`} /><CodeBlock title="messages_en.properties" code={`saudacao=Hi, {0}!
boasVindas=Welcome aboard`} /><CodeBlock title="Lendo no código" code={`import java.util.*;
import java.text.MessageFormat;

ResourceBundle b = ResourceBundle.getBundle("messages", Locale.forLanguageTag("pt-BR"));
String tpl = b.getString("saudacao");
System.out.println(MessageFormat.format(tpl, "Ana")); // Olá, Ana!`} /><h2>Cadeia de fallback</h2><p>
          Quando você pede <code>messages</code> com locale <code>pt_BR</code>, o Java tenta nesta ordem:
        </p><ol>
          <li>
            <code>messages_pt_BR.properties</code>
          </li><li>
            <code>messages_pt.properties</code>
          </li><li>
            <code>
              {"messages_<locale do sistema>.properties"}
            </code>
          </li><li>
            <code>messages.properties</code> (o default, sem sufixo)
          </li>
        </ol><p>
          Por isso você normalmente deixa o <code>messages.properties</code> em inglês como rede de segurança — qualquer chave faltando em outro idioma cai nele em vez de explodir<code>MissingResourceException</code>.
        </p><h2>
          <code>MessageFormat</code>: parâmetros tipados
        </h2><p>
          Os <code>{"{0}"}</code>, <code>{"{1}"}</code> são placeholders. Mas a mágica é que você pode especificar <em>tipo</em> e <em>estilo</em>: número, moeda, data, escolha condicional.
        </p><CodeBlock title="Exemplos de placeholders" code={`String tpl = "Você tem {0,number,integer} pontos e gastou {1,number,currency} hoje, {2,date,long}.";
String r = MessageFormat.format(tpl, 1234, 89.5, new java.util.Date());
// pt-BR: "Você tem 1.234 pontos e gastou R$ 89,50 hoje, 6 de novembro de 2025."`} /><p>
          E pra plurais (1 item / 2 itens / 0 itens), use <code>ChoiceFormat</code>:
        </p><CodeBlock code={`String tpl = "{0,choice,0#nenhum item|1#1 item|1<{0,number,integer} itens}";
System.out.println(MessageFormat.format(tpl, 0));   // nenhum item
System.out.println(MessageFormat.format(tpl, 1));   // 1 item
System.out.println(MessageFormat.format(tpl, 42));  // 42 itens`} /><h2>Números, moedas e percentuais</h2><CodeBlock title="NumberFormat por locale" code={`import java.text.NumberFormat;

NumberFormat brl = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"));
NumberFormat usd = NumberFormat.getCurrencyInstance(Locale.US);

System.out.println(brl.format(1234.5));  // R$ 1.234,50
System.out.println(usd.format(1234.5));  // $1,234.50

NumberFormat pct = NumberFormat.getPercentInstance(Locale.forLanguageTag("pt-BR"));
System.out.println(pct.format(0.235));   // 23%  (use setMaximumFractionDigits pra mais casas)`} /><h2>
          Datas com <code>DateTimeFormatter</code>
        </h2><CodeBlock title="API moderna (java.time)" code={`import java.time.*;
import java.time.format.*;

LocalDate hoje = LocalDate.now();

var ptLong = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG)
        .withLocale(Locale.forLanguageTag("pt-BR"));
var enLong = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG)
        .withLocale(Locale.US);

System.out.println(hoje.format(ptLong)); // 6 de novembro de 2025
System.out.println(hoje.format(enLong)); // November 6, 2025`} /><p>
          <code>FormatStyle</code> tem <code>SHORT</code>, <code>MEDIUM</code>, <code>LONG</code>,<code>FULL</code>. Sempre prefira <em>localizado</em> a uma máscara fixa tipo<code>"dd/MM/yyyy"</code> — a máscara não respeita convenção da região.
        </p><h2>
          Spring: <code>MessageSource</code>
        </h2><p>
          O Spring embrulha <code>ResourceBundle</code> num bean injetável. Você configura uma vez e injeta em qualquer service/controller.
        </p><CodeBlock title="Bean de MessageSource" code={`@Bean
public MessageSource messageSource() {
    var ms = new ReloadableResourceBundleMessageSource();
    ms.setBasename("classpath:messages");
    ms.setDefaultEncoding("UTF-8");
    ms.setCacheSeconds(60);
    return ms;
}

// Uso no controller:
@Autowired MessageSource msgs;

public String saudar(String nome, Locale locale) {
    return msgs.getMessage("saudacao", new Object[]{ nome }, locale);
}`} /><p>
          Em Spring MVC, o <code>LocaleResolver</code> escolhe o locale por header <code>Accept-Language</code>, cookie ou sessão.
        </p><h2>
          Encoding: UTF-8 nas <code>.properties</code>
        </h2><p>
          Antigamente, arquivos <code>.properties</code> eram limitados a ISO-8859-1 e você tinha que converter acentos com <code>native2ascii</code> (<code>\\u00e1</code> em vez de <code>á</code>).<strong>Desde o Java 9</strong>, o default mudou pra UTF-8: pode escrever<code>"Olá, ç, ã"</code> direto, sem mágica.
        </p><AlertBox type="warning" title="Cuidado se sua build é mista">
          <p>
            Se você ainda mantém código rodando em Java 8 (Maven antigo, libs legadas), o leitor de properties pode continuar em ISO-8859-1. Force <code>UTF-8</code> em<code>PropertyResourceBundle</code> ou no <code>setDefaultEncoding</code> do Spring pra evitar surpresa com acento virando "Ã".
          </p>
        </AlertBox><h2>Boas práticas</h2><ul>
          <li>
            Centralize <strong>todas</strong> as strings visíveis em <code>.properties</code>. Sem exceção.
          </li><li>
            Use chaves descritivas com hierarquia: <code>checkout.botao.confirmar</code>.
          </li><li>
            Nunca concatene strings localizadas — sempre use placeholders. A ordem das palavras muda entre idiomas.
          </li><li>Logs e mensagens de erro técnicas podem ficar em inglês fixo (são pra dev).</li><li>Teste com pseudo-locale ("Ǿḽḁ̀") pra detectar strings hardcoded.</li>
        </ul><h2>🎯 Mãos à massa</h2><ol>
          <li>
            Crie <code>messages.properties</code>, <code>messages_pt_BR.properties</code> e<code>messages_es.properties</code>. Imprima a saudação em três <code>Locale</code>s diferentes lendo do bundle.
          </li><li>
            Formate o valor <code>9876.5</code> como moeda em pt-BR, en-US e ja-JP. Compare a saída.
          </li><li>
            Construa um conversor que receba uma chave, um <code>Locale</code> e um array de argumentos, e retorne a string formatada. Adicione fallback explícito pra inglês se a chave faltar no idioma pedido.
          </li>
        </ol>
      </PageContainer>
  );
}
