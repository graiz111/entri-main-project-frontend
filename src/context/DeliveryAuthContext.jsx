import { createContext, useContext, useState } from "react";

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [delivery, setDelivery] = useState(null);

  return (
    <DeliveryAuthContext.Provider value={{ delivery, setDelivery }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};

export const useDeliveryAuth = () => useContext(DeliveryAuthContext);
