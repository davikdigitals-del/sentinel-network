import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import ArticlePage from "./pages/ArticlePage";
import CountriesPage from "./pages/CountriesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/:section" element={<SectionPage />} />
              <Route path="/:section/:category" element={<SectionPage />} />
              <Route path="/:section/:category/:id" element={<ArticlePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <SiteFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
