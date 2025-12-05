import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type User = {
  username: string;
  role: 'guest' | 'expert';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (username: string, password: string) => {
    // мок проверка
    let role: 'guest' | 'expert' = 'guest';
    if (username === 'expert' && password === '1234') role = 'expert';
    else if (username === 'guest' && password === '1234') role = 'guest';
    else return false;

    const userData = { username, role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
