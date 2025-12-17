import { SignupSchema } from "../schema/schema";

export interface SignupFormData extends SignupSchema {
  agreeToTerms: boolean;
}

export interface SignupResponse {
  success: boolean;
  requiresConfirmation: boolean;
  user?: any;
  error?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  }
  
  export interface AuthResponse {
    user: any;
    session: any;
    error?: string;
  }
  
  export interface AuthState {
    isLoading: boolean;
    isGoogleLoading: boolean;
    error: string | null;
  }
  
  export interface AuthStore extends AuthState {
    setLoading: (isLoading: boolean) => void;
    setGoogleLoading: (isGoogleLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  }