import { createMuiTheme } from "@material-ui/core/styles";
import { deepPurple, teal } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: deepPurple[500],
      dark: "#4A2787",
      contrastText: "#FFF",
    },
    secondary: {
      light: teal["A200"],
      main: teal["A200"],
      dark: teal["A400"],
    },
    background: {
      default: "#E9FFFA",
      paper: "#D3FFF5",
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
      lineHeight: "2.3rem",
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
      maxWidth: "400px",
      fontWeight: 600,
      fontSize: "1.1rem",
      lineHeight: "1.7rem",
      marginBottom: "16px",
    },
    body2: {
      maxWidth: "400px",
      fontSize: "0.9rem",
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
