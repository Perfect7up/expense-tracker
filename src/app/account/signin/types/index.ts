export interface SigninFormData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: any;
    session: any;
    error?: string;
  }
  
  export interface SigninState {
    isLoading: boolean;
    isGoogleLoading: boolean;
    error: string | null;
  }
  
  export interface SigninStore extends SigninState {
    setLoading: (isLoading: boolean) => void;
    setGoogleLoading: (isGoogleLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  }