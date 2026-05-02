import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const Historia = lazy(() => import("@/pages/Historia"));
const Filosofia = lazy(() => import("@/pages/Filosofia"));
const JvmJdkJre = lazy(() => import("@/pages/JvmJdkJre"));
const InstalarJdk = lazy(() => import("@/pages/InstalarJdk"));
const HelloWorld = lazy(() => import("@/pages/HelloWorld"));
const IDE = lazy(() => import("@/pages/IDE"));
const EstruturaProjeto = lazy(() => import("@/pages/EstruturaProjeto"));
const TiposPrimitivos = lazy(() => import("@/pages/TiposPrimitivos"));
const Variaveis = lazy(() => import("@/pages/Variaveis"));
const Operadores = lazy(() => import("@/pages/Operadores"));
const Strings = lazy(() => import("@/pages/Strings"));
const ControleFluxo = lazy(() => import("@/pages/ControleFluxo"));
const Loops = lazy(() => import("@/pages/Loops"));
const Arrays = lazy(() => import("@/pages/Arrays"));
const Metodos = lazy(() => import("@/pages/Metodos"));
const Classes = lazy(() => import("@/pages/Classes"));
const Construtores = lazy(() => import("@/pages/Construtores"));
const Encapsulamento = lazy(() => import("@/pages/Encapsulamento"));
const Heranca = lazy(() => import("@/pages/Heranca"));
const Polimorfismo = lazy(() => import("@/pages/Polimorfismo"));
const ClassesAbstratas = lazy(() => import("@/pages/ClassesAbstratas"));
const Interfaces = lazy(() => import("@/pages/Interfaces"));
const Records = lazy(() => import("@/pages/Records"));
const Sealed = lazy(() => import("@/pages/Sealed"));
const Enums = lazy(() => import("@/pages/Enums"));
const Excecoes = lazy(() => import("@/pages/Excecoes"));
const TryCatch = lazy(() => import("@/pages/TryCatch"));
const TryWithResources = lazy(() => import("@/pages/TryWithResources"));
const Collections = lazy(() => import("@/pages/Collections"));
const ListPage = lazy(() => import("@/pages/ListPage"));
const SetPage = lazy(() => import("@/pages/SetPage"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const ComparatorPage = lazy(() => import("@/pages/ComparatorPage"));
const Genericos = lazy(() => import("@/pages/Genericos"));
const Wildcards = lazy(() => import("@/pages/Wildcards"));
const FunctionalInterfaces = lazy(() => import("@/pages/FunctionalInterfaces"));
const Lambdas = lazy(() => import("@/pages/Lambdas"));
const Streams = lazy(() => import("@/pages/Streams"));
const OptionalPage = lazy(() => import("@/pages/OptionalPage"));
const Threads = lazy(() => import("@/pages/Threads"));
const Executors = lazy(() => import("@/pages/Executors"));
const Sincronizacao = lazy(() => import("@/pages/Sincronizacao"));
const VirtualThreads = lazy(() => import("@/pages/VirtualThreads"));
const VarTextBlocks = lazy(() => import("@/pages/VarTextBlocks"));
const PatternMatching = lazy(() => import("@/pages/PatternMatching"));
const Modules = lazy(() => import("@/pages/Modules"));
const NIO = lazy(() => import("@/pages/NIO"));
const IOArquivos = lazy(() => import("@/pages/IOArquivos"));
const JDBC = lazy(() => import("@/pages/JDBC"));
const HttpClient = lazy(() => import("@/pages/HttpClient"));
const JSONPage = lazy(() => import("@/pages/JSONPage"));
const Maven = lazy(() => import("@/pages/Maven"));
const Gradle = lazy(() => import("@/pages/Gradle"));
const JUnit = lazy(() => import("@/pages/JUnit"));
const Mockito = lazy(() => import("@/pages/Mockito"));
const DesignPatternsIntro = lazy(() => import("@/pages/DesignPatternsIntro"));
const Singleton = lazy(() => import("@/pages/Singleton"));
const Factory = lazy(() => import("@/pages/Factory"));
const Builder = lazy(() => import("@/pages/Builder"));
const Observer = lazy(() => import("@/pages/Observer"));
const Strategy = lazy(() => import("@/pages/Strategy"));
const Decorator = lazy(() => import("@/pages/Decorator"));
const Adapter = lazy(() => import("@/pages/Adapter"));
const SpringBootIntro = lazy(() => import("@/pages/SpringBootIntro"));
const SpringMvc = lazy(() => import("@/pages/SpringMvc"));
const SpringDataJpa = lazy(() => import("@/pages/SpringDataJpa"));
const SpringSecurity = lazy(() => import("@/pages/SpringSecurity"));
const SpringBeans = lazy(() => import("@/pages/SpringBeans"));
const SpringTesting = lazy(() => import("@/pages/SpringTesting"));
const HibernateIntro = lazy(() => import("@/pages/HibernateIntro"));
const JpaEntities = lazy(() => import("@/pages/JpaEntities"));
const JpaRelationships = lazy(() => import("@/pages/JpaRelationships"));
const JpaQueries = lazy(() => import("@/pages/JpaQueries"));
const ConnectionPool = lazy(() => import("@/pages/ConnectionPool"));
const GarbageCollection = lazy(() => import("@/pages/GarbageCollection"));
const JvmTuning = lazy(() => import("@/pages/JvmTuning"));
const Profiling = lazy(() => import("@/pages/Profiling"));
const JitCompilation = lazy(() => import("@/pages/JitCompilation"));
const MemoryModel = lazy(() => import("@/pages/MemoryModel"));
const Jmh = lazy(() => import("@/pages/Jmh"));
const CompletableFuturePage = lazy(() => import("@/pages/CompletableFuturePage"));
const ReactiveStreams = lazy(() => import("@/pages/ReactiveStreams"));
const ProjectReactor = lazy(() => import("@/pages/ProjectReactor"));
const WebFlux = lazy(() => import("@/pages/WebFlux"));
const AsyncPatterns = lazy(() => import("@/pages/AsyncPatterns"));
const TestContainers = lazy(() => import("@/pages/TestContainers"));
const AssertJ = lazy(() => import("@/pages/AssertJ"));
const PropertyTesting = lazy(() => import("@/pages/PropertyTesting"));
const IntegrationTests = lazy(() => import("@/pages/IntegrationTests"));
const SolidPrinciples = lazy(() => import("@/pages/SolidPrinciples"));
const CleanCode = lazy(() => import("@/pages/CleanCode"));
const EffectiveJava = lazy(() => import("@/pages/EffectiveJava"));
const Imutabilidade = lazy(() => import("@/pages/Imutabilidade"));
const DefensiveCopying = lazy(() => import("@/pages/DefensiveCopying"));
const CodeSmells = lazy(() => import("@/pages/CodeSmells"));
const Reflection = lazy(() => import("@/pages/Reflection"));
const AnnotationsCustom = lazy(() => import("@/pages/AnnotationsCustom"));
const ClassLoader = lazy(() => import("@/pages/ClassLoader"));
const Serialization = lazy(() => import("@/pages/Serialization"));
const IntelliJTips = lazy(() => import("@/pages/IntelliJTips"));
const Debugging = lazy(() => import("@/pages/Debugging"));
const GitJava = lazy(() => import("@/pages/GitJava"));
const CiCdGithub = lazy(() => import("@/pages/CiCdGithub"));
const JarPackaging = lazy(() => import("@/pages/JarPackaging"));
const ProjetoTodoCli = lazy(() => import("@/pages/ProjetoTodoCli"));
const ProjetoApiRest = lazy(() => import("@/pages/ProjetoApiRest"));
const ProjetoBancoSimples = lazy(() => import("@/pages/ProjetoBancoSimples"));
const ProjetoChat = lazy(() => import("@/pages/ProjetoChat"));
const ProjetoExtraDesafios = lazy(() => import("@/pages/ProjetoExtraDesafios"));
const Referencias = lazy(() => import("@/pages/Referencias"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-[#888A85] font-mono text-sm">carregando capítulo…</div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
        <Route path="/historia" component={Historia} />
        <Route path="/filosofia" component={Filosofia} />
        <Route path="/jvm-jdk-jre" component={JvmJdkJre} />
        <Route path="/instalar-jdk" component={InstalarJdk} />
        <Route path="/hello-world" component={HelloWorld} />
        <Route path="/ide" component={IDE} />
        <Route path="/estrutura-projeto" component={EstruturaProjeto} />
        <Route path="/tipos-primitivos" component={TiposPrimitivos} />
        <Route path="/variaveis" component={Variaveis} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/strings" component={Strings} />
        <Route path="/controle-fluxo" component={ControleFluxo} />
        <Route path="/loops" component={Loops} />
        <Route path="/arrays" component={Arrays} />
        <Route path="/metodos" component={Metodos} />
        <Route path="/classes" component={Classes} />
        <Route path="/construtores" component={Construtores} />
        <Route path="/encapsulamento" component={Encapsulamento} />
        <Route path="/heranca" component={Heranca} />
        <Route path="/polimorfismo" component={Polimorfismo} />
        <Route path="/classes-abstratas" component={ClassesAbstratas} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/records" component={Records} />
        <Route path="/sealed" component={Sealed} />
        <Route path="/enums" component={Enums} />
        <Route path="/excecoes" component={Excecoes} />
        <Route path="/try-catch" component={TryCatch} />
        <Route path="/try-with-resources" component={TryWithResources} />
        <Route path="/collections" component={Collections} />
        <Route path="/list" component={ListPage} />
        <Route path="/set" component={SetPage} />
        <Route path="/map" component={MapPage} />
        <Route path="/comparator" component={ComparatorPage} />
        <Route path="/genericos" component={Genericos} />
        <Route path="/wildcards" component={Wildcards} />
        <Route path="/functional-interfaces" component={FunctionalInterfaces} />
        <Route path="/lambdas" component={Lambdas} />
        <Route path="/streams" component={Streams} />
        <Route path="/optional" component={OptionalPage} />
        <Route path="/threads" component={Threads} />
        <Route path="/executors" component={Executors} />
        <Route path="/sincronizacao" component={Sincronizacao} />
        <Route path="/virtual-threads" component={VirtualThreads} />
        <Route path="/var-text-blocks" component={VarTextBlocks} />
        <Route path="/pattern-matching" component={PatternMatching} />
        <Route path="/modules" component={Modules} />
        <Route path="/nio" component={NIO} />
        <Route path="/io-arquivos" component={IOArquivos} />
        <Route path="/jdbc" component={JDBC} />
        <Route path="/http-client" component={HttpClient} />
        <Route path="/json" component={JSONPage} />
        <Route path="/maven" component={Maven} />
        <Route path="/gradle" component={Gradle} />
        <Route path="/junit" component={JUnit} />
        <Route path="/mockito" component={Mockito} />
        <Route path="/padroes" component={DesignPatternsIntro} />
        <Route path="/singleton" component={Singleton} />
        <Route path="/factory" component={Factory} />
        <Route path="/builder" component={Builder} />
        <Route path="/observer" component={Observer} />
        <Route path="/strategy" component={Strategy} />
        <Route path="/decorator" component={Decorator} />
        <Route path="/adapter" component={Adapter} />
        <Route path="/spring-boot" component={SpringBootIntro} />
        <Route path="/spring-mvc" component={SpringMvc} />
        <Route path="/spring-data" component={SpringDataJpa} />
        <Route path="/spring-security" component={SpringSecurity} />
        <Route path="/spring-beans" component={SpringBeans} />
        <Route path="/spring-testing" component={SpringTesting} />
        <Route path="/hibernate" component={HibernateIntro} />
        <Route path="/jpa-entities" component={JpaEntities} />
        <Route path="/jpa-relationships" component={JpaRelationships} />
        <Route path="/jpa-queries" component={JpaQueries} />
        <Route path="/connection-pool" component={ConnectionPool} />
        <Route path="/garbage-collection" component={GarbageCollection} />
        <Route path="/jvm-tuning" component={JvmTuning} />
        <Route path="/profiling" component={Profiling} />
        <Route path="/jit" component={JitCompilation} />
        <Route path="/memory-model" component={MemoryModel} />
        <Route path="/jmh" component={Jmh} />
        <Route path="/completable-future" component={CompletableFuturePage} />
        <Route path="/reactive-streams" component={ReactiveStreams} />
        <Route path="/reactor" component={ProjectReactor} />
        <Route path="/webflux" component={WebFlux} />
        <Route path="/async-patterns" component={AsyncPatterns} />
        <Route path="/testcontainers" component={TestContainers} />
        <Route path="/assertj" component={AssertJ} />
        <Route path="/property-testing" component={PropertyTesting} />
        <Route path="/integration-tests" component={IntegrationTests} />
        <Route path="/solid" component={SolidPrinciples} />
        <Route path="/clean-code" component={CleanCode} />
        <Route path="/effective-java" component={EffectiveJava} />
        <Route path="/imutabilidade" component={Imutabilidade} />
        <Route path="/defensive-copying" component={DefensiveCopying} />
        <Route path="/code-smells" component={CodeSmells} />
        <Route path="/reflection" component={Reflection} />
        <Route path="/annotations" component={AnnotationsCustom} />
        <Route path="/classloader" component={ClassLoader} />
        <Route path="/serialization" component={Serialization} />
        <Route path="/intellij-tips" component={IntelliJTips} />
        <Route path="/debugging" component={Debugging} />
        <Route path="/git-java" component={GitJava} />
        <Route path="/cicd" component={CiCdGithub} />
        <Route path="/jar-packaging" component={JarPackaging} />
        <Route path="/projeto-todo" component={ProjetoTodoCli} />
        <Route path="/projeto-api" component={ProjetoApiRest} />
        <Route path="/projeto-banco" component={ProjetoBancoSimples} />
        <Route path="/projeto-chat" component={ProjetoChat} />
        <Route path="/desafios" component={ProjetoExtraDesafios} />
        <Route path="/referencias" component={Referencias} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
