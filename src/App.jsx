import React from "react";
import Routess from "./routes/Routess";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <>
        <Routess />

        {/* ✅ Ensure ToastContainer is placed inside the ThemeProvider */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </>
    </ThemeProvider>
  );
}

export default App;
