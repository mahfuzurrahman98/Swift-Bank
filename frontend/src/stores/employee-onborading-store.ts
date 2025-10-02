import { create } from "zustand";
import type { Inviter } from "@/utils/interfaces/employee-interfaces";

export interface EmployeeState {
    inviteeEmail: string;
    token: string;
    inviter: Inviter;
    setInviteeEmail: (email: string) => void;
    setToken: (token: string) => void;
    setInviter: (inviter: Inviter) => void;
    reset: () => void;
}

export const useEmployeeOnboradingStore = create<EmployeeState>((set) => ({
    inviteeEmail: "",
    token: "",
    inviter: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        company: {
            id: "",
            name: "",
            slug: "",
        },
    },
    setInviteeEmail: (email: string) => set({ inviteeEmail: email }),
    setToken: (token: string) => set({ token }),
    setInviter: (inviter: Inviter) => set({ inviter }),
    reset: () =>
        set({
            inviteeEmail: "",
            token: "",
            inviter: {
                id: "",
                firstName: "",
                lastName: "",
                email: "",
                company: { id: "", name: "", slug: "" },
            },
        }),
}));
