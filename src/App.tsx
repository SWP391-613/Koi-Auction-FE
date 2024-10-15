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
import { ThemeProvider } from "./contexts/ThemeContext";

// Components
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// Pages
import NotFound from "./components/error/NotFound";
import OtpVerification from "./components/otp/OtpVeficitaion";
import About from "./pages/about/About";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import Auctions from "./pages/auctions/Auctions";
import KoiBidding from "./pages/auctions/KoiBidding";
import Home from "./pages/home/Home";
import KoiDetail from "./pages/kois/KoiDetail";
import Login from "./pages/login/Login";
import Privacy from "./pages/privacy/Privacy";
import Register from "./pages/register/Register";
import Terms from "./pages/terms/Terms";

// Manager pages
import Manager from "./pages/manager/Manager";
import { AuctionsManagement } from "./pages/manager/auctions/AuctionsManagement";
import Settings from "./pages/manager/settings/Settings";

// Breeder pages

// Staff pages
import StaffLayout from "./pages/staff/Staff";

import UserDetail from "./pages/user/UserDetail";
import UserOrder from "./pages/user/UserOrder";
// Types
import AddKoiToAuction from "./pages/auctions/register/AddKoiToAuction";
import KoiRegisterAuctionDetail from "./pages/auctions/register/KoiRegisterAuctionDetail";
import BreederLayout from "./pages/manager/breeder/BreederLayout";
import BreederManagement from "./pages/manager/breeder/BreederManagement";
import KoiManagement from "./pages/manager/koi/KoiManagement";
import MemberManagement from "./pages/manager/member/MemberManagement";
import StaffManagement from "./pages/manager/staff/StaffManagement";
import VNPayReturn from "./pages/payments/VNPayReturn";

const TITLE = "Auction Koi";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
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
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route
                path="/auctionkois/:auctionId/:auctionKoiId"
                element={<KoiBidding />}
              />

              {/* Protected routes for logged-in users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/kois/:id" element={<KoiDetail />} />
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
                <Route path="/managers/*" element={<Manager />}></Route>
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
              </Route>
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
