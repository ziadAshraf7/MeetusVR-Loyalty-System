export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}