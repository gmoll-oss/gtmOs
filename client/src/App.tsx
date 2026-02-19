import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import HotelDatabase from "@/pages/HotelDatabase";
import LeadProfile from "@/pages/LeadProfile";
import Cadences from "@/pages/Cadences";
import Unibox from "@/pages/Unibox";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/database" component={HotelDatabase} />
      <Route path="/lead/:id" component={LeadProfile} />
      <Route path="/cadences" component={Cadences} />
      <Route path="/unibox" component={Unibox} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-[#0F1117]">
          <AppSidebar />
          <main className="flex-1 ml-[240px] overflow-auto">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
