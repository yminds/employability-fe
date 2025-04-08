import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

// Ensure the root element exists
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
);
