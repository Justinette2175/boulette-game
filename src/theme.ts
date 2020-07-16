import { createMuiTheme } from "@material-ui/core/styles";
import {
  deepOrange,
  deepPurple,
  yellow,
  grey,
  cyan,
  amber,
} from "@material-ui/core/colors";

export const PALETTE_PURPLE = "#8500FF";
export const PALETTE_AQUA = "#00EDB5";
export const PALETTE_ORANGE = "#FF4500";
export const PALETTE_PURPLE_DARK = "#220075";
export const GRADIENT_AQUA = `linear-gradient(${PALETTE_PURPLE},${PALETTE_AQUA})`;
export const GRADIENT_ORANGE = `linear-gradient(${PALETTE_PURPLE},${PALETTE_ORANGE})`;
export const NEON_PINK = "#fe019a";
export const NEON_YELLOW = "#FCFF00";
export const NEON_GREEN = "#39FF14";

export default createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: deepPurple[500],
      dark: "#4A2787",
      contrastText: "#FFF",
    },
    secondary: {
      dark: deepOrange[100],
      main: deepOrange[50],
    },
    background: {
      default: deepOrange[50],
      paper: "#FFF5F4",
    },
    grey: {
      50: "#F7F7F5",
      100: "#F7F7F5",
      200: "#E8E8E8",
      300: "#C6C7C8",
      400: "#696969",
      500: "#414140",
      600: "#3D3D3D",
      700: "#242424",
      800: "#000000",
      900: "#000000",
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        fontSize: "0.8rem",
        transform: "translate(0)",
      },
      shrink: {
        transform: "translate(0)",
      },
    },
  },
  typography: {
    fontFamily: ["Quicksand", "sans-serif"].join(","),
    fontWeightBold: 700,
    fontWeightRegular: 600,
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      marginBottom: "24px",
    },
    h2: {
      maxWidth: "400px",
      fontWeight: 700,
      fontSize: "1.6rem",
      marginBottom: "18px",
    },
    h3: {
      fontSize: "1.3rem",
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: "1.6rem",
    },
    body1: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.6rem",
      maxWidth: "400px",
      marginBottom: "8px",
    },
    body2: {
      fontSize: "0.9rem",
      maxWidth: "400px",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 700,
    },
    caption: {
      lineHeight: "0.9rem",
      fontSize: "0.8rem",
      color: "#696969",
    },
  },
});
