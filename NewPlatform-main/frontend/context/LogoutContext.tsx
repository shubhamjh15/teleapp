/**
 * Logout Context
 *
 * Provides a global logout callback so any screen/component
 * (e.g. ClinicianSidebar) can trigger logout without prop drilling.
 */

import React, { createContext, useContext } from 'react';

type LogoutContextType = {
  logout: () => void;
};

const LogoutContext = createContext<LogoutContextType>({ logout: () => {} });

export const LogoutProvider: React.FC<{ onLogout: () => void; children: React.ReactNode }> = ({
  onLogout,
  children,
}) => (
  <LogoutContext.Provider value={{ logout: onLogout }}>
    {children}
  </LogoutContext.Provider>
);

export const useLogout = () => useContext(LogoutContext);

export default LogoutContext;
