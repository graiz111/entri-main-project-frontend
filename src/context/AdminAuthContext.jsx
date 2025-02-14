import { createContext, useContext, useState } from "react";

export const AdminAuthContext = createContext(); // Explicitly export it

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

