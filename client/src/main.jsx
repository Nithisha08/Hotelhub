import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")).render(
 <StrictMode>
  <HelmetProvider>
    <MantineProvider>
      <Notifications />
      <Provider store={store}>
        <App />
      </Provider>
    </MantineProvider>
  </HelmetProvider>
</StrictMode>
);