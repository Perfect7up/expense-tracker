// types/index.ts
export type User = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};