import React from "react";
import { Helmet } from "react-helmet";
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
import UserDetail from "./pages/detail/member/UserDetail";
import UserOrder from "./pages/detail/member/UserOrder";
import KoiDetail from "./pages/kois/KoiDetail";
import About from "./pages/static/About";
import Home from "./pages/static/Home";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";
// Types
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import InternalServerError from "./components/error/NotFound";
import BreederLayout from "./layouts/BreederLayout";
import StaffLayout from "./layouts/StaffLayout";
import Auctions from "./pages/auctions/Auctions";
import AddKoiToAuction from "./pages/auctions/register/AddKoiToAuction";
import KoiRegisterAuctionDetail from "./pages/auctions/register/KoiRegisterAuctionDetail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import Feedback from "./pages/detail/member/Feedback";
import UserOrderDetail from "./pages/detail/member/UserOrderDetail";
import VNPayReturn from "./pages/payments/VNPayReturn";
import BreederInfo from "./pages/static/BreederInfo";
import Kois from "./pages/kois/Kois";

const TITLE = "Auction Koi";

const theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex flex-col min-h-screen">
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/notfound" element={<NotFound />} />
              <Route
                path="/internal-server-error"
                element={<InternalServerError />}
              />
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route
                path="/auctionkois/:auctionId/:auctionKoiId"
                element={<KoiBidding />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/breeder/:id/info" element={<BreederInfo />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/kois" element={<Kois />} />
              <Route path="/kois/:id" element={<KoiDetail />} />

              {/* Protected routes for logged-in users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/users/:id" element={<UserDetail />} />
                <Route
                  path="/auctions/register"
                  element={<AddKoiToAuction />}
                />
                <Route
                  path="/auctions/register/:id"
                  element={<KoiRegisterAuctionDetail />}
                />
              </Route>

              {/* Manager and Staff protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/managers/*" element={<ManagerLayout />}></Route>
              </Route>

              {/* Breeder protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/breeders/*" element={<BreederLayout />}></Route>
              </Route>

              {/* Staff protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/staffs/*" element={<StaffLayout />}></Route>
              </Route>
              {/* Protected routes for USER */}
              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<UserOrder />} />
                <Route
                  path="/payments/vnpay-payment-return"
                  element={<VNPayReturn />}
                />
                <Route
                  path="/order-detail/:orderId"
                  element={<UserOrderDetail />}
                />
              </Route>
              <Route path="/feedback/:orderId" element={<Feedback />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;
