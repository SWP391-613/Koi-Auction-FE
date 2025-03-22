import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.scss";
import { worker } from "./mocks/browser";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3, // limit retry attempts
    },
  },
});

async function enableMocking() {
  if (
    // process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    return worker.start({
      onUnhandledRequest: "bypass", // Don't warn about unhandled requests
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  );
});
