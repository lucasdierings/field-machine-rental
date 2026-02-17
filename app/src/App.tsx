import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { BottomNavigation } from "./components/ui/bottom-navigation";
import { PageLoader } from "./components/ui/page-loader";
import { ErrorBoundary } from "./components/ui/error-boundary";

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
// Each page is loaded on-demand, reducing the initial bundle size significantly.

// Public pages
const Index = lazy(() => import("./pages/Index"));
const Search = lazy(() => import("./pages/Search"));
const Machines = lazy(() => import("./pages/Machines"));
const Categories = lazy(() => import("./pages/Categories"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const MachineDetails = lazy(() => import("./pages/MachineDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Onboarding = lazy(() => import("./pages/Onboarding").then(m => ({ default: m.Onboarding })));

// Protected pages
const RentMyMachine = lazy(() => import("./pages/RentMyMachine"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookings = lazy(() => import("./pages/Bookings"));
const AddMachine = lazy(() => import("./pages/AddMachine"));
const OnboardingDashboard = lazy(() => import("./pages/OnboardingDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const MyMachines = lazy(() => import("./pages/MyMachines"));
const Documents = lazy(() => import("./pages/Documents"));
const ReviewBooking = lazy(() => import("./pages/ReviewBooking"));
const Chat = lazy(() => import("./pages/Chat"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Dev/test pages
const SupabaseConnectionTest = lazy(() => import("./components/SupabaseConnectionTest"));

// ─── Query Client ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,      // Data is fresh for 30 seconds
      gcTime: 5 * 60_000,     // Garbage collect after 5 minutes
      retry: 1,               // Retry failed queries once
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Redirect helper ─────────────────────────────────────────────────────────

const RedirectToPrestador = () => {
  const { id } = useParams();
  return <Navigate to={`/prestador/${id}`} replace />;
};

// ─── App ─────────────────────────────────────────────────────────────────────

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
            <Suspense fallback={<PageLoader message="Carregando..." />}>
              <Routes>
                <Route path="/" element={<Index />} />

                {/* Public — SEO Friendly Routes */}
                <Route path="/servicos-agricolas" element={<Search />} />
                <Route path="/prestadores" element={<Machines />} />
                <Route path="/prestador/:id" element={<MachineDetails />} />
                <Route path="/servicos" element={<Categories />} />

                {/* Landing Pages */}
                <Route path="/servicos/:city" element={<Search />} />
                <Route path="/servicos/colheita" element={<Search />} />
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
                <Route path="/oferecer-servicos" element={
                  <ProtectedRoute><RentMyMachine /></ProtectedRoute>
                } />
                <Route path="/favoritos" element={
                  <ProtectedRoute><Favorites /></ProtectedRoute>
                } />
                <Route path="/alertas" element={
                  <ProtectedRoute><Alerts /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/dashboard/solicitacoes" element={
                  <ProtectedRoute><Bookings /></ProtectedRoute>
                } />
                <Route path="/add-machine" element={
                  <ProtectedRoute><AddMachine /></ProtectedRoute>
                } />
                <Route path="/edit-machine/:id" element={
                  <ProtectedRoute><AddMachine /></ProtectedRoute>
                } />
                <Route path="/dashboard/onboarding" element={
                  <ProtectedRoute><OnboardingDashboard /></ProtectedRoute>
                } />
                <Route path="/dashboard/perfil" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/minhas-maquinas" element={
                  <ProtectedRoute><MyMachines /></ProtectedRoute>
                } />
                <Route path="/dashboard/documentos" element={
                  <ProtectedRoute><Documents /></ProtectedRoute>
                } />
                <Route path="/avaliar/:bookingId" element={
                  <ProtectedRoute><ReviewBooking /></ProtectedRoute>
                } />
                <Route path="/chat/:userId" element={
                  <ProtectedRoute><Chat /></ProtectedRoute>
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
            </Suspense>
            </ErrorBoundary>
            <BottomNavigation />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
