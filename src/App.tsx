import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // import first
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS once

// Vercel integrations
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Components
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// Pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/terms/Terms";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./components/error/NotFound";
import OtpVerification from "./components/otp/OtpVeficitaion";
import Auctions from "./pages/auctions/Auctions";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import KoiBidding from "./pages/auctions/KoiBidding";
import KoiDetail from "./pages/kois/KoiDetail";
import UserDetail from "./pages/userdetail/UserDetail";

// Manager pages
import Manager from "./pages/manager/Manager";
import BreederList from "./pages/manager/breeder/BreederList";
import KoiList from "./pages/manager/koi/KoiList";
import MemberList from "./pages/manager/member/MemberList";
import Settings from "./pages/manager/settings/Settings";
import StaffList from "./pages/manager/staff/StaffList";
import { AuctionsManagement } from "./pages/manager/auctions/AuctionsManagement";

// Breeder pages
import BreederDetail from "./pages/breeder/BreederDetail";

// Staff pages
import StaffLayout from "./pages/staff/Staff";
import StaffDetail from "./pages/staff/detail/StaffDetail";
import SendNotifications from "./pages/staff/notifications/SendNotifications";

// Types
import { Role } from "./types/roles.type";

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
          <Route path="/kois/:id" element={<KoiDetail />} />

          {/* Protected routes for logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/users/:id" element={<UserDetail />} />
          </Route>

          {/* Manager and Staff protected routes */}
          <Route
            element={
              <RoleBasedRoute
                allowedRoles={["ROLE_MANAGER", "ROLE_STAFF"] as Role[]}
              />
            }
          >
            <Route path="/managers" element={<Manager />}>
              <Route path="auctions" element={<AuctionsManagement />} />
              <Route path="member" element={<MemberList />} />
              <Route path="breeder" element={<BreederList />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="setting" element={<Settings />} />
              <Route path="koi" element={<KoiList />} />
              <Route path="koi-detail" element={<KoiDetail />} />
            </Route>
          </Route>

          {/* Breeder protected routes */}
          <Route
            element={
              <RoleBasedRoute allowedRoles={["ROLE_BREEDER"] as Role[]} />
            }
          >
            <Route path="/breeders" element={<BreederDetail />} />
          </Route>

          {/* Staff protected routes */}
          <Route
            element={<RoleBasedRoute allowedRoles={["ROLE_STAFF"] as Role[]} />}
          >
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
