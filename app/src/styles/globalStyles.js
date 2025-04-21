import { GlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function AppGlobalStyles() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        ".welcome-text": {
          opacity: 0.6,
          marginTop: theme.spacing(4),
          textAlign: "center",
        },
      }}
    />
  );
}
