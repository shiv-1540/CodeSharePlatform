import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import './tailwind.css';

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
);
