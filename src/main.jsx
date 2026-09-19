import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";

// Rota única: /admin abre o painel, qualquer outra coisa abre a loja.
// Não vale a pena trazer um roteador inteiro para duas telas.
const ehAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {ehAdmin ? (
      <AdminApp />
    ) : (
      <CartProvider>
        <App />
      </CartProvider>
    )}
  </React.StrictMode>
);
