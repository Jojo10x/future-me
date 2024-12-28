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
  email: string;    
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;   
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