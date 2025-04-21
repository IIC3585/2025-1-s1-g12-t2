import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import { ThemeProviderWrapper, ThemeContext } from "./themeContext";
import { AppGlobalStyles } from "./styles/globalStyles";

// Manejo de temas
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const themeName = savedTheme || (prefersDark ? "dark" : "light");
const theme = themeName === "dark" ? darkTheme : lightTheme;
const root = ReactDOM.createRoot(document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <AppGlobalStyles />
            <App />
          </ThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProviderWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
