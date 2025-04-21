import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5863cc",
      contrastText: "#ffffff",
      highlight: "#33373A",
      highlightText: "#ffffff",
      info: "#5863cc",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f5f5f5",
      contrastText: "#33373A",
      highlight: "#5863cc",
      highlightText: "#f5f5f5",
      info: "#5863cc",
    },
    background: {
      default: "#222222",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#cccccc",
    },
  },
});
