import { useContext } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../themeContext";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

function ThemeToggleSwitch() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={mode === "dark"}
            onChange={toggleTheme}
            color="primary"
          />
        }
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%", // ayuda a centrar vertical
            }}
          >
            {mode === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
          </Box>
        }
        sx={{
          margin: 0,
          "& .MuiSwitch-switchBase": {
            color: theme.palette.primary.highlight,
          },
        }}
      />
    </div>
  );
}

export default ThemeToggleSwitch;
