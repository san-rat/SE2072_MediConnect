// frontend/src/hooks/useCurrentUser.js
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mc_token');
    
    if (!token) { 
      setUser(null);
      setLoadingUser(false); 
      return; 
    }

    setLoadingUser(true);

    // Get user data and role
    Promise.all([
      api.get('/api/users/me'),
      // Get role from localStorage (set during login)
      Promise.resolve({ data: { role: localStorage.getItem('mc_role') } })
    ])
    .then(([userRes, roleRes]) => {
      const userData = userRes.data;
      const role = roleRes.data.role;
      
      // Add role to user object
      setUser({
        ...userData,
        role: role
      });
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      setUser(null);
    })
    .finally(() => setLoadingUser(false));
  }, []);

  return { user, loadingUser };
}