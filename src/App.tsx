import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import first

// Vercel integrations
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

// Pages
import NotFound from "./components/error/NotFound";
import OtpVerification from "./components/otp/OtpVeficitaion";
import ManagerLayout from "./layouts/ManagerLayout";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import KoiBidding from "./pages/auctions/KoiBidding";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import KoiDetail from "./pages/kois/KoiDetail";
import About from "./pages/static/About";
import Home from "./pages/static/Home";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";
// Types
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import InternalServerError from "./components/error/InternalServerError";
import BreederLayout from "./layouts/BreederLayout";
import MemberLayout from "./layouts/MemberLayout";
import OrderLayout from "./layouts/OrderLayout";
import PaymentLayout from "./layouts/PaymentLayout";
import StaffLayout from "./layouts/StaffLayout";
import Auctions from "./pages/auctions/Auctions";
import AddKoiToAuction from "./pages/auctions/register/AddKoiToAuction";
import KoiRegisterAuctionDetail from "./pages/auctions/register/KoiRegisterAuctionDetail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import Feedback from "./pages/detail/member/Feedback";
import UserOrderDetail from "./pages/detail/member/UserOrderDetail";
import Kois from "./pages/kois/Kois";
import VNPayReturn from "./pages/payments/VNPayReturn";
import BreederInfo from "./pages/static/BreederInfo";
import PageTransition from "./components/shared/PageTransition";

const TITLE = "Auction Koi";

const theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-grow">
              <Header />
              <main className="flex-1 ml-64 p-8">
                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <PageTransition>
                        <About />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <PageTransition>
                        <Privacy />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <PageTransition>
                        <Terms />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PageTransition>
                        <Login />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PageTransition>
                        <Register />
                      </PageTransition>
                    }
                  />
                  <Route path="/notfound" element={<NotFound />} />
                  <Route
                    path="/internal-server-error"
                    element={<InternalServerError />}
                  />
                  <Route
                    path="/otp-verification"
                    element={
                      <PageTransition>
                        <OtpVerification />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/auctions"
                    element={
                      <PageTransition>
                        <Auctions />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/auctions/:id"
                    element={
                      <PageTransition>
                        <AuctionDetail />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/auctionkois/:auctionId/:auctionKoiId"
                    element={
                      <PageTransition>
                        <KoiBidding />
                      </PageTransition>
                    }
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/breeder/:id/info"
                    element={
                      <PageTransition>
                        <BreederInfo />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/blog"
                    element={
                      <PageTransition>
                        <BlogList />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/blog/:id"
                    element={
                      <PageTransition>
                        <BlogPost />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/kois"
                    element={
                      <PageTransition>
                        <Kois />
                      </PageTransition>
                    }
                  />

                  {/* Protected routes for logged-in users */}
                  <Route element={<ProtectedRoute />}>
                    <Route
                      path="/auctions/register"
                      element={<AddKoiToAuction />}
                    />
                    <Route
                      path="/auctions/register/:id"
                      element={<KoiRegisterAuctionDetail />}
                    />
                    <Route
                      path="/kois/:id"
                      element={
                        <PageTransition>
                          <KoiDetail />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/users/*"
                      element={
                        <PageTransition>
                          <MemberLayout />
                        </PageTransition>
                      }
                    ></Route>
                    <Route
                      path="/managers/*"
                      element={
                        <PageTransition>
                          <ManagerLayout />
                        </PageTransition>
                      }
                    ></Route>
                    <Route
                      path="/breeders/*"
                      element={
                        <PageTransition>
                          <BreederLayout />
                        </PageTransition>
                      }
                    ></Route>
                    <Route
                      path="/staffs/*"
                      element={
                        <PageTransition>
                          <StaffLayout />
                        </PageTransition>
                      }
                    ></Route>
                    <Route
                      path="/orders/*"
                      element={
                        <PageTransition>
                          <OrderLayout />
                        </PageTransition>
                      }
                    />
                    <Route path="/payments/*" element={<PaymentLayout />} />
                    <Route
                      path="/order-detail/:id"
                      element={
                        <PageTransition>
                          <UserOrderDetail />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/payments/vnpay-payment-return"
                      element={
                        <PageTransition>
                          <VNPayReturn />
                        </PageTransition>
                      }
                    />
                    <Route path="/feedback/:orderId" element={<Feedback />} />
                  </Route>
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
          <ToastContainer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
