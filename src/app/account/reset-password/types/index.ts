export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
  }
  
  export interface ResetPasswordResponse {
    success: boolean;
    error?: string;
  }
  
  export interface PasswordStrength {
    score: number;
    color: string;
    text: string;
  }

 export interface PasswordFieldProps {
    field: any;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showStrength?: boolean;
    // Make onPasswordChange optional
    onPasswordChange?: (password: string) => void;
  }