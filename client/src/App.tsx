import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/store-context";
import { AuthProvider } from "@/context/auth-context";
import { Layout } from "@/components/layout/Layout";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductPage from "@/pages/Product";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Admin from "@/pages/Admin";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top when route changes, but preserve hash for About page
    if (location.startsWith('/about#')) {
      // Let the About page handle the hash scrolling
      return;
    }
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
