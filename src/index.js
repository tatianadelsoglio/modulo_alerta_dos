import React from "react";
import ReactDOM from "react-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./scss/styles.scss";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import Client from "./config/apolloClientConfig";

ReactDOM.render(
  <ApolloProvider client={Client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
