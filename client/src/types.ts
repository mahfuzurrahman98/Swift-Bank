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
