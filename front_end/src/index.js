import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { store } from "./reducers/store";
import { Provider } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

function pxToRem(value) {
  return `${value / 16}rem`;
}

// Generate breakpoints so we can use them in the theme definition
const breakpoints = createBreakpoints({});
const theme = createMuiTheme({
  breakpoints,
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: pxToRem(27),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(35)
        }
      },
      h3: {
        fontSize: pxToRem(19),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(22)
        }
      },
      h4: {
        fontSize: pxToRem(17),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(20)
        }
      },
      body1: {
        fontSize: pxToRem(14),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(16)
        }
      },
      body2: {
        fontSize: pxToRem(14),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(16)
        }
      },
      button: {
        fontSize: pxToRem(14),
        [breakpoints.up("md")]: {
          fontSize: pxToRem(16)
        }
      }
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
