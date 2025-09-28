// frontend/src/hooks/useCurrentUser.js
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mc_token');
    if (!token) { setLoadingUser(false); return; }

    api.get('/users/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  return { user, loadingUser };
}