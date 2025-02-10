import React from "react";
import Routess from "./routes/Routess";
import { ThemeProvider } from "./context/ThemeContext";


function App() {
  return (
    <ThemeProvider>
      <Routess />
    </ThemeProvider>
)
}

export default App;
