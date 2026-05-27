import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { Toaster } from "./components/ui/sonner.tsx";
import { MemoryRouter } from "react-router-dom";
const queryClient = new QueryClient()
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
       <MemoryRouter initialEntries={["/login"]}>
      <ThemeProvider>
        <App />
    <Toaster />
      </ThemeProvider>    </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>,
);
