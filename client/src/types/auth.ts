export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;      // Changed from username to email to match backend
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;   // Changed to match backend's full_name
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}