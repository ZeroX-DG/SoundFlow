import "../styles/style.scss";
import "@mdi/font/css/materialdesignicons.min.css";
import * as React from "react";
import { render } from "react-dom";
import { App } from "./app";

render(React.createElement(App), document.getElementById("root"));
