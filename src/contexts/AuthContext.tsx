import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, LoginCredentials } from '@/types/auth';
import { api } from '@/lib/utils';
import { nasnavApi, yeshteryApi } from '@/lib/utils';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, token });
      } catch (error) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, role: 'admin' | 'user') => {
    setIsLoading(true);
    try {
      
      const mockUser: any = {
        email:credentials.email,
        password:credentials.password,
        orgId:credentials.orgId,
        isEmployee: credentials.isEmployee,
        role : role
    }

      const res = await api.post(yeshteryApi + 'yeshtery/token' , mockUser)
      const token = await res.data

      localStorage.setItem('userToken', token.token);
      localStorage.setItem('userData', JSON.stringify({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role , 
        orgId : credentials.orgId,
        token : token.token 
      }));
      mockUser.token = token?.token
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};