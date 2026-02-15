import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import NotFound from "@/pages/not-found";
import Resources from "@/pages/Resources";
import Community from "./pages/Community";
import Catalog from "./pages/Catalog";

import Dashboard from "@/pages/Dashboard";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/Widgets";
import { useAuth } from "@/hooks/use-auth";
import MyCourses from "./pages/MyCourses";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login"); // Frontend route instead of /api/login
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-[260px] mr-0 xl:mr-[320px] min-h-screen p-8 relative">
        <Component {...rest} />
      </main>
      <RightSidebar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        <PrivateRoute component={Dashboard} />
      </Route>

      <Route path="/resources">
        <PrivateRoute component={Resources}/>
      </Route>

      <Route path="/MyCourses">
        <PrivateRoute component={MyCourses}/>
      </Route>

      <Route path="/Community">
        <PrivateRoute component={Community}/>
      </Route>

      <Route path="/Catalog">
        <PrivateRoute component={Catalog}/>
      </Route>
      
      <Route path="/courses/:id">
        <PrivateRoute component={CourseDetail} />
      </Route>

      <Route component={NotFound} />

    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;