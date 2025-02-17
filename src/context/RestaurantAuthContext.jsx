import { createContext, useContext, useState, useEffect } from "react";

export const RestaurantAuthContext = createContext();

export const RestaurantAuthProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(
    JSON.parse(localStorage.getItem("restaurant")) || null
  );

  // Save data in localStorage when user logs in
  useEffect(() => {
    if (restaurant) {
      localStorage.setItem("restaurant", JSON.stringify(restaurant));
    } else {
      localStorage.removeItem("restaurant");
    }
  }, [restaurant]);

  return (
    <RestaurantAuthContext.Provider value={{ restaurant, setRestaurant }}>
      {children}
    </RestaurantAuthContext.Provider>
  );
};

export const useRestaurantAuth = () => useContext(RestaurantAuthContext);
