import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
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

function App() {
  const session = authService.getSession();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección dinámica desde la raíz */}
        <Route path="/" element={<Navigate to={session ? (session.rol === 'admin' ? "/dashboard/admin" : "/dashboard") : "/login"} replace />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={session ? <Navigate to={session.rol === 'admin' ? "/dashboard/admin" : "/dashboard"} replace /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Privadas (Socio y Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['socio', 'admin']} />}>
          <Route path="/dashboard" element={<PrivateLayout />}>
            {/* Rutas de Socio */}
            <Route index element={<Dashboard />} />
            <Route path="aportes" element={<Aportes />} />
            <Route path="prestamos" element={<Prestamos />} />
            <Route path="ahorros" element={<Ahorros />} />
            <Route path="pagos" element={<Pagos />} />
            <Route path="express" element={<Express />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            
            {/* Rutas exclusivas de Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/socios" element={<AdminSocios />} />
              <Route path="admin/aportes" element={<AdminAportes />} />
              <Route path="admin/prestamos" element={<AdminPrestamos />} />
              <Route path="admin/cuotas-vencidas" element={<AdminCuotasVencidas />} />
              <Route path="admin/pagos" element={<AdminPagos />} />
              <Route path="admin/flujo-caja" element={<AdminFlujoCaja />} />
              <Route path="admin/ahorros" element={<AdminAhorros />} />
              <Route path="admin/solicitudes" element={<AdminSolicitudes />} />
              <Route path="admin/reportes" element={<AdminReportes />} />
              <Route path="admin/notificaciones" element={<AdminNotificaciones />} />
              <Route path="admin/importar-exportar" element={<AdminImportExport />} />
              <Route path="admin/configuracion" element={<AdminConfiguracion />} />
            </Route>
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
