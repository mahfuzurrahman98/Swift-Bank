import { FC, ReactNode, createContext, useState } from 'react';

import { AuthContextType } from '../types';

const initialAuthState = {
  token: ''
};

export const AuthContext = createContext<AuthContextType>({
  auth: initialAuthState,
  setAuth: (newAuthState: {
    token: string;
  }) => {
    console.log(newAuthState);
  },
});

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState(initialAuthState);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
