export interface LoginCredentials {
  email: string;
  password: string;
  isEmployee : boolean , 
  orgId : Number
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  token: string;
  orgId:number;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}