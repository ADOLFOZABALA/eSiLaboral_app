import { useState, FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SplitLayout from '@/layouts/auth/auth-split-layout';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/api/login', { email, password });

            const token = response.data.token;
            const user = response.data.user;

            if (!token || !user) {
                alert('Error: Token o datos de usuario no disponibles.');
                return;
            }

            const roleName = user?.role?.name ?? null;

            if (!roleName) {
                alert('Error: El usuario no tiene rol asignado.');
                return;
            }

            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(user));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            console.log('✅ Usuario autenticado:', user);

            // Redirigir por rol
            switch (roleName) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'user':
                    navigate('/usuario');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } catch (error: any) {
            console.error('❌ Error al iniciar sesión:', error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else if (error.response?.status === 401) {
                setErrors({ email: 'Credenciales inválidas' });
            } else {
                alert('Error inesperado al iniciar sesión');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SplitLayout>
            <form className="w-100" onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        autoFocus
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? '🦜' : '👀'}
                        </button>
                    </div>
                    {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                </div>

                <div className="form-check mb-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                    />
                    <label className="form-check-label" htmlFor="remember">
                        Recordarme
                    </label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                    Iniciar sesión
                </button>
            </form>
        </SplitLayout>
    );
}
