import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./components/context/AuthContext.jsx";
import { BrowserRouter, Routes } from "react-router-dom";
import { CartContextProvider } from "./components/context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <CartContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
