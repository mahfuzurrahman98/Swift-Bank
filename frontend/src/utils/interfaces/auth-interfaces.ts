export interface AuthUser {
    _id: string;
    email: string;
    name: string;
    role: string;
    status: string;
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: AuthUser | null) => void;
    setAccessToken: (token: string | null) => void;
}

export interface SigninResponse {
    accessToken: string;
    user: AuthUser;
}

export interface SignupResponse {
    accessToken: string;
    user: AuthUser;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface ForgotPasswordResponse {
    token: string;
}
