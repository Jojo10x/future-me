'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, EyeOff, Eye } from 'lucide-react';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials & RegisterCredentials>({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
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
        const loginData: LoginCredentials = {
          email: credentials.email,
          password: credentials.password,
        };
        success = await login(loginData);
        if (!success) setError('Invalid email or password');
      } else {
        const registerData: RegisterCredentials = {
          email: credentials.email,
          password: credentials.password,
          fullName: credentials.fullName,
        };
        success = await register(registerData);
        if (!success) setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center classit p-4">
      <div className="max-w-md w-full transform transition-all duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <h2 className="text-3xl font-bold text-white text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-blue-100 text-center mt-2">
              {isLogin ? 'Sign in to your account' : 'Start your journey with us'}
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
                  type={showPassword ? 'text' : 'password'}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
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
                  <span className="px-4 bg-white text-sm text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-6 text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional info footer */}
        {/* <div className="text-center mt-4 text-sm text-gray-600">
          By continuing, you agree to our
          <a href="#" className="text-blue-600 hover:text-blue-500 mx-1">Terms of Service</a>
          and
          <a href="#" className="text-blue-600 hover:text-blue-500 mx-1">Privacy Policy</a>
        </div> */}
      </div>
    </div>
  );
}