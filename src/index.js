import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { BrowserRouter as Router } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeSelection";
import { UserProvider } from "./contexts/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <ScrollToTop />
          <App />
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  </HashRouter>
);
