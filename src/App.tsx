import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import PrivateLayout from './layouts/PrivateLayout';
import Dashboard from './pages/Dashboard';
import Aportes from './pages/Aportes';
import Prestamos from './pages/Prestamos';
import Ahorros from './pages/Ahorros';
import Pagos from './pages/Pagos';
import Express from './pages/Express';
import Perfil from './pages/Perfil';
import Notificaciones from './pages/Notificaciones';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSocios from './pages/admin/AdminSocios';
import AdminFlujoCaja from './pages/admin/AdminFlujoCaja';
import AdminReportes from './pages/admin/AdminReportes';
import AdminImportExport from './pages/admin/AdminImportExport';
import AdminNotificaciones from './pages/admin/AdminNotificaciones';
import AdminAportes from './pages/admin/AdminAportes';
import AdminPrestamos from './pages/admin/AdminPrestamos';
import AdminCuotasVencidas from './pages/admin/AdminCuotasVencidas';
import AdminPagos from './pages/admin/AdminPagos';
import AdminAhorros from './pages/admin/AdminAhorros';
import AdminSolicitudes from './pages/admin/AdminSolicitudes';
import AdminConfiguracion from './pages/admin/AdminConfiguracion';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function RootRedirect() {
  const session = authService.getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.rol === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

function PublicLogin() {
  const session = authService.getSession();
  if (!session) return <Login />;
  if (session.rol === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

function PublicAdminLogin() {
  const session = authService.getSession();
  if (!session) return <AdminLogin />;
  if (session.rol === 'socio') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/dashboard/admin" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<PublicLogin />} />
        <Route path="/admin" element={<PublicAdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['socio']}>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="aportes" element={<Aportes />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="ahorros" element={<Ahorros />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="express" element={<Express />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="notificaciones" element={<Notificaciones />} />
        </Route>

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="socios" element={<AdminSocios />} />
          <Route path="aportes" element={<AdminAportes />} />
          <Route path="prestamos" element={<AdminPrestamos />} />
          <Route path="cuotas-vencidas" element={<AdminCuotasVencidas />} />
          <Route path="pagos" element={<AdminPagos />} />
          <Route path="flujo-caja" element={<AdminFlujoCaja />} />
          <Route path="ahorros" element={<AdminAhorros />} />
          <Route path="solicitudes" element={<AdminSolicitudes />} />
          <Route path="notificaciones" element={<AdminNotificaciones />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="importar-exportar" element={<AdminImportExport />} />
          <Route path="configuracion" element={<AdminConfiguracion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
