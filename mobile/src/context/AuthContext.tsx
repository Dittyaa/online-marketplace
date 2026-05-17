import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import { User, AuthContextType, LoginCredentials } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('mk_token'),
        AsyncStorage.getItem('mk_user'),
      ]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupt storage — start fresh
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ username, password }: LoginCredentials) => {
    const response = await authApi.login(username, password);
    const userData: User = response.data;
    await Promise.all([
      AsyncStorage.setItem('mk_token', userData.token),
      AsyncStorage.setItem('mk_user', JSON.stringify(userData)),
    ]);
    setToken(userData.token);
    setUser(userData);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem('mk_token'),
      AsyncStorage.removeItem('mk_user'),
    ]);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
