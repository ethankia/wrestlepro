import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import BucksChatbot from "@/components/BucksChatbot";
import Index from "./pages/Index";
import Tutorials from "./pages/Tutorials";
import DualVideos from "./pages/DualVideos";
import WorkoutCreator from "./pages/WorkoutCreator";
import FoodScanner from "./pages/FoodScanner";
import DailyTip from "./pages/DailyTip";
import Associations from "./pages/Associations";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import SEO from "./pages/SEO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/dual-videos" element={<DualVideos />} />
              <Route path="/workout-creator" element={<WorkoutCreator />} />
              <Route path="/food-scanner" element={<FoodScanner />} />
              <Route path="/daily-tip" element={<DailyTip />} />
              <Route path="/associations" element={<Associations />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/community" element={<Community />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/seo" element={<SEO />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <BucksChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
