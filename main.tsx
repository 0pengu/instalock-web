import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import QueryProvider from "./src/lib/client/query";
import Router from "./src/lib/client/router";
const Notifications = lazy(() =>
  import("@mantine/notifications").then((mod) => ({
    default: mod.Notifications,
  }))
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <QueryProvider>
        <Notifications />
        <Router />
      </QueryProvider>
    </MantineProvider>
  </StrictMode>
);
