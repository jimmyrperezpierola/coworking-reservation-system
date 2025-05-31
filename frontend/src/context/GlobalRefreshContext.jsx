// context/GlobalRefreshContext.js
import { createContext, useState, useCallback } from 'react';


export const GlobalRefreshContext = createContext();

export const GlobalRefreshProvider = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(Date.now());

  const triggerGlobalRefresh = useCallback(() => {
    setRefreshToken(Date.now());
  }, []);

  return (
    <GlobalRefreshContext.Provider value={{ refreshToken, triggerGlobalRefresh }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};

