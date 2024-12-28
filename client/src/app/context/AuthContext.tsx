'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials,
  AuthContextType,
  AuthTokens 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setState({ user: null, loading: false });
        return;
      }

      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData: User = await response.json();
        setState({ 
          user: {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName  
          }, 
          loading: false 
        });
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setState({ user: null, loading: false });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const tokens: AuthTokens = await response.json();
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        await checkAuth();
        router.push('/');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          full_name: credentials.fullName 
        }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        console.log('Registered user:', userData);
        router.push('/login');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setState({ user: null, loading: false });
    router.push('/login');
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};