export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface RefreshTokenResponse {
  token: string;
  secret: string;
}

export interface Claims {
  user_id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
}
