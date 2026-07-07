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
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  const session = authService.getSession();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección dinámica desde la raíz */}
        <Route path="/" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Privadas (Socio y Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['socio', 'admin']} />}>
          <Route path="/dashboard" element={<PrivateLayout />}>
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
              <Route path="admin" element={<AdminPanel />} />
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
