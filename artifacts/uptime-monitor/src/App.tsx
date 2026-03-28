import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// Pages
import { LandingPage } from "@/pages/Landing";
import { Dashboard } from "@/pages/Dashboard";
import { Monitors } from "@/pages/Monitors";
import { MonitorDetail } from "@/pages/MonitorDetail";
import { Incidents } from "@/pages/Incidents";
import { StatusPages } from "@/pages/StatusPages";
import { PublicStatusPage } from "@/pages/PublicStatusPage";
import { Settings } from "@/pages/Settings";
import { Notifications } from "@/pages/Notifications";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { Security } from "@/pages/Security";
import { CookieBanner } from "@/components/CookieBanner";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { session, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <Redirect to="/" />;
  
  return <Component {...rest} />;
}

function RootRouter() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <Switch>
      {/* Public Status Pages (No Auth Required) */}
      <Route path="/status/:slug" component={PublicStatusPage} />

      {/* Legal & Info Pages */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/security" component={Security} />
      
      {/* Root Route - Landing if not logged in, Dashboard if logged in */}
      <Route path="/">
        {session ? <Dashboard /> : <LandingPage />}
      </Route>

      {/* Protected Routes */}
      <Route path="/monitors"><ProtectedRoute component={Monitors} /></Route>
      <Route path="/monitors/:id"><ProtectedRoute component={MonitorDetail} /></Route>
      <Route path="/incidents"><ProtectedRoute component={Incidents} /></Route>
      <Route path="/status-pages"><ProtectedRoute component={StatusPages} /></Route>
      <Route path="/notifications"><ProtectedRoute component={Notifications} /></Route>
      <Route path="/settings"><ProtectedRoute component={Settings} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RootRouter />
          </WouterRouter>
          <Toaster />
          <CookieBanner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
