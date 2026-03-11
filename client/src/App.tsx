import { useState, useCallback } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { ListsContext, type DynamicList } from "@/lib/listsStore";
import { prospectLists } from "@/lib/mockData";
import Activity from "@/pages/Activity";
import InboxPage from "@/pages/Inbox";
import FindEnrich from "@/pages/FindEnrich";
import Lists from "@/pages/Lists";
import Contacts from "@/pages/Contacts";
import ContactDetail from "@/pages/ContactDetail";
import Companies from "@/pages/Companies";
import Campaigns from "@/pages/Campaigns";
import Analytics from "@/pages/Analytics";
import Identities from "@/pages/Identities";
import AIPlaybook from "@/pages/AIPlaybook";
import Integrations from "@/pages/Integrations";
import Configuration from "@/pages/Configuration";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Activity} />
      <Route path="/inbox" component={InboxPage} />
      <Route path="/find" component={FindEnrich} />
      <Route path="/lists" component={Lists} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/contact/:id" component={ContactDetail} />
      <Route path="/companies" component={Companies} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/identities" component={Identities} />
      <Route path="/playbook" component={AIPlaybook} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/settings" component={Configuration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ListsProvider({ children }: { children: React.ReactNode }) {
  const [dynamicLists, setDynamicLists] = useState<DynamicList[]>([]);

  const addList = useCallback((list: DynamicList) => {
    setDynamicLists((prev) => [list, ...prev]);
  }, []);

  const removeList = useCallback((id: string) => {
    setDynamicLists((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const removeContactFromList = useCallback((listId: string, contactId: string) => {
    setDynamicLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const updated = l.contacts.filter((c) => c.id !== contactId);
        return { ...l, contacts: updated, contactCount: updated.length };
      })
    );
  }, []);

  const getAllLists = useCallback(() => {
    const mockLists = prospectLists.map((l) => ({
      ...l,
      contacts: [],
    }));
    return [...dynamicLists, ...mockLists];
  }, [dynamicLists]);

  const getDynamicList = useCallback((id: string) => {
    return dynamicLists.find((l) => l.id === id);
  }, [dynamicLists]);

  return (
    <ListsContext.Provider value={{ dynamicLists, addList, removeList, removeContactFromList, getAllLists, getDynamicList }}>
      {children}
    </ListsContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ListsProvider>
          <div className="flex min-h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 ml-[220px] overflow-auto">
              <Router />
            </main>
          </div>
          <Toaster />
        </ListsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
