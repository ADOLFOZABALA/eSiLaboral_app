import { useEffect, useState } from 'react';
import api from '@/api/axios';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
}

export default function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user');
        const user: User = response.data.user;

        console.log('✅ Usuario obtenido del backend:', user);
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);

      } catch (error) {
        console.error('❌ Error al obtener usuario desde el backend (posible sesión expirada):', error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}
