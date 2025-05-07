export default function AdminDashboard() {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.name) {
    return (
      <div className="alert alert-warning">
        <h3 className="mb-3">⚠️ No se pudo obtener los datos del usuario</h3>
        <p>Por favor, asegúrate de que has iniciado sesión correctamente.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3">👋 Bienvenido</h3>
      <p><strong>Usuario:</strong> {user.name}</p>
      <p>Desde aquí puedes gestionar los módulos de funcionarios, salarios, reportes y más.</p>
    </div>
  );
}
