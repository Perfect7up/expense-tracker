export interface ForgotPasswordFormData {
    email: string;
  }
  
  export interface ResetPasswordResponse {
    success: boolean;
    error?: string;
  }