import React from "react";
import Routess from "./routes/Routess";
import { ThemeProvider } from "./context/ThemeContext";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
     

        <Routess />
        

  
    </ThemeProvider>
  );
}

export default App;
