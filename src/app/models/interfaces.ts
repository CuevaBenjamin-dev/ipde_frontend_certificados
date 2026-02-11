/**
 * Contrato base de respuesta del backend.
 * Debe coincidir con ApiResponse<T> (backend).
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: any | null;
}

/**
 * Contrato de solicitud de login.
 */
export interface LoginRequest {
  usuario: string;
  password: string;
}

/**
 * Tokens de autenticación.
 * Debe coincidir con AuthTokensResponse (backend).
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

