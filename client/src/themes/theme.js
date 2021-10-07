import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  typography: {
    fontFamily: "Open Sans",
    fontSize: 14,
    body1: {
      fontFamily: "Montserrat",
      fontSize: 14
    },
    body2: {
      fontFamily: "Open Sans",
      fontSize: 40
    },

    button: {
      textTransform: "none",
      fontWeight: "bold",
      fontFamily: "Montserrat"
    }
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "800",
        paddingTop: "2rem",
        fontSize: "1rem",
        width: "36rem",
        marginTop: "1rem"
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: "1.25rem"
      },
      outlined: {
        "&$shrink": {
          shrink: false
        }
      }
    }
  },
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#B0B0B0" }
  }
});
