import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MuiThemeProvider } from "@material-ui/core/styles";
import * as serviceWorker from "./serviceWorker";
import theme from "./theme";
import { Router } from "react-router-dom";
import history from "./history";

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Router history={history}>
        <App />
      </Router>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
