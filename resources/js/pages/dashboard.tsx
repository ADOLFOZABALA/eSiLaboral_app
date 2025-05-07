import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      const roleName = user?.role?.name ?? null;

      if (roleName === 'admin') {
        navigate('/admin');
      } else if (roleName === 'user') {
        navigate('/usuario');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error parseando usuario:', err);
      navigate('/login');
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  return checking ? <div className="text-center p-5">Redireccionando...</div> : null;
}
