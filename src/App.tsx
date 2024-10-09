import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Auctions from "./pages/auctions/Auctions";
import Auction from "./pages/manager/auctions/AuctionsManagement";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Manager from "./pages/manager/Manager";
import MemberList from "./pages/manager/member/MemberList";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import KoiDetail from "./pages/kois/KoiDetail";
import koi_data from "./utils/data/koi_data.json";
import user_data from "./utils/data/user_data.json";
import KoiList from "./pages/manager/koi/KoiList";
import BreederList from "./pages/manager/breeder/BreederList";
import StaffList from "./pages/manager/staff/StaffList";
import Settings from "./pages/manager/settings/Settings";
import { ToastContainer } from "react-toastify";
import UserDetail from "./pages/userdetail/UserDetail";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Kois from "./pages/kois/Kois";
import NotFound from "./components/error/NotFound";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import { Analytics } from "@vercel/analytics/react";
import KoiBidding from "./pages/auctions/KoiBidding";
import OtpVerification from "./components/otp/OtpVeficitaion";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import Unauthorized from "./components/unauthorized/Unauthorized";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import BreederDetail from "./pages/breeder/BreederDetail";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/terms/Terms";
import StaffDetail from "./pages/staff/StaffDetail";
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
            <Route path="/staffs" element={<StaffDetail />}></Route>
          </Route>

          {/* Route for unauthorized access */}
          <Route path="/unauthorized" element={<Unauthorized />} />
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
