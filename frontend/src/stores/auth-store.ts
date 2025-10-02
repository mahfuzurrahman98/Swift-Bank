import { create } from "zustand";
import type { AuthState, AuthUser } from "@/utils/interfaces/auth-interfaces";

// Create a simple auth store without persistence
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setUser: (user: AuthUser | null) =>
        set({
            user,
            isAuthenticated: !!user,
        }),

    setAccessToken: (token: string | null) =>
        set({
            accessToken: token,
        }),
}));
