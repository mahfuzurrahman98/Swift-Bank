import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = "individual" | "company";

interface OnboardingState {
    // Basic auth data
    email: string;
    token: string;

    // User type selection
    userType: UserType | null;

    // Individual user data
    firstName: string;
    lastName: string;

    // Company data
    companyName: string;
    slug: string;
    location: string;
    country: string;
    website: string;

    // Current step
    currentStep: number;

    // Actions
    setEmail: (email: string) => void;
    setToken: (token: string) => void;
    setUserType: (userType: UserType) => void;
    setIndividualData: (data: { firstName: string; lastName: string }) => void;
    setCompanyData: (data: {
        companyName: string;
        slug: string;
        location: string;
        country: string;
        website?: string;
    }) => void;
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
}

const initialState = {
    email: "",
    token: "",
    userType: null,
    firstName: "",
    lastName: "",
    companyName: "",
    slug: "",
    location: "",
    country: "",
    website: "",
    currentStep: 1,
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            ...initialState,
            setEmail: (email: string) => set({ email }),
            setToken: (token: string) => set({ token }),
            setUserType: (userType: UserType) => set({ userType }),
            setIndividualData: (data) =>
                set({
                    firstName: data.firstName,
                    lastName: data.lastName,
                }),
            setCompanyData: (data) =>
                set({
                    companyName: data.companyName,
                    slug: data.slug,
                    location: data.location,
                    country: data.country,
                    website: data.website || "",
                }),
            setCurrentStep: (step: number) => set({ currentStep: step }),
            nextStep: () => set({ currentStep: get().currentStep + 1 }),
            prevStep: () =>
                set({ currentStep: Math.max(1, get().currentStep - 1) }),
            reset: () => set(initialState),
        }),
        {
            name: "onboarding-storage",
        }
    )
);
