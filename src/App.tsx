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
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
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
import KoiList from "./pages/manager/koi/KoiManagement";
import Settings from "./pages/manager/settings/Settings";

// Breeder pages
import BreederDetail from "./pages/breeder/BreederDetail";

// Staff pages
import StaffLayout from "./pages/staff/Staff";
import StaffDetail from "./pages/staff/detail/StaffDetail";
import SendNotifications from "./pages/staff/notifications/SendNotifications";

import UserDetail from "./pages/user/UserDetail";
import UserOrder from "./pages/user/UserOrder";
// Types
import BreederManagement from "./pages/manager/breeder/BreederManagement";
import KoiManagement from "./pages/manager/koi/KoiManagement";
import MemberManagement from "./pages/manager/member/MemberManagement";
import StaffManagement from "./pages/manager/staff/StaffManagement";
import { Role } from "./types/roles.type";
import VNPayReturn from "./pages/payments/VNPayReturn";
import KoiEditDetail from "./pages/kois/KoiEditDetail";

const TITLE = "Auction Koi";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <Header />
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
          </Route>

          {/* Manager and Staff protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/managers" element={<Manager />}>
              <Route path="auctions" element={<AuctionsManagement />} />
              <Route path="member" element={<MemberManagement />} />
              <Route path="breeder" element={<BreederManagement />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="setting" element={<Settings />} />
              <Route path="koi" element={<KoiManagement />} />
              <Route path="koi-detail" element={<KoiDetail />} />
            </Route>
          </Route>

          {/* Breeder protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/breeders" element={<BreederDetail />} />
            <Route
              path="/payments/vnpay-payment-return"
              element={<VNPayReturn />}
            />
            <Route path="/kois/:id/edit" element={<KoiEditDetail />} />
          </Route>

          {/* Staff protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/staffs" element={<StaffLayout />}>
              <Route path="" element={<StaffDetail />} />
              <Route path="auctions" element={<AuctionsManagement />} />
              <Route path="kois" element={<KoiList />} />
              <Route
                path="send-notifications"
                element={<SendNotifications />}
              />
            </Route>
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
        <Footer />
        <ToastContainer />
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;
