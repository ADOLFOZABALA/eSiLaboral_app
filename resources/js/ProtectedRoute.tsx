import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const storedUser = sessionStorage.getItem("user");

    // Si no hay usuario en sessionStorage, redirigir al login
    if (!storedUser) {
        console.error("Usuario no encontrado en sessionStorage.");
        return <Navigate to="/login" />;
    }

    let user;
    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        console.error("Error al parsear el usuario del sessionStorage:", error);
        return <Navigate to="/login" />;
    }

    const userRole = user.role?.name;

    // Validación de roles
    if (!userRole) {
        console.error("No se encontró el rol del usuario.");
        return <Navigate to="/login" />;
    }

    // Verificar si el rol del usuario está permitido
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.error("Acceso denegado. El usuario no tiene el rol adecuado.");
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}
