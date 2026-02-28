import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import ArticlePage from "./pages/ArticlePage";
import CountriesPage from "./pages/CountriesPage";
import NotFound from "./pages/NotFound";
import PublicLayout from "./pages/PublicLayout";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import MemberDashboard from "./pages/MemberDashboard";
import LibraryPage from "./pages/LibraryPage";
import EncyclopaediaPage from "./pages/EncyclopaediaPage";
import MediaHubPage from "./pages/MediaHubPage";
import AboutPage from "./pages/AboutPage";
import LegalPage from "./pages/LegalPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminPodcastVideos from "./pages/admin/AdminPodcastVideos";
import AdminPages from "./pages/admin/AdminPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin login - standalone */}
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="podcast-videos" element={<AdminPodcastVideos />} />
              <Route path="pages" element={<AdminPages />} />
            </Route>

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<MemberDashboard />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/encyclopaedia" element={<EncyclopaediaPage />} />
              <Route path="/media" element={<MediaHubPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/legal/:page" element={<LegalPage />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/disclaimer" element={<LegalPage />} />
              <Route path="/:section" element={<SectionPage />} />
              <Route path="/:section/:category" element={<SectionPage />} />
              <Route path="/:section/:category/:id" element={<ArticlePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
