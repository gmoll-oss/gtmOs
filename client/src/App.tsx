import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import Discovery from "@/pages/Discovery";
import Leads from "@/pages/Leads";
import LeadDetail from "@/pages/LeadDetail";
import Sequences from "@/pages/Sequences";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/discovery" component={Discovery} />
      <Route path="/leads" component={Leads} />
      <Route path="/lead/:id" component={LeadDetail} />
      <Route path="/sequences" component={Sequences} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-background">
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
