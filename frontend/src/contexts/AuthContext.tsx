import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as AuthService from '../services/AuthService';

interface User {
  _id: string;
  email: string;
  fullName: string;
  nickName: string;
  group: 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser && token) {
      setUser(storedUser);
    }
  }, [token]);

  const login = async (credentials: any) => {
    try {
      const data = await AuthService.login(credentials);
      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
