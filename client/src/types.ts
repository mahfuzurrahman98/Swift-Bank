export type AuthContextType = {
    auth: {
        token: string;
    };
    setAuth: (auth: { token: string }) => void;
};

export type RouteType = {
    path: string;
    element: () => JSX.Element;
    _protected: number; // {-1: public, 0: shouldBeLoggedOut, 1: shouldBeLoggedIn}
};

export type errorType = {
    code: number;
    message: string;
    description: string;
};

export type statusType = {
    loading: boolean;
    error: null | number;
};

export type BeneficiaryType = {
    _id: string;
    name: string;
};

export type AccountType = {
    _id: string;
    userId: string;
    balance: number;
    active: boolean;
    beneficiaries?: BeneficiaryType[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type TransactionType = {
    _id: string;
    type: 'deposit' | 'withdraw' | 'transfered in' | 'transfered out';
    amount: number;
    balance: number;
    particular: string;
    createdAt: string;
};
