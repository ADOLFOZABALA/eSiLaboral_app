import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';

// Contexto de tema
import { ThemeProvider } from './Context/ThemeContext';

// Páginas públicas
import Welcome from './pages/welcome';
import Login from './pages/auth/login';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Páginas protegidas
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Funcionarios from './pages/Admin/Funcionarios';
import Salarios from './pages/Admin/Salarios';
import ConsultarFuncionario from './pages/Admin/ConsultarFuncionario';
import ActualizarFuncionarioEmpleo from './pages/Admin/ActualizarFuncionarioEmpleo'; // 👈 NUEVA página

// Página de redirección inteligente
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />

          {/* Redirección al dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Rutas protegidas para admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="funcionarios" element={<Funcionarios />} />
              <Route path="salarios" element={<Salarios />} />
              <Route path="consulta" element={<ConsultarFuncionario />} />
              <Route path="empleos/actualizar" element={<ActualizarFuncionarioEmpleo />} /> {/* 👈 Nueva ruta */}
            </Route>
          </Route>

          {/* Ruta fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No se encontró el elemento con id "root"');
}
