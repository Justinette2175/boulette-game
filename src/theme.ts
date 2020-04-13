import { createMuiTheme } from "@material-ui/core/styles";

export const PALETTE_PURPLE = "#8500FF";
export const PALETTE_AQUA = "#00EDB5";
export const PALETTE_ORANGE = "#FF4500";
export const GRADIENT_AQUA = `linear-gradient(${PALETTE_PURPLE},${PALETTE_AQUA})`;
export const GRADIENT_ORANGE = `linear-gradient(${PALETTE_PURPLE},${PALETTE_ORANGE})`;

export default createMuiTheme({
  palette: {
    type: "light",
    text: {
      primary: "rgba(0, 0, 0, 0.75)",
      secondary: "rgba(0, 0, 0, 0.45)",
    },
    primary: {
      main: "#8500FF",
    },
    secondary: {
      main: "#FF8D00",
    },
    background: {
      default: "#F7F7F5",
      paper: "rgba(255, 255, 255, 0.9)",
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
    divider: "#000000",
  },
  shape: {
    borderRadius: 0,
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
  overrides: {
    MuiButton: { root: { borderRadius: 0 } },
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
    h1: {
      fontWeight: 700,
      fontSize: "2rem",
      marginBottom: "15px",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.7rem",
      marginBottom: "15px",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.4rem",
      marginBottom: "20px",
    },
    h4: {
      fontSize: "1.3rem",
    },
    body1: {
      fontSize: "1rem",
      maxWidth: "400px",
    },
    body2: {
      fontSize: "0.9rem",
      maxWidth: "400px",
    },
    button: {
      fontSize: "1rem",
      textTransform: "uppercase",
      letterSpacing: "0.06rem",
    },
    caption: {
      lineHeight: "0.9rem",
      fontSize: "0.8rem",
      color: "#696969",
    },
  },
});
