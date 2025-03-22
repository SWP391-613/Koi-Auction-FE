import { Cloudinary } from "@cloudinary/url-gen";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React, { Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import first
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingComponent from "./components/shared/LoadingComponent";
import { AuthProvider } from "./contexts/AuthContext";
import { NavbarProvider } from "./contexts/NavbarContext";
import MainLayout from "./layouts/MainLayout";
import { theme } from "./styles/config";
import useRouteElements from "./useRouteElement";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // Thêm vào .env: VITE_CLOUDINARY_CLOUD_NAME=dbke1s5nm
  },
});

function AppContent() {
  const routeElements = useRouteElements();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on route change
  }, [location]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<LoadingComponent />}>
            <MainLayout>{routeElements}</MainLayout>
          </Suspense>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

function App() {
  return (
    <NavbarProvider>
      <AppContent />
      <ToastContainer />
    </NavbarProvider>
  );
}

export default App;
