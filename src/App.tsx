import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Historia from "@/pages/Historia";
import Instalacao from "@/pages/Instalacao";
import PrimeirosPassos from "@/pages/PrimeirosPassos";
import TiposVariaveis from "@/pages/TiposVariaveis";
import Operadores from "@/pages/Operadores";
import ControleFluxo from "@/pages/ControleFluxo";
import Lacos from "@/pages/Lacos";
import Arrays from "@/pages/Arrays";
import Metodos from "@/pages/Metodos";
import OOP from "@/pages/OOP";
import Heranca from "@/pages/Heranca";
import Interfaces from "@/pages/Interfaces";
import Excecoes from "@/pages/Excecoes";
import Colecoes from "@/pages/Colecoes";
import Mapas from "@/pages/Mapas";
import Generics from "@/pages/Generics";
import LambdaStreams from "@/pages/LambdaStreams";
import Threads from "@/pages/Threads";
import IO from "@/pages/IO";
import Testes from "@/pages/Testes";
import BuildTools from "@/pages/BuildTools";
import Referencias from "@/pages/Referencias";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

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
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/historia" component={Historia} />
        <Route path="/instalacao" component={Instalacao} />
        <Route path="/primeiros-passos" component={PrimeirosPassos} />
        <Route path="/tipos-variaveis" component={TiposVariaveis} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/controle-fluxo" component={ControleFluxo} />
        <Route path="/lacos" component={Lacos} />
        <Route path="/arrays" component={Arrays} />
        <Route path="/metodos" component={Metodos} />
        <Route path="/oop" component={OOP} />
        <Route path="/heranca" component={Heranca} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/excecoes" component={Excecoes} />
        <Route path="/colecoes" component={Colecoes} />
        <Route path="/mapas" component={Mapas} />
        <Route path="/generics" component={Generics} />
        <Route path="/lambda-streams" component={LambdaStreams} />
        <Route path="/threads" component={Threads} />
        <Route path="/io" component={IO} />
        <Route path="/testes" component={Testes} />
        <Route path="/build-tools" component={BuildTools} />
        <Route path="/referencias" component={Referencias} />
        <Route component={NotFound} />
      </Switch>
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
