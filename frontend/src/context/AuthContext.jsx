import { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    console.log('[AuthContext] Mounting, checking localStorage...');
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      console.log('[AuthContext] Found existing session for user:', JSON.parse(savedUser).username);
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      console.log('[AuthContext] No existing session found.');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    console.log(`[AuthContext] Attempting login for username: ${username}`);
    const response = await loginApi(username, password);
    const { accessToken, user: userData } = response.data;

    console.log('[AuthContext] Login successful! Storing tokens.');
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    console.log('[AuthContext] Logging out. Clearing session.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isTeacher,
        isStudent,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
