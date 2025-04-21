import { useContext } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../themeContext";
import { useTheme } from "@mui/material/styles";

function ThemeToggleSwitch() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={mode === "dark"}
          onChange={toggleTheme}
          color="primary"
        />
      }
      label={mode === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
      sx={{
        "& .MuiSwitch-switchBase": {
          color: theme.palette.primary.highlight,
        },
      }}
    />
  );
}

export default ThemeToggleSwitch;
