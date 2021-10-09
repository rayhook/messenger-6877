import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#8c8c8c" },
    bright: { main: "#ffffff" }
  },
  typography: {
    fontFamily: "Open Sans",
    fontSize: 16,
    h3: {
      fontSize: "2.5rem",
      "@media (max-width:900px)": {
        fontSize: "1.5rem"
      },
      fontWeight: 800
    },
    h4: {
      fontSize: "2.2rem",
      color: "#ffffff",
      fontWeight: 200
    },
    button: {
      fontFamily: "Montserrat",
      fontWeight: 900,
      fontSize: "1.4rem",
      "@media (max-width:900px)": {
        fontSize: "1rem"
      },
      lineHeight: 2.22,
      textTransform: "none"
    }
  },
  spacing: 4,
  overrides: {
    MuiInput: {
      input: {
        fontSize: "1.25rem",
        "@media (max-width:900px)": {
          fontSize: "1rem",
          width: "18rem"
        },
        fontWeight: "800",
        paddingTop: "2rem",
        width: "28rem",
        height: "1rem",
        marginTop: "1rem"
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: "1.25rem",
        "@media (max-width:900px)": {
          fontSize: "0.85rem"
        }
      }
    }
  }
});
