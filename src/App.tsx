import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import NotFound from "./components/error/NotFound";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import OtpVerification from "./components/otp/OtpVeficitaion";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/about/About";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import Auctions from "./pages/auctions/Auctions";
import KoiBidding from "./pages/auctions/KoiBidding";
import BreederDetail from "./pages/breeder/BreederDetail";
import Home from "./pages/home/Home";
import KoiDetail from "./pages/kois/KoiDetail";
import Login from "./pages/login/Login";
import Manager from "./pages/manager/Manager";
import { AuctionsManagement } from "./pages/manager/auctions/AuctionsManagement";
import BreederList from "./pages/manager/breeder/BreederList";
import KoiList from "./pages/manager/koi/KoiList";
import MemberList from "./pages/manager/member/MemberList";
import Settings from "./pages/manager/settings/Settings";
import StaffList from "./pages/manager/staff/StaffList";
import Privacy from "./pages/privacy/Privacy";
import Register from "./pages/register/Register";
import StaffLayout from "./pages/staff/Staff";
import StaffDetail from "./pages/staff/detail/StaffDetail";
import SendNotifications from "./pages/staff/notifications/SendNotifications";
import Terms from "./pages/terms/Terms";
import UserDetail from "./pages/userdetail/UserDetail";
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
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          {/* privacy, terms */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route
            path="/auctionkois/:auctionId/:auctionKoiId"
            element={<KoiBidding />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/kois/:id" element={<KoiDetail />} />

          {/* Route required user is logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/users/:id" element={<UserDetail />} />
          </Route>

          {/* Protected routes for MANAGER and STAFF */}
          <Route
            element={
              <RoleBasedRoute
                allowedRoles={["ROLE_MANAGER" as Role, "ROLE_STAFF" as Role]}
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

          {/* Protected routes for BREEDER */}
          <Route
            element={<RoleBasedRoute allowedRoles={["ROLE_BREEDER" as Role]} />}
          >
            <Route path="/breeders" element={<BreederDetail />} />
            {/* Add more breeder-specific routes here */}
          </Route>

          <Route
            element={<RoleBasedRoute allowedRoles={["ROLE_STAFF" as Role]} />}
          >
            <Route path="/staffs" element={<StaffLayout />}>
              <Route path="" element={<StaffDetail />}></Route>
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
