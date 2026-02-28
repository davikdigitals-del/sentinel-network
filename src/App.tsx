import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import ArticlePage from "./pages/ArticlePage";
import CountriesPage from "./pages/CountriesPage";
import NotFound from "./pages/NotFound";
import PublicLayout from "./pages/PublicLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminMedia from "./pages/admin/AdminMedia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes — standalone layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="media" element={<AdminMedia />} />
          </Route>

          {/* Public routes — header + footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/:section" element={<SectionPage />} />
            <Route path="/:section/:category" element={<SectionPage />} />
            <Route path="/:section/:category/:id" element={<ArticlePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
