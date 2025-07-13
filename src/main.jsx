import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AppContext from "./context/AppContext";
import AppContextProvider from "./context/AppContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
