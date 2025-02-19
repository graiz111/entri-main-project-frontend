import React from "react";
import Routess from "./routes/Routess";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from './context/CartContext';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>

        <Routess />
        
      </CartProvider>
  
    </ThemeProvider>
  );
}

export default App;
