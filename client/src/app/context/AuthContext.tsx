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
const API_URI = "https://future-me.onrender.com/api/";
const TIMEOUT_MS = 15000; 

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const router = useRouter();

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      const response = await fetchWithTimeout(`${API_URI}token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      const initialToken = localStorage.getItem('access_token');
    
    if (!initialToken) {
      setState({ user: null, loading: false });
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
      return;
    }

    const fetchProfile = async (authToken: string) => {
      return fetchWithTimeout(`${API_URI}profile/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    };

    let response = await fetchProfile(initialToken);

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          response = await fetchProfile(newToken);
        } else {
          throw new Error('Authentication failed');
        }
      }

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

        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        if (window.location.pathname === '/login') {
          router.push('/');
        }
      } else {
        throw new Error('Profile fetch failed');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('userData');
      setState({ user: null, loading: false });
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    const cachedUserData = sessionStorage.getItem('userData');
    if (cachedUserData) {
      const userData = JSON.parse(cachedUserData);
      setState({ 
        user: {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName
        }, 
        loading: false 
      });
    }
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URI}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const data: AuthTokens = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        await checkAuth();
        return true;
      }
      
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URI}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          full_name: credentials.fullName 
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        router.push('/login');
        return true;
      }
      
      const errorData = await response.json();
      console.error('Registration failed:', errorData);
      return false;
    } catch (error) {
      console.error('Registration request failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('userData');
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