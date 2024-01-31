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

export type AccountType = {
    userId: string;
    balance: number;
    active: boolean;
    beneficiaries: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type TransactionType = {
    _id: string;
    fromAccountId: string;
    amount: number;
    type: 'deposit' | 'withdraw' | 'transfer';
    balance: number;
    toAccountId?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
};
