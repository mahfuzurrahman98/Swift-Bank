import { create } from 'zustand';

interface PasswordResetState {
    email: string | null;
    token: string | null;
    otp: string | null;
    
    // Actions
    setEmail: (email: string) => void;
    setToken: (token: string) => void;
    setOtp: (otp: string) => void;
    clearStore: () => void;
}

export const usePasswordResetStore = create<PasswordResetState>()((set) => ({
    email: null,
    token: null,
    otp: null,
    
    setEmail: (email: string) => set({ email }),
    setToken: (token: string) => set({ token }),
    setOtp: (otp: string) => set({ otp }),
    clearStore: () => set({ email: null, token: null, otp: null }),
}));