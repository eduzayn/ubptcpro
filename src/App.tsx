import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursesList from "./pages/CoursesList";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CredentialValidation from "./pages/CredentialValidation";
import PaymentPending from "./pages/PaymentPending";
import LoginBypass from "./pages/LoginBypass";

// Páginas da área do associado
import MyCourses from "./pages/MyCourses";
import Certificates from "./pages/Certificates";
import Credential from "./pages/Credential";
import PaymentHistory from "./pages/PaymentHistory";
import Checkout from "./pages/Checkout";
import Library from "./pages/Library";

// Páginas administrativas
import AdminDashboard from "./pages/admin/Dashboard";
import CourseEditor from "./pages/admin/CourseEditor";
import LibraryManager from "./pages/admin/LibraryManager";

// Componente de proteção de rota com base no hook useAuth
function ProtectedRoute({ children, redirectTo = "/login", requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Mostrar algum indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Verificar permissões
  const hasAccess = requireAdmin ? (isAuthenticated && isAdmin) : isAuthenticated;
  
  return hasAccess ? children : <Navigate to={redirectTo} />;
}

// Componente de rota somente para visitantes (redireciona usuários autenticados)
function GuestRoute({ children, redirectTo = "/cursos/meus" }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mostrar algum indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to={redirectTo} />;
}

// Componente principal da aplicação
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<CoursesList />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/validar-credencial" element={<CredentialValidation />} />
        <Route path="/pagamento-pendente" element={<PaymentPending />} />
        
        {/* Rotas com parâmetro dinâmico - devem vir após rotas específicas */}
        <Route path="/cursos/:id" element={<CourseDetail />} />
        
        {/* Rotas para visitantes (não autenticados) */}
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/associar" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />
        <Route path="/acesso-direto" element={
          <GuestRoute>
            <LoginBypass />
          </GuestRoute>
        } />
        
        {/* Rotas da área do associado - protegidas por autenticação */}
        <Route path="/cursos/meus" element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        } />
        <Route path="/certificados" element={
          <ProtectedRoute>
            <Certificates />
          </ProtectedRoute>
        } />
        <Route path="/credencial" element={
          <ProtectedRoute>
            <Credential />
          </ProtectedRoute>
        } />
        <Route path="/pagamentos" element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/biblioteca" element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />
        
        {/* Rotas administrativas - protegidas por perfil de admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin={true} redirectTo="/">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/cursos/editor" element={
          <ProtectedRoute requireAdmin={true} redirectTo="/">
            <CourseEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/biblioteca" element={
          <ProtectedRoute requireAdmin={true} redirectTo="/">
            <LibraryManager />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

// Wrapper para prover o contexto de autenticação
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
