import { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import AppLogo from "@/components/app-logo";
import "../../css/admin-layout.css";

export default function AdminLayout() {
  const [user, setUser] = useState<any | null>(null); // Inicializa como null
  const [loading, setLoading] = useState(true); // Estado para mostrar carga
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Cargar el tema desde sessionStorage (si existe)
  useEffect(() => {
    const storedTheme = sessionStorage.getItem("theme");
    if (storedTheme) {
      // Si existe, establecer el tema en el contexto
      // Si toggleTheme no acepta un argumento, puedes usar un condicional para cambiar el tema
      if (storedTheme === 'dark' && theme !== 'dark') {
        toggleTheme();
      } else if (storedTheme === 'light' && theme !== 'light') {
        toggleTheme();
      }
    }
  }, [theme, toggleTheme]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // Verifica que el usuario tenga el rol adecuado y existe
    if (!parsedUser || parsedUser.role?.name !== "admin") {
      console.warn("⛔ Acceso denegado: no es administrador");
      sessionStorage.removeItem("user");
      navigate("/login");
      return;
    }

    setUser(parsedUser); // Establece el usuario si es admin
    setLoading(false); // Cambia estado a no cargando
  }, [navigate]);

  // Maneja el cambio de tema y lo guarda en sessionStorage
  const handleToggleTheme = () => {
    toggleTheme(); // Cambia el tema sin pasarle un argumento
    sessionStorage.setItem("theme", theme === 'light' ? 'dark' : 'light'); // Guarda el nuevo tema
  };

  // Muestra mensaje de carga mientras se verifica el usuario
  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className={`admin-layout d-flex min-vh-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`sidebar p-3 border-end ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}
        style={{ width: "250px" }}
      >
        <div className="text-center mb-4">
          <AppLogo />
          <h5 className="mb-0 mt-2">Bienvenido</h5>
          <small>{user.name}</small>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item fw-bold mt-2">Funcionarios</li>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/funcionarios">Ingresar</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/admin/empleos/actualizar">Actualizar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/salarios">Salarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/consulta">Consulta</Link>
            </li>
          </ul>
          <li className="nav-item mt-3">
            <Link className="nav-link fw-bold" to="/admin/reportes">Reportes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link fw-bold" to="/admin/firmas">Firmas</Link>
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main
        className={`main-content flex-grow-1 p-4 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Panel de Administración</h2>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-${theme === 'light' ? 'dark' : 'light'}`}
              onClick={handleToggleTheme}
            >
              {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("theme"); // Eliminar tema al cerrar sesión
                navigate("/login");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Aquí se renderizan las rutas hijas */}
        <div className={`content-area p-4 shadow-sm rounded ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-white'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
