import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeSelection";
import { UserProvider } from "./contexts/UserContext";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <UserProvider>
      <ThemeProvider>
        <UserSettingsProvider>
          <ScrollToTop />
          <App />
        </UserSettingsProvider>
      </ThemeProvider>
    </UserProvider>
  </HashRouter>
);
