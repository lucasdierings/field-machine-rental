import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Machines from "./pages/Machines";
import Categories from "./pages/Categories";
import HowItWorks from "./pages/HowItWorks";
import RentMyMachine from "./pages/RentMyMachine";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import OnboardingDashboard from "./pages/OnboardingDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/maquinas" element={<Machines />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/como-funciona" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/alugar-minha-maquina" element={
            <ProtectedRoute>
              <RentMyMachine />
            </ProtectedRoute>
          } />
          <Route path="/favoritos" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/alertas" element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <OnboardingDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
