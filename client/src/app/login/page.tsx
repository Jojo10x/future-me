'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, EyeOff, Eye } from 'lucide-react';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'authenticating' | 'processing'>('idle');
  const [credentials, setCredentials] = useState<LoginCredentials & RegisterCredentials>({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setCredentials(prev => ({
        ...prev,
        email: savedEmail,
        password: savedPassword
      }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    setCredentials({ email: '', password: '', fullName: '' });
    setError('');
    setShowPassword(false);
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      let success;
      if (isLogin) {
        setLoadingState('authenticating');
        const loginData: LoginCredentials = {
          email: credentials.email,
          password: credentials.password,
        };
        success = await login(loginData);
        
        if (success && rememberMe) {
          localStorage.setItem('rememberedEmail', credentials.email);
          localStorage.setItem('rememberedPassword', credentials.password);
        } else if (!rememberMe) {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        
        if (!success) 
          setError('Invalid email or password');
        
      } else {
        setLoadingState('processing');
        const registerData: RegisterCredentials = {
          email: credentials.email,
          password: credentials.password,
          fullName: credentials.fullName,
        };
        const success = await register(registerData);
        if (success) {
          // Instead of auto-login, redirect to login page
          setIsLogin(true);
          setCredentials(prev => ({
            ...prev,
            password: '' // Clear password for security
          }));
          // Optional: Show success message
          setError('Registration successful! Please login.');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    }catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingState('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: value
    }));
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full transform transition-all duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 border-2 border-emerald-200 p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-white text-center tracking-wide antialiased drop-shadow-sm">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-back text-center mt-2 font-medium tracking-wide antialiased opacity-90">
              {isLogin
                ? "Sign in to your account"
                : "Start your journey with us"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8 pt-6">
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required={!isLogin}
                    placeholder="Full Name"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={credentials.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={credentials.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-sm text-xl font-bold text-white bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 border-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans tracking-wide antialiased hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                    <span className="text-sm font-normal ml-1">
                      {loadingState === "authenticating"
                        ? "Authenticating..."
                        : "Processing..."}
                    </span>
                  </>
                ) : (
                  <span className="drop-shadow-sm">
                    {isLogin ? "Sign in" : "Create account"}
                  </span>
                )}
              </button>
            </form>

            {/* Toggle Section */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    or
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-6 text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                {isLogin
                  ? "Don't have an account? Register here"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}