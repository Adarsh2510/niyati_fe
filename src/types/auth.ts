export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  hashed_password: string;
  created_at: Date;
  updated_at: Date;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SessionType {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  expires: string;
}

export interface JWTType {
  id?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  iat: number;
  exp: number;
}

export interface AuthHeader {
  Authorization: string;
}
