import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { BottomNavigation } from "./components/ui/bottom-navigation";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Machines from "./pages/Machines";
import Categories from "./pages/Categories";
import HowItWorks from "./pages/HowItWorks";
import RentMyMachine from "./pages/RentMyMachine";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Onboarding } from "./pages/Onboarding";
import Favorites from "./pages/Favorites";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import OnboardingDashboard from "./pages/OnboardingDashboard";
import Dashboard from "./pages/Dashboard";
import AddMachine from "./pages/AddMachine";
import Profile from "./pages/Profile";
import Documents from "./pages/Documents";
import MyMachines from "./pages/MyMachines";
import MachineDetails from "./pages/MachineDetails";
import ReviewBooking from "./pages/ReviewBooking";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import SupabaseConnectionTest from "./components/SupabaseConnectionTest";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

import { HelmetProvider } from "react-helmet-async";

const RedirectToPrestador = () => {
  const { id } = useParams();
  return <Navigate to={`/prestador/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* New SEO Friendly Routes */}
            <Route path="/servicos-agricolas" element={<Search />} />
            <Route path="/prestadores" element={<Machines />} />
            <Route path="/prestador/:id" element={<MachineDetails />} />
            <Route path="/servicos" element={<Categories />} />
            <Route path="/oferecer-servicos" element={
              <ProtectedRoute>
                <RentMyMachine />
              </ProtectedRoute>
            } />

            {/* Landing Pages */}
            <Route path="/servicos/:city" element={<Search />} />
            <Route path="/servicos/colheita" element={<Search />} /> {/* TODO: Pre-filter by category */}
            <Route path="/servicos/plantio" element={<Search />} />
            <Route path="/servicos/pulverizacao" element={<Search />} />
            <Route path="/servicos/preparo-solo" element={<Search />} />
            <Route path="/servicos/transporte" element={<Search />} />

            {/* Institutional Pages */}
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/privacidade" element={<Privacy />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/verificar-email" element={<VerifyEmail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/como-funciona" element={<HowItWorks />} />

            {/* Old Routes Redirects (301-like) */}
            <Route path="/buscar" element={<Navigate to="/servicos-agricolas" replace />} />
            <Route path="/maquinas" element={<Navigate to="/prestadores" replace />} />
            <Route path="/maquinas/:id" element={<RedirectToPrestador />} />
            <Route path="/categorias" element={<Navigate to="/servicos" replace />} />
            <Route path="/alugar-minha-maquina" element={<Navigate to="/oferecer-servicos" replace />} />

            {/* Protected Routes */}
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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-machine" element={
              <ProtectedRoute>
                <AddMachine />
              </ProtectedRoute>
            } />
            <Route path="/edit-machine/:id" element={
              <ProtectedRoute>
                <AddMachine />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/onboarding" element={
              <ProtectedRoute>
                <OnboardingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/perfil" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/minhas-maquinas" element={
              <ProtectedRoute>
                <MyMachines />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/documentos" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/avaliar/:bookingId" element={
              <ProtectedRoute>
                <ReviewBooking />
              </ProtectedRoute>
            } />
            <Route path="/chat/:userId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />

            {/* Admin Only Route */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />

            <Route path="/test-connection" element={<SupabaseConnectionTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
